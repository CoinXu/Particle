/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

const ElementNeedClosed = {
  div: true,
  input: false,
  nav: true,
  footer: true
}

/**
 * @param {VElement} element
 * @return {{type:string, props:Object}}
 */
function desc (element) {
  const desc = Object.create(null)
  desc.type = element.type
  desc.props = element.props
  return desc
}

/**
 * @param {Object} props
 * @return {string}
 */
function renderProps (props) {
  return Object
    .keys(props)
    .map(name => `${name}="${props[name]}"`).join(' ')
}

/**
 * @param {VElement} element
 * @param {string} children
 * @return {string}
 */
function renderToString (element, children) {
  const { type, props } = element
  const start = `<${type}`
  const attr = renderProps(props)
  const end = ElementNeedClosed[type] ? `>${children}</${type}>` : '/>'
  return `${start}${attr ? (' ' + attr) : ''}${end}`
}

/**
 * @param {VElement} element
 * @param {Object} DOMTree
 * @param {string} id
 * @return {string}
 */
function renderDOMTree (element, DOMTree, id) {

  const children = element.children || []
  const len = children.length
  const Children = []

  let child, str, cstr, vid

  // 生成子元素
  for (let i = 0; i < len; i++) {
    child = children[i]

    if (child === null) {
      continue
    }

    vid = `${id}.${i}`
    cstr = ''

    if (child.children !== null && child.children.length > 0) {
      cstr = child
        .children
        .map((c, j) => renderDOMTree(c, DOMTree, `${vid}.${j}`))
        .join('')
    }

    child.props.vid = vid
    str = renderToString(child, cstr)
    DOMTree[vid] = desc(child)
    Children.push(str)
  }

  // 元素string
  element.props.vid = id
  DOMTree[id] = desc(element)
  return renderToString(element, Children.join(''))
}

/**
 * @param {VElement} element
 * @return {{DOMTree: Object, DOMString: string}}
 */
function renderVirtualElement (element) {
  const DOMTree = Object.create(null)
  const DOMString = renderDOMTree(element, DOMTree, '0')
  return { DOMTree, DOMString }
}

/**
 * @param {Component} component
 * @param {Element} node
 * @return {*}
 */
function render (component, node) {
  let desc = component.render()
  let { DOMTree, DOMString } = renderVirtualElement(desc)
  node.innerHTML = DOMString
  component.DOMTree = DOMTree
  return component
}

export {
  renderVirtualElement,
  renderToString,
  render
}
