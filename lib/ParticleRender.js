/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { ParticleRenderBuffer } from './ParticleBuffer'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'
import { ParticleDefaultUpdater } from './ParticleUpdater'

/**
 * 挂载 ParticleElement 到 DOM 节点
 * @param {ParticleComponent} component
 * @param {Element} mountNode
 * @return {ParticleComponent}
 */
function render (component, mountNode) {

  const buffer = ParticleRenderBuffer.get(mountNode)

  // rerender
  if (buffer !== null) {
    ParticleDefaultUpdater.enqueueProps(component, component.props)
    return component
  }

  // create Component
  const element = component.render()

  // cache component
  const buf = ParticleRenderBuffer.add(mountNode, component)

  component.$mark = buf.id
  component.$element = element
  component.$node = mountNode

  mountNode.innerHTML = createParticleElementEntireMarkup(element)

  return component
}

export {
  render
}
