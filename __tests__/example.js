/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { createElement, DOM } from '../lib/PartialElement'
import { render } from '../lib/PartialRender'
import { PartialComponent } from '../lib/PartialComponent'

class App extends PartialComponent {
  constructor (props) {
    super(props)
    this.state = { list: [], show: true }
  }

  render () {
    const state = this.state
    return DOM.div({ id: 'wrapper' }, [
      DOM.text({ text: 'Wrapper' }),
      DOM.div({ id: 'inner', ref: 'inner' },
        // children list
        state.list.map((v, i) => DOM.span({
            id: v,
            key: i.toString()
          }, [DOM.text({ text: v })]
        ))
      ),
      state.show
        ? DOM.nav({ id: 'nav' }, [DOM.text({ text: '切换状态元素:Nav' })])
        : null,
      DOM.footer({ id: 'footer' }, [DOM.text({ text: 'Footer' })])
    ])
  }
}

window.app = render(createElement(App), document.body)
