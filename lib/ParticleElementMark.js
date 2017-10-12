/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

const SEPARATOR = '.'

/**
 * @param {string} mark
 * @return {Array<string>}
 */
function particleElementMarkToArray (mark) {
  return mark.split(SEPARATOR)
}

/**
 * @param {Array<number>} markArray
 * @return {string}
 */
function particleElementMarkArrayToString (markArray) {
  return markArray.join(SEPARATOR)
}

/**
 * @param {string} mark
 * @return {Array.<string>}
 */
function particleElementParentMark (mark) {
  return particleElementMarkToArray(mark).slice(0, -1)
}

/**
 * @param {string} mark
 * @return {string}
 */
function particleElementParentStringMark (mark) {
  return particleElementMarkArrayToString(particleElementParentMark(mark))
}

/**
 * @param {string} mark
 * @return {Array.<string>}
 */
function particleElementNextMark (mark) {
  const arr = particleElementMarkToArray(mark)
  const last = arr.slice(-1)
  arr.push(parseInt(last) + 1)
  return arr
}

/**
 * @param {string} mark
 * @return {string}
 */
function particleElementNextStringMark (mark) {
  return particleElementMarkArrayToString(particleElementNextMark(mark))
}

/**
 * @param {string} parent
 * @param {string} id
 * @return {string}
 */
function combineParticleElementMark (parent, id) {
  return `${parent}${SEPARATOR}${id}`
}

/**
 * @param {Array<string>} markArray
 * @return {Array.<string>}
 */
function sortParticleElementMark (markArray) {
  return markArray.sort()
}

/**
 * @param {string} compare
 * @param {string} base
 * @return {boolean}
 */
function particleElementContains (compare, base) {
  // 只要mark的前面为parent，则parent一定是其父元素
  // 如 0.0.1 的子元素可能为：
  // 0.0.1.0
  // 0.0.1.1.0
  // 0.0.1.2.2.3
  // 但一定不可能是 0.0.2.0

  if (compare === base) {
    return false
  }

  return base.indexOf(compare) === 0
}

export {
  particleElementMarkToArray,
  particleElementMarkArrayToString,
  particleElementParentMark,
  particleElementParentStringMark,
  particleElementNextMark,
  particleElementNextStringMark,
  combineParticleElementMark,
  sortParticleElementMark,
  particleElementContains
}
