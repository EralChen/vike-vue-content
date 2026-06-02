/**
 * 滚动监听——核心逻辑搬自 Nuxt UI 的 `useScrollspy`
 * (@nuxt/ui/dist/runtime/composables/useScrollspy.js)。
 *
 * 用单个常驻的 IntersectionObserver 收集“当前视口内可见的标题集合”，把它们
 * 整体作为 active，于是目录高亮是一段连续区间而非单项；当视口内没有任何标题
 * 时（停在两个标题之间的长段落），保留上一次的可见集合，避免高亮闪烁。
 */
export declare function useScrollspy(): {
    visibleHeadings: import("vue").Ref<string[], string[]>;
    activeHeadings: import("vue").Ref<string[], string[]>;
    updateHeadings: (headings: Element[]) => void;
};
