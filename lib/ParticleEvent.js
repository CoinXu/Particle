/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   11/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import { findDOMNodeNth } from './ParticleDOMQuery'
import { particleElementParentStringMark, particleElementMarkArrayToString } from './ParticleElementMark'

const ParticleEvents = {
  onClick: 'click',
  onChange: 'change',
  onInput: 'input',

  onMouseUp: 'onmouseup',
  onMouseDown: 'mousedown',
  onMouseMove: 'mousemove',
  onMouseOver: 'mouseover',
  onMouseOut: 'mouseout'
}

/**
 * @param {string} type
 * @param {Element} root
 * @param {Event} event
 * @param {Object<string, ParticleElement>} DOMTree
 * @return {undefined}
 */
function dispatchParticleEvent (type, root, event, DOMTree) {
  let target = event.target
  let nth = findDOMNodeNth(root, target)
  let mark = particleElementMarkArrayToString(nth)
  let props

  while (mark) {
    props = DOMTree[mark].props

    if (props[type]) {
      props[type].call(target, event)
    }

    mark = particleElementParentStringMark(mark)
    target = target.parentNode
  }
}

/**
 * @param {String} type
 * @param {Element} root
 * @param {Object<string, ParticleElement>} DOMTree
 * @return {Function}
 */
function addParticleEvent (type, root, DOMTree) {
  const listener = function (event) {
    dispatchParticleEvent(type, root, event, DOMTree)
  }
  root.addEventListener(ParticleEvents[type], listener, false)
  return listener
}

/**
 * @param {Element} root
 * @param {Object<string, ParticleElement>} DOMTree
 * @return {Object}
 */
function particleEventListener (root, DOMTree) {
  // {
  //   onClick: true,
  //   onChange: true
  // }
  const EventsMap = {}

  let mark
  let propKey
  let props

  for (mark in DOMTree) {
    if (!hasOwnProperty.call(DOMTree, mark)) continue

    props = DOMTree[mark].props

    for (propKey in props) {
      if (!hasOwnProperty.call(props, propKey)) continue
      if (!hasOwnProperty.call(ParticleEvents, propKey)) continue
      if (hasOwnProperty.call(EventsMap, propKey)) continue
      
      EventsMap[propKey] = addParticleEvent(propKey, root, DOMTree)
    }
  }

  return EventsMap
}

export {
  ParticleEvents,
  particleEventListener
}
