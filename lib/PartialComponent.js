/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

import { PARTIAL_ELEMENT_TYPE, DOM } from './PartialElement'
import { PartialDefaultUpdater } from './PartialUpdater'

class PartialComponent {
  /**
   * @param {Object} props
   * @param {PartialUpdater} [updater]
   */
  constructor (props, updater) {
    this.$typeof = PARTIAL_ELEMENT_TYPE.COMPONENT
    this.$mark = null
    this.$element = null
    this.$node = null
    this.$updater = updater || PartialDefaultUpdater

    this.state = null
    this.props = props || {}
  }

  /**
   * TODO callback manager
   * @param {Object} state
   * @param {Function} [callback]
   * @return {PartialComponent}
   */
  setState (state, callback) {
    this.$updater.enqueueState(this, state, callback)
    return this
  }

  /**
   * TODO callback manager
   * @param {Object} props
   * @param {Function} [callback]
   * @return {PartialComponent}
   */
  setProps (props, callback) {
    this.$updater.enqueueProps(this, props, callback)
    return this
  }

  /**
   * @return {PartialElement}
   */
  render () {
    return DOM.div({}, [
      DOM.text({ text: 'Please implement render method' })
    ])
  }
}

export {
  PartialComponent
}
