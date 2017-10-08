/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import noPropertiesObject from './noPropertiesObject'
import hasOwnProperty from './hasOwnProperty'

/**
 * @typedef {Object} Diff
 * @property {Object} diff
 * @property {Object} add
 * @property {Array<string>} deleted
 */

/**
 * 基础对象比较
 * @param {Object} base
 * @param {Object} target
 * @return {{result: Diff, hasDiff:boolean}}
 */
function objectCompare (base, target) {

  const diff = noPropertiesObject({})
  const add = noPropertiesObject({})
  const deleted = []

  let vb
  let vt
  let propKey
  let hasDiff = false

  for (propKey in base) {
    if (!hasOwnProperty.call(base, propKey)) continue

    vb = base[propKey]
    vt = target[propKey]

    if (!hasOwnProperty.call(target, propKey)) {
      deleted.push(propKey)
      hasDiff = true
      continue
    }

    if (vt !== vb) {
      diff[propKey] = vt
      hasDiff = true
    }
  }

  for (propKey in target) {
    if (!hasOwnProperty.call(target, propKey)) continue
    if (!hasOwnProperty.call(base, propKey)) {
      add[propKey] = target[propKey]
      hasDiff = true
    }
  }

  return { result: noPropertiesObject({ diff, add, deleted }), hasDiff }
}

/**
 * @typedef {Object} PartialElementDiff
 * @property {?string} $typeof
 * @property {?string} type
 * @property {?string} key
 * @property {?string} ref
 * @property {?Diff} props
 */

/**
 * @param {Object<PartialElement>} base
 * @param {Object<PartialElement>} target
 * @return {Diff}
 */
function comparePartialElementDOMTree (base, target) {
  const Diff = {
    diff: noPropertiesObject({}),
    add: noPropertiesObject({}),
    deleted: []
  }

  let propKey
  let vb
  let vt
  let tmp
  let diff

  // diff and deleted
  for (propKey in base) {
    if (!hasOwnProperty.call(base, propKey)) continue
    vb = base[propKey]
    vt = target[propKey]

    // deleted
    if (!hasOwnProperty.call(target, propKey)) {
      Diff.deleted.push(propKey)
      continue
    }

    diff = noPropertiesObject({
      $typeof: null,
      type: null,
      key: null,
      ref: null,
      props: null
    })

    // compare type
    // 如果类型不同，则认为是完全不同的两个元素，使用目标元素描述
    if (vb.type !== vt.type || vb.$typeof !== vt.$typeof) {
      diff.$typeof = vt.$typeof
      diff.type = vt.type
      diff.key = vt.key
      diff.ref = vt.ref
      diff.props = vt.props
      Diff.diff[propKey] = diff
      continue
    }

    // compare key
    if (vb.key !== vt.key) {
      diff.key = vt.key
      Diff.diff[propKey] = diff
    }

    // compare ref
    if (vb.ref !== vt.ref) {
      diff.ref = vt.ref
      Diff.diff[propKey] = diff
    }

    // compare props
    tmp = objectCompare(vb.props, vt.props)
    if (tmp.hasDiff) {
      diff.props = tmp.result
      Diff.diff[propKey] = diff
    }
  }

  // add
  for (propKey in target) {
    if (hasOwnProperty.call(base, propKey)) continue
    Diff.add[propKey] = target[propKey]
  }

  return Diff
}

export {
  comparePartialElementDOMTree
}
