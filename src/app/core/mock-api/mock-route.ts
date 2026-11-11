/** One mocked backend endpoint. */
export interface MockRoute {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  /** Backend path without host or query string. A `:name` segment matches any value. */
  path: string;
  /**
   * JSON file under src/assets/mock-api/. `{name}` is replaced with the `:name` path segment
   * or the `name` query parameter of the request, so one route can serve a file per id.
   */
  file: string;
}

export interface MockMatch {
  route: MockRoute;
  /** URL of the JSON asset to serve. */
  fileUrl: string;
}

/** Finds the mock for a request URL, or undefined when the endpoint isn't mocked. */
export function findMock(routes: readonly MockRoute[], method: string, url: string): MockMatch | undefined {
  const parsed = new URL(url, window.location.origin);
  const segments = trimSlashes(parsed.pathname).split('/');

  for (const route of routes) {
    if (route.method !== method.toUpperCase()) continue;
    const routeSegments = trimSlashes(route.path).split('/');
    if (routeSegments.length !== segments.length) continue;

    const params: Record<string, string> = {};
    const matches = routeSegments.every((part, i) => {
      if (part.startsWith(':')) {
        params[part.slice(1)] = decodeURIComponent(segments[i]);
        return true;
      }
      return part === segments[i];
    });
    if (!matches) continue;

    const file = route.file.replace(/\{(\w+)\}/g, (_, name: string) =>
      params[name] ?? parsed.searchParams.get(name) ?? ''
    );
    return { route, fileUrl: `assets/mock-api/${file}` };
  }
  return undefined;
}

function trimSlashes(path: string): string {
  return path.replace(/^\/+|\/+$/g, '');
}
