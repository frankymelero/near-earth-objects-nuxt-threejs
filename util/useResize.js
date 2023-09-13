import { onMounted, onBeforeUnmount } from 'vue';

export function useResize(handler) {
  onMounted(() => {
    window.addEventListener('resize', handler);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', handler);
  });
}