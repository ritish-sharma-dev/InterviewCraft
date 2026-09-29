import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../auth/useAuth";
import {
  useEndSession,
  useSelectQuestion,
  useSessionById,
  useUpdateCandidateCode,
} from "../hooks/useSessions";
import { PROBLEMS } from "../data/problems";
import { executeCode } from "../lib/piston";
import { Group, Panel, Separator } from "react-resizable-panels";
import { getDifficultyBadgeClass } from "../lib/utils";
import { CopyIcon, ListChecksIcon, Loader2Icon, LogOutIcon, PhoneOffIcon } from "lucide-react";
import toast from "react-hot-toast";
import CodeEditorPanel from "../components/CodeEditorPanel";
import OutputPanel from "../components/OutputPanel";
import JoinSessionModal from "../components/JoinSessionModal";
import InterviewQuestionPicker from "../components/InterviewQuestionPicker";

import useStreamClient from "../hooks/useStreamClient";
import { StreamCall, StreamVideo } from "@stream-io/video-react-sdk";
import VideoCallUI from "../components/VideoCallUI";
import "../styles/components.css";

function SessionPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [output, setOutput] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isQuestionPickerOpen, setIsQuestionPickerOpen] = useState(false);

  const { data: sessionData, isLoading: loadingSession, refetch } = useSessionById(id);

  const endSessionMutation = useEndSession();
  const selectQuestionMutation = useSelectQuestion();
  const { mutate: saveCandidateCode } = useUpdateCandidateCode();
  const codeVersionRef = useRef(0);
  const [joinCode] = useState(
    () => location.state?.joinCode ||
      new URLSearchParams(location.hash.slice(1)).get("joinCode") ||
      sessionStorage.getItem(`session-join-code:${id}`) || "",
  );

  const session = sessionData?.session;
  const isHost = session?.host?._id === user?._id;
  const isParticipant = session?.participant?._id === user?._id;

  const { call, channel, chatClient, isInitializingCall, streamClient } = useStreamClient(
    session,
    loadingSession,
    isHost,
    isParticipant
  );

  // find the problem data based on session problem title
  const activeQuestionId = session?.activeQuestionId ||
    Object.values(PROBLEMS).find((p) => p.title === session?.problem)?.id;
  const problemData = activeQuestionId
    ? PROBLEMS[activeQuestionId]
    : null;
  const askedQuestionIds = session?.askedQuestionIds || [];

  useEffect(() => {
    if (!channel) return undefined;

    const subscription = channel.on("question.updated", (event) => {
      const revision = event.questionRevision || 0;
      queryClient.setQueryData(["session", id], (currentData) => {
        if (!currentData?.session || revision < (currentData.session.questionRevision || 0)) {
          return currentData;
        }

        return {
          ...currentData,
          session: {
            ...currentData.session,
            activeQuestionId: event.questionId,
            problem: event.problem,
            difficulty: event.difficulty,
            askedQuestionIds: event.askedQuestionIds || currentData.session.askedQuestionIds,
            questionRevision: revision,
            candidateCode: event.candidateCode || "",
            candidateLanguage: event.candidateLanguage || "javascript",
            candidateCodeVersion: event.candidateCodeVersion || 0,
          },
        };
      });
    });

    const codeSubscription = channel.on("candidate.code.updated", (event) => {
      const currentSession = queryClient.getQueryData(["session", id])?.session;
      if (
        currentSession &&
        event.questionRevision === currentSession.questionRevision &&
        (event.codeVersion || 0) > (currentSession.candidateCodeVersion || 0)
      ) {
        refetch();
      }
    });

    return () => {
      subscription.unsubscribe();
      codeSubscription.unsubscribe();
    };
  }, [channel, id, queryClient, refetch]);

  const [editorDraft, setEditorDraft] = useState(null);
  const activeQuestionRevision = session?.questionRevision || 0;
  const draftMatchesCurrentQuestion =
    editorDraft?.questionRevision === activeQuestionRevision;
  const selectedLanguage = draftMatchesCurrentQuestion
    ? editorDraft.language
    : session?.candidateLanguage || "javascript";
  const canonicalCode = session?.candidateCodeVersion > 0
    ? session.candidateCode
    : isParticipant
      ? problemData?.starterCode?.[selectedLanguage] || ""
      : "";
  const code = draftMatchesCurrentQuestion ? editorDraft.code : canonicalCode;

  // redirect the "participant" when session ends
  useEffect(() => {
    if (!session || loadingSession) return;

    if (session.status === "completed") navigate("/dashboard");
  }, [session, loadingSession, navigate]);

  useEffect(() => {
    if (!isParticipant || !editorDraft?.dirty) return undefined;

    const { code: draftCode, language, version: codeVersion } = editorDraft;
    const timeoutId = window.setTimeout(() => {
      saveCandidateCode(
        {
          id,
          code: draftCode,
          language,
          questionRevision: activeQuestionRevision,
          codeVersion,
        },
        {
          onSuccess: (savedCode) => {
            queryClient.setQueryData(["session", id], (currentData) => {
              const currentSession = currentData?.session;
              if (
                !currentSession ||
                savedCode.candidateCodeVersion < (currentSession.candidateCodeVersion || 0)
              ) {
                return currentData;
              }

              return {
                ...currentData,
                session: { ...currentSession, ...savedCode },
              };
            });
            if (codeVersion === codeVersionRef.current) {
              setEditorDraft((currentDraft) =>
                currentDraft?.version === codeVersion
                  ? { ...currentDraft, dirty: false }
                  : currentDraft,
              );
            }
          },
          onError: (error) => {
            if (error.response?.status === 409) refetch();
          },
        },
      );
    }, 350);

    return () => window.clearTimeout(timeoutId);
  }, [
    activeQuestionRevision,
    editorDraft,
    id,
    isParticipant,
    queryClient,
    refetch,
    saveCandidateCode,
  ]);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const starterCode = problemData?.starterCode?.[newLang] || "";
    setOutput(null);
    if (isParticipant) {
      const version = Math.max(codeVersionRef.current, session?.candidateCodeVersion || 0) + 1;
      codeVersionRef.current = version;
      setEditorDraft({
        questionRevision: activeQuestionRevision,
        language: newLang,
        code: starterCode,
        version,
        dirty: true,
      });
    }
  };

  const handleCandidateCodeChange = (value) => {
    if (isParticipant) {
      const version = Math.max(codeVersionRef.current, session?.candidateCodeVersion || 0) + 1;
      codeVersionRef.current = version;
      setEditorDraft({
        questionRevision: activeQuestionRevision,
        language: selectedLanguage,
        code: value || "",
        version,
        dirty: true,
      });
    }
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);

    const result = await executeCode(selectedLanguage, code);
    setOutput(result);
    setIsRunning(false);
  };

  const handleEndSession = () => {
    if (confirm("Are you sure you want to end this session? All participants will be notified.")) {
      // this will navigate the HOST to dashboard
      endSessionMutation.mutate(id, { onSuccess: () => navigate("/dashboard") });
    }
  };

  const handleCopyInviteLink = async () => {
    const inviteUrl = new URL(`/session/${id}`, window.location.origin);
    inviteUrl.hash = new URLSearchParams({ joinCode }).toString();
    await navigator.clipboard.writeText(inviteUrl.toString());
    toast.success("Invite link copied");
  };

  const handleQuestionSelect = (questionId) => {
    selectQuestionMutation.mutate(
      { id, questionId },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(["session", id], data);
          setIsQuestionPickerOpen(false);
        },
      },
    );
  };

  if (session && !loadingSession && !isHost && !isParticipant) {
    return (
      <main className="access-state">
        <JoinSessionModal
          key={id}
          session={session}
          isOpen
          initialJoinCode={joinCode}
          onClose={() => navigate("/dashboard")}
          onSuccess={refetch}
        />
        <div className="access-card">
          <div className="access-card__body">
            <h1 className="access-card__title">Private Session</h1>
            <p className="access-card__message">
              A join code is required before you can access this interview room.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="workspace">

      <div className="workspace__panels">
        <Group orientation="horizontal">
          {/* LEFT PANEL - CODE EDITOR & PROBLEM DETAILS */}
          <Panel defaultSize={45} minSize={30}>
            <Group orientation="vertical">
              {/* PROBLEM DSC PANEL */}
              <Panel defaultSize={50} minSize={20}>
                <section className="room-panel">
                  {/* HEADER SECTION */}
                  <div className="room__header">
                    <div className="room__title-row">
                      <div>
                        <h1 className="room__title">
                          {session?.name || "Interview Room"}
                        </h1>
                        <p className="room__current-question">
                          Current question: {session?.problem || "Not selected yet"}
                        </p>
                        {problemData?.category && (
                          <p className="room__category">{problemData.category}</p>
                        )}
                        <p className="room__participants">
                          Host: {session?.host?.name || "Loading..."} •{" "}
                          {session?.participant ? 2 : 1}/2 participants
                        </p>
                        {isHost && joinCode && session?.status === "active" && (
                          <div className="room__join-code-row">
                            <span className="room__join-code-label">Join code:</span>
                            <code className="status-badge status-badge--large room__join-code">
                              {joinCode}
                            </code>
                            <button
                              type="button"
                              onClick={handleCopyInviteLink}
                              className="app-button app-button--ghost app-button--extra-small"
                              title="Copy invite link"
                            >
                              <CopyIcon className="app-icon app-icon--small" />
                              Copy link
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="room__actions">
                        {isHost && session?.status === "active" && (
                          <button
                            type="button"
                            onClick={() => setIsQuestionPickerOpen(true)}
                            className="app-button app-button--primary app-button--small"
                          >
                            <ListChecksIcon className="app-icon app-icon--small" />
                            {problemData ? "Change Question" : "Choose Question"}
                          </button>
                        )}
                        <span
                          className={`status-badge status-badge--large ${getDifficultyBadgeClass(
                            session?.difficulty || "easy"
                          )}`}
                        >
                          {session?.difficulty
                            ? session.difficulty.slice(0, 1).toUpperCase() + session.difficulty.slice(1)
                            : "Waiting"}
                        </span>
                        {isHost && session?.status === "active" && (
                          <button
                            onClick={handleEndSession}
                            disabled={endSessionMutation.isPending}
                            className="app-button app-button--danger app-button--small"
                          >
                            {endSessionMutation.isPending ? (
                              <Loader2Icon className="app-icon app-icon--small app-icon--spinning" />
                            ) : (
                              <LogOutIcon className="app-icon app-icon--small" />
                            )}
                            End Session
                          </button>
                        )}
                        {session?.status === "completed" && (
                          <span className="status-badge status-badge--neutral status-badge--large">Completed</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="room__sections">
                    {!problemData && (
                      <div className="waiting-alert">
                        <span>
                          {isHost
                            ? "Choose a question when you are ready to begin."
                            : "Waiting for the interviewer to choose a question."}
                        </span>
                      </div>
                    )}

                    {/* problem desc */}
                    {problemData?.description && (
                      <div className="content-panel">
                        <h2 className="content-panel__title content-panel__title--spaced">Description</h2>
                        <div className="room__prose">
                          <p>{problemData.description.text}</p>
                          {problemData.description.notes?.map((note, idx) => (
                            <p key={idx}>
                              {note}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* examples section */}
                    {problemData?.examples && problemData.examples.length > 0 && (
                      <div className="content-panel">
                        <h2 className="content-panel__title content-panel__title--spaced">Examples</h2>

                        <div className="room__examples">
                          {problemData.examples.map((example, idx) => (
                            <div key={idx}>
                              <div className="room__example-heading">
                                <span className="status-badge status-badge--small">{idx + 1}</span>
                                <p className="room__example-label">Example {idx + 1}</p>
                              </div>
                              <div className="room__example-content">
                                <div className="room__example-line">
                                  <span className="problem__input-label">
                                    Input:
                                  </span>
                                  <span>{example.input}</span>
                                </div>
                                <div className="room__example-line">
                                  <span className="problem__output-label">
                                    Output:
                                  </span>
                                  <span>{example.output}</span>
                                </div>
                                {example.explanation && (
                                  <div className="room__explanation">
                                    <span>
                                      <span className="problem__explanation-label">Explanation:</span>{" "}
                                      {example.explanation}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Constraints */}
                    {problemData?.constraints && problemData.constraints.length > 0 && (
                      <div className="content-panel">
                        <h2 className="content-panel__title content-panel__title--spaced">Constraints</h2>
                        <ul className="room__constraints">
                          {problemData.constraints.map((constraint, idx) => (
                            <li key={idx}>
                              <span className="problem__bullet">•</span>
                              <code>{constraint}</code>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </section>
              </Panel>

              {problemData && (
                <>
                  <Separator className="workspace-resize-handle workspace-resize-handle--horizontal" />

                  <Panel defaultSize={50} minSize={20}>
                    <Group orientation="vertical">
                      <Panel defaultSize={70} minSize={30}>
                        <CodeEditorPanel
                          selectedLanguage={selectedLanguage}
                          code={code}
                          isRunning={isRunning}
                          onLanguageChange={handleLanguageChange}
                          onCodeChange={handleCandidateCodeChange}
                          onRunCode={handleRunCode}
                          readOnly={isHost}
                        />
                      </Panel>

                      <Separator className="workspace-resize-handle workspace-resize-handle--horizontal" />

                      <Panel defaultSize={30} minSize={15}>
                        <OutputPanel output={output} />
                      </Panel>
                    </Group>
                  </Panel>
                </>
              )}
            </Group>
          </Panel>

          <Separator className="workspace-resize-handle workspace-resize-handle--vertical" />

          {/* RIGHT PANEL - VIDEO CALLS & CHAT */}
          <Panel defaultSize={55} minSize={30}>
            <div className="video-panel">
              {isInitializingCall ? (
                <div className="call-loading">
                  <div className="call-loading__content">
                    <Loader2Icon className="app-icon app-icon--huge app-icon--spinning app-icon--primary" />
                    <p className="call-loading__message">Connecting to video call...</p>
                  </div>
                </div>
              ) : !streamClient || !call ? (
                <div className="video-panel__failed-state">
                  <div className="connection-card">
                    <div className="connection-card__body">
                      <div className="connection-card__icon-surface">
                        <PhoneOffIcon className="connection-card__icon" />
                      </div>
                      <h2 className="connection-card__title">Connection Failed</h2>
                      <p className="connection-card__message">Unable to connect to the video call</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="video-panel__call">
                  <StreamVideo client={streamClient}>
                    <StreamCall call={call}>
                      <VideoCallUI chatClient={chatClient} channel={channel} />
                    </StreamCall>
                  </StreamVideo>
                </div>
              )}
            </div>
          </Panel>
        </Group>
      </div>

      {isQuestionPickerOpen && isHost && (
        <div className="modal-overlay question-picker-overlay">
          <div
            className="modal-dialog question-picker-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="question-picker-title"
          >
            <InterviewQuestionPicker
              activeQuestionId={activeQuestionId}
              askedQuestionIds={askedQuestionIds}
              onSelect={handleQuestionSelect}
              onClose={() => setIsQuestionPickerOpen(false)}
              isSelecting={selectQuestionMutation.isPending}
            />
          </div>
          <div
            className="modal-overlay__backdrop"
            onClick={() => setIsQuestionPickerOpen(false)}
          />
        </div>
      )}
    </main>
  );
}

export default SessionPage;
