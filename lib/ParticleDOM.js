/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   08/10/2017
 * @description
 */

import { sortParticleElementMark, particleElementContains } from './ParticleElementMark'
import { createParticleElementEntireMarkup } from './ParticleElementMarkup'
import { findDOMNode, findDOMParentNode, markupToDOMNode } from './ParticleDOMQuery'

const Updater = {

  /**
   * @param {Array<string>} deleted
   * @param {Element} mountNode
   * @return {Array<Element>}
   */
  deleted (deleted, mountNode) {
    const length = deleted.length
    const nodes = []

    if (length === 0) {
      return nodes
    }

    deleted = sortParticleElementMark(deleted)

    const marks = []

    let i
    let node
    let mark

    for (i = 0; i < length; i++) {
      mark = deleted[i]

      if (marks.some(parent => particleElementContains(parent, mark))) {
        continue
      }

      marks.push(mark)
      node = findDOMNode(mountNode, mark)
      nodes.push(node)
    }

    return nodes
  },

  /**
   * @param {Object} add
   * @param {Element} mountNode
   * @return {Element}
   */
  add (add, mountNode) {
    const keys = sortParticleElementMark(Object.keys(add))
    const length = keys.length

    if (length === 0) {
      return mountNode
    }

    const marks = []

    let i
    let mark
    let markup
    let node
    let exitNode
    let parentNode

    for (i = 0; i < length; i++) {
      mark = keys[i]

      if (marks.some(parent => particleElementContains(parent, mark))) {
        continue
      }

      marks.push(mark)

      parentNode = findDOMParentNode(mountNode, mark)
      markup = createParticleElementEntireMarkup(add[mark])
      node = markupToDOMNode(markup)
      exitNode = findDOMNode(mountNode, mark)

      if (exitNode) {
        parentNode.insertBefore(node, exitNode)
      } else {
        parentNode.appendChild(node)
      }
    }

    return mountNode
  },

  /**
   * @param {Object} diffDesc
   * @param {Element} mountNode
   * @return {Element}
   */
  diff (diffDesc, mountNode) {
    const markArray = Object.keys(diffDesc)
    const sorted = sortParticleElementMark(markArray)

    sorted.forEach(mark => {
      const diff = diffDesc[mark]
      let node

      // 类型不同，更新元素并复制所有的子元素到新元素
      if (diff.type !== null) {

        node = findDOMNode(mountNode, mark)
        const next = node.nextSibling
        const parent = node.parentNode
        const children = node.childNodes

        const diffNodeMarkup = createParticleElementEntireMarkup(diff)
        const diffNode = markupToDOMNode(diffNodeMarkup)

        // 如果类型为text，则不必更新children了
        if (diff.type !== 'text') {
          for (let i = 0; i < children.length; i++) {
            diffNode.appendChild(children[i])
          }
        }

        parent.removeChild(node)
        parent.insertBefore(diffNode, next)

      } else if (diff.props !== null) {
        // props 不同
        node = findDOMNode(mountNode, mark)
        const props = diff.props
        let propKey

        // diff props
        for (propKey in props.diff) {
          if (propKey === 'text') {
            node.textContent = props.diff[propKey]
            continue
          }
          node.setAttribute(propKey, props.diff[propKey])
        }

        // add
        for (propKey in props.add) {
          node.setAttribute(propKey, props.add[propKey])
        }

        // deleted
        props.deleted.forEach(propKey => node.removeAttribute(propKey))
      }
    })

    return mountNode
  }
}

/**
 * 更新 diff 到视图
 * @param {Diff} diff
 * @param {Element} mountNode
 * @return {Element}
 */
function updater (diff, mountNode) {
  const toDeleted = Updater.deleted(diff.deleted, mountNode)
  Updater.diff(diff.diff, mountNode)
  Updater.add(diff.add, mountNode)
  toDeleted.forEach(node => node.parentNode.removeChild(node))
  return mountNode
}

export default {
  updater,
  Updater
}
