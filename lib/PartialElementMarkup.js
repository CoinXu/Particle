/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   07/10/2017
 * @description
 */

import { isArray } from './type'
import hasOwnProperty from './hasOwnProperty'
import noPropertiesObject from './noPropertiesObject'

const MarkupNotNeedToClose = {
  // TODO All element
  img: true,
  link: true,
  text: true
}

/**
 * PartialElement 标签描述
 * @typedef {Object} PartialElementMarkup
 * @property {string} start
 * @property {?string} end
 */

/**
 * 生成 PartialElement 自已的 markup，不包括 children
 * @param {PartialElement} element
 * @return {PartialElementMarkup}
 */
function createPartialElementSelfMarkup (element) {
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
 * 组合 PartialElement 的 markup
 * @param {PartialElementMarkup} markup
 * @return {string}
 */
function combinePartialElementMarkup (markup) {
  return markup.start + markup.end
}

/**
 * 组合带有 children 的 PartialElement 的 markup
 * @param {PartialElementMarkup} markup
 * @param {string} childrenMarkup
 */
function combineHasChildrenPartialElementMarkup (markup, childrenMarkup) {
  if (markup.end === null) {
    throw new TypeError('markup must have end element')
  }
  return markup.start + childrenMarkup + markup.end
}

/**
 * 生成 PartialElement 完整的 markup
 * @param {PartialElement} element
 * @return {string}
 */
function createPartialElementEntireMarkup (element) {
  const markup = createPartialElementSelfMarkup(element)

  if (isArray(element.children) && element.children.length > 0) {
    const childrenMarkup = []
    element.children.forEach(child => {
      const markup = createPartialElementEntireMarkup(child)
      childrenMarkup.push(markup)
    })
    return combineHasChildrenPartialElementMarkup(markup, childrenMarkup.join(''))
  }

  return combinePartialElementMarkup(markup)
}

export {
  createPartialElementSelfMarkup,
  createPartialElementEntireMarkup,
  combinePartialElementMarkup,
  combineHasChildrenPartialElementMarkup
}
