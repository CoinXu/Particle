/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   11/10/2017
 * @description
 */

import { compareParticleElement } from './ParticleCompare'
import { markupToDOMNode, findDOMNode, findDOMParentNode } from './ParticleDOMQuery'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'
import { isArray } from './type'

/**
 * @param {ParticleElement} element
 * @param {Element} root
 * @return {ParticleElement}
 */
function addElementUpdater (element, root) {
  const parent = findDOMParentNode(root, element.mark)
  const node = findDOMNode(root, element.mark)
  const markup = createParticleElementEntireMarkup(element)
  const next = markupToDOMNode(markup)

  if (node) {
    parent.insertBefore(next, node)
  } else {
    parent.appendChild(next)
  }
  return element
}

/**
 * @param {Element} node
 * @return {undefined}
 */
function deleteNode (node) {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node)
  }
}

/**
 * 类型不同，更新元素并复制所有的子元素到新元素
 * @param {ParticleElement} element
 * @param {Element} root
 * @return {ParticleElement}
 */
function diffTypeUpdater (element, root) {
  return addElementUpdater(element, root)
}

/**
 * 同一元素属性变化
 * @param {Diff} diff
 * @param {Element} node
 * @return {Element}
 */
function diffPropsUpdater (diff, node) {
  let propKey

  for (propKey in diff.diff) {
    if (propKey === 'text') {
      node.textContent = diff.diff[propKey]
      continue
    }
    node.setAttribute(propKey, diff.diff[propKey])
  }

  // add
  for (propKey in diff.add) {
    node.setAttribute(propKey, diff.add[propKey])
  }

  // deleted
  diff.deleted.forEach(propKey => node.removeAttribute(propKey))
  return node
}

/**
 *
 * @param {ParticleElement} prevElement
 * @param {ParticleElement} curElement
 * @param {Element} root
 * @return {ParticleElement}
 */
function updater (prevElement, curElement, root) {
  const diff = compareParticleElement(prevElement, curElement)

  if (diff) {
    // diff type
    if (diff.type !== null) {
      return diffTypeUpdater(curElement, root)
    }

    // diff props
    if (diff.props) {
      diffPropsUpdater(diff.props, findDOMNode(root, curElement.mark))
    }
  }

  // compare children
  const prevChildren = isArray(prevElement.children) ? prevElement.children : [prevElement.children]
  const curChildren = isArray(curElement.children) ? curElement.children : [curElement.children]
  const length = prevChildren.length > curChildren.length ? prevChildren.length : curChildren.length
  const ToDelete = []
  const ToAdd = []

  let i
  let prevChild
  let curChild

  for (i = 0; i < length; i++) {
    prevChild = prevChildren[i]
    curChild = curChildren[i]

    if (!prevChild && curChild) {
      // to add
      ToAdd.push(curChild)
    } else if (prevChild && !curChild) {
      // to deleted
      ToDelete.push(findDOMNode(root, prevChild.mark))
    } else if (prevChild && curChild) {
      updater(prevChild, curChild, root)
    }
  }

  ToDelete.forEach(deleteNode)
  ToAdd.forEach(element => addElementUpdater(element, root))
  return curElement
}

export default {
  updater
}
