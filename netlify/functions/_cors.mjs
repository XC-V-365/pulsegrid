/** Minimal same-origin friendly headers for function responses */
export function json(data, status = 200, extra = {}) {
  return Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      ...extra,
    },
  });
}

export function noContent() {
  return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
}
