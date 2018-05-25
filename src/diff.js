const CREATE = 'CREATE'
const REMOVE = 'REMOVE'
const REPLACE = 'REPLACE'
const UPDATE = 'UPDATE'
const SET_PROP = 'SET_PROP'
const REMOVE_PROP = 'REMOVE_PROP'

//diff差异
function diff(newNode, oldNode) {
  if (!oldNode) {
    return {type: CREATE, newNode}
  }

  if(!newNode) {
    return {type: REMOVE}
  }

  if(changed(newNode, oldNode)) {
    return {type: REPLACE, newNode}
  }

  if (newNode.type) {
    return {
      type: UPDATE,
      props: diffProps(newNode, oldNode),
      children: diffChildren(newNode, oldNode)
    }
  }
}

//diff差异
function diff(newNode, oldNode) {
  if (!oldNode) {
    return {type: CREATE, newNode}
  }

  if(!newNode) {
    return {type: REMOVE}
  }

  if(changed(newNode, oldNode)) {
    return {type: REPLACE, newNode}
  }

  if (newNode.type) {
    return {
      type: UPDATE,
      props: diffProps(newNode, oldNode),
      children: diffChildren(newNode, oldNode)
    }
  }
}

//判断两个结点类型不同
function changed(node1, node2) {
  return typeof(node1) !== typeof(node2) ||
         typeof(node1) === 'string' && node1 !== node2 ||
         node1.type !== node2.type
}

function diffProps(newNode, oldNode) {
  let patch = []

  let props = Object.assign({}, newNode.props, oldNode.props)
  Object.keys(props).forEach(key => {
    const newVal = newNode.props[key]
    const oldVal = oldNode.props[key]
    if(!newVal) {
      patches.push({type: REMOVE_PROP, key, value: oldVal})
    }
    if (!oldVal || newVal !==oldVal) {
      patches.push({type: SET_PROP, key, value: newVal})
    }
  })
  return patch
}

function diffChildren(newNode, oldNode) {
  let patches = []

  const maximumLength = Math.max(
    newNode.children.length,
    oldNode.children.length
  )
  for(let i = 0; i < maximumLength; i++) {
    patches[i] = diff(
      newNode.children[i],
      oldNode.children[i]
    )
  }
  return patches
}

function patch(parent, patches, index = 0) {
  if(!patches) {
    return 
  }
  const el = parent.childNodes[index]
  switch (patches.type) {
    case CREATE: {
      const {newNode} = patches
      const newEl = createElement(newNode)
      parent.appendChild(newEl)
      break
    }
    case REMOVE: {
      parent.removeChild(el)
      break
    }
    case REPLACE: {
      const {newNode} = patches
      const newEl = createElement(newNode)
      return parent.replaceChild(newEl, el)
      break
    }
    case UPDATE: {
      const {props, children} = patches
      patchProps(el, props)
      for(let i = 0; i < children.length; i++) {
        patch(el, children[i], i)
      }
    }
  }
}

function patchProps(parent, patches) {
  patches.forEach(patch => {
    const {type, key, value} = patch
    if (type === 'SET_PROP') {
      setProp(parent, key, value)
    }
    if (type === 'REMOVE_PROP') {
      removeProp(parent, key, value)
    }
  })
}