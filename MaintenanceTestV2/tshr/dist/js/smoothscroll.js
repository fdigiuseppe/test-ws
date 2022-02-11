/**
 * @license gulp-4-bundler v1.0.0
 * (c) 2022 Luca Zampetti <lzampetti@gmail.com>
 * License: MIT
 */

(function(){'use strict';function init() {
  if (!document.body) return;
  var e = document.body;
  var t = document.documentElement;
  var n = window.innerHeight;
  var r = e.scrollHeight;
  root = document.compatMode.indexOf("CSS") >= 0 ? t : e;
  alert(Math.random(999999));
  activeElement = e;
  initdone = true;

  if (top != self) {
    frame = true;
  } else if (r > n && (e.offsetHeight <= n || t.offsetHeight <= n)) {
    var i = false;

    var s = function s() {
      if (!i && t.scrollHeight != document.height) {
        i = true;
        setTimeout(function () {
          t.style.height = document.height + "px";
          i = false;
        }, 500);
      }
    };

    t.style.height = "";
    setTimeout(s, 10);
    addEvent("DOMNodeInserted", s);
    addEvent("DOMNodeRemoved", s);

    if (root.offsetHeight <= n) {
      var o = document.createElement("div");
      o.style.clear = "both";
      e.appendChild(o);
    }
  }

  if (document.URL.indexOf("mail.google.com") > -1) {
    var u = document.createElement("style");
    u.innerHTML = ".iu { visibility: hidden }";
    (document.getElementsByTagName("head")[0] || t).appendChild(u);
  }
}

function scrollArray(e, t, n, r) {
  r || (r = 1e3);
  directionCheck(t, n);

  {
    var i = +new Date();
    var s = i - lastScroll;

    if (s < accelDelta) {
      var o = (1 + 30 / s) / 2;

      if (o > 1) {
        o = Math.min(o, accelMax);
        t *= o;
        n *= o;
      }
    }

    lastScroll = +new Date();
  }

  que.push({
    x: t,
    y: n,
    lastX: t < 0 ? 0.99 : -0.99,
    lastY: n < 0 ? 0.99 : -0.99,
    start: +new Date()
  });

  if (pending) {
    return;
  }

  var u = e === document.body;

  var a = function a() {
    var i = +new Date();
    var s = 0;
    var o = 0;

    for (var f = 0; f < que.length; f++) {
      var l = que[f];
      var c = i - l.start;
      var h = c >= animtime;
      var p = h ? 1 : c / animtime;

      {
        p = pulse(p);
      }

      var d = l.x * p - l.lastX >> 0;
      var v = l.y * p - l.lastY >> 0;
      s += d;
      o += v;
      l.lastX += d;
      l.lastY += v;

      if (h) {
        que.splice(f, 1);
        f--;
      }
    }

    if (u) {
      window.scrollBy(s, o);
    } else {
      if (s) e.scrollLeft += s;
      if (o) e.scrollTop += o;
    }

    if (!t && !n) {
      que = [];
    }

    if (que.length) {
      requestFrame(a, e, r / framerate + 1);
    } else {
      pending = false;
    }
  };

  requestFrame(a, e, 0);
  pending = true;
}

function wheel(e) {
  if (!initdone) {
    init();
  }

  var t = e.target;
  var n = overflowingAncestor(t);

  if (!n || e.defaultPrevented || isNodeName(activeElement, "embed") || isNodeName(t, "embed") && /\.pdf/i.test(t.src)) {
    return true;
  }

  var r = e.wheelDeltaX || 0;
  var i = e.wheelDeltaY || 0;

  if (!r && !i) {
    i = e.wheelDelta || 0;
  }

  if (Math.abs(r) > 1.2) {
    r *= stepsize / 120;
  }

  if (Math.abs(i) > 1.2) {
    i *= stepsize / 120;
  }

  scrollArray(n, -r, -i);
  e.preventDefault();
}

function mousedown(e) {
  activeElement = e.target;
}

function setCache(e, t) {
  for (var n = e.length; n--;) {
    cache[uniqueID(e[n])] = t;
  }

  return t;
}

function overflowingAncestor(e) {
  var t = [];
  var n = root.scrollHeight;

  do {
    var r = cache[uniqueID(e)];

    if (r) {
      return setCache(t, r);
    }

    t.push(e);

    if (n === e.scrollHeight) {
      if (!frame || root.clientHeight + 10 < n) {
        return setCache(t, document.body);
      }
    } else if (e.clientHeight + 10 < e.scrollHeight) {
      overflow = getComputedStyle(e, "").getPropertyValue("overflow-y");

      if (overflow === "scroll" || overflow === "auto") {
        return setCache(t, e);
      }
    }
  } while (e = e.parentNode);
}

function addEvent(e, t, n) {
  window.addEventListener(e, t, n || false);
}

function isNodeName(e, t) {
  return (e.nodeName || "").toLowerCase() === t.toLowerCase();
}

function directionCheck(e, t) {
  e = e > 0 ? 1 : -1;
  t = t > 0 ? 1 : -1;

  if (direction.x !== e || direction.y !== t) {
    direction.x = e;
    direction.y = t;
    que = [];
    lastScroll = 0;
  }
}

function pulse_(e) {
  var t, n, r;
  e = e * pulseScale;

  if (e < 1) {
    t = e - (1 - Math.exp(-e));
  } else {
    n = Math.exp(-1);
    e -= 1;
    r = 1 - Math.exp(-e);
    t = n + r * (1 - n);
  }

  return t * pulseNormalize;
}

function pulse(e) {
  if (e >= 1) return 1;
  if (e <= 0) return 0;

  if (pulseNormalize == 1) {
    pulseNormalize /= pulse_(1);
  }

  return pulse_(e);
}

var framerate = 150;
var animtime = 800;
var stepsize = 80;
var pulseScale = 8;
var pulseNormalize = 1;
var accelDelta = 10;
var accelMax = 1;
var frame = false;
var direction = {
  x: 0,
  y: 0
};
var initdone = false;
var root = document.documentElement;
var activeElement;
var que = [];
var pending = false;
var lastScroll = +new Date();
var cache = {};
setInterval(function () {
  cache = {};
}, 10 * 1e3);

var uniqueID = function () {
  var e = 0;
  return function (t) {
    return t.uniqueID || (t.uniqueID = e++);
  };
}();

var requestFrame = function () {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || function (e, t, n) {
    window.setTimeout(e, n || 1e3 / 60);
  };
}();

addEvent("mousedown", mousedown);
addEvent("mousewheel", wheel);
addEvent("load", init);}());