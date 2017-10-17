/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   17/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import { particleElementNth } from './ParticleElementMark'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'
import { markupToDOMNode } from './ParticleDOMQuery'
import { ParticleEvents } from './ParticleEvent'
import { compareParticleElement } from './ParticleCompare'

const slice = Array.prototype.slice

/**
 * @param {ParticleElement} element
 * @param {Node} parent
 * @return {Node}
 */
function addUpdater (element, parent) {
  const nth = particleElementNth(element.mark)
  const children = parent.childNodes
  const node = children[nth]

  const markup = createParticleElementEntireMarkup(element)
  const next = markupToDOMNode(markup)

  if (node) {
    parent.insertBefore(next, node)
  } else {
    parent.appendChild(next)
  }

  return next
}

/**
 *
 * @param {Node} node
 * @return {Node}
 */
function deleteNode (node) {

  if (node && node.parentNode) {
    node.parentNode.removeChild(node)
  }

  return node
}

/**
 * @param {ParticleElement} element
 * @param {Node} parent
 * @return {Node}
 */
function removeUpdater (element, parent) {
  const nth = particleElementNth(element.mark)
  const children = parent.childNodes
  const node = children[nth]

  return deleteNode(node)
}

/**
 * @param {ParticleElement} element
 * @param {Node} parent
 * @return {Node}
 */
function diffTypeUpdater (element, parent) {
  return addUpdater(element, parent)
}

/**
 * @param {Diff} diff
 * @param {Element} node
 * @return {Element}
 */
function diffPropsUpdater (diff, node) {
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
 * @param {ParticleElement} prev
 * @param {ParticleElement} cur
 * @param {Element} node
 * @return {?ParticleElement}
 */
function compareUpdater (prev, cur, node) {

  const diff = compareParticleElement(prev, cur)

  if (diff) {
    // diff type
    if (diff.type !== null) {
      diffTypeUpdater(cur, node.parentNode)
      return cur
    }

    // diff props
    if (diff.props) {
      diffPropsUpdater(diff.props, node)
    }

    if (cur.type === 'text') {
      return cur
    }
  }

  // children elements
  const children = slice.call(node.childNodes)
  const prevChildren = prev.children === null ? [] : prev.children
  const curChildren = cur.children === null ? [] : cur.children
  const length = prevChildren.length > curChildren.length ? prevChildren.length : curChildren.length

  let prevElem
  let curElem
  let nth = 0
  let elem

  for (let i = 0; i < length; i++) {
    prevElem = prevChildren[i] || null
    curElem = curChildren[i] || null
    elem = children[nth]

    // prev === cur === null
    if (prevElem === null && curElem === null) {
      continue
    }

    // add cur
    else if (prevElem === null && curElem !== null) {
      addUpdater(curElem, elem.parentNode)
      continue
    }

    // remove prev
    else if (prevElem !== null && curElem === null) {
      deleteNode(elem)
    }

    // compare current & prev
    else {
      compareUpdater(prevElem, curElem, elem)
    }

    if (prevElem !== null) {
      nth++
    }
  }

  return cur
}

/**
 * @param {?ParticleElement} prev
 * @param {?ParticleElement} cur
 * @param {Element} root
 * @return {?ParticleElement}
 */
function updater (prev, cur, root) {

  // prev === null && cur === null
  // prev === cur
  if (prev === cur) {
    return cur
  }

  // remove all elements
  if (cur === null) {
    root.innerHTML = ''
    return cur
  }

  // add new elements
  if (prev === null && cur !== null) {
    addUpdater(cur, root)
    return cur
  }

  // compare
  return compareUpdater(prev, cur, root.childNodes[0])
}

export default {
  updater
}
