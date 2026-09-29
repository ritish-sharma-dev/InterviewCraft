import { useNavigate } from "react-router";
import { useState } from "react";
import { ArrowRightIcon, LinkIcon } from "lucide-react";
import { useCreateSession, useMyRecentSessions } from "../hooks/useSessions";

import Navbar from "../components/Navbar";
import WelcomeSection from "../components/WelcomeSection";
import RecentSessions from "../components/RecentSessions";
import CreateSessionModal from "../components/CreateSessionModal";
import "../styles/components.css";

function DashboardPage() {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [sessionLink, setSessionLink] = useState("");
  const [joinLinkError, setJoinLinkError] = useState("");

  const createSessionMutation = useCreateSession();

  const { data: recentSessionsData, isLoading: loadingRecentSessions } = useMyRecentSessions();

  const handleCreateRoom = () => {
    createSessionMutation.mutate(
      {
        name: roomName,
      },
      {
        onSuccess: (data) => {
          setShowCreateModal(false);
          sessionStorage.setItem(`session-join-code:${data.session._id}`, data.joinCode);
          navigate(`/session/${data.session._id}`);
        },
      }
    );
  };

  const recentSessions = recentSessionsData?.sessions || [];

  const handleJoinByLink = (event) => {
    event.preventDefault();
    const input = sessionLink.trim();
    let sessionId = input.match(/^[a-f\d]{24}$/i)?.[0];
    let joinCode = "";

    if (!sessionId) {
      try {
        const url = new URL(input, window.location.origin);
        sessionId = url.pathname.match(/\/session\/([a-f\d]{24})(?:\/|$)/i)?.[1];
        joinCode = new URLSearchParams(url.hash.slice(1)).get("joinCode")?.trim().toUpperCase() || "";
      } catch {
        setJoinLinkError("Enter a valid session link or ID.");
        return;
      }
    }

    if (!sessionId) {
      setJoinLinkError("Enter a valid session link or ID.");
      return;
    }

    setJoinLinkError("");
    navigate(`/session/${sessionId}`, joinCode ? { state: { joinCode } } : undefined);
  };

  return (
    <>
      <main className="dashboard">
        <Navbar />
        <WelcomeSection onCreateSession={() => setShowCreateModal(true)} />

        <div className="dashboard__content">
          <form className="dashboard-join" onSubmit={handleJoinByLink}>
            <label className="dashboard-join__field">
              <LinkIcon className="dashboard-join__icon" aria-hidden="true" />
              <input
                type="text"
                value={sessionLink}
                onChange={(event) => {
                  setSessionLink(event.target.value);
                  setJoinLinkError("");
                }}
                placeholder="Paste a session link or ID"
                aria-label="Session link or ID"
                aria-invalid={!!joinLinkError}
                aria-describedby={joinLinkError ? "dashboard join error" : undefined}
              />
            </label>
            <button type="submit" className="app-button app-button--primary">
              Join Session
            </button>
            {joinLinkError && (
              <p className="dashboard-join__error" id="dashboard-join-error" role="alert">
                {joinLinkError}
              </p>
            )}
          </form>
          <RecentSessions sessions={recentSessions} isLoading={loadingRecentSessions} />
        </div>
      </main>

      <CreateSessionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        name={roomName}
        setName={setRoomName}
        onCreateRoom={handleCreateRoom}
        isCreating={createSessionMutation.isPending}
      />
    </>
  );
}

export default DashboardPage;
