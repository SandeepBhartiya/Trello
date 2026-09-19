import { useState } from "react";
import { updateBoard } from "../api/board";
import { validators, runValidation, type FieldErrors } from "../utils/validation";
import type { Board } from "../types";

type BoardField = "title";

interface Props {
  board: Board;
  onClose: () => void;
  onUpdated: (board: Board) => void;
}

export default function RenameBoardModal({ board, onClose, onUpdated }: Props) {
  const [title, setTitle] = useState(board.title);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors<BoardField>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const errors = runValidation<BoardField>({
      title: () => validators.minLength(title,2),
    });
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      const updated = await updateBoard(Number(board.id), title);
      onUpdated(updated);
      onClose();
    } catch (err: any) {
      setFormError(err.message || "Failed to rename board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <h2>Rename board</h2>

        {formError && <div className="form-error">{formError}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="field-group">
            <label htmlFor="rename-title">Title</label>
            <input
              id="rename-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={fieldErrors.title ? "input-error" : ""}
              autoFocus
            />
            {fieldErrors.title && <div className="field-error">{fieldErrors.title}</div>}
          </div>

          <div className="modal-actions">
            <button type="button" className="modal-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="modal-submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}