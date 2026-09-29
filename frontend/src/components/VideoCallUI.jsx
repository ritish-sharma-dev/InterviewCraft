import {
  CallControls,
  CallingState,
  SpeakerLayout,
  useCallStateHooks,
} from "@stream-io/video-react-sdk";
import { Loader2Icon, MessageSquareIcon, UsersIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Channel, Chat, MessageComposer, MessageList, Thread, Window } from "stream-chat-react";
import "../styles/components.css";

import "@stream-io/video-react-sdk/dist/css/styles.css";
import "stream-chat-react/dist/css/index.css";

function VideoCallUI({ chatClient, channel }) {
  const navigate = useNavigate();
  const { useCallCallingState, useParticipantCount } = useCallStateHooks();
  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const [isChatOpen, setIsChatOpen] = useState(false);

  if (callingState === CallingState.JOINING) {
    return (
      <div className="call-loading">
        <div className="call-loading__content">
          <Loader2Icon className="app-icon app-icon--huge app-icon--spinning app-icon--primary" />
          <p className="call-loading__message">Joining call...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="call-ui str-video">
      <div className="call__main">
        {/* Participants count badge and Chat Toggle */}
        <div className="call__toolbar">
          <div className="call__participant-count">
            <UsersIcon className="call__participant-icon" />
            <span className="call__participant-label">
              {participantCount} {participantCount === 1 ? "participant" : "participants"}
            </span>
          </div>
          {chatClient && channel && (
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`app-button app-button--small ${isChatOpen ? "app-button--primary" : "app-button--ghost"}`}
              title={isChatOpen ? "Hide chat" : "Show chat"}
            >
              <MessageSquareIcon className="app-icon app-icon--small" />
              Chat
            </button>
          )}
        </div>

        <div className="call__speaker-layout">
          <SpeakerLayout />
        </div>

        <div className="call__controls">
          <CallControls onLeave={() => navigate("/dashboard")} />
        </div>
      </div>

      {/* CHAT SECTION */}

      {chatClient && channel && (
        <div
          className={`call__chat ${
            isChatOpen ? "call__chat--open" : "call__chat--closed"
          }`}
        >
          {isChatOpen && (
            <>
              <div className="call__chat-heading">
                <h3>Session Chat</h3>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="call__chat-close"
                  title="Close chat"
                >
                  <XIcon className="app-icon app-icon--medium" />
                </button>
              </div>
              <div className="call__chat-content stream-chat-dark">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={channel}>
                    <Window>
                      <MessageList />
                      <MessageComposer />
                    </Window>
                    <Thread />
                  </Channel>
                </Chat>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
export default VideoCallUI;
