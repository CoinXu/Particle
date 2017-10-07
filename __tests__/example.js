/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { DOM } from '../lib/PartialElement'
import { render } from '../lib/PartialRender'

debugger
const base = DOM.div({ id: 'wrapper' }, [
  DOM.div({ id: 'inner', ref: 'inner' }, [
    DOM.span({ id: 'example', key: 'example_span' }, [
      DOM.text({ text: 'example text' })
    ])
  ]),
  DOM.nav({ id: 'nav' }),
  DOM.footer({ id: 'footer' })
])
const target = DOM.div({ id: 'wrapper-other' }, [
  DOM.div({ id: 'inner', ref: 'inner' }, [
    DOM.span({ id: 'example', key: 'example' }, null)
  ]),
  DOM.div({ id: 'nav-to-div' }),
  DOM.footer({ id: 'footer' })
])

window.render = render
window.base = base
window.target = target

render(base, document.body)
