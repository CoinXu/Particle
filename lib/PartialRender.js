/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { PartialRenderBuffer } from './PartialBuffer'
import { createPartialElementEntireMarkup } from './PartialElementMarkup'
import { PartialDefaultUpdater } from './PartialUpdater'

/**
 * 挂载 PartialElement 到 DOM 节点
 * @param {PartialComponent} component
 * @param {Element} mountNode
 * @return {PartialComponent}
 */
function render (component, mountNode) {

  const buffer = PartialRenderBuffer.get(mountNode)

  // rerender
  if (buffer !== null) {
    PartialDefaultUpdater.enqueueProps(component, component.props)
    return component
  }

  // create Component
  const element = component.render()

  // cache component
  const buf = PartialRenderBuffer.add(mountNode, component)

  component.$mark = buf.id
  component.$element = element
  component.$node = mountNode

  mountNode.innerHTML = createPartialElementEntireMarkup(element)

  return component
}

export {
  render
}
