/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import ParticleElementProps from './ParticleElementProps'
import noPropertiesObject from './noPropertiesObject'
import { isArray, isString, isNumber } from './type'

/**
 * Particle 库元素类型
 * @typedef {Object} ParticleElementType
 * @property {string} ELEMENT
 * @property {string} COMPONENT
 */
const PARTIAL_ELEMENT_TYPE = {
  ELEMENT: 'ELEMENT',
  COMPONENT: 'COMPONENT'
}

/**
 * @typedef {Object} ParticleElement
 * @property {string} $typeof
 * @property {?string} mark
 * @property {?string} type
 * @property {?string} key
 * @property {?string} ref
 * @property {Object} props
 * @property {?Array<ParticleElement>|string} children
 */

/**
 * @param {string} type
 * @param {?string} key
 * @param {?string} ref
 * @param {Object} props
 * @param {?Array<ParticleElement|string>} children
 * @return {ParticleElement}
 */
function createParticleElement (type, key, ref, props, children) {
  return noPropertiesObject({
    $typeof: PARTIAL_ELEMENT_TYPE.ELEMENT,
    mark: null,
    type,
    key,
    ref,
    props,
    children: children === void 0 ? null : children
  })
}

/**
 * @param {string} type
 * @param {Object} props
 * @param {?Array<ParticleElement|string>} children
 * @return {ParticleElement}
 */
function createTypedElement (type, props, children) {
  let key = null
  let ref = null

  if (ParticleElementProps.validPropKey(props.key)) {
    key = props.key
  }

  if (ParticleElementProps.validPropRef(props.ref)) {
    ref = props.ref
  }

  let elementProps = noPropertiesObject({})
  let propKey

  for (propKey in props) {
    if (!ParticleElementProps.PrivateProps[propKey] && hasOwnProperty.call(props, propKey)) {
      elementProps[propKey] = props[propKey]
    }
  }

  return createParticleElement(type, key, ref, elementProps, children)
}

/**
 * @param {ParticleComponent} Component
 * @param {Object} [props]
 * @return {ParticleComponent}
 */
function createParticleComponent (Component, props) {
  const component = new Component(props)
  if (component.$typeof !== PARTIAL_ELEMENT_TYPE.COMPONENT) {
    throw new TypeError('Component $typeof property must PARTIAL_ELEMENT_TYPE.COMPONENT')
  }
  return component
}

/**
 * @param {ParticleElement|string|Array<ParticleElement|string>} child
 * @return {Array<ParticleElement>}
 */
function elementCreator (child) {
  if (isString(child) || isNumber(child)) {
    return [createParticleElement('text', null, null, { text: child }, null)]
  }

  if (isArray(child)) {
    return child.map(child => elementCreator(child))
  }

  return child
}

/**
 * @param {string|ParticleComponent} typeOrComponent
 * @param {Object} [props]
 * @param {?Array<ParticleElement|string>} [children]
 * @return {ParticleElement|ParticleComponent}
 */
function createElement (typeOrComponent, props, children) {

  const length = arguments.length - 2

  if (length === 1) {
    children = elementCreator(children)
  } else if (length > 1) {
    children = []
    for (let i = 0; i < length; i++) {
      children = children.concat(elementCreator(arguments[i + 2]))
    }
  }

  if (props === null) {
    props = noPropertiesObject({})
  }

  // string element
  if (isString(typeOrComponent)) {
    return createTypedElement(typeOrComponent, props, children)
  }
  // component
  return createParticleComponent(typeOrComponent, props)
}

export {
  PARTIAL_ELEMENT_TYPE,
  createElement
}

