import { Directive, DirectiveBinding, createApp } from 'vue'
import CustomLoading from '@/components/loading/CustomLoading.vue'

const loadingDirective: Directive = {
  mounted(el: HTMLElement & { instance: any }, binding: DirectiveBinding) {
    const app = createApp(CustomLoading)
    const instance = app.mount(document.createElement('div'))

    el.instance = instance

    if (binding.value) {
      appendEl(el)
    }
  },
  updated(el: HTMLElement & { instance: any }, binding: DirectiveBinding) {
    binding.value ? appendEl(el) : removeEl(el)
  },
  unmounted(el: HTMLElement & { instance: any }) {
    if (el.instance) {
      removeEl(el)
      el.instance = null
    }
  },
}

const appendEl = (el: HTMLElement & { instance: any }) => {
  const style = getComputedStyle(el)
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    el.style.position = 'relative'
  }
  el.appendChild(el.instance.$el)
}

const removeEl = (el: HTMLElement & { instance: any }) => {
  if (el && el.instance && el.contains(el.instance.$el)) {
    el.style.position = ''
    el.removeChild(el.instance.$el)
  }
}

export default loadingDirective
