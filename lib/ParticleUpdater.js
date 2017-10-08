/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { createParticleElementDOMTree } from './ParticleDOMTree'
import { compareParticleElementDOMTree } from './ParticleCompare'
import { ParticleDefaultPool } from './ParticlePool'
import { ParticleDefaultCallbackQueue } from './ParticleCallbackQueue'
import DOMUpdater from './ParticleDOM'

class ParticleUpdater {
  /**
   * @param {ParticlePool} [pool]
   */
  constructor (pool) {
    this.pool = pool || ParticleDefaultPool
  }

  /**
   * @param {ParticleComponent} component
   * @param {Object} state
   * @param {Function} [callback]
   * @return {ParticleUpdater}
   */
  enqueueState (component, state, callback) {
    component.state = Object.assign(component.state, state)
    if (callback) {
      ParticleDefaultCallbackQueue.enqueue(callback)
    }
    return this.update(component)
  }

  /**
   * @param {ParticleComponent} component
   * @param {Object} props
   * @param {Function} [callback]
   * @return {ParticleUpdater}
   */
  enqueueProps (component, props, callback) {
    component.props = Object.assign(component.props, props)
    if (callback) {
      ParticleDefaultCallbackQueue.enqueue(callback)
    }
    return this.update(component)
  }

  /**
   * 更新组件
   * @param {ParticleComponent} component
   * @return {ParticleUpdater}
   */
  update (component) {
    ParticleDefaultPool.perform(function () {
      this.componentUpdater(component)
    }, this)
    return this
  }

  /**
   * 更新一个节点上的 ParticleElement
   * @param {ParticleComponent} component
   * @return {ParticleUpdater}
   */
  componentUpdater (component) {
    const element = component.render()
    const node = component.$node

    const prevDOMTree = createParticleElementDOMTree(component.$element, component.$mark)
    const curDOMTree = createParticleElementDOMTree(element, component.$mark)
    const diff = compareParticleElementDOMTree(prevDOMTree, curDOMTree)

    DOMUpdater.updater(diff, node)

    // update component's element
    component.$element = element
    return this
  }
}

const ParticleDefaultUpdater = new ParticleUpdater()

export {
  ParticleDefaultUpdater,
  ParticleUpdater
}
