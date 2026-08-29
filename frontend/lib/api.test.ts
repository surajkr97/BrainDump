import { afterEach, describe, expect, it, vi } from "vitest";

import { ApiError, apiFetch } from "./api";

function respondWith(body: unknown, status = 200) {
  const response =
    status === 204
      ? new Response(null, { status })
      : new Response(JSON.stringify(body), { status });
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response));
}

afterEach(() => vi.unstubAllGlobals());

describe("apiFetch", () => {
  it("returns the parsed body", async () => {
    respondWith({ id: 1, title: "Buy milk" });

    await expect(apiFetch("/api/todos")).resolves.toEqual({
      id: 1,
      title: "Buy milk",
    });
  });

  it("returns undefined for 204", async () => {
    respondWith(null, 204);

    await expect(apiFetch("/api/todos/1")).resolves.toBeUndefined();
  });

  it("surfaces field errors from a 400", async () => {
    respondWith({ title: ["This field may not be blank."] }, 400);

    await expect(apiFetch("/api/todos")).rejects.toThrow(
      "This field may not be blank.",
    );
  });

  it("maps a 404 to a readable message", async () => {
    respondWith({ detail: "Not found." }, 404);

    await expect(apiFetch("/api/todos/99")).rejects.toThrow(
      "That todo no longer exists. It may have been deleted.",
    );
  });

  it("wraps network failures in an ApiError", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new TypeError("failed")));

    await expect(apiFetch("/api/todos")).rejects.toMatchObject({
      name: "ApiError",
      status: 0,
    });
  });

  it("redirects to login on 401", async () => {
    Object.defineProperty(window, "location", {
      value: { href: "" },
      writable: true,
    });
    respondWith({ detail: "Not authenticated." }, 401);

    await expect(apiFetch("/api/todos")).rejects.toBeInstanceOf(ApiError);
    expect(window.location.href).toBe("/auth/login");
  });
});
