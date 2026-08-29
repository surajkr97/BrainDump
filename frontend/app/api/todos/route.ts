import { NextRequest } from "next/server";

import { forward } from "@/lib/django";

export async function GET(request: NextRequest) {
  return forward(`/todos/${request.nextUrl.search}`);
}

export async function POST(request: NextRequest) {
  return forward("/todos/", { method: "POST", body: await request.text() });
}
