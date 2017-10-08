/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

import { DOM } from './PartialElement'

class PartialComponent {
  constructor (props, updater) {
    this.node = null
    this.state = null
    this.props = props
    this.updater = updater
  }

  /**
   * TODO callback manager
   * @param {Object} state
   * @param {Function} [callback]
   * @return {PartialComponent}
   */
  setState (state, callback) {
    this.updater.enqueue(this, state)
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