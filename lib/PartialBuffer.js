/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

/**
 * @typedef {Object} PartialBufferDesc
 * @property {Element} node                 - 挂载节点
 * @property {PartialComponent} component   - 缓存组件对象
 * @property {string} id                    - 渲染父级id
 */

class PartialBuffer {
  constructor () {
    /** @type {Array<PartialBufferDesc>} */
    this._cacher = []
  }

  /**
   * @param {Element} node
   * @param {PartialComponent} component
   * @return {PartialBufferDesc}
   */
  add (node, component) {
    let buffer = this.get(node)

    if (buffer !== null) {
      return buffer
    }

    buffer = { node, component, id: this.count().toString() }
    this._cacher.push(buffer)
    return buffer
  }

  /**
   * @param {Element} node
   * @return {PartialBuffer}
   */
  remove (node) {
    this._cacher = this._cacher.filter(cache => cache.node !== node)
    return this
  }

  /**
   * @param {Element} node
   * @param {PartialComponent} component
   * @return {PartialBuffer}
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
   * @return {?PartialBufferDesc}
   */
  get (node) {
    const cache = this._cacher.find(cache => cache.node === node)
    return cache ? cache : null
  }

  /**
   * @return {Number}
   */
  count () {
    return this._cacher.length
  }

  /**
   * @return {PartialBuffer}
   */
  destroy () {
    this._cacher = []
    return this
  }
}

const PartialRenderBuffer = new PartialBuffer()

export {
  PartialRenderBuffer
}

