/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   06/10/2017
 * @description
 */

import hasOwnProperty from './hasOwnProperty'
import noPropertiesObject from './noPropertiesObject'
import { isArray } from './type'

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
 * PartialElement 关键属性，用于对比 DOMTree，得出 Diff 结果
 * @typedef {Object} PartialElementDesc
 * @property {string} $typeof
 * @property {string} type
 * @property {string} ref
 * @property {string} key
 * @property {Object} props
 */

/**
 * 提取 PartialElement 关键属性
 * @param {PartialElement} element
 * @return {PartialElementDesc}
 */
function extractPartialElement (element) {
  return noPropertiesObject({
    $typeof: element.$typeof,
    type: element.type,
    key: element.key,
    ref: element.ref,
    props: element.props
  })
}

/**
 * 创建 PartialElement 的 DOMTree
 * @param {PartialElement} element
 * @param {string} id
 * @return {Object}
 */
function createPartialElementDOMTree (element, id) {
  const DOMTree = noPropertiesObject({})

  if (isArray(element.children)) {
    element.children.forEach((child, index) => {
      const tree = createPartialElementDOMTree(child, `${id}.${index}`)
      Object.assign(DOMTree, tree)
    })
  }

  DOMTree[id] = extractPartialElement(element)
  return DOMTree
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

/**
 * 挂载 PartialElement 到 DOM 节点
 * @param {PartialElement} element
 * @param {Element} mountNode
 * @return {string}
 */
function mount (element, mountNode) {
  const Markup = createPartialElementEntireMarkup(element)
  const DOMTree = createPartialElementDOMTree(element, '0')
  mountNode.innerHTML = Markup

  console.log(DOMTree)
  console.log(Markup)

  return Markup
}

export {
  mount
}
