/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { isString } from './type'
import hasOwnProperty from './hasOwnProperty'
import ParticleElementProps from './ParticleElementProps'
import noPropertiesObject from './noPropertiesObject'

/**
 * Particle 库元素类型
 * @typedef {Object} ParticleElementType
 * @property {string} ELEMENT
 * @property {string} COMPONENT
 */
const PARTIAL_ELEMENT_TYPE = {
  ELEMENT: 'E',
  COMPONENT: 'C'
}

/**
 * @typedef {Object} ParticleElement
 * @property {string} $typeof
 * @property {string} type
 * @property {string} key
 * @property {string} ref
 * @property {Object} props
 * @property {?Array<ParticleElement>|string} children
 */

/**
 * @param {string} type
 * @param {?string} key
 * @param {?string} ref
 * @param {Object} props
 * @param {?Array<ParticleElement>} children
 * @return {ParticleElement}
 */
function createParticleElement (type, key, ref, props, children) {
  const element = noPropertiesObject({
    $typeof: PARTIAL_ELEMENT_TYPE.ELEMENT,
    type,
    key,
    ref,
    props,
    children: children === void 0 ? null : children
  })

  return Object.freeze(element)
}

/**
 * @param {string|ParticleComponent} type
 * @param {Object} [props]
 * @param {?Array<ParticleElement>} [children]
 * @return {ParticleElement|ParticleComponent}
 */
function createElement (type, props, children) {

  // component
  if (!isString(type)) {
    /** @type {ParticleComponent} */
    const Component = type
    const component = new Component(props)

    if (component.$typeof !== PARTIAL_ELEMENT_TYPE.COMPONENT) {
      throw new TypeError('Component $typeof property must PARTIAL_ELEMENT_TYPE.COMPONENT')
    }

    return component
  }

  // element
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
 * @param {string} type
 * @return {Function}
 */
function createElementFactory (type) {
  return function (props, children) {
    return createElement(type, props, children)
  }
}

const DOM = {
  div: createElementFactory('div'),
  span: createElementFactory('span'),
  footer: createElementFactory('footer'),
  nav: createElementFactory('nav'),
  header: createElementFactory('header'),
  text: createElementFactory('text')
}

export {
  PARTIAL_ELEMENT_TYPE,
  createElement,
  createElementFactory,
  DOM
}
