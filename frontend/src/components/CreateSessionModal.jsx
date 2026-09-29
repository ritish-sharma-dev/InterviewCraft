import { LoaderIcon, PlusIcon } from "lucide-react";
import "../styles/components.css";

function CreateSessionModal({
  isOpen,
  onClose,
  name,
  setName,
  onCreateRoom,
  isCreating,
}) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-dialog modal-dialog--wide">
        <h3 className="modal-dialog__title">Create New Session</h3>

        <div className="session-form">
          <div className="session-form__field">
            <label className="session-form__label" htmlFor="session-name">
              <span className="session-form__label-text">Session Name</span>
              <span className="session-form__required">Required</span>
            </label>
            <input
              id="session-name"
              className="form-control"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Frontend Engineer Interview"
              minLength={3}
              maxLength={80}
              required
            />
          </div>

          <p className="session-form__hint">
            Private session. Share its room code with your interview partner.
          </p>
        </div>

        <div className="modal-dialog__actions">
          <button className="app-button app-button--ghost" onClick={onClose}>
            Cancel
          </button>

          <button
            className="app-button app-button--primary"
            onClick={onCreateRoom}
            disabled={isCreating || name.trim().length < 3}
          >
            {isCreating ? (
              <LoaderIcon className="app-icon app-icon--medium app-icon--spinning" />
            ) : (
              <PlusIcon className="app-icon app-icon--medium" />
            )}

            {isCreating ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
      <div className="modal-overlay__backdrop" onClick={onClose}></div>
    </div>
  );
}
export default CreateSessionModal;
