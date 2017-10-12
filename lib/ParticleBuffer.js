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
    /** @type {Array<ParticleRenderBufferDesc>} */
    this.buffer = []
  }

  /**
   * @param {Element} node
   * @param {string} mark
   * @param {ParticleComponent} component
   * @param {ParticleElement} element
   * @param {Object<string,ParticleElement>} DOMTree
   * @param {Object<string,Function>} EventsMap
   * @return {ParticleRenderBufferDesc}
   */
  add (node, mark, component, element, DOMTree, EventsMap) {
    let buffer = this.get(node)

    if (buffer !== null) {
      return buffer
    }

    buffer = {
      mark,
      node,
      DOMTree,
      element,
      component,
      EventsMap
    }

    this.buffer.push(buffer)
    return buffer
  }

  /**
   * @param {Element} node
   * @param {Object} props
   * @return {ParticleBuffer}
   */
  update (node, props) {
    const buffer = this.get(node)
    if (buffer === null) {
      return this
    }

    for (let propKey in props) {
      if (hasOwnProperty.call(props, propKey)) {
        buffer[propKey] = props[propKey]
      }
    }

    return this
  }

  /**
   * @param {Element} node
   * @return {ParticleBuffer}
   */
  remove (node) {
    this.buffer = this.buffer.filter(cache => cache.node !== node)
    return this
  }

  /**
   * @param {Element} node
   * @return {?ParticleRenderBufferDesc}
   */
  get (node) {
    const cache = this.buffer.find(cache => cache.node === node)
    return cache ? cache : null
  }

  /**
   * @param {ParticleComponent} component
   * @return {?ParticleRenderBufferDesc}
   */
  getByComponent (component) {
    const cache = this.buffer.find(cache => cache.component === component)
    return cache ? cache : null
  }

  /**
   * @return {Number}
   */
  count () {
    return this.buffer.length
  }

  /**
   * @return {ParticleBuffer}
   */
  destroy () {
    this.buffer = []
    return this
  }
}

const ParticleRenderBuffer = new ParticleBuffer()

export {
  ParticleRenderBuffer
}

