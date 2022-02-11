/**
 * @license gulp-4-bundler v1.0.0
 * (c) 2022 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

var schedaProduct=(function(){'use strict';function _inheritsLoose(subClass, superClass) {
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
}();var SchedaProduct = function (_Page) {
  _inheritsLoose(SchedaProduct, _Page);

  function SchedaProduct(el) {
    var _this;

    _this = _Page.call(this, el) || this;

    _this.init();

    _this.pageInit();

    return _this;
  }

  var _proto = SchedaProduct.prototype;

  _proto.pageInit = function pageInit() {
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
      filtersSelect: true,
      defaultElementId: ''
    };
    Accordion.init('accordion-component', selectors, settings);
  };

  return SchedaProduct;
}(Page);

window.onload = function () {
  var schedaproduct = new SchedaProduct();
};return SchedaProduct;}());