<template>
  <ul class="docs-nav">
    <li v-for="item in items" :key="item.path">
      <a
        v-if="item.page !== false"
        :href="item.path"
        :aria-current="item.path === currentPath ? 'page' : undefined"
        :class="{ 'is-active': item.path === currentPath }"
      >{{ item.title }}</a>
      <span v-else class="docs-nav-group">{{ item.title }}</span>

      <DocsNav
        v-if="item.children && item.children.length"
        :items="item.children"
        :current-path="currentPath"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ContentNavigationItem } from "vike-vue-content/query";

defineProps<{
  items: ContentNavigationItem[];
  currentPath: string;
}>();
</script>

<style scoped>
.docs-nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

.docs-nav .docs-nav {
  padding-left: 12px;
}

.docs-nav li {
  margin: 4px 0;
}

.docs-nav a {
  display: block;
  padding: 4px 8px;
  border-radius: 4px;
  color: inherit;
  text-decoration: none;
}

.docs-nav a.is-active {
  background-color: rgba(0, 0, 0, 0.08);
  font-weight: 600;
}

.docs-nav-group {
  display: block;
  padding: 4px 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.6;
}
</style>
