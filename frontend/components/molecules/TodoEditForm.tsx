"use client";

import { useState } from "react";

import Button from "@/components/atoms/Button";
import TextArea from "@/components/atoms/TextArea";
import TextInput from "@/components/atoms/TextInput";
import type { Todo } from "@/types/todo";

type Props = {
  todo: Todo;
  saving: boolean;
  onSave: (changes: { title: string; description: string }) => void;
  onCancel: () => void;
};

export default function TodoEditForm({
  todo,
  saving,
  onSave,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState({
    title: todo.title,
    description: todo.description,
  });

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    onSave(draft);
  }

  return (
    <li className="px-4 py-4 sm:px-5">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <TextInput
          id={`title-${todo.id}`}
          label="Title"
          value={draft.title}
          onChange={(event) =>
            setDraft({ ...draft, title: event.target.value })
          }
          required
          maxLength={255}
          disabled={saving}
        />
        <TextArea
          id={`description-${todo.id}`}
          label="Description"
          value={draft.description}
          onChange={(event) =>
            setDraft({ ...draft, description: event.target.value })
          }
          rows={2}
          placeholder="Description (optional)"
          disabled={saving}
        />
        <div className="flex items-center gap-1">
          <Button type="submit" disabled={saving || draft.title.trim() === ""}>
            {saving ? "Saving…" : "Save"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={saving}
          >
            Cancel
          </Button>
        </div>
      </form>
    </li>
  );
}
