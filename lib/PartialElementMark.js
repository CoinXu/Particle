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
function partialElementMarkToArray (mark) {
  return mark.split(SEPARATOR)
}

/**
 * @param {Array<number>} markArray
 * @return {string}
 */
function partialElementMarkArrayToString (markArray) {
  return markArray.join(SEPARATOR)
}

/**
 * @param {string} mark
 * @return {Array.<string>}
 */
function partialElementParentMark (mark) {
  return partialElementMarkToArray(mark).slice(0, -1)
}

/**
 * @param {string} mark
 * @return {Array.<string>}
 */
function partialElementNextMark (mark) {
  const arr = partialElementMarkToArray(mark)
  const last = arr.slice(-1)
  arr.push(parseInt(last) + 1)
  return arr
}

/**
 * @param {string} parent
 * @param {string} id
 * @return {string}
 */
function combinePartialElementMark (parent, id) {
  return `${parent}${SEPARATOR}${id}`
}

/**
 * @param {Array<string>} markArray
 * @return {Array.<string>}
 */
function sortPartialElementMark (markArray) {
  return markArray.sort()
}

export {
  partialElementMarkToArray,
  partialElementMarkArrayToString,
  partialElementParentMark,
  partialElementNextMark,
  combinePartialElementMark,
  sortPartialElementMark
}
