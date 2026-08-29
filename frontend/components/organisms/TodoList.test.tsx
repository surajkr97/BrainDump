import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import TodoList from "./TodoList";

const page = (results: unknown[], extra: object = {}) => ({
  count: results.length,
  next: null,
  previous: null,
  results,
  ...extra,
});

const todo = (id: number, title: string, completed = false) => ({
  id,
  title,
  description: "",
  completed,
  created_at: "2026-08-29T00:00:00Z",
  updated_at: "2026-08-29T00:00:00Z",
});

function mockFetchSequence(...bodies: Array<[unknown, number?]>) {
  const fetchMock = vi.fn();
  for (const [body, status = 200] of bodies) {
    fetchMock.mockResolvedValueOnce(
      status === 204
        ? new Response(null, { status })
        : new Response(JSON.stringify(body), { status }),
    );
  }
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

beforeEach(() => vi.unstubAllGlobals());
afterEach(() => vi.unstubAllGlobals());

describe("TodoList", () => {
  it("renders the todos it loads", async () => {
    mockFetchSequence([page([todo(1, "Buy milk")])]);

    render(<TodoList />);

    expect(await screen.findByText("Buy milk")).toBeInTheDocument();
  });

  it("renders an empty state", async () => {
    mockFetchSequence([page([])]);

    render(<TodoList />);

    expect(await screen.findByText("Nothing here yet.")).toBeInTheDocument();
  });

  it("adds a todo and clears the input", async () => {
    const fetchMock = mockFetchSequence(
      [page([])],
      [todo(7, "Write README"), 201],
    );
    render(<TodoList />);
    await screen.findByText("Nothing here yet.");

    const input = screen.getByPlaceholderText("What needs doing?");
    await userEvent.type(input, "Write README");
    await userEvent.click(screen.getByRole("button", { name: "Add" }));

    expect(await screen.findByText("Write README")).toBeInTheDocument();
    expect(input).toHaveValue("");
    const [, [, init]] = fetchMock.mock.calls;
    expect(init).toMatchObject({ method: "POST" });
    expect(JSON.parse(init.body)).toEqual({ title: "Write README" });
  });

  it("toggles completion", async () => {
    const fetchMock = mockFetchSequence(
      [page([todo(1, "Buy milk")])],
      [todo(1, "Buy milk", true)],
    );
    render(<TodoList />);

    await userEvent.click(await screen.findByRole("checkbox"));

    await waitFor(() => expect(screen.getByRole("checkbox")).toBeChecked());
    const [, [url, init]] = fetchMock.mock.calls;
    expect(url).toBe("/api/todos/1");
    expect(init).toMatchObject({ method: "PATCH" });
    expect(JSON.parse(init.body)).toEqual({ completed: true });
  });

  it("deletes a todo", async () => {
    mockFetchSequence([page([todo(1, "Buy milk")])], [null, 204]);
    render(<TodoList />);
    await screen.findByText("Buy milk");

    await userEvent.click(screen.getByRole("button", { name: /Delete/ }));

    await waitFor(() =>
      expect(screen.queryByText("Buy milk")).not.toBeInTheDocument(),
    );
  });

  it("appends the next page", async () => {
    const fetchMock = mockFetchSequence(
      [page([todo(1, "First")], { count: 2, next: "http://api/todos/?page=2" })],
      [page([todo(2, "Second")], { count: 2 })],
    );
    render(<TodoList />);

    await userEvent.click(
      await screen.findByRole("button", { name: /Load more/ }),
    );

    expect(await screen.findByText("Second")).toBeInTheDocument();
    expect(screen.getByText("First")).toBeInTheDocument();
    expect(fetchMock.mock.calls[1][0]).toBe("/api/todos?page=2");
  });

  it("shows an error when the request fails", async () => {
    mockFetchSequence([{ detail: "boom" }, 500]);

    render(<TodoList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Something went wrong on our end.",
    );
  });

  it("edits a todo's title and description", async () => {
    const fetchMock = mockFetchSequence(
      [page([todo(1, "Buy milk")])],
      [{ ...todo(1, "Buy oat milk"), description: "the barista one" }],
    );
    render(<TodoList />);

    await userEvent.click(await screen.findByRole("button", { name: /Edit/ }));

    const titleInput = screen.getByLabelText("Title");
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, "Buy oat milk");
    await userEvent.type(screen.getByLabelText("Description"), "the barista one");
    await userEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Buy oat milk")).toBeInTheDocument();
    expect(screen.getByText("the barista one")).toBeInTheDocument();
    const [, [url, init]] = fetchMock.mock.calls;
    expect(url).toBe("/api/todos/1");
    expect(init).toMatchObject({ method: "PATCH" });
    expect(JSON.parse(init.body)).toEqual({
      title: "Buy oat milk",
      description: "the barista one",
    });
  });

  it("cancels an edit without saving", async () => {
    const fetchMock = mockFetchSequence([page([todo(1, "Buy milk")])]);
    render(<TodoList />);

    await userEvent.click(await screen.findByRole("button", { name: /Edit/ }));
    await userEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.getByText("Buy milk")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("does not post twice when Add is double-clicked", async () => {
    let release!: (value: Response) => void;
    const inFlight = new Promise<Response>((resolve) => {
      release = resolve;
    });
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(new Response(JSON.stringify(page([]))))
      .mockReturnValueOnce(inFlight);
    vi.stubGlobal("fetch", fetchMock);

    render(<TodoList />);
    await screen.findByText("Nothing here yet.");

    await userEvent.type(
      screen.getByPlaceholderText("What needs doing?"),
      "Once",
    );
    const addButton = screen.getByRole("button", { name: "Add" });
    await userEvent.click(addButton);

    expect(addButton).toBeDisabled();
    await userEvent.click(addButton);

    const posts = fetchMock.mock.calls.filter(([url]) => url === "/api/todos");
    expect(posts).toHaveLength(1);

    release(new Response(JSON.stringify(todo(1, "Once")), { status: 201 }));
    expect(await screen.findByText("Once")).toBeInTheDocument();
  });
});
