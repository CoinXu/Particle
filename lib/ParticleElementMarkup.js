/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import { isArray, isString } from './type'
import hasOwnProperty from './hasOwnProperty'
import noPropertiesObject from './noPropertiesObject'

const MarkupNotNeedToClose = {
  // TODO All element
  img: true,
  link: true,
  text: true
}

/**
 * ParticleElement 标签描述
 * @typedef {Object} ParticleElementMarkup
 * @property {string} start
 * @property {?string} end
 */

/**
 * 生成 ParticleElement 自已的 markup，不包括 children
 * @param {ParticleElement} element
 * @return {ParticleElementMarkup}
 */
function createParticleElementSelfMarkup (element) {
  const { type, props } = element

  const markup = noPropertiesObject({
    start: null,
    end: null
  })

  // text type
  // TODO redesign data structure
  if (type === 'text') {
    markup.start = props.text
    markup.end = ''
    return markup
  }

  let propKey
  let markupArr = []

  for (propKey in props) {
    if (hasOwnProperty.call(props, propKey)) {
      // TODO create varinal props generator
      // Such as CSS style properties
      markupArr.push(`${propKey}="${props[propKey]}"`)
    }
  }

  let propsMarkup = markupArr.length > 0 ? (' ' + markupArr.join(' ')) : ''

  if (!MarkupNotNeedToClose[type]) {
    markup.start = `<${type}${propsMarkup}>`
    markup.end = `</${type}>`
  } else {
    markup.start = `<${type}${propsMarkup}/>`
  }

  return markup
}

/**
 * 组合 ParticleElement 的 markup
 * @param {ParticleElementMarkup} markup
 * @return {string}
 */
function combineParticleElementMarkup (markup) {
  return markup.start + markup.end
}

/**
 * 组合带有 children 的 ParticleElement 的 markup
 * @param {ParticleElementMarkup} markup
 * @param {string} childrenMarkup
 */
function combineHasChildrenParticleElementMarkup (markup, childrenMarkup) {
  if (markup.end === null) {
    throw new TypeError('markup must have end element')
  }
  return markup.start + childrenMarkup + markup.end
}

/**
 * 生成 ParticleElement 完整的 markup
 * @param {ParticleElement|string} element
 * @return {string}
 */
function createParticleElementEntireMarkup (element) {

  const markup = createParticleElementSelfMarkup(element)

  if (isArray(element.children) && element.children.length > 0) {
    const childrenMarkup = []
    element.children.forEach(child => {
      if (child !== null) {
        const markup = createParticleElementEntireMarkup(child)
        childrenMarkup.push(markup)
      }
    })
    return combineHasChildrenParticleElementMarkup(markup, childrenMarkup.join(''))
  }

  return combineParticleElementMarkup(markup)
}

export {
  createParticleElementSelfMarkup,
  createParticleElementEntireMarkup,
  combineParticleElementMarkup,
  combineHasChildrenParticleElementMarkup
}
