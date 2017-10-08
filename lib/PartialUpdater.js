/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { PartialRenderBuffer } from './PartialBuffer'
import { createPartialElementDOMTree } from './PartialDOMTree'
import { comparePartialElementDOMTree } from './PartialCompare'
import { PartialDefaultPool } from './PartialPool'
import DOMUpdater from './PartialDOM'

class PartialUpdater {
  /**
   * @param {PartialPool} [pool]
   */
  constructor (pool) {
    this.pool = pool || PartialDefaultPool
  }

  /**
   * @param {Object} state
   * @param {PartialComponent} component
   * @return {PartialUpdater}
   */
  enqueue (component, state) {
    const pool = this.pool.getPool()

    pool.perform(function () {
      this.componentUpdater(component, state)
    }, component)

    return this
  }

  /**
   * 更新一个节点上的 PartialElement
   * @param {PartialComponent} component
   * @param {Object} state
   * @return {PartialUpdater}
   */
  componentUpdater (component, state) {
    component.state = Object.assign(component.state, state)

    const element = component.render()
    const node = component.node
    const buffer = PartialRenderBuffer.get(node)

    if (buffer === null) {
      throw new Error('No Buffer Error')
    }

    const prevDOMTree = createPartialElementDOMTree(buffer.element, buffer.id)
    const curDOMTree = createPartialElementDOMTree(element, buffer.id)
    const diff = comparePartialElementDOMTree(prevDOMTree, curDOMTree)

    DOMUpdater.updater(diff, node)

    return this
  }
}

const PartialDefaultUpdater = new PartialUpdater()

export {
  PartialDefaultUpdater
}
