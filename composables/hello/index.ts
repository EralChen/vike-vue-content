import { ref } from "vue";

export const useHello = () => {
  const message = ref<string>('Hello, World!');
  return message
}