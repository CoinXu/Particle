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
function findDOMNodeBaseNth (root, nth) {
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
  return findDOMNodeBaseNth(root, particleElementMarkToArray(mark))
}

/**
 * @param {Element} root
 * @param {string} mark
 * @return {?Element}
 */
function findDOMParentNode (root, mark) {
  return findDOMNodeBaseNth(root, particleElementParentMark(mark))
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

export {
  findDOMNode,
  findDOMParentNode,
  markupToDOMNode
}
