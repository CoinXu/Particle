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
 * @return {?Diff}
 */
function objectCompare (base, target) {

  const diff = noPropertiesObject({})
  const add = noPropertiesObject({})
  const deleted = []

  let vb
  let vt
  let propKey
  let findDiff = false

  for (propKey in base) {
    if (!hasOwnProperty.call(base, propKey)) continue

    vb = base[propKey]
    vt = target[propKey]

    if (!hasOwnProperty.call(target, propKey)) {
      deleted.push(propKey)
      findDiff = true
      continue
    }

    if (vt !== vb) {
      diff[propKey] = vt
      findDiff = true
    }
  }

  for (propKey in target) {
    if (!hasOwnProperty.call(target, propKey)) continue
    if (!hasOwnProperty.call(base, propKey)) {
      add[propKey] = target[propKey]
      findDiff = true
    }
  }

  return findDiff ? noPropertiesObject({ diff, add, deleted }) : null
}

/**
 * @typedef {Object} ParticleElementDiff
 * @property {?string} $typeof
 * @property {?string} type
 * @property {?string} key
 * @property {?string} ref
 * @property {?Diff} props
 */

/**
 * @param {ParticleElement} base
 * @param {ParticleElement} target
 * @return {?ParticleElementDiff}
 */
function compareParticleElement (base, target) {

  let findDiff = false

  const diff = noPropertiesObject({
    $typeof: null,
    type: null,
    key: null,
    ref: null,
    props: null
  })

  if (base.type !== target.type || base.$typeof !== target.$typeof) {
    diff.$typeof = target.$typeof
    diff.type = target.type
    diff.key = target.key
    diff.ref = target.ref
    diff.props = target.props
    return diff
  }
  // compare key

  if (base.key !== target.key) {
    diff.key = target.key
    findDiff = true
  }

  // compare ref
  if (base.ref !== target.ref) {
    diff.ref = target.ref
    findDiff = true
  }

  // compare props
  let diffProps = objectCompare(base.props, target.props)
  if (diffProps) {
    findDiff = true
    diff.props = diffProps
  }

  return findDiff ? diff : null
}

/**
 * @param {Object<ParticleElement>} base
 * @param {Object<ParticleElement>} target
 * @return {Diff}
 */
function compareParticleElementDOMTree (base, target) {
  const diff = noPropertiesObject({})
  const add = noPropertiesObject({})
  const deleted = []

  let propKey
  let findDiff

  // diff and deleted
  for (propKey in base) {
    if (!hasOwnProperty.call(base, propKey)) continue

    // deleted
    if (!hasOwnProperty.call(target, propKey)) {
      deleted.push(propKey)
      continue
    }

    findDiff = compareParticleElement(base[propKey], target[propKey])
    if (findDiff) {
      diff[propKey] = findDiff
    }
  }

  // add
  for (propKey in target) {
    if (hasOwnProperty.call(base, propKey)) continue
    add[propKey] = target[propKey]
  }

  return { diff, add, deleted }
}

export {
  compareParticleElementDOMTree
}
