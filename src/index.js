function view(count) {
  const r = [...Array(count).keys()]
  return <ul id = "filmList" className = {`list-${count % 3}`}>
      {r.map(n => <li> item{(count * n).toString()}</li>)}
  </ul>
}

function flatten(arr) {
  return [].concat(...arr)
}

function h (type, props, ...children) {
  return {
    type,
    props:props || {},
    children: flatten(children)
  }
}

function render(el) {
  const initialCount = 0
  
  el.appendChild(createElement(view(initialCount)))

  setTimeout(() => tick(el, initialCount), 1000)
}

function tick(el, count) {
  const patches = diff(view(count + 1), view(count))
  patch(el, patches)

  if (count > 5) {return}
  setTimeout(() => tick(el, count+1), 1000)
}

function createElement(node) {
  if (typeof(node) === 'string') {
    return document.createTextNode(node)
  }

  let {type, props, children} = node
  console.log(node)
  const el = document.createElement(type)
  setProps(el, props)
  children.map(createElement)
    .forEach(el.appendChild.bind(el))
  
  return el
}

function setProp(target, name, value) {
  if (name === 'className') {
    return target.setAttribute('class', value)
  }

  target.setAttribute(name, value)
}

function setProps(target, props) {
  Object.keys(props).forEach(key => {
    setProp(target, key, props[key])
  })
}
