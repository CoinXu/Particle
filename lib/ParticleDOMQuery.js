/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import { particleElementMarkToArray, particleElementParentMark } from './ParticleElementMark'

const doc = document

/**
 * @param {Element} root
 * @param {Array<string>} nth
 * @return {?Element}
 */
function findDOMNodeBaseOnNth (root, nth) {
  let node = root
  let children = node.childNodes
  let i = 0
  let length = nth.length

  while (i < length && children) {
    node = children[nth[i]]
    if (!node) {
      node = null
      break
    }
    children = node.childNodes
    i++
  }

  return node
}

/**
 * @param {Element} root
 * @param {string} mark
 * @return {?Element}
 */
function findDOMNode (root, mark) {
  return findDOMNodeBaseOnNth(root, particleElementMarkToArray(mark))
}

/**
 * @param {Element} root
 * @param {string} mark
 * @return {?Element}
 */
function findDOMParentNode (root, mark) {
  return findDOMNodeBaseOnNth(root, particleElementParentMark(mark))
}

/**
 * @param {string} str
 * @return {Node}
 */
function markupToDOMNode (str) {
  const div = doc.createElement('div')
  div.innerHTML = str
  return div.firstChild
}

/**
 * @param {Node} root
 * @param {Node} node
 * @return {Array<number>}
 */
function findDOMNodeNth (root, node) {
  const nth = []
  const RootParent = root.parentNode

  let children
  let i
  let length
  let tmp
  let parent = node.parentNode

  while (parent !== RootParent) {

    children = parent.childNodes
    length = children.length

    for (i = 0; i < length; i++) {
      tmp = children[i]
      if (tmp === node) {
        nth.push(i)
        node = node.parentNode
        parent = node.parentNode
        break
      }
    }
  }

  return nth.reverse()
}

export {
  findDOMNode,
  findDOMParentNode,
  findDOMNodeNth,
  markupToDOMNode
}
