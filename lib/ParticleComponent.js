/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

import { PARTIAL_ELEMENT_TYPE, DOM } from './ParticleElement'
import { ParticleDefaultUpdater } from './ParticleUpdater'

/**
 * @class ParticleComponent
 */
class ParticleComponent {
  /**
   * @param {Object} props
   * @param {ParticleUpdater} [updater]
   */
  constructor (props, updater) {
    this.$typeof = PARTIAL_ELEMENT_TYPE.COMPONENT
    this.$updater = updater || ParticleDefaultUpdater

    this.state = {}
    this.props = props || {}
  }

  /**
   * TODO callback manager
   * @param {Object} state
   * @param {Function} [callback]
   * @return {ParticleComponent}
   */
  setState (state, callback) {
    this.$updater.enqueueState(this, state, callback)
    return this
  }

  /**
   * TODO callback manager
   * @param {Object} props
   * @param {Function} [callback]
   * @return {ParticleComponent}
   */
  setProps (props, callback) {
    this.$updater.enqueueProps(this, props, callback)
    return this
  }

  /**
   * @return {ParticleElement}
   */
  render () {
    return DOM.div({}, [
      DOM.text({ text: 'Please implement render method' })
    ])
  }
}

export {
  ParticleComponent
}
