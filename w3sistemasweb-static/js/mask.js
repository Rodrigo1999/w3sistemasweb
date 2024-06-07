"use strict";
! function(t, a, e) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? module.exports = t(require("jquery")) : t(a || e)
}(function(t) {
    var a = function(a, e, n) {
        var s = {
            invalid: [],
            getCaret: function() {
                try {
                    var t, e = 0,
                        n = a.get(0),
                        r = document.selection,
                        o = n.selectionStart;
                    return r && -1 === navigator.appVersion.indexOf("MSIE 10") ? (t = r.createRange(), t.moveStart("character", -s.val().length), e = t.text.length) : (o || "0" === o) && (e = o), e
                } catch (i) {}
            },
            setCaret: function(t) {
                try {
                    if (a.is(":focus")) {
                        var e, n = a.get(0);
                        n.setSelectionRange ? n.setSelectionRange(t, t) : (e = n.createTextRange(), e.collapse(!0), e.moveEnd("character", t), e.moveStart("character", t), e.select())
                    }
                } catch (s) {}
            },
            events: function() {
                a.on("keydown.mask", function(t) {
                    a.data("mask-keycode", t.keyCode || t.which), a.data("mask-previus-value", a.val()), a.data("mask-previus-caret-pos", s.getCaret()), s.maskDigitPosMapOld = s.maskDigitPosMap
                }).on(t.jMaskGlobals.useInput ? "input.mask" : "keyup.mask", s.behaviour).on("paste.mask drop.mask", function() {
                    setTimeout(function() {
                        a.keydown().keyup()
                    }, 100)
                }).on("change.mask", function() {
                    a.data("changed", !0)
                }).on("blur.mask", function() {
                    i === s.val() || a.data("changed") || a.trigger("change"), a.data("changed", !1)
                }).on("blur.mask", function() {
                    i = s.val()
                }).on("focus.mask", function(a) {
                    n.selectOnFocus === !0 && t(a.target).select()
                }).on("focusout.mask", function() {
                    n.clearIfNotMatch && !r.test(s.val()) && s.val("")
                })
            },
            getRegexMask: function() {
                for (var t, a, n, s, r, i, c = [], l = 0; l < e.length; l++) t = o.translation[e.charAt(l)], t ? (a = t.pattern.toString().replace(/.{1}$|^.{1}/g, ""), n = t.optional, s = t.recursive, s ? (c.push(e.charAt(l)), r = {
                    digit: e.charAt(l),
                    pattern: a
                }) : c.push(n || s ? a + "?" : a)) : c.push(e.charAt(l).replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&"));
                return i = c.join(""), r && (i = i.replace(new RegExp("(" + r.digit + "(.*" + r.digit + ")?)"), "($1)?").replace(new RegExp(r.digit, "g"), r.pattern)), new RegExp(i)
            },
            destroyEvents: function() {
                a.off(["input", "keydown", "keyup", "paste", "drop", "blur", "focusout", ""].join(".mask "))
            },
            val: function(t) {
                var e, n = a.is("input"),
                    s = n ? "val" : "text";
                return arguments.length > 0 ? (a[s]() !== t && a[s](t), e = a) : e = a[s](), e
            },
            calculateCaretPosition: function() {
                var t = a.data("mask-previus-value") || "",
                    e = s.getMasked(),
                    n = s.getCaret();
                if (t !== e) {
                    var r = a.data("mask-previus-caret-pos") || 0,
                        o = e.length,
                        i = t.length,
                        c = 0,
                        l = 0,
                        u = 0,
                        v = 0,
                        f = 0;
                    for (f = n; o > f && s.maskDigitPosMap[f]; f++) l++;
                    for (f = n - 1; f >= 0 && s.maskDigitPosMap[f]; f--) c++;
                    for (f = n - 1; f >= 0; f--) s.maskDigitPosMap[f] && u++;
                    for (f = r - 1; f >= 0; f--) s.maskDigitPosMapOld[f] && v++;
                    if (n > i) n = 10 * o;
                    else if (r >= n && r !== i) {
                        if (!s.maskDigitPosMapOld[n]) {
                            var k = n;
                            n -= v - u, n -= c, s.maskDigitPosMap[n] && (n = k)
                        }
                    } else n > r && (n += u - v, n += l)
                }
                return n
            },
            behaviour: function(e) {
                e = e || window.event, s.invalid = [];
                var n = a.data("mask-keycode");
                if (-1 === t.inArray(n, o.byPassKeys)) {
                    var r = s.getMasked(),
                        i = s.getCaret();
                    return setTimeout(function() {
                        s.setCaret(s.calculateCaretPosition())
                    }, 10), s.val(r), s.setCaret(i), s.callbacks(e)
                }
            },
            getMasked: function(t, a) {
                var r, i, c = [],
                    l = void 0 === a ? s.val() : a + "",
                    u = 0,
                    v = e.length,
                    f = 0,
                    k = l.length,
                    d = 1,
                    p = "push",
                    h = -1,
                    g = 0,
                    m = [];
                n.reverse ? (p = "unshift", d = -1, r = 0, u = v - 1, f = k - 1, i = function() {
                    return u > -1 && f > -1
                }) : (r = v - 1, i = function() {
                    return v > u && k > f
                });
                for (var M; i();) {
                    var y = e.charAt(u),
                        b = l.charAt(f),
                        w = o.translation[y];
                    w ? (b.match(w.pattern) ? (c[p](b), w.recursive && (-1 === h ? h = u : u === r && (u = h - d), r === h && (u -= d)), u += d) : b === M ? (g--, M = void 0) : w.optional ? (u += d, f -= d) : w.fallback ? (c[p](w.fallback), u += d, f -= d) : s.invalid.push({
                        p: f,
                        v: b,
                        e: w.pattern
                    }), f += d) : (t || c[p](y), b === y ? (m.push(f), f += d) : (M = y, m.push(f + g), g++), u += d)
                }
                var j = e.charAt(r);
                v !== k + 1 || o.translation[j] || c.push(j);
                var C = c.join("");
                return s.mapMaskdigitPositions(C, m, k), C
            },
            mapMaskdigitPositions: function(t, a, e) {
                var r = n.reverse ? t.length - e : 0;
                s.maskDigitPosMap = {};
                for (var o = 0; o < a.length; o++) s.maskDigitPosMap[a[o] + r] = 1
            },
            callbacks: function(t) {
                var r = s.val(),
                    o = r !== i,
                    c = [r, t, a, n],
                    l = function(t, a, e) {
                        "function" == typeof n[t] && a && n[t].apply(this, e)
                    };
                l("onChange", o === !0, c), l("onKeyPress", o === !0, c), l("onComplete", r.length === e.length, c), l("onInvalid", s.invalid.length > 0, [r, t, a, s.invalid, n])
            }
        };
        a = t(a);
        var r, o = this,
            i = s.val();
        e = "function" == typeof e ? e(s.val(), void 0, a, n) : e, o.mask = e, o.options = n, o.remove = function() {
            var t = s.getCaret();
            return s.destroyEvents(), s.val(o.getCleanVal()), s.setCaret(t), a
        }, o.getCleanVal = function() {
            return s.getMasked(!0)
        }, o.getMaskedVal = function(t) {
            return s.getMasked(!1, t)
        }, o.init = function(i) {
            if (i = i || !1, n = n || {}, o.clearIfNotMatch = t.jMaskGlobals.clearIfNotMatch, o.byPassKeys = t.jMaskGlobals.byPassKeys, o.translation = t.extend({}, t.jMaskGlobals.translation, n.translation), o = t.extend(!0, {}, o, n), r = s.getRegexMask(), i) s.events(), s.val(s.getMasked());
            else {
                n.placeholder && a.attr("placeholder", n.placeholder), a.data("mask") && a.attr("autocomplete", "off");
                for (var c = 0, l = !0; c < e.length; c++) {
                    var u = o.translation[e.charAt(c)];
                    if (u && u.recursive) {
                        l = !1;
                        break
                    }
                }
                l && a.attr("maxlength", e.length), s.destroyEvents(), s.events();
                var v = s.getCaret();
                s.val(s.getMasked()), s.setCaret(v)
            }
        }, o.init(!a.is("input"))
    };
    t.maskWatchers = {};
    var e = function() {
            var e = t(this),
                s = {},
                r = "data-mask-",
                o = e.attr("data-mask");
            return e.attr(r + "reverse") && (s.reverse = !0), e.attr(r + "clearifnotmatch") && (s.clearIfNotMatch = !0), "true" === e.attr(r + "selectonfocus") && (s.selectOnFocus = !0), n(e, o, s) ? e.data("mask", new a(this, o, s)) : void 0
        },
        n = function(a, e, n) {
            n = n || {};
            var s = t(a).data("mask"),
                r = JSON.stringify,
                o = t(a).val() || t(a).text();
            try {
                return "function" == typeof e && (e = e(o)), "object" != typeof s || r(s.options) !== r(n) || s.mask !== e
            } catch (i) {}
        },
        s = function(t) {
            var a, e = document.createElement("div");
            return t = "on" + t, a = t in e, a || (e.setAttribute(t, "return;"), a = "function" == typeof e[t]), e = null, a
        };
    t.fn.mask = function(e, s) {
        s = s || {};
        var r = this.selector,
            o = t.jMaskGlobals,
            i = o.watchInterval,
            c = s.watchInputs || o.watchInputs,
            l = function() {
                return n(this, e, s) ? t(this).data("mask", new a(this, e, s)) : void 0
            };
        return t(this).each(l), r && "" !== r && c && (clearInterval(t.maskWatchers[r]), t.maskWatchers[r] = setInterval(function() {
            t(document).find(r).each(l)
        }, i)), this
    }, t.fn.masked = function(t) {
        return this.data("mask").getMaskedVal(t)
    }, t.fn.unmask = function() {
        return clearInterval(t.maskWatchers[this.selector]), delete t.maskWatchers[this.selector], this.each(function() {
            var a = t(this).data("mask");
            a && a.remove().removeData("mask")
        })
    }, t.fn.cleanVal = function() {
        return this.data("mask").getCleanVal()
    }, t.applyDataMask = function(a) {
        a = a || t.jMaskGlobals.maskElements;
        var n = a instanceof t ? a : t(a);
        n.filter(t.jMaskGlobals.dataMaskAttr).each(e)
    };
    var r = {
        maskElements: "input,td,span,div",
        dataMaskAttr: "*[data-mask]",
        dataMask: !0,
        watchInterval: 300,
        watchInputs: !0,
        useInput: !/Chrome\/[2-4][0-9]|SamsungBrowser/.test(window.navigator.userAgent) && s("input"),
        watchDataMask: !1,
        byPassKeys: [9, 16, 17, 18, 36, 37, 38, 39, 40, 91],
        translation: {
            0: {
                pattern: /\d/
            },
            9: {
                pattern: /\d/,
                optional: !0
            },
            "#": {
                pattern: /\d/,
                recursive: !0
            },
            A: {
                pattern: /[a-zA-Z0-9]/
            },
            S: {
                pattern: /[a-zA-Z]/
            }
        }
    };
    t.jMaskGlobals = t.jMaskGlobals || {}, r = t.jMaskGlobals = t.extend(!0, {}, r, t.jMaskGlobals), r.dataMask && t.applyDataMask(), setInterval(function() {
        t.jMaskGlobals.watchDataMask && t.applyDataMask()
    }, r.watchInterval)
}, window.jQuery, window.Zepto);