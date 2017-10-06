/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   03/10/2017
 * @description
 */

/**
 * @param arg
 * @return {boolean}
 */
function isArray (arg) {
  return Array.isArray(arg)
}

/**
 * @param arg
 * @return {boolean}
 */
function isString (arg) {
  return typeof arg === 'string'
}

/**
 * @param arg
 * @return {boolean}
 */
function isFunction (arg) {
  return typeof arg === 'function'
}

export {
  isArray,
  isString,
  isFunction
}
