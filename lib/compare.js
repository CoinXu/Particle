/**
 * @author coinxu<duanxian0605@gmail.com>
 * @date   02/10/2017
 * @description
 */

/**
 * @typedef {Object} Diff
 * @property {Object} diff
 * @property {Object} add
 * @property {Array<string>} del
 */

/**
 * @param {Object} base
 * @param {Object} target
 * @return {{result:Diff, has:boolean}}
 */
function compare (base, target) {
  let t1, t2, prop, has = false

  const diff = Object.create(null)
  const add = Object.create(null)
  const del = []

  for (prop in base) {
    t1 = base[prop]
    t2 = target[prop]

    if (t2 === void 0) {
      del.push(prop)
      has = true
      continue
    }

    if (t2 !== t1) {
      diff[prop] = t2
      has = true
    }
  }

  for (prop in target) {
    if (base[prop] === void 0) {
      add[prop] = target[prop]
      has = true
    }
  }

  const result = Object.create(null)
  result.diff = diff
  result.add = add
  result.del = del

  return { result, has }
}

/**
 * @param {Object} base
 * @param {Object} target
 * @return {Diff}
 */
export default function (base, target) {
  const { result, has } = compare(base, target)
  if (!has) return result

  const { diff, add, del } = result
  const diff_elements = Object.create(null)

  let t1, t2, key
  let rc, diff_attr, has_diff

  for (key in diff) {
    t1 = base[key]
    t2 = target[key]
    rc = Object.create(null)
    has_diff = false

    if (t1.type !== t2.type) {
      rc.type = t2.type
      rc.props = t2.props
      has_diff = true
    } else {
      diff_attr = compare(t1.props, t2.props)
      if (diff_attr.has) {
        rc.props = diff_attr.result
        has_diff = true
      }
    }
    if (has_diff) {
      diff_elements[key] = rc
    }
  }

  return { add, del, diff: diff_elements }
}
