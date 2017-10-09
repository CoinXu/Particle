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

  constructor () {
    this.task = null
    this.context = null
  }

  /**
   * 初始化任务
   * @param {Function} task
   * @param {*} [context]
   * @return {ParticlePoolTask}
   */
  perform (task, context) {
    this.task = task
    if (context !== void 0) {
      this.context = context
    }
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
    return this
  }

  /**
   * 是否为空闲任务
   * @return {boolean}
   */
  isIdle () {
    return this.task === null
  }
}

/**
 * @class
 * @desc 异步更新池
 */
class ParticlePool {

  constructor () {
    /** @type {Array<ParticlePoolTask>} */
    this.pools = []
  }

  /**
   * 获取一个线程
   * @return {ParticlePoolTask}
   */
  getPool () {
    let pool = this.pools.find(p => p.isIdle())
    if (pool) {
      return pool
    }
    pool = new ParticlePoolTask()
    this.pools.push(pool)
    return pool
  }

  /**
   * 释放一个pool
   * @param {ParticlePoolTask} pool
   * @return {ParticlePool}
   */
  release (pool) {
    pool.reset()
    return this
  }

  /**
   * 运行所有的task
   * @param {Function} task
   * @param {*} context
   * @return {ParticlePool}
   */
  perform (task, context) {
    this.getPool().perform(task, context)
    this.pools.forEach(pool => setTimeout(() => {

      pool.run()

      // 如果全都执行完成了，则执行回调
      if (this.pools.every(pool => pool.isIdle())) {
        ParticleDefaultCallbackQueue.applyAll()
      }

    }, 0))
    return this
  }
}

const ParticleDefaultPool = new ParticlePool()

export {
  ParticleDefaultPool,
  ParticlePool
}