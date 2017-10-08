/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

/**
 * @typedef {Object} ParticleBufferDesc
 * @property {Element} node                 - 挂载节点
 * @property {ParticleComponent} component   - 缓存组件对象
 * @property {string} id                    - 渲染父级id
 */

class ParticleBuffer {
  constructor () {
    /** @type {Array<ParticleBufferDesc>} */
    this.buffer = []
  }

  /**
   * @param {Element} node
   * @param {ParticleComponent} component
   * @return {ParticleBufferDesc}
   */
  add (node, component) {
    let buffer = this.get(node)

    if (buffer !== null) {
      return buffer
    }

    buffer = { node, component, id: this.count().toString() }
    this.buffer.push(buffer)
    return buffer
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
   * @param {ParticleComponent} component
   * @return {ParticleBuffer}
   */
  update (node, component) {
    const cache = this.get(node)
    if (cache === null) {
      return this
    }
    cache.component = component
    return this
  }

  /**
   * @param {Element} node
   * @return {?ParticleBufferDesc}
   */
  get (node) {
    const cache = this.buffer.find(cache => cache.node === node)
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

