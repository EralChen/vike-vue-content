import { ref } from 'vue'

const open = ref(false)
const searchTerm = ref('')

export function useCommandPalette() {
	function toggle() { open.value = !open.value }
	function close() { open.value = false; searchTerm.value = '' }
	return { open, searchTerm, toggle, close }
}
