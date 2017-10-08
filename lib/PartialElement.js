/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { isString } from './type'
import hasOwnProperty from './hasOwnProperty'
import PartialElementProps from './PartialElementProps'
import noPropertiesObject from './noPropertiesObject'

/**
 * Partial 库元素类型
 * @typedef {Object} PartialElementType
 * @property {string} ELEMENT
 * @property {string} COMPONENT
 */
const PARTIAL_ELEMENT_TYPE = {
  ELEMENT: 'PARTIAL_ELEMENT_TYPE',
  COMPONENT: 'PARTIAL_COMPONENT_TYPE'
}

/**
 * @typedef {Object} PartialElement
 * @property {string} $typeof
 * @property {string} type
 * @property {string} key
 * @property {string} ref
 * @property {Object} props
 * @property {?Array<PartialElement>|string} children
 */

/**
 * @param {string} type
 * @param {?string} key
 * @param {?string} ref
 * @param {Object} props
 * @param {?Array<PartialElement>} children
 * @return {PartialElement}
 */
function createPartialElement (type, key, ref, props, children) {
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
 * @param {string|PartialComponent} type
 * @param {Object} [props]
 * @param {?Array<PartialElement>} [children]
 * @return {PartialElement|PartialComponent}
 */
function createElement (type, props, children) {

  // component
  if (!isString(type)) {
    /** @type {PartialComponent} */
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

  if (PartialElementProps.validPropKey(props.key)) {
    key = props.key
  }

  if (PartialElementProps.validPropRef(props.ref)) {
    ref = props.ref
  }

  let elementProps = noPropertiesObject({})
  let propKey

  for (propKey in props) {
    if (!PartialElementProps.PrivateProps[propKey] && hasOwnProperty.call(props, propKey)) {
      elementProps[propKey] = props[propKey]
    }
  }

  return createPartialElement(type, key, ref, elementProps, children)
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

