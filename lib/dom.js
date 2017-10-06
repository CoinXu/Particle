/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   03/10/2017
 * @description
 */

const doc = document

/**
 * TODO use createFragmentDocument
 * @param {string} str
 * @return {Node}
 */
function domStringToNode (str) {
  const div = doc.createElement('div')
  div.innerHTML = str
  return div.firstChild
}

/**
 * @param {string} vid
 * @return {Element}
 */
function findDOMNode (vid) {
  return doc.querySelector(`[vid="${vid}"]`)
}

export {
  domStringToNode,
  findDOMNode
}
