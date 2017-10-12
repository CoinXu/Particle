/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

import { isFunction } from './type'
import { ParticleDefaultCallbackQueue } from './ParticleCallbackQueue'

/**
 * @class
 * @desc Pool任务类，用于缓存Pool任务
 */
class ParticlePoolTask {

  /**
   * @param {ParticleCallbackQueue} [callbackQueue]
   */
  constructor (callbackQueue) {
    this.task = null
    this.context = null
    this.timmer = null
    this.callbackQueue = callbackQueue || ParticleDefaultCallbackQueue
  }

  /**
   * 取消之前的任务
   * @return {ParticlePoolTask}
   */
  cancelTask () {
    if (this.timmer !== null) {
      clearTimeout(this.timmer)
      this.timmer = null
    }
    return this
  }

  /**
   * 初始化任务
   * @param {Function} task
   * @param {*} [context]
   * @return {ParticlePoolTask}
   */
  perform (task, context) {
    this.cancelTask()

    this.task = task
    if (context !== void 0) {
      this.context = context
    }

    this.timmer = setTimeout(() => this.run(), 0)
    return this
  }

  /**
   * 执行任务
   * @return {ParticlePoolTask}
   */
  run () {
    if (isFunction(this.task)) {
      this.task.call(this.context)
    }
    this.callbackQueue.applyAll()
    this.reset()
    return this
  }

  /**
   * 重置任务
   * @return {ParticlePoolTask}
   */
  reset () {
    this.task = null
    this.context = null
    this.cancelTask()
    return this
  }
}

/**
 * @class
 * @desc 异步更新池
 */
class ParticlePool {

  /**
   * @param {ParticleCallbackQueue} [callbackQueue]
   */
  constructor (callbackQueue) {
    /** @type {Array<{pool:ParticlePoolTask, key:*}>} */
    this.pools = []
    this.callbackQueue = callbackQueue || ParticleDefaultCallbackQueue
  }

  /**
   * 获取一个线程
   * @property {*} key
   * @return {ParticlePoolTask}
   */
  getPool (key) {
    let record = this.pools.find(p => p.key === key)
    if (record) {
      return record.pool
    }
    let pool = new ParticlePoolTask(this.callbackQueue)
    this.pools.push({ pool, key })
    return pool
  }
}

const ParticleDefaultPool = new ParticlePool()

export {
  ParticleDefaultPool,
  ParticlePool
}
