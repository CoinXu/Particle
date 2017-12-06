/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

import { createElement } from '../lib/ParticleElement'
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

    return (
      <div
        onClick={state.bind ? function () {console.log('wrapper.click')} : null}
      >
        <button onClick={function () {
          _this.setState({ list: state.list.concat(state.list.length) })
        }}>
          增加
        </button>

        <button onClick={function () {
          _this.setState({ list: state.list.slice(0, -1) })
        }}>
          减少
        </button>

        <button onClick={function () {
          _this.setState({ bind: !state.bind })
        }}>
          切换事件状态
        </button>

        {state.show ? (<div>Wrapper</div>) : null}
        {state.list.map((v, i) => (<div id={v} key={i.toString()}>{v.toString()}</div>))}
        {state.show ? (<div id="nav">切换状态元素:Nav</div>) : null}
        <div id="footer">
          Footer
        </div>
      </div>
    )
  }
}

debugger
const app = window.app = render(createElement(App, {}), document.body)
