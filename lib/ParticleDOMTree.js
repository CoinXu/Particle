/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import { isArray } from './type'
import { combineParticleElementMark } from './ParticleElementMark'

/**
 * @param {ParticleElement} element
 * @param {string} id
 * @param {Function} [listener]
 * @return {ParticleElement}
 */
function createParticleElementMark (element, id, listener) {

  element.mark = id

  if (listener) {
    listener(element, id)
  }

  if (isArray(element.children) && element.children.length > 0) {
    let counter = 0
    element.children.forEach(child => {
      if (child !== null) {
        createParticleElementMark(
          child,
          combineParticleElementMark(id, counter.toString()),
          listener
        )
        counter++
      }
    })
  }

  return element
}

export {
  createParticleElementMark
}
