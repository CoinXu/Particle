/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

class ParticleCallbackQueue {

  constructor () {
    this.callbacks = []
    this.contexts = []
  }

  /**
   * 添加callback
   * @param {Function} callback
   * @param {*} [context]
   * @return {ParticleCallbackQueue}
   */
  enqueue (callback, context) {
    this.callbacks.push(callback)
    this.contexts.push(context)
    return this
  }

  /**
   * 执行所有的回调
   * @return {ParticleCallbackQueue}
   */
  applyAll () {
    this.callbacks.forEach((callback, index) => {
      try {
        callback.call(this.contexts[index])
      } catch (e) {
        // TODO ParticleDebugger
      }
    })
    this.reset()
    return this
  }

  /**
   * 重置
   * @return {ParticleCallbackQueue}
   */
  reset () {
    this.callbacks = []
    this.contexts = []
    return this
  }
}

const ParticleDefaultCallbackQueue = new ParticleCallbackQueue()

export {
  ParticleCallbackQueue,
  ParticleDefaultCallbackQueue
}
