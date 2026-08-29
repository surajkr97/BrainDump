"use client";

import { useCallback, useEffect, useState } from "react";

import { ApiError, apiFetch } from "@/lib/api";
import type { Paginated, Todo } from "@/types/todo";

function messageOf(cause: unknown) {
  return cause instanceof ApiError ? cause.message : "Something went wrong.";
}

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [total, setTotal] = useState(0);
  const [nextPage, setNextPage] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const loadPage = useCallback(async (page: number) => {
    const data = await apiFetch<Paginated<Todo>>(`/api/todos?page=${page}`);
    setTodos((current) =>
      page === 1 ? data.results : [...current, ...data.results],
    );
    setNextPage(data.next ? page + 1 : null);
    setTotal(data.count);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadFirstPage() {
      try {
        await loadPage(1);
      } catch (cause) {
        if (active) setError(messageOf(cause));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadFirstPage();
    return () => {
      active = false;
    };
  }, [loadPage]);

  async function loadMore() {
    if (nextPage === null) return;
    setError(null);
    try {
      await loadPage(nextPage);
    } catch (cause) {
      setError(messageOf(cause));
    }
  }

  async function addTodo(title: string) {
    if (submitting) return false;
    setError(null);
    setSubmitting(true);
    try {
      const created = await apiFetch<Todo>("/api/todos", {
        method: "POST",
        body: JSON.stringify({ title }),
      });
      setTodos((current) => [created, ...current]);
      setTotal((current) => current + 1);
      return true;
    } catch (cause) {
      setError(messageOf(cause));
      return false;
    } finally {
      setSubmitting(false);
    }
  }

  async function updateTodo(id: number, changes: Partial<Todo>) {
    if (pendingId !== null) return false;
    setError(null);
    setPendingId(id);
    try {
      const updated = await apiFetch<Todo>(`/api/todos/${id}`, {
        method: "PATCH",
        body: JSON.stringify(changes),
      });
      setTodos((current) => current.map((it) => (it.id === id ? updated : it)));
      return true;
    } catch (cause) {
      setError(messageOf(cause));
      return false;
    } finally {
      setPendingId(null);
    }
  }

  async function deleteTodo(id: number) {
    if (pendingId !== null) return false;
    setError(null);
    setPendingId(id);
    try {
      await apiFetch(`/api/todos/${id}`, { method: "DELETE" });
      setTodos((current) => current.filter((it) => it.id !== id));
      setTotal((current) => current - 1);
      return true;
    } catch (cause) {
      setError(messageOf(cause));
      return false;
    } finally {
      setPendingId(null);
    }
  }

  return {
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
  };
}
