/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

import { isFunction } from './type'

/**
 * @class
 * @desc Pool任务类，用于缓存Pool任务
 */
class PartialPoolTask {

  constructor () {
    this.task = null
    this.context = null
  }

  /**
   * 初始化任务
   * @param {Function} task
   * @param {*} [context]
   * @return {PartialPoolTask}
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
   * @return {PartialPoolTask}
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
   * @return {PartialPoolTask}
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
class PartialPool {

  constructor () {
    /** @type {Array<PartialPoolTask>} */
    this.pools = []
  }

  /**
   * 获取一个线程
   * @return {PartialPoolTask}
   */
  getPool () {
    let pool = this.pools.find(p => p.isIdle())
    if (pool) {
      return pool
    }
    pool = new PartialPoolTask()
    this.pools.push(pool)
    return pool
  }

  /**
   * 释放一个pool
   * @param {PartialPoolTask} pool
   * @return {PartialPool}
   */
  release (pool) {
    pool.reset()
    return this
  }

  /**
   * 运行所有的task
   * @return {PartialPool}
   */
  perform () {
    this.pools.forEach(pool => setTimeout(() => {
      pool.run()
      this.release(pool)
    }, 0))
    return this
  }
}

const PartialDefaultPool = new PartialPool()

export {
  PartialDefaultPool,
  PartialPool
}
