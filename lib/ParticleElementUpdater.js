/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   11/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import { compareParticleElement } from './ParticleCompare'
import { markupToDOMNode, findDOMNode, findDOMParentNode } from './ParticleDOMQuery'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'
import { ParticleEvents } from './ParticleEvent'

/**
 * @param {ParticleElement} element
 * @param {Element} root
 * @return {ParticleElement}
 */
function addParticleElementUpdater (element, root) {
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
function diffParticleElementTypeUpdater (element, root) {
  return addParticleElementUpdater(element, root)
}

/**
 * 同一元素属性变化
 * @param {Diff} diff
 * @param {Element} node
 * @return {Element}
 */
function diffParticleElementPropsUpdater (diff, node) {
  let propKey

  for (propKey in diff.diff) {
    if (hasOwnProperty.call(ParticleEvents, propKey)) continue
    if (propKey === 'text') {
      node.textContent = diff.diff[propKey]
      continue
    }
    node.setAttribute(propKey, diff.diff[propKey])
  }

  // add
  for (propKey in diff.add) {
    if (hasOwnProperty.call(ParticleEvents, propKey)) continue
    node.setAttribute(propKey, diff.add[propKey])
  }

  // deleted
  diff.deleted.forEach(propKey => {
    if (!hasOwnProperty.call(ParticleEvents, propKey)) {
      node.removeAttribute(propKey)
    }
  })
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
      return diffParticleElementTypeUpdater(curElement, root)
    }

    // diff props
    if (diff.props) {
      diffParticleElementPropsUpdater(diff.props, findDOMNode(root, curElement.mark))
    }
  }

  // compare children
  const prevChildren = prevElement.children !== null ? prevElement.children : []
  const curChildren = curElement.children !== null ? curElement.children : []
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
  ToAdd.forEach(element => addParticleElementUpdater(element, root))
  return curElement
}

export default {
  updater
}
