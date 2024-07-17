// 自定义 loading 指令
import type { App, Directive, DirectiveBinding } from 'vue'
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
}

const appendEl = (el: HTMLElement & { instance: any }) => {
  const style = getComputedStyle(el)
  // 如果父元素未进行定位，则添加定位
  if (['absolute', 'fixed', 'relative'].indexOf(style.position) === -1) {
    el.style.position = 'relative'
  }
  el.appendChild(el.instance.$el)
}

const removeEl = (el: HTMLElement & { instance: any }) => {
  el.style.position = 'static'
  el.removeChild(el.instance.$el)
}

export default loadingDirective
