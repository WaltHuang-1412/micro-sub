import { ref, Ref } from 'vue'
export interface IDrawer {
  isVisible: Ref<boolean>
  openDrawer: () => void
  closeDrawer: () => void
}
export default function useDrawer(): IDrawer {
  const isVisible = ref(false)
  const openDrawer = () => {
    isVisible.value = true
  }
  const closeDrawer = () => {
    isVisible.value = false
  }
  return { isVisible, openDrawer, closeDrawer }
}
