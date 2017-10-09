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
    return DOM.div({ id: 'wrapper' }, [

      DOM.text({ text: 'Wrapper' }),

      state.list.length
        ? DOM.div({ id: 'inner', ref: 'inner' }, state.list.map((v, i) => DOM.span({ id: v, key: i.toString() }, [DOM.text({ text: v })])))
        : null,

      state.show
        ? DOM.nav({ id: 'nav' }, [DOM.text({ text: '切换状态元素:Nav' })])
        : null,

      DOM.footer({ id: 'footer' }, [DOM.text({ text: 'Footer' })])
    ])
  }
}
debugger
const app = window.app = render(createElement(App), document.body)
