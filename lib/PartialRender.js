/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { PartialRenderBuffer } from './PartialBuffer'
import { createPartialElementEntireMarkup } from './PartialElementMarkup'
import { mountedPartialElementUpdater } from './PartialUpdater'

/**
 * 挂载 PartialElement 到 DOM 节点
 * @param {PartialElement} element
 * @param {Element} mountNode
 * @return {Element}
 */
function render (element, mountNode) {

  const buffer = PartialRenderBuffer.get(mountNode)

  if (buffer !== null) {
    return mountedPartialElementUpdater(element, mountNode)
  }

  PartialRenderBuffer.add(mountNode, element)
  mountNode.innerHTML = createPartialElementEntireMarkup(element)
  return mountNode
}

export {
  render
}
