var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var CREATE = 'CREATE';
var REMOVE = 'REMOVE';
var REPLACE = 'REPLACE';
var UPDATE = 'UPDATE';
var SET_PROP = 'SET_PROP';
var REMOVE_PROP = 'REMOVE_PROP';

function diff(newNode, oldNode) {
  if (!oldNode) {
    return { type: CREATE, newNode: newNode };
  }

  if (!newNode) {
    console.log('remove');
    return { type: REMOVE };
  }

  if (changed(newNode, oldNode)) {
    return { type: REPLACE, newNode: newNode };
  }

  if (newNode.type) {
    return {
      type: UPDATE,
      props: diffProps(newNode, oldNode),
      children: diffChildren(newNode, oldNode)
    };
  }
}

function changed(node1, node2) {
  return (typeof node1 === 'undefined' ? 'undefined' : _typeof(node1)) !== (typeof node2 === 'undefined' ? 'undefined' : _typeof(node2)) || typeof node1 === 'string' && node1 !== node2 || node1.type !== node2.type;
}

function diffProps(newNode, oldNode) {
  var patch = [];

  var props = Object.assign({}, newNode.props, oldNode.props);
  Object.keys(props).forEach(function (key) {
    var newVal = newNode.props[key];
    var oldVal = newNode.props[key];
    if (!newVal) {
      patches.push({ type: REMOVE_PROP, key: key, value: oldVal });
    }
    if (!oldVal || newVal !== oldVal) {
      patches.push({ type: SET_PROP, key: key, value: newVal });
    }
  });
  return patch;
}

function diffChildren(newNode, oldNode) {
  var patches = [];

  var maximumLength = Math.max(newNode.children.length, oldNode.children.length);
  for (var i = 0; i < maximumLength; i++) {
    patches[i] = diff(newNode.children[i], oldNode.children[i]);
  }
  return patches;
}

function patch(parent, patches) {
  var index = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;

  if (!patches) {
    return;
  }
  var el = parent.childNodes[index];
  switch (patches.type) {
    case CREATE:
      {
        var newNode = patches.newNode;

        var newEl = createElement(newNode);
        parent.appendChild(newEl);
        break;
      }
    case REMOVE:
      {
        parent.removeChild(el);
        break;
      }
    case REPLACE:
      {
        var _newNode = patches.newNode;

        var _newEl = createElement(_newNode);
        return parent.replaceChild(_newEl, el);
        break;
      }
    case UPDATE:
      {
        var props = patches.props,
            children = patches.children;

        patchProps(el, props);
        for (var i = 0; i < children.length; i++) {
          patch(el, children[i], i);
        }
      }
  }
}

function patchProps(parent, patches) {
  patches.forEach(function (patch) {
    var type = patch.type,
        key = patch.key,
        value = patch.value;

    if (type === 'SET_PROP') {
      setProp(parent, key, value);
    }
    if (type === 'REMOVE_PROP') {
      removeProp(parent, key, value);
    }
  });
}

function removeProp(target, name, value) {
  if (name === 'className') {
    return target.removeAttribute('class');
  }
  target.removeAttribute(name);
}
function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function view(count) {
  var r = [].concat(_toConsumableArray(Array(count).keys()));
  console.log(r);
  return h(
    'ul',
    { id: 'filmList', className: 'list-' + count % 3 },
    r.map(function (n) {
      return h(
        'li',
        null,
        ' item',
        (count * n).toString()
      );
    })
  );
}

function flatten(arr) {
  var _ref;

  return (_ref = []).concat.apply(_ref, _toConsumableArray(arr));
}

//返回需要的hyperscript对象，参数分别为节点类型、属性对象、子节点的数组
function h(type, props) {
  for (var _len = arguments.length, children = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return {
    type: type,
    props: props || {},
    children: flatten(children)
  };
}

function render(el) {
  var initialCount = 0;

  el.appendChild(createElement(view(initialCount)));

  setTimeout(function () {
    return tick(el, initialCount);
  }, 1000);
}

function tick(el, count) {
  var patches = diff(view(count + 1), view(count));
  patch(el, patches);

  if (count > 5) {
    return;
  }
  setTimeout(function () {
    return tick(el, count + 1);
  }, 1000);
}

function createElement(node) {
  console.log(node);
  if (typeof node === 'string') {
    return document.createTextNode(node);
  }

  var type = node.type,
      props = node.props,
      children = node.children;

  var el = document.createElement(type);
  setProps(el, props);
  children.map(createElement).forEach(el.appendChild.bind(el));

  return el;
}

function setProp(target, name, value) {
  if (name === 'className') {
    return target.setAttribute('class', value);
  }

  target.setAttribute(name, value);
}

function setProps(target, props) {
  Object.keys(props).forEach(function (key) {
    setProp(target, key, props[key]);
  });
}
