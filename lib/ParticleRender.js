/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { ParticleDefaultUpdater } from './ParticleUpdater'

/**
 * 挂载 ParticleElement 到 DOM 节点
 * @param {ParticleComponent} component
 * @param {Element} mountNode
 * @return {ParticleComponent}
 */
function render (component, mountNode) {
  ParticleDefaultUpdater.componentRender(component, mountNode)
  return component
}

export {
  render
}
