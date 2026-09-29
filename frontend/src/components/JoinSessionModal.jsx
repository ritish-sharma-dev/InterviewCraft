import { Loader2Icon, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useJoinSession } from "../hooks/useSessions";
import "../styles/components.css";

function JoinSessionModal({ session, isOpen, onClose, onSuccess, initialJoinCode = "" }) {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState(() => initialJoinCode);
  const joinSessionMutation = useJoinSession();

  if (!isOpen || !session) return null;

  const handleClose = () => {
    setJoinCode("");
    joinSessionMutation.reset();
    onClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    joinSessionMutation.mutate(
      { id: session._id, joinCode },
      {
        onSuccess: () => {
          onSuccess?.();
          navigate(`/session/${session._id}`);
        },
      },
    );
  };

  return (
    <div className="modal-overlay">
      <form className="modal-dialog" onSubmit={handleSubmit}>
        <div className="join-dialog__heading">
          <LockKeyholeIcon className="join-dialog__icon" />
          <h3 className="modal-dialog__title">Join Private Session</h3>
        </div>
        <p className="join-dialog__description">
          Enter the join code shared by {session.host?.name || "the host"}.
        </p>
        <input
          autoFocus
          value={joinCode}
          onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
          placeholder="8-character code"
          maxLength={8}
          className="form-control join-dialog__code-input"
          required
        />
        {joinSessionMutation.isError && (
          <p className="join-dialog__error">
            {joinSessionMutation.error.response?.data?.message || "Unable to join this session"}
          </p>
        )}
        <div className="modal-dialog__actions">
          <button type="button" className="app-button app-button--ghost" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="app-button app-button--primary"
            disabled={joinSessionMutation.isPending || joinCode.length !== 8}
          >
            {joinSessionMutation.isPending && <Loader2Icon className="app-icon app-icon--small app-icon--spinning" />}
            Join Session
          </button>
        </div>
      </form>
      <div className="modal-overlay__backdrop" onClick={handleClose}></div>
    </div>
  );
}

export default JoinSessionModal;