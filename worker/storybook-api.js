const ALLOWED_ORIGINS = new Set([
  'https://story.marcusw.xyz',
  'https://storylog.marcusw.xyz',
]);

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.has(origin) ? origin : 'https://story.marcusw.xyz',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function jsonResponse(payload, status, request) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request),
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

async function readSessions() {
  const raw = await STORYBOOK_TELEMETRY.get('sessions');
  if (!raw) return [];

  try {
    const sessions = JSON.parse(raw);
    return Array.isArray(sessions) ? sessions : [];
  } catch {
    return [];
  }
}

async function handleRequest(request) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(request) });
    }

    const url = new URL(request.url);
    if (!url.pathname.startsWith('/api/sessions')) {
      return jsonResponse({ error: 'Not found' }, 404, request);
    }

    if (request.method === 'GET' && url.pathname === '/api/sessions') {
      const sessions = await readSessions();
      sessions.sort((first, second) => second.timestamp - first.timestamp);
      return jsonResponse(sessions, 200, request);
    }

    if (request.method === 'PUT' && url.pathname === '/api/sessions') {
      let session;
      try {
        session = await request.json();
      } catch {
        return jsonResponse({ error: 'A valid JSON session is required.' }, 400, request);
      }

      if (!session || typeof session.sessionId !== 'string' || !Number.isFinite(session.timestamp)) {
        return jsonResponse({ error: 'A sessionId and timestamp are required.' }, 400, request);
      }

      const existing = await readSessions();
      const updated = [session, ...existing.filter((stored) => stored.sessionId !== session.sessionId)]
        .sort((first, second) => second.timestamp - first.timestamp)
        .slice(0, 500);
      await STORYBOOK_TELEMETRY.put('sessions', JSON.stringify(updated));
      return jsonResponse({ sessionId: session.sessionId, saved: true }, 200, request);
    }

    if (request.method === 'DELETE' && url.pathname.startsWith('/api/sessions/')) {
      const sessionId = decodeURIComponent(url.pathname.slice('/api/sessions/'.length));
      if (!sessionId) {
        return jsonResponse({ error: 'A session ID is required.' }, 400, request);
      }

      const updated = (await readSessions()).filter((session) => session.sessionId !== sessionId);
      await STORYBOOK_TELEMETRY.put('sessions', JSON.stringify(updated));
      return jsonResponse({ sessionId, deleted: true }, 200, request);
    }

  return jsonResponse({ error: 'Method not allowed' }, 405, request);
}

addEventListener('fetch', (event) => {
  event.respondWith(handleRequest(event.request));
});
