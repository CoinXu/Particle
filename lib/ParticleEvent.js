/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   11/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import { findDOMNodeNth } from './ParticleDOMQuery'
import { particleElementParentStringMark, particleElementMarkArrayToString } from './ParticleElementMark'
import { ParticleRenderBuffer, ParticleEventsBuffer } from './ParticleBuffer'

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
 * @return {undefined}
 */
function dispatchParticleEvent (type, root, event) {
  const buffer = ParticleRenderBuffer.get(root)

  if (buffer === null) {
    return
  }

  const DOMTree = buffer.DOMTree
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
 * @return {?Function}
 */
function add (type, root) {
  const events = ParticleEventsBuffer.get(root)

  if (!hasOwnProperty.call(ParticleEvents, type)) {
    return null
  }

  if (hasOwnProperty.call(events, type)) {
    ParticleEventsBuffer.update(root, { [type]: (events[type] || 0) + 1 })
    return null
  }

  return attach(type, root)
}

/**
 * @param {string} type
 * @param {Node} root
 * @return {function}
 */
function attach (type, root) {
  const listener = function (event) {
    dispatchParticleEvent(type, root, event)
  }
  root.addEventListener(ParticleEvents[type], listener, false)
  ParticleEventsBuffer.update(root, { [type]: 1 })
  return listener
}

/**
 * @param {string} type
 * @param {Element} root
 * @param {function} fn
 */
function remove (type, root, fn) {
  const events = ParticleEventsBuffer.get(root)

  if (!hasOwnProperty.call(events, type)) {
    return null
  }

  const count = events[type]
  if (count === 0) {
    return null
  }

  if (count === 1) {
    ParticleEventsBuffer.update(root, { [type]: 0 })
    root.removeEventListener(ParticleEvents[type], events.EventsMap[type])
    return null
  }

  ParticleEventsBuffer.update(root, { [type]: count - 1 })
  return null
}

/**
 * @param {Element} root
 * @param {Object<string, ParticleElement>} DOMTree
 * @return {Object}
 */
function particleEventListener (root, DOMTree) {
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

      if (hasOwnProperty.call(EventsMap, propKey)) {
        add(propKey, root)
        continue
      }

      EventsMap[propKey] = attach(propKey, root)
    }
  }

  ParticleEventsBuffer.add(root, { EventsMap })
  return EventsMap
}

export {
  ParticleEvents,
  particleEventListener,
  add,
  remove
}
