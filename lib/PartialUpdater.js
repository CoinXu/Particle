/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import { PartialRenderBuffer } from './PartialBuffer'
import { createPartialElementEntireMarkup, createPartialElementSelfMarkup } from './PartialElementMarkup'
import { sortPartialElementMark } from './PartialElementMark'
import { createPartialElementDOMTree } from './PartialDOMTree'
import { comparePartialElementDOMTree } from './PartialCompare'
import { findDOMNode, findDOMParentNode, markupToDOMNode } from './PartialDOM'

/**
 * @param {Array<string>} deleted
 * @param {Element} mountNode
 * @return {Element}
 */
function updaterForDeleted (deleted, mountNode) {
  // deleted
  deleted.forEach(mark => {
    const node = findDOMNode(mountNode, mark)
    if (node && node.parentNode) {
      node.parentNode.removeChild(node)
    }
  })
  return mountNode
}

/**
 * @param {Object} add
 * @param {Element} mountNode
 * @return {Element}
 */
function updaterForAdd (add, mountNode) {
  const markArray = Object.keys(add)
  const sorted = sortPartialElementMark(markArray)

  sorted.forEach(mark => {
    const parent = findDOMParentNode(mountNode, mark)
    const markup = createPartialElementEntireMarkup(add[mark])
    const node = markupToDOMNode(markup)
    parent.appendChild(node)
  })

  return mountNode
}

/**
 * @param {Object} diffDesc
 * @param {Element} mountNode
 * @return {Element}
 */
function updaterForDiff (diffDesc, mountNode) {
  const markArray = Object.keys(diffDesc)
  const sorted = sortPartialElementMark(markArray)

  sorted.forEach(mark => {
    const diff = diffDesc[mark]

    // 类型不同，更新元素并复制所有的子元素到新元素
    if (diff.type !== null) {
      const node = findDOMNode(mountNode, mark)
      const next = node.nextSibling
      const parent = node.parentNode
      const children = node.childNodes

      const diffNodeMarkup = createPartialElementEntireMarkup(diff)
      const diffNode = markupToDOMNode(diffNodeMarkup)

      for (let i = 0; i < children.length; i++) {
        diffNode.appendChild(children[i])
      }

      parent.insertBefore(diffNode, next)
      parent.removeChild(node)
    } else if (diff.props !== null) {
      // props 不同
      const node = findDOMNode(mountNode, mark)
      const props = diff.props
      let propKey

      // diff
      for (propKey in props.diff) {
        node.setAttribute(propKey, props.diff[propKey])
      }

      // add
      for (propKey in props.add) {
        node.setAttribute(propKey, props.add[propKey])
      }

      // deleted
      props.deleted.forEach(propKey => node.removeAttribute(propKey))
    }
  })

  return mountNode
}

/**
 * 更新 diff 到视图
 * @param {Diff} diff
 * @param {Element} mountNode
 * @return {Element}
 */
function updater (diff, mountNode) {
  updaterForDeleted(diff.deleted, mountNode)
  updaterForAdd(diff.add, mountNode)
  updaterForDiff(diff.diff, mountNode)
  return mountNode
}

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

  updater(diff, mountNode)

  return mountNode
}

export {
  mountedPartialElementUpdater
}
