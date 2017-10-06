/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   05/10/2017
 * @description
 */

/**
 * @param {Object} object
 * @return {Object}
 */
function noPropertiesObject (object) {
  object.__proto__ = null
  return object
}

export default noPropertiesObject