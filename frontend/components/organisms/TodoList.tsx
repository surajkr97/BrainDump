"use client";

import { useState } from "react";

import Button from "@/components/atoms/Button";
import EmptyState from "@/components/atoms/EmptyState";
import ErrorAlert from "@/components/atoms/ErrorAlert";
import Notice from "@/components/atoms/Notice";
import TodoEditForm from "@/components/molecules/TodoEditForm";
import TodoForm from "@/components/molecules/TodoForm";
import TodoItem from "@/components/molecules/TodoItem";
import TodoProgress from "@/components/molecules/TodoProgress";
import { useTodos } from "@/hooks/useTodos";

export default function TodoList() {
  const {
    todos,
    total,
    nextPage,
    loading,
    error,
    submitting,
    pendingId,
    addTodo,
    updateTodo,
    deleteTodo,
    loadMore,
  } = useTodos();
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <section className="flex flex-col gap-4">
      <TodoForm submitting={submitting} onAdd={addTodo} />

      {error && <ErrorAlert message={error} />}

      <div className="overflow-hidden rounded-2xl border border-line bg-surface">
        {loading ? (
          <Notice>Loading…</Notice>
        ) : todos.length === 0 ? (
          <EmptyState />
        ) : (
          <ul className="divide-y divide-line">
            {todos.map((todo) =>
              editingId === todo.id ? (
                <TodoEditForm
                  key={todo.id}
                  todo={todo}
                  saving={pendingId === todo.id}
                  onSave={async (changes) => {
                    if (await updateTodo(todo.id, changes)) setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  busy={pendingId !== null}
                  onToggle={() =>
                    updateTodo(todo.id, { completed: !todo.completed })
                  }
                  onEdit={() => setEditingId(todo.id)}
                  onDelete={() => deleteTodo(todo.id)}
                />
              ),
            )}
          </ul>
        )}
      </div>

      {nextPage !== null && (
        <Button variant="ghost" onClick={loadMore} className="self-start">
          Load more ({todos.length} of {total})
        </Button>
      )}

      {todos.length > 0 && (
        <TodoProgress
          done={todos.filter((todo) => todo.completed).length}
          total={todos.length}
        />
      )}
    </section>
  );
}
