/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { ParticleRenderBuffer } from './ParticleBuffer'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'

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
    component.$updater.enqueueProps(component, component.props)
    return component
  }

  // create Component
  const DOMTree = component.render()

  // cache component
  ParticleRenderBuffer.add(mountNode, component, DOMTree)

  // mount to document
  mountNode.innerHTML = createParticleElementEntireMarkup(DOMTree)

  return component
}

export {
  render
}
