/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   03/10/2017
 * @description
 */

import { parent_vid, next_vid, sort_vid } from './vid'
import { domStringToNode, findDOMNode } from './dom'
import { renderToString } from './render'

/**
 * @param {VElement} elem
 */
function addNode (elem) {
  const p_vid = parent_vid(elem.props.vid)
  const parent = findDOMNode(p_vid)
  const n_vid = next_vid(elem.props.vid)
  const str = renderToString(elem, '')
  const node = domStringToNode(str)
  const n_node = findDOMNode(n_vid)
  parent.insertBefore(node, n_node)
}

/**
 * @param {string} vid
 */
function deleteNode (vid) {
  const p_vid = parent_vid(vid)
  const parent = findDOMNode(p_vid)
  const node = findDOMNode(vid)
  parent.removeChild(node)
}

/**
 *
 * @param {VElement} diff
 * @param {string} vid
 */
function updateNode (diff, vid) {
  const { props, type } = diff
  const node = findDOMNode(vid)

  if (type) {
    // TODO 类型不同
    // 1. 创建新的类型元素
    // 2. 将所有的子元素移到新元素下
    // 3. 更新、删除、新增属性
  } else {
    each(props.diff, (value, prop) => node.setAttribute(prop, value))
    each(props.add, (value, prop) => node.setAttribute(prop, value))
    props.del.forEach(prop => node.removeAttribute(prop))
  }
}

/**
 * @param {Object} obj
 * @param {Function} iterator
 */
function each (obj, iterator) {
  sort_vid(Object.keys(obj)).forEach(prop => iterator(obj[prop], prop, obj))
}

/**
 * @param {Diff} desc
 */
export default function (desc) {
  const { add, del, diff } = desc
  each(add, addNode)
  each(del, deleteNode)
  each(diff, updateNode)
}
