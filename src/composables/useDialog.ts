import { ref, Ref } from 'vue'
export interface IDrawer {
  isVisible: Ref<boolean>
  openDialog: () => void
  closeDialog: () => void
}
export default function useDialog(): IDrawer {
  const isVisible = ref(false)
  const openDialog = () => {
    isVisible.value = true
  }
  const closeDialog = () => {
    isVisible.value = false
  }
  return { isVisible, openDialog, closeDialog }
}
