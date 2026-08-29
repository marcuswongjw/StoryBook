const ORIGIN = 'https://marcuswongjw.github.io/StoryBook';

addEventListener('fetch', (event) => {
  event.respondWith(proxyStoryBook(event.request));
});

async function proxyStoryBook(request) {
  const incoming = new URL(request.url);
  const upstream = new URL(`${ORIGIN}${incoming.pathname === '/' ? '/' : incoming.pathname}`);
  upstream.search = incoming.search;

  const originRequest = new Request(upstream.toString(), request);
  const response = await fetch(originRequest, { redirect: 'follow' });
  const headers = new Headers(response.headers);
  headers.set('Cache-Control', response.headers.get('Cache-Control') || 'public, max-age=300');

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
