/**
 * @license gulp-4-bundler v1.0.0
 * (c) 2022 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

var schedaSuite=(function(){'use strict';function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}var Dom = function () {
  function Dom() {}

  Dom.detect = function detect(node) {
    var userAgent = navigator.userAgent.toLowerCase();
    var explorer = userAgent.indexOf('msie') > -1;
    var frfx = userAgent.indexOf('firefox') > -1;
    var opera = userAgent.toLowerCase().indexOf('op') > -1;
    var crm = userAgent.indexOf('chrome') > -1;
    var saf = userAgent.indexOf('safari') > -1;
    var ed = userAgent.indexOf('edg') > -1;

    if (crm && saf) {
      saf = false;
    }

    if (crm && opera) {
      crm = false;
    }

    if (crm && ed) {
      crm = false;
    }

    var android = userAgent.match(/android/i);
    var blackberry = userAgent.match(/blackberry/i);
    var ios = userAgent.match(/iphone|ipod/i);
    var operamini = userAgent.match(/opera mini/i);
    var iemobile = userAgent.match(/iemobile/i) || navigator.userAgent.match(/wpdesktop/i);
    var mobile = android || blackberry || ios || operamini || iemobile;
    var overscroll = navigator.platform === 'MacIntel' && typeof navigator.getBattery === 'function';
    var classList = {
      crm: crm,
      explorer: explorer,
      frfx: frfx,
      saf: saf,
      opera: opera,
      android: android,
      blackberry: blackberry,
      ios: ios,
      operamini: operamini,
      iemobile: iemobile,
      mobile: mobile,
      overscroll: overscroll,
      ed: ed
    };
    Object.assign(Dom, classList);
    Object.keys(classList).forEach(function (x) {
      if (classList[x]) {
        node.classList.add(x);
      }
    });
    if (saf) document.querySelector('_blue-alt').style.display = 'none';

    var onTouchStart = function onTouchStart() {
      document.removeEventListener('touchstart', onTouchStart);
      Dom.touch = true;
      node.classList.add('touch');
    };

    document.addEventListener('touchstart', onTouchStart);

    var onMouseDown = function onMouseDown() {
      document.removeEventListener('mousedown', onMouseDown);
      Dom.mouse = true;
      node.classList.add('mouse');
    };

    document.addEventListener('mousedown', onMouseDown);

    if (mobile) {
      Dom.fastscroll = true;
      node.classList.add('fastscroll');
    }
  };

  Dom.fragmentFirstElement = function fragmentFirstElement(fragment) {
    return Array.prototype.slice.call(fragment.children).find(function (x) {
      return x.nodeType === Node.ELEMENT_NODE;
    });
  };

  Dom.fragmentFromHTML = function fragmentFromHTML(html) {
    return document.createRange().createContextualFragment(html);
  };

  return Dom;
}();var Toggle = function () {
  function Toggle(node, selectorBtn, selectorTarget, wrapper, className) {
    this.node = node;
    this.selectorBtn = selectorBtn;
    this.selectorTarget = selectorTarget;
    this.wrapper = wrapper;
    this.className = className;
    this.init();
    this.addListener();
  }

  var _proto = Toggle.prototype;

  _proto.init = function init() {
    this.selectorBtn = this.selectorBtn.substring(1, this.selectorBtn.length - 1);
    this.selectorTarget = this.selectorTarget.substring(1, this.selectorTarget.length - 1);
    this.target = this.wrapper.querySelector("[" + this.selectorTarget + "=" + this.node.getAttribute(this.selectorBtn) + "]");
    this.hasAria = this.node.getAttribute('aria-expanded');
  };

  _proto.addListener = function addListener() {
    this.node.addEventListener('click', this.onClick.bind(this));
  };

  _proto.onClick = function onClick() {
    var isActive = this.target.classList.contains(this.className);

    if (isActive) {
      this.removeClassName();
    } else {
      this.addClassName();
    }
  };

  _proto.addClassName = function addClassName() {
    this.resetAll();
    this.target.classList.add(this.className);
    if (this.hasAria) this.node.toggleAttribute('aria-expanded');
  };

  _proto.removeClassName = function removeClassName() {
    this.target.classList.remove(this.className);
    if (this.hasAria) this.node.removeAttribute('aria-expanded');
  };

  _proto.resetAll = function resetAll() {
    var _this = this;

    var items = this.wrapper.querySelectorAll("[" + this.selectorTarget + "]");
    items.forEach(function (item) {
      item.classList.remove(_this.className);
      if (_this.hasAria) item.removeAttribute('aria-expanded');
    });
  };

  Toggle.init = function init(selectorBtn, selectorTarget, wrapper, className) {
    Toggle.items = Array.from(wrapper.querySelectorAll(selectorBtn)).map(function (node) {
      return new Toggle(node, selectorBtn, selectorTarget, wrapper, className);
    });
    return Toggle.items;
  };

  return Toggle;
}();var ToggleOver = function (_Toggle) {
  _inheritsLoose(ToggleOver, _Toggle);

  function ToggleOver(node, selectorBtn, selectorTarget, wrapper, className) {
    return _Toggle.call(this, node, selectorBtn, selectorTarget, wrapper, className) || this;
  }

  var _proto = ToggleOver.prototype;

  _proto.addListener = function addListener() {
    this.timeout;
    this.isOver = false;
    this.buttonOver = false;
    this.mouseOutArea = this.target.querySelector('.subnav');

    if (document.querySelector('body').classList.contains('mobile')) {
      this.node.addEventListener('click', this.onClick.bind(this));
    } else {
      this.node.addEventListener('mouseover', this.onOver.bind(this));
      this.node.addEventListener('mouseleave', this.onOut.bind(this));
      this.mouseOutArea.addEventListener('mouseover', this.onEnter.bind(this));
      this.mouseOutArea.addEventListener('mouseleave', this.onLeave.bind(this));
    }
  };

  _proto.onOver = function onOver() {
    this.addClassName();
  };

  _proto.onOut = function onOut() {
    var _this = this;

    if (this.timeout !== 0) {
      clearTimeout(this.timeout);
    }

    this.timeout = setTimeout(function () {
      if (!_this.isOver) {
        _this.removeClassName();
      }
    }, 100);
  };

  _proto.onEnter = function onEnter() {
    this.isOver = true;
  };

  _proto.onLeave = function onLeave() {
    this.isOver = false;
    this.removeClassName();
  };

  ToggleOver.init = function init(selectorBtn, selectorTarget, wrapper, className) {
    ToggleOver.items = Array.from(wrapper.querySelectorAll(selectorBtn)).map(function (node) {
      return new ToggleOver(node, selectorBtn, selectorTarget, wrapper, className);
    });
    return ToggleOver.items;
  };

  return ToggleOver;
}(Toggle);var Nav = function () {
  function Nav(node) {
    this.node = node;
    this.selectors = {
      mainWrapper: 'body',
      mobileToggle: '[data-nav-toggle]',
      buttonsAttribute: '[data-toggle-btn]',
      buttonsTarget: '[data-toggle-target]',
      subButtonsAttribute: '[data-toggle-sub-btn]',
      subButtonsTarget: '[data-toggle-sub-target]',
      backButtons: '[data-nav-back]',
      subBackButtons: '[data-subnav-back]'
    };
    this.settings = {
      activeClass: 'active',
      wrapperClass: 'no-scroll'
    };
    this.init();
    this.addListener();
  }

  var _proto = Nav.prototype;

  _proto.init = function init() {
    this.buttons = ToggleOver.init(this.selectors.buttonsAttribute, this.selectors.buttonsTarget, this.node, this.settings.activeClass);
    this.subButtons = Toggle.init(this.selectors.subButtonsAttribute, this.selectors.subButtonsTarget, this.node, this.settings.activeClass);
    this.backButtons = Toggle.init(this.selectors.backButtons, this.selectors.buttonsTarget, this.node, this.settings.activeClass);
    this.backSubButtons = Toggle.init(this.selectors.subBackButtons, this.selectors.subButtonsTarget, this.node, this.settings.activeClass);
    this.mobileToggle = document.querySelector(this.selectors.mobileToggle);
    this.mainWrapper = document.querySelector(this.selectors.mainWrapper);
  };

  _proto.addListener = function addListener() {
    this.mobileToggle.addEventListener('click', this.onToggle.bind(this));
  };

  _proto.onToggle = function onToggle() {
    this.mobileToggle.classList.toggle(this.settings.activeClass);
    this.node.classList.toggle(this.settings.activeClass);
    this.mainWrapper.classList.toggle(this.settings.wrapperClass);
    this.resetAll(this.buttons);
    this.resetAll(this.subButtons);
  };

  _proto.resetAll = function resetAll(items) {
    var _this = this;

    items.forEach(function (item) {
      item.target.classList.remove(_this.settings.activeClass);
      item.target.removeAttribute('aria-expanded');
    });
  };

  return Nav;
}();var Page = function () {
  function Page() {}

  var _proto = Page.prototype;

  _proto.init = function init() {
    var body = document.querySelector('body');
    var page = document.querySelector('.page');
    var header = document.querySelector('.header');
    var nav = document.querySelector('[data-nav]');
    Dom.detect(body);
    this.body = body;
    this.page = page;
    this.header = header;
    this.isMobile = Dom.mobile;
    this.nav = new Nav(nav);
    this.addListeners();
  };

  _proto.addListeners = function addListeners() {
    var _this = this;

    window.addEventListener('orientationchange', function (e) {
      _this.checkDevice();
    });

    if (this.isMobile) {
      return;
    }

    window.addEventListener('scroll', function (e) {
      if (window.scrollY > 0) {
        _this.header.classList.add('_sticky');

        _this.header.style.display = document.querySelector('body').classList.contains('ed') ? 'none' : '';
      } else {
        _this.header.classList.remove('_sticky');

        _this.header.style.display = document.querySelector('body').classList.contains('ed') ? 'block' : '';
      }
    });
  };

  _proto.checkDevice = function checkDevice(e) {
    if (!this.isMobile) {
      return;
    }

    var html = document.querySelector('html');
    var orientation = window.orientation & 2;

    switch (orientation) {
      case 0:
        html.classList.remove('landscape');
        html.classList.add('portrait');
        break;

      case 2:
        html.classList.remove('portrait');
        html.classList.add('landscape');
        break;
    }
  };

  return Page;
}();var ScrollAnchor = function () {
  function ScrollAnchor(node, index) {
    this.node = node;
    this.index = index;
    this.setup();
    this.addListeners();
  }

  var _proto = ScrollAnchor.prototype;

  _proto.setup = function setup() {
    this.anchorId = this.node.getAttribute('data-anchor');
    this.offset = this.node.getAttribute('data-anchor-offset');
    this.content = document.querySelector('[data-anchor-content=' + this.anchorId + ']');
  };

  _proto.addListeners = function addListeners() {
    this.node.addEventListener('click', this.onClick.bind(this));
  };

  _proto.onClick = function onClick(e) {
    window.scrollTo(0, this.cleanOffset);
    e.preventDefault();
  };

  ScrollAnchor.init = function init() {
    ScrollAnchor.items = Array.from(document.querySelectorAll('[data-anchor]')).map(function (node, index) {
      return new ScrollAnchor(node, index);
    });
  };

  _createClass(ScrollAnchor, [{
    key: "cleanOffset",
    get: function get() {
      return this.content.offsetTop - this.offset;
    }
  }]);

  return ScrollAnchor;
}();/**
 * SSR Window 4.0.1
 * Better handling for window object in SSR environment
 * https://github.com/nolimits4web/ssr-window
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: October 27, 2021
 */
/* eslint-disable no-param-reassign */
function isObject(obj) {
    return (obj !== null &&
        typeof obj === 'object' &&
        'constructor' in obj &&
        obj.constructor === Object);
}
function extend(target = {}, src = {}) {
    Object.keys(src).forEach((key) => {
        if (typeof target[key] === 'undefined')
            target[key] = src[key];
        else if (isObject(src[key]) &&
            isObject(target[key]) &&
            Object.keys(src[key]).length > 0) {
            extend(target[key], src[key]);
        }
    });
}

const ssrDocument = {
    body: {},
    addEventListener() { },
    removeEventListener() { },
    activeElement: {
        blur() { },
        nodeName: '',
    },
    querySelector() {
        return null;
    },
    querySelectorAll() {
        return [];
    },
    getElementById() {
        return null;
    },
    createEvent() {
        return {
            initEvent() { },
        };
    },
    createElement() {
        return {
            children: [],
            childNodes: [],
            style: {},
            setAttribute() { },
            getElementsByTagName() {
                return [];
            },
        };
    },
    createElementNS() {
        return {};
    },
    importNode() {
        return null;
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
};
function getDocument() {
    const doc = typeof document !== 'undefined' ? document : {};
    extend(doc, ssrDocument);
    return doc;
}

const ssrWindow = {
    document: ssrDocument,
    navigator: {
        userAgent: '',
    },
    location: {
        hash: '',
        host: '',
        hostname: '',
        href: '',
        origin: '',
        pathname: '',
        protocol: '',
        search: '',
    },
    history: {
        replaceState() { },
        pushState() { },
        go() { },
        back() { },
    },
    CustomEvent: function CustomEvent() {
        return this;
    },
    addEventListener() { },
    removeEventListener() { },
    getComputedStyle() {
        return {
            getPropertyValue() {
                return '';
            },
        };
    },
    Image() { },
    Date() { },
    screen: {},
    setTimeout() { },
    clearTimeout() { },
    matchMedia() {
        return {};
    },
    requestAnimationFrame(callback) {
        if (typeof setTimeout === 'undefined') {
            callback();
            return null;
        }
        return setTimeout(callback, 0);
    },
    cancelAnimationFrame(id) {
        if (typeof setTimeout === 'undefined') {
            return;
        }
        clearTimeout(id);
    },
};
function getWindow() {
    const win = typeof window !== 'undefined' ? window : {};
    extend(win, ssrWindow);
    return win;
}/**
 * Dom7 4.0.1
 * Minimalistic JavaScript library for DOM manipulation, with a jQuery-compatible API
 * https://framework7.io/docs/dom7.html
 *
 * Copyright 2021, Vladimir Kharlampidi
 *
 * Licensed under MIT
 *
 * Released on: October 27, 2021
 */

/* eslint-disable no-proto */
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, '__proto__', {
    get() {
      return proto;
    },

    set(value) {
      proto.__proto__ = value;
    }

  });
}

class Dom7 extends Array {
  constructor(items) {
    super(...(items || []));
    makeReactive(this);
  }

}

function arrayFlat(arr = []) {
  const res = [];
  arr.forEach(el => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];

  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1) uniqueArray.push(arr[i]);
  }

  return uniqueArray;
}

// eslint-disable-next-line

function qsa(selector, context) {
  if (typeof selector !== 'string') {
    return [selector];
  }

  const a = [];
  const res = context.querySelectorAll(selector);

  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }

  return a;
}

function $(selector, context) {
  const window = getWindow();
  const document = getDocument();
  let arr = [];

  if (!context && selector instanceof Dom7) {
    return selector;
  }

  if (!selector) {
    return new Dom7(arr);
  }

  if (typeof selector === 'string') {
    const html = selector.trim();

    if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
      let toCreate = 'div';
      if (html.indexOf('<li') === 0) toCreate = 'ul';
      if (html.indexOf('<tr') === 0) toCreate = 'tbody';
      if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
      if (html.indexOf('<tbody') === 0) toCreate = 'table';
      if (html.indexOf('<option') === 0) toCreate = 'select';
      const tempParent = document.createElement(toCreate);
      tempParent.innerHTML = html;

      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector.trim(), context || document);
    } // arr = qsa(selector, document);

  } else if (selector.nodeType || selector === window || selector === document) {
    arr.push(selector);
  } else if (Array.isArray(selector)) {
    if (selector instanceof Dom7) return selector;
    arr = selector;
  }

  return new Dom7(arrayUnique(arr));
}

$.fn = Dom7.prototype;

// eslint-disable-next-line

function addClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.add(...classNames);
  });
  return this;
}

function removeClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    el.classList.remove(...classNames);
  });
  return this;
}

function toggleClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  this.forEach(el => {
    classNames.forEach(className => {
      el.classList.toggle(className);
    });
  });
}

function hasClass(...classes) {
  const classNames = arrayFlat(classes.map(c => c.split(' ')));
  return arrayFilter(this, el => {
    return classNames.filter(className => el.classList.contains(className)).length > 0;
  }).length > 0;
}

function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === 'string') {
    // Get attr
    if (this[0]) return this[0].getAttribute(attrs);
    return undefined;
  } // Set attrs


  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      // String
      this[i].setAttribute(attrs, value);
    } else {
      // Object
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }

  return this;
}

function removeAttr(attr) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr);
  }

  return this;
}

function transform(transform) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform;
  }

  return this;
}

function transition(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== 'string' ? `${duration}ms` : duration;
  }

  return this;
}

function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;

  function handleLiveEvent(e) {
    const target = e.target;
    if (!target) return;
    const eventData = e.target.dom7EventData || [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    if ($(target).is(targetSelector)) listener.apply(target, eventData);else {
      const parents = $(target).parents(); // eslint-disable-line

      for (let k = 0; k < parents.length; k += 1) {
        if ($(parents[k]).is(targetSelector)) listener.apply(parents[k], eventData);
      }
    }
  }

  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];

    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }

    listener.apply(this, eventData);
  }

  const events = eventType.split(' ');
  let j;

  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];

    if (!targetSelector) {
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7Listeners) el.dom7Listeners = {};
        if (!el.dom7Listeners[event]) el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      // Live events
      for (j = 0; j < events.length; j += 1) {
        const event = events[j];
        if (!el.dom7LiveListeners) el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event]) el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }

  return this;
}

function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;

  if (typeof args[1] === 'function') {
    [eventType, listener, capture] = args;
    targetSelector = undefined;
  }

  if (!capture) capture = false;
  const events = eventType.split(' ');

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;

      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }

      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];

          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }

  return this;
}

function trigger(...args) {
  const window = getWindow();
  const events = args[0].split(' ');
  const eventData = args[1];

  for (let i = 0; i < events.length; i += 1) {
    const event = events[i];

    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];

      if (window.CustomEvent) {
        const evt = new window.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }

  return this;
}

function transitionEnd(callback) {
  const dom = this;

  function fireCallBack(e) {
    if (e.target !== this) return;
    callback.call(this, e);
    dom.off('transitionend', fireCallBack);
  }

  if (callback) {
    dom.on('transitionend', fireCallBack);
  }

  return this;
}

function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));
    }

    return this[0].offsetWidth;
  }

  return null;
}

function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles = this.styles();
      return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));
    }

    return this[0].offsetHeight;
  }

  return null;
}

function offset() {
  if (this.length > 0) {
    const window = getWindow();
    const document = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window ? window.scrollY : el.scrollTop;
    const scrollLeft = el === window ? window.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }

  return null;
}

function styles() {
  const window = getWindow();
  if (this[0]) return window.getComputedStyle(this[0], null);
  return {};
}

function css(props, value) {
  const window = getWindow();
  let i;

  if (arguments.length === 1) {
    if (typeof props === 'string') {
      // .css('width')
      if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      // .css({ width: '100px' })
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }

      return this;
    }
  }

  if (arguments.length === 2 && typeof props === 'string') {
    // .css('width', '100px')
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }

    return this;
  }

  return this;
}

function each(callback) {
  if (!callback) return this;
  this.forEach((el, index) => {
    callback.apply(el, [el, index]);
  });
  return this;
}

function filter(callback) {
  const result = arrayFilter(this, callback);
  return $(result);
}

function html(html) {
  if (typeof html === 'undefined') {
    return this[0] ? this[0].innerHTML : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html;
  }

  return this;
}

function text(text) {
  if (typeof text === 'undefined') {
    return this[0] ? this[0].textContent.trim() : null;
  }

  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text;
  }

  return this;
}

function is(selector) {
  const window = getWindow();
  const document = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector === 'undefined') return false;

  if (typeof selector === 'string') {
    if (el.matches) return el.matches(selector);
    if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
    if (el.msMatchesSelector) return el.msMatchesSelector(selector);
    compareWith = $(selector);

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  if (selector === document) {
    return el === document;
  }

  if (selector === window) {
    return el === window;
  }

  if (selector.nodeType || selector instanceof Dom7) {
    compareWith = selector.nodeType ? [selector] : selector;

    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el) return true;
    }

    return false;
  }

  return false;
}

function index() {
  let child = this[0];
  let i;

  if (child) {
    i = 0; // eslint-disable-next-line

    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1) i += 1;
    }

    return i;
  }

  return undefined;
}

function eq(index) {
  if (typeof index === 'undefined') return this;
  const length = this.length;

  if (index > length - 1) {
    return $([]);
  }

  if (index < 0) {
    const returnIndex = length + index;
    if (returnIndex < 0) return $([]);
    return $([this[returnIndex]]);
  }

  return $([this[index]]);
}

function append(...els) {
  let newChild;
  const document = getDocument();

  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];

    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === 'string') {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newChild;

        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }

  return this;
}

function prepend(newChild) {
  const document = getDocument();
  let i;
  let j;

  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === 'string') {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = newChild;

      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }

  return this;
}

function next(selector) {
  if (this.length > 0) {
    if (selector) {
      if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) {
        return $([this[0].nextElementSibling]);
      }

      return $([]);
    }

    if (this[0].nextElementSibling) return $([this[0].nextElementSibling]);
    return $([]);
  }

  return $([]);
}

function nextAll(selector) {
  const nextEls = [];
  let el = this[0];
  if (!el) return $([]);

  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line

    if (selector) {
      if ($(next).is(selector)) nextEls.push(next);
    } else nextEls.push(next);

    el = next;
  }

  return $(nextEls);
}

function prev(selector) {
  if (this.length > 0) {
    const el = this[0];

    if (selector) {
      if (el.previousElementSibling && $(el.previousElementSibling).is(selector)) {
        return $([el.previousElementSibling]);
      }

      return $([]);
    }

    if (el.previousElementSibling) return $([el.previousElementSibling]);
    return $([]);
  }

  return $([]);
}

function prevAll(selector) {
  const prevEls = [];
  let el = this[0];
  if (!el) return $([]);

  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line

    if (selector) {
      if ($(prev).is(selector)) prevEls.push(prev);
    } else prevEls.push(prev);

    el = prev;
  }

  return $(prevEls);
}

function parent(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector) {
        if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
      } else {
        parents.push(this[i].parentNode);
      }
    }
  }

  return $(parents);
}

function parents(selector) {
  const parents = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    let parent = this[i].parentNode; // eslint-disable-line

    while (parent) {
      if (selector) {
        if ($(parent).is(selector)) parents.push(parent);
      } else {
        parents.push(parent);
      }

      parent = parent.parentNode;
    }
  }

  return $(parents);
}

function closest(selector) {
  let closest = this; // eslint-disable-line

  if (typeof selector === 'undefined') {
    return $([]);
  }

  if (!closest.is(selector)) {
    closest = closest.parents(selector).eq(0);
  }

  return closest;
}

function find(selector) {
  const foundElements = [];

  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector);

    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }

  return $(foundElements);
}

function children(selector) {
  const children = []; // eslint-disable-line

  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;

    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector || $(childNodes[j]).is(selector)) {
        children.push(childNodes[j]);
      }
    }
  }

  return $(children);
}

function remove() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
  }

  return this;
}const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition,
  on,
  off,
  trigger,
  transitionEnd,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach(methodName => {
  Object.defineProperty($.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach(key => {
    try {
      object[key] = null;
    } catch (e) {// no getter for object
    }

    try {
      delete object[key];
    } catch (e) {// something got wrong
    }
  });
}

function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}

function now() {
  return Date.now();
}

function getComputedStyle$1(el) {
  const window = getWindow();
  let style;

  if (window.getComputedStyle) {
    style = window.getComputedStyle(el, null);
  }

  if (!style && el.currentStyle) {
    style = el.currentStyle;
  }

  if (!style) {
    style = el.style;
  }

  return style;
}

function getTranslate(el, axis = 'x') {
  const window = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);

  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;

    if (curTransform.split(',').length > 6) {
      curTransform = curTransform.split(', ').map(a => a.replace(',', '.')).join(', ');
    } // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case


    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
    matrix = transformMatrix.toString().split(',');
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m41; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[12]); // Normal Browsers
    else curTransform = parseFloat(matrix[4]);
  }

  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix) curTransform = transformMatrix.m42; // Crazy IE10 Matrix
    else if (matrix.length === 16) curTransform = parseFloat(matrix[13]); // Normal Browsers
    else curTransform = parseFloat(matrix[5]);
  }

  return curTransform || 0;
}

function isObject$1(o) {
  return typeof o === 'object' && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === 'Object';
}

function isNode(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement;
  }

  return node && (node.nodeType === 1 || node.nodeType === 11);
}

function extend$1(...args) {
  const to = Object(args[0]);
  const noExtend = ['__proto__', 'constructor', 'prototype'];

  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];

    if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter(key => noExtend.indexOf(key) < 0);

      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);

        if (desc !== undefined && desc.enumerable) {
          if (isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject$1(to[nextKey]) && isObject$1(nextSource[nextKey])) {
            to[nextKey] = {};

            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }

  return to;
}

function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}

function animateCSSModeScroll({
  swiper,
  targetPosition,
  side
}) {
  const window = getWindow();
  const startPosition = -swiper.translate;
  let startTime = null;
  let time;
  const duration = swiper.params.speed;
  swiper.wrapperEl.style.scrollSnapType = 'none';
  window.cancelAnimationFrame(swiper.cssModeFrameID);
  const dir = targetPosition > startPosition ? 'next' : 'prev';

  const isOutOfBound = (current, target) => {
    return dir === 'next' && current >= target || dir === 'prev' && current <= target;
  };

  const animate = () => {
    time = new Date().getTime();

    if (startTime === null) {
      startTime = time;
    }

    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);

    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }

    swiper.wrapperEl.scrollTo({
      [side]: currentPosition
    });

    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden';
      swiper.wrapperEl.style.scrollSnapType = '';
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = '';
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window.cancelAnimationFrame(swiper.cssModeFrameID);
      return;
    }

    swiper.cssModeFrameID = window.requestAnimationFrame(animate);
  };

  animate();
}let support;

function calcSupport() {
  const window = getWindow();
  const document = getDocument();
  return {
    smoothScroll: document.documentElement && 'scrollBehavior' in document.documentElement.style,
    touch: !!('ontouchstart' in window || window.DocumentTouch && document instanceof window.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;

      try {
        const opts = Object.defineProperty({}, 'passive', {
          // eslint-disable-next-line
          get() {
            supportsPassive = true;
          }

        });
        window.addEventListener('testPassiveListener', null, opts);
      } catch (e) {// No support
      }

      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return 'ongesturestart' in window;
    }()
  };
}

function getSupport() {
  if (!support) {
    support = calcSupport();
  }

  return support;
}let deviceCached;

function calcDevice({
  userAgent
} = {}) {
  const support = getSupport();
  const window = getWindow();
  const platform = window.navigator.platform;
  const ua = userAgent || window.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window.screen.width;
  const screenHeight = window.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/); // eslint-disable-line

  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform === 'Win32';
  let macos = platform === 'MacIntel'; // iPadOs 13 fix

  const iPadScreens = ['1024x1366', '1366x1024', '834x1194', '1194x834', '834x1112', '1112x834', '768x1024', '1024x768', '820x1180', '1180x820', '810x1080', '1080x810'];

  if (!ipad && macos && support.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad) ipad = [0, 1, '13_0_0'];
    macos = false;
  } // Android


  if (android && !windows) {
    device.os = 'android';
    device.android = true;
  }

  if (ipad || iphone || ipod) {
    device.os = 'ios';
    device.ios = true;
  } // Export object


  return device;
}

function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }

  return deviceCached;
}let browser;

function calcBrowser() {
  const window = getWindow();

  function isSafari() {
    const ua = window.navigator.userAgent.toLowerCase();
    return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;
  }

  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window.navigator.userAgent)
  };
}

function getBrowser() {
  if (!browser) {
    browser = calcBrowser();
  }

  return browser;
}function Resize({
  swiper,
  on,
  emit
}) {
  const window = getWindow();
  let observer = null;

  const resizeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('beforeResize');
    emit('resize');
  };

  const createObserver = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    observer = new ResizeObserver(entries => {
      const {
        width,
        height
      } = swiper;
      let newWidth = width;
      let newHeight = height;
      entries.forEach(({
        contentBoxSize,
        contentRect,
        target
      }) => {
        if (target && target !== swiper.el) return;
        newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
        newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
      });

      if (newWidth !== width || newHeight !== height) {
        resizeHandler();
      }
    });
    observer.observe(swiper.el);
  };

  const removeObserver = () => {
    if (observer && observer.unobserve && swiper.el) {
      observer.unobserve(swiper.el);
      observer = null;
    }
  };

  const orientationChangeHandler = () => {
    if (!swiper || swiper.destroyed || !swiper.initialized) return;
    emit('orientationchange');
  };

  on('init', () => {
    if (swiper.params.resizeObserver && typeof window.ResizeObserver !== 'undefined') {
      createObserver();
      return;
    }

    window.addEventListener('resize', resizeHandler);
    window.addEventListener('orientationchange', orientationChangeHandler);
  });
  on('destroy', () => {
    removeObserver();
    window.removeEventListener('resize', resizeHandler);
    window.removeEventListener('orientationchange', orientationChangeHandler);
  });
}function Observer({
  swiper,
  extendParams,
  on,
  emit
}) {
  const observers = [];
  const window = getWindow();

  const attach = (target, options = {}) => {
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver;
    const observer = new ObserverFunc(mutations => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0]);
        return;
      }

      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0]);
      };

      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(observerUpdate);
      } else {
        window.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === 'undefined' ? true : options.attributes,
      childList: typeof options.childList === 'undefined' ? true : options.childList,
      characterData: typeof options.characterData === 'undefined' ? true : options.characterData
    });
    observers.push(observer);
  };

  const init = () => {
    if (!swiper.params.observer) return;

    if (swiper.params.observeParents) {
      const containerParents = swiper.$el.parents();

      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    } // Observe container


    attach(swiper.$el[0], {
      childList: swiper.params.observeSlideChildren
    }); // Observe wrapper

    attach(swiper.$wrapperEl[0], {
      attributes: false
    });
  };

  const destroy = () => {
    observers.forEach(observer => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };

  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on('init', init);
  on('destroy', destroy);
}/* eslint-disable no-underscore-dangle */
var eventsEmitter = {
  on(events, handler, priority) {
    const self = this;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';
    events.split(' ').forEach(event => {
      if (!self.eventsListeners[event]) self.eventsListeners[event] = [];
      self.eventsListeners[event][method](handler);
    });
    return self;
  },

  once(events, handler, priority) {
    const self = this;
    if (typeof handler !== 'function') return self;

    function onceHandler(...args) {
      self.off(events, onceHandler);

      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }

      handler.apply(self, args);
    }

    onceHandler.__emitterProxy = handler;
    return self.on(events, onceHandler, priority);
  },

  onAny(handler, priority) {
    const self = this;
    if (typeof handler !== 'function') return self;
    const method = priority ? 'unshift' : 'push';

    if (self.eventsAnyListeners.indexOf(handler) < 0) {
      self.eventsAnyListeners[method](handler);
    }

    return self;
  },

  offAny(handler) {
    const self = this;
    if (!self.eventsAnyListeners) return self;
    const index = self.eventsAnyListeners.indexOf(handler);

    if (index >= 0) {
      self.eventsAnyListeners.splice(index, 1);
    }

    return self;
  },

  off(events, handler) {
    const self = this;
    if (!self.eventsListeners) return self;
    events.split(' ').forEach(event => {
      if (typeof handler === 'undefined') {
        self.eventsListeners[event] = [];
      } else if (self.eventsListeners[event]) {
        self.eventsListeners[event].forEach((eventHandler, index) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self.eventsListeners[event].splice(index, 1);
          }
        });
      }
    });
    return self;
  },

  emit(...args) {
    const self = this;
    if (!self.eventsListeners) return self;
    let events;
    let data;
    let context;

    if (typeof args[0] === 'string' || Array.isArray(args[0])) {
      events = args[0];
      data = args.slice(1, args.length);
      context = self;
    } else {
      events = args[0].events;
      data = args[0].data;
      context = args[0].context || self;
    }

    data.unshift(context);
    const eventsArray = Array.isArray(events) ? events : events.split(' ');
    eventsArray.forEach(event => {
      if (self.eventsAnyListeners && self.eventsAnyListeners.length) {
        self.eventsAnyListeners.forEach(eventHandler => {
          eventHandler.apply(context, [event, ...data]);
        });
      }

      if (self.eventsListeners && self.eventsListeners[event]) {
        self.eventsListeners[event].forEach(eventHandler => {
          eventHandler.apply(context, data);
        });
      }
    });
    return self;
  }

};function updateSize() {
  const swiper = this;
  let width;
  let height;
  const $el = swiper.$el;

  if (typeof swiper.params.width !== 'undefined' && swiper.params.width !== null) {
    width = swiper.params.width;
  } else {
    width = $el[0].clientWidth;
  }

  if (typeof swiper.params.height !== 'undefined' && swiper.params.height !== null) {
    height = swiper.params.height;
  } else {
    height = $el[0].clientHeight;
  }

  if (width === 0 && swiper.isHorizontal() || height === 0 && swiper.isVertical()) {
    return;
  } // Subtract paddings


  width = width - parseInt($el.css('padding-left') || 0, 10) - parseInt($el.css('padding-right') || 0, 10);
  height = height - parseInt($el.css('padding-top') || 0, 10) - parseInt($el.css('padding-bottom') || 0, 10);
  if (Number.isNaN(width)) width = 0;
  if (Number.isNaN(height)) height = 0;
  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height
  });
}function updateSlides() {
  const swiper = this;

  function getDirectionLabel(property) {
    if (swiper.isHorizontal()) {
      return property;
    } // prettier-ignore


    return {
      'width': 'height',
      'margin-top': 'margin-left',
      'margin-bottom ': 'margin-right',
      'margin-left': 'margin-top',
      'margin-right': 'margin-bottom',
      'padding-left': 'padding-top',
      'padding-right': 'padding-bottom',
      'marginRight': 'marginBottom'
    }[property];
  }

  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }

  const params = swiper.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper.virtual.slides.length : swiper.slides.length;
  const slides = $wrapperEl.children(`.${swiper.params.slideClass}`);
  const slidesLength = isVirtual ? swiper.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;

  if (typeof offsetBefore === 'function') {
    offsetBefore = params.slidesOffsetBefore.call(swiper);
  }

  let offsetAfter = params.slidesOffsetAfter;

  if (typeof offsetAfter === 'function') {
    offsetAfter = params.slidesOffsetAfter.call(swiper);
  }

  const previousSnapGridLength = swiper.snapGrid.length;
  const previousSlidesGridLength = swiper.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index = 0;

  if (typeof swiperSize === 'undefined') {
    return;
  }

  if (typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace('%', '')) / 100 * swiperSize;
  }

  swiper.virtualSize = -spaceBetween; // reset margins

  if (rtl) slides.css({
    marginLeft: '',
    marginBottom: '',
    marginTop: ''
  });else slides.css({
    marginRight: '',
    marginBottom: '',
    marginTop: ''
  }); // reset cssMode offsets

  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', '');
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', '');
  }

  const gridEnabled = params.grid && params.grid.rows > 1 && swiper.grid;

  if (gridEnabled) {
    swiper.grid.initSlides(slidesLength);
  } // Calc slides


  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === 'auto' && params.breakpoints && Object.keys(params.breakpoints).filter(key => {
    return typeof params.breakpoints[key].slidesPerView !== 'undefined';
  }).length > 0;

  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide = slides.eq(i);

    if (gridEnabled) {
      swiper.grid.updateSlide(i, slide, slidesLength, getDirectionLabel);
    }

    if (slide.css('display') === 'none') continue; // eslint-disable-line

    if (params.slidesPerView === 'auto') {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel('width')] = ``;
      }

      const slideStyles = getComputedStyle(slide[0]);
      const currentTransform = slide[0].style.transform;
      const currentWebKitTransform = slide[0].style.webkitTransform;

      if (currentTransform) {
        slide[0].style.transform = 'none';
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = 'none';
      }

      if (params.roundLengths) {
        slideSize = swiper.isHorizontal() ? slide.outerWidth(true) : slide.outerHeight(true);
      } else {
        // eslint-disable-next-line
        const width = getDirectionPropertyValue(slideStyles, 'width');
        const paddingLeft = getDirectionPropertyValue(slideStyles, 'padding-left');
        const paddingRight = getDirectionPropertyValue(slideStyles, 'padding-right');
        const marginLeft = getDirectionPropertyValue(slideStyles, 'margin-left');
        const marginRight = getDirectionPropertyValue(slideStyles, 'margin-right');
        const boxSizing = slideStyles.getPropertyValue('box-sizing');

        if (boxSizing && boxSizing === 'border-box') {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }

      if (currentTransform) {
        slide[0].style.transform = currentTransform;
      }

      if (currentWebKitTransform) {
        slide[0].style.webkitTransform = currentWebKitTransform;
      }

      if (params.roundLengths) slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths) slideSize = Math.floor(slideSize);

      if (slides[i]) {
        slides[i].style[getDirectionLabel('width')] = `${slideSize}px`;
      }
    }

    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }

    slidesSizesGrid.push(slideSize);

    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0) slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1000) slidePosition = 0;
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if (index % params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths) slidePosition = Math.floor(slidePosition);
      if ((index - Math.min(swiper.params.slidesPerGroupSkip, index)) % swiper.params.slidesPerGroup === 0) snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }

    swiper.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index += 1;
  }

  swiper.virtualSize = Math.max(swiper.virtualSize, swiperSize) + offsetAfter;

  if (rtl && wrongRTL && (params.effect === 'slide' || params.effect === 'coverflow')) {
    $wrapperEl.css({
      width: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }

  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel('width')]: `${swiper.virtualSize + params.spaceBetween}px`
    });
  }

  if (gridEnabled) {
    swiper.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  } // Remove last grid elements depending on width


  if (!params.centeredSlides) {
    const newSlidesGrid = [];

    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths) slidesGridItem = Math.floor(slidesGridItem);

      if (snapGrid[i] <= swiper.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }

    snapGrid = newSlidesGrid;

    if (Math.floor(swiper.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper.virtualSize - swiperSize);
    }
  }

  if (snapGrid.length === 0) snapGrid = [0];

  if (params.spaceBetween !== 0) {
    const key = swiper.isHorizontal() && rtl ? 'marginLeft' : getDirectionLabel('marginRight');
    slides.filter((_, slideIndex) => {
      if (!params.cssMode) return true;

      if (slideIndex === slides.length - 1) {
        return false;
      }

      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }

  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map(snap => {
      if (snap < 0) return -offsetBefore;
      if (snap > maxSnap) return maxSnap + offsetAfter;
      return snap;
    });
  }

  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach(slideSizeValue => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;

    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap, snapIndex) => {
        snapGrid[snapIndex] = snap - allSlidesOffset;
      });
      slidesGrid.forEach((snap, snapIndex) => {
        slidesGrid[snapIndex] = snap + allSlidesOffset;
      });
    }
  }

  Object.assign(swiper, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });

  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-before', `${-snapGrid[0]}px`);
    setCSSProperty(swiper.wrapperEl, '--swiper-centered-offset-after', `${swiper.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper.snapGrid[0];
    const addToSlidesGrid = -swiper.slidesGrid[0];
    swiper.snapGrid = swiper.snapGrid.map(v => v + addToSnapGrid);
    swiper.slidesGrid = swiper.slidesGrid.map(v => v + addToSlidesGrid);
  }

  if (slidesLength !== previousSlidesLength) {
    swiper.emit('slidesLengthChange');
  }

  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper.params.watchOverflow) swiper.checkOverflow();
    swiper.emit('snapGridLengthChange');
  }

  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper.emit('slidesGridLengthChange');
  }

  if (params.watchSlidesProgress) {
    swiper.updateSlidesOffset();
  }
}function updateAutoHeight(speed) {
  const swiper = this;
  const activeSlides = [];
  const isVirtual = swiper.virtual && swiper.params.virtual.enabled;
  let newHeight = 0;
  let i;

  if (typeof speed === 'number') {
    swiper.setTransition(speed);
  } else if (speed === true) {
    swiper.setTransition(swiper.params.speed);
  }

  const getSlideByIndex = index => {
    if (isVirtual) {
      return swiper.slides.filter(el => parseInt(el.getAttribute('data-swiper-slide-index'), 10) === index)[0];
    }

    return swiper.slides.eq(index)[0];
  }; // Find slides currently in view


  if (swiper.params.slidesPerView !== 'auto' && swiper.params.slidesPerView > 1) {
    if (swiper.params.centeredSlides) {
      swiper.visibleSlides.each(slide => {
        activeSlides.push(slide);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper.params.slidesPerView); i += 1) {
        const index = swiper.activeIndex + i;
        if (index > swiper.slides.length && !isVirtual) break;
        activeSlides.push(getSlideByIndex(index));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper.activeIndex));
  } // Find new height from highest slide in view


  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== 'undefined') {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  } // Update Height


  if (newHeight) swiper.$wrapperEl.css('height', `${newHeight}px`);
}function updateSlidesOffset() {
  const swiper = this;
  const slides = swiper.slides;

  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}function updateSlidesProgress(translate = this && this.translate || 0) {
  const swiper = this;
  const params = swiper.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper;
  if (slides.length === 0) return;
  if (typeof slides[0].swiperSlideOffset === 'undefined') swiper.updateSlidesOffset();
  let offsetCenter = -translate;
  if (rtl) offsetCenter = translate; // Visible Slides

  slides.removeClass(params.slideVisibleClass);
  swiper.visibleSlidesIndexes = [];
  swiper.visibleSlides = [];

  for (let i = 0; i < slides.length; i += 1) {
    const slide = slides[i];
    let slideOffset = slide.swiperSlideOffset;

    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }

    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper.minTranslate() : 0) - slideOffset) / (slide.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper.size - 1 || slideAfter > 1 && slideAfter <= swiper.size || slideBefore <= 0 && slideAfter >= swiper.size;

    if (isVisible) {
      swiper.visibleSlides.push(slide);
      swiper.visibleSlidesIndexes.push(i);
      slides.eq(i).addClass(params.slideVisibleClass);
    }

    slide.progress = rtl ? -slideProgress : slideProgress;
    slide.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }

  swiper.visibleSlides = $(swiper.visibleSlides);
}function updateProgress(translate) {
  const swiper = this;

  if (typeof translate === 'undefined') {
    const multiplier = swiper.rtlTranslate ? -1 : 1; // eslint-disable-next-line

    translate = swiper && swiper.translate && swiper.translate * multiplier || 0;
  }

  const params = swiper.params;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;

  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate - swiper.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }

  Object.assign(swiper, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight) swiper.updateSlidesProgress(translate);

  if (isBeginning && !wasBeginning) {
    swiper.emit('reachBeginning toEdge');
  }

  if (isEnd && !wasEnd) {
    swiper.emit('reachEnd toEdge');
  }

  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper.emit('fromEdge');
  }

  swiper.emit('progress', progress);
}function updateSlidesClasses() {
  const swiper = this;
  const {
    slides,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper;
  const isVirtual = swiper.virtual && params.virtual.enabled;
  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;

  if (isVirtual) {
    activeSlide = swiper.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides.eq(activeIndex);
  } // Active classes


  activeSlide.addClass(params.slideActiveClass);

  if (params.loop) {
    // Duplicate to all looped slides
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  } // Next Slide


  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);

  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  } // Prev Slide


  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);

  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }

  if (params.loop) {
    // Duplicate to all looped slides
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicateNextClass);
    }

    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr('data-swiper-slide-index')}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }

  swiper.emitSlidesClasses();
}function updateActiveIndex(newActiveIndex) {
  const swiper = this;
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper;
  let activeIndex = newActiveIndex;
  let snapIndex;

  if (typeof activeIndex === 'undefined') {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate >= slidesGrid[i] && translate < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate >= slidesGrid[i]) {
        activeIndex = i;
      }
    } // Normalize slideIndex


    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === 'undefined') activeIndex = 0;
    }
  }

  if (snapGrid.indexOf(translate) >= 0) {
    snapIndex = snapGrid.indexOf(translate);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }

  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper.snapIndex = snapIndex;
      swiper.emit('snapIndexChange');
    }

    return;
  } // Get real index


  const realIndex = parseInt(swiper.slides.eq(activeIndex).attr('data-swiper-slide-index') || activeIndex, 10);
  Object.assign(swiper, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper.emit('activeIndexChange');
  swiper.emit('snapIndexChange');

  if (previousRealIndex !== realIndex) {
    swiper.emit('realIndexChange');
  }

  if (swiper.initialized || swiper.params.runCallbacksOnInit) {
    swiper.emit('slideChange');
  }
}function updateClickedSlide(e) {
  const swiper = this;
  const params = swiper.params;
  const slide = $(e.target).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;

  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }

  if (slide && slideFound) {
    swiper.clickedSlide = slide;

    if (swiper.virtual && swiper.params.virtual.enabled) {
      swiper.clickedIndex = parseInt($(slide).attr('data-swiper-slide-index'), 10);
    } else {
      swiper.clickedIndex = slideIndex;
    }
  } else {
    swiper.clickedSlide = undefined;
    swiper.clickedIndex = undefined;
    return;
  }

  if (params.slideToClickedSlide && swiper.clickedIndex !== undefined && swiper.clickedIndex !== swiper.activeIndex) {
    swiper.slideToClickedSlide();
  }
}var update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};function getSwiperTranslate(axis = this.isHorizontal() ? 'x' : 'y') {
  const swiper = this;
  const {
    params,
    rtlTranslate: rtl,
    translate,
    $wrapperEl
  } = swiper;

  if (params.virtualTranslate) {
    return rtl ? -translate : translate;
  }

  if (params.cssMode) {
    return translate;
  }

  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl) currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}function setTranslate(translate, byController) {
  const swiper = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper;
  let x = 0;
  let y = 0;
  const z = 0;

  if (swiper.isHorizontal()) {
    x = rtl ? -translate : translate;
  } else {
    y = translate;
  }

  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }

  if (params.cssMode) {
    wrapperEl[swiper.isHorizontal() ? 'scrollLeft' : 'scrollTop'] = swiper.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
  }

  swiper.previousTranslate = swiper.translate;
  swiper.translate = swiper.isHorizontal() ? x : y; // Check if we need to update progress

  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== progress) {
    swiper.updateProgress(translate);
  }

  swiper.emit('setTranslate', swiper.translate, byController);
}function minTranslate() {
  return -this.snapGrid[0];
}function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}function translateTo(translate = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper = this;
  const {
    params,
    wrapperEl
  } = swiper;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return false;
  }

  const minTranslate = swiper.minTranslate();
  const maxTranslate = swiper.maxTranslate();
  let newTranslate;
  if (translateBounds && translate > minTranslate) newTranslate = minTranslate;else if (translateBounds && translate < maxTranslate) newTranslate = maxTranslate;else newTranslate = translate; // Update progress

  swiper.updateProgress(newTranslate);

  if (params.cssMode) {
    const isH = swiper.isHorizontal();

    if (speed === 0) {
      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = -newTranslate;
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: -newTranslate,
          side: isH ? 'left' : 'top'
        });
        return true;
      }

      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: -newTranslate,
        behavior: 'smooth'
      });
    }

    return true;
  }

  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionEnd');
    }
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(newTranslate);

    if (runCallbacks) {
      swiper.emit('beforeTransitionStart', speed, internal);
      swiper.emit('transitionStart');
    }

    if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onTranslateToWrapperTransitionEnd) {
        swiper.onTranslateToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
          swiper.onTranslateToWrapperTransitionEnd = null;
          delete swiper.onTranslateToWrapperTransitionEnd;

          if (runCallbacks) {
            swiper.emit('transitionEnd');
          }
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onTranslateToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onTranslateToWrapperTransitionEnd);
    }
  }

  return true;
}var translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};function setTransition(duration, byController) {
  const swiper = this;

  if (!swiper.params.cssMode) {
    swiper.$wrapperEl.transition(duration);
  }

  swiper.emit('setTransition', duration, byController);
}function transitionEmit({
  swiper,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper;
  let dir = direction;

  if (!dir) {
    if (activeIndex > previousIndex) dir = 'next';else if (activeIndex < previousIndex) dir = 'prev';else dir = 'reset';
  }

  swiper.emit(`transition${step}`);

  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === 'reset') {
      swiper.emit(`slideResetTransition${step}`);
      return;
    }

    swiper.emit(`slideChangeTransition${step}`);

    if (dir === 'next') {
      swiper.emit(`slideNextTransition${step}`);
    } else {
      swiper.emit(`slidePrevTransition${step}`);
    }
  }
}function transitionStart(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  if (params.cssMode) return;

  if (params.autoHeight) {
    swiper.updateAutoHeight();
  }

  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'Start'
  });
}function transitionEnd$1(runCallbacks = true, direction) {
  const swiper = this;
  const {
    params
  } = swiper;
  swiper.animating = false;
  if (params.cssMode) return;
  swiper.setTransition(0);
  transitionEmit({
    swiper,
    runCallbacks,
    direction,
    step: 'End'
  });
}var transition$1 = {
  setTransition,
  transitionStart,
  transitionEnd: transitionEnd$1
};function slideTo(index = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index !== 'number' && typeof index !== 'string') {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index}] given.`);
  }

  if (typeof index === 'string') {
    /**
     * The `index` argument converted from `string` to `number`.
     * @type {number}
     */
    const indexAsNumber = parseInt(index, 10);
    /**
     * Determines whether the `index` argument is a valid `number`
     * after being converted from the `string` type.
     * @type {boolean}
     */

    const isValidNumber = isFinite(indexAsNumber);

    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index}] given.`);
    } // Knowing that the converted `index` is a valid number,
    // we can update the original argument's value.


    index = indexAsNumber;
  }

  const swiper = this;
  let slideIndex = index;
  if (slideIndex < 0) slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper;

  if (swiper.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }

  const skip = Math.min(swiper.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length) snapIndex = snapGrid.length - 1;

  if ((activeIndex || params.initialSlide || 0) === (previousIndex || 0) && runCallbacks) {
    swiper.emit('beforeSlideChangeStart');
  }

  const translate = -snapGrid[snapIndex]; // Update progress

  swiper.updateProgress(translate); // Normalize slideIndex

  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);

      if (typeof slidesGrid[i + 1] !== 'undefined') {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  } // Directions locks


  if (swiper.initialized && slideIndex !== activeIndex) {
    if (!swiper.allowSlideNext && translate < swiper.translate && translate < swiper.minTranslate()) {
      return false;
    }

    if (!swiper.allowSlidePrev && translate > swiper.translate && translate > swiper.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex) return false;
    }
  }

  let direction;
  if (slideIndex > activeIndex) direction = 'next';else if (slideIndex < activeIndex) direction = 'prev';else direction = 'reset'; // Update Index

  if (rtl && -translate === swiper.translate || !rtl && translate === swiper.translate) {
    swiper.updateActiveIndex(slideIndex); // Update Height

    if (params.autoHeight) {
      swiper.updateAutoHeight();
    }

    swiper.updateSlidesClasses();

    if (params.effect !== 'slide') {
      swiper.setTranslate(translate);
    }

    if (direction !== 'reset') {
      swiper.transitionStart(runCallbacks, direction);
      swiper.transitionEnd(runCallbacks, direction);
    }

    return false;
  }

  if (params.cssMode) {
    const isH = swiper.isHorizontal();
    const t = rtl ? translate : -translate;

    if (speed === 0) {
      const isVirtual = swiper.virtual && swiper.params.virtual.enabled;

      if (isVirtual) {
        swiper.wrapperEl.style.scrollSnapType = 'none';
        swiper._immediateVirtual = true;
      }

      wrapperEl[isH ? 'scrollLeft' : 'scrollTop'] = t;

      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper.wrapperEl.style.scrollSnapType = '';
          swiper._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper.support.smoothScroll) {
        animateCSSModeScroll({
          swiper,
          targetPosition: t,
          side: isH ? 'left' : 'top'
        });
        return true;
      }

      wrapperEl.scrollTo({
        [isH ? 'left' : 'top']: t,
        behavior: 'smooth'
      });
    }

    return true;
  }

  if (speed === 0) {
    swiper.setTransition(0);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);
    swiper.transitionEnd(runCallbacks, direction);
  } else {
    swiper.setTransition(speed);
    swiper.setTranslate(translate);
    swiper.updateActiveIndex(slideIndex);
    swiper.updateSlidesClasses();
    swiper.emit('beforeTransitionStart', speed, internal);
    swiper.transitionStart(runCallbacks, direction);

    if (!swiper.animating) {
      swiper.animating = true;

      if (!swiper.onSlideToWrapperTransitionEnd) {
        swiper.onSlideToWrapperTransitionEnd = function transitionEnd(e) {
          if (!swiper || swiper.destroyed) return;
          if (e.target !== this) return;
          swiper.$wrapperEl[0].removeEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
          swiper.$wrapperEl[0].removeEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
          swiper.onSlideToWrapperTransitionEnd = null;
          delete swiper.onSlideToWrapperTransitionEnd;
          swiper.transitionEnd(runCallbacks, direction);
        };
      }

      swiper.$wrapperEl[0].addEventListener('transitionend', swiper.onSlideToWrapperTransitionEnd);
      swiper.$wrapperEl[0].addEventListener('webkitTransitionEnd', swiper.onSlideToWrapperTransitionEnd);
    }
  }

  return true;
}function slideToLoop(index = 0, speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  let newIndex = index;

  if (swiper.params.loop) {
    newIndex += swiper.loopedSlides;
  }

  return swiper.slideTo(newIndex, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    animating,
    enabled,
    params
  } = swiper;
  if (!enabled) return swiper;
  let perGroup = params.slidesPerGroup;

  if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper.slidesPerViewDynamic('current', true), 1);
  }

  const increment = swiper.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  return swiper.slideTo(swiper.activeIndex + increment, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return swiper;

  if (params.loop) {
    if (animating && params.loopPreventsSlide) return false;
    swiper.loopFix(); // eslint-disable-next-line

    swiper._clientLeft = swiper.$wrapperEl[0].clientLeft;
  }

  const translate = rtlTranslate ? swiper.translate : -swiper.translate;

  function normalize(val) {
    if (val < 0) return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }

  const normalizedTranslate = normalize(translate);
  const normalizedSnapGrid = snapGrid.map(val => normalize(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];

  if (typeof prevSnap === 'undefined' && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap, snapIndex) => {
      if (normalizedTranslate >= snap) {
        // prevSnap = snap;
        prevSnapIndex = snapIndex;
      }
    });

    if (typeof prevSnapIndex !== 'undefined') {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }

  let prevIndex = 0;

  if (typeof prevSnap !== 'undefined') {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0) prevIndex = swiper.activeIndex - 1;

    if (params.slidesPerView === 'auto' && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper.slidesPerViewDynamic('previous', true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }

  return swiper.slideTo(prevIndex, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper = this;
  return swiper.slideTo(swiper.activeIndex, speed, runCallbacks, internal);
}/* eslint no-unused-vars: "off" */
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper = this;
  let index = swiper.activeIndex;
  const skip = Math.min(swiper.params.slidesPerGroupSkip, index);
  const snapIndex = skip + Math.floor((index - skip) / swiper.params.slidesPerGroup);
  const translate = swiper.rtlTranslate ? swiper.translate : -swiper.translate;

  if (translate >= swiper.snapGrid[snapIndex]) {
    // The current translate is on or after the current snap index, so the choice
    // is between the current index and the one after it.
    const currentSnap = swiper.snapGrid[snapIndex];
    const nextSnap = swiper.snapGrid[snapIndex + 1];

    if (translate - currentSnap > (nextSnap - currentSnap) * threshold) {
      index += swiper.params.slidesPerGroup;
    }
  } else {
    // The current translate is before the current snap index, so the choice
    // is between the current index and the one before it.
    const prevSnap = swiper.snapGrid[snapIndex - 1];
    const currentSnap = swiper.snapGrid[snapIndex];

    if (translate - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index -= swiper.params.slidesPerGroup;
    }
  }

  index = Math.max(index, 0);
  index = Math.min(index, swiper.slidesGrid.length - 1);
  return swiper.slideTo(index, speed, runCallbacks, internal);
}function slideToClickedSlide() {
  const swiper = this;
  const {
    params,
    $wrapperEl
  } = swiper;
  const slidesPerView = params.slidesPerView === 'auto' ? swiper.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper.clickedIndex;
  let realIndex;

  if (params.loop) {
    if (swiper.animating) return;
    realIndex = parseInt($(swiper.clickedSlide).attr('data-swiper-slide-index'), 10);

    if (params.centeredSlides) {
      if (slideToIndex < swiper.loopedSlides - slidesPerView / 2 || slideToIndex > swiper.slides.length - swiper.loopedSlides + slidesPerView / 2) {
        swiper.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper.slideTo(slideToIndex);
        });
      } else {
        swiper.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper.slides.length - slidesPerView) {
      swiper.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper.slideTo(slideToIndex);
      });
    } else {
      swiper.slideTo(slideToIndex);
    }
  } else {
    swiper.slideTo(slideToIndex);
  }
}var slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};function loopCreate() {
  const swiper = this;
  const document = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper; // Remove duplicated slides

  const $selector = $wrapperEl.children().length > 0 ? $($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides = $selector.children(`.${params.slideClass}`);

  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;

    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = $(document.createElement('div')).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }

      slides = $selector.children(`.${params.slideClass}`);
    }
  }

  if (params.slidesPerView === 'auto' && !params.loopedSlides) params.loopedSlides = slides.length;
  swiper.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper.loopedSlides += params.loopAdditionalSlides;

  if (swiper.loopedSlides > slides.length) {
    swiper.loopedSlides = slides.length;
  }

  const prependSlides = [];
  const appendSlides = [];
  slides.each((el, index) => {
    const slide = $(el);

    if (index < swiper.loopedSlides) {
      appendSlides.push(el);
    }

    if (index < slides.length && index >= slides.length - swiper.loopedSlides) {
      prependSlides.push(el);
    }

    slide.attr('data-swiper-slide-index', index);
  });

  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append($(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }

  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend($(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}function loopFix() {
  const swiper = this;
  swiper.emit('beforeLoopFix');
  const {
    activeIndex,
    slides,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper;
  let newIndex;
  swiper.allowSlidePrev = true;
  swiper.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper.getTranslate(); // Fix For Negative Oversliding

  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    // Fix For Positive Oversliding
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper.slideTo(newIndex, 0, false, true);

    if (slideChanged && diff !== 0) {
      swiper.setTranslate((rtl ? -swiper.translate : swiper.translate) - diff);
    }
  }

  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;
  swiper.emit('loopFix');
}function loopDestroy() {
  const swiper = this;
  const {
    $wrapperEl,
    params,
    slides
  } = swiper;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides.removeAttr('data-swiper-slide-index');
}var loop = {
  loopCreate,
  loopFix,
  loopDestroy
};function setGrabCursor(moving) {
  const swiper = this;
  if (swiper.support.touch || !swiper.params.simulateTouch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) return;
  const el = swiper.params.touchEventsTarget === 'container' ? swiper.el : swiper.wrapperEl;
  el.style.cursor = 'move';
  el.style.cursor = moving ? '-webkit-grabbing' : '-webkit-grab';
  el.style.cursor = moving ? '-moz-grabbin' : '-moz-grab';
  el.style.cursor = moving ? 'grabbing' : 'grab';
}function unsetGrabCursor() {
  const swiper = this;

  if (swiper.support.touch || swiper.params.watchOverflow && swiper.isLocked || swiper.params.cssMode) {
    return;
  }

  swiper[swiper.params.touchEventsTarget === 'container' ? 'el' : 'wrapperEl'].style.cursor = '';
}var grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};function closestElement(selector, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow()) return null;
    if (el.assignedSlot) el = el.assignedSlot;
    const found = el.closest(selector);
    return found || __closestFrom(el.getRootNode().host);
  }

  return __closestFrom(base);
}

function onTouchStart(event) {
  const swiper = this;
  const document = getDocument();
  const window = getWindow();
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper;
  if (!enabled) return;

  if (swiper.animating && params.preventInteractionOnTransition) {
    return;
  }

  if (!swiper.animating && params.cssMode && params.loop) {
    swiper.loopFix();
  }

  let e = event;
  if (e.originalEvent) e = e.originalEvent;
  let $targetEl = $(e.target);

  if (params.touchEventsTarget === 'wrapper') {
    if (!$targetEl.closest(swiper.wrapperEl).length) return;
  }

  data.isTouchEvent = e.type === 'touchstart';
  if (!data.isTouchEvent && 'which' in e && e.which === 3) return;
  if (!data.isTouchEvent && 'button' in e && e.button > 0) return;
  if (data.isTouched && data.isMoved) return; // change target el for shadow root component

  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== '';

  if (swipingClassHasValue && e.target && e.target.shadowRoot && event.path && event.path[0]) {
    $targetEl = $(event.path[0]);
  }

  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot); // use closestElement for shadow root element to get the actual closest for nested shadow root element

  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, e.target) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper.allowClick = true;
    return;
  }

  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0]) return;
  }

  touches.currentX = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app cannot swipe-to-go-back anymore

  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;

  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === 'prevent') {
      event.preventDefault();
    } else {
      return;
    }
  }

  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: undefined,
    startMoving: undefined
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper.allowClick = true;
  swiper.updateSize();
  swiper.swipeDirection = undefined;
  if (params.threshold > 0) data.allowThresholdMove = false;

  if (e.type !== 'touchstart') {
    let preventDefault = true;
    if ($targetEl.is(data.focusableElements)) preventDefault = false;

    if (document.activeElement && $(document.activeElement).is(data.focusableElements) && document.activeElement !== $targetEl[0]) {
      document.activeElement.blur();
    }

    const shouldPreventDefault = preventDefault && swiper.allowTouchMove && params.touchStartPreventDefault;

    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }

  swiper.emit('touchStart', e);
}function onTouchMove(event) {
  const document = getDocument();
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper;
  if (!enabled) return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper.emit('touchMoveOpposite', e);
    }

    return;
  }

  if (data.isTouchEvent && e.type !== 'touchmove') return;
  const targetTouch = e.type === 'touchmove' && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === 'touchmove' ? targetTouch.pageX : e.pageX;
  const pageY = e.type === 'touchmove' ? targetTouch.pageY : e.pageY;

  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }

  if (!swiper.allowTouchMove) {
    // isMoved = true;
    swiper.allowClick = false;

    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }

    return;
  }

  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper.isVertical()) {
      // Vertical
      if (pageY < touches.startY && swiper.translate <= swiper.maxTranslate() || pageY > touches.startY && swiper.translate >= swiper.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper.translate <= swiper.maxTranslate() || pageX > touches.startX && swiper.translate >= swiper.minTranslate()) {
      return;
    }
  }

  if (data.isTouchEvent && document.activeElement) {
    if (e.target === document.activeElement && $(e.target).is(data.focusableElements)) {
      data.isMoved = true;
      swiper.allowClick = false;
      return;
    }
  }

  if (data.allowTouchCallbacks) {
    swiper.emit('touchMove', e);
  }

  if (e.targetTouches && e.targetTouches.length > 1) return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper.params.threshold) return;

  if (typeof data.isScrolling === 'undefined') {
    let touchAngle;

    if (swiper.isHorizontal() && touches.currentY === touches.startY || swiper.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      // eslint-disable-next-line
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }

  if (data.isScrolling) {
    swiper.emit('touchMoveOpposite', e);
  }

  if (typeof data.startMoving === 'undefined') {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }

  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }

  if (!data.startMoving) {
    return;
  }

  swiper.allowClick = false;

  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }

  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }

  if (!data.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper.loopFix();
    }

    data.startTranslate = swiper.getTranslate();
    swiper.setTransition(0);

    if (swiper.animating) {
      swiper.$wrapperEl.trigger('webkitTransitionEnd transitionend');
    }

    data.allowMomentumBounce = false; // Grab Cursor

    if (params.grabCursor && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
      swiper.setGrabCursor(true);
    }

    swiper.emit('sliderFirstMove', e);
  }

  swiper.emit('sliderMove', e);
  data.isMoved = true;
  let diff = swiper.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl) diff = -diff;
  swiper.swipeDirection = diff > 0 ? 'prev' : 'next';
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;

  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }

  if (diff > 0 && data.currentTranslate > swiper.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.minTranslate() - 1 + (-swiper.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data.currentTranslate < swiper.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance) data.currentTranslate = swiper.maxTranslate() + 1 - (swiper.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
  }

  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  } // Directions locks


  if (!swiper.allowSlideNext && swiper.swipeDirection === 'next' && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && swiper.swipeDirection === 'prev' && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }

  if (!swiper.allowSlidePrev && !swiper.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  } // Threshold


  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }

  if (!params.followFinger || params.cssMode) return; // Update active index in free mode

  if (params.freeMode && params.freeMode.enabled && swiper.freeMode || params.watchSlidesProgress) {
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  if (swiper.params.freeMode && params.freeMode.enabled && swiper.freeMode) {
    swiper.freeMode.onTouchMove();
  } // Update progress


  swiper.updateProgress(data.currentTranslate); // Update translate

  swiper.setTranslate(data.currentTranslate);
}function onTouchEnd(event) {
  const swiper = this;
  const data = swiper.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper;
  if (!enabled) return;
  let e = event;
  if (e.originalEvent) e = e.originalEvent;

  if (data.allowTouchCallbacks) {
    swiper.emit('touchEnd', e);
  }

  data.allowTouchCallbacks = false;

  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper.setGrabCursor(false);
    }

    data.isMoved = false;
    data.startMoving = false;
    return;
  } // Return Grab Cursor


  if (params.grabCursor && data.isMoved && data.isTouched && (swiper.allowSlideNext === true || swiper.allowSlidePrev === true)) {
    swiper.setGrabCursor(false);
  } // Time diff


  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime; // Tap, doubleTap, Click

  if (swiper.allowClick) {
    swiper.updateClickedSlide(e);
    swiper.emit('tap click', e);

    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper.emit('doubleTap doubleClick', e);
    }
  }

  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper.destroyed) swiper.allowClick = true;
  });

  if (!data.isTouched || !data.isMoved || !swiper.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }

  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;

  if (params.followFinger) {
    currentPos = rtl ? swiper.translate : -swiper.translate;
  } else {
    currentPos = -data.currentTranslate;
  }

  if (params.cssMode) {
    return;
  }

  if (swiper.params.freeMode && params.freeMode.enabled) {
    swiper.freeMode.onTouchEnd({
      currentPos
    });
    return;
  } // Find current slide


  let stopIndex = 0;
  let groupSize = swiper.slidesSizesGrid[0];

  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

    if (typeof slidesGrid[i + increment] !== 'undefined') {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  } // Find current slide size


  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;

  if (timeDiff > params.longSwipesMs) {
    // Long touches
    if (!params.longSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    if (swiper.swipeDirection === 'next') {
      if (ratio >= params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
    }

    if (swiper.swipeDirection === 'prev') {
      if (ratio > 1 - params.longSwipesRatio) swiper.slideTo(stopIndex + increment);else swiper.slideTo(stopIndex);
    }
  } else {
    // Short swipes
    if (!params.shortSwipes) {
      swiper.slideTo(swiper.activeIndex);
      return;
    }

    const isNavButtonTarget = swiper.navigation && (e.target === swiper.navigation.nextEl || e.target === swiper.navigation.prevEl);

    if (!isNavButtonTarget) {
      if (swiper.swipeDirection === 'next') {
        swiper.slideTo(stopIndex + increment);
      }

      if (swiper.swipeDirection === 'prev') {
        swiper.slideTo(stopIndex);
      }
    } else if (e.target === swiper.navigation.nextEl) {
      swiper.slideTo(stopIndex + increment);
    } else {
      swiper.slideTo(stopIndex);
    }
  }
}function onResize() {
  const swiper = this;
  const {
    params,
    el
  } = swiper;
  if (el && el.offsetWidth === 0) return; // Breakpoints

  if (params.breakpoints) {
    swiper.setBreakpoint();
  } // Save locks


  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper; // Disable locks on resize

  swiper.allowSlideNext = true;
  swiper.allowSlidePrev = true;
  swiper.updateSize();
  swiper.updateSlides();
  swiper.updateSlidesClasses();

  if ((params.slidesPerView === 'auto' || params.slidesPerView > 1) && swiper.isEnd && !swiper.isBeginning && !swiper.params.centeredSlides) {
    swiper.slideTo(swiper.slides.length - 1, 0, false, true);
  } else {
    swiper.slideTo(swiper.activeIndex, 0, false, true);
  }

  if (swiper.autoplay && swiper.autoplay.running && swiper.autoplay.paused) {
    swiper.autoplay.run();
  } // Return locks after resize


  swiper.allowSlidePrev = allowSlidePrev;
  swiper.allowSlideNext = allowSlideNext;

  if (swiper.params.watchOverflow && snapGrid !== swiper.snapGrid) {
    swiper.checkOverflow();
  }
}function onClick(e) {
  const swiper = this;
  if (!swiper.enabled) return;

  if (!swiper.allowClick) {
    if (swiper.params.preventClicks) e.preventDefault();

    if (swiper.params.preventClicksPropagation && swiper.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}function onScroll() {
  const swiper = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper;
  if (!enabled) return;
  swiper.previousTranslate = swiper.translate;

  if (swiper.isHorizontal()) {
    swiper.translate = -wrapperEl.scrollLeft;
  } else {
    swiper.translate = -wrapperEl.scrollTop;
  } // eslint-disable-next-line


  if (swiper.translate === -0) swiper.translate = 0;
  swiper.updateActiveIndex();
  swiper.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate();

  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper.translate - swiper.minTranslate()) / translatesDiff;
  }

  if (newProgress !== swiper.progress) {
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate);
  }

  swiper.emit('setTranslate', swiper.translate, false);
}let dummyEventAttached = false;

function dummyEventListener() {}

const events = (swiper, method) => {
  const document = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support
  } = swiper;
  const capture = !!params.nested;
  const domMethod = method === 'on' ? 'addEventListener' : 'removeEventListener';
  const swiperMethod = method; // Touch Events

  if (!support.touch) {
    el[domMethod](touchEvents.start, swiper.onTouchStart, false);
    document[domMethod](touchEvents.move, swiper.onTouchMove, capture);
    document[domMethod](touchEvents.end, swiper.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === 'touchstart' && support.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper.onTouchMove, support.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper.onTouchEnd, passiveListener);

    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper.onTouchEnd, passiveListener);
    }
  } // Prevent Links Clicks


  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]('click', swiper.onClick, true);
  }

  if (params.cssMode) {
    wrapperEl[domMethod]('scroll', swiper.onScroll);
  } // Resize handler


  if (params.updateOnWindowResize) {
    swiper[swiperMethod](device.ios || device.android ? 'resize orientationchange observerUpdate' : 'resize observerUpdate', onResize, true);
  } else {
    swiper[swiperMethod]('observerUpdate', onResize, true);
  }
};

function attachEvents() {
  const swiper = this;
  const document = getDocument();
  const {
    params,
    support
  } = swiper;
  swiper.onTouchStart = onTouchStart.bind(swiper);
  swiper.onTouchMove = onTouchMove.bind(swiper);
  swiper.onTouchEnd = onTouchEnd.bind(swiper);

  if (params.cssMode) {
    swiper.onScroll = onScroll.bind(swiper);
  }

  swiper.onClick = onClick.bind(swiper);

  if (support.touch && !dummyEventAttached) {
    document.addEventListener('touchstart', dummyEventListener);
    dummyEventAttached = true;
  }

  events(swiper, 'on');
}

function detachEvents() {
  const swiper = this;
  events(swiper, 'off');
}

var events$1 = {
  attachEvents,
  detachEvents
};const isGridEnabled = (swiper, params) => {
  return swiper.grid && params.grid && params.grid.rows > 1;
};

function setBreakpoint() {
  const swiper = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper;
  const breakpoints = params.breakpoints;
  if (!breakpoints || breakpoints && Object.keys(breakpoints).length === 0) return; // Get breakpoint for window width and update parameters

  const breakpoint = swiper.getBreakpoint(breakpoints, swiper.params.breakpointsBase, swiper.el);
  if (!breakpoint || swiper.currentBreakpoint === breakpoint) return;
  const breakpointOnlyParams = breakpoint in breakpoints ? breakpoints[breakpoint] : undefined;
  const breakpointParams = breakpointOnlyParams || swiper.originalParams;
  const wasMultiRow = isGridEnabled(swiper, params);
  const isMultiRow = isGridEnabled(swiper, breakpointParams);
  const wasEnabled = params.enabled;

  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);

    if (breakpointParams.grid.fill && breakpointParams.grid.fill === 'column' || !breakpointParams.grid.fill && params.grid.fill === 'column') {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }

    swiper.emitContainerClasses();
  }

  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);

  if (directionChanged && initialized) {
    swiper.changeDirection();
  }

  extend$1(swiper.params, breakpointParams);
  const isEnabled = swiper.params.enabled;
  Object.assign(swiper, {
    allowTouchMove: swiper.params.allowTouchMove,
    allowSlideNext: swiper.params.allowSlideNext,
    allowSlidePrev: swiper.params.allowSlidePrev
  });

  if (wasEnabled && !isEnabled) {
    swiper.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper.enable();
  }

  swiper.currentBreakpoint = breakpoint;
  swiper.emit('_beforeBreakpoint', breakpointParams);

  if (needsReLoop && initialized) {
    swiper.loopDestroy();
    swiper.loopCreate();
    swiper.updateSlides();
    swiper.slideTo(activeIndex - loopedSlides + swiper.loopedSlides, 0, false);
  }

  swiper.emit('breakpoint', breakpointParams);
}function getBreakpoint(breakpoints, base = 'window', containerEl) {
  if (!breakpoints || base === 'container' && !containerEl) return undefined;
  let breakpoint = false;
  const window = getWindow();
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints).map(point => {
    if (typeof point === 'string' && point.indexOf('@') === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }

    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));

  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];

    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }

  return breakpoint || 'max';
}var breakpoints = {
  setBreakpoint,
  getBreakpoint
};function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach(item => {
    if (typeof item === 'object') {
      Object.keys(item).forEach(classNames => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === 'string') {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}

function addClasses() {
  const swiper = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support
  } = swiper; // prettier-ignore

  const suffixes = prepareClasses(['initialized', params.direction, {
    'pointer-events': !support.touch
  }, {
    'free-mode': swiper.params.freeMode && params.freeMode.enabled
  }, {
    'autoheight': params.autoHeight
  }, {
    'rtl': rtl
  }, {
    'grid': params.grid && params.grid.rows > 1
  }, {
    'grid-column': params.grid && params.grid.rows > 1 && params.grid.fill === 'column'
  }, {
    'android': device.android
  }, {
    'ios': device.ios
  }, {
    'css-mode': params.cssMode
  }, {
    'centered': params.cssMode && params.centeredSlides
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(' '));
  swiper.emitContainerClasses();
}function removeClasses() {
  const swiper = this;
  const {
    $el,
    classNames
  } = swiper;
  $el.removeClass(classNames.join(' '));
  swiper.emitContainerClasses();
}var classes = {
  addClasses,
  removeClasses
};function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window = getWindow();
  let image;

  function onReady() {
    if (callback) callback();
  }

  const isPicture = $(imageEl).parent('picture')[0];

  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window.Image();
      image.onload = onReady;
      image.onerror = onReady;

      if (sizes) {
        image.sizes = sizes;
      }

      if (srcset) {
        image.srcset = srcset;
      }

      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    // image already loaded...
    onReady();
  }
}function preloadImages() {
  const swiper = this;
  swiper.imagesToLoad = swiper.$el.find('img');

  function onReady() {
    if (typeof swiper === 'undefined' || swiper === null || !swiper || swiper.destroyed) return;
    if (swiper.imagesLoaded !== undefined) swiper.imagesLoaded += 1;

    if (swiper.imagesLoaded === swiper.imagesToLoad.length) {
      if (swiper.params.updateOnImagesReady) swiper.update();
      swiper.emit('imagesReady');
    }
  }

  for (let i = 0; i < swiper.imagesToLoad.length; i += 1) {
    const imageEl = swiper.imagesToLoad[i];
    swiper.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute('src'), imageEl.srcset || imageEl.getAttribute('srcset'), imageEl.sizes || imageEl.getAttribute('sizes'), true, onReady);
  }
}var images = {
  loadImage,
  preloadImages
};function checkOverflow() {
  const swiper = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper;
  const {
    slidesOffsetBefore
  } = params;

  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper.slides.length - 1;
    const lastSlideRightEdge = swiper.slidesGrid[lastSlideIndex] + swiper.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper.isLocked = swiper.size > lastSlideRightEdge;
  } else {
    swiper.isLocked = swiper.snapGrid.length === 1;
  }

  if (params.allowSlideNext === true) {
    swiper.allowSlideNext = !swiper.isLocked;
  }

  if (params.allowSlidePrev === true) {
    swiper.allowSlidePrev = !swiper.isLocked;
  }

  if (wasLocked && wasLocked !== swiper.isLocked) {
    swiper.isEnd = false;
  }

  if (wasLocked !== swiper.isLocked) {
    swiper.emit(swiper.isLocked ? 'lock' : 'unlock');
  }
}

var checkOverflow$1 = {
  checkOverflow
};var defaults = {
  init: true,
  direction: 'horizontal',
  touchEventsTarget: 'wrapper',
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: 'input, select, option, textarea, button, video, label',
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: 'slide',
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: undefined,
  breakpointsBase: 'window',
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // Images
  preloadImages: true,
  updateOnImagesReady: true,
  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: 'swiper-no-swiping',
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  // NS
  containerModifierClass: 'swiper-',
  // NEW
  slideClass: 'swiper-slide',
  slideBlankClass: 'swiper-slide-invisible-blank',
  slideActiveClass: 'swiper-slide-active',
  slideDuplicateActiveClass: 'swiper-slide-duplicate-active',
  slideVisibleClass: 'swiper-slide-visible',
  slideDuplicateClass: 'swiper-slide-duplicate',
  slideNextClass: 'swiper-slide-next',
  slideDuplicateNextClass: 'swiper-slide-duplicate-next',
  slidePrevClass: 'swiper-slide-prev',
  slideDuplicatePrevClass: 'swiper-slide-duplicate-prev',
  wrapperClass: 'swiper-wrapper',
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];

    if (typeof moduleParams !== 'object' || moduleParams === null) {
      extend$1(allModulesParams, obj);
      return;
    }

    if (['navigation', 'pagination', 'scrollbar'].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }

    if (!(moduleParamName in params && 'enabled' in moduleParams)) {
      extend$1(allModulesParams, obj);
      return;
    }

    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }

    if (typeof params[moduleParamName] === 'object' && !('enabled' in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }

    if (!params[moduleParamName]) params[moduleParamName] = {
      enabled: false
    };
    extend$1(allModulesParams, obj);
  };
}/* eslint no-param-reassign: "off" */
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition: transition$1,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
  images
};
const extendedDefaults = {};

class Swiper {
  constructor(...args) {
    let el;
    let params;

    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === 'Object') {
      params = args[0];
    } else {
      [el, params] = args;
    }

    if (!params) params = {};
    params = extend$1({}, params);
    if (el && !params.el) params.el = el;

    if (params.el && $(params.el).length > 1) {
      const swipers = [];
      $(params.el).each(containerEl => {
        const newParams = extend$1({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    } // Swiper Instance


    const swiper = this;
    swiper.__swiper__ = true;
    swiper.support = getSupport();
    swiper.device = getDevice({
      userAgent: params.userAgent
    });
    swiper.browser = getBrowser();
    swiper.eventsListeners = {};
    swiper.eventsAnyListeners = [];
    swiper.modules = [...swiper.__modules__];

    if (params.modules && Array.isArray(params.modules)) {
      swiper.modules.push(...params.modules);
    }

    const allModulesParams = {};
    swiper.modules.forEach(mod => {
      mod({
        swiper,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper.on.bind(swiper),
        once: swiper.once.bind(swiper),
        off: swiper.off.bind(swiper),
        emit: swiper.emit.bind(swiper)
      });
    }); // Extend defaults with modules params

    const swiperParams = extend$1({}, defaults, allModulesParams); // Extend defaults with passed params

    swiper.params = extend$1({}, swiperParams, extendedDefaults, params);
    swiper.originalParams = extend$1({}, swiper.params);
    swiper.passedParams = extend$1({}, params); // add event listeners

    if (swiper.params && swiper.params.on) {
      Object.keys(swiper.params.on).forEach(eventName => {
        swiper.on(eventName, swiper.params.on[eventName]);
      });
    }

    if (swiper.params && swiper.params.onAny) {
      swiper.onAny(swiper.params.onAny);
    } // Save Dom lib


    swiper.$ = $; // Extend Swiper

    Object.assign(swiper, {
      enabled: swiper.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: $(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],

      // isDirection
      isHorizontal() {
        return swiper.params.direction === 'horizontal';
      },

      isVertical() {
        return swiper.params.direction === 'vertical';
      },

      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      // Locks
      allowSlideNext: swiper.params.allowSlideNext,
      allowSlidePrev: swiper.params.allowSlidePrev,
      // Touch Events
      touchEvents: function touchEvents() {
        const touch = ['touchstart', 'touchmove', 'touchend', 'touchcancel'];
        const desktop = ['pointerdown', 'pointermove', 'pointerup'];
        swiper.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper.support.touch || !swiper.params.simulateTouch ? swiper.touchEventsTouch : swiper.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: undefined,
        isMoved: undefined,
        allowTouchCallbacks: undefined,
        touchStartTime: undefined,
        isScrolling: undefined,
        currentTranslate: undefined,
        startTranslate: undefined,
        allowThresholdMove: undefined,
        // Form elements to match
        focusableElements: swiper.params.focusableElements,
        // Last click time
        lastClickTime: now(),
        clickTimeout: undefined,
        // Velocities
        velocities: [],
        allowMomentumBounce: undefined,
        isTouchEvent: undefined,
        startMoving: undefined
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper.emit('_swiper'); // Init

    if (swiper.params.init) {
      swiper.init();
    } // Return app instance


    return swiper;
  }

  enable() {
    const swiper = this;
    if (swiper.enabled) return;
    swiper.enabled = true;

    if (swiper.params.grabCursor) {
      swiper.setGrabCursor();
    }

    swiper.emit('enable');
  }

  disable() {
    const swiper = this;
    if (!swiper.enabled) return;
    swiper.enabled = false;

    if (swiper.params.grabCursor) {
      swiper.unsetGrabCursor();
    }

    swiper.emit('disable');
  }

  setProgress(progress, speed) {
    const swiper = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper.minTranslate();
    const max = swiper.maxTranslate();
    const current = (max - min) * progress + min;
    swiper.translateTo(current, typeof speed === 'undefined' ? 0 : speed);
    swiper.updateActiveIndex();
    swiper.updateSlidesClasses();
  }

  emitContainerClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const cls = swiper.el.className.split(' ').filter(className => {
      return className.indexOf('swiper') === 0 || className.indexOf(swiper.params.containerModifierClass) === 0;
    });
    swiper.emit('_containerClasses', cls.join(' '));
  }

  getSlideClasses(slideEl) {
    const swiper = this;
    return slideEl.className.split(' ').filter(className => {
      return className.indexOf('swiper-slide') === 0 || className.indexOf(swiper.params.slideClass) === 0;
    }).join(' ');
  }

  emitSlidesClasses() {
    const swiper = this;
    if (!swiper.params._emitClasses || !swiper.el) return;
    const updates = [];
    swiper.slides.each(slideEl => {
      const classNames = swiper.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper.emit('_slideClass', slideEl, classNames);
    });
    swiper.emit('_slideClasses', updates);
  }

  slidesPerViewDynamic(view = 'current', exact = false) {
    const swiper = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper;
    let spv = 1;

    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].swiperSlideSize;
      let breakLoop;

      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }

      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize) breakLoop = true;
        }
      }
    } else {
      // eslint-disable-next-line
      if (view === 'current') {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;

          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        // previous
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;

          if (slideInView) {
            spv += 1;
          }
        }
      }
    }

    return spv;
  }

  update() {
    const swiper = this;
    if (!swiper || swiper.destroyed) return;
    const {
      snapGrid,
      params
    } = swiper; // Breakpoints

    if (params.breakpoints) {
      swiper.setBreakpoint();
    }

    swiper.updateSize();
    swiper.updateSlides();
    swiper.updateProgress();
    swiper.updateSlidesClasses();

    function setTranslate() {
      const translateValue = swiper.rtlTranslate ? swiper.translate * -1 : swiper.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper.maxTranslate()), swiper.minTranslate());
      swiper.setTranslate(newTranslate);
      swiper.updateActiveIndex();
      swiper.updateSlidesClasses();
    }

    let translated;

    if (swiper.params.freeMode && swiper.params.freeMode.enabled) {
      setTranslate();

      if (swiper.params.autoHeight) {
        swiper.updateAutoHeight();
      }
    } else {
      if ((swiper.params.slidesPerView === 'auto' || swiper.params.slidesPerView > 1) && swiper.isEnd && !swiper.params.centeredSlides) {
        translated = swiper.slideTo(swiper.slides.length - 1, 0, false, true);
      } else {
        translated = swiper.slideTo(swiper.activeIndex, 0, false, true);
      }

      if (!translated) {
        setTranslate();
      }
    }

    if (params.watchOverflow && snapGrid !== swiper.snapGrid) {
      swiper.checkOverflow();
    }

    swiper.emit('update');
  }

  changeDirection(newDirection, needUpdate = true) {
    const swiper = this;
    const currentDirection = swiper.params.direction;

    if (!newDirection) {
      // eslint-disable-next-line
      newDirection = currentDirection === 'horizontal' ? 'vertical' : 'horizontal';
    }

    if (newDirection === currentDirection || newDirection !== 'horizontal' && newDirection !== 'vertical') {
      return swiper;
    }

    swiper.$el.removeClass(`${swiper.params.containerModifierClass}${currentDirection}`).addClass(`${swiper.params.containerModifierClass}${newDirection}`);
    swiper.emitContainerClasses();
    swiper.params.direction = newDirection;
    swiper.slides.each(slideEl => {
      if (newDirection === 'vertical') {
        slideEl.style.width = '';
      } else {
        slideEl.style.height = '';
      }
    });
    swiper.emit('changeDirection');
    if (needUpdate) swiper.update();
    return swiper;
  }

  mount(el) {
    const swiper = this;
    if (swiper.mounted) return true; // Find el

    const $el = $(el || swiper.params.el);
    el = $el[0];

    if (!el) {
      return false;
    }

    el.swiper = swiper;

    const getWrapperSelector = () => {
      return `.${(swiper.params.wrapperClass || '').trim().split(' ').join('.')}`;
    };

    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $(el.shadowRoot.querySelector(getWrapperSelector())); // Children needs to return slot items

        res.children = options => $el.children(options);

        return res;
      }

      return $el.children(getWrapperSelector());
    }; // Find Wrapper


    let $wrapperEl = getWrapper();

    if ($wrapperEl.length === 0 && swiper.params.createElements) {
      const document = getDocument();
      const wrapper = document.createElement('div');
      $wrapperEl = $(wrapper);
      wrapper.className = swiper.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper.params.slideClass}`).each(slideEl => {
        $wrapperEl.append(slideEl);
      });
    }

    Object.assign(swiper, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl',
      rtlTranslate: swiper.params.direction === 'horizontal' && (el.dir.toLowerCase() === 'rtl' || $el.css('direction') === 'rtl'),
      wrongRTL: $wrapperEl.css('display') === '-webkit-box'
    });
    return true;
  }

  init(el) {
    const swiper = this;
    if (swiper.initialized) return swiper;
    const mounted = swiper.mount(el);
    if (mounted === false) return swiper;
    swiper.emit('beforeInit'); // Set breakpoint

    if (swiper.params.breakpoints) {
      swiper.setBreakpoint();
    } // Add Classes


    swiper.addClasses(); // Create loop

    if (swiper.params.loop) {
      swiper.loopCreate();
    } // Update size


    swiper.updateSize(); // Update slides

    swiper.updateSlides();

    if (swiper.params.watchOverflow) {
      swiper.checkOverflow();
    } // Set Grab Cursor


    if (swiper.params.grabCursor && swiper.enabled) {
      swiper.setGrabCursor();
    }

    if (swiper.params.preloadImages) {
      swiper.preloadImages();
    } // Slide To Initial Slide


    if (swiper.params.loop) {
      swiper.slideTo(swiper.params.initialSlide + swiper.loopedSlides, 0, swiper.params.runCallbacksOnInit, false, true);
    } else {
      swiper.slideTo(swiper.params.initialSlide, 0, swiper.params.runCallbacksOnInit, false, true);
    } // Attach events


    swiper.attachEvents(); // Init Flag

    swiper.initialized = true; // Emit

    swiper.emit('init');
    swiper.emit('afterInit');
    return swiper;
  }

  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides
    } = swiper;

    if (typeof swiper.params === 'undefined' || swiper.destroyed) {
      return null;
    }

    swiper.emit('beforeDestroy'); // Init Flag

    swiper.initialized = false; // Detach events

    swiper.detachEvents(); // Destroy loop

    if (params.loop) {
      swiper.loopDestroy();
    } // Cleanup styles


    if (cleanStyles) {
      swiper.removeClasses();
      $el.removeAttr('style');
      $wrapperEl.removeAttr('style');

      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-slide-index');
      }
    }

    swiper.emit('destroy'); // Detach emitter events

    Object.keys(swiper.eventsListeners).forEach(eventName => {
      swiper.off(eventName);
    });

    if (deleteInstance !== false) {
      swiper.$el[0].swiper = null;
      deleteProps(swiper);
    }

    swiper.destroyed = true;
    return null;
  }

  static extendDefaults(newDefaults) {
    extend$1(extendedDefaults, newDefaults);
  }

  static get extendedDefaults() {
    return extendedDefaults;
  }

  static get defaults() {
    return defaults;
  }

  static installModule(mod) {
    if (!Swiper.prototype.__modules__) Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;

    if (typeof mod === 'function' && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }

  static use(module) {
    if (Array.isArray(module)) {
      module.forEach(m => Swiper.installModule(m));
      return Swiper;
    }

    Swiper.installModule(module);
    return Swiper;
  }

}

Object.keys(prototypes).forEach(prototypeGroup => {
  Object.keys(prototypes[prototypeGroup]).forEach(protoMethod => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  const document = getDocument();

  if (swiper.params.createElements) {
    Object.keys(checkProps).forEach(key => {
      if (!params[key] && params.auto === true) {
        let element = swiper.$el.children(`.${checkProps[key]}`)[0];

        if (!element) {
          element = document.createElement('div');
          element.className = checkProps[key];
          swiper.$el.append(element);
        }

        params[key] = element;
        originalParams[key] = element;
      }
    });
  }

  return params;
}function Navigation({
  swiper,
  extendParams,
  on,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: 'swiper-button-disabled',
      hiddenClass: 'swiper-button-hidden',
      lockClass: 'swiper-button-lock'
    }
  });
  swiper.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };

  function getEl(el) {
    let $el;

    if (el) {
      $el = $(el);

      if (swiper.params.uniqueNavElements && typeof el === 'string' && $el.length > 1 && swiper.$el.find(el).length === 1) {
        $el = swiper.$el.find(el);
      }
    }

    return $el;
  }

  function toggleEl($el, disabled) {
    const params = swiper.params.navigation;

    if ($el && $el.length > 0) {
      $el[disabled ? 'addClass' : 'removeClass'](params.disabledClass);
      if ($el[0] && $el[0].tagName === 'BUTTON') $el[0].disabled = disabled;

      if (swiper.params.watchOverflow && swiper.enabled) {
        $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
      }
    }
  }

  function update() {
    // Update Navigation Buttons
    if (swiper.params.loop) return;
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    toggleEl($prevEl, swiper.isBeginning);
    toggleEl($nextEl, swiper.isEnd);
  }

  function onPrevClick(e) {
    e.preventDefault();
    if (swiper.isBeginning && !swiper.params.loop) return;
    swiper.slidePrev();
  }

  function onNextClick(e) {
    e.preventDefault();
    if (swiper.isEnd && !swiper.params.loop) return;
    swiper.slideNext();
  }

  function init() {
    const params = swiper.params.navigation;
    swiper.params.navigation = createElementIfNotDefined(swiper, swiper.originalParams.navigation, swiper.params.navigation, {
      nextEl: 'swiper-button-next',
      prevEl: 'swiper-button-prev'
    });
    if (!(params.nextEl || params.prevEl)) return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);

    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on('click', onNextClick);
    }

    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on('click', onPrevClick);
    }

    Object.assign(swiper.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });

    if (!swiper.enabled) {
      if ($nextEl) $nextEl.addClass(params.lockClass);
      if ($prevEl) $prevEl.addClass(params.lockClass);
    }
  }

  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl && $nextEl.length) {
      $nextEl.off('click', onNextClick);
      $nextEl.removeClass(swiper.params.navigation.disabledClass);
    }

    if ($prevEl && $prevEl.length) {
      $prevEl.off('click', onPrevClick);
      $prevEl.removeClass(swiper.params.navigation.disabledClass);
    }
  }

  on('init', () => {
    init();
    update();
  });
  on('toEdge fromEdge lock unlock', () => {
    update();
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;

    if ($nextEl) {
      $nextEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }

    if ($prevEl) {
      $prevEl[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.navigation.lockClass);
    }
  });
  on('click', (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper.navigation;
    const targetEl = e.target;

    if (swiper.params.navigation.hideOnClick && !$(targetEl).is($prevEl) && !$(targetEl).is($nextEl)) {
      if (swiper.pagination && swiper.params.pagination && swiper.params.pagination.clickable && (swiper.pagination.el === targetEl || swiper.pagination.el.contains(targetEl))) return;
      let isHidden;

      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper.params.navigation.hiddenClass);
      }

      if (isHidden === true) {
        emit('navigationShow');
      } else {
        emit('navigationHide');
      }

      if ($nextEl) {
        $nextEl.toggleClass(swiper.params.navigation.hiddenClass);
      }

      if ($prevEl) {
        $prevEl.toggleClass(swiper.params.navigation.hiddenClass);
      }
    }
  });
  Object.assign(swiper.navigation, {
    update,
    init,
    destroy
  });
}function classesToSelector(classes = '') {
  return `.${classes.trim().replace(/([\.:!\/])/g, '\\$1') // eslint-disable-line
  .replace(/ /g, '.')}`;
}function Pagination({
  swiper,
  extendParams,
  on,
  emit
}) {
  const pfx = 'swiper-pagination';
  extendParams({
    pagination: {
      el: null,
      bulletElement: 'span',
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: 'bullets',
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: number => number,
      formatFractionTotal: number => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`
    }
  });
  swiper.pagination = {
    el: null,
    $el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;

  function isPaginationDisabled() {
    return !swiper.params.pagination.el || !swiper.pagination.el || !swiper.pagination.$el || swiper.pagination.$el.length === 0;
  }

  function setSideBullets($bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper.params.pagination;
    $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
  }

  function update() {
    // Render || Update Pagination bullets/items
    const rtl = swiper.rtl;
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el; // Current/Total

    let current;
    const total = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

    if (swiper.params.loop) {
      current = Math.ceil((swiper.activeIndex - swiper.loopedSlides) / swiper.params.slidesPerGroup);

      if (current > slidesLength - 1 - swiper.loopedSlides * 2) {
        current -= slidesLength - swiper.loopedSlides * 2;
      }

      if (current > total - 1) current -= total;
      if (current < 0 && swiper.params.paginationType !== 'bullets') current = total + current;
    } else if (typeof swiper.snapIndex !== 'undefined') {
      current = swiper.snapIndex;
    } else {
      current = swiper.activeIndex || 0;
    } // Types


    if (params.type === 'bullets' && swiper.pagination.bullets && swiper.pagination.bullets.length > 0) {
      const bullets = swiper.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;

      if (params.dynamicBullets) {
        bulletSize = bullets.eq(0)[swiper.isHorizontal() ? 'outerWidth' : 'outerHeight'](true);
        $el.css(swiper.isHorizontal() ? 'width' : 'height', `${bulletSize * (params.dynamicMainBullets + 4)}px`);

        if (params.dynamicMainBullets > 1 && swiper.previousIndex !== undefined) {
          dynamicBulletIndex += current - swiper.previousIndex;

          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }

        firstIndex = current - dynamicBulletIndex;
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }

      bullets.removeClass(['', '-next', '-next-next', '-prev', '-prev-prev', '-main'].map(suffix => `${params.bulletActiveClass}${suffix}`).join(' '));

      if ($el.length > 1) {
        bullets.each(bullet => {
          const $bullet = $(bullet);
          const bulletIndex = $bullet.index();

          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }

          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(`${params.bulletActiveClass}-main`);
            }

            if (bulletIndex === firstIndex) {
              setSideBullets($bullet, 'prev');
            }

            if (bulletIndex === lastIndex) {
              setSideBullets($bullet, 'next');
            }
          }
        });
      } else {
        const $bullet = bullets.eq(current);
        const bulletIndex = $bullet.index();
        $bullet.addClass(params.bulletActiveClass);

        if (params.dynamicBullets) {
          const $firstDisplayedBullet = bullets.eq(firstIndex);
          const $lastDisplayedBullet = bullets.eq(lastIndex);

          for (let i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
          }

          if (swiper.params.loop) {
            if (bulletIndex >= bullets.length - params.dynamicMainBullets) {
              for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
              }

              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
            } else {
              setSideBullets($firstDisplayedBullet, 'prev');
              setSideBullets($lastDisplayedBullet, 'next');
            }
          } else {
            setSideBullets($firstDisplayedBullet, 'prev');
            setSideBullets($lastDisplayedBullet, 'next');
          }
        }
      }

      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? 'right' : 'left';
        bullets.css(swiper.isHorizontal() ? offsetProp : 'top', `${bulletsOffset}px`);
      }
    }

    if (params.type === 'fraction') {
      $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
      $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
    }

    if (params.type === 'progressbar') {
      let progressbarDirection;

      if (params.progressbarOpposite) {
        progressbarDirection = swiper.isHorizontal() ? 'vertical' : 'horizontal';
      } else {
        progressbarDirection = swiper.isHorizontal() ? 'horizontal' : 'vertical';
      }

      const scale = (current + 1) / total;
      let scaleX = 1;
      let scaleY = 1;

      if (progressbarDirection === 'horizontal') {
        scaleX = scale;
      } else {
        scaleY = scale;
      }

      $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper.params.speed);
    }

    if (params.type === 'custom' && params.renderCustom) {
      $el.html(params.renderCustom(swiper, current + 1, total));
      emit('paginationRender', $el[0]);
    } else {
      emit('paginationUpdate', $el[0]);
    }

    if (swiper.params.watchOverflow && swiper.enabled) {
      $el[swiper.isLocked ? 'addClass' : 'removeClass'](params.lockClass);
    }
  }

  function render() {
    // Render Container
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const slidesLength = swiper.virtual && swiper.params.virtual.enabled ? swiper.virtual.slides.length : swiper.slides.length;
    const $el = swiper.pagination.$el;
    let paginationHTML = '';

    if (params.type === 'bullets') {
      let numberOfBullets = swiper.params.loop ? Math.ceil((slidesLength - swiper.loopedSlides * 2) / swiper.params.slidesPerGroup) : swiper.snapGrid.length;

      if (swiper.params.freeMode && swiper.params.freeMode.enabled && !swiper.params.loop && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }

      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper, i, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }

      $el.html(paginationHTML);
      swiper.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
    }

    if (params.type === 'fraction') {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span>` + ' / ' + `<span class="${params.totalClass}"></span>`;
      }

      $el.html(paginationHTML);
    }

    if (params.type === 'progressbar') {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }

      $el.html(paginationHTML);
    }

    if (params.type !== 'custom') {
      emit('paginationRender', swiper.pagination.$el[0]);
    }
  }

  function init() {
    swiper.params.pagination = createElementIfNotDefined(swiper, swiper.originalParams.pagination, swiper.params.pagination, {
      el: 'swiper-pagination'
    });
    const params = swiper.params.pagination;
    if (!params.el) return;
    let $el = $(params.el);
    if ($el.length === 0) return;

    if (swiper.params.uniqueNavElements && typeof params.el === 'string' && $el.length > 1) {
      $el = swiper.$el.find(params.el); // check if it belongs to another nested Swiper

      if ($el.length > 1) {
        $el = $el.filter(el => {
          if ($(el).parents('.swiper')[0] !== swiper.el) return false;
          return true;
        });
      }
    }

    if (params.type === 'bullets' && params.clickable) {
      $el.addClass(params.clickableClass);
    }

    $el.addClass(params.modifierClass + params.type);
    $el.addClass(params.modifierClass + swiper.params.direction);

    if (params.type === 'bullets' && params.dynamicBullets) {
      $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
      dynamicBulletIndex = 0;

      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }

    if (params.type === 'progressbar' && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }

    if (params.clickable) {
      $el.on('click', classesToSelector(params.bulletClass), function onClick(e) {
        e.preventDefault();
        let index = $(this).index() * swiper.params.slidesPerGroup;
        if (swiper.params.loop) index += swiper.loopedSlides;
        swiper.slideTo(index);
      });
    }

    Object.assign(swiper.pagination, {
      $el,
      el: $el[0]
    });

    if (!swiper.enabled) {
      $el.addClass(params.lockClass);
    }
  }

  function destroy() {
    const params = swiper.params.pagination;
    if (isPaginationDisabled()) return;
    const $el = swiper.pagination.$el;
    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    $el.removeClass(params.modifierClass + swiper.params.direction);
    if (swiper.pagination.bullets && swiper.pagination.bullets.removeClass) swiper.pagination.bullets.removeClass(params.bulletActiveClass);

    if (params.clickable) {
      $el.off('click', classesToSelector(params.bulletClass));
    }
  }

  on('init', () => {
    init();
    render();
    update();
  });
  on('activeIndexChange', () => {
    if (swiper.params.loop) {
      update();
    } else if (typeof swiper.snapIndex === 'undefined') {
      update();
    }
  });
  on('snapIndexChange', () => {
    if (!swiper.params.loop) {
      update();
    }
  });
  on('slidesLengthChange', () => {
    if (swiper.params.loop) {
      render();
      update();
    }
  });
  on('snapGridLengthChange', () => {
    if (!swiper.params.loop) {
      render();
      update();
    }
  });
  on('destroy', () => {
    destroy();
  });
  on('enable disable', () => {
    const {
      $el
    } = swiper.pagination;

    if ($el) {
      $el[swiper.enabled ? 'removeClass' : 'addClass'](swiper.params.pagination.lockClass);
    }
  });
  on('lock unlock', () => {
    update();
  });
  on('click', (_s, e) => {
    const targetEl = e.target;
    const {
      $el
    } = swiper.pagination;

    if (swiper.params.pagination.el && swiper.params.pagination.hideOnClick && $el.length > 0 && !$(targetEl).hasClass(swiper.params.pagination.bulletClass)) {
      if (swiper.navigation && (swiper.navigation.nextEl && targetEl === swiper.navigation.nextEl || swiper.navigation.prevEl && targetEl === swiper.navigation.prevEl)) return;
      const isHidden = $el.hasClass(swiper.params.pagination.hiddenClass);

      if (isHidden === true) {
        emit('paginationShow');
      } else {
        emit('paginationHide');
      }

      $el.toggleClass(swiper.params.pagination.hiddenClass);
    }
  });
  Object.assign(swiper.pagination, {
    render,
    update,
    init,
    destroy
  });
}/* eslint no-underscore-dangle: "off" */
function Autoplay({
  swiper,
  extendParams,
  on,
  emit
}) {
  let timeout;
  swiper.autoplay = {
    running: false,
    paused: false
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3000,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });

  function run() {
    const $activeSlideEl = swiper.slides.eq(swiper.activeIndex);
    let delay = swiper.params.autoplay.delay;

    if ($activeSlideEl.attr('data-swiper-autoplay')) {
      delay = $activeSlideEl.attr('data-swiper-autoplay') || swiper.params.autoplay.delay;
    }

    clearTimeout(timeout);
    timeout = nextTick(() => {
      let autoplayResult;

      if (swiper.params.autoplay.reverseDirection) {
        if (swiper.params.loop) {
          swiper.loopFix();
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.isBeginning) {
          autoplayResult = swiper.slidePrev(swiper.params.speed, true, true);
          emit('autoplay');
        } else if (!swiper.params.autoplay.stopOnLastSlide) {
          autoplayResult = swiper.slideTo(swiper.slides.length - 1, swiper.params.speed, true, true);
          emit('autoplay');
        } else {
          stop();
        }
      } else if (swiper.params.loop) {
        swiper.loopFix();
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        emit('autoplay');
      } else if (!swiper.isEnd) {
        autoplayResult = swiper.slideNext(swiper.params.speed, true, true);
        emit('autoplay');
      } else if (!swiper.params.autoplay.stopOnLastSlide) {
        autoplayResult = swiper.slideTo(0, swiper.params.speed, true, true);
        emit('autoplay');
      } else {
        stop();
      }

      if (swiper.params.cssMode && swiper.autoplay.running) run();else if (autoplayResult === false) {
        run();
      }
    }, delay);
  }

  function start() {
    if (typeof timeout !== 'undefined') return false;
    if (swiper.autoplay.running) return false;
    swiper.autoplay.running = true;
    emit('autoplayStart');
    run();
    return true;
  }

  function stop() {
    if (!swiper.autoplay.running) return false;
    if (typeof timeout === 'undefined') return false;

    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }

    swiper.autoplay.running = false;
    emit('autoplayStop');
    return true;
  }

  function pause(speed) {
    if (!swiper.autoplay.running) return;
    if (swiper.autoplay.paused) return;
    if (timeout) clearTimeout(timeout);
    swiper.autoplay.paused = true;

    if (speed === 0 || !swiper.params.autoplay.waitForTransition) {
      swiper.autoplay.paused = false;
      run();
    } else {
      ['transitionend', 'webkitTransitionEnd'].forEach(event => {
        swiper.$wrapperEl[0].addEventListener(event, onTransitionEnd);
      });
    }
  }

  function onVisibilityChange() {
    const document = getDocument();

    if (document.visibilityState === 'hidden' && swiper.autoplay.running) {
      pause();
    }

    if (document.visibilityState === 'visible' && swiper.autoplay.paused) {
      run();
      swiper.autoplay.paused = false;
    }
  }

  function onTransitionEnd(e) {
    if (!swiper || swiper.destroyed || !swiper.$wrapperEl) return;
    if (e.target !== swiper.$wrapperEl[0]) return;
    ['transitionend', 'webkitTransitionEnd'].forEach(event => {
      swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
    swiper.autoplay.paused = false;

    if (!swiper.autoplay.running) {
      stop();
    } else {
      run();
    }
  }

  function onMouseEnter() {
    if (swiper.params.autoplay.disableOnInteraction) {
      stop();
    } else {
      pause();
    }

    ['transitionend', 'webkitTransitionEnd'].forEach(event => {
      swiper.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
  }

  function onMouseLeave() {
    if (swiper.params.autoplay.disableOnInteraction) {
      return;
    }

    swiper.autoplay.paused = false;
    run();
  }

  function attachMouseEvents() {
    if (swiper.params.autoplay.pauseOnMouseEnter) {
      swiper.$el.on('mouseenter', onMouseEnter);
      swiper.$el.on('mouseleave', onMouseLeave);
    }
  }

  function detachMouseEvents() {
    swiper.$el.off('mouseenter', onMouseEnter);
    swiper.$el.off('mouseleave', onMouseLeave);
  }

  on('init', () => {
    if (swiper.params.autoplay.enabled) {
      start();
      const document = getDocument();
      document.addEventListener('visibilitychange', onVisibilityChange);
      attachMouseEvents();
    }
  });
  on('beforeTransitionStart', (_s, speed, internal) => {
    if (swiper.autoplay.running) {
      if (internal || !swiper.params.autoplay.disableOnInteraction) {
        swiper.autoplay.pause(speed);
      } else {
        stop();
      }
    }
  });
  on('sliderFirstMove', () => {
    if (swiper.autoplay.running) {
      if (swiper.params.autoplay.disableOnInteraction) {
        stop();
      } else {
        pause();
      }
    }
  });
  on('touchEnd', () => {
    if (swiper.params.cssMode && swiper.autoplay.paused && !swiper.params.autoplay.disableOnInteraction) {
      run();
    }
  });
  on('destroy', () => {
    detachMouseEvents();

    if (swiper.autoplay.running) {
      stop();
    }

    const document = getDocument();
    document.removeEventListener('visibilitychange', onVisibilityChange);
  });
  Object.assign(swiper.autoplay, {
    pause,
    run,
    start,
    stop
  });
}var SwiperSettings = function () {
  function SwiperSettings() {}

  SwiperSettings.getParams = function getParams(key) {
    return Object.assign({}, this.params[key]);
  };

  SwiperSettings.getFeatures = function getFeatures(key) {
    return this.features[key];
  };

  SwiperSettings.get = function get(key) {
    return {
      params: this.getParams(key),
      features: this.getFeatures(key)
    };
  };

  return SwiperSettings;
}();

_defineProperty(SwiperSettings, "params", {
  hero: {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'custom',
      renderCustom: function renderCustom(swiper, current, total) {
        var text = "";
        var names = [];
        Array.from(swiper.slides).forEach(function (x) {
          return names.push(x.getAttribute('data-swiper-name'));
        });

        for (var i = 1; i <= total; i++) {
          var activeClass = current == i ? 'swiper-pagination-bullet-active' : '';
          text += "<span class='swiper-pagination-bullet " + activeClass + "'>" + names[i] + "</span>";
        }

        return text;
      }
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    speed: 1200,
    loop: true,
    watchSlidesProgress: true
  },
  carousel3col: {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      type: 'bullets'
    },
    speed: 1200,
    breakpoints: {
      300: {
        slidesPerView: 1,
        spaceBetween: 40
      },
      640: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    }
  }
});

_defineProperty(SwiperSettings, "features", {});var SwiperSlider = function () {
  function SwiperSlider(node) {
    this.node = node;
    this.id = this.node.dataset.swiperId;
    this.type = this.node.dataset.swiperSlider;
    this.params = SwiperSettings.getParams(this.type);
    this.features = SwiperSettings.getFeatures(this.type);
    this.init();
  }

  var _proto = SwiperSlider.prototype;

  _proto.init = function init() {
    Swiper.use([Navigation, Pagination, Autoplay]);
    this.swiper = new Swiper(this.node, this.params);
  };

  SwiperSlider.init = function init() {
    SwiperSlider.item = document.querySelector('body').classList.contains('chr') ? Array.from(document.querySelectorAll('[data-swiper-slider]')).map(function (node, index) {
      return new SwiperSlider(node, index);
    }) : Array.from(document.querySelectorAll('[data-swiper]')).map(function (node, index) {
      return new SwiperSlider(node, index);
    });
  };

  return SwiperSlider;
}();var AccordionSelectFilters = function () {
  function AccordionSelectFilters(node, selectAttribute, categoriesAttribute) {
    this.node = node;
    this.selectAttribute = selectAttribute;
    this.categoriesAttribute = categoriesAttribute;
    this.select = this.node.querySelector("[" + this.selectAttribute + "]");
    this.categories = Array.from(this.node.querySelectorAll("[" + this.categoriesAttribute + "]"));
    this.data = this.getData();
    this.addListener();
  }

  var _proto = AccordionSelectFilters.prototype;

  _proto.addListener = function addListener() {
    var _this = this;

    this.select.addEventListener('change', function (e) {
      _this.onChange(e.currentTarget);
    });
  };

  _proto.getData = function getData() {
    var _this2 = this;

    var filteredArray = [];

    if (Dom.crm) {
      this.categories.forEach(function (category) {
        filteredArray.push({
          node: category,
          categories: category.getAttribute(_this2.categoriesAttribute).replace(/\s/g, '').split(',')
        });
      });
    }

    return filteredArray;
  };

  _proto.onChange = function onChange(node) {
    this.currentSelection = node.options[node.selectedIndex].value;

    if (this.currentSelection !== '0') {
      this.filterCategory();
    } else {
      this.reset();
    }
  };

  _proto.filterCategory = function filterCategory() {
    var _this3 = this;

    var selectedElements = [];
    this.data.forEach(function (item) {
      item.node.style.display = 'none';
      var findCat = item.categories.find(function (x) {
        return x === _this3.currentSelection;
      });

      if (findCat !== undefined) {
        selectedElements.push(item);
      }
    });
    selectedElements.forEach(function (item) {
      return item.node.style.display = 'block';
    });
  };

  _proto.reset = function reset() {
    this.data.forEach(function (item) {
      return item.node.style.display = 'block';
    });
  };

  return AccordionSelectFilters;
}();var Accordion = function () {
  function Accordion(node, selectors, settings, index) {
    this.node = node;
    this.index = index;
    this.selectors = {
      buttonAttribute: 'accordion-button',
      contentAttribute: 'accordion-content',
      filtersSelect: {
        select: 'data-accordion-select',
        category: 'data-accordion-cat'
      },
      activeClass: 'active'
    };
    this.settings = {
      closeOthers: false,
      toggleCurrent: false,
      defaultElementId: 0,
      filtersSelect: false,
      animations: false
    };

    if (selectors) {
      this.selectors = Object.assign(this.selectors, selectors);
    }

    if (settings) {
      this.settings = Object.assign(this.settings, settings);
    }

    this.buttons = Array.from(this.node.querySelectorAll("[" + this.selectors.buttonAttribute + "]"));
    this.contents = Array.from(this.node.querySelectorAll("[" + this.selectors.contentAttribute + "]"));
    this.init();
    this.addListeners();
  }

  var _proto = Accordion.prototype;

  _proto.init = function init() {
    if (typeof this.settings.defaultElementId === 'number' && this.settings.defaultElementId <= this.buttons.length) {
      this.contentHeight = this.getHeight(this.contents[this.settings.defaultElementId]);
      this.open(this.buttons[this.settings.defaultElementId], this.contents[this.settings.defaultElementId]);
    }

    if (this.settings.filtersSelect) {
      this.filtersSelect = new AccordionSelectFilters(this.node, this.selectors.filtersSelect.select, this.selectors.filtersSelect.category);
    }
  };

  _proto.addListeners = function addListeners() {
    var _this = this;

    this.buttons.forEach(function (button) {
      button.addEventListener('click', _this.onClick.bind(_this));
    });
    window.addEventListener('resize', this.onResize.bind(this));
  };

  _proto.onClick = function onClick(e) {
    var button = e.currentTarget;

    if (!button) {
      return;
    }

    this.currentId = button.getAttribute(this.selectors.buttonAttribute);

    if (!button.classList.contains(this.selectors.activeClass)) {
      this.reset();
      this.setActive(button);
    } else if (!this.settings.toggleCurrent) {
      this.close(button, this.contents[this.currentId]);
    }
  };

  _proto.setActive = function setActive(button) {
    var _this2 = this;

    this.contents.forEach(function (content) {
      var contentId = content.getAttribute(_this2.selectors.contentAttribute);
      var isCurrent = contentId === _this2.currentId;
      var hasActive = button.classList.contains(_this2.selectors.activeClass);

      if (!(isCurrent && !hasActive)) {
        return;
      }

      _this2.contentHeight = _this2.getHeight(content);

      _this2.open(button, content);
    });
  };

  _proto.reset = function reset() {
    var _this3 = this;

    this.buttons.forEach(function (button, i) {
      var isOpen = button.getAttribute(_this3.selectors.buttonAttribute) !== _this3.currentId;

      var hasActive = button.classList.contains(_this3.selectors.activeClass);

      if (!(hasActive && isOpen)) {
        return;
      }

      _this3.contentHeight = _this3.getHeight(_this3.contents[i]);

      if (_this3.settings.closeOthers) {
        _this3.close(button, _this3.contents[i]);
      }
    });
  };

  _proto.getHeight = function getHeight(elem) {
    if (elem !== null) {
      elem.style.height = 'auto';
      elem.style.display = 'block';
      return elem.offsetHeight !== 0 ? elem.offsetHeight : this.contentHeight;
    } else return;
  };

  _proto.open = function open(button, content) {
    this.onOpen(content);
    button.classList.add(this.selectors.activeClass);
    content.classList.add(this.selectors.activeClass);
  };

  _proto.close = function close(button, content) {
    if (Dom.crm) this.onClose(content);
    button.classList.remove(this.selectors.activeClass);
    content.classList.remove(this.selectors.activeClass);
  };

  _proto.onOpen = function onOpen(elem) {
    var _this4 = this;

    if (!this.settings.animations) {
      elem.style.height = this.contentHeight;
      return;
    }

    this.onCompleteAnim = false;
    this.gsap.set(elem, {
      height: 0
    });
    this.gsap.to(elem, 0.4, {
      height: this.contentHeight,
      ease: Power2.easeOut,
      onComplete: function onComplete() {
        _this4.onCompleteAnim = true;
      }
    });
  };

  _proto.onClose = function onClose(elem) {
    var _this5 = this;

    if (!this.settings.animations) {
      elem.style.height = 0;
      return;
    }

    this.onCompleteAnim = false;
    this.gsap.to(elem, 0.4, {
      height: 0,
      ease: Power2.easeOut,
      onComplete: function onComplete() {
        _this5.onCompleteAnim = true;
      }
    });
  };

  _proto.onResize = function onResize() {
    var content = this.node.querySelector("[" + this.selectors.contentAttribute + "=\"" + this.currentId + "\"]");

    if (!content) {
      return;
    }

    this.contentHeight = this.getHeight(content);
    content.style.height = this.contentHeight;
  };

  Accordion.init = function init(elem, selectors, settings) {
    Accordion.items = Array.from(document.querySelectorAll("[" + elem + "]")).map(function (node, index) {
      return new Accordion(node, selectors, settings, index);
    });
  };

  return Accordion;
}();/**
 * Check to see if an object is a plain object (created using "{}" or "new Object").
 * @param {*} obj Variable of any type
 * @returns {Boolean}
 */
const isPlainObject = (obj) => {
  return (
    // separate from primitives
    typeof obj === "object" &&
    // is obvious
    obj !== null &&
    // separate instances (Array, DOM, ...)
    obj.constructor === Object &&
    // separate build-in like Math
    Object.prototype.toString.call(obj) === "[object Object]"
  );
};/**
 * Merge the contents of two or more objects together into the first object.
 * If passing "true" for first argument, the merge becomes recursive (aka. deep copy).
 * @param  {...any} args
 * @returns {Object}
 */
const extend$2 = (...args) => {
  let deep = false;

  if (typeof args[0] == "boolean") {
    deep = args.shift();
  }

  let result = args[0];

  if (!result || typeof result !== "object") {
    throw new Error("extendee must be an object");
  }

  const extenders = args.slice(1);
  const len = extenders.length;

  for (let i = 0; i < len; i++) {
    const extender = extenders[i];

    for (let key in extender) {
      if (extender.hasOwnProperty(key)) {
        const value = extender[key];

        if (deep && (Array.isArray(value) || isPlainObject(value))) {
          const base = Array.isArray(value) ? [] : {};

          result[key] = extend$2(true, result.hasOwnProperty(key) ? result[key] : base, value);
        } else {
          result[key] = value;
        }
      }
    }
  }

  return result;
};/**
 * Detect if rendering from the client or the server
 */
const canUseDOM = !!(typeof window !== "undefined" && window.document && window.document.createElement);let preventScrollSupported = null;

const FOCUSABLE_ELEMENTS = [
  "a[href]",
  "area[href]",
  'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
  "select:not([disabled]):not([aria-hidden])",
  "textarea:not([disabled]):not([aria-hidden])",
  "button:not([disabled]):not([aria-hidden])",
  "iframe",
  "object",
  "embed",
  "video",
  "audio",
  "[contenteditable]",
  '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])',
];

const setFocusOn = (node) => {
  if (!node || !canUseDOM) {
    return;
  }

  if (preventScrollSupported === null) {
    document.createElement("div").focus({
      get preventScroll() {
        preventScrollSupported = true;

        return false;
      },
    });
  }

  try {
    if (node.setActive) {
      // IE/Edge
      node.setActive();
    } else if (preventScrollSupported) {
      // Modern browsers
      node.focus({ preventScroll: true });
    } else {
      // Safari does not support `preventScroll` option
      // https://bugs.webkit.org/show_bug.cgi?id=178583

      // Save position
      const scrollTop = window.pageXOffset || document.body.scrollTop;
      const scrollLeft = window.pageYOffset || document.body.scrollLeft;

      node.focus();

      document.body.scrollTo({
        top: scrollTop,
        left: scrollLeft,
        behavior: "auto",
      });
    }
  } catch (e) {}
};/**
 * Access nested JavaScript objects by string path.
 * Example: `resolve("a.b.c", {a:{b:{c:"d"}})` would return `d`
 * @param {String} path
 * @param {Object} obj
 * @returns {*}
 */
const resolve = function (path, obj) {
  return path.split(".").reduce(function (prev, curr) {
    return prev && prev[curr];
  }, obj);
};/**
 * Base class, all components inherit from this class
 */
class Base {
  /**
   * Base constructor
   * @param {Object} [options] - Options as `key: value` pairs
   */
  constructor(options = {}) {
    this.options = extend$2(true, {}, options);

    this.plugins = [];
    this.events = {};

    // * Prefill with initial events
    for (const type of ["on", "once"]) {
      for (const args of Object.entries(this.options[type] || {})) {
        this[type](...args);
      }
    }
  }

  /**
   * Retrieve option value by key, supports subkeys
   * @param {String} key Option name
   * @param {*} [fallback] Fallback value for non-existing key
   * @returns {*}
   */
  option(key, fallback, ...rest) {
    // Make sure it is string
    key = String(key);

    let value = resolve(key, this.options);

    // Allow to have functions as options
    if (typeof value === "function") {
      value = value.call(this, this, ...rest);
    }

    return value === undefined ? fallback : value;
  }

  /**
   * Simple l10n support - replaces object keys
   * found in template with corresponding values
   * @param {String} str String containing values to localize
   * @param {Array} params Substitute parameters
   * @returns {String}
   */
  localize(str, params = []) {
    str = String(str).replace(/\{\{(\w+).?(\w+)?\}\}/g, (match, key, subkey) => {
      let rez = "";

      // Plugins have `Plugin.l10n.KEY`
      if (subkey) {
        rez = this.option(`${key[0] + key.toLowerCase().substring(1)}.l10n.${subkey}`);
      } else if (key) {
        rez = this.option(`l10n.${key}`);
      }

      if (!rez) {
        rez = match;
      }

      for (let index = 0; index < params.length; index++) {
        rez = rez.split(params[index][0]).join(params[index][1]);
      }

      return rez;
    });

    str = str.replace(/\{\{(.*)\}\}/, (match, key) => {
      return key;
    });

    return str;
  }

  /**
   * Subscribe to an event
   * @param {String} name
   * @param {Function} callback
   * @returns {Object}
   */
  on(name, callback) {
    if (isPlainObject(name)) {
      for (const args of Object.entries(name)) {
        this.on(...args);
      }

      return this;
    }

    String(name)
      .split(" ")
      .forEach((item) => {
        const listeners = (this.events[item] = this.events[item] || []);

        if (listeners.indexOf(callback) == -1) {
          listeners.push(callback);
        }
      });

    return this;
  }

  /**
   * Subscribe to an event only once
   * @param {String} name
   * @param {Function} callback
   * @returns {Object}
   */
  once(name, callback) {
    if (isPlainObject(name)) {
      for (const args of Object.entries(name)) {
        this.once(...args);
      }

      return this;
    }

    String(name)
      .split(" ")
      .forEach((item) => {
        const listener = (...details) => {
          this.off(item, listener);
          callback.call(this, this, ...details);
        };

        listener._ = callback;

        this.on(item, listener);
      });

    return this;
  }

  /**
   * Unsubscribe event with name and callback
   * @param {String} name
   * @param {Function} callback
   * @returns {Object}
   */
  off(name, callback) {
    if (isPlainObject(name)) {
      for (const args of Object.entries(name)) {
        this.off(...args);
      }

      return;
    }

    name.split(" ").forEach((item) => {
      const listeners = this.events[item];

      if (!listeners || !listeners.length) {
        return this;
      }

      let index = -1;

      for (let i = 0, len = listeners.length; i < len; i++) {
        const listener = listeners[i];

        if (listener && (listener === callback || listener._ === callback)) {
          index = i;
          break;
        }
      }

      if (index != -1) {
        listeners.splice(index, 1);
      }
    });

    return this;
  }

  /**
   * Emit an event.
   * If present, `"*"` handlers are invoked after name-matched handlers.
   * @param {String} name
   * @param  {...any} details
   * @returns {Boolean}
   */
  trigger(name, ...details) {
    for (const listener of [...(this.events[name] || [])].slice()) {
      if (listener && listener.call(this, this, ...details) === false) {
        return false;
      }
    }

    // A wildcard "*" event type
    for (const listener of [...(this.events["*"] || [])].slice()) {
      if (listener && listener.call(this, name, this, ...details) === false) {
        return false;
      }
    }

    return true;
  }

  /**
   * Add given plugins to this instance,
   * this will end up calling `attach` method of each plugin
   * @param {Object} Plugins
   * @returns {Object}
   */
  attachPlugins(plugins) {
    const newPlugins = {};

    for (const [key, Plugin] of Object.entries(plugins || {})) {
      // Check if this plugin is not disabled by option
      if (this.options[key] !== false && !this.plugins[key]) {
        // Populate options with defaults from the plugin
        this.options[key] = extend$2({}, Plugin.defaults || {}, this.options[key]);

        // Initialise plugin
        newPlugins[key] = new Plugin(this);
      }
    }

    for (const [key, plugin] of Object.entries(newPlugins)) {
      plugin.attach(this);
    }

    this.plugins = Object.assign({}, this.plugins, newPlugins);

    return this;
  }

  /**
   * Remove all plugin instances from this instance,
   * this will end up calling `detach` method of each plugin
   * @returns {Object}
   */
  detachPlugins() {
    for (const key in this.plugins) {
      let plugin;

      if ((plugin = this.plugins[key]) && typeof plugin.detach === "function") {
        plugin.detach(this);
      }
    }

    this.plugins = {};

    return this;
  }
}/**
 * Round half up; to be more specific and to ensure things like 1.005 round correctly
 * @param {Float} value
 * @param {Integer} precision
 * @returns {Float}
 */
const round = (value, precision = 10000) => {
  value = parseFloat(value) || 0;

  return Math.round((value + Number.EPSILON) * precision) / precision;
};/**
 * Check if  element has scrollable content
 * @param {Node} node
 * @returns {Boolean}
 */
const hasScrollbars = function (node) {
  const overflowY = getComputedStyle(node)["overflow-y"],
    overflowX = getComputedStyle(node)["overflow-x"],
    vertical = (overflowY === "scroll" || overflowY === "auto") && Math.abs(node.scrollHeight - node.clientHeight) > 1,
    horizontal = (overflowX === "scroll" || overflowX === "auto") && Math.abs(node.scrollWidth - node.clientWidth) > 1;

  return vertical || horizontal;
};

/**
 * Check if element or one of the parents is scrollable
 * @param {Node} node  DOM Node element
 * @returns {Boolean}
 */
const isScrollable = function (node) {
  if (!node || !(typeof node === "object" && node instanceof Element) || node === document.body) {
    return false;
  }

  if (node.__Panzoom) {
    return false;
  }

  if (hasScrollbars(node)) {
    return node;
  }

  return isScrollable(node.parentNode);
};/**
 * ResizeObserver Polyfill
 */
const ResizeObserver$1 =
  (typeof window !== "undefined" && window.ResizeObserver) ||
  class {
    constructor(callback) {
      this.observables = [];
      // Array of observed elements that looks like this:
      // [{
      //   el: domNode,
      //   size: {height: x, width: y}
      // }]
      this.boundCheck = this.check.bind(this);
      this.boundCheck();
      this.callback = callback;
    }

    observe(el) {
      if (this.observables.some((observable) => observable.el === el)) {
        return;
      }

      const newObservable = {
        el: el,
        size: {
          height: el.clientHeight,
          width: el.clientWidth,
        },
      };

      this.observables.push(newObservable);
    }

    unobserve(el) {
      this.observables = this.observables.filter((obj) => obj.el !== el);
    }

    disconnect() {
      this.observables = [];
    }

    check() {
      const changedEntries = this.observables
        .filter((obj) => {
          const currentHeight = obj.el.clientHeight;
          const currentWidth = obj.el.clientWidth;
          if (obj.size.height !== currentHeight || obj.size.width !== currentWidth) {
            obj.size.height = currentHeight;
            obj.size.width = currentWidth;
            return true;
          }
        })
        .map((obj) => obj.el);

      if (changedEntries.length > 0) {
        this.callback(changedEntries);
      }

      window.requestAnimationFrame(this.boundCheck);
    }
  };class Pointer {
  constructor(nativePointer) {
    this.id = self.Touch && nativePointer instanceof Touch ? nativePointer.identifier : -1;

    this.pageX = nativePointer.pageX;
    this.pageY = nativePointer.pageY;

    this.clientX = nativePointer.clientX;
    this.clientY = nativePointer.clientY;
  }
}

const getDistance = (a, b) => {
  if (!b) {
    return 0;
  }

  return Math.sqrt((b.clientX - a.clientX) ** 2 + (b.clientY - a.clientY) ** 2);
};

const getMidpoint = (a, b) => {
  if (!b) {
    return a;
  }

  return {
    clientX: (a.clientX + b.clientX) / 2,
    clientY: (a.clientY + b.clientY) / 2,
  };
};

const isTouchEvent = (event) => "changedTouches" in event;

class PointerTracker {
  constructor(_element, { start = () => true, move = () => {}, end = () => {} } = {}) {
    this._element = _element;

    this.startPointers = [];
    this.currentPointers = [];

    this._pointerStart = (event) => {
      if (!(event.buttons & 1)) {
        return;
      }

      const pointer = new Pointer(event);

      if (this.currentPointers.some((p) => p.id === pointer.id)) {
        return;
      }

      if (!this._triggerPointerStart(pointer, event)) {
        return;
      }

      window.addEventListener("mousemove", this._move, { passive: false });
      window.addEventListener("mouseup", this._pointerEnd, { passive: false });
    };

    this._touchStart = (event) => {
      for (const touch of Array.from(event.changedTouches || [])) {
        this._triggerPointerStart(new Pointer(touch), event);
      }
    };

    this._move = (event) => {
      const previousPointers = this.currentPointers.slice();
      const changedPointers = isTouchEvent(event)
        ? Array.from(event.changedTouches).map((t) => new Pointer(t))
        : [new Pointer(event)];

      for (const pointer of changedPointers) {
        const index = this.currentPointers.findIndex((p) => p.id === pointer.id);

        if (index < 0) {
          continue;
        }

        this.currentPointers[index] = pointer;
      }

      this._moveCallback(previousPointers, this.currentPointers.slice(), event);
    };

    this._triggerPointerEnd = (pointer, event) => {
      if (!isTouchEvent(event) && event.buttons & 1) {
        return false;
      }

      const index = this.currentPointers.findIndex((p) => p.id === pointer.id);

      if (index < 0) {
        return false;
      }

      this.currentPointers.splice(index, 1);
      this.startPointers.splice(index, 1);

      this._endCallback(pointer, event);

      return true;
    };

    this._pointerEnd = (event) => {
      if (!this._triggerPointerEnd(new Pointer(event), event)) {
        return;
      }

      window.removeEventListener("mousemove", this._move);
      window.removeEventListener("mouseup", this._pointerEnd);
    };

    this._touchEnd = (event) => {
      for (const touch of Array.from(event.changedTouches || [])) {
        this._triggerPointerEnd(new Pointer(touch), event);
      }
    };

    this._startCallback = start;
    this._moveCallback = move;
    this._endCallback = end;

    this._element.addEventListener("mousedown", this._pointerStart, { passive: true });
    this._element.addEventListener("touchstart", this._touchStart, { passive: true });
    this._element.addEventListener("touchmove", this._move, { passive: false });
    this._element.addEventListener("touchend", this._touchEnd);
    this._element.addEventListener("touchcancel", this._touchEnd);
  }

  stop() {
    this._element.removeEventListener("mousedown", this._pointerStart, { passive: true });
    this._element.removeEventListener("touchstart", this._touchStart, { passive: true });
    this._element.removeEventListener("touchmove", this._move, { passive: false });
    this._element.removeEventListener("touchend", this._touchEnd);
    this._element.removeEventListener("touchcancel", this._touchEnd);

    window.removeEventListener("mousemove", this._move, { passive: false });
    window.removeEventListener("mouseup", this._pointerEnd, { passive: false });
  }

  _triggerPointerStart(pointer, event) {
    if (!this._startCallback(pointer, event)) {
      return false;
    }

    this.currentPointers.push(pointer);
    this.startPointers.push(pointer);

    return true;
  }
}/**
 * Get element child node at the given coordinates
 * @param {Element} HTML element
 * @param {Float|Integer} x
 * @param {Float|Integer} y
 * @returns {Node|Boolean}}
 */
const getTextNodeFromPoint = (element, x, y) => {
  const nodes = element.childNodes;
  const range = document.createRange();

  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];

    if (node.nodeType !== Node.TEXT_NODE) {
      continue;
    }

    range.selectNodeContents(node);

    const rect = range.getBoundingClientRect();

    if (x >= rect.left && y >= rect.top && x <= rect.right && y <= rect.bottom) {
      return node;
    }
  }

  return false;
};/**
 * Get actual width of the element, regardless of how much of content is currently visible
 * @param {Element} elem
 * @returns {Integer}
 */
const getFullWidth = (elem) => {
  return Math.max(
    parseFloat(elem.naturalWidth || 0),
    parseFloat((elem.width && elem.width.baseVal && elem.width.baseVal.value) || 0),
    parseFloat(elem.offsetWidth || 0),
    parseFloat(elem.scrollWidth || 0)
  );
};

/**
 * Get actual height of the element, regardless of how much of content is currently visible
 * @param {Element} elem
 * @returns {Integer}
 */
const getFullHeight = (elem) => {
  return Math.max(
    parseFloat(elem.naturalHeight || 0),
    parseFloat((elem.height && elem.height.baseVal && elem.height.baseVal.value) || 0),
    parseFloat(elem.offsetHeight || 0),
    parseFloat(elem.scrollHeight || 0)
  );
};

/**
 * Calculate bounding size to fit dimensions while preserving aspect ratio
 * @param {Number} srcWidth
 * @param {Number} srcHeight
 * @param {Number} maxWidth
 * @param {Number} maxHeight
 * @returns {Object}
 */
const calculateAspectRatioFit = (srcWidth, srcHeight, maxWidth, maxHeight) => {
  const ratio = Math.min(maxWidth / srcWidth || 0, maxHeight / srcHeight);

  return { width: srcWidth * ratio || 0, height: srcHeight * ratio || 0 };
};const Plugins = {};const defaults$1 = {
  // Enable touch guestures
  touch: true,

  // Enable zooming
  zoom: true,

  // Enable pinch gesture to zoom in/out using two fingers
  pinchToZoom: true,

  // Disable dragging if scale level is equal to value of `baseScale` option
  panOnlyZoomed: false,

  // Lock axis while dragging,
  // possible values: false | "x" | "y" | "xy"
  lockAxis: false,

  // * All friction values are inside [0, 1) interval,
  // * where 0 would change instantly, but 0.99 would update extremely slowly

  // Friction while panning/dragging
  friction: 0.64,

  // Friction while decelerating after drag end
  decelFriction: 0.88,

  // Friction while scaling
  zoomFriction: 0.74,

  // Bounciness after hitting the edge
  bounceForce: 0.2,

  // Initial scale level
  baseScale: 1,

  // Minimum scale level
  minScale: 1,

  // Maximum scale level
  maxScale: 2,

  // Default scale step while zooming
  step: 0.5,

  // Allow to select text,
  // if enabled, dragging will be disabled when text selection is detected
  textSelection: false,

  // Add `click` event listener,
  // possible values: true | false | function | "toggleZoom"
  click: "toggleZoom",

  // Add `wheel` event listener,
  // possible values: true | false | function |  "zoom"
  wheel: "zoom",

  // Value for zoom on mouse wheel
  wheelFactor: 42,

  // Number of wheel events after which it should stop preventing default behaviour of mouse wheel
  wheelLimit: 5,

  // Class name added to `$viewport` element to indicate if content is draggable
  draggableClass: "is-draggable",

  // Class name added to `$viewport` element to indicate that user is currently dragging
  draggingClass: "is-dragging",

  // Content will be scaled by this number,
  // this can also be a function which should return a number, for example:
  // ratio: function() { return 1 / (window.devicePixelRatio || 1) }
  ratio: 1,
};

class Panzoom extends Base {
  /**
   * Panzoom constructor
   * @constructs Panzoom
   * @param {HTMLElement} $viewport Panzoom container
   * @param {Object} [options] Options for Panzoom
   */
  constructor($container, options = {}) {
    super(extend$2(true, {}, defaults$1, options));

    this.state = "init";

    this.$container = $container;

    // Bind event handlers for referencability
    for (const methodName of ["onLoad", "onWheel", "onClick"]) {
      this[methodName] = this[methodName].bind(this);
    }

    this.initLayout();

    this.resetValues();

    this.attachPlugins(Panzoom.Plugins);

    this.trigger("init");

    this.updateMetrics();

    this.attachEvents();

    this.trigger("ready");

    if (this.option("centerOnStart") === false) {
      this.state = "ready";
    } else {
      this.panTo({
        friction: 0,
      });
    }

    $container.__Panzoom = this;
  }

  /**
   * Create references to container, viewport and content elements
   */
  initLayout() {
    const $container = this.$container;

    // Make sure content element exists
    if (!($container instanceof HTMLElement)) {
      throw new Error("Panzoom: Container not found");
    }

    const $content = this.option("content") || $container.querySelector(".panzoom__content");

    // Make sure content element exists
    if (!$content) {
      throw new Error("Panzoom: Content not found");
    }

    this.$content = $content;

    let $viewport = this.option("viewport") || $container.querySelector(".panzoom__viewport");

    if (!$viewport && this.option("wrapInner") !== false) {
      $viewport = document.createElement("div");
      $viewport.classList.add("panzoom__viewport");

      $viewport.append(...$container.childNodes);

      $container.appendChild($viewport);
    }

    this.$viewport = $viewport || $content.parentNode;
  }

  /**
   * Restore instance variables to default values
   */
  resetValues() {
    this.updateRate = this.option("updateRate", /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ? 250 : 24);

    this.container = {
      width: 0,
      height: 0,
    };

    this.viewport = {
      width: 0,
      height: 0,
    };

    this.content = {
      // Full content dimensions (naturalWidth/naturalHeight for images)
      origWidth: 0,
      origHeight: 0,

      // Current dimensions of the content
      width: 0,
      height: 0,

      // Current position; these values reflect CSS `transform` value
      x: this.option("x", 0),
      y: this.option("y", 0),

      // Current scale; does not reflect CSS `transform` value
      scale: this.option("baseScale"),
    };

    // End values of current pan / zoom animation
    this.transform = {
      x: 0,
      y: 0,
      scale: 1,
    };

    this.resetDragPosition();
  }

  /**
   * Handle `load` event
   * @param {Event} event
   */
  onLoad(event) {
    this.updateMetrics();

    this.panTo({ scale: this.option("baseScale"), friction: 0 });

    this.trigger("load", event);
  }

  /**
   * Handle `click` event
   * @param {Event} event
   */
  onClick(event) {
    if (event.defaultPrevented) {
      return;
    }

    // Skip if text is selected
    if (this.option("textSelection") && window.getSelection().toString().length) {
      event.stopPropagation();
      return;
    }

    const rect = this.$content.getClientRects()[0];

    // Check if container has changed position (for example, when current instance is inside another one)
    if (this.state !== "ready") {
      if (
        this.dragPosition.midPoint ||
        Math.abs(rect.top - this.dragStart.rect.top) > 1 ||
        Math.abs(rect.left - this.dragStart.rect.left) > 1
      ) {
        event.preventDefault();
        event.stopPropagation();

        return;
      }
    }

    if (this.trigger("click", event) === false) {
      return;
    }

    if (this.option("zoom") && this.option("click") === "toggleZoom") {
      event.preventDefault();
      event.stopPropagation();

      this.zoomWithClick(event);
    }
  }

  /**
   * Handle `wheel` event
   * @param {Event} event
   */
  onWheel(event) {
    if (this.trigger("wheel", event) === false) {
      return;
    }

    if (this.option("zoom") && this.option("wheel")) {
      this.zoomWithWheel(event);
    }
  }

  /**
   * Change zoom level depending on scroll direction
   * @param {Event} event `wheel` event
   */
  zoomWithWheel(event) {
    if (this.changedDelta === undefined) {
      this.changedDelta = 0;
    }

    const delta = Math.max(-1, Math.min(1, -event.deltaY || -event.deltaX || event.wheelDelta || -event.detail));
    const scale = this.content.scale;

    let newScale = (scale * (100 + delta * this.option("wheelFactor"))) / 100;

    if (
      (delta < 0 && Math.abs(scale - this.option("minScale")) < 0.01) ||
      (delta > 0 && Math.abs(scale - this.option("maxScale")) < 0.01)
    ) {
      this.changedDelta += Math.abs(delta);
      newScale = scale;
    } else {
      this.changedDelta = 0;
      newScale = Math.max(Math.min(newScale, this.option("maxScale")), this.option("minScale"));
    }

    if (this.changedDelta > this.option("wheelLimit")) {
      return;
    }

    event.preventDefault();

    if (newScale === scale) {
      return;
    }

    const rect = this.$content.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.zoomTo(newScale, { x, y });
  }

  /**
   * Change zoom level depending on click coordinates
   * @param {Event} event `click` event
   */
  zoomWithClick(event) {
    const rect = this.$content.getClientRects()[0];

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.toggleZoom({ x, y });
  }

  /**
   * Attach load, wheel and click event listeners, initialize `resizeObserver` and `PointerTracker`
   */
  attachEvents() {
    this.$content.addEventListener("load", this.onLoad);

    this.$container.addEventListener("wheel", this.onWheel, { passive: false });
    this.$container.addEventListener("click", this.onClick, { passive: false });

    this.initObserver();

    const pointerTracker = new PointerTracker(this.$container, {
      start: (pointer, event) => {
        if (!this.option("touch")) {
          return false;
        }

        if (this.velocity.scale < 0) {
          return false;
        }

        if (!pointerTracker.currentPointers.length) {
          const ignoreClickedElement =
            ["BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(event.target.nodeName) !== -1;

          if (ignoreClickedElement) {
            return false;
          }

          // Allow text selection
          if (this.option("textSelection") && getTextNodeFromPoint(event.target, event.clientX, event.clientY)) {
            return false;
          }
        }

        if (isScrollable(event.target)) {
          return false;
        }

        if (this.trigger("touchStart", event) === false) {
          return false;
        }

        this.state = "pointerdown";

        this.resetDragPosition();

        this.dragPosition.midPoint = null;
        this.dragPosition.time = Date.now();

        return true;
      },
      move: (previousPointers, currentPointers, event) => {
        if (this.state !== "pointerdown") {
          return;
        }

        if (this.trigger("touchMove", event) === false) {
          event.preventDefault();
          return;
        }

        // Disable touch action if current zoom level is below base level
        if (
          currentPointers.length < 2 &&
          this.option("panOnlyZoomed") === true &&
          this.content.width <= this.viewport.width &&
          this.content.height <= this.viewport.height &&
          this.transform.scale <= this.option("baseScale")
        ) {
          return;
        }

        if (currentPointers.length > 1 && (!this.option("zoom") || this.option("pinchToZoom") === false)) {
          return;
        }

        const prevMidpoint = getMidpoint(previousPointers[0], previousPointers[1]);
        const newMidpoint = getMidpoint(currentPointers[0], currentPointers[1]);

        const panX = newMidpoint.clientX - prevMidpoint.clientX;
        const panY = newMidpoint.clientY - prevMidpoint.clientY;

        const prevDistance = getDistance(previousPointers[0], previousPointers[1]);
        const newDistance = getDistance(currentPointers[0], currentPointers[1]);

        const scaleDiff = prevDistance && newDistance ? newDistance / prevDistance : 1;

        this.dragOffset.x += panX;
        this.dragOffset.y += panY;

        this.dragOffset.scale *= scaleDiff;

        this.dragOffset.time = Date.now() - this.dragPosition.time;

        const axisToLock = this.dragStart.scale === 1 && this.option("lockAxis");

        if (axisToLock && !this.lockAxis) {
          if (Math.abs(this.dragOffset.x) < 6 && Math.abs(this.dragOffset.y) < 6) {
            event.preventDefault();
            return;
          }

          const angle = Math.abs((Math.atan2(this.dragOffset.y, this.dragOffset.x) * 180) / Math.PI);

          this.lockAxis = angle > 45 && angle < 135 ? "y" : "x";
        }

        if (axisToLock !== "xy" && this.lockAxis === "y") {
          if (event.type === "mousemove") {
            event.preventDefault();
          }

          return;
        }

        event.preventDefault();
        event.stopPropagation();

        event.stopImmediatePropagation();

        if (this.lockAxis) {
          this.dragOffset[this.lockAxis === "x" ? "y" : "x"] = 0;
        }

        this.$container.classList.add(this.option("draggingClass"));

        if (!(this.transform.scale === this.option("baseScale") && this.lockAxis === "y")) {
          this.dragPosition.x = this.dragStart.x + this.dragOffset.x;
        }

        if (!(this.transform.scale === this.option("baseScale") && this.lockAxis === "x")) {
          this.dragPosition.y = this.dragStart.y + this.dragOffset.y;
        }

        this.dragPosition.scale = this.dragStart.scale * this.dragOffset.scale;

        if (currentPointers.length > 1) {
          const startPoint = getMidpoint(pointerTracker.startPointers[0], pointerTracker.startPointers[1]);

          const xPos = startPoint.clientX - this.dragStart.rect.x;
          const yPos = startPoint.clientY - this.dragStart.rect.y;

          const { deltaX, deltaY } = this.getZoomDelta(this.content.scale * this.dragOffset.scale, xPos, yPos);

          this.dragPosition.x -= deltaX;
          this.dragPosition.y -= deltaY;

          this.dragPosition.midPoint = newMidpoint;
        } else {
          this.setDragResistance();
        }

        // Update final position
        this.transform = {
          x: this.dragPosition.x,
          y: this.dragPosition.y,
          scale: this.dragPosition.scale,
        };

        this.startAnimation();
      },
      end: (pointer, event) => {
        if (this.state !== "pointerdown") {
          return;
        }

        this._dragOffset = { ...this.dragOffset };

        if (pointerTracker.currentPointers.length) {
          this.resetDragPosition();

          return;
        }

        this.state = "decel";
        this.friction = this.option("decelFriction");

        this.recalculateTransform();

        this.$container.classList.remove(this.option("draggingClass"));

        if (this.trigger("touchEnd", event) === false) {
          return;
        }

        if (this.state !== "decel") {
          return;
        }

        // * Check if scaled content past limits

        // Below minimum
        const minScale = this.option("minScale");

        if (this.transform.scale < minScale) {
          this.zoomTo(minScale, { friction: 0.64 });

          return;
        }

        // Exceed maximum
        const maxScale = this.option("maxScale");

        if (this.transform.scale - maxScale > 0.01) {
          const last = this.dragPosition.midPoint || pointer;
          const rect = this.$content.getClientRects()[0];

          this.zoomTo(maxScale, {
            friction: 0.64,
            x: last.clientX - rect.left,
            y: last.clientY - rect.top,
          });

          return;
        }
      },
    });

    this.pointerTracker = pointerTracker;
  }

  initObserver() {
    if (this.resizeObserver) {
      return;
    }

    this.resizeObserver = new ResizeObserver$1(() => {
      if (this.updateTimer) {
        return;
      }

      this.updateTimer = setTimeout(() => {
        const rect = this.$container.getBoundingClientRect();

        if (!(rect.width && rect.height)) {
          this.updateTimer = null;
          return;
        }

        // Check to see if there are any changes
        if (Math.abs(rect.width - this.container.width) > 1 || Math.abs(rect.height - this.container.height) > 1) {
          if (this.isAnimating()) {
            this.endAnimation(true);
          }

          this.updateMetrics();

          this.panTo({
            x: this.content.x,
            y: this.content.y,
            scale: this.option("baseScale"),
            friction: 0,
          });
        }

        this.updateTimer = null;
      }, this.updateRate);
    });

    this.resizeObserver.observe(this.$container);
  }

  /**
   * Restore drag related variables to default values
   */
  resetDragPosition() {
    this.lockAxis = null;
    this.friction = this.option("friction");

    this.velocity = {
      x: 0,
      y: 0,
      scale: 0,
    };

    const { x, y, scale } = this.content;

    this.dragStart = {
      rect: this.$content.getBoundingClientRect(),
      x,
      y,
      scale,
    };

    this.dragPosition = {
      ...this.dragPosition,
      x,
      y,
      scale,
    };

    this.dragOffset = {
      x: 0,
      y: 0,
      scale: 1,
      time: 0,
    };
  }

  /**
   * Trigger update events before/after resizing content and viewport
   * @param {Boolean} silently Should trigger `afterUpdate` event at the end
   */
  updateMetrics(silently) {
    if (silently !== true) {
      this.trigger("beforeUpdate");
    }

    const $container = this.$container;
    const $content = this.$content;
    const $viewport = this.$viewport;

    const contentIsImage = $content instanceof HTMLImageElement;
    const contentIsZoomable = this.option("zoom");
    const shouldResizeParent = this.option("resizeParent", contentIsZoomable);

    let width = this.option("width");
    let height = this.option("height");

    let origWidth = width || getFullWidth($content);
    let origHeight = height || getFullHeight($content);

    Object.assign($content.style, {
      width: width ? `${width}px` : "",
      height: height ? `${height}px` : "",
      maxWidth: "",
      maxHeight: "",
    });

    if (shouldResizeParent) {
      Object.assign($viewport.style, { width: "", height: "" });
    }

    const ratio = this.option("ratio");

    origWidth = round(origWidth * ratio);
    origHeight = round(origHeight * ratio);

    width = origWidth;
    height = origHeight;

    const contentRect = $content.getBoundingClientRect();
    const viewportRect = $viewport.getBoundingClientRect();

    const containerRect = $viewport == $container ? viewportRect : $container.getBoundingClientRect();

    let viewportWidth = Math.max($viewport.offsetWidth, round(viewportRect.width));
    let viewportHeight = Math.max($viewport.offsetHeight, round(viewportRect.height));

    let viewportStyles = window.getComputedStyle($viewport);
    viewportWidth -= parseFloat(viewportStyles.paddingLeft) + parseFloat(viewportStyles.paddingRight);
    viewportHeight -= parseFloat(viewportStyles.paddingTop) + parseFloat(viewportStyles.paddingBottom);

    this.viewport.width = viewportWidth;
    this.viewport.height = viewportHeight;

    if (contentIsZoomable) {
      if (Math.abs(origWidth - contentRect.width) > 0.1 || Math.abs(origHeight - contentRect.height) > 0.1) {
        const rez = calculateAspectRatioFit(
          origWidth,
          origHeight,
          Math.min(origWidth, contentRect.width),
          Math.min(origHeight, contentRect.height)
        );

        width = round(rez.width);
        height = round(rez.height);
      }

      Object.assign($content.style, {
        width: `${width}px`,
        height: `${height}px`,
        transform: "",
      });
    }

    if (shouldResizeParent) {
      Object.assign($viewport.style, { width: `${width}px`, height: `${height}px` });

      this.viewport = { ...this.viewport, width, height };
    }

    if (contentIsImage && contentIsZoomable && typeof this.options.maxScale !== "function") {
      const maxScale = this.option("maxScale");

      this.options.maxScale = function () {
        return this.content.origWidth > 0 && this.content.fitWidth > 0
          ? this.content.origWidth / this.content.fitWidth
          : maxScale;
      };
    }

    this.content = {
      ...this.content,
      origWidth,
      origHeight,
      fitWidth: width,
      fitHeight: height,
      width,
      height,
      scale: 1,
      isZoomable: contentIsZoomable,
    };

    this.container = { width: containerRect.width, height: containerRect.height };

    if (silently !== true) {
      this.trigger("afterUpdate");
    }
  }

  /**
   * Increase zoom level
   * @param {Number} [step] Zoom ratio; `0.5` would increase scale from 1 to 1.5
   */
  zoomIn(step) {
    this.zoomTo(this.content.scale + (step || this.option("step")));
  }

  /**
   * Decrease zoom level
   * @param {Number} [step] Zoom ratio; `0.5` would decrease scale from 1.5 to 1
   */
  zoomOut(step) {
    this.zoomTo(this.content.scale - (step || this.option("step")));
  }

  /**
   * Toggles zoom level between max and base levels
   * @param {Object} [options] Additional options
   */
  toggleZoom(props = {}) {
    const maxScale = this.option("maxScale");
    const baseScale = this.option("baseScale");

    const scale = this.content.scale > baseScale + (maxScale - baseScale) * 0.5 ? baseScale : maxScale;

    this.zoomTo(scale, props);
  }

  /**
   * Animate to given zoom level
   * @param {Number} scale New zoom level
   * @param {Object} [options] Additional options
   */
  zoomTo(scale = this.option("baseScale"), { x = null, y = null } = {}) {
    scale = Math.max(Math.min(scale, this.option("maxScale")), this.option("minScale"));

    // Adjust zoom position
    const currentScale = round(this.content.scale / (this.content.width / this.content.fitWidth), 10000000);

    if (x === null) {
      x = this.content.width * currentScale * 0.5;
    }

    if (y === null) {
      y = this.content.height * currentScale * 0.5;
    }

    const { deltaX, deltaY } = this.getZoomDelta(scale, x, y);

    x = this.content.x - deltaX;
    y = this.content.y - deltaY;

    this.panTo({ x, y, scale, friction: this.option("zoomFriction") });
  }

  /**
   * Calculate difference for top/left values if content would scale at given coordinates
   * @param {Number} scale
   * @param {Number} x
   * @param {Number} y
   * @returns {Object}
   */
  getZoomDelta(scale, x = 0, y = 0) {
    const currentWidth = this.content.fitWidth * this.content.scale;
    const currentHeight = this.content.fitHeight * this.content.scale;

    const percentXInCurrentBox = x > 0 && currentWidth ? x / currentWidth : 0;
    const percentYInCurrentBox = y > 0 && currentHeight ? y / currentHeight : 0;

    const nextWidth = this.content.fitWidth * scale;
    const nextHeight = this.content.fitHeight * scale;

    const deltaX = (nextWidth - currentWidth) * percentXInCurrentBox;
    const deltaY = (nextHeight - currentHeight) * percentYInCurrentBox;

    return { deltaX, deltaY };
  }

  /**
   * Animate to given positon and/or zoom level
   * @param {Object} [options] Additional options
   */
  panTo({
    x = this.content.x,
    y = this.content.y,
    scale,
    friction = this.option("friction"),
    ignoreBounds = false,
  } = {}) {
    scale = scale || this.content.scale || 1;

    if (!ignoreBounds) {
      const { boundX, boundY } = this.getBounds(scale);

      if (boundX) {
        x = Math.max(Math.min(x, boundX.to), boundX.from);
      }

      if (boundY) {
        y = Math.max(Math.min(y, boundY.to), boundY.from);
      }
    }

    this.friction = friction;

    this.transform = {
      ...this.transform,
      x,
      y,
      scale,
    };

    if (friction) {
      this.state = "panning";

      this.velocity = {
        x: (1 / this.friction - 1) * (x - this.content.x),
        y: (1 / this.friction - 1) * (y - this.content.y),
        scale: (1 / this.friction - 1) * (scale - this.content.scale),
      };

      this.startAnimation();
    } else {
      this.endAnimation();
    }
  }

  /**
   * Start animation loop
   */
  startAnimation() {
    if (!this.rAF) {
      this.trigger("startAnimation");
    } else {
      cancelAnimationFrame(this.rAF);
    }

    this.rAF = requestAnimationFrame(() => this.animate());
  }

  /**
   * Process animation frame
   */
  animate() {
    this.setEdgeForce();
    this.setDragForce();

    this.velocity.x *= this.friction;
    this.velocity.y *= this.friction;

    this.velocity.scale *= this.friction;

    this.content.x += this.velocity.x;
    this.content.y += this.velocity.y;

    this.content.scale += this.velocity.scale;

    if (this.isAnimating()) {
      this.setTransform();
    } else if (this.state !== "pointerdown") {
      this.endAnimation();

      return;
    }

    this.rAF = requestAnimationFrame(() => this.animate());
  }

  /**
   * Calculate boundaries
   */
  getBounds(scale) {
    let boundX = this.boundX;
    let boundY = this.boundY;

    if (boundX !== undefined && boundY !== undefined) {
      return { boundX, boundY };
    }

    boundX = { from: 0, to: 0 };
    boundY = { from: 0, to: 0 };

    scale = scale || this.transform.scale;

    const width = this.content.fitWidth * scale;
    const height = this.content.fitHeight * scale;

    const viewportWidth = this.viewport.width;
    const viewportHeight = this.viewport.height;

    if (width < viewportWidth) {
      const deltaX = round((viewportWidth - width) * 0.5);

      boundX.from = deltaX;
      boundX.to = deltaX;
    } else {
      boundX.from = round(viewportWidth - width);
    }

    if (height < viewportHeight) {
      const deltaY = (viewportHeight - height) * 0.5;

      boundY.from = deltaY;
      boundY.to = deltaY;
    } else {
      boundY.from = round(viewportHeight - height);
    }

    return { boundX, boundY };
  }

  /**
   * Change animation velocity if boundary is reached
   */
  setEdgeForce() {
    if (this.state !== "decel") {
      return;
    }

    const bounceForce = this.option("bounceForce");

    const { boundX, boundY } = this.getBounds(Math.max(this.transform.scale, this.content.scale));

    let pastLeft, pastRight, pastTop, pastBottom;

    if (boundX) {
      pastLeft = this.content.x < boundX.from;
      pastRight = this.content.x > boundX.to;
    }

    if (boundY) {
      pastTop = this.content.y < boundY.from;
      pastBottom = this.content.y > boundY.to;
    }

    if (pastLeft || pastRight) {
      const bound = pastLeft ? boundX.from : boundX.to;
      const distance = bound - this.content.x;

      let force = distance * bounceForce;

      const restX = this.content.x + (this.velocity.x + force) / this.friction;

      if (restX >= boundX.from && restX <= boundX.to) {
        force += this.velocity.x;
      }

      this.velocity.x = force;

      this.recalculateTransform();
    }

    if (pastTop || pastBottom) {
      const bound = pastTop ? boundY.from : boundY.to;
      const distance = bound - this.content.y;

      let force = distance * bounceForce;

      const restY = this.content.y + (force + this.velocity.y) / this.friction;

      if (restY >= boundY.from && restY <= boundY.to) {
        force += this.velocity.y;
      }

      this.velocity.y = force;

      this.recalculateTransform();
    }
  }

  /**
   * Change dragging position if boundary is reached
   */
  setDragResistance() {
    if (this.state !== "pointerdown") {
      return;
    }

    const { boundX, boundY } = this.getBounds(this.dragPosition.scale);

    let pastLeft, pastRight, pastTop, pastBottom;

    if (boundX) {
      pastLeft = this.dragPosition.x < boundX.from;
      pastRight = this.dragPosition.x > boundX.to;
    }

    if (boundY) {
      pastTop = this.dragPosition.y < boundY.from;
      pastBottom = this.dragPosition.y > boundY.to;
    }

    if ((pastLeft || pastRight) && !(pastLeft && pastRight)) {
      const bound = pastLeft ? boundX.from : boundX.to;
      const distance = bound - this.dragPosition.x;

      this.dragPosition.x = bound - distance * 0.3;
    }

    if ((pastTop || pastBottom) && !(pastTop && pastBottom)) {
      const bound = pastTop ? boundY.from : boundY.to;
      const distance = bound - this.dragPosition.y;

      this.dragPosition.y = bound - distance * 0.3;
    }
  }

  /**
   * Set velocity to move content to drag position
   */
  setDragForce() {
    if (this.state === "pointerdown") {
      this.velocity.x = this.dragPosition.x - this.content.x;
      this.velocity.y = this.dragPosition.y - this.content.y;
      this.velocity.scale = this.dragPosition.scale - this.content.scale;
    }
  }

  /**
   * Update end values based on current velocity and friction;
   */
  recalculateTransform() {
    this.transform.x = this.content.x + this.velocity.x / (1 / this.friction - 1);
    this.transform.y = this.content.y + this.velocity.y / (1 / this.friction - 1);
    this.transform.scale = this.content.scale + this.velocity.scale / (1 / this.friction - 1);
  }

  /**
   * Check if content is currently animating
   * @returns {Boolean}
   */
  isAnimating() {
    return !!(
      this.friction &&
      (Math.abs(this.velocity.x) > 0.05 || Math.abs(this.velocity.y) > 0.05 || Math.abs(this.velocity.scale) > 0.05)
    );
  }

  /**
   * Set content `style.transform` value based on current animation frame
   */
  setTransform(final) {
    let x, y, scale;

    if (final) {
      x = round(this.transform.x);
      y = round(this.transform.y);

      scale = this.transform.scale;

      this.content = { ...this.content, x, y, scale };
    } else {
      x = round(this.content.x);
      y = round(this.content.y);

      scale = this.content.scale / (this.content.width / this.content.fitWidth);

      this.content = { ...this.content, x, y };
    }

    this.trigger("beforeTransform");

    x = round(this.content.x);
    y = round(this.content.y);

    if (final && this.option("zoom")) {
      let width;
      let height;

      width = round(this.content.fitWidth * scale);
      height = round(this.content.fitHeight * scale);

      this.content.width = width;
      this.content.height = height;

      this.transform = { ...this.transform, width, height, scale };

      Object.assign(this.$content.style, {
        width: `${width}px`,
        height: `${height}px`,
        maxWidth: "none",
        maxHeight: "none",
        transform: `translate3d(${x}px, ${y}px, 0) scale(1)`,
      });
    } else {
      this.$content.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
    }

    this.trigger("afterTransform");
  }

  /**
   * Stop animation loop
   */
  endAnimation(silently) {
    cancelAnimationFrame(this.rAF);
    this.rAF = null;

    this.velocity = {
      x: 0,
      y: 0,
      scale: 0,
    };

    this.setTransform(true);

    this.state = "ready";

    this.handleCursor();

    if (silently !== true) {
      this.trigger("endAnimation");
    }
  }

  /**
   * Update the class name depending on whether the content is scaled
   */
  handleCursor() {
    const draggableClass = this.option("draggableClass");

    if (!draggableClass || !this.option("touch")) {
      return;
    }

    if (
      this.option("panOnlyZoomed") == true &&
      this.content.width <= this.viewport.width &&
      this.content.height <= this.viewport.height &&
      this.transform.scale <= this.option("baseScale")
    ) {
      this.$container.classList.remove(draggableClass);
    } else {
      this.$container.classList.add(draggableClass);
    }
  }

  /**
   * Remove observation and detach event listeners
   */
  detachEvents() {
    this.$content.removeEventListener("load", this.onLoad);

    this.$container.removeEventListener("wheel", this.onWheel, { passive: false });
    this.$container.removeEventListener("click", this.onClick, { passive: false });

    if (this.pointerTracker) {
      this.pointerTracker.stop();
      this.pointerTracker = null;
    }

    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  /**
   * Clean up
   */
  destroy() {
    if (this.state === "destroy") {
      return;
    }

    this.state = "destroy";

    clearTimeout(this.updateTimer);
    this.updateTimer = null;

    cancelAnimationFrame(this.rAF);
    this.rAF = null;

    this.detachEvents();

    this.detachPlugins();

    this.resetDragPosition();
  }
}

// Expose version
Panzoom.version = "__VERSION__";

// Static properties are a recent addition that dont work in all browsers yet
Panzoom.Plugins = Plugins;/**
 * Throttling enforces a maximum number of times a function can be called over time
 * @param {Function} func Callback function
 * @param {Integer} limit Milliseconds
 * @returns {Function}
 */
const throttle = (func, limit) => {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall < limit) {
      return;
    }

    lastCall = now;

    return func(...args);
  };
};const defaults$2 = {
  prevTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>',
  nextTpl: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',

  classNames: {
    main: "carousel__nav",
    button: "carousel__button",

    next: "is-next",
    prev: "is-prev",
  },
};

class Navigation$1 {
  constructor(carousel) {
    this.$container = null;

    this.$prev = null;
    this.$next = null;

    this.carousel = carousel;

    this.onRefresh = this.onRefresh.bind(this);
  }

  /**
   * Shortcut to get option for this plugin
   * @param {String} name option name
   * @returns option value
   */
  option(name) {
    return this.carousel.option(`Navigation.${name}`);
  }

  /**
   * Creates and returns new button element with default class names and click event
   * @param {String} type
   */
  createButton(type) {
    const $btn = document.createElement("button");

    $btn.setAttribute("title", this.carousel.localize(`{{${type.toUpperCase()}}}`));

    const classNames = this.option("classNames.button") + " " + this.option(`classNames.${type}`);

    $btn.classList.add(...classNames.split(" "));
    $btn.setAttribute("tabindex", "0");
    $btn.innerHTML = this.carousel.localize(this.option(`${type}Tpl`));

    $btn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();

      this.carousel[`slide${type === "next" ? "Next" : "Prev"}`]();
    });

    return $btn;
  }

  /**
   * Build necessary DOM elements
   */
  build() {
    if (!this.$container) {
      this.$container = document.createElement("div");
      this.$container.classList.add(...this.option("classNames.main").split(" "));

      this.carousel.$container.appendChild(this.$container);
    }

    if (!this.$next) {
      this.$next = this.createButton("next");

      this.$container.appendChild(this.$next);
    }

    if (!this.$prev) {
      this.$prev = this.createButton("prev");

      this.$container.appendChild(this.$prev);
    }
  }

  /**
   *  Process carousel `refresh` and `change` events to enable/disable buttons if needed
   */
  onRefresh() {
    const pageCount = this.carousel.pages.length;

    if (
      pageCount <= 1 ||
      (pageCount > 1 &&
        this.carousel.elemDimWidth < this.carousel.wrapDimWidth &&
        !Number.isInteger(this.carousel.option("slidesPerPage")))
    ) {
      this.cleanup();

      return;
    }

    this.build();

    this.$prev.removeAttribute("disabled");
    this.$next.removeAttribute("disabled");

    if (this.carousel.option("infiniteX", this.carousel.option("infinite"))) {
      return;
    }

    if (this.carousel.page <= 0) {
      this.$prev.setAttribute("disabled", "");
    }

    if (this.carousel.page >= pageCount - 1) {
      this.$next.setAttribute("disabled", "");
    }
  }

  cleanup() {
    if (this.$prev) {
      this.$prev.remove();
    }

    this.$prev = null;

    if (this.$next) {
      this.$next.remove();
    }

    this.$next = null;

    if (this.$container) {
      this.$container.remove();
    }

    this.$container = null;
  }

  attach() {
    this.carousel.on("refresh change", this.onRefresh);
  }

  detach() {
    this.carousel.off("refresh change", this.onRefresh);

    this.cleanup();
  }
}

// Expose defaults
Navigation$1.defaults = defaults$2;class Dots {
  constructor(carousel) {
    this.carousel = carousel;

    this.$list = null;

    this.events = {
      change: this.onChange.bind(this),
      refresh: this.onRefresh.bind(this),
    };
  }

  /**
   * Build wrapping DOM element containing all dots
   */
  buildList() {
    if (this.carousel.pages.length < this.carousel.option("Dots.minSlideCount")) {
      return;
    }

    const $list = document.createElement("ol");

    $list.classList.add("carousel__dots");

    $list.addEventListener("click", (e) => {
      if (!("page" in e.target.dataset)) {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      const page = parseInt(e.target.dataset.page, 10);
      const carousel = this.carousel;

      if (page === carousel.page) {
        return;
      }

      if (carousel.pages.length < 3 && carousel.option("infinite")) {
        carousel[page == 0 ? "slidePrev" : "slideNext"]();
      } else {
        carousel.slideTo(page);
      }
    });

    this.$list = $list;

    this.carousel.$container.appendChild($list);
    this.carousel.$container.classList.add("has-dots");

    return $list;
  }

  /**
   * Remove wrapping DOM element
   */
  removeList() {
    if (this.$list) {
      this.$list.parentNode.removeChild(this.$list);
      this.$list = null;
    }

    this.carousel.$container.classList.remove("has-dots");
  }

  /**
   * Remove existing dots and create fresh ones
   */
  rebuildDots() {
    let $list = this.$list;

    const listExists = !!$list;
    const pagesCount = this.carousel.pages.length;

    if (pagesCount < 2) {
      if (listExists) {
        this.removeList();
      }

      return;
    }

    if (!listExists) {
      $list = this.buildList();
    }

    // Remove existing dots
    const dotCount = this.$list.children.length;

    if (dotCount > pagesCount) {
      for (let i = pagesCount; i < dotCount; i++) {
        this.$list.removeChild(this.$list.lastChild);
      }

      return;
    }

    // Create fresh DOM elements (dots) for each page
    for (let index = dotCount; index < pagesCount; index++) {
      const $dot = document.createElement("li");

      $dot.classList.add("carousel__dot");
      $dot.dataset.page = index;

      $dot.setAttribute("role", "button");
      $dot.setAttribute("tabindex", "0");
      $dot.setAttribute("title", this.carousel.localize("{{GOTO}}", [["%d", index + 1]]));

      $dot.addEventListener("keydown", (event) => {
        const code = event.code;

        let $el;

        if (code === "Enter" || code === "NumpadEnter") {
          $el = $dot;
        } else if (code === "ArrowRight") {
          $el = $dot.nextSibling;
        } else if (code === "ArrowLeft") {
          $el = $dot.previousSibling;
        }

        $el && $el.click();
      });

      this.$list.appendChild($dot);
    }

    this.setActiveDot();
  }

  /**
   * Mark active dot by toggling class name
   */
  setActiveDot() {
    if (!this.$list) {
      return;
    }

    this.$list.childNodes.forEach(($dot) => {
      $dot.classList.remove("is-selected");
    });

    const $activeDot = this.$list.childNodes[this.carousel.page];

    if ($activeDot) {
      $activeDot.classList.add("is-selected");
    }
  }

  /**
   * Process carousel `change` event
   */
  onChange() {
    this.setActiveDot();
  }

  /**
   * Process carousel `refresh` event
   */
  onRefresh() {
    this.rebuildDots();
  }

  attach() {
    this.carousel.on(this.events);
  }

  detach() {
    this.removeList();

    this.carousel.off(this.events);
    this.carousel = null;
  }
}const defaults$3 = {
  friction: 0.92,
};

class Sync {
  constructor(carousel) {
    this.carousel = carousel;

    this.selectedIndex = null;
    this.friction = 0;

    this.onNavReady = this.onNavReady.bind(this);
    this.onNavClick = this.onNavClick.bind(this);
    this.onNavCreateSlide = this.onNavCreateSlide.bind(this);

    this.onTargetChange = this.onTargetChange.bind(this);
  }

  /**
   * Make this one as main carousel and selected carousel as navigation
   * @param {Object} nav Carousel
   */
  addAsTargetFor(nav) {
    this.target = this.carousel;
    this.nav = nav;

    this.attachEvents();
  }

  /**
   * Make this one as navigation carousel for selected carousel
   * @param {Object} target
   */
  addAsNavFor(target) {
    this.target = target;
    this.nav = this.carousel;

    this.attachEvents();
  }

  /**
   * Attach event listeners on both carousels
   */
  attachEvents() {
    this.nav.options.initialSlide = this.target.options.initialPage;

    this.nav.on("ready", this.onNavReady);
    this.nav.on("createSlide", this.onNavCreateSlide);
    this.nav.on("Panzoom.click", this.onNavClick);

    this.target.on("change", this.onTargetChange);
    this.target.on("Panzoom.afterUpdate", this.onTargetChange);
  }

  /**
   * Process main carousel `ready` event; bind events and set initial page
   */
  onNavReady() {
    this.onTargetChange(true);
  }

  /**
   * Process main carousel `click` event
   * @param {Object} panzoom
   * @param {Object} event
   */
  onNavClick(carousel, panzoom, event) {
    const clickedNavSlide = event.target.closest(".carousel__slide");

    if (!clickedNavSlide) {
      return;
    }

    event.stopPropagation();

    const selectedNavIndex = parseInt(clickedNavSlide.dataset.index, 10);
    const selectedSyncPage = this.target.findPageForSlide(selectedNavIndex);

    if (this.target.page !== selectedSyncPage) {
      this.target.slideTo(selectedSyncPage, { friction: this.friction });
    }

    this.markSelectedSlide(selectedNavIndex);
  }

  /**
   * Process main carousel `createSlide` event
   * @param {Object} carousel
   * @param {Object} slide
   */
  onNavCreateSlide(carousel, slide) {
    if (slide.index === this.selectedIndex) {
      this.markSelectedSlide(slide.index);
    }
  }

  /**
   * Process target carousel `change` event
   * @param {Object} target
   */
  onTargetChange() {
    const targetIndex = this.target.pages[this.target.page].indexes[0];
    const selectedNavPage = this.nav.findPageForSlide(targetIndex);

    this.nav.slideTo(selectedNavPage);

    this.markSelectedSlide(targetIndex);
  }

  /**
   * Toggle classname for slides that marks currently selected slides
   * @param {Number} selectedIndex
   */
  markSelectedSlide(selectedIndex) {
    this.selectedIndex = selectedIndex;

    [...this.nav.slides].filter((slide) => slide.$el && slide.$el.classList.remove("is-nav-selected"));

    const slide = this.nav.slides[selectedIndex];

    if (slide && slide.$el) slide.$el.classList.add("is-nav-selected");
  }

  attach(carousel) {
    const sync = carousel.options.Sync;

    if (!sync.target && !sync.nav) {
      return;
    }

    if (sync.target) {
      this.addAsNavFor(sync.target);
    } else if (sync.nav) {
      this.addAsTargetFor(sync.nav);
    }

    this.friction = sync.friction;
  }

  detach() {
    if (this.nav) {
      this.nav.off("ready", this.onNavReady);
      this.nav.off("Panzoom.click", this.onNavClick);
      this.nav.off("createSlide", this.onNavCreateSlide);
    }

    if (this.target) {
      this.target.off("Panzoom.afterUpdate", this.onTargetChange);
      this.target.off("change", this.onTargetChange);
    }
  }
}

// Expose defaults
Sync.defaults = defaults$3;const Plugins$1 = { Navigation: Navigation$1, Dots, Sync };var en = {
  NEXT: "Next slide",
  PREV: "Previous slide",
  GOTO: "Go to slide #%d",
};const defaults$4 = {
  // Virtual slides. Each object should have at least `html` property that will be used to set content,
  // example: `slides: [{html: 'First slide'}, {html: 'Second slide'}]`
  slides: [],

  // Number of slides to preload before/after visible slides
  preload: 0,

  // Number of slides to group into the page,
  // if `auto` - group all slides that fit into the viewport
  slidesPerPage: "auto",

  // Index of initial page
  initialPage: null,

  // Index of initial slide
  initialSlide: null,

  // Panzoom friction while changing page
  friction: 0.92,

  // Should center active page
  center: true,

  // Should carousel scroll infinitely
  infinite: true,

  // Should the gap be filled before first and after last slide if `infinite: false`
  fill: true,

  // Should Carousel settle at any position after a swipe.
  dragFree: false,

  // Prefix for CSS classes, must be the same as the  SCSS `$carousel-prefix` variable
  prefix: "",

  // Class names for DOM elements (without prefix)
  classNames: {
    viewport: "carousel__viewport",
    track: "carousel__track",
    slide: "carousel__slide",

    // Classname toggled for slides inside current page
    slideSelected: "is-selected",
  },

  // Localization of strings
  l10n: en,
};

class Carousel extends Base {
  /**
   * Carousel constructor
   * @constructs Carousel
   * @param {HTMLElement} $container - Carousel container
   * @param {Object} [options] - Options for Carousel
   */
  constructor($container, options = {}) {
    options = extend$2(true, {}, defaults$4, options);

    super(options);

    this.state = "init";

    this.$container = $container;

    if (!(this.$container instanceof HTMLElement)) {
      throw new Error("No root element provided");
    }

    this.slideNext = throttle(this.slideNext.bind(this), 250);
    this.slidePrev = throttle(this.slidePrev.bind(this), 250);

    this.init();

    $container.__Carousel = this;
  }

  /**
   * Perform initialization
   */
  init() {
    this.pages = [];
    this.page = this.pageIndex = null;
    this.prevPage = this.prevPageIndex = null;

    this.attachPlugins(Carousel.Plugins);

    this.trigger("init");

    this.initLayout();

    this.initSlides();

    this.updateMetrics();

    if (this.$track && this.pages.length) {
      this.$track.style.transform = `translate3d(${this.pages[this.page].left * -1}px, 0px, 0) scale(1)`;
    }

    this.manageSlideVisiblity();

    this.initPanzoom();

    this.state = "ready";

    this.trigger("ready");
  }

  /**
   * Initialize layout; create necessary elements
   */
  initLayout() {
    const prefix = this.option("prefix");
    const classNames = this.option("classNames");

    this.$viewport = this.option("viewport") || this.$container.querySelector(`.${prefix}${classNames.viewport}`);

    if (!this.$viewport) {
      this.$viewport = document.createElement("div");
      this.$viewport.classList.add(...(prefix + classNames.viewport).split(" "));

      this.$viewport.append(...this.$container.childNodes);

      this.$container.appendChild(this.$viewport);
    }

    this.$track = this.option("track") || this.$container.querySelector(`.${prefix}${classNames.track}`);

    if (!this.$track) {
      this.$track = document.createElement("div");
      this.$track.classList.add(...(prefix + classNames.track).split(" "));

      this.$track.append(...this.$viewport.childNodes);

      this.$viewport.appendChild(this.$track);
    }
  }

  /**
   * Fill `slides` array with objects from existing nodes and/or `slides` option
   */
  initSlides() {
    this.slides = [];

    // Get existing slides from the DOM
    const elems = this.$viewport.querySelectorAll(`.${this.option("prefix")}${this.option("classNames.slide")}`);

    elems.forEach((el) => {
      const slide = {
        $el: el,
        isDom: true,
      };

      this.slides.push(slide);

      this.trigger("createSlide", slide, this.slides.length);
    });

    // Add virtual slides, but do not create DOM elements yet,
    // because they will be created dynamically based on current carousel position
    if (Array.isArray(this.options.slides)) {
      this.slides = extend$2(true, [...this.slides], this.options.slides);
    }
  }

  /**
   * Do all calculations related to slide size and paging
   */
  updateMetrics() {
    // Calculate content width, viewport width
    // ===
    let contentWidth = 0;
    let indexes = [];
    let lastSlideWidth;

    this.slides.forEach((slide, index) => {
      const $el = slide.$el;
      const slideWidth = slide.isDom || !lastSlideWidth ? this.getSlideMetrics($el) : lastSlideWidth;

      slide.index = index;
      slide.width = slideWidth;
      slide.left = contentWidth;

      lastSlideWidth = slideWidth;
      contentWidth += slideWidth;

      indexes.push(index);
    });

    let viewportWidth = Math.max(this.$track.offsetWidth, round(this.$track.getBoundingClientRect().width));

    let viewportStyles = getComputedStyle(this.$track);
    viewportWidth = viewportWidth - (parseFloat(viewportStyles.paddingLeft) + parseFloat(viewportStyles.paddingRight));

    this.contentWidth = contentWidth;
    this.viewportWidth = viewportWidth;

    // Split slides into pages
    // ===
    const pages = [];
    const slidesPerPage = this.option("slidesPerPage");

    if (Number.isInteger(slidesPerPage) && contentWidth > viewportWidth) {
      // Fixed number of slides in the page
      for (let i = 0; i < this.slides.length; i += slidesPerPage) {
        pages.push({
          indexes: indexes.slice(i, i + slidesPerPage),
          slides: this.slides.slice(i, i + slidesPerPage),
        });
      }
    } else {
      // Slides that fit inside viewport
      let currentPage = 0;
      let currentWidth = 0;

      for (let i = 0; i < this.slides.length; i += 1) {
        let slide = this.slides[i];

        // Add next page
        if (!pages.length || currentWidth + slide.width > viewportWidth) {
          pages.push({
            indexes: [],
            slides: [],
          });

          currentPage = pages.length - 1;
          currentWidth = 0;
        }

        currentWidth += slide.width;

        pages[currentPage].indexes.push(i);
        pages[currentPage].slides.push(slide);
      }
    }

    const shouldCenter = this.option("center");
    const shouldFill = this.option("fill");

    // Calculate width and start position for each page
    // ===
    pages.forEach((page, index) => {
      page.index = index;
      page.width = page.slides.reduce((sum, slide) => sum + slide.width, 0);

      page.left = page.slides[0].left;

      if (shouldCenter) {
        page.left += (viewportWidth - page.width) * 0.5 * -1;
      }

      if (shouldFill && !this.option("infiniteX", this.option("infinite")) && contentWidth > viewportWidth) {
        page.left = Math.max(page.left, 0);
        page.left = Math.min(page.left, contentWidth - viewportWidth);
      }
    });

    // Merge pages
    // ===
    const rez = [];
    let prevPage;

    pages.forEach((page2) => {
      const page = { ...page2 };

      if (prevPage && page.left === prevPage.left) {
        prevPage.width += page.width;

        prevPage.slides = [...prevPage.slides, ...page.slides];
        prevPage.indexes = [...prevPage.indexes, ...page.indexes];
      } else {
        page.index = rez.length;

        prevPage = page;

        rez.push(page);
      }
    });

    this.pages = rez;

    let page = this.page;

    if (page === null) {
      const initialSlide = this.option("initialSlide");

      if (initialSlide !== null) {
        page = this.findPageForSlide(initialSlide);
      } else {
        page = parseInt(this.option("initialPage", 0), 10) || 0;
      }

      if (!rez[page]) {
        page = rez.length && page > rez.length ? rez[rez.length - 1].index : 0;
      }

      this.page = page;
      this.pageIndex = page;
    }

    this.updatePanzoom();

    this.trigger("refresh");
  }

  /**
   * Calculate slide element width (including left, right margins)
   * @param {Object} node
   * @returns {Number} Width in px
   */
  getSlideMetrics(node) {
    if (!node) {
      const firstSlide = this.slides[0];

      node = document.createElement("div");

      node.dataset.isTestEl = 1;
      node.style.visibility = "hidden";
      node.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" "));

      // Assume all slides have the same custom class, if any
      if (firstSlide.customClass) {
        node.classList.add(...firstSlide.customClass.split(" "));
      }

      this.$track.prepend(node);
    }

    let width = Math.max(node.offsetWidth, round(node.getBoundingClientRect().width));

    // Add left/right margin
    const style = node.currentStyle || window.getComputedStyle(node);
    width = width + (parseFloat(style.marginLeft) || 0) + (parseFloat(style.marginRight) || 0);

    if (node.dataset.isTestEl) {
      node.remove();
    }

    return width;
  }

  /**
   *
   * @param {Integer} index Index of the slide
   * @returns {Integer|null} Index of the page if found, or null
   */
  findPageForSlide(index) {
    index = parseInt(index, 10) || 0;

    const page = this.pages.find((page) => {
      return page.indexes.indexOf(index) > -1;
    });

    return page ? page.index : null;
  }

  /**
   * Slide to next page, if possible
   */
  slideNext() {
    this.slideTo(this.pageIndex + 1);
  }

  /**
   * Slide to previous page, if possible
   */
  slidePrev() {
    this.slideTo(this.pageIndex - 1);
  }

  /**
   * Slides carousel to given page
   * @param {Number} page - New index of active page
   * @param {Object} [params] - Additional options
   */
  slideTo(page, params = {}) {
    const { x = this.setPage(page, true) * -1, y = 0, friction = this.option("friction") } = params;

    if (this.Panzoom.content.x === x && !this.Panzoom.velocity.x && friction) {
      return;
    }

    this.Panzoom.panTo({
      x,
      y,
      friction,
      ignoreBounds: true,
    });

    if (this.state === "ready" && this.Panzoom.state === "ready") {
      this.trigger("settle");
    }
  }

  /**
   * Initialise main Panzoom instance
   */
  initPanzoom() {
    if (this.Panzoom) {
      this.Panzoom.destroy();
    }

    // Create fresh object containing options for Pazoom instance
    const options = extend$2(
      true,
      {},
      {
        // Track element will be set as Panzoom $content
        content: this.$track,
        wrapInner: false,
        resizeParent: false,

        // Disable any user interaction
        zoom: false,
        click: false,

        // Right now, only horizontal navigation is supported
        lockAxis: "x",

        x: this.pages.length ? this.pages[this.page].left * -1 : 0,
        centerOnStart: false,

        // Make `textSelection` option more easy to customize
        textSelection: () => this.option("textSelection", false),

        // Disable dragging if content (e.g. all slides) fits inside viewport
        panOnlyZoomed: function () {
          return this.content.width <= this.viewport.width;
        },
      },
      this.option("Panzoom")
    );

    // Create new Panzoom instance
    this.Panzoom = new Panzoom(this.$container, options);

    this.Panzoom.on({
      // Bubble events
      "*": (name, ...details) => this.trigger(`Panzoom.${name}`, ...details),
      // The rest of events to be processed
      afterUpdate: () => {
        this.updatePage();
      },
      beforeTransform: this.onBeforeTransform.bind(this),
      touchEnd: this.onTouchEnd.bind(this),
      endAnimation: () => {
        this.trigger("settle");
      },
    });

    // The contents of the slides may cause the page scroll bar to appear, so the carousel width may change
    // and slides have to be repositioned
    this.updateMetrics();
    this.manageSlideVisiblity();
  }

  updatePanzoom() {
    if (!this.Panzoom) {
      return;
    }

    this.Panzoom.content = {
      ...this.Panzoom.content,
      fitWidth: this.contentWidth,
      origWidth: this.contentWidth,
      width: this.contentWidth,
    };

    if (this.pages.length > 1 && this.option("infiniteX", this.option("infinite"))) {
      this.Panzoom.boundX = null;
    } else if (this.pages.length) {
      this.Panzoom.boundX = {
        from: this.pages[this.pages.length - 1].left * -1,
        to: this.pages[0].left * -1,
      };
    }

    if (this.option("infiniteY", this.option("infinite"))) {
      this.Panzoom.boundY = null;
    } else {
      this.Panzoom.boundY = {
        from: 0,
        to: 0,
      };
    }

    this.Panzoom.handleCursor();
  }

  manageSlideVisiblity() {
    const contentWidth = this.contentWidth;
    const viewportWidth = this.viewportWidth;

    let currentX = this.Panzoom ? this.Panzoom.content.x * -1 : this.pages.length ? this.pages[this.page].left : 0;

    const preload = this.option("preload");
    const infinite = this.option("infiniteX", this.option("infinite"));

    const paddingLeft = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-left"));
    const paddingRight = parseFloat(getComputedStyle(this.$viewport, null).getPropertyValue("padding-right"));

    // Check visibility of each slide
    this.slides.forEach((slide) => {
      let leftBoundary, rightBoundary;

      let hasDiff = 0;

      // #1 - slides in current viewport; this does not include infinite items
      leftBoundary = currentX - paddingLeft;
      rightBoundary = currentX + viewportWidth + paddingRight;

      leftBoundary -= preload * (viewportWidth + paddingLeft + paddingRight);
      rightBoundary += preload * (viewportWidth + paddingLeft + paddingRight);

      const insideCurrentInterval = slide.left + slide.width > leftBoundary && slide.left < rightBoundary;

      // #2 - infinite items inside current viewport; from previous interval
      leftBoundary = currentX + contentWidth - paddingLeft;
      rightBoundary = currentX + contentWidth + viewportWidth + paddingRight;

      // Include slides that have to be preloaded
      leftBoundary -= preload * (viewportWidth + paddingLeft + paddingRight);

      const insidePrevInterval = infinite && slide.left + slide.width > leftBoundary && slide.left < rightBoundary;

      // #2 - infinite items inside current viewport; from next interval
      leftBoundary = currentX - contentWidth - paddingLeft;
      rightBoundary = currentX - contentWidth + viewportWidth + paddingRight;

      // Include slides that have to be preloaded
      leftBoundary -= preload * (viewportWidth + paddingLeft + paddingRight);

      const insideNextInterval = infinite && slide.left + slide.width > leftBoundary && slide.left < rightBoundary;

      // Create virtual slides that should be visible or preloaded, remove others
      if (insidePrevInterval || insideCurrentInterval || insideNextInterval) {
        this.createSlideEl(slide);

        if (insideCurrentInterval) {
          hasDiff = 0;
        }

        if (insidePrevInterval) {
          hasDiff = -1;
        }

        if (insideNextInterval) {
          hasDiff = 1;
        }

        // Bring preloaded slides back to viewport, if needed
        if (slide.left + slide.width > currentX && slide.left <= currentX + viewportWidth + paddingRight) {
          hasDiff = 0;
        }
      } else {
        this.removeSlideEl(slide);
      }

      slide.hasDiff = hasDiff;
    });

    // Reposition slides for continuity
    let nextIndex = 0;
    let nextPos = 0;

    this.slides.forEach((slide, index) => {
      let updatedX = 0;

      if (slide.$el) {
        if (index !== nextIndex || slide.hasDiff) {
          updatedX = nextPos + slide.hasDiff * contentWidth;
        } else {
          nextPos = 0;
        }

        slide.$el.style.left = Math.abs(updatedX) > 0.1 ? `${nextPos + slide.hasDiff * contentWidth}px` : "";

        nextIndex++;
      } else {
        nextPos += slide.width;
      }
    });

    this.markSelectedSlides();
  }

  /**
   * Creates main DOM element for virtual slides,
   * lazy loads images inside regular slides
   * @param {Object} slide
   */
  createSlideEl(slide) {
    if (!slide) {
      return;
    }

    if (slide.$el) {
      let curentIndex = slide.$el.dataset.index;

      if (!curentIndex || parseInt(curentIndex, 10) !== slide.index) {
        slide.$el.dataset.index = slide.index;

        // Lazy load images
        // ===
        slide.$el.querySelectorAll("[data-lazy-srcset]").forEach((node) => {
          node.srcset = node.dataset.lazySrcset;
        });

        slide.$el.querySelectorAll("[data-lazy-src]").forEach((node) => {
          let lazySrc = node.dataset.lazySrc;

          if (node instanceof HTMLImageElement) {
            node.src = lazySrc;
          } else {
            node.style.backgroundImage = `url('${lazySrc}')`;
          }
        });

        // Lazy load slide background image
        // ===
        let lazySrc;

        if ((lazySrc = slide.$el.dataset.lazySrc)) {
          slide.$el.style.backgroundImage = `url('${lazySrc}')`;
        }

        slide.state = "ready";
      }

      return;
    }

    const div = document.createElement("div");

    div.dataset.index = slide.index;
    div.classList.add(...(this.option("prefix") + this.option("classNames.slide")).split(" "));

    if (slide.customClass) {
      div.classList.add(...slide.customClass.split(" "));
    }

    if (slide.html) {
      div.innerHTML = slide.html;
    }

    const allElelements = [];

    this.slides.forEach((slide, index) => {
      if (slide.$el) {
        allElelements.push(index);
      }
    });

    // Find a place in DOM to insert an element
    const goal = slide.index;
    let refSlide = null;

    if (allElelements.length) {
      let refIndex = allElelements.reduce((prev, curr) =>
        Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
      );
      refSlide = this.slides[refIndex];
    }

    this.$track.insertBefore(
      div,
      refSlide && refSlide.$el ? (refSlide.index < slide.index ? refSlide.$el.nextSibling : refSlide.$el) : null
    );

    slide.$el = div;

    this.trigger("createSlide", slide, goal);

    return slide;
  }

  /**
   * Removes main DOM element of given slide
   * @param {Object} slide
   */
  removeSlideEl(slide) {
    if (slide.$el && !slide.isDom) {
      this.trigger("removeSlide", slide);

      slide.$el.remove();
      slide.$el = null;
    }
  }

  /**
   * Toggles selected class name and aria-hidden attribute for slides based on visibility
   */
  markSelectedSlides() {
    const selectedClass = this.option("classNames.slideSelected");
    const attr = "aria-hidden";

    this.slides.forEach((slide, index) => {
      const $el = slide.$el;

      if (!$el) {
        return;
      }

      const page = this.pages[this.page];

      if (page && page.indexes && page.indexes.indexOf(index) > -1) {
        if (selectedClass && !$el.classList.contains(selectedClass)) {
          $el.classList.add(selectedClass);
          this.trigger("selectSlide", slide);
        }

        $el.removeAttribute(attr);
      } else {
        if (selectedClass && $el.classList.contains(selectedClass)) {
          $el.classList.remove(selectedClass);
          this.trigger("unselectSlide", slide);
        }

        $el.setAttribute(attr, true);
      }
    });
  }

  /**
   * Perform all calculations and center current page
   */
  updatePage() {
    this.updateMetrics();

    this.slideTo(this.page, { friction: 0 });
  }

  /**
   * Process `Panzoom.beforeTransform` event to remove slides moved out of viewport and
   * to create necessary ones
   */
  onBeforeTransform() {
    if (this.option("infiniteX", this.option("infinite"))) {
      this.manageInfiniteTrack();
    }

    this.manageSlideVisiblity();
  }

  /**
   * Seamlessly flip position of infinite carousel, if needed; this way x position stays low
   */
  manageInfiniteTrack() {
    const contentWidth = this.contentWidth;
    const viewportWidth = this.viewportWidth;

    if (!this.option("infiniteX", this.option("infinite")) || this.pages.length < 2 || contentWidth < viewportWidth) {
      return;
    }

    const panzoom = this.Panzoom;

    let isFlipped = false;

    if (panzoom.content.x < (contentWidth - viewportWidth) * -1) {
      panzoom.content.x += contentWidth;

      this.pageIndex = this.pageIndex - this.pages.length;

      isFlipped = true;
    }

    if (panzoom.content.x > viewportWidth) {
      panzoom.content.x -= contentWidth;

      this.pageIndex = this.pageIndex + this.pages.length;

      isFlipped = true;
    }

    if (isFlipped && panzoom.state === "pointerdown") {
      panzoom.resetDragPosition();
    }

    return isFlipped;
  }

  /**
   * Process `Panzoom.touchEnd` event; slide to next/prev page if needed
   * @param {object} panzoom
   */
  onTouchEnd(panzoom, event) {
    const dragFree = this.option("dragFree");

    // If this is a quick horizontal flick, slide to next/prev slide
    if (
      !dragFree &&
      this.pages.length > 1 &&
      panzoom.dragOffset.time < 350 &&
      Math.abs(panzoom.dragOffset.y) < 1 &&
      Math.abs(panzoom.dragOffset.x) > 5
    ) {
      this[panzoom.dragOffset.x < 0 ? "slideNext" : "slidePrev"]();
      return;
    }

    // Set the slide at the end of the animation as the current one,
    // or slide to closest page
    if (dragFree) {
      const [, nextPageIndex] = this.getPageFromPosition(panzoom.transform.x * -1);
      this.setPage(nextPageIndex);
    } else {
      this.slideToClosest();
    }
  }

  /**
   * Slides to the closest page (useful, if carousel is changed manually)
   * @param {Object} [params] - Object containing additional options
   */
  slideToClosest(params = {}) {
    let [, nextPageIndex] = this.getPageFromPosition(this.Panzoom.content.x * -1);

    this.slideTo(nextPageIndex, params);
  }

  /**
   * Returns index of closest page to given x position
   * @param {Number} xPos
   */
  getPageFromPosition(xPos) {
    const pageCount = this.pages.length;
    const center = this.option("center");

    if (center) {
      xPos += this.viewportWidth * 0.5;
    }

    const interval = Math.floor(xPos / this.contentWidth);

    xPos -= interval * this.contentWidth;

    let slide = this.slides.find((slide) => slide.left <= xPos && slide.left + slide.width > xPos);

    if (slide) {
      let pageIndex = this.findPageForSlide(slide.index);

      return [pageIndex, pageIndex + interval * pageCount];
    }

    return [0, 0];
  }

  /**
   * Changes active page
   * @param {Number} page - New index of active page
   * @param {Boolean} toClosest - to closest page based on scroll distance (for infinite navigation)
   */
  setPage(page, toClosest) {
    let nextPosition = 0;
    let pageIndex = parseInt(page, 10) || 0;

    const prevPage = this.page,
      prevPageIndex = this.pageIndex,
      pageCount = this.pages.length;

    const contentWidth = this.contentWidth;
    const viewportWidth = this.viewportWidth;

    page = ((pageIndex % pageCount) + pageCount) % pageCount;

    if (this.option("infiniteX", this.option("infinite")) && contentWidth > viewportWidth) {
      const nextInterval = Math.floor(pageIndex / pageCount) || 0,
        elemDimWidth = contentWidth;

      nextPosition = this.pages[page].left + nextInterval * elemDimWidth;

      if (toClosest === true && pageCount > 2) {
        let currPosition = this.Panzoom.content.x * -1;

        // * Find closest interval
        const decreasedPosition = nextPosition - elemDimWidth,
          increasedPosition = nextPosition + elemDimWidth,
          diff1 = Math.abs(currPosition - nextPosition),
          diff2 = Math.abs(currPosition - decreasedPosition),
          diff3 = Math.abs(currPosition - increasedPosition);

        if (diff3 < diff1 && diff3 <= diff2) {
          nextPosition = increasedPosition;
          pageIndex += pageCount;
        } else if (diff2 < diff1 && diff2 < diff3) {
          nextPosition = decreasedPosition;
          pageIndex -= pageCount;
        }
      }
    } else {
      page = pageIndex = Math.max(0, Math.min(pageIndex, pageCount - 1));

      nextPosition = this.pages.length ? this.pages[page].left : 0;
    }

    this.page = page;
    this.pageIndex = pageIndex;

    if (prevPage !== null && page !== prevPage) {
      this.prevPage = prevPage;
      this.prevPageIndex = prevPageIndex;

      this.trigger("change", page, prevPage);
    }

    return nextPosition;
  }

  /**
   * Clean up
   */
  destroy() {
    this.state = "destroy";

    this.slides.forEach((slide) => {
      this.removeSlideEl(slide);
    });

    this.slides = [];

    this.Panzoom.destroy();

    this.detachPlugins();
  }
}

// Expose version
Carousel.version = "__VERSION__";

// Static properties are a recent addition that dont work in all browsers yet
Carousel.Plugins = Plugins$1;class ScrollLock {
  constructor(fancybox) {
    this.fancybox = fancybox;
    this.viewport = null;

    this.pendingUpdate = null;

    for (const methodName of ["onReady", "onResize", "onTouchstart", "onTouchmove"]) {
      this[methodName] = this[methodName].bind(this);
    }
  }

  /**
   * Process `initLayout` event to attach event listeners and resize viewport if needed
   */
  onReady() {
    //* Support Visual Viewport API
    // https://developer.mozilla.org/en-US/docs/Web/API/Visual_Viewport_API
    const viewport = window.visualViewport;

    if (viewport) {
      this.viewport = viewport;
      this.startY = 0;

      viewport.addEventListener("resize", this.onResize);

      this.updateViewport();
    }

    //* Prevent bouncing while scrolling on mobile devices
    window.addEventListener("touchstart", this.onTouchstart, { passive: false });
    window.addEventListener("touchmove", this.onTouchmove, { passive: false });

    //* Prevent window scrolling with mouse wheel
    window.addEventListener("wheel", this.onWheel, { passive: false });
  }

  /**
   * Handle `resize` event to call `updateViewport`
   */
  onResize() {
    this.updateViewport();
  }

  /**
   * Scale $container proportionally to actually fit inside browser,
   * e.g., disable viewport zooming
   */
  updateViewport() {
    const fancybox = this.fancybox,
      viewport = this.viewport,
      scale = viewport.scale || 1,
      $container = fancybox.$container;

    if (!$container) {
      return;
    }

    let width = "",
      height = "",
      transform = "";

    if (scale - 1 > 0.1) {
      width = `${viewport.width * scale}px`;
      height = `${viewport.height * scale}px`;
      transform = `translate3d(${viewport.offsetLeft}px, ${viewport.offsetTop}px, 0) scale(${1 / scale})`;
    }

    $container.style.width = width;
    $container.style.height = height;
    $container.style.transform = transform;
  }

  /**
   * Handle `touchstart` event to mark drag start position
   * @param {Object} event
   */
  onTouchstart(event) {
    this.startY = event.touches ? event.touches[0].screenY : event.screenY;
  }

  /**
   * Handle `touchmove` event to fix scrolling on mobile devices (iOS)
   * @param {Object} event
   */
  onTouchmove(event) {
    const startY = this.startY;
    const zoom = window.innerWidth / window.document.documentElement.clientWidth;

    if (!event.cancelable) {
      return;
    }

    if (event.touches.length > 1 || zoom !== 1) {
      return;
    }

    const target = event.target;
    const el = isScrollable(target);

    if (!el) {
      event.preventDefault();
      return;
    }

    const style = window.getComputedStyle(el);
    const height = parseInt(style.getPropertyValue("height"), 10);

    const curY = event.touches ? event.touches[0].screenY : event.screenY;

    const isAtTop = startY <= curY && el.scrollTop === 0;
    const isAtBottom = startY >= curY && el.scrollHeight - el.scrollTop === height;

    if (isAtTop || isAtBottom) {
      event.preventDefault();
    }
  }

  /**
   * Handle `wheel` event
   */
  onWheel(event) {
    if (!isScrollable(event.target)) {
      event.preventDefault();
    }
  }

  /**
   * Clean everything up
   */
  cleanup() {
    if (this.pendingUpdate) {
      cancelAnimationFrame(this.pendingUpdate);
      this.pendingUpdate = null;
    }

    const viewport = this.viewport;

    if (viewport) {
      viewport.removeEventListener("resize", this.onResize);
      this.viewport = null;
    }

    window.removeEventListener("touchstart", this.onTouchstart, false);
    window.removeEventListener("touchmove", this.onTouchmove, false);

    window.removeEventListener("wheel", this.onWheel, { passive: false });
  }

  attach() {
    this.fancybox.on("initLayout", this.onReady);
  }

  detach() {
    this.fancybox.off("initLayout", this.onReady);

    this.cleanup();
  }
}const defaults$5 = {
  // The minimum number of images in the gallery to display thumbnails
  minSlideCount: 2,

  // Minimum screen height to display thumbnails
  minScreenHeight: 500,

  // Automatically show thumbnails when opened
  autoStart: true,

  // Keyboard shortcut to toggle thumbnail container
  key: "t",

  // Customize Carousel instance
  Carousel: {},
};

class Thumbs {
  constructor(fancybox) {
    this.fancybox = fancybox;

    this.$container = null;
    this.state = "init";

    for (const methodName of ["onPrepare", "onClosing", "onKeydown"]) {
      this[methodName] = this[methodName].bind(this);
    }

    this.events = {
      prepare: this.onPrepare,
      closing: this.onClosing,
      keydown: this.onKeydown,
    };
  }

  /**
   * Process `prepare` event to build the layout
   */
  onPrepare() {
    // Get slides, skip if the total number is less than the minimum
    const slides = this.getSlides();

    if (slides.length < this.fancybox.option("Thumbs.minSlideCount")) {
      this.state = "disabled";
      return;
    }

    if (
      this.fancybox.option("Thumbs.autoStart") === true &&
      this.fancybox.Carousel.Panzoom.content.height >= this.fancybox.option("Thumbs.minScreenHeight")
    ) {
      this.build();
    }
  }

  /**
   * Process `closing` event to disable all events
   */
  onClosing() {
    if (this.Carousel) {
      this.Carousel.Panzoom.detachEvents();
    }
  }

  /**
   * Process `keydown` event to enable thumbnail list toggling using keyboard key
   * @param {Object} fancybox
   * @param {String} key
   */
  onKeydown(fancybox, key) {
    if (key === fancybox.option("Thumbs.key")) {
      this.toggle();
    }
  }

  /**
   * Build layout and init thumbnail Carousel
   */
  build() {
    if (this.$container) {
      return;
    }

    // Create wrapping element and append to layout
    const $container = document.createElement("div");

    $container.classList.add("fancybox__thumbs");

    this.fancybox.$carousel.parentNode.insertBefore($container, this.fancybox.$carousel.nextSibling);

    // Initialise thumbnail carousel with all slides
    this.Carousel = new Carousel(
      $container,
      extend$2(
        true,
        {
          Dots: false,
          Navigation: false,
          Sync: {
            friction: 0,
          },
          infinite: false,
          center: true,
          fill: true,
          dragFree: true,
          slidesPerPage: 1,
          preload: 1,
        },
        this.fancybox.option("Thumbs.Carousel"),
        {
          Sync: {
            target: this.fancybox.Carousel,
          },
          slides: this.getSlides(),
        }
      )
    );

    // Slide carousel on wheel event
    this.Carousel.Panzoom.on("wheel", (panzoom, event) => {
      event.preventDefault();

      this.fancybox[event.deltaY < 0 ? "prev" : "next"]();
    });

    this.$container = $container;

    this.state = "visible";
  }

  /**
   * Process all fancybox slides to get all thumbnail images
   */
  getSlides() {
    const slides = [];

    for (const slide of this.fancybox.items) {
      const thumb = slide.thumb;

      if (thumb) {
        slides.push({
          html: `<div class="fancybox__thumb" style="background-image:url('${thumb}')"></div>`,
          customClass: `has-thumb has-${slide.type || "image"}`,
        });
      }
    }

    return slides;
  }

  /**
   * Toggle visibility of thumbnail list
   * Tip: you can use `Fancybox.getInstance().plugins.Thumbs.toggle()` from anywhere in your code
   */
  toggle() {
    if (this.state === "visible") {
      this.hide();
    } else if (this.state === "hidden") {
      this.show();
    } else {
      this.build();
    }
  }

  /**
   * Show thumbnail list
   */
  show() {
    if (this.state === "hidden") {
      this.$container.style.display = "";

      this.Carousel.Panzoom.attachEvents();

      this.state = "visible";
    }
  }

  /**
   * Hide thumbnail list
   */
  hide() {
    if (this.state === "visible") {
      this.Carousel.Panzoom.detachEvents();

      this.$container.style.display = "none";

      this.state = "hidden";
    }
  }

  /**
   * Reset the state
   */
  cleanup() {
    if (this.Carousel) {
      this.Carousel.destroy();
      this.Carousel = null;
    }

    if (this.$container) {
      this.$container.remove();
      this.$container = null;
    }

    this.state = "init";
  }

  attach() {
    this.fancybox.on(this.events);
  }

  detach() {
    this.fancybox.off(this.events);

    this.cleanup();
  }
}

// Expose defaults
Thumbs.defaults = defaults$5;const buildURLQuery = (src, obj) => {
  const url = new URL(src);
  const params = new URLSearchParams(url.search);

  let rez = new URLSearchParams();

  for (const [key, value] of [...params, ...Object.entries(obj)]) {
    // Youtube
    if (key === "t") {
      rez.set("start", parseInt(value));
    } else {
      rez.set(key, value);
    }
  }

  // Convert to 'foo=1&bar=2&baz=3'
  rez = rez.toString();

  // Vimeo
  // https://vimeo.zendesk.com/hc/en-us/articles/360000121668-Starting-playback-at-a-specific-timecode
  let matches = src.match(/#t=((.*)?\d+s)/);

  if (matches) {
    rez += `#t=${matches[1]}`;
  }

  return rez;
};

const defaults$6 = {
  // General options for any video content (Youtube, Vimeo, HTML5 video)
  video: {
    autoplay: true,
    ratio: 16 / 9,
  },
  // Youtube embed parameters
  youtube: {
    autohide: 1,
    fs: 1,
    rel: 0,
    hd: 1,
    wmode: "transparent",
    enablejsapi: 1,
    html5: 1,
  },
  // Vimeo embed parameters
  vimeo: {
    hd: 1,
    show_title: 1,
    show_byline: 1,
    show_portrait: 0,
    fullscreen: 1,
  },
  // HTML5 video parameters
  html5video: {
    tpl: `<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`,
    format: "",
  },
};

class Html {
  constructor(fancybox) {
    this.fancybox = fancybox;

    for (const methodName of [
      "onInit",
      "onReady",

      "onCreateSlide",
      "onRemoveSlide",

      "onSelectSlide",
      "onUnselectSlide",

      "onRefresh",

      // For communication with iframed video (youtube/vimeo)
      "onMessage",
    ]) {
      this[methodName] = this[methodName].bind(this);
    }

    this.events = {
      init: this.onInit,
      ready: this.onReady,

      "Carousel.createSlide": this.onCreateSlide,
      "Carousel.removeSlide": this.onRemoveSlide,

      "Carousel.selectSlide": this.onSelectSlide,
      "Carousel.unselectSlide": this.onUnselectSlide,

      "Carousel.refresh": this.onRefresh,
    };
  }

  /**
   * Check if each gallery item has type when fancybox starts
   */
  onInit() {
    for (const slide of this.fancybox.items) {
      this.processType(slide);
    }
  }

  /**
   * Set content type for the slide
   * @param {Object} slide
   */
  processType(slide) {
    // Add support for `new Fancybox({items : [{html : 'smth'}]});`
    if (slide.html) {
      slide.src = slide.html;
      slide.type = "html";

      delete slide.html;

      return;
    }

    const src = slide.src || "";

    let type = slide.type || this.fancybox.options.type,
      rez = null;

    if (src && typeof src !== "string") {
      return;
    }

    if (
      (rez = src.match(
        /(?:youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i
      ))
    ) {
      const params = buildURLQuery(src, this.fancybox.option("Html.youtube"));
      const videoId = encodeURIComponent(rez[1]);

      slide.videoId = videoId;
      slide.src = `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
      slide.thumb = slide.thumb || `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
      slide.vendor = "youtube";

      type = "video";
    } else if ((rez = src.match(/^.+vimeo.com\/(?:\/)?([\d]+)(.*)?/))) {
      const params = buildURLQuery(src, this.fancybox.option("Html.vimeo"));
      const videoId = encodeURIComponent(rez[1]);

      slide.videoId = videoId;
      slide.src = `https://player.vimeo.com/video/${videoId}?${params}`;
      slide.vendor = "vimeo";

      type = "video";
    } else if (
      (rez = src.match(
        /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i
      ))
    ) {
      slide.src = `//maps.google.${rez[1]}/?ll=${(rez[2]
        ? rez[2] + "&z=" + Math.floor(rez[3]) + (rez[4] ? rez[4].replace(/^\//, "&") : "")
        : rez[4] + ""
      ).replace(/\?/, "&")}&output=${rez[4] && rez[4].indexOf("layer=c") > 0 ? "svembed" : "embed"}`;

      type = "map";
    } else if ((rez = src.match(/(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i))) {
      slide.src = `//maps.google.${rez[1]}/maps?q=${rez[2].replace("query=", "q=").replace("api=1", "")}&output=embed`;

      type = "map";
    }

    // Guess content type
    if (!type) {
      if (src.charAt(0) === "#") {
        type = "inline";
      } else if ((rez = src.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))) {
        type = "html5video";

        slide.format = slide.format || "video/" + (rez[1] === "ogv" ? "ogg" : rez[1]);
      } else if (src.match(/(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i)) {
        type = "image";
      } else if (src.match(/\.(pdf)((\?|#).*)?$/i)) {
        type = "pdf";
      }
    }

    slide.type = type || this.fancybox.option("defaultType", "image");

    if (type === "html5video" || type === "video") {
      slide.video = extend$2({}, this.fancybox.option("Html.video"), slide.video);

      if (slide._width && slide._height) {
        slide.ratio = parseFloat(slide._width) / parseFloat(slide._height);
      } else {
        slide.ratio = slide.ratio || slide.video.ratio || defaults$6.video.ratio;
      }
    }
  }

  /**
   * Start loading content when Fancybox is ready
   */
  onReady() {
    this.fancybox.Carousel.slides.forEach((slide) => {
      if (slide.$el) {
        this.setContent(slide);

        if (slide.index === this.fancybox.getSlide().index) {
          this.playVideo(slide);
        }
      }
    });
  }

  /**
   * Process `Carousel.createSlide` event to create image content
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  onCreateSlide(fancybox, carousel, slide) {
    if (this.fancybox.state !== "ready") {
      return;
    }

    this.setContent(slide);
  }

  /**
   * Retrieve and set slide content
   * @param {Object} slide
   */
  loadInlineContent(slide) {
    let $content;

    if (slide.src instanceof HTMLElement) {
      $content = slide.src;
    } else if (typeof slide.src === "string") {
      const tmp = slide.src.split("#", 2);
      const id = tmp.length === 2 && tmp[0] === "" ? tmp[1] : tmp[0];

      $content = document.getElementById(id);
    }

    if ($content) {
      if (slide.type === "clone" || $content.$placeHolder) {
        $content = $content.cloneNode(true);
        let attrId = $content.getAttribute("id");

        attrId = attrId ? `${attrId}--clone` : `clone-${this.fancybox.id}-${slide.index}`;

        $content.setAttribute("id", attrId);
      } else {
        const $placeHolder = document.createElement("div");
        $placeHolder.classList.add("fancybox-placeholder");
        $content.parentNode.insertBefore($placeHolder, $content);
        $content.$placeHolder = $placeHolder;
      }

      this.fancybox.setContent(slide, $content);
    } else {
      this.fancybox.setError(slide, "{{ELEMENT_NOT_FOUND}}");
    }
  }

  /**
   * Makes AJAX request and sets response as slide content
   * @param {Object} slide
   */
  loadAjaxContent(slide) {
    const fancybox = this.fancybox;
    const xhr = new XMLHttpRequest();

    fancybox.showLoading(slide);

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (fancybox.state === "ready") {
          fancybox.hideLoading(slide);

          if (xhr.status === 200) {
            fancybox.setContent(slide, xhr.responseText);
          } else {
            fancybox.setError(slide, xhr.status === 404 ? "{{AJAX_NOT_FOUND}}" : "{{AJAX_FORBIDDEN}}");
          }
        }
      }
    };

    xhr.open("GET", slide.src);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.send(slide.ajax || null);

    slide.xhr = xhr;
  }

  /**
   * Creates iframe as slide content, preloads if needed before displaying
   * @param {Object} slide
   */
  loadIframeContent(slide) {
    const fancybox = this.fancybox;
    const $iframe = document.createElement("iframe");

    $iframe.className = "fancybox__iframe";

    $iframe.setAttribute("id", `fancybox__iframe_${fancybox.id}_${slide.index}`);

    $iframe.setAttribute("allow", "autoplay; fullscreen");
    $iframe.setAttribute("scrolling", "auto");

    slide.$iframe = $iframe;

    if (slide.type !== "iframe" || slide.preload === false) {
      $iframe.setAttribute("src", slide.src);

      this.fancybox.setContent(slide, $iframe);

      this.resizeIframe(slide);

      return;
    }

    fancybox.showLoading(slide);

    const $content = document.createElement("div");
    $content.style.visibility = "hidden";

    this.fancybox.setContent(slide, $content);

    $content.appendChild($iframe);

    $iframe.onerror = () => {
      fancybox.setError(slide, "{{IFRAME_ERROR}}");
    };

    $iframe.onload = () => {
      fancybox.hideLoading(slide);

      let isFirstLoad = false;

      if (!$iframe.isReady) {
        $iframe.isReady = true;
        isFirstLoad = true;
      }

      if (!$iframe.src.length) {
        return;
      }

      $iframe.parentNode.style.visibility = "";

      this.resizeIframe(slide);

      if (isFirstLoad) {
        fancybox.revealContent(slide);
      }
    };

    $iframe.setAttribute("src", slide.src);
  }

  /**
   * Set CSS max/min width/height properties of the content to have the correct aspect ratio
   * @param {Object} slide
   */
  setAspectRatio(slide) {
    const $content = slide.$content;
    const ratio = slide.ratio;

    if (!$content) {
      return;
    }

    let width = slide._width;
    let height = slide._height;

    if (ratio || (width && height)) {
      Object.assign($content.style, {
        width: width && height ? "100%" : "",
        height: width && height ? "100%" : "",
        maxWidth: "",
        maxHeight: "",
      });

      let maxWidth = $content.offsetWidth;
      let maxHeight = $content.offsetHeight;

      width = width || maxWidth;
      height = height || maxHeight;

      // Resize to fit
      if (width > maxWidth || height > maxHeight) {
        let maxRatio = Math.min(maxWidth / width, maxHeight / height);

        width = width * maxRatio;
        height = height * maxRatio;
      }

      // Recheck ratio
      if (Math.abs(width / height - ratio) > 0.01) {
        if (ratio < width / height) {
          width = height * ratio;
        } else {
          height = width / ratio;
        }
      }

      Object.assign($content.style, {
        width: `${width}px`,
        height: `${height}px`,
      });
    }
  }

  /**
   * Adjust the width and height of the iframe according to the content dimensions, or defined sizes
   * @param {Object} slide
   */
  resizeIframe(slide) {
    const $iframe = slide.$iframe;

    if (!$iframe) {
      return;
    }

    let width_ = slide._width || 0;
    let height_ = slide._height || 0;

    if (width_ && height_) {
      slide.autoSize = false;
    }

    const $parent = $iframe.parentNode;
    const parentStyle = $parent.style;

    if (slide.preload !== false && slide.autoSize !== false) {
      try {
        const compStyles = window.getComputedStyle($parent),
          paddingX = parseFloat(compStyles.paddingLeft) + parseFloat(compStyles.paddingRight),
          paddingY = parseFloat(compStyles.paddingTop) + parseFloat(compStyles.paddingBottom);

        const document = $iframe.contentWindow.document,
          $html = document.getElementsByTagName("html")[0],
          $body = document.body;

        // Allow content to expand horizontally
        parentStyle.width = "";

        // Get rid of vertical scrollbar
        $body.style.overflow = "hidden";

        width_ = width_ || $html.scrollWidth + paddingX;

        parentStyle.width = `${width_}px`;

        $body.style.overflow = "";

        parentStyle.flex = "0 0 auto";
        parentStyle.height = `${$body.scrollHeight}px`;

        height_ = $html.scrollHeight + paddingY;
      } catch (error) {
        //
      }
    }

    if (width_ || height_) {
      const newStyle = {
        flex: "0 1 auto",
      };

      if (width_) {
        newStyle.width = `${width_}px`;
      }

      if (height_) {
        newStyle.height = `${height_}px`;
      }

      Object.assign(parentStyle, newStyle);
    }
  }

  /**
   * Process `Carousel.onRefresh` event,
   * trigger iframe autosizing and set content aspect ratio for each slide
   * @param {Object} fancybox
   * @param {Object} carousel
   */
  onRefresh(fancybox, carousel) {
    carousel.slides.forEach((slide) => {
      if (!slide.$el) {
        return;
      }

      if (slide.$iframe) {
        this.resizeIframe(slide);
      }

      if (slide.ratio) {
        this.setAspectRatio(slide);
      }
    });
  }

  /**
   * Process `Carousel.onCreateSlide` event to set content
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  setContent(slide) {
    if (!slide || slide.isDom) {
      return;
    }

    switch (slide.type) {
      case "html":
        this.fancybox.setContent(slide, slide.src);
        break;

      case "html5video":
        this.fancybox.setContent(
          slide,
          this.fancybox
            .option("Html.html5video.tpl")
            .replace(/\{\{src\}\}/gi, slide.src)
            .replace("{{format}}", slide.format || (slide.html5video && slide.html5video.format) || "")
            .replace("{{poster}}", slide.poster || slide.thumb || "")
        );

        break;

      case "inline":
      case "clone":
        this.loadInlineContent(slide);
        break;

      case "ajax":
        this.loadAjaxContent(slide);
        break;

      case "pdf":
      case "video":
      case "map":
        slide.preload = false;

      case "iframe":
        this.loadIframeContent(slide);

        break;
    }

    if (slide.ratio) {
      this.setAspectRatio(slide);
    }
  }

  /**
   * Process `Carousel.onSelectSlide` event to start video
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  onSelectSlide(fancybox, carousel, slide) {
    if (fancybox.state === "ready") {
      this.playVideo(slide);
    }
  }

  /**
   * Attempts to begin playback of the media
   * @param {Object} slide
   */
  playVideo(slide) {
    if (slide.type === "html5video" && slide.video.autoplay) {
      try {
        const $video = slide.$el.querySelector("video");

        if ($video) {
          const promise = $video.play();

          if (promise !== undefined) {
            promise
              .then(() => {
                // Autoplay started
              })
              .catch((error) => {
                // Autoplay was prevented.
                $video.muted = true;
                $video.play();
              });
          }
        }
      } catch (err) {}
    }

    if (slide.type !== "video" || !(slide.$iframe && slide.$iframe.contentWindow)) {
      return;
    }

    // This function will be repeatedly called to check
    // if video iframe has been loaded to send message to start the video
    const poller = () => {
      if (slide.state === "done" && slide.$iframe && slide.$iframe.contentWindow) {
        let command;

        if (slide.$iframe.isReady) {
          if (slide.video && slide.video.autoplay) {
            if (slide.vendor == "youtube") {
              command = {
                event: "command",
                func: "playVideo",
              };
            } else {
              command = {
                method: "play",
                value: "true",
              };
            }
          }

          if (command) {
            slide.$iframe.contentWindow.postMessage(JSON.stringify(command), "*");
          }

          return;
        }

        if (slide.vendor === "youtube") {
          command = {
            event: "listening",
            id: slide.$iframe.getAttribute("id"),
          };

          slide.$iframe.contentWindow.postMessage(JSON.stringify(command), "*");
        }
      }

      slide.poller = setTimeout(poller, 250);
    };

    poller();
  }

  /**
   * Process `Carousel.onUnselectSlide` event to pause video
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  onUnselectSlide(fancybox, carousel, slide) {
    if (slide.type === "html5video") {
      try {
        slide.$el.querySelector("video").pause();
      } catch (error) {}

      return;
    }

    let command = false;

    if (slide.vendor == "vimeo") {
      command = {
        method: "pause",
        value: "true",
      };
    } else if (slide.vendor === "youtube") {
      command = {
        event: "command",
        func: "pauseVideo",
      };
    }

    if (command && slide.$iframe && slide.$iframe.contentWindow) {
      slide.$iframe.contentWindow.postMessage(JSON.stringify(command), "*");
    }

    clearTimeout(slide.poller);
  }

  /**
   * Process `Carousel.onRemoveSlide` event to do clean up
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  onRemoveSlide(fancybox, carousel, slide) {
    // Abort ajax request if exists
    if (slide.xhr) {
      slide.xhr.abort();
      slide.xhr = null;
    }

    // Unload iframe content if exists
    if (slide.$iframe) {
      slide.$iframe.onload = slide.$iframe.onerror = null;

      slide.$iframe.src = "//about:blank";
      slide.$iframe = null;
    }

    // Clear inline content
    const $content = slide.$content;

    if (slide.type === "inline" && $content) {
      $content.classList.remove("fancybox__content");

      if ($content.style.display !== "none") {
        $content.style.display = "none";
      }
    }

    if (slide.$closeButton) {
      slide.$closeButton.remove();
      slide.$closeButton = null;
    }

    const $placeHolder = $content && $content.$placeHolder;

    if ($placeHolder) {
      $placeHolder.parentNode.insertBefore($content, $placeHolder);
      $placeHolder.remove();
      $content.$placeHolder = null;
    }
  }

  /**
   * Process `window.message` event to mark video iframe element as `ready`
   * @param {Object} e - Event
   */
  onMessage(e) {
    try {
      let data = JSON.parse(e.data);

      if (e.origin === "https://player.vimeo.com") {
        if (data.event === "ready") {
          for (let $iframe of document.getElementsByClassName("fancybox__iframe")) {
            if ($iframe.contentWindow === e.source) {
              $iframe.isReady = 1;
            }
          }
        }
      } else if (e.origin === "https://www.youtube-nocookie.com") {
        if (data.event === "onReady") {
          document.getElementById(data.id).isReady = 1;
        }
      }
    } catch (ex) {}
  }

  attach() {
    this.fancybox.on(this.events);

    window.addEventListener("message", this.onMessage, false);
  }

  detach() {
    this.fancybox.off(this.events);

    window.removeEventListener("message", this.onMessage, false);
  }
}

// Expose defaults
Html.defaults = defaults$6;const defaults$7 = {
  // Class name for slide element indicating that content can be zoomed in
  canZoomInClass: "can-zoom_in",

  // Class name for slide element indicating that content can be zoomed out
  canZoomOutClass: "can-zoom_out",

  // Do zoom animation from thumbnail image when starting or closing fancybox
  zoom: true,

  // Animate opacity while zooming
  zoomOpacity: "auto", // "auto" | true | false,

  // Zoom animation friction
  zoomFriction: 0.82,

  // Disable zoom animation if thumbnail is visible only partly
  ignoreCoveredThumbnail: false,

  // Enable guestures
  touch: true,

  // Action to be performed when user clicks on the image
  click: "toggleZoom", // "toggleZoom" | "next" | "close" | null

  // Action to be performed when double-click event is detected on the image
  doubleClick: null, // "toggleZoom" | null

  // Action to be performed when user rotates a wheel button on a pointing device
  wheel: "zoom", // "zoom" | "slide" | "close" | null

  // How image should be resized to fit its container
  fit: "contain", // "contain" | "contain-w" | "cover"

  // Should create wrapping element around the image
  wrap: false,

  // Custom Panzoom options
  Panzoom: {
    ratio: 1,
  },
};

class Image {
  constructor(fancybox) {
    this.fancybox = fancybox;

    for (const methodName of [
      // Fancybox
      "onReady",
      "onClosing",
      "onDone",

      // Fancybox.Carousel
      "onPageChange",
      "onCreateSlide",
      "onRemoveSlide",

      // Image load/error
      "onImageStatusChange",
    ]) {
      this[methodName] = this[methodName].bind(this);
    }

    this.events = {
      ready: this.onReady,
      closing: this.onClosing,
      done: this.onDone,

      "Carousel.change": this.onPageChange,
      "Carousel.createSlide": this.onCreateSlide,
      "Carousel.removeSlide": this.onRemoveSlide,
    };
  }

  /**
   * Handle `ready` event to start loading content
   */
  onReady() {
    this.fancybox.Carousel.slides.forEach((slide) => {
      if (slide.$el) {
        this.setContent(slide);
      }
    });
  }

  /**
   * Handle `done` event to update cursor
   * @param {Object} fancybox
   * @param {Object} slide
   */
  onDone(fancybox, slide) {
    this.handleCursor(slide);
  }

  /**
   * Handle `closing` event to clean up all slides and to start zoom-out animation
   * @param {Object} fancybox
   */
  onClosing(fancybox) {
    clearTimeout(this.clickTimer);
    this.clickTimer = null;

    // Remove events
    fancybox.Carousel.slides.forEach((slide) => {
      if (slide.$image) {
        slide.state = "destroy";
      }

      if (slide.Panzoom) {
        slide.Panzoom.detachEvents();
      }
    });

    // If possible, start the zoom animation, it will interrupt the default closing process
    if (this.fancybox.state === "closing" && this.canZoom(fancybox.getSlide())) {
      this.zoomOut();
    }
  }

  /**
   * Process `Carousel.createSlide` event to create image content
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  onCreateSlide(fancybox, carousel, slide) {
    if (this.fancybox.state !== "ready") {
      return;
    }

    this.setContent(slide);
  }

  /**
   * Handle `Carousel.removeSlide` event to do clean up the slide
   * @param {Object} fancybox
   * @param {Object} carousel
   * @param {Object} slide
   */
  onRemoveSlide(fancybox, carousel, slide) {
    if (slide.$image) {
      slide.$el.classList.remove(fancybox.option("Image.canZoomInClass"));

      slide.$image.remove();
      slide.$image = null;
    }

    if (slide.Panzoom) {
      slide.Panzoom.destroy();
      slide.Panzoom = null;
    }

    if (slide.$el && slide.$el.dataset) {
      delete slide.$el.dataset.imageFit;
    }
  }

  /**
   * Build DOM elements and add event listeners
   * @param {Object} slide
   */
  setContent(slide) {
    // Check if this slide should contain an image
    if (slide.isDom || slide.html || (slide.type && slide.type !== "image")) {
      return;
    }

    if (slide.$image) {
      return;
    }

    slide.type = "image";
    slide.state = "loading";

    // * Build layout
    // Container
    const $content = document.createElement("div");
    $content.style.visibility = "hidden";

    // Image element
    const $image = document.createElement("img");

    $image.addEventListener("load", (event) => {
      event.stopImmediatePropagation();

      this.onImageStatusChange(slide);
    });

    $image.addEventListener("error", () => {
      this.onImageStatusChange(slide);
    });

    $image.src = slide.src;
    $image.alt = "";
    $image.draggable = false;

    $image.classList.add("fancybox__image");

    if (slide.srcset) {
      $image.setAttribute("srcset", slide.srcset);
    }

    if (slide.sizes) {
      $image.setAttribute("sizes", slide.sizes);
    }

    slide.$image = $image;

    const shouldWrap = this.fancybox.option("Image.wrap");

    if (shouldWrap) {
      const $wrap = document.createElement("div");
      $wrap.classList.add(typeof shouldWrap === "string" ? shouldWrap : "fancybox__image-wrap");

      $wrap.appendChild($image);

      $content.appendChild($wrap);

      slide.$wrap = $wrap;
    } else {
      $content.appendChild($image);
    }

    // Set data attribute if other that default
    // for example, set `[data-image-fit="contain-w"]`
    slide.$el.dataset.imageFit = this.fancybox.option("Image.fit");

    // Append content
    this.fancybox.setContent(slide, $content);

    // Display loading icon
    if ($image.complete || $image.error) {
      this.onImageStatusChange(slide);
    } else {
      this.fancybox.showLoading(slide);
    }
  }

  /**
   * Handle image state change, display error or start revealing image
   * @param {Object} slide
   */
  onImageStatusChange(slide) {
    const $image = slide.$image;

    if (!$image || slide.state !== "loading") {
      return;
    }

    if (!($image.complete && $image.naturalWidth && $image.naturalHeight)) {
      this.fancybox.setError(slide, "{{IMAGE_ERROR}}");

      return;
    }

    this.fancybox.hideLoading(slide);

    if (this.fancybox.option("Image.fit") === "contain") {
      this.initSlidePanzoom(slide);
    }

    // Add `wheel` and `click` event handler
    slide.$el.addEventListener("wheel", (event) => this.onWheel(slide, event), { passive: false });
    slide.$content.addEventListener("click", (event) => this.onClick(slide, event), { passive: false });

    this.revealContent(slide);
  }

  /**
   * Make image zoomable and draggable using Panzoom
   * @param {Object} slide
   */
  initSlidePanzoom(slide) {
    if (slide.Panzoom) {
      return;
    }

    //* Initialize Panzoom
    slide.Panzoom = new Panzoom(
      slide.$el,
      extend$2(true, this.fancybox.option("Image.Panzoom", {}), {
        viewport: slide.$wrap,
        content: slide.$image,

        width: slide._width,
        height: slide._height,

        wrapInner: false,

        // Allow to select caption text
        textSelection: true,

        // Toggle gestures
        touch: this.fancybox.option("Image.touch"),

        // This will prevent click conflict with fancybox main carousel
        panOnlyZoomed: true,

        // Disable default click / wheel events as custom event listeners will replace them,
        // because click and wheel events should work without Panzoom
        click: false,
        wheel: false,
      })
    );

    slide.Panzoom.on("startAnimation", () => {
      this.fancybox.trigger("Image.startAnimation", slide);
    });

    slide.Panzoom.on("endAnimation", () => {
      if (slide.state === "zoomIn") {
        this.fancybox.done(slide);
      }

      this.handleCursor(slide);

      this.fancybox.trigger("Image.endAnimation", slide);
    });

    slide.Panzoom.on("afterUpdate", () => {
      this.handleCursor(slide);

      this.fancybox.trigger("Image.afterUpdate", slide);
    });
  }

  /**
   * Start zoom-in animation if possible, or simply reveal content
   * @param {Object} slide
   */
  revealContent(slide) {
    // Animate only on first run
    if (
      this.fancybox.Carousel.prevPage === null &&
      slide.index === this.fancybox.options.startIndex &&
      this.canZoom(slide)
    ) {
      this.zoomIn();
    } else {
      this.fancybox.revealContent(slide);
    }
  }

  /**
   * Get zoom info for selected slide
   * @param {Object} slide
   */
  getZoomInfo(slide) {
    const $thumb = slide.$thumb,
      thumbRect = $thumb.getBoundingClientRect(),
      thumbWidth = thumbRect.width,
      thumbHeight = thumbRect.height,
      //
      contentRect = slide.$content.getBoundingClientRect(),
      contentWidth = contentRect.width,
      contentHeight = contentRect.height,
      //
      shiftedTop = contentRect.top - thumbRect.top,
      shiftedLeft = contentRect.left - thumbRect.left;

    // Check if need to update opacity
    let opacity = this.fancybox.option("Image.zoomOpacity");

    if (opacity === "auto") {
      opacity = Math.abs(thumbWidth / thumbHeight - contentWidth / contentHeight) > 0.1;
    }

    return {
      top: shiftedTop,
      left: shiftedLeft,
      scale: contentWidth && thumbWidth ? thumbWidth / contentWidth : 1,
      opacity: opacity,
    };
  }

  /**
   * Determine if it is possible to do zoom-in animation
   */
  canZoom(slide) {
    const fancybox = this.fancybox,
      $container = fancybox.$container;

    if (window.visualViewport && window.visualViewport.scale !== 1) {
      return false;
    }

    if (slide.Panzoom && !slide.Panzoom.content.width) {
      return false;
    }

    if (!fancybox.option("Image.zoom") || fancybox.option("Image.fit") !== "contain") {
      return false;
    }

    const $thumb = slide.$thumb;

    if (!$thumb || slide.state === "loading") {
      return false;
    }

    // * Check if thumbnail image is really visible
    $container.classList.add("fancybox__no-click");

    const rect = $thumb.getBoundingClientRect();

    let rez;

    // Check if thumbnail image is actually visible on the screen
    if (this.fancybox.option("Image.ignoreCoveredThumbnail")) {
      const visibleTopLeft = document.elementFromPoint(rect.left + 1, rect.top + 1) === $thumb;
      const visibleBottomRight = document.elementFromPoint(rect.right - 1, rect.bottom - 1) === $thumb;

      rez = visibleTopLeft && visibleBottomRight;
    } else {
      rez = document.elementFromPoint(rect.left + rect.width * 0.5, rect.top + rect.height * 0.5) === $thumb;
    }

    $container.classList.remove("fancybox__no-click");

    return rez;
  }

  /**
   * Perform zoom-in animation
   */
  zoomIn() {
    const fancybox = this.fancybox,
      slide = fancybox.getSlide(),
      Panzoom = slide.Panzoom;

    const { top, left, scale, opacity } = this.getZoomInfo(slide);

    fancybox.trigger("reveal", slide);

    // Scale and move to start position
    Panzoom.panTo({
      x: left * -1,
      y: top * -1,
      scale: scale,
      friction: 0,
      ignoreBounds: true,
    });

    slide.$content.style.visibility = "";

    slide.state = "zoomIn";

    if (opacity === true) {
      Panzoom.on("afterTransform", (panzoom) => {
        if (slide.state === "zoomIn" || slide.state === "zoomOut") {
          panzoom.$content.style.opacity = Math.min(1, 1 - (1 - panzoom.content.scale) / (1 - scale));
        }
      });
    }

    // Animate back to original position
    Panzoom.panTo({
      x: 0,
      y: 0,
      scale: 1,
      friction: this.fancybox.option("Image.zoomFriction"),
    });
  }

  /**
   * Perform zoom-out animation
   */
  zoomOut() {
    const fancybox = this.fancybox,
      slide = fancybox.getSlide(),
      Panzoom = slide.Panzoom;

    if (!Panzoom) {
      return;
    }

    slide.state = "zoomOut";
    fancybox.state = "customClosing";

    if (slide.$caption) {
      slide.$caption.style.visibility = "hidden";
    }

    let friction = this.fancybox.option("Image.zoomFriction");

    const animatePosition = (event) => {
      const { top, left, scale, opacity } = this.getZoomInfo(slide);

      // Increase speed on the first run if opacity is not animated
      if (!event && !opacity) {
        friction *= 0.82;
      }

      Panzoom.panTo({
        x: left * -1,
        y: top * -1,
        scale,
        friction,
        ignoreBounds: true,
      });

      // Gradually increase speed
      friction *= 0.98;
    };

    // Page scrolling will cause thumbnail to change position on the display,
    // therefore animation end position has to be recalculated after each page scroll
    window.addEventListener("scroll", animatePosition);

    Panzoom.once("endAnimation", () => {
      window.removeEventListener("scroll", animatePosition);
      fancybox.destroy();
    });

    animatePosition();
  }

  /**
   * Set the type of mouse cursor to indicate if content is zoomable
   * @param {Object} slide
   */
  handleCursor(slide) {
    if (slide.type !== "image" || !slide.$el) {
      return;
    }

    const panzoom = slide.Panzoom;
    const clickAction = this.fancybox.option("Image.click", false, slide);
    const touchIsEnabled = this.fancybox.option("Image.touch");

    const classList = slide.$el.classList;

    const zoomInClass = this.fancybox.option("Image.canZoomInClass");
    const zoomOutClass = this.fancybox.option("Image.canZoomOutClass");

    classList.remove(zoomOutClass);
    classList.remove(zoomInClass);

    if (panzoom && clickAction === "toggleZoom") {
      const canZoomIn =
        panzoom && panzoom.content.scale === 1 && panzoom.option("maxScale") - panzoom.content.scale > 0.01;

      if (canZoomIn) {
        classList.add(zoomInClass);
      } else if (panzoom.content.scale > 1 && !touchIsEnabled) {
        classList.add(zoomOutClass);
      }
    } else if (clickAction === "close") {
      classList.add(zoomOutClass);
    }
  }

  /**
   * Handle `wheel` event
   * @param {Object} slide
   * @param {Object} event
   */
  onWheel(slide, event) {
    if (this.fancybox.state !== "ready") {
      return;
    }

    if (this.fancybox.trigger("Image.wheel", event) === false) {
      return;
    }

    switch (this.fancybox.option("Image.wheel")) {
      case "zoom":
        if (slide.state === "done") {
          slide.Panzoom && slide.Panzoom.zoomWithWheel(event);
        }

        break;

      case "close":
        this.fancybox.close();

        break;

      case "slide":
        this.fancybox[event.deltaY < 0 ? "prev" : "next"]();

        break;
    }
  }

  /**
   * Handle `click` and `dblclick` events
   * @param {Object} slide
   * @param {Object} event
   */
  onClick(slide, event) {
    // Check that clicks should be allowed
    if (this.fancybox.state !== "ready") {
      return;
    }

    const panzoom = slide.Panzoom;

    if (
      panzoom &&
      (panzoom.dragPosition.midPoint ||
        panzoom.dragOffset.x !== 0 ||
        panzoom.dragOffset.y !== 0 ||
        panzoom.dragOffset.scale !== 1)
    ) {
      return;
    }

    if (this.fancybox.Carousel.Panzoom.lockAxis) {
      return false;
    }

    const process = (action) => {
      switch (action) {
        case "toggleZoom":
          event.stopPropagation();

          slide.Panzoom && slide.Panzoom.zoomWithClick(event);

          break;

        case "close":
          this.fancybox.close();

          break;

        case "next":
          event.stopPropagation();

          this.fancybox.next();

          break;
      }
    };

    const clickAction = this.fancybox.option("Image.click");
    const dblclickAction = this.fancybox.option("Image.doubleClick");

    if (dblclickAction) {
      if (this.clickTimer) {
        clearTimeout(this.clickTimer);
        this.clickTimer = null;

        process(dblclickAction);
      } else {
        this.clickTimer = setTimeout(() => {
          this.clickTimer = null;
          process(clickAction);
        }, 300);
      }
    } else {
      process(clickAction);
    }
  }

  /**
   * Handle `Carousel.change` event to reset zoom level for any zoomed in/out content
   * and to revel content of the current page
   * @param {Object} fancybox
   * @param {Object} carousel
   */
  onPageChange(fancybox, carousel) {
    const currSlide = fancybox.getSlide();

    carousel.slides.forEach((slide) => {
      if (!slide.Panzoom || slide.state !== "done") {
        return;
      }

      if (slide.index !== currSlide.index) {
        slide.Panzoom.panTo({
          x: 0,
          y: 0,
          scale: 1,
          friction: 0.8,
        });
      }
    });
  }

  attach() {
    this.fancybox.on(this.events);
  }

  detach() {
    this.fancybox.off(this.events);
  }
}

// Expose defaults
Image.defaults = defaults$7;class Hash {
  constructor(fancybox) {
    this.fancybox = fancybox;

    for (const methodName of ["onChange", "onClosing"]) {
      this[methodName] = this[methodName].bind(this);
    }

    this.events = {
      initCarousel: this.onChange,
      "Carousel.change": this.onChange,
      closing: this.onClosing,
    };

    this.hasCreatedHistory = false;
    this.origHash = "";
    this.timer = null;
  }

  /**
   * Process `Carousel.ready` and `Carousel.change` events to update URL hash
   * @param {Object} fancybox
   * @param {Object} carousel
   */
  onChange(fancybox) {
    const carousel = fancybox.Carousel;

    if (this.timer) {
      clearTimeout(this.timer);
    }

    const firstRun = carousel.prevPage === null;
    const currentSlide = fancybox.getSlide();

    const currentHash = new URL(document.URL).hash;

    let newHash = false;

    if (currentSlide.slug) {
      newHash = "#" + currentSlide.slug;
    } else {
      const dataset = currentSlide.$trigger && currentSlide.$trigger.dataset;
      const slug = fancybox.option("slug") || (dataset && dataset.fancybox);

      if (slug && slug.length && slug !== "true") {
        newHash = "#" + slug + (carousel.slides.length > 1 ? "-" + (currentSlide.index + 1) : "");
      }
    }

    if (firstRun) {
      this.origHash = currentHash !== newHash ? currentHash : "";
    }

    if (newHash && currentHash !== newHash) {
      this.timer = setTimeout(() => {
        try {
          window.history[firstRun ? "pushState" : "replaceState"](
            {},
            document.title,
            window.location.pathname + window.location.search + newHash
          );

          if (firstRun) {
            this.hasCreatedHistory = true;
          }
        } catch (e) {}
      }, 300);
    }
  }

  /**
   * Process `closing` event to clean up
   */
  onClosing() {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    // Skip if closing is triggered by pressing  browser back button or by changing hash manually
    if (this.hasSilentClose === true) {
      return;
    }

    // Restore original url
    try {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search + (this.origHash || "")
      );

      return;
    } catch (e) {}
  }

  attach(fancybox) {
    fancybox.on(this.events);
  }

  detach(fancybox) {
    fancybox.off(this.events);
  }

  /**
   * Start fancybox from current URL hash,
   * this will be called on page load OR/AND after changing URL hash
   * @param {Class} Fancybox
   */
  static startFromUrl() {
    const Fancybox = Hash.Fancybox;

    if (!Fancybox || Fancybox.getInstance() || Fancybox.defaults.Hash === false) {
      return;
    }

    const { hash, slug, index } = Hash.getParsedURL();

    if (!slug) {
      return;
    }

    // Support custom slug
    // ===
    let selectedElem = document.querySelector(`[data-slug="${hash}"]`);

    if (selectedElem) {
      selectedElem.dispatchEvent(new CustomEvent("click", { bubbles: true, cancelable: true }));
    }

    if (Fancybox.getInstance()) {
      return;
    }

    // If elements are not found by custom slug, use URL hash value as group name
    // ===
    const groupElems = document.querySelectorAll(`[data-fancybox="${slug}"]`);

    if (!groupElems.length) {
      return;
    }

    if (index === null && groupElems.length === 1) {
      selectedElem = groupElems[0];
    } else if (index) {
      selectedElem = groupElems[index - 1];
    }

    if (selectedElem) {
      selectedElem.dispatchEvent(new CustomEvent("click", { bubbles: true, cancelable: true }));
    }
  }

  /**
   * Handle `hash` change, change gallery item to current index or start/close current instance
   */
  static onHashChange() {
    const { slug, index } = Hash.getParsedURL();

    const Fancybox = Hash.Fancybox;
    const instance = Fancybox && Fancybox.getInstance();

    if (instance && instance.plugins.Hash) {
      // Check if hash matches currently active gallery
      if (slug) {
        const carousel = instance.Carousel;

        /**
         * Support manually opened gallery
         */
        if (slug === instance.option("slug")) {
          return carousel.slideTo(index - 1);
        }

        /**
         * Check if URL hash matches `data-slug` value of active element
         */
        for (let slide of carousel.slides) {
          if (slide.slug && slide.slug === slug) {
            return carousel.slideTo(slide.index);
          }
        }

        /**
         * Check if URL hash matches `data-fancybox` value of active element
         */
        const slide = instance.getSlide();
        const dataset = slide.$trigger && slide.$trigger.dataset;

        if (dataset && dataset.fancybox === slug) {
          return carousel.slideTo(index - 1);
        }
      }

      /**
       * Close if no matching element found
       */
      instance.plugins.Hash.hasSilentClose = true;

      instance.close();
    }

    /**
     * Attempt to start
     */
    Hash.startFromUrl();
  }

  /**
   * Add event bindings that will start new Fancybox instance based in the current URL
   */
  static create(Fancybox) {
    Hash.Fancybox = Fancybox;

    function proceed() {
      window.addEventListener("hashchange", Hash.onHashChange, false);

      Hash.startFromUrl();
    }

    if (canUseDOM) {
      window.requestAnimationFrame(() => {
        if (/complete|interactive|loaded/.test(document.readyState)) {
          proceed();
        } else {
          document.addEventListener("DOMContentLoaded", proceed);
        }
      });
    }
  }

  static destroy() {
    window.removeEventListener("hashchange", Hash.onHashChange, false);
  }

  /**
   * Helper method to split URL hash into useful pieces
   */
  static getParsedURL() {
    const hash = window.location.hash.substr(1),
      tmp = hash.split("-"),
      index = tmp.length > 1 && /^\+?\d+$/.test(tmp[tmp.length - 1]) ? parseInt(tmp.pop(-1), 10) || null : null,
      slug = tmp.join("-");

    return {
      hash,
      slug,
      index,
    };
  }
}const Fullscreen = {
  pageXOffset: 0,
  pageYOffset: 0,

  element() {
    return document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement;
  },

  activate(element) {
    Fullscreen.pageXOffset = window.pageXOffset;
    Fullscreen.pageYOffset = window.pageYOffset;

    if (element.requestFullscreen) {
      element.requestFullscreen(); // W3C spec
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen(); // Firefox
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen(); // Safari
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen(); // IE/Edge
    }
  },

  deactivate() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  },
};class Slideshow {
  constructor(fancybox) {
    this.fancybox = fancybox;
    this.active = false;

    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  isActive() {
    return this.active;
  }

  setTimer() {
    if (!this.active || this.timer) {
      return;
    }

    const delay = this.fancybox.option("slideshow.delay", 3000);

    this.timer = setTimeout(() => {
      this.timer = null;

      if (
        !this.fancybox.option("infinite") &&
        this.fancybox.getSlide().index === this.fancybox.Carousel.slides.length - 1
      ) {
        this.fancybox.jumpTo(0, { friction: 0 });
      } else {
        this.fancybox.next();
      }
    }, delay);

    let $progress = this.$progress;

    if (!$progress) {
      $progress = document.createElement("div");
      $progress.classList.add("fancybox__progress");

      this.fancybox.$carousel.parentNode.insertBefore($progress, this.fancybox.$carousel);

      this.$progress = $progress;

      $progress.offsetHeight; /* trigger reflow */
    }

    $progress.style.transitionDuration = `${delay}ms`;
    $progress.style.transform = "scaleX(1)";
  }

  clearTimer() {
    clearTimeout(this.timer);
    this.timer = null;

    if (this.$progress) {
      this.$progress.style.transitionDuration = "";
      this.$progress.style.transform = "";

      this.$progress.offsetHeight; /* trigger reflow */
    }
  }

  activate() {
    if (this.active) {
      return;
    }

    this.active = true;
    this.fancybox.$container.classList.add("has-slideshow");

    if (this.fancybox.getSlide().state === "done") {
      this.setTimer();
    }

    document.addEventListener("visibilitychange", this.handleVisibilityChange, false);
  }

  handleVisibilityChange() {
    this.deactivate();
  }

  deactivate() {
    this.active = false;

    this.clearTimer();

    this.fancybox.$container.classList.remove("has-slideshow");

    document.removeEventListener("visibilitychange", this.handleVisibilityChange, false);
  }

  toggle() {
    if (this.active) {
      this.deactivate();
    } else if (this.fancybox.Carousel.slides.length > 1) {
      this.activate();
    }
  }
}const defaults$8 = {
  // What toolbar items to display
  display: [
    "counter",
    //"prev",
    //"next",
    //"download",
    "zoom",
    "slideshow",
    "fullscreen",
    "thumbs",
    "close",
  ],

  // Only create a toolbar item if there is at least one image in the group
  autoEnable: true,

  // Toolbar items; can be links, buttons or `div` elements
  items: {
    counter: {
      position: "left",
      type: "div",
      class: "fancybox__counter",
      html: '<span data-fancybox-index=""></span>&nbsp;/&nbsp;<span data-fancybox-count=""></span>',
      attr: { tabindex: -1 },
    },
    prev: {
      type: "button",
      class: "fancybox__button--prev",
      label: "PREV",
      html: '<svg viewBox="0 0 24 24"><path d="M15 4l-8 8 8 8"/></svg>',
      attr: { "data-fancybox-prev": "" },
    },
    next: {
      type: "button",
      class: "fancybox__button--next",
      label: "NEXT",
      html: '<svg viewBox="0 0 24 24"><path d="M8 4l8 8-8 8"/></svg>',
      attr: { "data-fancybox-next": "" },
    },
    fullscreen: {
      type: "button",
      class: "fancybox__button--fullscreen",
      label: "TOGGLE_FULLSCREEN",
      html: `<svg viewBox="0 0 24 24">
                <g><path d="M3 8 V3h5"></path><path d="M21 8V3h-5"></path><path d="M8 21H3v-5"></path><path d="M16 21h5v-5"></path></g>
                <g><path d="M7 2v5H2M17 2v5h5M2 17h5v5M22 17h-5v5"/></g>
            </svg>`,
      click: function (event) {
        event.preventDefault();

        if (Fullscreen.element()) {
          Fullscreen.deactivate();
        } else {
          Fullscreen.activate(this.fancybox.$container);
        }
      },
    },
    slideshow: {
      type: "button",
      class: "fancybox__button--slideshow",
      label: "TOGGLE_SLIDESHOW",
      html: `<svg viewBox="0 0 24 24">
                <g><path d="M6 4v16"/><path d="M20 12L6 20"/><path d="M20 12L6 4"/></g>
                <g><path d="M7 4v15M17 4v15"/></g>
            </svg>`,
      click: function (event) {
        event.preventDefault();

        this.Slideshow.toggle();
      },
    },
    zoom: {
      type: "button",
      class: "fancybox__button--zoom",
      label: "TOGGLE_ZOOM",
      html: '<svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7"></circle><path d="M16 16 L21 21"></svg>',
      click: function (event) {
        event.preventDefault();

        const panzoom = this.fancybox.getSlide().Panzoom;

        if (panzoom) {
          panzoom.toggleZoom();
        }
      },
    },
    download: {
      type: "link",
      label: "DOWNLOAD",
      class: "fancybox__button--download",
      html: '<svg viewBox="0 0 24 24"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.62 2.48A2 2 0 004.56 21h14.88a2 2 0 001.94-1.51L22 17"/></svg>',
      click: function (event) {
        event.stopPropagation();
      },
    },
    thumbs: {
      type: "button",
      label: "TOGGLE_THUMBS",
      class: "fancybox__button--thumbs",
      html: '<svg viewBox="0 0 24 24"><circle cx="4" cy="4" r="1" /><circle cx="12" cy="4" r="1" transform="rotate(90 12 4)"/><circle cx="20" cy="4" r="1" transform="rotate(90 20 4)"/><circle cx="4" cy="12" r="1" transform="rotate(90 4 12)"/><circle cx="12" cy="12" r="1" transform="rotate(90 12 12)"/><circle cx="20" cy="12" r="1" transform="rotate(90 20 12)"/><circle cx="4" cy="20" r="1" transform="rotate(90 4 20)"/><circle cx="12" cy="20" r="1" transform="rotate(90 12 20)"/><circle cx="20" cy="20" r="1" transform="rotate(90 20 20)"/></svg>',
      click: function (event) {
        event.stopPropagation();

        const thumbs = this.fancybox.plugins.Thumbs;

        if (thumbs) {
          thumbs.toggle();
        }
      },
    },
    close: {
      type: "button",
      label: "CLOSE",
      class: "fancybox__button--close",
      html: '<svg viewBox="0 0 24 24"><path d="M20 20L4 4m16 0L4 20"></path></svg>',
      attr: { "data-fancybox-close": "", tabindex: 0 },
    },
  },
};

class Toolbar {
  constructor(fancybox) {
    this.fancybox = fancybox;

    this.$container = null;
    this.state = "init";

    for (const methodName of [
      "onInit",
      "onPrepare",
      "onDone",
      "onKeydown",
      "onClosing",
      "onChange",
      "onSettle",
      "onRefresh",
    ]) {
      this[methodName] = this[methodName].bind(this);
    }

    this.events = {
      init: this.onInit,
      prepare: this.onPrepare,
      done: this.onDone,
      keydown: this.onKeydown,
      closing: this.onClosing,

      // Clear Slideshow when user strts to change current slide
      "Carousel.change": this.onChange,

      // Set timer after carousel changes current slide; deactive if last slide is reached
      "Carousel.settle": this.onSettle,

      // Deactivate Slideshow on user interaction
      "Carousel.Panzoom.touchStart": () => this.onRefresh(),

      "Image.startAnimation": (fancybox, slide) => this.onRefresh(slide),
      "Image.afterUpdate": (fancybox, slide) => this.onRefresh(slide),
    };
  }

  onInit() {
    // Disable self if current group does not contain at least one image
    if (this.fancybox.option("Toolbar.autoEnable")) {
      let hasImage = false;

      for (const item of this.fancybox.items) {
        if (item.type === "image") {
          hasImage = true;
          break;
        }
      }

      if (!hasImage) {
        this.state = "disabled";
        return;
      }
    }

    // Disable the creation of a close button, if one exists in the toolbar
    for (const key of this.fancybox.option("Toolbar.display")) {
      const id = isPlainObject(key) ? key.id : key;

      if (id === "close") {
        this.fancybox.options.closeButton = false;

        break;
      }
    }
  }

  onPrepare() {
    const fancybox = this.fancybox;
    // Skip if disabled
    if (this.state !== "init") {
      return;
    }

    this.build();

    this.update();

    this.Slideshow = new Slideshow(fancybox);

    if (!fancybox.Carousel.prevPage) {
      if (fancybox.option("slideshow.autoStart")) {
        this.Slideshow.activate();
      }

      if (fancybox.option("fullscreen.autoStart") && !Fullscreen.element()) {
        try {
          Fullscreen.activate(fancybox.$container);
        } catch (error) {}
      }
    }
  }

  onFsChange() {
    window.scrollTo(Fullscreen.pageXOffset, Fullscreen.pageYOffset);
  }

  onSettle() {
    const fancybox = this.fancybox;
    const slideshow = this.Slideshow;

    if (slideshow && slideshow.isActive()) {
      if (fancybox.getSlide().index === fancybox.Carousel.slides.length - 1 && !fancybox.option("infinite")) {
        slideshow.deactivate();
      } else if (fancybox.getSlide().state === "done") {
        slideshow.setTimer();
      }
    }
  }

  onChange() {
    this.update();

    if (this.Slideshow && this.Slideshow.isActive()) {
      this.Slideshow.clearTimer();
    }
  }

  onDone(fancybox, slide) {
    const slideshow = this.Slideshow;

    if (slide.index === fancybox.getSlide().index) {
      this.update();

      if (slideshow && slideshow.isActive()) {
        if (!fancybox.option("infinite") && slide.index === fancybox.Carousel.slides.length - 1) {
          slideshow.deactivate();
        } else {
          slideshow.setTimer();
        }
      }
    }
  }

  onRefresh(slide) {
    if (!slide || slide.index === this.fancybox.getSlide().index) {
      this.update();

      if (this.Slideshow && this.Slideshow.isActive() && (!slide || slide.state === "done")) {
        this.Slideshow.deactivate();
      }
    }
  }

  onKeydown(fancybox, key, event) {
    if (key === " " && this.Slideshow) {
      this.Slideshow.toggle();

      event.preventDefault();
    }
  }

  onClosing() {
    if (this.Slideshow) {
      this.Slideshow.deactivate();
    }

    document.removeEventListener("fullscreenchange", this.onFsChange);
  }

  /**
   * Create link, button or `div` element for the toolbar
   * @param {Object} obj
   * @returns HTMLElement
   */
  createElement(obj) {
    let $el;

    if (obj.type === "div") {
      $el = document.createElement("div");
    } else {
      $el = document.createElement(obj.type === "link" ? "a" : "button");
      $el.classList.add("carousel__button");
    }

    $el.innerHTML = obj.html;

    $el.setAttribute("tabindex", obj.tabindex || 0);

    if (obj.class) {
      $el.classList.add(...obj.class.split(" "));
    }

    for (const prop in obj.attr) {
      $el.setAttribute(prop, obj.attr[prop]);
    }

    if (obj.label) {
      $el.setAttribute("title", this.fancybox.localize(`{{${obj.label}}}`));
    }

    if (obj.click) {
      $el.addEventListener("click", obj.click.bind(this));
    }

    if (obj.id === "prev") {
      $el.setAttribute("data-fancybox-prev", "");
    }

    if (obj.id === "next") {
      $el.setAttribute("data-fancybox-next", "");
    }

    const $svg = $el.querySelector("svg");

    if ($svg) {
      $svg.setAttribute("role", "img");
      $svg.setAttribute("tabindex", "-1");
      $svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    }

    return $el;
  }

  /**
   * Create all DOM elements
   */
  build() {
    this.cleanup();

    const all_items = this.fancybox.option("Toolbar.items");
    const all_groups = [
      {
        position: "left",
        items: [],
      },
      {
        position: "center",
        items: [],
      },
      {
        position: "right",
        items: [],
      },
    ];

    const thumbs = this.fancybox.plugins.Thumbs;

    // 1st step - group toolbar elements by position
    for (const key of this.fancybox.option("Toolbar.display")) {
      let id, item;

      if (isPlainObject(key)) {
        id = key.id;
        item = extend$2({}, all_items[id], key);
      } else {
        id = key;
        item = all_items[id];
      }

      if (["counter", "next", "prev", "slideshow"].includes(id) && this.fancybox.items.length < 2) {
        continue;
      }

      if (id === "fullscreen") {
        if (!document.fullscreenEnabled || window.fullScreen) {
          continue;
        }

        document.addEventListener("fullscreenchange", this.onFsChange);
      }

      if (id === "thumbs" && (!thumbs || thumbs.state === "disabled")) {
        continue;
      }

      if (!item) {
        continue;
      }

      let position = item.position || "right";

      let group = all_groups.find((obj) => obj.position === position);

      if (group) {
        group.items.push(item);
      }
    }

    // 2st step - create DOM elements
    const $container = document.createElement("div");
    $container.classList.add("fancybox__toolbar");

    for (const group of all_groups) {
      if (group.items.length) {
        const $wrap = document.createElement("div");
        $wrap.classList.add("fancybox__toolbar__items");
        $wrap.classList.add(`fancybox__toolbar__items--${group.position}`);

        for (const obj of group.items) {
          $wrap.appendChild(this.createElement(obj));
        }

        $container.appendChild($wrap);
      }
    }

    // Add toolbar container to DOM
    this.fancybox.$carousel.parentNode.insertBefore($container, this.fancybox.$carousel);

    this.$container = $container;
  }

  /**
   * Update element state depending on index of current slide
   */
  update() {
    const slide = this.fancybox.getSlide();
    const idx = slide.index;
    const cnt = this.fancybox.items.length;

    // Download links
    // ====
    const src = slide.downloadSrc || (slide.type === "image" && !slide.error ? slide.src : null);

    for (const $el of this.fancybox.$container.querySelectorAll("a.fancybox__button--download")) {
      if (src) {
        $el.removeAttribute("disabled");
        $el.removeAttribute("tabindex");

        $el.setAttribute("href", src);
        $el.setAttribute("download", src);
        $el.setAttribute("target", "_blank");
      } else {
        $el.setAttribute("disabled", "");
        $el.setAttribute("tabindex", -1);

        $el.removeAttribute("href");
        $el.removeAttribute("download");
      }
    }

    // Zoom button
    // ===
    const panzoom = slide.Panzoom;
    const canZoom = panzoom && panzoom.option("maxScale") > panzoom.option("baseScale");

    for (const $el of this.fancybox.$container.querySelectorAll(".fancybox__button--zoom")) {
      if (canZoom) {
        $el.removeAttribute("disabled");
      } else {
        $el.setAttribute("disabled", "");
      }
    }

    // Counter
    // ====
    for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-index]")) {
      $el.innerHTML = slide.index + 1;
    }

    for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-count]")) {
      $el.innerHTML = cnt;
    }

    // Disable previous/next links if gallery is not infinite and has reached start/end
    // ===
    if (!this.fancybox.option("infinite")) {
      for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-prev]")) {
        if (idx === 0) {
          $el.setAttribute("disabled", "");
        } else {
          $el.removeAttribute("disabled");
        }
      }

      for (const $el of this.fancybox.$container.querySelectorAll("[data-fancybox-next]")) {
        if (idx === cnt - 1) {
          $el.setAttribute("disabled", "");
        } else {
          $el.removeAttribute("disabled");
        }
      }
    }
  }

  cleanup() {
    if (this.Slideshow && this.Slideshow.isActive()) {
      this.Slideshow.clearTimer();
    }

    if (this.$container) {
      this.$container.remove();
    }

    this.$container = null;
  }

  attach() {
    this.fancybox.on(this.events);
  }

  detach() {
    this.fancybox.off(this.events);

    this.cleanup();
  }
}

// Expose defaults
Toolbar.defaults = defaults$8;const Plugins$2 = {
  ScrollLock,
  Thumbs,
  Html,
  Toolbar,
  Image,
  Hash,
};var en$1 = {
  CLOSE: "Close",
  NEXT: "Next",
  PREV: "Previous",
  MODAL: "You can close this modal content with the ESC key",
  ERROR: "Something Went Wrong, Please Try Again Later",
  IMAGE_ERROR: "Image Not Found",
  ELEMENT_NOT_FOUND: "HTML Element Not Found",
  AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
  AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
  IFRAME_ERROR: "Error Loading Page",
  TOGGLE_ZOOM: "Toggle zoom level",
  TOGGLE_THUMBS: "Toggle thumbnails",
  TOGGLE_SLIDESHOW: "Toggle slideshow",
  TOGGLE_FULLSCREEN: "Toggle full-screen mode",
  DOWNLOAD: "Download",
};// Default settings
const defaults$9 = {
  // Index of active slide on the start
  startIndex: 0,

  // Number of slides to preload before and after active slide
  preload: 1,

  // Should navigation be infinite
  infinite: true,

  // Class name to be applied to the content to reveal it
  showClass: "fancybox-zoomInUp", // "fancybox-fadeIn" | "fancybox-zoomInUp" | false

  // Class name to be applied to the content to hide it
  hideClass: "fancybox-fadeOut", // "fancybox-fadeOut" | "fancybox-zoomOutDown" | false

  // Should backdrop and UI elements fade in/out on start/close
  animated: true,

  // If browser scrollbar should be hidden
  hideScrollbar: true,

  // Element containing main structure
  parentEl: null,

  // Custom class name or multiple space-separated class names for the container
  mainClass: null,

  // Set focus on first focusable element after displaying content
  autoFocus: true,

  // Trap focus inside Fancybox
  trapFocus: true,

  // Set focus back to trigger element after closing Fancybox
  placeFocusBack: true,

  // Action to take when the user clicks on the backdrop
  click: "close", // "close" | "next" | null

  // Position of the close button - over the content or at top right corner of viewport
  closeButton: "inside", // "inside" | "outside"

  // Allow user to drag content up/down to close instance
  dragToClose: true,

  // Enable keyboard navigation
  keyboard: {
    Escape: "close",
    Delete: "close",
    Backspace: "close",
    PageUp: "next",
    PageDown: "prev",
    ArrowUp: "next",
    ArrowDown: "prev",
    ArrowRight: "next",
    ArrowLeft: "prev",
  },

  // HTML templates for various elements
  template: {
    // Close button icon
    closeButton:
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg>',
    // Loading indicator icon
    spinner:
      '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="25 25 50 50" tabindex="-1"><circle cx="50" cy="50" r="20"/></svg>',

    // Main container element
    main: null,
  },

  /* Note: If the `template.main` option is not provided, the structure is generated as follows by default:
  <div class="fancybox__container" role="dialog" aria-modal="true" aria-hidden="true" aria-label="{{MODAL}}" tabindex="-1">
    <div class="fancybox__backdrop"></div>
    <div class="fancybox__carousel"></div>
  </div>
  */

  // Localization of strings
  l10n: en$1,
};

// Object that contains all active instances of Fancybox
const instances = new Map();

// Number of Fancybox instances created, it is used to generate new instance "id"
let called = 0;

class Fancybox extends Base {
  /**
   * Fancybox constructor
   * @constructs Fancybox
   * @param {Object} [options] - Options for Fancybox
   */
  constructor(items, options = {}) {
    // Quick hack to fix variable naming collision
    items = items.map((item) => {
      if (item.width) item._width = item.width;
      if (item.height) item._height = item.height;

      return item;
    });

    super(extend$2(true, {}, defaults$9, options));

    this.bindHandlers();

    this.state = "init";

    this.setItems(items);

    this.attachPlugins(Fancybox.Plugins);

    // "init" event marks the start of initialization and is available to plugins
    this.trigger("init");

    if (this.option("hideScrollbar") === true) {
      this.hideScrollbar();
    }

    this.initLayout();

    this.initCarousel();

    this.attachEvents();

    instances.set(this.id, this);

    // "prepare" event will trigger the creation of additional layout elements, such as thumbnails and toolbar
    this.trigger("prepare");

    this.state = "ready";

    // "ready" event will trigger the content to load
    this.trigger("ready");

    // Reveal container
    this.$container.setAttribute("aria-hidden", "false");

    // Set focus on the first focusable element inside this instance
    if (this.option("trapFocus")) {
      this.focus();
    }
  }

  /**
   * Override `option` method to get value from the current slide
   * @param {String} name option name
   * @param  {...any} rest optional extra parameters
   * @returns {any}
   */
  option(name, ...rest) {
    const slide = this.getSlide();
    const value = slide ? slide[name] : undefined;

    if (value !== undefined) {
      if (typeof value === "function") {
        value = value.call(this, this, ...rest);
      }

      return value;
    }

    return super.option(name, ...rest);
  }

  /**
   * Bind event handlers for referencability
   */
  bindHandlers() {
    for (const methodName of [
      "onMousedown",
      "onKeydown",
      "onClick",

      "onFocus",

      "onCreateSlide",
      "onSettle",

      "onTouchMove",
      "onTouchEnd",

      "onTransform",
    ]) {
      this[methodName] = this[methodName].bind(this);
    }
  }

  /**
   * Set up a functions that will be called whenever the specified event is delivered
   */
  attachEvents() {
    document.addEventListener("mousedown", this.onMousedown);
    document.addEventListener("keydown", this.onKeydown, true);

    // Trap keyboard focus inside of the modal
    if (this.option("trapFocus")) {
      document.addEventListener("focus", this.onFocus, true);
    }

    this.$container.addEventListener("click", this.onClick);
  }

  /**
   * Removes previously registered event listeners
   */
  detachEvents() {
    document.removeEventListener("mousedown", this.onMousedown);
    document.removeEventListener("keydown", this.onKeydown, true);

    document.removeEventListener("focus", this.onFocus, true);

    this.$container.removeEventListener("click", this.onClick);
  }

  /**
   * Initialize layout; create main container, backdrop nd layout for main carousel
   */
  initLayout() {
    this.$root = this.option("parentEl") || document.body;

    // Container
    let mainTemplate = this.option("template.main");

    if (mainTemplate) {
      this.$root.insertAdjacentHTML("beforeend", this.localize(mainTemplate));

      this.$container = this.$root.querySelector(".fancybox__container");
    }

    if (!this.$container) {
      this.$container = document.createElement("div");
      this.$root.appendChild(this.$container);
    }

    // Normally we would not need this, but Safari does not support `preventScroll:false` option for `focus` method
    // and that causes layout issues
    this.$container.onscroll = () => {
      this.$container.scrollLeft = 0;
      return false;
    };

    Object.entries({
      class: "fancybox__container",
      role: "dialog",
      tabIndex: "-1",
      "aria-modal": "true",
      "aria-hidden": "true",
      "aria-label": this.localize("{{MODAL}}"),
    }).forEach((args) => this.$container.setAttribute(...args));

    if (this.option("animated")) {
      this.$container.classList.add("is-animated");
    }

    // Backdrop
    this.$backdrop = this.$container.querySelector(".fancybox__backdrop");

    if (!this.$backdrop) {
      this.$backdrop = document.createElement("div");
      this.$backdrop.classList.add("fancybox__backdrop");

      this.$container.appendChild(this.$backdrop);
    }

    // Carousel
    this.$carousel = this.$container.querySelector(".fancybox__carousel");

    if (!this.$carousel) {
      this.$carousel = document.createElement("div");
      this.$carousel.classList.add("fancybox__carousel");

      this.$container.appendChild(this.$carousel);
    }

    // Make instance reference accessible
    this.$container.Fancybox = this;

    // Make sure the container has an ID
    this.id = this.$container.getAttribute("id");

    if (!this.id) {
      this.id = this.options.id || ++called;
      this.$container.setAttribute("id", "fancybox-" + this.id);
    }

    // Add custom class name to main element
    const mainClass = this.option("mainClass");

    if (mainClass) {
      this.$container.classList.add(...mainClass.split(" "));
    }

    // Add class name for <html> element
    document.documentElement.classList.add("with-fancybox");

    this.trigger("initLayout");

    return this;
  }

  /**
   * Prepares slides for the corousel
   * @returns {Array} Slides
   */
  setItems(items) {
    const slides = [];

    for (const slide of items) {
      const $trigger = slide.$trigger;

      if ($trigger) {
        const dataset = $trigger.dataset || {};

        slide.src = dataset.src || $trigger.getAttribute("href") || slide.src;
        slide.type = dataset.type || slide.type;

        // Support items without `src`, e.g., when `data-fancybox` attribute added directly to `<img>` element
        if (!slide.src && $trigger instanceof HTMLImageElement) {
          slide.src = $trigger.currentSrc || slide.$trigger.src;
        }
      }

      // Check for thumbnail element
      let $thumb = slide.$thumb;

      if (!$thumb) {
        let origTarget = slide.$trigger && slide.$trigger.origTarget;

        if (origTarget) {
          if (origTarget instanceof HTMLImageElement) {
            $thumb = origTarget;
          } else {
            $thumb = origTarget.querySelector("img:not([aria-hidden])");
          }
        }

        if (!$thumb && slide.$trigger) {
          $thumb =
            slide.$trigger instanceof HTMLImageElement
              ? slide.$trigger
              : slide.$trigger.querySelector("img:not([aria-hidden])");
        }
      }

      slide.$thumb = $thumb || null;

      // Get thumbnail image source
      let thumb = slide.thumb;

      if (!thumb && $thumb) {
        thumb = $thumb.currentSrc || $thumb.src;

        if (!thumb && $thumb.dataset) {
          thumb = $thumb.dataset.lazySrc || $thumb.dataset.src;
        }
      }

      // Assume we have image, then use it as thumbnail
      if (!thumb && slide.type === "image") {
        thumb = slide.src;
      }

      slide.thumb = thumb || null;

      // Add empty caption to make things simpler
      slide.caption = slide.caption || "";

      slides.push(slide);
    }

    this.items = slides;
  }

  /**
   * Initialize main Carousel that will be used to display the content
   * @param {Array} slides
   */
  initCarousel() {
    this.Carousel = new Carousel(
      this.$carousel,
      extend$2(
        true,
        {},
        {
          prefix: "",

          classNames: {
            viewport: "fancybox__viewport",
            track: "fancybox__track",
            slide: "fancybox__slide",
          },

          textSelection: true,
          preload: this.option("preload"),

          friction: 0.88,

          slides: this.items,
          initialPage: this.options.startIndex,
          slidesPerPage: 1,

          infiniteX: this.option("infinite"),
          infiniteY: true,

          l10n: this.option("l10n"),

          Dots: false,
          Navigation: {
            classNames: {
              main: "fancybox__nav",
              button: "carousel__button",

              next: "is-next",
              prev: "is-prev",
            },
          },

          Panzoom: {
            textSelection: true,

            panOnlyZoomed: () => {
              return (
                this.Carousel && this.Carousel.pages && this.Carousel.pages.length < 2 && !this.option("dragToClose")
              );
            },

            lockAxis: () => {
              if (this.Carousel) {
                let rez = "x";

                if (this.option("dragToClose")) {
                  rez += "y";
                }

                return rez;
              }
            },
          },

          on: {
            "*": (name, ...details) => this.trigger(`Carousel.${name}`, ...details),
            init: (carousel) => (this.Carousel = carousel),
            createSlide: this.onCreateSlide,
            settle: this.onSettle,
          },
        },

        this.option("Carousel")
      )
    );

    if (this.option("dragToClose")) {
      this.Carousel.Panzoom.on({
        // Stop further touch event handling if content is scaled
        touchMove: this.onTouchMove,

        // Update backdrop opacity depending on vertical distance
        afterTransform: this.onTransform,

        // Close instance if drag distance exceeds limit
        touchEnd: this.onTouchEnd,
      });
    }

    this.trigger("initCarousel");

    return this;
  }

  /**
   * Process `createSlide` event to create caption element inside new slide
   */
  onCreateSlide(carousel, slide) {
    let caption = slide.caption || "";

    if (typeof this.options.caption === "function") {
      caption = this.options.caption.call(this, this, this.Carousel, slide);
    }

    if (typeof caption === "string" && caption.length) {
      const $caption = document.createElement("div");
      const id = `fancybox__caption_${this.id}_${slide.index}`;

      $caption.className = "fancybox__caption";
      $caption.innerHTML = caption;
      $caption.setAttribute("id", id);

      slide.$caption = slide.$el.appendChild($caption);

      slide.$el.classList.add("has-caption");
      slide.$el.setAttribute("aria-labelledby", id);
    }
  }

  /**
   * Handle Carousel `settle` event
   */
  onSettle() {
    if (this.option("autoFocus")) {
      this.focus();
    }
  }

  /**
   * Handle focus event
   * @param {Event} event - Focus event
   */
  onFocus(event) {
    this.focus(event);
  }

  /**
   * Handle click event on the container
   * @param {Event} event - Click event
   */
  onClick(event) {
    if (event.defaultPrevented) {
      return;
    }

    let eventTarget = event.target;

    if (eventTarget.matches("[data-fancybox-close]")) {
      event.preventDefault();
      Fancybox.close(false, event);

      return;
    }

    if (eventTarget.matches("[data-fancybox-next]")) {
      event.preventDefault();
      Fancybox.next();

      return;
    }

    if (eventTarget.matches("[data-fancybox-prev]")) {
      event.preventDefault();
      Fancybox.prev();

      return;
    }

    // Skip if clicked inside content area
    const content_class = ".fancybox__content";

    if (eventTarget.closest(content_class)) {
      if (eventTarget.matches(content_class)) {
        document.activeElement.blur();
      }

      return;
    }

    // Skip if text is selected
    if (getSelection().toString().length) {
      return;
    }

    if (this.trigger("click", event) === false) {
      return;
    }

    const action = this.option("click");

    switch (action) {
      case "close":
        this.close();
        break;
      case "next":
        this.next();
        break;
    }
  }

  /**
   * Handle panzoom `touchMove` event; Disable dragging if content of current slide is scaled
   */
  onTouchMove() {
    const panzoom = this.getSlide().Panzoom;

    return panzoom && panzoom.content.scale !== 1 ? false : true;
  }

  /**
   * Handle panzoom `touchEnd` event; close when quick flick up/down is detected
   * @param {Object} panzoom - Panzoom instance
   */
  onTouchEnd(panzoom) {
    const distanceY = panzoom.dragOffset.y;

    if (Math.abs(distanceY) >= 150 || (Math.abs(distanceY) >= 35 && panzoom.dragOffset.time < 350)) {
      if (this.option("hideClass")) {
        this.getSlide().hideClass = `fancybox-throwOut${panzoom.content.y < 0 ? "Up" : "Down"}`;
      }

      this.close();
    } else if (panzoom.lockAxis === "y") {
      panzoom.panTo({ y: 0 });
    }
  }

  /**
   * Handle `afterTransform` event; change backdrop opacity based on current y position of panzoom
   * @param {Object} panzoom - Panzoom instance
   */
  onTransform(panzoom) {
    const $backdrop = this.$backdrop;

    if ($backdrop) {
      const yPos = Math.abs(panzoom.content.y);
      const opacity = yPos < 1 ? "" : Math.max(0.33, Math.min(1, 1 - (yPos / panzoom.content.fitHeight) * 1.5));

      this.$container.style.setProperty("--fancybox-ts", opacity ? "0s" : "");
      this.$container.style.setProperty("--fancybox-opacity", opacity);
    }
  }

  /**
   * Handle `mousedown` event to mark that the mouse is in use
   */
  onMousedown() {
    if (this.state === "ready") {
      document.body.classList.add("is-using-mouse");
    }
  }

  /**
   * Handle `keydown` event; trap focus
   * @param {Event} event Keydown event
   */
  onKeydown(event) {
    if (Fancybox.getInstance().id !== this.id) {
      return;
    }

    document.body.classList.remove("is-using-mouse");

    const key = event.key;
    const keyboard = this.option("keyboard");

    if (!keyboard || event.ctrlKey || event.altKey || event.shiftKey) {
      return;
    }

    const classList = document.activeElement && document.activeElement.classList;
    const isUIElement = classList && classList.contains("carousel__button");

    // Allow to close using Escape button
    if (key !== "Escape" && !isUIElement) {
      let ignoreElements =
        event.target.isContentEditable ||
        ["BUTTON", "TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(event.target.nodeName) !== -1;

      if (ignoreElements) {
        return;
      }
    }

    if (this.trigger("keydown", key, event) === false) {
      return;
    }

    const action = keyboard[key];

    if (typeof this[action] === "function") {
      this[action]();
    }
  }

  /**
   * Get the active slide. This will be the first slide from the current page of the main carousel.
   */
  getSlide() {
    const carousel = this.Carousel;

    if (!carousel) return null;

    const page = carousel.page === null ? carousel.option("initialPage") : carousel.page;
    const pages = carousel.pages || [];

    if (pages.length && pages[page]) {
      return pages[page].slides[0];
    }

    return null;
  }

  /**
   * Place focus on the first focusable element inside current slide
   * @param {Event} [event] - Focus event
   */
  focus(event) {
    if (Fancybox.ignoreFocusChange) {
      return;
    }

    if (["init", "closing", "customClosing", "destroy"].indexOf(this.state) > -1) {
      return;
    }

    if (event) {
      event.preventDefault();
    }

    Fancybox.ignoreFocusChange = true;

    const $container = this.$container;
    const currentSlide = this.getSlide();
    const $currentSlide = currentSlide.state === "done" ? currentSlide.$el : null;

    const allFocusableElems = Array.from($container.querySelectorAll(FOCUSABLE_ELEMENTS));

    let enabledElems = [];
    let $firstEl;

    for (let node of allFocusableElems) {
      // Enable element if it's visible and
      // is inside the current slide or is outside main carousel (for example, inside the toolbar)
      const isNodeVisible = node.offsetParent;
      const isNodeInsideCurrentSlide = $currentSlide && $currentSlide.contains(node);
      const isNodeOutsideCarousel = !this.Carousel.$viewport.contains(node);

      if (isNodeVisible && (isNodeInsideCurrentSlide || isNodeOutsideCarousel)) {
        enabledElems.push(node);

        if (node.dataset.origTabindex !== undefined) {
          node.tabIndex = node.dataset.origTabindex;
          node.removeAttribute("data-orig-tabindex");
        }

        if (
          node.hasAttribute("autoFocus") ||
          (!$firstEl && isNodeInsideCurrentSlide && !node.classList.contains("carousel__button"))
        ) {
          $firstEl = node;
        }
      } else {
        // Element is either hidden or is inside preloaded slide (e.g., not inside current slide, but next/prev)
        node.dataset.origTabindex =
          node.dataset.origTabindex === undefined ? node.getAttribute("tabindex") : node.dataset.origTabindex;

        node.tabIndex = -1;
      }
    }

    if (!event) {
      if (this.option("autoFocus") && $firstEl) {
        setFocusOn($firstEl);
      } else if (enabledElems.indexOf(document.activeElement) < 0) {
        setFocusOn($container);
      }
    } else {
      if (enabledElems.indexOf(event.target) > -1) {
        this.lastFocus = event.target;
      } else {
        if (this.lastFocus === $container) {
          setFocusOn(enabledElems[enabledElems.length - 1]);
        } else {
          setFocusOn($container);
        }
      }
    }

    this.lastFocus = document.activeElement;

    Fancybox.ignoreFocusChange = false;
  }

  /**
   * Hide vertical page scrollbar and adjust right padding value of `body` element to prevent content from shifting
   * (otherwise the `body` element may become wider and the content may expand horizontally).
   */
  hideScrollbar() {
    if (!canUseDOM) {
      return;
    }

    const scrollbarWidth = window.innerWidth - document.documentElement.getBoundingClientRect().width;
    const id = "fancybox-style-noscroll";

    let $style = document.getElementById(id);

    if ($style) {
      return;
    }

    if (scrollbarWidth > 0) {
      $style = document.createElement("style");

      $style.id = id;
      $style.type = "text/css";
      $style.innerHTML = `.compensate-for-scrollbar {padding-right: ${scrollbarWidth}px;}`;

      document.getElementsByTagName("head")[0].appendChild($style);

      document.body.classList.add("compensate-for-scrollbar");
    }
  }

  /**
   * Stop hiding vertical page scrollbar
   */
  revealScrollbar() {
    document.body.classList.remove("compensate-for-scrollbar");

    const el = document.getElementById("fancybox-style-noscroll");

    if (el) {
      el.remove();
    }
  }

  /**
   * Remove content for given slide
   * @param {Object} slide - Carousel slide
   */
  clearContent(slide) {
    // * Clear previously added content and class name
    this.Carousel.trigger("removeSlide", slide);

    if (slide.$content) {
      slide.$content.remove();
      slide.$content = null;
    }

    if (slide.$closeButton) {
      slide.$closeButton.remove();
      slide.$closeButton = null;
    }

    if (slide._className) {
      slide.$el.classList.remove(slide._className);
    }
  }

  /**
   * Set new content for given slide
   * @param {Object} slide - Carousel slide
   * @param {HTMLElement|String} html - HTML element or string containing HTML code
   * @param {Object} [opts] - Options
   */
  setContent(slide, html, opts = {}) {
    let $content;

    const $el = slide.$el;

    if (html instanceof HTMLElement) {
      if (["img", "iframe", "video", "audio"].indexOf(html.nodeName.toLowerCase()) > -1) {
        $content = document.createElement("div");
        $content.appendChild(html);
      } else {
        $content = html;
      }
    } else {
      const $fragment = document.createRange().createContextualFragment(html);

      $content = document.createElement("div");
      $content.appendChild($fragment);
    }

    if (slide.filter && !slide.error) {
      $content = $content.querySelector(slide.filter);
    }

    if (!($content instanceof Element)) {
      this.setError(slide, "{{ELEMENT_NOT_FOUND}}");

      return;
    }

    // * Add class name indicating content type, for example `has-image`
    slide._className = `has-${opts.suffix || slide.type || "unknown"}`;

    $el.classList.add(slide._className);

    // * Set content
    $content.classList.add("fancybox__content");

    // Make sure that content is not hidden and will be visible
    if ($content.style.display === "none" || getComputedStyle($content).getPropertyValue("display") === "none") {
      $content.style.display = slide.display || this.option("defaultDisplay") || "flex";
    }

    if (slide.id) {
      $content.setAttribute("id", slide.id);
    }

    slide.$content = $content;

    $el.prepend($content);

    this.manageCloseButton(slide);

    if (slide.state !== "loading") {
      this.revealContent(slide);
    }

    return $content;
  }

  /**
   * Create close button if needed
   * @param {Object} slide
   */
  manageCloseButton(slide) {
    const position = slide.closeButton === undefined ? this.option("closeButton") : slide.closeButton;

    if (!position || (position === "top" && this.$closeButton)) {
      return;
    }

    const $btn = document.createElement("button");

    $btn.classList.add("carousel__button", "is-close");
    $btn.setAttribute("title", this.options.l10n.CLOSE);
    $btn.innerHTML = this.option("template.closeButton");

    $btn.addEventListener("click", (e) => this.close(e));

    if (position === "inside") {
      // Remove existing one to avoid scope issues
      if (slide.$closeButton) {
        slide.$closeButton.remove();
      }

      slide.$closeButton = slide.$content.appendChild($btn);
    } else {
      this.$closeButton = this.$container.insertBefore($btn, this.$container.firstChild);
    }
  }

  /**
   * Make content visible for given slide and optionally start CSS animation
   * @param {Object} slide - Carousel slide
   */
  revealContent(slide) {
    this.trigger("reveal", slide);

    slide.$content.style.visibility = "";

    // Add CSS class name that reveals content (default animation is "fadeIn")
    let showClass = false;

    if (
      !(
        slide.error ||
        slide.state === "loading" ||
        this.Carousel.prevPage !== null ||
        slide.index !== this.options.startIndex
      )
    ) {
      showClass = slide.showClass === undefined ? this.option("showClass") : slide.showClass;
    }

    if (!showClass) {
      this.done(slide);

      return;
    }

    slide.state = "animating";

    this.animateCSS(slide.$content, showClass, () => {
      this.done(slide);
    });
  }

  /**
   * Add class name to given HTML element and wait for `animationend` event to execute callback
   * @param {HTMLElement} $el
   * @param {String} className
   * @param {Function} callback - A callback to run
   */
  animateCSS($element, className, callback) {
    if ($element) {
      $element.dispatchEvent(new CustomEvent("animationend", { bubbles: true, cancelable: true }));
    }

    if (!$element || !className) {
      if (typeof callback === "function") {
        callback();
      }

      return;
    }

    const handleAnimationEnd = function (event) {
      if (event.currentTarget === this) {
        $element.removeEventListener("animationend", handleAnimationEnd);

        if (callback) {
          callback();
        }

        $element.classList.remove(className);
      }
    };

    $element.addEventListener("animationend", handleAnimationEnd);
    $element.classList.add(className);
  }

  /**
   * Mark given slide as `done`, e.g., content is loaded and displayed completely
   * @param {Object} slide - Carousel slide
   */
  done(slide) {
    slide.state = "done";

    this.trigger("done", slide);

    // Trigger focus for current slide (and ignore preloaded slides)
    const currentSlide = this.getSlide();

    if (currentSlide && slide.index === currentSlide.index && this.option("autoFocus")) {
      this.focus();
    }
  }

  /**
   * Set error message as slide content
   * @param {Object} slide - Carousel slide
   * @param {String} message - Error message, can contain HTML code and template variables
   */
  setError(slide, message) {
    slide.error = message;

    this.hideLoading(slide);
    this.clearContent(slide);

    // Create new content
    const div = document.createElement("div");
    div.classList.add("fancybox-error");
    div.innerHTML = this.localize(message || "<p>{{ERROR}}</p>");

    this.setContent(slide, div, { suffix: "error" });
  }

  /**
   * Create loading indicator inside given slide
   * @param {Object} slide - Carousel slide
   */
  showLoading(slide) {
    slide.state = "loading";

    slide.$el.classList.add("is-loading");

    let $spinner = slide.$el.querySelector(".fancybox__spinner");

    if ($spinner) {
      return;
    }

    $spinner = document.createElement("div");

    $spinner.classList.add("fancybox__spinner");
    $spinner.innerHTML = this.option("template.spinner");

    $spinner.addEventListener("click", () => {
      if (!this.Carousel.Panzoom.velocity) this.close();
    });

    slide.$el.prepend($spinner);
  }

  /**
   * Remove loading indicator from given slide
   * @param {Object} slide - Carousel slide
   */
  hideLoading(slide) {
    const $spinner = slide.$el && slide.$el.querySelector(".fancybox__spinner");

    if ($spinner) {
      $spinner.remove();

      slide.$el.classList.remove("is-loading");
    }

    if (slide.state === "loading") {
      this.trigger("load", slide);

      slide.state = "ready";
    }
  }

  /**
   * Slide carousel to next page
   */
  next() {
    const carousel = this.Carousel;

    if (carousel && carousel.pages.length > 1) {
      carousel.slideNext();
    }
  }

  /**
   * Slide carousel to previous page
   */
  prev() {
    const carousel = this.Carousel;

    if (carousel && carousel.pages.length > 1) {
      carousel.slidePrev();
    }
  }

  /**
   * Slide carousel to selected page with optional parameters
   * Examples:
   *    Fancybox.getInstance().jumpTo(2);
   *    Fancybox.getInstance().jumpTo(3, {friction: 0})
   * @param  {...any} args - Arguments for Carousel `slideTo` method
   */
  jumpTo(...args) {
    if (this.Carousel) this.Carousel.slideTo(...args);
  }

  /**
   * Start closing the current instance
   * @param {Event} [event] - Optional click event
   */
  close(event) {
    if (event) event.preventDefault();

    // First, stop further execution if this instance is already closing
    // (this can happen if, for example, user clicks close button multiple times really fast)
    if (["closing", "customClosing", "destroy"].includes(this.state)) {
      return;
    }

    // Allow callbacks and/or plugins to prevent closing
    if (this.trigger("shouldClose", event) === false) {
      return;
    }

    this.state = "closing";

    this.Carousel.Panzoom.destroy();

    this.detachEvents();

    this.trigger("closing", event);

    if (this.state === "destroy") {
      return;
    }

    // Trigger default CSS closing animation for backdrop and interface elements
    this.$container.setAttribute("aria-hidden", "true");

    this.$container.classList.add("is-closing");

    // Clear inactive slides
    const currentSlide = this.getSlide();

    this.Carousel.slides.forEach((slide) => {
      if (slide.$content && slide.index !== currentSlide.index) {
        this.Carousel.trigger("removeSlide", slide);
      }
    });

    // Start default closing animation
    if (this.state === "closing") {
      const hideClass = currentSlide.hideClass === undefined ? this.option("hideClass") : currentSlide.hideClass;

      this.animateCSS(
        currentSlide.$content,
        hideClass,
        () => {
          this.destroy();
        },
        true
      );
    }
  }

  /**
   * Clean up after closing fancybox
   */
  destroy() {
    if (this.state === "destroy") {
      return;
    }

    this.state = "destroy";

    this.trigger("destroy");

    const $trigger = this.option("placeFocusBack") ? this.getSlide().$trigger : null;

    // Destroy Carousel and then detach plugins;
    // * Note: this order allows plugins to receive `removeSlide` event
    this.Carousel.destroy();

    this.detachPlugins();

    this.Carousel = null;

    this.options = {};
    this.events = {};

    this.$container.remove();

    this.$container = this.$backdrop = this.$carousel = null;

    if ($trigger) {
      setFocusOn($trigger);
    }

    instances.delete(this.id);

    const nextInstance = Fancybox.getInstance();

    if (nextInstance) {
      nextInstance.focus();
      return;
    }

    document.documentElement.classList.remove("with-fancybox");
    document.body.classList.remove("is-using-mouse");

    this.revealScrollbar();
  }

  /**
   * Create new Fancybox instance with provided options
   * Example:
   *   Fancybox.show([{ src : 'https://lipsum.app/id/1/300x225' }]);
   * @param {Array} items - Gallery items
   * @param {Object} [options] - Optional custom options
   * @returns {Object} Fancybox instance
   */
  static show(items, options = {}) {
    return new Fancybox(items, options);
  }

  /**
   * Starts Fancybox if event target matches any opener or target is `trigger element`
   * @param {Event} event - Click event
   * @param {Object} [options] - Optional custom options
   */
  static fromEvent(event, options = {}) {
    //  Allow other scripts to prevent starting fancybox on click
    if (event.defaultPrevented) {
      return;
    }

    // Don't run if right-click
    if (event.button && event.button !== 0) {
      return;
    }

    // Ignore command/control + click
    if (event.ctrlKey || event.metaKey || event.shiftKey) {
      return;
    }

    let eventTarget = event.target;

    // Support `trigger` element, e.g., start fancybox from different DOM element, for example,
    // to have one preview image for hidden image gallery
    let triggerGroupName;

    if (
      eventTarget.matches("[data-fancybox-trigger]") ||
      (eventTarget = eventTarget.closest("[data-fancybox-trigger]"))
    ) {
      triggerGroupName = eventTarget && eventTarget.dataset && eventTarget.dataset.fancyboxTrigger;
    }

    if (triggerGroupName) {
      const triggerItems = document.querySelectorAll(`[data-fancybox="${triggerGroupName}"]`);
      const triggerIndex = parseInt(eventTarget.dataset.fancyboxIndex, 10) || 0;

      eventTarget = triggerItems.length ? triggerItems[triggerIndex] : eventTarget;
    }

    if (!eventTarget) {
      eventTarget = event.target;
    }

    // * Try to find matching openener
    let matchingOpener;
    let target;

    Array.from(Fancybox.openers.keys())
      .reverse()
      .some((opener) => {
        target = eventTarget;

        let found = false;

        try {
          if (target instanceof Element && (typeof opener === "string" || opener instanceof String)) {
            // Chain closest() to event.target to find and return the parent element,
            // regardless if clicking on the child elements (icon, label, etc)
            found = target.matches(opener) || (target = target.closest(opener));
          }
        } catch (error) {}

        if (found) {
          event.preventDefault();
          matchingOpener = opener;
          return true;
        }

        return false;
      });

    let rez = false;

    if (matchingOpener) {
      options.event = event;
      options.target = target;

      target.origTarget = event.target;

      rez = Fancybox.fromOpener(matchingOpener, options);

      // Check if the mouse is being used
      // Waiting for better browser support for `:focus-visible` -
      // https://drafts.csswg.org/selectors-4/#the-focus-visible-pseudo
      const nextInstance = Fancybox.getInstance();

      if (nextInstance && nextInstance.state === "ready" && event.detail) {
        document.body.classList.add("is-using-mouse");
      }
    }

    return rez;
  }

  /**
   * Starts Fancybox using selector
   * @param {String} opener - Valid CSS selector string
   * @param {Object} [options] - Optional custom options
   */
  static fromOpener(opener, options = {}) {
    // Callback function called once for each group element that
    // 1) converts data attributes to boolean or JSON
    // 2) removes values that could cause issues
    const mapCallback = function (el) {
      const falseValues = ["false", "0", "no", "null", "undefined"];
      const trueValues = ["true", "1", "yes"];

      const dataset = Object.assign({}, el.dataset);
      const options = {};

      for (let [key, value] of Object.entries(dataset)) {
        if (key === "fancybox") {
          continue;
        }

        if (key === "width" || key === "height") {
          options[`_${key}`] = value;
        } else if (typeof value === "string" || value instanceof String) {
          if (falseValues.indexOf(value) > -1) {
            options[key] = false;
          } else if (trueValues.indexOf(options[key]) > -1) {
            options[key] = true;
          } else {
            try {
              options[key] = JSON.parse(value);
            } catch (e) {
              options[key] = value;
            }
          }
        } else {
          options[key] = value;
        }
      }

      if (el instanceof Element) {
        options.$trigger = el;
      }

      return options;
    };

    let items = [],
      index = options.startIndex || 0,
      target = options.target || null;

    // Get options
    // ===
    options = extend$2({}, options, Fancybox.openers.get(opener));

    // Get matching nodes
    // ===
    const groupAll = options.groupAll === undefined ? false : options.groupAll;

    const groupAttr = options.groupAttr === undefined ? "data-fancybox" : options.groupAttr;
    const groupValue = groupAttr && target ? target.getAttribute(`${groupAttr}`) : "";

    if (!target || groupValue || groupAll) {
      items = [].slice.call(document.querySelectorAll(opener));
    }

    if (target && !groupAll) {
      if (groupValue) {
        items = items.filter((el) => el.getAttribute(`${groupAttr}`) === groupValue);
      } else {
        items = [target];
      }
    }

    if (!items.length) {
      return false;
    }

    // Exit if current instance is triggered from the same element
    // ===
    const currentInstance = Fancybox.getInstance();

    if (currentInstance && items.indexOf(currentInstance.options.$trigger) > -1) {
      return false;
    }

    // Start Fancybox
    // ===

    // Get index of current item in the gallery
    index = target ? items.indexOf(target) : index;

    // Convert items in a format supported by fancybox
    items = items.map(mapCallback);

    // * Create new fancybox instance
    return new Fancybox(
      items,
      extend$2({}, options, {
        startIndex: index,
        $trigger: target,
      })
    );
  }

  /**
   * Attach a click handler function that starts Fancybox to the selected items, as well as to all future matching elements.
   * @param {String} selector - Selector that should match trigger elements
   * @param {Object} [options] - Custom options
   */
  static bind(selector, options = {}) {
    function attachClickEvent() {
      document.body.addEventListener("click", Fancybox.fromEvent, false);
    }

    if (!canUseDOM) {
      return;
    }

    if (!Fancybox.openers.size) {
      if (/complete|interactive|loaded/.test(document.readyState)) {
        attachClickEvent();
      } else {
        document.addEventListener("DOMContentLoaded", attachClickEvent);
      }
    }

    Fancybox.openers.set(selector, options);
  }

  /**
   * Remove the click handler that was attached with `bind()`
   * @param {String} selector - A selector which should match the one originally passed to .bind()
   */
  static unbind(selector) {
    Fancybox.openers.delete(selector);

    if (!Fancybox.openers.size) {
      Fancybox.destroy();
    }
  }

  /**
   * Immediately destroy all instances (without closing animation) and clean up all bindings..
   */
  static destroy() {
    let fb;

    while ((fb = Fancybox.getInstance())) {
      fb.destroy();
    }

    Fancybox.openers = new Map();

    document.body.removeEventListener("click", Fancybox.fromEvent, false);
  }

  /**
   * Retrieve instance by identifier or the top most instance, if identifier is not provided
   * @param {String|Numeric} [id] - Optional instance identifier
   */
  static getInstance(id) {
    if (id) {
      return instances.get(id);
    }

    const instance = Array.from(instances.values())
      .reverse()
      .find((instance) => {
        if (!["closing", "customClosing", "destroy"].includes(instance.state)) {
          return instance;
        }

        return false;
      });

    return instance || null;
  }

  /**
   * Close all or topmost currently active instance.
   * @param {boolean} [all] - All or only topmost active instance
   * @param {any} [arguments] - Optional data
   */
  static close(all = true, args) {
    if (all) {
      for (const instance of instances.values()) {
        instance.close(args);
      }
    } else {
      const instance = Fancybox.getInstance();

      if (instance) {
        instance.close(args);
      }
    }
  }

  /**
   * Slide topmost currently active instance to next page
   */
  static next() {
    const instance = Fancybox.getInstance();

    if (instance) {
      instance.next();
    }
  }

  /**
   * Slide topmost currently active instance to previous page
   */
  static prev() {
    const instance = Fancybox.getInstance();

    if (instance) {
      instance.prev();
    }
  }
}

// Expose version
Fancybox.version = "__VERSION__";

// Expose defaults
Fancybox.defaults = defaults$9;

// Expose openers
Fancybox.openers = new Map();

// Add default plugins
Fancybox.Plugins = Plugins$2;

// Auto init with default options
Fancybox.bind("[data-fancybox]");

// Prepare plugins
for (const [key, Plugin] of Object.entries(Fancybox.Plugins || {})) {
  if (typeof Plugin.create === "function") {
    Plugin.create(Fancybox);
  }
}var SchedaSuite = function (_Page) {
  _inheritsLoose(SchedaSuite, _Page);

  function SchedaSuite(el) {
    var _this;

    _this = _Page.call(this, el) || this;

    _this.init();

    _this.pageInit();

    return _this;
  }

  var _proto = SchedaSuite.prototype;

  _proto.pageInit = function pageInit() {
    SwiperSlider.init();
    ScrollAnchor.init();
    this.initAccordion();
  };

  _proto.initAccordion = function initAccordion() {
    var selectors = {
      buttonAttribute: 'accordion-button',
      contentAttribute: 'accordion-content',
      activeClass: 'active'
    };
    var settings = {
      closeOthers: false,
      toggleCurrent: false,
      defaultElementId: ''
    };
    Accordion.init('accordion-component', selectors, settings);
  };

  return SchedaSuite;
}(Page);

window.onload = function () {
  var schedasuite = new SchedaSuite();
};return SchedaSuite;}());