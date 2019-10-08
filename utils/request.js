! function (e, n) {
  "object" == typeof exports && "undefined" != typeof module ? n(exports) : "function" == typeof define && define.amd ?
    define(["exports"], n) : n(e["wx-queue-request"] = e["wx-queue-request"] || {})
}(this, function (e) {
  "use strict";

  function n(e, n) {
    u(n);
    var t = [],
      o = [];
    return {
      concurrency: n,
      push: function (e, n) {
        var u = this;
        t.push({
          task: e,
          callback: n
        }), setTimeout(function () {
          u.process()
        }, 0)
      },
      process: function () {
        for (var n = this; this.concurrency > o.length && t.length;) ! function () {
          var u = t.shift();
          o.push(u), e(u.task, r(function () {
            n.pull(u), "function" == typeof u.callback && u.callback.apply(u,
              arguments), n.process()
          }))
        }()
      },
      pull: function (e) {
        var n = o.indexOf(e); - 1 !== n && o.splice(n, 1)
      }
    }
  }

  function t(e) {
    var t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 10;
    if ("function" != typeof e) throw Error("request must be function");
    var u = n(function (e, n) {
      return e(n)
    }, t);
    return function (n) {
      u.push(function (t) {
        var u = n.complete;
        n.complete = function () {
          t(), "function" == typeof u && u.apply(void 0, arguments)
        }, e(n)
      })
    }
  }
  var u = function () {
    var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
    if (null == e) e = 1;
    else if (0 === e) throw new Error("Concurrency must not be zero");
    return e
  },
    r = function (e) {
      return function () {
        if (null === e) throw new Error("Callback was already called");
        var n = e;
        return e = null, n.apply(void 0, arguments)
      }
    };
  e.queueRequest = t, e.queue = function (e) {
    var n = wx.request;
    Object.defineProperty(wx, "request", {
      get: function () {
        return t(n, e)
      }
    })
  }, Object.defineProperty(e, "__esModule", {
    value: !0
  })
});