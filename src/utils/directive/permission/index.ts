import { checkPermission } from '@/utils/permissions'
import { Directive } from 'vue'

const permissionDirective: Directive = {
  mounted(el: HTMLElement, binding) {
    const hasPermission = checkPermission(binding.value)

    if (!hasPermission) el.parentNode?.removeChild(el)
  },
}

export default permissionDirective
