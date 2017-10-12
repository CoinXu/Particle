/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import { ParticleRenderBuffer } from './ParticleBuffer'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'
import { createParticleElementMark } from './ParticleDOMTree'
import { particleEventListener } from './ParticleEvent'

/**
 * 挂载 ParticleElement 到 DOM 节点
 * @param {ParticleComponent} component
 * @param {Element} mountNode
 * @return {ParticleComponent}
 */
function render (component, mountNode) {

  let buffer = ParticleRenderBuffer.get(mountNode)

  // rerender
  if (buffer !== null) {
    component.$updater.enqueueProps(component, component.props)
    return component
  }

  const mark = '0'
  // create Component
  let element = component.render()
  const DOMTree = {}

  element = createParticleElementMark(element, mark, function (element, id) {
    DOMTree[id] = element
  })

  const EventsMap = particleEventListener(mountNode, DOMTree)

  // cache component
  ParticleRenderBuffer.add(mountNode, mark, component, element, DOMTree, EventsMap)
  // mount to document
  mountNode.innerHTML = createParticleElementEntireMarkup(element)
  return component
}

export {
  render
}
