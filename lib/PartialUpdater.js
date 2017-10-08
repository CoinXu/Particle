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
   * @param {PartialComponent} component
   * @param {Object} state
   * @param {Function} [callback]
   * @return {PartialUpdater}
   */
  enqueueState (component, state, callback) {
    component.state = Object.assign(component.state, state)
    return this.update(component)
  }

  /**
   * @param {PartialComponent} component
   * @param {Object} props
   * @param {Function} [callback]
   * @return {PartialUpdater}
   */
  enqueueProps (component, props, callback) {
    component.props = Object.assign(component.props, props)
    return this.update(component)
  }

  /**
   * 更新组件
   * @param {PartialComponent} component
   * @return {PartialUpdater}
   */
  update (component) {
    const pool = this.pool.getPool()
    pool.perform(() => this.componentUpdater(component))
    // TODO
    PartialDefaultPool.perform()
    return this
  }

  /**
   * 更新一个节点上的 PartialElement
   * @param {PartialComponent} component
   * @return {PartialUpdater}
   */
  componentUpdater (component) {
    const element = component.render()
    const node = component.$node

    const prevDOMTree = createPartialElementDOMTree(component.$element, component.$mark)
    const curDOMTree = createPartialElementDOMTree(element, component.$mark)
    const diff = comparePartialElementDOMTree(prevDOMTree, curDOMTree)

    DOMUpdater.updater(diff, node)

    // update component's element
    component.$element = element

    return this
  }
}

const PartialDefaultUpdater = new PartialUpdater()

export {
  PartialDefaultUpdater,
  PartialUpdater
}
