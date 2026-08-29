"use client";

import { useState } from "react";

import Button from "@/components/atoms/Button";
import TextInput from "@/components/atoms/TextInput";

type Props = {
  submitting: boolean;
  onAdd: (title: string) => Promise<boolean>;
};

export default function TodoForm({ submitting, onAdd }: Props) {
  const [title, setTitle] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (await onAdd(title)) setTitle("");
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <TextInput
        id="new-todo"
        label="New todo"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="What needs doing?"
        required
        maxLength={255}
        disabled={submitting}
        className="min-w-0 flex-1"
      />
      <Button type="submit" disabled={submitting || title.trim() === ""}>
        {submitting ? "Adding…" : "Add"}
      </Button>
    </form>
  );
}
