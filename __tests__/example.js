/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { DOM } from '../lib/PartialElement'
import { mount } from '../lib/PartialRender'

debugger
const element = DOM.div({ id: 'wrapper' }, [
  DOM.div({ id: 'inner', ref: 'inner' }, [
    DOM.span({ id: 'example', key: 'example_span' }, [
      DOM.text({ text: 'example text' })
    ])
  ]),
  DOM.nav({ id: 'nav' }),
  DOM.footer({ id: 'footer' })
])

mount(element, document.querySelector('body'))
