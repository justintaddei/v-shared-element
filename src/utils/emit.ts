import { VNode } from 'vue/types/vnode'

/**
 *  Helper function to emit vue compatible events
 */
export function $emit(vnode: VNode, name: string, data: any) {
  const handlers = vnode.data?.on ?? vnode.componentOptions?.listeners
  handlers?.[name].fns(data)
}
