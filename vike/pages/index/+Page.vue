<template>
  <section v-if="docsPage" style="margin-top: 24px">
    <h2>{{ docsPage.title || 'Untitled' }}</h2>
    <p v-if="docsPage.description">{{ docsPage.description }}</p>
    <p><strong>Path:</strong> {{ docsPage.path }}</p>
    <ContentRenderer :tree="docsPage.body" />
  </section>
</template>

<script setup lang="ts">
import { ContentRenderer } from "vike-vue-content/components/content-renderer";
import Counter from "../../components/Counter.vue";
import { useData } from "vike-vue/useData";
import type { Data } from "./+data";

const { docsPage } = useData<Data>();
</script>
