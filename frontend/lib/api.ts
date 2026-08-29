export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function messageFor(status: number, detail?: string): string {
  switch (status) {
    case 400:
      return (
        detail ?? "That doesn't look right. Check the fields and try again."
      );
    case 401:
      return "Your session has expired. Log in again to continue.";
    case 403:
      return "You don't have permission to do that.";
    case 404:
      return "That todo no longer exists. It may have been deleted.";
    default:
      return "Something went wrong on our end. Try again in a moment.";
  }
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(path, {
      ...init,
      headers: { "Content-Type": "application/json", ...init?.headers },
    });
  } catch {
    throw new ApiError(
      0,
      "Can't reach the server. Check your connection and try again.",
    );
  }

  if (response.status === 401) {
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/auth/login";
    throw new ApiError(401, messageFor(401));
  }

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = body?.detail ?? body?.title?.[0];
    throw new ApiError(response.status, messageFor(response.status, detail));
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
