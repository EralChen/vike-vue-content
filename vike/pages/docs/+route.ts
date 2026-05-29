// https://vike.dev/route-function
import type { PageContextServer } from "vike/types";

export default function route(pageContext: PageContextServer) {
  const { urlPathname } = pageContext;
  if (urlPathname === "/docs" || urlPathname.startsWith("/docs/")) {
    return {
      routeParams: { path: urlPathname },
    };
  }
  return false;
}
