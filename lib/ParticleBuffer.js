/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'

/**
 * @typedef {Object} ParticleRenderBufferDesc
 * @property {string} mark                             - DOMTree标识
 * @property {Element} node                            - 挂载节点
 * @property {Object<string,ParticleElement>} DOMTree  - DOMTree
 * @property {Object<string,Function>} EventsMap       - EventsMap
 * @property {ParticleElement} element                 - 元素结构
 * @property {ParticleComponent} component             - 缓存组件对象
 */

class ParticleBuffer {
  constructor () {
    this.buffer = new Map()
  }

  /**
   *
   * @param {Element} node
   * @param {Object} props
   * @return {Object}
   */
  add (node, props) {
    let buffer = this.get(node)

    if (buffer !== null) {
      this.update(node, props)
      return buffer
    }

    this.buffer.set(node, props)

    return props
  }

  /**
   * @param {Element} node
   * @param {Object} props
   * @return {ParticleBuffer}
   */
  update (node, props) {
    const buffer = this.get(node)
    if (buffer === null) {
      this.add(node, props)
      return this
    }

    const next = {}
    let propKey

    for (propKey in buffer) {
      if (hasOwnProperty.call(buffer, propKey)) {
        next[propKey] = buffer[propKey]
      }
    }

    for (let propKey in props) {
      if (hasOwnProperty.call(props, propKey)) {
        next[propKey] = props[propKey]
      }
    }

    this.buffer.set(node, next)
    return this
  }

  /**
   * @param {Element} node
   * @return {ParticleBuffer}
   */
  remove (node) {
    this.buffer = this.buffer.delete(node)
    return this
  }

  /**
   * @param {Element} node
   * @return {?ParticleRenderBufferDesc}
   */
  get (node) {
    const cache = this.buffer.get(node)
    return cache ? cache : null
  }

  /**
   * @return {Number}
   */
  count () {
    return this.buffer.size
  }

  /**
   * @return {ParticleBuffer}
   */
  destroy () {
    this.buffer = new Map()
    return this
  }
}

const ParticleRenderBuffer = new ParticleBuffer()
const ParticleEventsBuffer = new ParticleBuffer()

export {
  ParticleRenderBuffer,
  ParticleEventsBuffer
}

