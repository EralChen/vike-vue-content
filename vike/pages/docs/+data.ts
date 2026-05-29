// https://vike.dev/data
import path from "node:path";
import { useConfig } from "vike-vue/useConfig";
import {
  queryCollection,
  queryCollectionNavigation,
  queryCollectionItemSurroundings,
} from "vike-vue-content/query";
import type { PageContextServer } from "vike/types";

export type Data = Awaited<ReturnType<typeof data>>;

export async function data(pageContext: PageContextServer) {
  const config = useConfig();
  const contentDir = path.join(process.cwd(), "content");
  const collection = "docs";
  const requestedPath = pageContext.routeParams.path ?? "/docs";

  const [page] = await queryCollection(collection, { contentDir })
    .path(requestedPath)
    .all();

  const [navigation, surroundings] = await Promise.all([
    queryCollectionNavigation(collection, { contentDir }),
    queryCollectionItemSurroundings(collection, requestedPath, { contentDir }),
  ]);

  config({
    title: page?.title ?? "Docs",
  });

  return {
    page: page ?? null,
    navigation,
    prev: surroundings[0],
    next: surroundings[1],
    requestedPath,
  };
}
