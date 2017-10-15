/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import ParticleElementUpdater from './ParticleElementUpdater'
import { createParticleElementMark } from './ParticleDOMTree'
import { ParticleDefaultPool } from './ParticlePool'
import { ParticleDefaultCallbackQueue } from './ParticleCallbackQueue'
import { ParticleRenderBuffer } from './ParticleBuffer'

class ParticleUpdater {
  /**
   * @param {ParticlePool} [pool]
   * @param {ParticleCallbackQueue} [callbackQueue]
   */
  constructor (pool, callbackQueue) {
    this.pool = pool || ParticleDefaultPool
    this.callbackQueue = callbackQueue || ParticleDefaultCallbackQueue
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
      this.callbackQueue.enqueue(callback)
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
      this.callbackQueue.enqueue(callback)
    }
    return this.update(component)
  }

  /**
   * 更新组件
   * @param {ParticleComponent} component
   * @return {ParticleUpdater}
   */
  update (component) {
    const pool = this.pool.getPool(component)
    pool.perform(function () {
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
    const curElement = component.render()
    const buffer = ParticleRenderBuffer.getByComponent(component)
    const node = buffer.node
    const DOMTree = {}
    const element = createParticleElementMark(curElement, buffer.mark, function (element, id) {
      DOMTree[id] = element
    })

    ParticleElementUpdater.updater(buffer.element, element, node)
    ParticleRenderBuffer.update(node, { element, DOMTree })
    return this
  }
}

const ParticleDefaultUpdater = new ParticleUpdater(ParticleDefaultPool, ParticleDefaultCallbackQueue)

export {
  ParticleDefaultUpdater,
  ParticleUpdater
}
