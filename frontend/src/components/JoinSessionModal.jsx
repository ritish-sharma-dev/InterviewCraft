import { Loader2Icon, LockKeyholeIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useJoinSession } from "../hooks/useSessions";

function JoinSessionModal({ session, isOpen, onClose, onSuccess }) {
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
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
    <div className="modal modal-open">
      <form className="modal-box max-w-md" onSubmit={handleSubmit}>
        <div className="flex items-center gap-3 mb-4">
          <LockKeyholeIcon className="size-6 text-primary" />
          <h3 className="font-bold text-xl">Join Private Session</h3>
        </div>
        <p className="text-sm text-base-content/70 mb-4">
          Enter the join code shared by {session.host?.name || "the host"}.
        </p>
        <input
          autoFocus
          value={joinCode}
          onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
          placeholder="8-character code"
          maxLength={8}
          className="input input-bordered w-full tracking-[0.25em] font-mono"
          required
        />
        {joinSessionMutation.isError && (
          <p className="text-error text-sm mt-2">
            {joinSessionMutation.error.response?.data?.message || "Unable to join this session"}
          </p>
        )}
        <div className="modal-action">
          <button type="button" className="btn btn-ghost" onClick={handleClose}>
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={joinSessionMutation.isPending || joinCode.length !== 8}
          >
            {joinSessionMutation.isPending && <Loader2Icon className="size-4 animate-spin" />}
            Join Session
          </button>
        </div>
      </form>
      <div className="modal-backdrop" onClick={handleClose}></div>
    </div>
  );
}

export default JoinSessionModal;