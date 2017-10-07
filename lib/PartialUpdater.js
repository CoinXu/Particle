/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { PartialRenderBuffer } from './PartialBuffer'
import { createPartialElementDOMTree } from './PartialDOMTree'
import { comparePartialElementDOMTree } from './PartialCompare'

/**
 * 更新一个节点上的 PartialElement
 * @param {PartialElement} element
 * @param {Element} mountNode
 * @return {Element}
 */
function mountedPartialElementUpdater (element, mountNode) {
  const buffer = PartialRenderBuffer.get(mountNode)

  if (buffer === null) {
    throw new Error('No Buffer Error')
  }

  const prevDOMTree = createPartialElementDOMTree(buffer.element, buffer.id)
  const curDOMTree = createPartialElementDOMTree(element, buffer.id)

  const diff = comparePartialElementDOMTree(prevDOMTree, curDOMTree)
  console.log(diff)

  // TODO compute diff and update view
  return mountNode
}

export {
  mountedPartialElementUpdater
}
