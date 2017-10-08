/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import { isArray } from './type'
import { combineParticleElementMark } from './ParticleElementMark'
import noPropertiesObject from './noPropertiesObject'

/**
 * ParticleElement 关键属性，用于对比 DOMTree，得出 Diff 结果
 * @typedef {Object} ParticleElementDesc
 * @property {string} $typeof
 * @property {string} type
 * @property {string} ref
 * @property {string} key
 * @property {Object} props
 */

/**
 * 提取 ParticleElement 关键属性
 * @param {ParticleElement} element
 * @return {ParticleElementDesc}
 */
function extractParticleElement (element) {
  return noPropertiesObject({
    $typeof: element.$typeof,
    type: element.type,
    key: element.key,
    ref: element.ref,
    props: element.props
  })
}

/**
 * 创建 ParticleElement 的 DOMTree
 * @param {ParticleElement} element
 * @param {string} id
 * @return {Object}
 */
function createParticleElementDOMTree (element, id) {
  const DOMTree = noPropertiesObject({})

  if (isArray(element.children)) {
    element.children.forEach((child, index) => {
      if (child !== null) {
        const tree = createParticleElementDOMTree(child, combineParticleElementMark(id, index.toString()))
        Object.assign(DOMTree, tree)
      }
    })
  }

  DOMTree[id] = extractParticleElement(element)
  return DOMTree
}

export {
  createParticleElementDOMTree
}
