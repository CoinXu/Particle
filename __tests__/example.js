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
    this.state = { list: [], show: true }
  }

  render () {
    const state = this.state
    return DOM.div({
      id: 'wrapper',
      onClick: function (event) {
        console.log(event.target)
        console.log(this)
      }
    }, [

      state.show ? DOM.text('Wrapper') : null,

      state.list.length
        ? DOM.div(
        { id: 'inner', ref: 'inner' },
        state.list.map((v, i) => DOM.span(
          { id: v, key: i.toString() },
          [DOM.text(v.toString())]
          )
        )
        )
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
