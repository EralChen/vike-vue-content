import type { Config } from "vike/types";
import vikeVue from "vike-vue/config";
import vikeVueContent from "vike-vue-content/config";

// Default config (can be overridden by pages)
// https://vike.dev/config

export default {
  // https://vike.dev/head-tags
  title: "My Vike App",
  description: "Demo showcasing Vike",
  prerender: true,
  extends: [vikeVue, vikeVueContent],
} as Config;
