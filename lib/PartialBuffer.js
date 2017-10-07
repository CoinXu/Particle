/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

/**
 * @typedef {Object} PartialBufferDesc
 * @property {Element} node           - 挂载节点
 * @property {PartialElement} element
 * @property {string} id              - 渲染父级id
 */

class PartialBuffer {
  constructor () {
    /** @type {Array<PartialBufferDesc>} */
    this._cacher = []
  }

  /**
   * @param {Element} node
   * @param {PartialElement} element
   * @return {PartialBuffer}
   */
  add (node, element) {
    if (this.get(node) !== null) {
      return this
    }
    this._cacher.push({ node, element, id: this.count().toString() })
    return this
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
   * @param {PartialElement} element
   * @return {PartialBuffer}
   */
  update (node, element) {
    const cache = this.get(node)
    if (cache === null) {
      return this
    }
    cache.element = element
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

