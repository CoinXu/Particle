/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   05/10/2017
 * @description
 */

import { isString } from './type'

export default {

  /**
   * @param {*} propKey
   * @return {boolean}
   */
  validPropKey (propKey) {
    return isString(propKey)
  },

  /**
   * @param {*} propRef
   * @return {boolean}
   */
  validPropRef (propRef) {
    return isString(propRef)
  },

  PrivateProps: {
    key: true,
    ref: true
  }
}