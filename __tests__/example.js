/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { createElement, DOM } from '../lib/ParticleElement'
import { render } from '../lib/ParticleRender'
import { ParticleComponent } from '../lib/ParticleComponent'

class App extends ParticleComponent {
  constructor (props) {
    super(props)
    this.state = { list: [], show: true, bind: true }
  }

  render () {
    const state = this.state
    const _this = this

    return DOM.div({
      id: 'wrapper',
      onClick: state.bind
        ? function (event) {
          console.log('wrapper.click')
        }
        : null
    }, [

      createElement('button', {
        onClick: function () {
          _this.setState({ list: state.list.concat(state.list.length) })
        }
      }, [DOM.text('增加')]),

      createElement('button', {
        onClick: function () {
          _this.setState({ list: state.list.slice(0, -1) })
        }
      }, [DOM.text('减少')]),

      createElement('button', {
        onClick: function () {
          _this.setState({ bind: !state.bind })
        }
      }, [DOM.text('切换事件状态')]),

      state.show ? DOM.text('Wrapper') : null,

      state.list.length
        ? DOM.div({ id: 'inner', ref: 'inner' }, state.list.map((v, i) => {
          return DOM.div({ id: v, key: i.toString() }, [DOM.text(v.toString())])
        }))
        : null,
      state.show
        ? DOM.nav({ id: 'nav' }, [DOM.text('切换状态元素:Nav')])
        : null,
      DOM.footer({ id: 'footer' }, [DOM.text('Footer')])
    ])
  }
}

debugger
const app = window.app = render(createElement(App, {}), document.body)
