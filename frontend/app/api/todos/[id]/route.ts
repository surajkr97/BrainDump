import { NextRequest } from "next/server";

import { forward } from "@/lib/django";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const { id } = await params;
  return forward(`/todos/${id}/`, { method: "PATCH", body: await request.text() });
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const { id } = await params;
  return forward(`/todos/${id}/`, { method: "DELETE" });
}
