/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import { isArray } from './type'
import noPropertiesObject from './noPropertiesObject'
import { combinePartialElementMark } from './PartialElementMark'

/**
 * PartialElement 关键属性，用于对比 DOMTree，得出 Diff 结果
 * @typedef {Object} PartialElementDesc
 * @property {string} $typeof
 * @property {string} type
 * @property {string} ref
 * @property {string} key
 * @property {Object} props
 */

/**
 * 提取 PartialElement 关键属性
 * @param {PartialElement} element
 * @return {PartialElementDesc}
 */
function extractPartialElement (element) {
  return noPropertiesObject({
    $typeof: element.$typeof,
    type: element.type,
    key: element.key,
    ref: element.ref,
    props: element.props
  })
}

/**
 * 创建 PartialElement 的 DOMTree
 * @param {PartialElement} element
 * @param {string} id
 * @return {Object}
 */
function createPartialElementDOMTree (element, id) {
  const DOMTree = noPropertiesObject({})

  if (isArray(element.children)) {
    element.children.forEach((child, index) => {
      const tree = createPartialElementDOMTree(child, combinePartialElementMark(id, index.toString()))
      Object.assign(DOMTree, tree)
    })
  }

  DOMTree[id] = extractPartialElement(element)
  return DOMTree
}

export {
  createPartialElementDOMTree
}
