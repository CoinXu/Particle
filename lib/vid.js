/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   03/10/2017
 * @description DOMTree上每一个元素唯一标识
 */

const SEPARATOR = '.'

/**
 * @param {string} vid
 * @return {string}
 * @example
 * parent_vid('0')       // ''
 * parent_vid('0.1')     // '0'
 * parent_vid('0.1.1')   // '0.1'
 */
function parent_vid (vid) {
  return vid.split(SEPARATOR).slice(0, -1).join(SEPARATOR)
}

/**
 * @param {string} vid
 * @return {string}
 * @example
 * next_vid('0.1')    // '0.2'
 * next_vid('0.1.1')  // '0.1.2'
 */
function next_vid (vid) {
  const arr = vid.split(SEPARATOR)
  const last = vid.slice(-1)
  arr.push(parseInt(last) + 1)
  return arr.join(SEPARATOR)
}

/**
 * 将vid排序
 * @param {Array<string>} arr
 * @return {Array<string>}
 */
function sort_vid (arr) {
  return arr.sort()
}

export {
  parent_vid,
  next_vid,
  sort_vid
}
