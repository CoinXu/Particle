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
 * @property {Array<string>} del
 */

/**
 * 基础对象比较
 * @param {Object} base
 * @param {Object} target
 * @return {{result:Diff, has:boolean}}
 */
function compare (base, target) {
  let t1
  let t2
  let propKey
  let has = false

  const diff = noPropertiesObject({})
  const add = noPropertiesObject({})
  const del = []

  for (propKey in base) {
    if (!hasOwnProperty.call(base, propKey)) continue

    t1 = base[propKey]
    t2 = target[propKey]

    if (t2 === void 0) {
      del.push(propKey)
      has = true
      continue
    }

    if (t2 !== t1) {
      diff[propKey] = t2
      has = true
    }
  }

  for (propKey in target) {
    if (!hasOwnProperty.call(base, propKey)) continue
    if (base[propKey] === void 0) {
      add[propKey] = target[propKey]
      has = true
    }
  }

  const result = noPropertiesObject({})
  result.diff = diff
  result.add = add
  result.del = del

  return { result, has }
}

/**
 * @param {Object} base
 * @param {Object} target
 * @return {Diff}
 */
function compareDOMTree (base, target) {

  const { result, has } = compare(base, target)
  if (!has) return result

  const { diff, add, del } = result
  const diffPartialElements = noPropertiesObject({})

  let t1, t2, diffKey
  let rc, diffProps, hasDiff

  for (diffKey in diff) {
    if (!hasOwnProperty.call(diff, diffKey)) continue

    t1 = base[diffKey]
    t2 = target[diffKey]
    rc = noPropertiesObject({})
    hasDiff = false

    // 对比类型
    if (t1.type !== t2.type) {
      rc.type = t2.type
      rc.props = t2.props
      hasDiff = true
    } else {
      // 对比属性
      diffProps = compare(t1.props, t2.props)
      if (diffProps.has) {
        rc.props = diffProps.result
        hasDiff = true
      }
    }
    // TODO 对比ref\key等
    if (hasDiff) {
      diffPartialElements[diffKey] = rc
    }
  }

  return { add, del, diff: diffPartialElements }
}

export {
  compareDOMTree
}
