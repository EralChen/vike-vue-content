// https://vike.dev/onBeforePrerenderStart
import path from "node:path";
import { queryCollectionPaths } from "vike-vue-content/query";

export async function onBeforePrerenderStart(): Promise<string[]> {
  const contentDir = path.join(process.cwd(), "content");
  return queryCollectionPaths("docs", { contentDir });
}
