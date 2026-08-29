import { auth0 } from "./auth0";

const API = process.env.DJANGO_API_URL!;

export async function forward(
  path: string,
  init?: RequestInit,
): Promise<Response> {
  let token: string;

  try {
    ({ token } = await auth0.getAccessToken());
  } catch {
    return Response.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const upstream = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (upstream.status === 204) return new Response(null, { status: 204 });

  return new Response(await upstream.text(), {
    status: upstream.status,
    headers: { "Content-Type": "application/json" },
  });
}
