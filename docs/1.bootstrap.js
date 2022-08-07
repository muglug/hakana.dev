"use strict";
(self["webpackChunkhack_analyzer"] = self["webpackChunkhack_analyzer"] || []).push([[1],{

/***/ "./base64.js":
/*!*******************!*\
  !*** ./base64.js ***!
  \*******************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "decodeToArray": () => (/* binding */ decodeToArray),
/* harmony export */   "decodeToArrayUrlSafe": () => (/* binding */ decodeToArrayUrlSafe),
/* harmony export */   "encodeFromArray": () => (/* binding */ encodeFromArray),
/* harmony export */   "encodeFromArrayUrlSafe": () => (/* binding */ encodeFromArrayUrlSafe)
/* harmony export */ });
/**
 * Convert between Uint8Array and Base64 strings
 * Allows for any encoded JS string to be converted (as opposed to atob()/btoa() which only supports latin1)
 *
 * Original implementation by madmurphy on MDN
 * @see https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding#Solution_1_–_JavaScript%27s_UTF-16_%3E_base64
 */

 function b64ToUint6(nChr) {
    return nChr > 64 && nChr < 91
      ? nChr - 65
      : nChr > 96 && nChr < 123
      ? nChr - 71
      : nChr > 47 && nChr < 58
      ? nChr + 4
      : nChr === 43
      ? 62
      : nChr === 47
      ? 63
      : 0
  }
  
  function decodeToArray(base64string, blockSize) {
    var sB64Enc = base64string.replace(/[^A-Za-z0-9\+\/]/g, ''),
      nInLen = sB64Enc.length,
      nOutLen = blockSize
        ? Math.ceil(((nInLen * 3 + 1) >>> 2) / blockSize) * blockSize
        : (nInLen * 3 + 1) >>> 2,
      aBytes = new Uint8Array(nOutLen)
  
    for (
      var nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0;
      nInIdx < nInLen;
      nInIdx++
    ) {
      nMod4 = nInIdx & 3
      nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << (18 - 6 * nMod4)
      if (nMod4 === 3 || nInLen - nInIdx === 1) {
        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
          aBytes[nOutIdx] = (nUint24 >>> ((16 >>> nMod3) & 24)) & 255
        }
        nUint24 = 0
      }
    }
  
    return aBytes
  }
  
  function uint6ToB64(nUint6) {
    return nUint6 < 26
      ? nUint6 + 65
      : nUint6 < 52
      ? nUint6 + 71
      : nUint6 < 62
      ? nUint6 - 4
      : nUint6 === 62
      ? 43
      : nUint6 === 63
      ? 47
      : 65
  }
  
  function encodeFromArray(bytes) {
    var eqLen = (3 - (bytes.length % 3)) % 3,
      sB64Enc = ''
  
    for (
      var nMod3, nLen = bytes.length, nUint24 = 0, nIdx = 0;
      nIdx < nLen;
      nIdx++
    ) {
      nMod3 = nIdx % 3
      /* Uncomment the following line in order to split the output in lines 76-character long: */
      /*
      if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
      */
      nUint24 |= bytes[nIdx] << ((16 >>> nMod3) & 24)
      if (nMod3 === 2 || bytes.length - nIdx === 1) {
        sB64Enc += String.fromCharCode(
          uint6ToB64((nUint24 >>> 18) & 63),
          uint6ToB64((nUint24 >>> 12) & 63),
          uint6ToB64((nUint24 >>> 6) & 63),
          uint6ToB64(nUint24 & 63)
        )
        nUint24 = 0
      }
    }
  
    return eqLen === 0
      ? sB64Enc
      : sB64Enc.substring(0, sB64Enc.length - eqLen) + (eqLen === 1 ? '=' : '==')
  }
  
  /**
   * URL-safe variants of Base64 conversion functions (aka base64url)
   * @see https://tools.ietf.org/html/rfc4648#section-5
   */
  
  function encodeFromArrayUrlSafe(bytes) {
    return encodeURIComponent(
      encodeFromArray(bytes)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
    )
  }
  
  function decodeToArrayUrlSafe(base64string) {
    return decodeToArray(
      decodeURIComponent(base64string)
        .replace(/-/g, '+')
        .replace(/_/g, '/')
    )
  }
  

/***/ }),

/***/ "./codemirror_lint.js":
/*!****************************!*\
  !*** ./codemirror_lint.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "add_lint": () => (/* binding */ add_lint)
/* harmony export */ });
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/LICENSE

function add_lint(CodeMirror) {
    "use strict";
    var GUTTER_ID = "CodeMirror-lint-markers";
    var LINT_LINE_ID = "CodeMirror-lint-line-";
  
    function showTooltip(cm, e, content) {
      var tt = document.createElement("div");
      tt.className = "CodeMirror-lint-tooltip cm-s-" + cm.options.theme;
      tt.appendChild(content.cloneNode(true));
      if (cm.state.lint.options.selfContain)
        cm.getWrapperElement().appendChild(tt);
      else
        document.body.appendChild(tt);
  
      function position(e) {
        if (!tt.parentNode) return CodeMirror.off(document, "mousemove", position);
        tt.style.top = Math.max(0, e.clientY - tt.offsetHeight - 5) + "px";
        tt.style.left = (e.clientX + 5) + "px";
      }
      CodeMirror.on(document, "mousemove", position);
      position(e);
      if (tt.style.opacity != null) tt.style.opacity = 1;
      return tt;
    }
    function rm(elt) {
      if (elt.parentNode) elt.parentNode.removeChild(elt);
    }
    function hideTooltip(tt) {
      if (!tt.parentNode) return;
      if (tt.style.opacity == null) rm(tt);
      tt.style.opacity = 0;
      setTimeout(function() { rm(tt); }, 600);
    }
  
    function showTooltipFor(cm, e, content, node) {
      var tooltip = showTooltip(cm, e, content);
      function hide() {
        CodeMirror.off(node, "mouseout", hide);
        if (tooltip) { hideTooltip(tooltip); tooltip = null; }
      }
      var poll = setInterval(function() {
        if (tooltip) for (var n = node;; n = n.parentNode) {
          if (n && n.nodeType == 11) n = n.host;
          if (n == document.body) return;
          if (!n) { hide(); break; }
        }
        if (!tooltip) return clearInterval(poll);
      }, 400);
      CodeMirror.on(node, "mouseout", hide);
    }
  
    function LintState(cm, conf, hasGutter) {
      this.marked = [];
      if (conf instanceof Function) conf = {getAnnotations: conf};
      if (!conf || conf === true) conf = {};
      this.options = {};
      this.linterOptions = conf.options || {};
      for (var prop in defaults) this.options[prop] = defaults[prop];
      for (var prop in conf) {
        if (defaults.hasOwnProperty(prop)) {
          if (conf[prop] != null) this.options[prop] = conf[prop];
        } else if (!conf.options) {
          this.linterOptions[prop] = conf[prop];
        }
      }
      this.timeout = null;
      this.hasGutter = hasGutter;
      this.onMouseOver = function(e) { onMouseOver(cm, e); };
      this.waitingFor = 0
    }
  
    var defaults = {
      highlightLines: false,
      tooltips: true,
      delay: 500,
      lintOnChange: true,
      getAnnotations: null,
      async: false,
      selfContain: null,
      formatAnnotation: null,
      onUpdateLinting: null
    }
  
    function clearMarks(cm) {
      var state = cm.state.lint;
      if (state.hasGutter) cm.clearGutter(GUTTER_ID);
      if (state.options.highlightLines) clearErrorLines(cm);
      for (var i = 0; i < state.marked.length; ++i)
        state.marked[i].clear();
      state.marked.length = 0;
    }
  
    function clearErrorLines(cm) {
      cm.eachLine(function(line) {
        var has = line.wrapClass && /\bCodeMirror-lint-line-\w+\b/.exec(line.wrapClass);
        if (has) cm.removeLineClass(line, "wrap", has[0]);
      })
    }
  
    function makeMarker(cm, labels, severity, multiple, tooltips) {
      var marker = document.createElement("div"), inner = marker;
      marker.className = "CodeMirror-lint-marker CodeMirror-lint-marker-" + severity;
      if (multiple) {
        inner = marker.appendChild(document.createElement("div"));
        inner.className = "CodeMirror-lint-marker CodeMirror-lint-marker-multiple";
      }
  
      if (tooltips != false) CodeMirror.on(inner, "mouseover", function(e) {
        showTooltipFor(cm, e, labels, inner);
      });
  
      return marker;
    }
  
    function getMaxSeverity(a, b) {
      if (a == "error") return a;
      else return b;
    }
  
    function groupByLine(annotations) {
      var lines = [];
      for (var i = 0; i < annotations.length; ++i) {
        var ann = annotations[i], line = ann.from.line;
        (lines[line] || (lines[line] = [])).push(ann);
      }
      return lines;
    }
  
    function annotationTooltip(ann) {
      var severity = ann.severity;
      if (!severity) severity = "error";
      var tip = document.createElement("div");
      tip.className = "CodeMirror-lint-message CodeMirror-lint-message-" + severity;
      if (typeof ann.messageHTML != 'undefined') {
        tip.innerHTML = ann.messageHTML;
      } else {
        tip.appendChild(document.createTextNode(ann.message));
      }
      return tip;
    }
  
    function lintAsync(cm, getAnnotations) {
      var state = cm.state.lint
      var id = ++state.waitingFor
      function abort() {
        id = -1
        cm.off("change", abort)
      }
      cm.on("change", abort)
      getAnnotations(cm.getValue(), function(annotations, arg2) {
        cm.off("change", abort)
        if (state.waitingFor != id) return
        if (arg2 && annotations instanceof CodeMirror) annotations = arg2
        cm.operation(function() {updateLinting(cm, annotations)})
      }, state.linterOptions, cm);
    }
  
    function startLinting(cm) {
      var state = cm.state.lint;
      if (!state) return;
      var options = state.options;
      /*
       * Passing rules in `options` property prevents JSHint (and other linters) from complaining
       * about unrecognized rules like `onUpdateLinting`, `delay`, `lintOnChange`, etc.
       */
      var getAnnotations = options.getAnnotations || cm.getHelper(CodeMirror.Pos(0, 0), "lint");
      if (!getAnnotations) return;
      if (options.async || getAnnotations.async) {
        lintAsync(cm, getAnnotations)
      } else {
        var annotations = getAnnotations(cm.getValue(), state.linterOptions, cm);
        if (!annotations) return;
        if (annotations.then) annotations.then(function(issues) {
          cm.operation(function() {updateLinting(cm, issues)})
        });
        else cm.operation(function() {updateLinting(cm, annotations)})
      }
    }
  
    function updateLinting(cm, annotationsNotSorted) {
      var state = cm.state.lint;
      if (!state) return;
      var options = state.options;
      clearMarks(cm);
  
      var annotations = groupByLine(annotationsNotSorted);
  
      for (var line = 0; line < annotations.length; ++line) {
        var anns = annotations[line];
        if (!anns) continue;
  
        // filter out duplicate messages
        var message = [];
        anns = anns.filter(function(item) { return message.indexOf(item.message) > -1 ? false : message.push(item.message) });
  
        var maxSeverity = null;
        var tipLabel = state.hasGutter && document.createDocumentFragment();
  
        for (var i = 0; i < anns.length; ++i) {
          var ann = anns[i];
          var severity = ann.severity;
          if (!severity) severity = "error";
          maxSeverity = getMaxSeverity(maxSeverity, severity);
  
          if (options.formatAnnotation) ann = options.formatAnnotation(ann);
          if (state.hasGutter) tipLabel.appendChild(annotationTooltip(ann));
  
          if (ann.to) state.marked.push(cm.markText(ann.from, ann.to, {
            className: "CodeMirror-lint-mark CodeMirror-lint-mark-" + severity,
            __annotation: ann
          }));
        }
        // use original annotations[line] to show multiple messages
        if (state.hasGutter)
          cm.setGutterMarker(line, GUTTER_ID, makeMarker(cm, tipLabel, maxSeverity, annotations[line].length > 1,
                                                         options.tooltips));
  
        if (options.highlightLines)
          cm.addLineClass(line, "wrap", LINT_LINE_ID + maxSeverity);
      }
      if (options.onUpdateLinting) options.onUpdateLinting(annotationsNotSorted, annotations, cm);
    }
  
    function onChange(cm) {
      var state = cm.state.lint;
      if (!state) return;
      clearTimeout(state.timeout);
      state.timeout = setTimeout(function(){startLinting(cm);}, state.options.delay);
    }
  
    function popupTooltips(cm, annotations, e) {
      var target = e.target || e.srcElement;
      var tooltip = document.createDocumentFragment();
      for (var i = 0; i < annotations.length; i++) {
        var ann = annotations[i];
        tooltip.appendChild(annotationTooltip(ann));
      }
      showTooltipFor(cm, e, tooltip, target);
    }
  
    function onMouseOver(cm, e) {
      var target = e.target || e.srcElement;
      if (!/\bCodeMirror-lint-mark-/.test(target.className)) return;
      var box = target.getBoundingClientRect(), x = (box.left + box.right) / 2, y = (box.top + box.bottom) / 2;
      var spans = cm.findMarksAt(cm.coordsChar({left: x, top: y}, "client"));
  
      var annotations = [];
      for (var i = 0; i < spans.length; ++i) {
        var ann = spans[i].__annotation;
        if (ann) annotations.push(ann);
      }
      if (annotations.length) popupTooltips(cm, annotations, e);
    }
  
    CodeMirror.defineOption("lint", false, function(cm, val, old) {
      if (old && old != CodeMirror.Init) {
        clearMarks(cm);
        if (cm.state.lint.options.lintOnChange !== false)
          cm.off("change", onChange);
        CodeMirror.off(cm.getWrapperElement(), "mouseover", cm.state.lint.onMouseOver);
        clearTimeout(cm.state.lint.timeout);
        delete cm.state.lint;
      }
  
      if (val) {
        var gutters = cm.getOption("gutters"), hasLintGutter = false;
        for (var i = 0; i < gutters.length; ++i) if (gutters[i] == GUTTER_ID) hasLintGutter = true;
        var state = cm.state.lint = new LintState(cm, val, hasLintGutter);
        if (state.options.lintOnChange)
          cm.on("change", onChange);
        if (state.options.tooltips != false && state.options.tooltips != "gutter")
          CodeMirror.on(cm.getWrapperElement(), "mouseover", state.onMouseOver);
  
        startLinting(cm);
      }
    });
  
    CodeMirror.defineExtension("performLint", function() {
      startLinting(this);
    });
  };

/***/ }),

/***/ "./lzma-url.js":
/*!*********************!*\
  !*** ./lzma-url.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "compress": () => (/* binding */ compress),
/* harmony export */   "compressUrlSafe": () => (/* binding */ compressUrlSafe),
/* harmony export */   "decompress": () => (/* binding */ decompress),
/* harmony export */   "decompressUrlSafe": () => (/* binding */ decompressUrlSafe)
/* harmony export */ });
/* harmony import */ var _base64_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./base64.js */ "./base64.js");
/*
The LZMA impementation is taken from https://npm.is/lzma-js, converted to an ES module and with some features stripped off (e.g. async mode, worker support)

Here's the according MIT license:

© 2016 Nathan Rugg <nmrugg@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/



const __4294967296 = 4294967296,
  N1_longLit = [4294967295, -__4294967296],
  MIN_VALUE = [0, -9223372036854775808],
  P0_longLit = [0, 0],
  P1_longLit = [1, 0]

function add(a, b) {
  return create(a[0] + b[0], a[1] + b[1])
}

function initDim(len) {
  // NOTE: This is MUCH faster than "initDim(len)" in newer versions of v8 (starting with Node.js 0.11.15, which uses v8 3.28.73).
  var a = []
  a[len - 1] = undefined
  return a
}
function and(a, b) {
  return makeFromBits(
    ~~Math.max(Math.min(a[1] / __4294967296, 2147483647), -2147483648) &
      ~~Math.max(Math.min(b[1] / __4294967296, 2147483647), -2147483648),
    lowBits_0(a) & lowBits_0(b)
  )
}
function compare(a, b) {
  var nega, negb
  if (a[0] == b[0] && a[1] == b[1]) {
    return 0
  }
  nega = a[1] < 0
  negb = b[1] < 0
  if (nega && !negb) {
    return -1
  }
  if (!nega && negb) {
    return 1
  }
  if (sub(a, b)[1] < 0) {
    return -1
  }
  return 1
}

function create(valueLow, valueHigh) {
  var diffHigh, diffLow
  valueHigh %= 1.8446744073709552e19
  valueLow %= 1.8446744073709552e19
  diffHigh = valueHigh % __4294967296
  diffLow = Math.floor(valueLow / __4294967296) * __4294967296
  valueHigh = valueHigh - diffHigh + diffLow
  valueLow = valueLow - diffLow + diffHigh
  while (valueLow < 0) {
    valueLow += __4294967296
    valueHigh -= __4294967296
  }
  while (valueLow > 4294967295) {
    valueLow -= __4294967296
    valueHigh += __4294967296
  }
  valueHigh = valueHigh % 1.8446744073709552e19
  while (valueHigh > 9223372032559808512) {
    valueHigh -= 1.8446744073709552e19
  }
  while (valueHigh < -9223372036854775808) {
    valueHigh += 1.8446744073709552e19
  }
  return [valueLow, valueHigh]
}
function eq(a, b) {
  return a[0] == b[0] && a[1] == b[1]
}
function fromInt(value) {
  if (value >= 0) {
    return [value, 0]
  } else {
    return [value + __4294967296, -__4294967296]
  }
}

function lowBits_0(a) {
  if (a[0] >= 2147483648) {
    return ~~Math.max(Math.min(a[0] - __4294967296, 2147483647), -2147483648)
  } else {
    return ~~Math.max(Math.min(a[0], 2147483647), -2147483648)
  }
}
function makeFromBits(highBits, lowBits) {
  var high, low
  high = highBits * __4294967296
  low = lowBits
  if (lowBits < 0) {
    low += __4294967296
  }
  return [low, high]
}

function pwrAsDouble(n) {
  if (n <= 30) {
    return 1 << n
  } else {
    return pwrAsDouble(30) * pwrAsDouble(n - 30)
  }
}

function shl(a, n) {
  var diff, newHigh, newLow, twoToN
  n &= 63
  if (eq(a, MIN_VALUE)) {
    if (!n) {
      return a
    }
    return P0_longLit
  }
  if (a[1] < 0) {
    throw new Error('Neg')
  }
  twoToN = pwrAsDouble(n)
  newHigh = (a[1] * twoToN) % 1.8446744073709552e19
  newLow = a[0] * twoToN
  diff = newLow - (newLow % __4294967296)
  newHigh += diff
  newLow -= diff
  if (newHigh >= 9223372036854775807) {
    newHigh -= 1.8446744073709552e19
  }
  return [newLow, newHigh]
}

function shr(a, n) {
  var shiftFact
  n &= 63
  shiftFact = pwrAsDouble(n)
  return create(Math.floor(a[0] / shiftFact), a[1] / shiftFact)
}

function shru(a, n) {
  var sr
  n &= 63
  sr = shr(a, n)
  if (a[1] < 0) {
    sr = add(sr, shl([2, 0], 63 - n))
  }
  return sr
}
function sub(a, b) {
  return create(a[0] - b[0], a[1] - b[1])
}

function $ByteArrayInputStream(this$static, buf) {
  this$static.buf = buf
  this$static.pos = 0
  this$static.count = buf.length
  return this$static
}
function $read(this$static) {
  if (this$static.pos >= this$static.count) return -1
  return this$static.buf[this$static.pos++] & 255
}
function $read_0(this$static, buf, off, len) {
  if (this$static.pos >= this$static.count) return -1
  len = Math.min(len, this$static.count - this$static.pos)
  arraycopy(this$static.buf, this$static.pos, buf, off, len)
  this$static.pos += len
  return len
}
function $ByteArrayOutputStream(this$static) {
  this$static.buf = initDim(32)
  this$static.count = 0
  return this$static
}

function $toByteArray(this$static) {
  var data = this$static.buf
  data.length = this$static.count
  return data
}
function $write(this$static, b) {
  this$static.buf[this$static.count++] = (b << 24) >> 24
}
function $write_0(this$static, buf, off, len) {
  arraycopy(buf, off, this$static.buf, this$static.count, len)
  this$static.count += len
}
function $getChars(this$static, srcBegin, srcEnd, dst, dstBegin) {
  var srcIdx
  for (srcIdx = srcBegin; srcIdx < srcEnd; ++srcIdx) {
    dst[dstBegin++] = this$static.charCodeAt(srcIdx)
  }
}
function arraycopy(src, srcOfs, dest, destOfs, len) {
  for (var i = 0; i < len; ++i) {
    dest[destOfs + i] = src[srcOfs + i]
  }
}
function $configure(this$static, encoder) {
  $SetDictionarySize_0(encoder, 1 << this$static.s)
  encoder._numFastBytes = this$static.f
  $SetMatchFinder(encoder, this$static.m)

  // lc is always 3
  // lp is always 0
  // pb is always 2
  encoder._numLiteralPosStateBits = 0
  encoder._numLiteralContextBits = 3
  encoder._posStateBits = 2
  encoder._posStateMask = 3
}

function $init(this$static, input, output, length_0, mode, enableEndMark) {
  var encoder, i
  if (compare(length_0, N1_longLit) < 0)
    throw new Error('invalid length ' + length_0)
  this$static.length_0 = length_0
  encoder = $Encoder({})
  $configure(mode, encoder)
  encoder._writeEndMark = enableEndMark
  $WriteCoderProperties(encoder, output)
  for (i = 0; i < 64; i += 8) $write(output, lowBits_0(shr(length_0, i)) & 255)
  this$static.chunker =
    ((encoder._needReleaseMFStream = 0),
    ((encoder._inStream = input),
    (encoder._finished = 0),
    $Create_2(encoder),
    (encoder._rangeEncoder.Stream = output),
    $Init_4(encoder),
    $FillDistancesPrices(encoder),
    $FillAlignPrices(encoder),
    (encoder._lenEncoder._tableSize = encoder._numFastBytes + 1 - 2),
    $UpdateTables(encoder._lenEncoder, 1 << encoder._posStateBits),
    (encoder._repMatchLenEncoder._tableSize = encoder._numFastBytes + 1 - 2),
    $UpdateTables(encoder._repMatchLenEncoder, 1 << encoder._posStateBits),
    (encoder.nowPos64 = P0_longLit),
    undefined),
    $Chunker_0({}, encoder))
}

function $LZMAByteArrayCompressor(this$static, data, mode, enableEndMark) {
  this$static.output = $ByteArrayOutputStream({})
  $init(
    this$static,
    $ByteArrayInputStream({}, data),
    this$static.output,
    fromInt(data.length),
    mode,
    enableEndMark
  )
  return this$static
}
function $init_0(this$static, input, output) {
  var decoder,
    hex_length = '',
    i,
    properties = [],
    r,
    tmp_length

  for (i = 0; i < 5; ++i) {
    r = $read(input)
    if (r == -1) throw new Error('truncated input')
    properties[i] = (r << 24) >> 24
  }

  decoder = $Decoder({})
  if (!$SetDecoderProperties(decoder, properties)) {
    throw new Error('corrupted input')
  }
  for (i = 0; i < 64; i += 8) {
    r = $read(input)
    if (r == -1) throw new Error('truncated input')
    r = r.toString(16)
    if (r.length == 1) r = '0' + r
    hex_length = r + '' + hex_length
  }

  // Was the length set in the header (if it was compressed from a stream, the length is all f"s).
  if (/^0+$|^f+$/i.test(hex_length)) {
    // The length is unknown, so set to -1.
    this$static.length_0 = N1_longLit
  } else {
    // NOTE: If there is a problem with the decoder because of the length, you can always set the length to -1 (N1_longLit) which means unknown.
    tmp_length = parseInt(hex_length, 16)
    // If the length is too long to handle, just set it to unknown.
    if (tmp_length > 4294967295) {
      this$static.length_0 = N1_longLit
    } else {
      this$static.length_0 = fromInt(tmp_length)
    }
  }

  this$static.chunker = $CodeInChunks(
    decoder,
    input,
    output,
    this$static.length_0
  )
}

function $LZMAByteArrayDecompressor(this$static, data) {
  this$static.output = $ByteArrayOutputStream({})
  $init_0(this$static, $ByteArrayInputStream({}, data), this$static.output)
  return this$static
}
function $Create_4(this$static, keepSizeBefore, keepSizeAfter, keepSizeReserv) {
  var blockSize
  this$static._keepSizeBefore = keepSizeBefore
  this$static._keepSizeAfter = keepSizeAfter
  blockSize = keepSizeBefore + keepSizeAfter + keepSizeReserv
  if (this$static._bufferBase == null || this$static._blockSize != blockSize) {
    this$static._bufferBase = null
    this$static._blockSize = blockSize
    this$static._bufferBase = initDim(this$static._blockSize)
  }
  this$static._pointerToLastSafePosition =
    this$static._blockSize - keepSizeAfter
}

function $GetIndexByte(this$static, index) {
  return this$static._bufferBase[
    this$static._bufferOffset + this$static._pos + index
  ]
}

function $GetMatchLen(this$static, index, distance, limit) {
  var i, pby
  if (this$static._streamEndWasReached) {
    if (this$static._pos + index + limit > this$static._streamPos) {
      limit = this$static._streamPos - (this$static._pos + index)
    }
  }
  ++distance
  pby = this$static._bufferOffset + this$static._pos + index
  for (
    i = 0;
    i < limit &&
    this$static._bufferBase[pby + i] ==
      this$static._bufferBase[pby + i - distance];
    ++i
  ) {}
  return i
}

function $GetNumAvailableBytes(this$static) {
  return this$static._streamPos - this$static._pos
}

function $MoveBlock(this$static) {
  var i, numBytes, offset
  offset =
    this$static._bufferOffset + this$static._pos - this$static._keepSizeBefore
  if (offset > 0) {
    --offset
  }
  numBytes = this$static._bufferOffset + this$static._streamPos - offset
  for (i = 0; i < numBytes; ++i) {
    this$static._bufferBase[i] = this$static._bufferBase[offset + i]
  }
  this$static._bufferOffset -= offset
}

function $MovePos_1(this$static) {
  var pointerToPostion
  ++this$static._pos
  if (this$static._pos > this$static._posLimit) {
    pointerToPostion = this$static._bufferOffset + this$static._pos
    if (pointerToPostion > this$static._pointerToLastSafePosition) {
      $MoveBlock(this$static)
    }
    $ReadBlock(this$static)
  }
}

function $ReadBlock(this$static) {
  var numReadBytes, pointerToPostion, size
  if (this$static._streamEndWasReached) return
  while (1) {
    size =
      -this$static._bufferOffset +
      this$static._blockSize -
      this$static._streamPos
    if (!size) return
    numReadBytes = $read_0(
      this$static._stream,
      this$static._bufferBase,
      this$static._bufferOffset + this$static._streamPos,
      size
    )
    if (numReadBytes == -1) {
      this$static._posLimit = this$static._streamPos
      pointerToPostion = this$static._bufferOffset + this$static._posLimit
      if (pointerToPostion > this$static._pointerToLastSafePosition) {
        this$static._posLimit =
          this$static._pointerToLastSafePosition - this$static._bufferOffset
      }
      this$static._streamEndWasReached = 1
      return
    }
    this$static._streamPos += numReadBytes
    if (
      this$static._streamPos >=
      this$static._pos + this$static._keepSizeAfter
    ) {
      this$static._posLimit =
        this$static._streamPos - this$static._keepSizeAfter
    }
  }
}

function $ReduceOffsets(this$static, subValue) {
  this$static._bufferOffset += subValue
  this$static._posLimit -= subValue
  this$static._pos -= subValue
  this$static._streamPos -= subValue
}

var CrcTable = (function() {
  var i,
    j,
    r,
    CrcTable = []
  for (i = 0; i < 256; ++i) {
    r = i
    for (j = 0; j < 8; ++j)
      if ((r & 1) != 0) {
        r = (r >>> 1) ^ -306674912
      } else {
        r >>>= 1
      }
    CrcTable[i] = r
  }
  return CrcTable
})()

function $Create_3(
  this$static,
  historySize,
  keepAddBufferBefore,
  matchMaxLen,
  keepAddBufferAfter
) {
  var cyclicBufferSize, hs, windowReservSize
  if (historySize < 1073741567) {
    this$static._cutValue = 16 + (matchMaxLen >> 1)
    windowReservSize =
      ~~(
        (historySize + keepAddBufferBefore + matchMaxLen + keepAddBufferAfter) /
        2
      ) + 256
    $Create_4(
      this$static,
      historySize + keepAddBufferBefore,
      matchMaxLen + keepAddBufferAfter,
      windowReservSize
    )
    this$static._matchMaxLen = matchMaxLen
    cyclicBufferSize = historySize + 1
    if (this$static._cyclicBufferSize != cyclicBufferSize) {
      this$static._son = initDim(
        (this$static._cyclicBufferSize = cyclicBufferSize) * 2
      )
    }

    hs = 65536
    if (this$static.HASH_ARRAY) {
      hs = historySize - 1
      hs |= hs >> 1
      hs |= hs >> 2
      hs |= hs >> 4
      hs |= hs >> 8
      hs >>= 1
      hs |= 65535
      if (hs > 16777216) hs >>= 1
      this$static._hashMask = hs
      ++hs
      hs += this$static.kFixHashSize
    }

    if (hs != this$static._hashSizeSum) {
      this$static._hash = initDim((this$static._hashSizeSum = hs))
    }
  }
}

function $GetMatches(this$static, distances) {
  var count,
    cur,
    curMatch,
    curMatch2,
    curMatch3,
    cyclicPos,
    delta,
    hash2Value,
    hash3Value,
    hashValue,
    len,
    len0,
    len1,
    lenLimit,
    matchMinPos,
    maxLen,
    offset,
    pby1,
    ptr0,
    ptr1,
    temp
  if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
    lenLimit = this$static._matchMaxLen
  } else {
    lenLimit = this$static._streamPos - this$static._pos
    if (lenLimit < this$static.kMinMatchCheck) {
      $MovePos_0(this$static)
      return 0
    }
  }
  offset = 0
  matchMinPos =
    this$static._pos > this$static._cyclicBufferSize
      ? this$static._pos - this$static._cyclicBufferSize
      : 0
  cur = this$static._bufferOffset + this$static._pos
  maxLen = 1
  hash2Value = 0
  hash3Value = 0
  if (this$static.HASH_ARRAY) {
    temp =
      CrcTable[this$static._bufferBase[cur] & 255] ^
      (this$static._bufferBase[cur + 1] & 255)
    hash2Value = temp & 1023
    temp ^= (this$static._bufferBase[cur + 2] & 255) << 8
    hash3Value = temp & 65535
    hashValue =
      (temp ^ (CrcTable[this$static._bufferBase[cur + 3] & 255] << 5)) &
      this$static._hashMask
  } else {
    hashValue =
      (this$static._bufferBase[cur] & 255) ^
      ((this$static._bufferBase[cur + 1] & 255) << 8)
  }

  curMatch = this$static._hash[this$static.kFixHashSize + hashValue] || 0
  if (this$static.HASH_ARRAY) {
    curMatch2 = this$static._hash[hash2Value] || 0
    curMatch3 = this$static._hash[1024 + hash3Value] || 0
    this$static._hash[hash2Value] = this$static._pos
    this$static._hash[1024 + hash3Value] = this$static._pos
    if (curMatch2 > matchMinPos) {
      if (
        this$static._bufferBase[this$static._bufferOffset + curMatch2] ==
        this$static._bufferBase[cur]
      ) {
        distances[offset++] = maxLen = 2
        distances[offset++] = this$static._pos - curMatch2 - 1
      }
    }
    if (curMatch3 > matchMinPos) {
      if (
        this$static._bufferBase[this$static._bufferOffset + curMatch3] ==
        this$static._bufferBase[cur]
      ) {
        if (curMatch3 == curMatch2) {
          offset -= 2
        }
        distances[offset++] = maxLen = 3
        distances[offset++] = this$static._pos - curMatch3 - 1
        curMatch2 = curMatch3
      }
    }
    if (offset != 0 && curMatch2 == curMatch) {
      offset -= 2
      maxLen = 1
    }
  }
  this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos
  ptr0 = (this$static._cyclicBufferPos << 1) + 1
  ptr1 = this$static._cyclicBufferPos << 1
  len0 = len1 = this$static.kNumHashDirectBytes
  if (this$static.kNumHashDirectBytes != 0) {
    if (curMatch > matchMinPos) {
      if (
        this$static._bufferBase[
          this$static._bufferOffset + curMatch + this$static.kNumHashDirectBytes
        ] != this$static._bufferBase[cur + this$static.kNumHashDirectBytes]
      ) {
        distances[offset++] = maxLen = this$static.kNumHashDirectBytes
        distances[offset++] = this$static._pos - curMatch - 1
      }
    }
  }
  count = this$static._cutValue
  while (1) {
    if (curMatch <= matchMinPos || count-- == 0) {
      this$static._son[ptr0] = this$static._son[ptr1] = 0
      break
    }
    delta = this$static._pos - curMatch
    cyclicPos =
      (delta <= this$static._cyclicBufferPos
        ? this$static._cyclicBufferPos - delta
        : this$static._cyclicBufferPos -
          delta +
          this$static._cyclicBufferSize) << 1
    pby1 = this$static._bufferOffset + curMatch
    len = len0 < len1 ? len0 : len1
    if (
      this$static._bufferBase[pby1 + len] == this$static._bufferBase[cur + len]
    ) {
      while (++len != lenLimit) {
        if (
          this$static._bufferBase[pby1 + len] !=
          this$static._bufferBase[cur + len]
        ) {
          break
        }
      }
      if (maxLen < len) {
        distances[offset++] = maxLen = len
        distances[offset++] = delta - 1
        if (len == lenLimit) {
          this$static._son[ptr1] = this$static._son[cyclicPos]
          this$static._son[ptr0] = this$static._son[cyclicPos + 1]
          break
        }
      }
    }
    if (
      (this$static._bufferBase[pby1 + len] & 255) <
      (this$static._bufferBase[cur + len] & 255)
    ) {
      this$static._son[ptr1] = curMatch
      ptr1 = cyclicPos + 1
      curMatch = this$static._son[ptr1]
      len1 = len
    } else {
      this$static._son[ptr0] = curMatch
      ptr0 = cyclicPos
      curMatch = this$static._son[ptr0]
      len0 = len
    }
  }
  $MovePos_0(this$static)
  return offset
}

function $Init_5(this$static) {
  this$static._bufferOffset = 0
  this$static._pos = 0
  this$static._streamPos = 0
  this$static._streamEndWasReached = 0
  $ReadBlock(this$static)
  this$static._cyclicBufferPos = 0
  $ReduceOffsets(this$static, -1)
}

function $MovePos_0(this$static) {
  var subValue
  if (++this$static._cyclicBufferPos >= this$static._cyclicBufferSize) {
    this$static._cyclicBufferPos = 0
  }
  $MovePos_1(this$static)
  if (this$static._pos == 1073741823) {
    subValue = this$static._pos - this$static._cyclicBufferSize
    $NormalizeLinks(
      this$static._son,
      this$static._cyclicBufferSize * 2,
      subValue
    )
    $NormalizeLinks(this$static._hash, this$static._hashSizeSum, subValue)
    $ReduceOffsets(this$static, subValue)
  }
}

// NOTE: This is only called after reading one whole gigabyte.
function $NormalizeLinks(items, numItems, subValue) {
  var i, value
  for (i = 0; i < numItems; ++i) {
    value = items[i] || 0
    if (value <= subValue) {
      value = 0
    } else {
      value -= subValue
    }
    items[i] = value
  }
}

function $SetType(this$static, numHashBytes) {
  this$static.HASH_ARRAY = numHashBytes > 2
  if (this$static.HASH_ARRAY) {
    this$static.kNumHashDirectBytes = 0
    this$static.kMinMatchCheck = 4
    this$static.kFixHashSize = 66560
  } else {
    this$static.kNumHashDirectBytes = 2
    this$static.kMinMatchCheck = 3
    this$static.kFixHashSize = 0
  }
}

function $Skip(this$static, num) {
  var count,
    cur,
    curMatch,
    cyclicPos,
    delta,
    hash2Value,
    hash3Value,
    hashValue,
    len,
    len0,
    len1,
    lenLimit,
    matchMinPos,
    pby1,
    ptr0,
    ptr1,
    temp
  do {
    if (this$static._pos + this$static._matchMaxLen <= this$static._streamPos) {
      lenLimit = this$static._matchMaxLen
    } else {
      lenLimit = this$static._streamPos - this$static._pos
      if (lenLimit < this$static.kMinMatchCheck) {
        $MovePos_0(this$static)
        continue
      }
    }
    matchMinPos =
      this$static._pos > this$static._cyclicBufferSize
        ? this$static._pos - this$static._cyclicBufferSize
        : 0
    cur = this$static._bufferOffset + this$static._pos
    if (this$static.HASH_ARRAY) {
      temp =
        CrcTable[this$static._bufferBase[cur] & 255] ^
        (this$static._bufferBase[cur + 1] & 255)
      hash2Value = temp & 1023
      this$static._hash[hash2Value] = this$static._pos
      temp ^= (this$static._bufferBase[cur + 2] & 255) << 8
      hash3Value = temp & 65535
      this$static._hash[1024 + hash3Value] = this$static._pos
      hashValue =
        (temp ^ (CrcTable[this$static._bufferBase[cur + 3] & 255] << 5)) &
        this$static._hashMask
    } else {
      hashValue =
        (this$static._bufferBase[cur] & 255) ^
        ((this$static._bufferBase[cur + 1] & 255) << 8)
    }
    curMatch = this$static._hash[this$static.kFixHashSize + hashValue]
    this$static._hash[this$static.kFixHashSize + hashValue] = this$static._pos
    ptr0 = (this$static._cyclicBufferPos << 1) + 1
    ptr1 = this$static._cyclicBufferPos << 1
    len0 = len1 = this$static.kNumHashDirectBytes
    count = this$static._cutValue
    while (1) {
      if (curMatch <= matchMinPos || count-- == 0) {
        this$static._son[ptr0] = this$static._son[ptr1] = 0
        break
      }
      delta = this$static._pos - curMatch
      cyclicPos =
        (delta <= this$static._cyclicBufferPos
          ? this$static._cyclicBufferPos - delta
          : this$static._cyclicBufferPos -
            delta +
            this$static._cyclicBufferSize) << 1
      pby1 = this$static._bufferOffset + curMatch
      len = len0 < len1 ? len0 : len1
      if (
        this$static._bufferBase[pby1 + len] ==
        this$static._bufferBase[cur + len]
      ) {
        while (++len != lenLimit) {
          if (
            this$static._bufferBase[pby1 + len] !=
            this$static._bufferBase[cur + len]
          ) {
            break
          }
        }
        if (len == lenLimit) {
          this$static._son[ptr1] = this$static._son[cyclicPos]
          this$static._son[ptr0] = this$static._son[cyclicPos + 1]
          break
        }
      }
      if (
        (this$static._bufferBase[pby1 + len] & 255) <
        (this$static._bufferBase[cur + len] & 255)
      ) {
        this$static._son[ptr1] = curMatch
        ptr1 = cyclicPos + 1
        curMatch = this$static._son[ptr1]
        len1 = len
      } else {
        this$static._son[ptr0] = curMatch
        ptr0 = cyclicPos
        curMatch = this$static._son[ptr0]
        len0 = len
      }
    }
    $MovePos_0(this$static)
  } while (--num != 0)
}
function $CopyBlock(this$static, distance, len) {
  var pos = this$static._pos - distance - 1
  if (pos < 0) {
    pos += this$static._windowSize
  }
  for (; len != 0; --len) {
    if (pos >= this$static._windowSize) {
      pos = 0
    }
    this$static._buffer[this$static._pos++] = this$static._buffer[pos++]
    if (this$static._pos >= this$static._windowSize) {
      $Flush_0(this$static)
    }
  }
}

function $Create_5(this$static, windowSize) {
  if (this$static._buffer == null || this$static._windowSize != windowSize) {
    this$static._buffer = initDim(windowSize)
  }
  this$static._windowSize = windowSize
  this$static._pos = 0
  this$static._streamPos = 0
}

function $Flush_0(this$static) {
  var size = this$static._pos - this$static._streamPos
  if (!size) {
    return
  }
  $write_0(
    this$static._stream,
    this$static._buffer,
    this$static._streamPos,
    size
  )
  if (this$static._pos >= this$static._windowSize) {
    this$static._pos = 0
  }
  this$static._streamPos = this$static._pos
}

function $GetByte(this$static, distance) {
  var pos = this$static._pos - distance - 1
  if (pos < 0) {
    pos += this$static._windowSize
  }
  return this$static._buffer[pos]
}

function $PutByte(this$static, b) {
  this$static._buffer[this$static._pos++] = b
  if (this$static._pos >= this$static._windowSize) {
    $Flush_0(this$static)
  }
}

function $ReleaseStream(this$static) {
  $Flush_0(this$static)
  this$static._stream = null
}
function GetLenToPosState(len) {
  len -= 2
  if (len < 4) {
    return len
  }
  return 3
}

function StateUpdateChar(index) {
  if (index < 4) {
    return 0
  }
  if (index < 10) {
    return index - 3
  }
  return index - 6
}
function $Chunker_0(this$static, encoder) {
  this$static.encoder = encoder
  this$static.decoder = null
  this$static.alive = 1
  return this$static
}
function $Chunker(this$static, decoder) {
  this$static.decoder = decoder
  this$static.encoder = null
  this$static.alive = 1
  return this$static
}
function $processChunk(this$static) {
  if (!this$static.alive) {
    throw new Error('bad state')
  }

  if (this$static.encoder) {
    $processEncoderChunk(this$static)
  } else {
    $processDecoderChunk(this$static)
  }

  return this$static.alive
}
function $processDecoderChunk(this$static) {
  var result = $CodeOneChunk(this$static.decoder)
  if (result == -1) {
    throw new Error('corrupted input')
  }
  this$static.inBytesProcessed = N1_longLit
  this$static.outBytesProcessed = this$static.decoder.nowPos64
  if (
    result ||
    (compare(this$static.decoder.outSize, P0_longLit) >= 0 &&
      compare(this$static.decoder.nowPos64, this$static.decoder.outSize) >= 0)
  ) {
    $Flush_0(this$static.decoder.m_OutWindow)
    $ReleaseStream(this$static.decoder.m_OutWindow)
    this$static.decoder.m_RangeDecoder.Stream = null
    this$static.alive = 0
  }
}
function $processEncoderChunk(this$static) {
  $CodeOneBlock(
    this$static.encoder,
    this$static.encoder.processedInSize,
    this$static.encoder.processedOutSize,
    this$static.encoder.finished
  )
  this$static.inBytesProcessed = this$static.encoder.processedInSize[0]
  if (this$static.encoder.finished[0]) {
    $ReleaseStreams(this$static.encoder)
    this$static.alive = 0
  }
}
function $CodeInChunks(this$static, inStream, outStream, outSize) {
  this$static.m_RangeDecoder.Stream = inStream
  $ReleaseStream(this$static.m_OutWindow)
  this$static.m_OutWindow._stream = outStream
  $Init_1(this$static)
  this$static.state = 0
  this$static.rep0 = 0
  this$static.rep1 = 0
  this$static.rep2 = 0
  this$static.rep3 = 0
  this$static.outSize = outSize
  this$static.nowPos64 = P0_longLit
  this$static.prevByte = 0
  return $Chunker({}, this$static)
}

function $CodeOneChunk(this$static) {
  var decoder2, distance, len, numDirectBits, posSlot, posState
  posState = lowBits_0(this$static.nowPos64) & this$static.m_PosStateMask
  if (
    !$DecodeBit(
      this$static.m_RangeDecoder,
      this$static.m_IsMatchDecoders,
      (this$static.state << 4) + posState
    )
  ) {
    decoder2 = $GetDecoder(
      this$static.m_LiteralDecoder,
      lowBits_0(this$static.nowPos64),
      this$static.prevByte
    )
    if (this$static.state < 7) {
      this$static.prevByte = $DecodeNormal(decoder2, this$static.m_RangeDecoder)
    } else {
      this$static.prevByte = $DecodeWithMatchByte(
        decoder2,
        this$static.m_RangeDecoder,
        $GetByte(this$static.m_OutWindow, this$static.rep0)
      )
    }
    $PutByte(this$static.m_OutWindow, this$static.prevByte)
    this$static.state = StateUpdateChar(this$static.state)
    this$static.nowPos64 = add(this$static.nowPos64, P1_longLit)
  } else {
    if (
      $DecodeBit(
        this$static.m_RangeDecoder,
        this$static.m_IsRepDecoders,
        this$static.state
      )
    ) {
      len = 0
      if (
        !$DecodeBit(
          this$static.m_RangeDecoder,
          this$static.m_IsRepG0Decoders,
          this$static.state
        )
      ) {
        if (
          !$DecodeBit(
            this$static.m_RangeDecoder,
            this$static.m_IsRep0LongDecoders,
            (this$static.state << 4) + posState
          )
        ) {
          this$static.state = this$static.state < 7 ? 9 : 11
          len = 1
        }
      } else {
        if (
          !$DecodeBit(
            this$static.m_RangeDecoder,
            this$static.m_IsRepG1Decoders,
            this$static.state
          )
        ) {
          distance = this$static.rep1
        } else {
          if (
            !$DecodeBit(
              this$static.m_RangeDecoder,
              this$static.m_IsRepG2Decoders,
              this$static.state
            )
          ) {
            distance = this$static.rep2
          } else {
            distance = this$static.rep3
            this$static.rep3 = this$static.rep2
          }
          this$static.rep2 = this$static.rep1
        }
        this$static.rep1 = this$static.rep0
        this$static.rep0 = distance
      }
      if (!len) {
        len =
          $Decode(
            this$static.m_RepLenDecoder,
            this$static.m_RangeDecoder,
            posState
          ) + 2
        this$static.state = this$static.state < 7 ? 8 : 11
      }
    } else {
      this$static.rep3 = this$static.rep2
      this$static.rep2 = this$static.rep1
      this$static.rep1 = this$static.rep0
      len =
        2 +
        $Decode(this$static.m_LenDecoder, this$static.m_RangeDecoder, posState)
      this$static.state = this$static.state < 7 ? 7 : 10
      posSlot = $Decode_0(
        this$static.m_PosSlotDecoder[GetLenToPosState(len)],
        this$static.m_RangeDecoder
      )
      if (posSlot >= 4) {
        numDirectBits = (posSlot >> 1) - 1
        this$static.rep0 = (2 | (posSlot & 1)) << numDirectBits
        if (posSlot < 14) {
          this$static.rep0 += ReverseDecode(
            this$static.m_PosDecoders,
            this$static.rep0 - posSlot - 1,
            this$static.m_RangeDecoder,
            numDirectBits
          )
        } else {
          this$static.rep0 +=
            $DecodeDirectBits(this$static.m_RangeDecoder, numDirectBits - 4) <<
            4
          this$static.rep0 += $ReverseDecode(
            this$static.m_PosAlignDecoder,
            this$static.m_RangeDecoder
          )
          if (this$static.rep0 < 0) {
            if (this$static.rep0 == -1) {
              return 1
            }
            return -1
          }
        }
      } else this$static.rep0 = posSlot
    }
    if (
      compare(fromInt(this$static.rep0), this$static.nowPos64) >= 0 ||
      this$static.rep0 >= this$static.m_DictionarySizeCheck
    ) {
      return -1
    }
    $CopyBlock(this$static.m_OutWindow, this$static.rep0, len)
    this$static.nowPos64 = add(this$static.nowPos64, fromInt(len))
    this$static.prevByte = $GetByte(this$static.m_OutWindow, 0)
  }
  return 0
}

function $Decoder(this$static) {
  this$static.m_OutWindow = {}
  this$static.m_RangeDecoder = {}
  this$static.m_IsMatchDecoders = initDim(192)
  this$static.m_IsRepDecoders = initDim(12)
  this$static.m_IsRepG0Decoders = initDim(12)
  this$static.m_IsRepG1Decoders = initDim(12)
  this$static.m_IsRepG2Decoders = initDim(12)
  this$static.m_IsRep0LongDecoders = initDim(192)
  this$static.m_PosSlotDecoder = initDim(4)
  this$static.m_PosDecoders = initDim(114)
  this$static.m_PosAlignDecoder = $BitTreeDecoder({}, 4)
  this$static.m_LenDecoder = $Decoder$LenDecoder({})
  this$static.m_RepLenDecoder = $Decoder$LenDecoder({})
  this$static.m_LiteralDecoder = {}
  for (var i = 0; i < 4; ++i) {
    this$static.m_PosSlotDecoder[i] = $BitTreeDecoder({}, 6)
  }
  return this$static
}

function $Init_1(this$static) {
  this$static.m_OutWindow._streamPos = 0
  this$static.m_OutWindow._pos = 0
  InitBitModels(this$static.m_IsMatchDecoders)
  InitBitModels(this$static.m_IsRep0LongDecoders)
  InitBitModels(this$static.m_IsRepDecoders)
  InitBitModels(this$static.m_IsRepG0Decoders)
  InitBitModels(this$static.m_IsRepG1Decoders)
  InitBitModels(this$static.m_IsRepG2Decoders)
  InitBitModels(this$static.m_PosDecoders)
  $Init_0(this$static.m_LiteralDecoder)
  for (var i = 0; i < 4; ++i) {
    InitBitModels(this$static.m_PosSlotDecoder[i].Models)
  }
  $Init(this$static.m_LenDecoder)
  $Init(this$static.m_RepLenDecoder)
  InitBitModels(this$static.m_PosAlignDecoder.Models)
  $Init_8(this$static.m_RangeDecoder)
}

function $SetDecoderProperties(this$static, properties) {
  var dictionarySize, i, lc, lp, pb, remainder, val
  if (properties.length < 5) return 0
  val = properties[0] & 255
  lc = val % 9
  remainder = ~~(val / 9)
  lp = remainder % 5
  pb = ~~(remainder / 5)
  dictionarySize = 0
  for (i = 0; i < 4; ++i) {
    dictionarySize += (properties[1 + i] & 255) << (i * 8)
  }
  // NOTE: If the input is bad, it might call for an insanely large dictionary size, which would crash the script.
  if (dictionarySize > 99999999 || !$SetLcLpPb(this$static, lc, lp, pb)) {
    return 0
  }
  return $SetDictionarySize(this$static, dictionarySize)
}

function $SetDictionarySize(this$static, dictionarySize) {
  if (dictionarySize < 0) {
    return 0
  }
  if (this$static.m_DictionarySize != dictionarySize) {
    this$static.m_DictionarySize = dictionarySize
    this$static.m_DictionarySizeCheck = Math.max(
      this$static.m_DictionarySize,
      1
    )
    $Create_5(
      this$static.m_OutWindow,
      Math.max(this$static.m_DictionarySizeCheck, 4096)
    )
  }
  return 1
}

function $SetLcLpPb(this$static, lc, lp, pb) {
  if (lc > 8 || lp > 4 || pb > 4) {
    return 0
  }
  $Create_0(this$static.m_LiteralDecoder, lp, lc)
  var numPosStates = 1 << pb
  $Create(this$static.m_LenDecoder, numPosStates)
  $Create(this$static.m_RepLenDecoder, numPosStates)
  this$static.m_PosStateMask = numPosStates - 1
  return 1
}

function $Create(this$static, numPosStates) {
  for (
    ;
    this$static.m_NumPosStates < numPosStates;
    ++this$static.m_NumPosStates
  ) {
    this$static.m_LowCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3)
    this$static.m_MidCoder[this$static.m_NumPosStates] = $BitTreeDecoder({}, 3)
  }
}

function $Decode(this$static, rangeDecoder, posState) {
  if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 0)) {
    return $Decode_0(this$static.m_LowCoder[posState], rangeDecoder)
  }
  var symbol = 8
  if (!$DecodeBit(rangeDecoder, this$static.m_Choice, 1)) {
    symbol += $Decode_0(this$static.m_MidCoder[posState], rangeDecoder)
  } else {
    symbol += 8 + $Decode_0(this$static.m_HighCoder, rangeDecoder)
  }
  return symbol
}

function $Decoder$LenDecoder(this$static) {
  this$static.m_Choice = initDim(2)
  this$static.m_LowCoder = initDim(16)
  this$static.m_MidCoder = initDim(16)
  this$static.m_HighCoder = $BitTreeDecoder({}, 8)
  this$static.m_NumPosStates = 0
  return this$static
}

function $Init(this$static) {
  InitBitModels(this$static.m_Choice)
  for (var posState = 0; posState < this$static.m_NumPosStates; ++posState) {
    InitBitModels(this$static.m_LowCoder[posState].Models)
    InitBitModels(this$static.m_MidCoder[posState].Models)
  }
  InitBitModels(this$static.m_HighCoder.Models)
}

function $Create_0(this$static, numPosBits, numPrevBits) {
  var i, numStates
  if (
    this$static.m_Coders != null &&
    this$static.m_NumPrevBits == numPrevBits &&
    this$static.m_NumPosBits == numPosBits
  )
    return
  this$static.m_NumPosBits = numPosBits
  this$static.m_PosMask = (1 << numPosBits) - 1
  this$static.m_NumPrevBits = numPrevBits
  numStates = 1 << (this$static.m_NumPrevBits + this$static.m_NumPosBits)
  this$static.m_Coders = initDim(numStates)
  for (i = 0; i < numStates; ++i)
    this$static.m_Coders[i] = $Decoder$LiteralDecoder$Decoder2({})
}

function $GetDecoder(this$static, pos, prevByte) {
  return this$static.m_Coders[
    ((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) +
      ((prevByte & 255) >>> (8 - this$static.m_NumPrevBits))
  ]
}

function $Init_0(this$static) {
  var i, numStates
  numStates = 1 << (this$static.m_NumPrevBits + this$static.m_NumPosBits)
  for (i = 0; i < numStates; ++i) {
    InitBitModels(this$static.m_Coders[i].m_Decoders)
  }
}

function $DecodeNormal(this$static, rangeDecoder) {
  var symbol = 1
  do {
    symbol =
      (symbol << 1) | $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol)
  } while (symbol < 256)
  return (symbol << 24) >> 24
}

function $DecodeWithMatchByte(this$static, rangeDecoder, matchByte) {
  var bit,
    matchBit,
    symbol = 1
  do {
    matchBit = (matchByte >> 7) & 1
    matchByte <<= 1
    bit = $DecodeBit(
      rangeDecoder,
      this$static.m_Decoders,
      ((1 + matchBit) << 8) + symbol
    )
    symbol = (symbol << 1) | bit
    if (matchBit != bit) {
      while (symbol < 256) {
        symbol =
          (symbol << 1) |
          $DecodeBit(rangeDecoder, this$static.m_Decoders, symbol)
      }
      break
    }
  } while (symbol < 256)
  return (symbol << 24) >> 24
}

function $Decoder$LiteralDecoder$Decoder2(this$static) {
  this$static.m_Decoders = initDim(768)
  return this$static
}
var g_FastPos = (function() {
  var j,
    k,
    slotFast,
    c = 2,
    g_FastPos = [0, 1]
  for (slotFast = 2; slotFast < 22; ++slotFast) {
    k = 1 << ((slotFast >> 1) - 1)
    for (j = 0; j < k; ++j, ++c) g_FastPos[c] = (slotFast << 24) >> 24
  }
  return g_FastPos
})()

function $Backward(this$static, cur) {
  var backCur, backMem, posMem, posPrev
  this$static._optimumEndIndex = cur
  posMem = this$static._optimum[cur].PosPrev
  backMem = this$static._optimum[cur].BackPrev
  do {
    if (this$static._optimum[cur].Prev1IsChar) {
      $MakeAsChar(this$static._optimum[posMem])
      this$static._optimum[posMem].PosPrev = posMem - 1
      if (this$static._optimum[cur].Prev2) {
        this$static._optimum[posMem - 1].Prev1IsChar = 0
        this$static._optimum[posMem - 1].PosPrev =
          this$static._optimum[cur].PosPrev2
        this$static._optimum[posMem - 1].BackPrev =
          this$static._optimum[cur].BackPrev2
      }
    }
    posPrev = posMem
    backCur = backMem
    backMem = this$static._optimum[posPrev].BackPrev
    posMem = this$static._optimum[posPrev].PosPrev
    this$static._optimum[posPrev].BackPrev = backCur
    this$static._optimum[posPrev].PosPrev = cur
    cur = posPrev
  } while (cur > 0)
  this$static.backRes = this$static._optimum[0].BackPrev
  this$static._optimumCurrentIndex = this$static._optimum[0].PosPrev
  return this$static._optimumCurrentIndex
}

function $BaseInit(this$static) {
  this$static._state = 0
  this$static._previousByte = 0
  for (var i = 0; i < 4; ++i) {
    this$static._repDistances[i] = 0
  }
}

function $CodeOneBlock(this$static, inSize, outSize, finished) {
  var baseVal,
    complexState,
    curByte,
    distance,
    footerBits,
    i,
    len,
    lenToPosState,
    matchByte,
    pos,
    posReduced,
    posSlot,
    posState,
    progressPosValuePrev,
    subCoder
  inSize[0] = P0_longLit
  outSize[0] = P0_longLit
  finished[0] = 1
  if (this$static._inStream) {
    this$static._matchFinder._stream = this$static._inStream
    $Init_5(this$static._matchFinder)
    this$static._needReleaseMFStream = 1
    this$static._inStream = null
  }
  if (this$static._finished) {
    return
  }
  this$static._finished = 1
  progressPosValuePrev = this$static.nowPos64
  if (eq(this$static.nowPos64, P0_longLit)) {
    if (!$GetNumAvailableBytes(this$static._matchFinder)) {
      $Flush(this$static, lowBits_0(this$static.nowPos64))
      return
    }
    $ReadMatchDistances(this$static)
    posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask
    $Encode_3(
      this$static._rangeEncoder,
      this$static._isMatch,
      (this$static._state << 4) + posState,
      0
    )
    this$static._state = StateUpdateChar(this$static._state)
    curByte = $GetIndexByte(
      this$static._matchFinder,
      -this$static._additionalOffset
    )
    $Encode_1(
      $GetSubCoder(
        this$static._literalEncoder,
        lowBits_0(this$static.nowPos64),
        this$static._previousByte
      ),
      this$static._rangeEncoder,
      curByte
    )
    this$static._previousByte = curByte
    --this$static._additionalOffset
    this$static.nowPos64 = add(this$static.nowPos64, P1_longLit)
  }
  if (!$GetNumAvailableBytes(this$static._matchFinder)) {
    $Flush(this$static, lowBits_0(this$static.nowPos64))
    return
  }
  while (1) {
    len = $GetOptimum(this$static, lowBits_0(this$static.nowPos64))
    pos = this$static.backRes
    posState = lowBits_0(this$static.nowPos64) & this$static._posStateMask
    complexState = (this$static._state << 4) + posState
    if (len == 1 && pos == -1) {
      $Encode_3(
        this$static._rangeEncoder,
        this$static._isMatch,
        complexState,
        0
      )
      curByte = $GetIndexByte(
        this$static._matchFinder,
        -this$static._additionalOffset
      )
      subCoder = $GetSubCoder(
        this$static._literalEncoder,
        lowBits_0(this$static.nowPos64),
        this$static._previousByte
      )
      if (this$static._state < 7) {
        $Encode_1(subCoder, this$static._rangeEncoder, curByte)
      } else {
        matchByte = $GetIndexByte(
          this$static._matchFinder,
          -this$static._repDistances[0] - 1 - this$static._additionalOffset
        )
        $EncodeMatched(subCoder, this$static._rangeEncoder, matchByte, curByte)
      }
      this$static._previousByte = curByte
      this$static._state = StateUpdateChar(this$static._state)
    } else {
      $Encode_3(
        this$static._rangeEncoder,
        this$static._isMatch,
        complexState,
        1
      )
      if (pos < 4) {
        $Encode_3(
          this$static._rangeEncoder,
          this$static._isRep,
          this$static._state,
          1
        )
        if (!pos) {
          $Encode_3(
            this$static._rangeEncoder,
            this$static._isRepG0,
            this$static._state,
            0
          )
          if (len == 1) {
            $Encode_3(
              this$static._rangeEncoder,
              this$static._isRep0Long,
              complexState,
              0
            )
          } else {
            $Encode_3(
              this$static._rangeEncoder,
              this$static._isRep0Long,
              complexState,
              1
            )
          }
        } else {
          $Encode_3(
            this$static._rangeEncoder,
            this$static._isRepG0,
            this$static._state,
            1
          )
          if (pos == 1) {
            $Encode_3(
              this$static._rangeEncoder,
              this$static._isRepG1,
              this$static._state,
              0
            )
          } else {
            $Encode_3(
              this$static._rangeEncoder,
              this$static._isRepG1,
              this$static._state,
              1
            )
            $Encode_3(
              this$static._rangeEncoder,
              this$static._isRepG2,
              this$static._state,
              pos - 2
            )
          }
        }
        if (len == 1) {
          this$static._state = this$static._state < 7 ? 9 : 11
        } else {
          $Encode_0(
            this$static._repMatchLenEncoder,
            this$static._rangeEncoder,
            len - 2,
            posState
          )
          this$static._state = this$static._state < 7 ? 8 : 11
        }
        distance = this$static._repDistances[pos]
        if (pos != 0) {
          for (i = pos; i >= 1; --i) {
            this$static._repDistances[i] = this$static._repDistances[i - 1]
          }
          this$static._repDistances[0] = distance
        }
      } else {
        $Encode_3(
          this$static._rangeEncoder,
          this$static._isRep,
          this$static._state,
          0
        )
        this$static._state = this$static._state < 7 ? 7 : 10
        $Encode_0(
          this$static._lenEncoder,
          this$static._rangeEncoder,
          len - 2,
          posState
        )
        pos -= 4
        posSlot = GetPosSlot(pos)
        lenToPosState = GetLenToPosState(len)
        $Encode_2(
          this$static._posSlotEncoder[lenToPosState],
          this$static._rangeEncoder,
          posSlot
        )
        if (posSlot >= 4) {
          footerBits = (posSlot >> 1) - 1
          baseVal = (2 | (posSlot & 1)) << footerBits
          posReduced = pos - baseVal
          if (posSlot < 14) {
            ReverseEncode(
              this$static._posEncoders,
              baseVal - posSlot - 1,
              this$static._rangeEncoder,
              footerBits,
              posReduced
            )
          } else {
            $EncodeDirectBits(
              this$static._rangeEncoder,
              posReduced >> 4,
              footerBits - 4
            )
            $ReverseEncode(
              this$static._posAlignEncoder,
              this$static._rangeEncoder,
              posReduced & 15
            )
            ++this$static._alignPriceCount
          }
        }
        distance = pos
        for (i = 3; i >= 1; --i) {
          this$static._repDistances[i] = this$static._repDistances[i - 1]
        }
        this$static._repDistances[0] = distance
        ++this$static._matchPriceCount
      }
      this$static._previousByte = $GetIndexByte(
        this$static._matchFinder,
        len - 1 - this$static._additionalOffset
      )
    }
    this$static._additionalOffset -= len
    this$static.nowPos64 = add(this$static.nowPos64, fromInt(len))
    if (!this$static._additionalOffset) {
      if (this$static._matchPriceCount >= 128) {
        $FillDistancesPrices(this$static)
      }
      if (this$static._alignPriceCount >= 16) {
        $FillAlignPrices(this$static)
      }
      inSize[0] = this$static.nowPos64
      outSize[0] = $GetProcessedSizeAdd(this$static._rangeEncoder)
      if (!$GetNumAvailableBytes(this$static._matchFinder)) {
        $Flush(this$static, lowBits_0(this$static.nowPos64))
        return
      }
      if (
        compare(sub(this$static.nowPos64, progressPosValuePrev), [4096, 0]) >= 0
      ) {
        this$static._finished = 0
        finished[0] = 0
        return
      }
    }
  }
}

function $Create_2(this$static) {
  var bt, numHashBytes
  if (!this$static._matchFinder) {
    bt = {}
    numHashBytes = 4
    if (!this$static._matchFinderType) {
      numHashBytes = 2
    }
    $SetType(bt, numHashBytes)
    this$static._matchFinder = bt
  }
  $Create_1(
    this$static._literalEncoder,
    this$static._numLiteralPosStateBits,
    this$static._numLiteralContextBits
  )
  if (
    this$static._dictionarySize == this$static._dictionarySizePrev &&
    this$static._numFastBytesPrev == this$static._numFastBytes
  ) {
    return
  }
  $Create_3(
    this$static._matchFinder,
    this$static._dictionarySize,
    4096,
    this$static._numFastBytes,
    274
  )
  this$static._dictionarySizePrev = this$static._dictionarySize
  this$static._numFastBytesPrev = this$static._numFastBytes
}

function $Encoder(this$static) {
  var i
  this$static._repDistances = initDim(4)
  this$static._optimum = []
  this$static._rangeEncoder = {}
  this$static._isMatch = initDim(192)
  this$static._isRep = initDim(12)
  this$static._isRepG0 = initDim(12)
  this$static._isRepG1 = initDim(12)
  this$static._isRepG2 = initDim(12)
  this$static._isRep0Long = initDim(192)
  this$static._posSlotEncoder = []
  this$static._posEncoders = initDim(114)
  this$static._posAlignEncoder = $BitTreeEncoder({}, 4)
  this$static._lenEncoder = $Encoder$LenPriceTableEncoder({})
  this$static._repMatchLenEncoder = $Encoder$LenPriceTableEncoder({})
  this$static._literalEncoder = {}
  this$static._matchDistances = []
  this$static._posSlotPrices = []
  this$static._distancesPrices = []
  this$static._alignPrices = initDim(16)
  this$static.reps = initDim(4)
  this$static.repLens = initDim(4)
  this$static.processedInSize = [P0_longLit]
  this$static.processedOutSize = [P0_longLit]
  this$static.finished = [0]
  this$static.properties = initDim(5)
  this$static.tempPrices = initDim(128)
  this$static._longestMatchLength = 0
  this$static._matchFinderType = 1
  this$static._numDistancePairs = 0
  this$static._numFastBytesPrev = -1
  this$static.backRes = 0
  for (i = 0; i < 4096; ++i) {
    this$static._optimum[i] = {}
  }
  for (i = 0; i < 4; ++i) {
    this$static._posSlotEncoder[i] = $BitTreeEncoder({}, 6)
  }
  return this$static
}

function $FillAlignPrices(this$static) {
  for (var i = 0; i < 16; ++i) {
    this$static._alignPrices[i] = $ReverseGetPrice(
      this$static._posAlignEncoder,
      i
    )
  }
  this$static._alignPriceCount = 0
}

function $FillDistancesPrices(this$static) {
  var baseVal, encoder, footerBits, i, lenToPosState, posSlot, st, st2
  for (i = 4; i < 128; ++i) {
    posSlot = GetPosSlot(i)
    footerBits = (posSlot >> 1) - 1
    baseVal = (2 | (posSlot & 1)) << footerBits
    this$static.tempPrices[i] = ReverseGetPrice(
      this$static._posEncoders,
      baseVal - posSlot - 1,
      footerBits,
      i - baseVal
    )
  }
  for (lenToPosState = 0; lenToPosState < 4; ++lenToPosState) {
    encoder = this$static._posSlotEncoder[lenToPosState]
    st = lenToPosState << 6
    for (posSlot = 0; posSlot < this$static._distTableSize; ++posSlot) {
      this$static._posSlotPrices[st + posSlot] = $GetPrice_1(encoder, posSlot)
    }
    for (posSlot = 14; posSlot < this$static._distTableSize; ++posSlot) {
      this$static._posSlotPrices[st + posSlot] += ((posSlot >> 1) - 1 - 4) << 6
    }
    st2 = lenToPosState * 128
    for (i = 0; i < 4; ++i) {
      this$static._distancesPrices[st2 + i] = this$static._posSlotPrices[st + i]
    }
    for (; i < 128; ++i) {
      this$static._distancesPrices[st2 + i] =
        this$static._posSlotPrices[st + GetPosSlot(i)] +
        this$static.tempPrices[i]
    }
  }
  this$static._matchPriceCount = 0
}

function $Flush(this$static, nowPos) {
  $ReleaseMFStream(this$static)
  $WriteEndMarker(this$static, nowPos & this$static._posStateMask)
  for (var i = 0; i < 5; ++i) {
    $ShiftLow(this$static._rangeEncoder)
  }
}

function $GetOptimum(this$static, position) {
  var cur,
    curAnd1Price,
    curAndLenCharPrice,
    curAndLenPrice,
    curBack,
    curPrice,
    currentByte,
    distance,
    i,
    len,
    lenEnd,
    lenMain,
    lenRes,
    lenTest,
    lenTest2,
    lenTestTemp,
    matchByte,
    matchPrice,
    newLen,
    nextIsChar,
    nextMatchPrice,
    nextOptimum,
    nextRepMatchPrice,
    normalMatchPrice,
    numAvailableBytes,
    numAvailableBytesFull,
    numDistancePairs,
    offs,
    offset,
    opt,
    optimum,
    pos,
    posPrev,
    posState,
    posStateNext,
    price_4,
    repIndex,
    repLen,
    repMatchPrice,
    repMaxIndex,
    shortRepPrice,
    startLen,
    state,
    state2,
    t,
    price,
    price_0,
    price_1,
    price_2,
    price_3
  if (this$static._optimumEndIndex != this$static._optimumCurrentIndex) {
    lenRes =
      this$static._optimum[this$static._optimumCurrentIndex].PosPrev -
      this$static._optimumCurrentIndex
    this$static.backRes =
      this$static._optimum[this$static._optimumCurrentIndex].BackPrev
    this$static._optimumCurrentIndex =
      this$static._optimum[this$static._optimumCurrentIndex].PosPrev
    return lenRes
  }
  this$static._optimumCurrentIndex = this$static._optimumEndIndex = 0
  if (this$static._longestMatchWasFound) {
    lenMain = this$static._longestMatchLength
    this$static._longestMatchWasFound = 0
  } else {
    lenMain = $ReadMatchDistances(this$static)
  }
  numDistancePairs = this$static._numDistancePairs
  numAvailableBytes = $GetNumAvailableBytes(this$static._matchFinder) + 1
  if (numAvailableBytes < 2) {
    this$static.backRes = -1
    return 1
  }
  if (numAvailableBytes > 273) {
    numAvailableBytes = 273
  }
  repMaxIndex = 0
  for (i = 0; i < 4; ++i) {
    this$static.reps[i] = this$static._repDistances[i]
    this$static.repLens[i] = $GetMatchLen(
      this$static._matchFinder,
      -1,
      this$static.reps[i],
      273
    )
    if (this$static.repLens[i] > this$static.repLens[repMaxIndex]) {
      repMaxIndex = i
    }
  }
  if (this$static.repLens[repMaxIndex] >= this$static._numFastBytes) {
    this$static.backRes = repMaxIndex
    lenRes = this$static.repLens[repMaxIndex]
    $MovePos(this$static, lenRes - 1)
    return lenRes
  }
  if (lenMain >= this$static._numFastBytes) {
    this$static.backRes = this$static._matchDistances[numDistancePairs - 1] + 4
    $MovePos(this$static, lenMain - 1)
    return lenMain
  }
  currentByte = $GetIndexByte(this$static._matchFinder, -1)
  matchByte = $GetIndexByte(
    this$static._matchFinder,
    -this$static._repDistances[0] - 1 - 1
  )
  if (
    lenMain < 2 &&
    currentByte != matchByte &&
    this$static.repLens[repMaxIndex] < 2
  ) {
    this$static.backRes = -1
    return 1
  }
  this$static._optimum[0].State = this$static._state
  posState = position & this$static._posStateMask
  this$static._optimum[1].Price =
    ProbPrices[
      this$static._isMatch[(this$static._state << 4) + posState] >>> 2
    ] +
    $GetPrice_0(
      $GetSubCoder(
        this$static._literalEncoder,
        position,
        this$static._previousByte
      ),
      this$static._state >= 7,
      matchByte,
      currentByte
    )
  $MakeAsChar(this$static._optimum[1])
  matchPrice =
    ProbPrices[
      (2048 - this$static._isMatch[(this$static._state << 4) + posState]) >>> 2
    ]
  repMatchPrice =
    matchPrice +
    ProbPrices[(2048 - this$static._isRep[this$static._state]) >>> 2]
  if (matchByte == currentByte) {
    shortRepPrice =
      repMatchPrice +
      $GetRepLen1Price(this$static, this$static._state, posState)
    if (shortRepPrice < this$static._optimum[1].Price) {
      this$static._optimum[1].Price = shortRepPrice
      $MakeAsShortRep(this$static._optimum[1])
    }
  }
  lenEnd =
    lenMain >= this$static.repLens[repMaxIndex]
      ? lenMain
      : this$static.repLens[repMaxIndex]
  if (lenEnd < 2) {
    this$static.backRes = this$static._optimum[1].BackPrev
    return 1
  }
  this$static._optimum[1].PosPrev = 0
  this$static._optimum[0].Backs0 = this$static.reps[0]
  this$static._optimum[0].Backs1 = this$static.reps[1]
  this$static._optimum[0].Backs2 = this$static.reps[2]
  this$static._optimum[0].Backs3 = this$static.reps[3]
  len = lenEnd
  do {
    this$static._optimum[len--].Price = 268435455
  } while (len >= 2)
  for (i = 0; i < 4; ++i) {
    repLen = this$static.repLens[i]
    if (repLen < 2) {
      continue
    }
    price_4 =
      repMatchPrice +
      $GetPureRepPrice(this$static, i, this$static._state, posState)
    do {
      curAndLenPrice =
        price_4 +
        $GetPrice(this$static._repMatchLenEncoder, repLen - 2, posState)
      optimum = this$static._optimum[repLen]
      if (curAndLenPrice < optimum.Price) {
        optimum.Price = curAndLenPrice
        optimum.PosPrev = 0
        optimum.BackPrev = i
        optimum.Prev1IsChar = 0
      }
    } while (--repLen >= 2)
  }
  normalMatchPrice =
    matchPrice + ProbPrices[this$static._isRep[this$static._state] >>> 2]
  len = this$static.repLens[0] >= 2 ? this$static.repLens[0] + 1 : 2
  if (len <= lenMain) {
    offs = 0
    while (len > this$static._matchDistances[offs]) {
      offs += 2
    }
    for (; ; ++len) {
      distance = this$static._matchDistances[offs + 1]
      curAndLenPrice =
        normalMatchPrice + $GetPosLenPrice(this$static, distance, len, posState)
      optimum = this$static._optimum[len]
      if (curAndLenPrice < optimum.Price) {
        optimum.Price = curAndLenPrice
        optimum.PosPrev = 0
        optimum.BackPrev = distance + 4
        optimum.Prev1IsChar = 0
      }
      if (len == this$static._matchDistances[offs]) {
        offs += 2
        if (offs == numDistancePairs) {
          break
        }
      }
    }
  }
  cur = 0
  while (1) {
    ++cur
    if (cur == lenEnd) {
      return $Backward(this$static, cur)
    }
    newLen = $ReadMatchDistances(this$static)
    numDistancePairs = this$static._numDistancePairs
    if (newLen >= this$static._numFastBytes) {
      this$static._longestMatchLength = newLen
      this$static._longestMatchWasFound = 1
      return $Backward(this$static, cur)
    }
    ++position
    posPrev = this$static._optimum[cur].PosPrev
    if (this$static._optimum[cur].Prev1IsChar) {
      --posPrev
      if (this$static._optimum[cur].Prev2) {
        state = this$static._optimum[this$static._optimum[cur].PosPrev2].State
        if (this$static._optimum[cur].BackPrev2 < 4) {
          state = state < 7 ? 8 : 11
        } else {
          state = state < 7 ? 7 : 10
        }
      } else {
        state = this$static._optimum[posPrev].State
      }
      state = StateUpdateChar(state)
    } else {
      state = this$static._optimum[posPrev].State
    }
    if (posPrev == cur - 1) {
      if (!this$static._optimum[cur].BackPrev) {
        state = state < 7 ? 9 : 11
      } else {
        state = StateUpdateChar(state)
      }
    } else {
      if (
        this$static._optimum[cur].Prev1IsChar &&
        this$static._optimum[cur].Prev2
      ) {
        posPrev = this$static._optimum[cur].PosPrev2
        pos = this$static._optimum[cur].BackPrev2
        state = state < 7 ? 8 : 11
      } else {
        pos = this$static._optimum[cur].BackPrev
        if (pos < 4) {
          state = state < 7 ? 8 : 11
        } else {
          state = state < 7 ? 7 : 10
        }
      }
      opt = this$static._optimum[posPrev]
      if (pos < 4) {
        if (!pos) {
          this$static.reps[0] = opt.Backs0
          this$static.reps[1] = opt.Backs1
          this$static.reps[2] = opt.Backs2
          this$static.reps[3] = opt.Backs3
        } else if (pos == 1) {
          this$static.reps[0] = opt.Backs1
          this$static.reps[1] = opt.Backs0
          this$static.reps[2] = opt.Backs2
          this$static.reps[3] = opt.Backs3
        } else if (pos == 2) {
          this$static.reps[0] = opt.Backs2
          this$static.reps[1] = opt.Backs0
          this$static.reps[2] = opt.Backs1
          this$static.reps[3] = opt.Backs3
        } else {
          this$static.reps[0] = opt.Backs3
          this$static.reps[1] = opt.Backs0
          this$static.reps[2] = opt.Backs1
          this$static.reps[3] = opt.Backs2
        }
      } else {
        this$static.reps[0] = pos - 4
        this$static.reps[1] = opt.Backs0
        this$static.reps[2] = opt.Backs1
        this$static.reps[3] = opt.Backs2
      }
    }
    this$static._optimum[cur].State = state
    this$static._optimum[cur].Backs0 = this$static.reps[0]
    this$static._optimum[cur].Backs1 = this$static.reps[1]
    this$static._optimum[cur].Backs2 = this$static.reps[2]
    this$static._optimum[cur].Backs3 = this$static.reps[3]
    curPrice = this$static._optimum[cur].Price
    currentByte = $GetIndexByte(this$static._matchFinder, -1)
    matchByte = $GetIndexByte(
      this$static._matchFinder,
      -this$static.reps[0] - 1 - 1
    )
    posState = position & this$static._posStateMask
    curAnd1Price =
      curPrice +
      ProbPrices[this$static._isMatch[(state << 4) + posState] >>> 2] +
      $GetPrice_0(
        $GetSubCoder(
          this$static._literalEncoder,
          position,
          $GetIndexByte(this$static._matchFinder, -2)
        ),
        state >= 7,
        matchByte,
        currentByte
      )
    nextOptimum = this$static._optimum[cur + 1]
    nextIsChar = 0
    if (curAnd1Price < nextOptimum.Price) {
      nextOptimum.Price = curAnd1Price
      nextOptimum.PosPrev = cur
      nextOptimum.BackPrev = -1
      nextOptimum.Prev1IsChar = 0
      nextIsChar = 1
    }
    matchPrice =
      curPrice +
      ProbPrices[(2048 - this$static._isMatch[(state << 4) + posState]) >>> 2]
    repMatchPrice =
      matchPrice + ProbPrices[(2048 - this$static._isRep[state]) >>> 2]
    if (
      matchByte == currentByte &&
      !(nextOptimum.PosPrev < cur && !nextOptimum.BackPrev)
    ) {
      shortRepPrice =
        repMatchPrice +
        (ProbPrices[this$static._isRepG0[state] >>> 2] +
          ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2])
      if (shortRepPrice <= nextOptimum.Price) {
        nextOptimum.Price = shortRepPrice
        nextOptimum.PosPrev = cur
        nextOptimum.BackPrev = 0
        nextOptimum.Prev1IsChar = 0
        nextIsChar = 1
      }
    }
    numAvailableBytesFull = $GetNumAvailableBytes(this$static._matchFinder) + 1
    numAvailableBytesFull =
      4095 - cur < numAvailableBytesFull ? 4095 - cur : numAvailableBytesFull
    numAvailableBytes = numAvailableBytesFull
    if (numAvailableBytes < 2) {
      continue
    }
    if (numAvailableBytes > this$static._numFastBytes) {
      numAvailableBytes = this$static._numFastBytes
    }
    if (!nextIsChar && matchByte != currentByte) {
      t = Math.min(numAvailableBytesFull - 1, this$static._numFastBytes)
      lenTest2 = $GetMatchLen(
        this$static._matchFinder,
        0,
        this$static.reps[0],
        t
      )
      if (lenTest2 >= 2) {
        state2 = StateUpdateChar(state)
        posStateNext = (position + 1) & this$static._posStateMask
        nextRepMatchPrice =
          curAnd1Price +
          ProbPrices[
            (2048 - this$static._isMatch[(state2 << 4) + posStateNext]) >>> 2
          ] +
          ProbPrices[(2048 - this$static._isRep[state2]) >>> 2]
        offset = cur + 1 + lenTest2
        while (lenEnd < offset) {
          this$static._optimum[++lenEnd].Price = 268435455
        }
        curAndLenPrice =
          nextRepMatchPrice +
          ((price = $GetPrice(
            this$static._repMatchLenEncoder,
            lenTest2 - 2,
            posStateNext
          )),
          price + $GetPureRepPrice(this$static, 0, state2, posStateNext))
        optimum = this$static._optimum[offset]
        if (curAndLenPrice < optimum.Price) {
          optimum.Price = curAndLenPrice
          optimum.PosPrev = cur + 1
          optimum.BackPrev = 0
          optimum.Prev1IsChar = 1
          optimum.Prev2 = 0
        }
      }
    }
    startLen = 2
    for (repIndex = 0; repIndex < 4; ++repIndex) {
      lenTest = $GetMatchLen(
        this$static._matchFinder,
        -1,
        this$static.reps[repIndex],
        numAvailableBytes
      )
      if (lenTest < 2) {
        continue
      }
      lenTestTemp = lenTest
      do {
        while (lenEnd < cur + lenTest) {
          this$static._optimum[++lenEnd].Price = 268435455
        }
        curAndLenPrice =
          repMatchPrice +
          ((price_0 = $GetPrice(
            this$static._repMatchLenEncoder,
            lenTest - 2,
            posState
          )),
          price_0 + $GetPureRepPrice(this$static, repIndex, state, posState))
        optimum = this$static._optimum[cur + lenTest]
        if (curAndLenPrice < optimum.Price) {
          optimum.Price = curAndLenPrice
          optimum.PosPrev = cur
          optimum.BackPrev = repIndex
          optimum.Prev1IsChar = 0
        }
      } while (--lenTest >= 2)
      lenTest = lenTestTemp
      if (!repIndex) {
        startLen = lenTest + 1
      }
      if (lenTest < numAvailableBytesFull) {
        t = Math.min(
          numAvailableBytesFull - 1 - lenTest,
          this$static._numFastBytes
        )
        lenTest2 = $GetMatchLen(
          this$static._matchFinder,
          lenTest,
          this$static.reps[repIndex],
          t
        )
        if (lenTest2 >= 2) {
          state2 = state < 7 ? 8 : 11
          posStateNext = (position + lenTest) & this$static._posStateMask
          curAndLenCharPrice =
            repMatchPrice +
            ((price_1 = $GetPrice(
              this$static._repMatchLenEncoder,
              lenTest - 2,
              posState
            )),
            price_1 +
              $GetPureRepPrice(this$static, repIndex, state, posState)) +
            ProbPrices[
              this$static._isMatch[(state2 << 4) + posStateNext] >>> 2
            ] +
            $GetPrice_0(
              $GetSubCoder(
                this$static._literalEncoder,
                position + lenTest,
                $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)
              ),
              1,
              $GetIndexByte(
                this$static._matchFinder,
                lenTest - 1 - (this$static.reps[repIndex] + 1)
              ),
              $GetIndexByte(this$static._matchFinder, lenTest - 1)
            )
          state2 = StateUpdateChar(state2)
          posStateNext = (position + lenTest + 1) & this$static._posStateMask
          nextMatchPrice =
            curAndLenCharPrice +
            ProbPrices[
              (2048 - this$static._isMatch[(state2 << 4) + posStateNext]) >>> 2
            ]
          nextRepMatchPrice =
            nextMatchPrice +
            ProbPrices[(2048 - this$static._isRep[state2]) >>> 2]
          offset = lenTest + 1 + lenTest2
          while (lenEnd < cur + offset) {
            this$static._optimum[++lenEnd].Price = 268435455
          }
          curAndLenPrice =
            nextRepMatchPrice +
            ((price_2 = $GetPrice(
              this$static._repMatchLenEncoder,
              lenTest2 - 2,
              posStateNext
            )),
            price_2 + $GetPureRepPrice(this$static, 0, state2, posStateNext))
          optimum = this$static._optimum[cur + offset]
          if (curAndLenPrice < optimum.Price) {
            optimum.Price = curAndLenPrice
            optimum.PosPrev = cur + lenTest + 1
            optimum.BackPrev = 0
            optimum.Prev1IsChar = 1
            optimum.Prev2 = 1
            optimum.PosPrev2 = cur
            optimum.BackPrev2 = repIndex
          }
        }
      }
    }
    if (newLen > numAvailableBytes) {
      newLen = numAvailableBytes
      for (
        numDistancePairs = 0;
        newLen > this$static._matchDistances[numDistancePairs];
        numDistancePairs += 2
      ) {}
      this$static._matchDistances[numDistancePairs] = newLen
      numDistancePairs += 2
    }
    if (newLen >= startLen) {
      normalMatchPrice =
        matchPrice + ProbPrices[this$static._isRep[state] >>> 2]
      while (lenEnd < cur + newLen) {
        this$static._optimum[++lenEnd].Price = 268435455
      }
      offs = 0
      while (startLen > this$static._matchDistances[offs]) {
        offs += 2
      }
      for (lenTest = startLen; ; ++lenTest) {
        curBack = this$static._matchDistances[offs + 1]
        curAndLenPrice =
          normalMatchPrice +
          $GetPosLenPrice(this$static, curBack, lenTest, posState)
        optimum = this$static._optimum[cur + lenTest]
        if (curAndLenPrice < optimum.Price) {
          optimum.Price = curAndLenPrice
          optimum.PosPrev = cur
          optimum.BackPrev = curBack + 4
          optimum.Prev1IsChar = 0
        }
        if (lenTest == this$static._matchDistances[offs]) {
          if (lenTest < numAvailableBytesFull) {
            t = Math.min(
              numAvailableBytesFull - 1 - lenTest,
              this$static._numFastBytes
            )
            lenTest2 = $GetMatchLen(
              this$static._matchFinder,
              lenTest,
              curBack,
              t
            )
            if (lenTest2 >= 2) {
              state2 = state < 7 ? 7 : 10
              posStateNext = (position + lenTest) & this$static._posStateMask
              curAndLenCharPrice =
                curAndLenPrice +
                ProbPrices[
                  this$static._isMatch[(state2 << 4) + posStateNext] >>> 2
                ] +
                $GetPrice_0(
                  $GetSubCoder(
                    this$static._literalEncoder,
                    position + lenTest,
                    $GetIndexByte(this$static._matchFinder, lenTest - 1 - 1)
                  ),
                  1,
                  $GetIndexByte(
                    this$static._matchFinder,
                    lenTest - (curBack + 1) - 1
                  ),
                  $GetIndexByte(this$static._matchFinder, lenTest - 1)
                )
              state2 = StateUpdateChar(state2)
              posStateNext =
                (position + lenTest + 1) & this$static._posStateMask
              nextMatchPrice =
                curAndLenCharPrice +
                ProbPrices[
                  (2048 -
                    this$static._isMatch[(state2 << 4) + posStateNext]) >>>
                    2
                ]
              nextRepMatchPrice =
                nextMatchPrice +
                ProbPrices[(2048 - this$static._isRep[state2]) >>> 2]
              offset = lenTest + 1 + lenTest2
              while (lenEnd < cur + offset) {
                this$static._optimum[++lenEnd].Price = 268435455
              }
              curAndLenPrice =
                nextRepMatchPrice +
                ((price_3 = $GetPrice(
                  this$static._repMatchLenEncoder,
                  lenTest2 - 2,
                  posStateNext
                )),
                price_3 +
                  $GetPureRepPrice(this$static, 0, state2, posStateNext))
              optimum = this$static._optimum[cur + offset]
              if (curAndLenPrice < optimum.Price) {
                optimum.Price = curAndLenPrice
                optimum.PosPrev = cur + lenTest + 1
                optimum.BackPrev = 0
                optimum.Prev1IsChar = 1
                optimum.Prev2 = 1
                optimum.PosPrev2 = cur
                optimum.BackPrev2 = curBack + 4
              }
            }
          }
          offs += 2
          if (offs == numDistancePairs) break
        }
      }
    }
  }
}

function $GetPosLenPrice(this$static, pos, len, posState) {
  var price,
    lenToPosState = GetLenToPosState(len)
  if (pos < 128) {
    price = this$static._distancesPrices[lenToPosState * 128 + pos]
  } else {
    price =
      this$static._posSlotPrices[(lenToPosState << 6) + GetPosSlot2(pos)] +
      this$static._alignPrices[pos & 15]
  }
  return price + $GetPrice(this$static._lenEncoder, len - 2, posState)
}

function $GetPureRepPrice(this$static, repIndex, state, posState) {
  var price
  if (!repIndex) {
    price = ProbPrices[this$static._isRepG0[state] >>> 2]
    price +=
      ProbPrices[
        (2048 - this$static._isRep0Long[(state << 4) + posState]) >>> 2
      ]
  } else {
    price = ProbPrices[(2048 - this$static._isRepG0[state]) >>> 2]
    if (repIndex == 1) {
      price += ProbPrices[this$static._isRepG1[state] >>> 2]
    } else {
      price += ProbPrices[(2048 - this$static._isRepG1[state]) >>> 2]
      price += GetPrice(this$static._isRepG2[state], repIndex - 2)
    }
  }
  return price
}

function $GetRepLen1Price(this$static, state, posState) {
  return (
    ProbPrices[this$static._isRepG0[state] >>> 2] +
    ProbPrices[this$static._isRep0Long[(state << 4) + posState] >>> 2]
  )
}

function $Init_4(this$static) {
  $BaseInit(this$static)
  $Init_9(this$static._rangeEncoder)
  InitBitModels(this$static._isMatch)
  InitBitModels(this$static._isRep0Long)
  InitBitModels(this$static._isRep)
  InitBitModels(this$static._isRepG0)
  InitBitModels(this$static._isRepG1)
  InitBitModels(this$static._isRepG2)
  InitBitModels(this$static._posEncoders)
  $Init_3(this$static._literalEncoder)
  for (var i = 0; i < 4; ++i) {
    InitBitModels(this$static._posSlotEncoder[i].Models)
  }
  $Init_2(this$static._lenEncoder, 1 << this$static._posStateBits)
  $Init_2(this$static._repMatchLenEncoder, 1 << this$static._posStateBits)
  InitBitModels(this$static._posAlignEncoder.Models)
  this$static._longestMatchWasFound = 0
  this$static._optimumEndIndex = 0
  this$static._optimumCurrentIndex = 0
  this$static._additionalOffset = 0
}

function $MovePos(this$static, num) {
  if (num > 0) {
    $Skip(this$static._matchFinder, num)
    this$static._additionalOffset += num
  }
}

function $ReadMatchDistances(this$static) {
  var lenRes = 0
  this$static._numDistancePairs = $GetMatches(
    this$static._matchFinder,
    this$static._matchDistances
  )
  if (this$static._numDistancePairs > 0) {
    lenRes = this$static._matchDistances[this$static._numDistancePairs - 2]
    if (lenRes == this$static._numFastBytes)
      lenRes += $GetMatchLen(
        this$static._matchFinder,
        lenRes - 1,
        this$static._matchDistances[this$static._numDistancePairs - 1],
        273 - lenRes
      )
  }
  ++this$static._additionalOffset
  return lenRes
}

function $ReleaseMFStream(this$static) {
  if (this$static._matchFinder && this$static._needReleaseMFStream) {
    this$static._matchFinder._stream = null
    this$static._needReleaseMFStream = 0
  }
}

function $ReleaseStreams(this$static) {
  $ReleaseMFStream(this$static)
  this$static._rangeEncoder.Stream = null
}

function $SetDictionarySize_0(this$static, dictionarySize) {
  this$static._dictionarySize = dictionarySize
  for (var dicLogSize = 0; dictionarySize > 1 << dicLogSize; ++dicLogSize) {}
  this$static._distTableSize = dicLogSize * 2
}

function $SetMatchFinder(this$static, matchFinderIndex) {
  var matchFinderIndexPrev = this$static._matchFinderType
  this$static._matchFinderType = matchFinderIndex
  if (
    this$static._matchFinder &&
    matchFinderIndexPrev != this$static._matchFinderType
  ) {
    this$static._dictionarySizePrev = -1
    this$static._matchFinder = null
  }
}

function $WriteCoderProperties(this$static, outStream) {
  this$static.properties[0] =
    (((this$static._posStateBits * 5 + this$static._numLiteralPosStateBits) *
      9 +
      this$static._numLiteralContextBits) <<
      24) >>
    24
  for (var i = 0; i < 4; ++i) {
    this$static.properties[1 + i] =
      ((this$static._dictionarySize >> (8 * i)) << 24) >> 24
  }
  $write_0(outStream, this$static.properties, 0, 5)
}

function $WriteEndMarker(this$static, posState) {
  if (!this$static._writeEndMark) {
    return
  }
  $Encode_3(
    this$static._rangeEncoder,
    this$static._isMatch,
    (this$static._state << 4) + posState,
    1
  )
  $Encode_3(
    this$static._rangeEncoder,
    this$static._isRep,
    this$static._state,
    0
  )
  this$static._state = this$static._state < 7 ? 7 : 10
  $Encode_0(this$static._lenEncoder, this$static._rangeEncoder, 0, posState)
  var lenToPosState = GetLenToPosState(2)
  $Encode_2(
    this$static._posSlotEncoder[lenToPosState],
    this$static._rangeEncoder,
    63
  )
  $EncodeDirectBits(this$static._rangeEncoder, 67108863, 26)
  $ReverseEncode(this$static._posAlignEncoder, this$static._rangeEncoder, 15)
}

function GetPosSlot(pos) {
  if (pos < 2048) {
    return g_FastPos[pos]
  }
  if (pos < 2097152) {
    return g_FastPos[pos >> 10] + 20
  }
  return g_FastPos[pos >> 20] + 40
}

function GetPosSlot2(pos) {
  if (pos < 131072) {
    return g_FastPos[pos >> 6] + 12
  }
  if (pos < 134217728) {
    return g_FastPos[pos >> 16] + 32
  }
  return g_FastPos[pos >> 26] + 52
}

function $Encode(this$static, rangeEncoder, symbol, posState) {
  if (symbol < 8) {
    $Encode_3(rangeEncoder, this$static._choice, 0, 0)
    $Encode_2(this$static._lowCoder[posState], rangeEncoder, symbol)
  } else {
    symbol -= 8
    $Encode_3(rangeEncoder, this$static._choice, 0, 1)
    if (symbol < 8) {
      $Encode_3(rangeEncoder, this$static._choice, 1, 0)
      $Encode_2(this$static._midCoder[posState], rangeEncoder, symbol)
    } else {
      $Encode_3(rangeEncoder, this$static._choice, 1, 1)
      $Encode_2(this$static._highCoder, rangeEncoder, symbol - 8)
    }
  }
}

function $Encoder$LenEncoder(this$static) {
  this$static._choice = initDim(2)
  this$static._lowCoder = initDim(16)
  this$static._midCoder = initDim(16)
  this$static._highCoder = $BitTreeEncoder({}, 8)
  for (var posState = 0; posState < 16; ++posState) {
    this$static._lowCoder[posState] = $BitTreeEncoder({}, 3)
    this$static._midCoder[posState] = $BitTreeEncoder({}, 3)
  }
  return this$static
}

function $Init_2(this$static, numPosStates) {
  InitBitModels(this$static._choice)
  for (var posState = 0; posState < numPosStates; ++posState) {
    InitBitModels(this$static._lowCoder[posState].Models)
    InitBitModels(this$static._midCoder[posState].Models)
  }
  InitBitModels(this$static._highCoder.Models)
}

function $SetPrices(this$static, posState, numSymbols, prices, st) {
  var a0, a1, b0, b1, i
  a0 = ProbPrices[this$static._choice[0] >>> 2]
  a1 = ProbPrices[(2048 - this$static._choice[0]) >>> 2]
  b0 = a1 + ProbPrices[this$static._choice[1] >>> 2]
  b1 = a1 + ProbPrices[(2048 - this$static._choice[1]) >>> 2]
  i = 0
  for (i = 0; i < 8; ++i) {
    if (i >= numSymbols) return
    prices[st + i] = a0 + $GetPrice_1(this$static._lowCoder[posState], i)
  }
  for (; i < 16; ++i) {
    if (i >= numSymbols) return
    prices[st + i] = b0 + $GetPrice_1(this$static._midCoder[posState], i - 8)
  }
  for (; i < numSymbols; ++i) {
    prices[st + i] = b1 + $GetPrice_1(this$static._highCoder, i - 8 - 8)
  }
}

function $Encode_0(this$static, rangeEncoder, symbol, posState) {
  $Encode(this$static, rangeEncoder, symbol, posState)
  if (--this$static._counters[posState] == 0) {
    $SetPrices(
      this$static,
      posState,
      this$static._tableSize,
      this$static._prices,
      posState * 272
    )
    this$static._counters[posState] = this$static._tableSize
  }
}

function $Encoder$LenPriceTableEncoder(this$static) {
  $Encoder$LenEncoder(this$static)
  this$static._prices = []
  this$static._counters = []
  return this$static
}

function $GetPrice(this$static, symbol, posState) {
  return this$static._prices[posState * 272 + symbol]
}

function $UpdateTables(this$static, numPosStates) {
  for (var posState = 0; posState < numPosStates; ++posState) {
    $SetPrices(
      this$static,
      posState,
      this$static._tableSize,
      this$static._prices,
      posState * 272
    )
    this$static._counters[posState] = this$static._tableSize
  }
}

function $Create_1(this$static, numPosBits, numPrevBits) {
  var i, numStates
  if (
    this$static.m_Coders != null &&
    this$static.m_NumPrevBits == numPrevBits &&
    this$static.m_NumPosBits == numPosBits
  ) {
    return
  }
  this$static.m_NumPosBits = numPosBits
  this$static.m_PosMask = (1 << numPosBits) - 1
  this$static.m_NumPrevBits = numPrevBits
  numStates = 1 << (this$static.m_NumPrevBits + this$static.m_NumPosBits)
  this$static.m_Coders = initDim(numStates)
  for (i = 0; i < numStates; ++i) {
    this$static.m_Coders[i] = $Encoder$LiteralEncoder$Encoder2({})
  }
}

function $GetSubCoder(this$static, pos, prevByte) {
  return this$static.m_Coders[
    ((pos & this$static.m_PosMask) << this$static.m_NumPrevBits) +
      ((prevByte & 255) >>> (8 - this$static.m_NumPrevBits))
  ]
}

function $Init_3(this$static) {
  var i,
    numStates = 1 << (this$static.m_NumPrevBits + this$static.m_NumPosBits)
  for (i = 0; i < numStates; ++i) {
    InitBitModels(this$static.m_Coders[i].m_Encoders)
  }
}

function $Encode_1(this$static, rangeEncoder, symbol) {
  var bit,
    i,
    context = 1
  for (i = 7; i >= 0; --i) {
    bit = (symbol >> i) & 1
    $Encode_3(rangeEncoder, this$static.m_Encoders, context, bit)
    context = (context << 1) | bit
  }
}

function $EncodeMatched(this$static, rangeEncoder, matchByte, symbol) {
  var bit,
    i,
    matchBit,
    state,
    same = 1,
    context = 1
  for (i = 7; i >= 0; --i) {
    bit = (symbol >> i) & 1
    state = context
    if (same) {
      matchBit = (matchByte >> i) & 1
      state += (1 + matchBit) << 8
      same = matchBit == bit
    }
    $Encode_3(rangeEncoder, this$static.m_Encoders, state, bit)
    context = (context << 1) | bit
  }
}

function $Encoder$LiteralEncoder$Encoder2(this$static) {
  this$static.m_Encoders = initDim(768)
  return this$static
}

function $GetPrice_0(this$static, matchMode, matchByte, symbol) {
  var bit,
    context = 1,
    i = 7,
    matchBit,
    price = 0
  if (matchMode) {
    for (; i >= 0; --i) {
      matchBit = (matchByte >> i) & 1
      bit = (symbol >> i) & 1
      price += GetPrice(
        this$static.m_Encoders[((1 + matchBit) << 8) + context],
        bit
      )
      context = (context << 1) | bit
      if (matchBit != bit) {
        --i
        break
      }
    }
  }
  for (; i >= 0; --i) {
    bit = (symbol >> i) & 1
    price += GetPrice(this$static.m_Encoders[context], bit)
    context = (context << 1) | bit
  }
  return price
}

function $MakeAsChar(this$static) {
  this$static.BackPrev = -1
  this$static.Prev1IsChar = 0
}

function $MakeAsShortRep(this$static) {
  this$static.BackPrev = 0
  this$static.Prev1IsChar = 0
}
function $BitTreeDecoder(this$static, numBitLevels) {
  this$static.NumBitLevels = numBitLevels
  this$static.Models = initDim(1 << numBitLevels)
  return this$static
}

function $Decode_0(this$static, rangeDecoder) {
  var bitIndex,
    m = 1
  for (bitIndex = this$static.NumBitLevels; bitIndex != 0; --bitIndex) {
    m = (m << 1) + $DecodeBit(rangeDecoder, this$static.Models, m)
  }
  return m - (1 << this$static.NumBitLevels)
}

function $ReverseDecode(this$static, rangeDecoder) {
  var bit,
    bitIndex,
    m = 1,
    symbol = 0
  for (bitIndex = 0; bitIndex < this$static.NumBitLevels; ++bitIndex) {
    bit = $DecodeBit(rangeDecoder, this$static.Models, m)
    m <<= 1
    m += bit
    symbol |= bit << bitIndex
  }
  return symbol
}

function ReverseDecode(Models, startIndex, rangeDecoder, NumBitLevels) {
  var bit,
    bitIndex,
    m = 1,
    symbol = 0
  for (bitIndex = 0; bitIndex < NumBitLevels; ++bitIndex) {
    bit = $DecodeBit(rangeDecoder, Models, startIndex + m)
    m <<= 1
    m += bit
    symbol |= bit << bitIndex
  }
  return symbol
}
function $BitTreeEncoder(this$static, numBitLevels) {
  this$static.NumBitLevels = numBitLevels
  this$static.Models = initDim(1 << numBitLevels)
  return this$static
}

function $Encode_2(this$static, rangeEncoder, symbol) {
  var bit,
    bitIndex,
    m = 1
  for (bitIndex = this$static.NumBitLevels; bitIndex != 0; ) {
    --bitIndex
    bit = (symbol >>> bitIndex) & 1
    $Encode_3(rangeEncoder, this$static.Models, m, bit)
    m = (m << 1) | bit
  }
}

function $GetPrice_1(this$static, symbol) {
  var bit,
    bitIndex,
    m = 1,
    price = 0
  for (bitIndex = this$static.NumBitLevels; bitIndex != 0; ) {
    --bitIndex
    bit = (symbol >>> bitIndex) & 1
    price += GetPrice(this$static.Models[m], bit)
    m = (m << 1) + bit
  }
  return price
}

function $ReverseEncode(this$static, rangeEncoder, symbol) {
  var bit,
    i,
    m = 1
  for (i = 0; i < this$static.NumBitLevels; ++i) {
    bit = symbol & 1
    $Encode_3(rangeEncoder, this$static.Models, m, bit)
    m = (m << 1) | bit
    symbol >>= 1
  }
}

function $ReverseGetPrice(this$static, symbol) {
  var bit,
    i,
    m = 1,
    price = 0
  for (i = this$static.NumBitLevels; i != 0; --i) {
    bit = symbol & 1
    symbol >>>= 1
    price += GetPrice(this$static.Models[m], bit)
    m = (m << 1) | bit
  }
  return price
}

function ReverseEncode(Models, startIndex, rangeEncoder, NumBitLevels, symbol) {
  var bit,
    i,
    m = 1
  for (i = 0; i < NumBitLevels; ++i) {
    bit = symbol & 1
    $Encode_3(rangeEncoder, Models, startIndex + m, bit)
    m = (m << 1) | bit
    symbol >>= 1
  }
}

function ReverseGetPrice(Models, startIndex, NumBitLevels, symbol) {
  var bit,
    i,
    m = 1,
    price = 0
  for (i = NumBitLevels; i != 0; --i) {
    bit = symbol & 1
    symbol >>>= 1
    price += ProbPrices[(((Models[startIndex + m] - bit) ^ -bit) & 2047) >>> 2]
    m = (m << 1) | bit
  }
  return price
}
function $DecodeBit(this$static, probs, index) {
  var newBound,
    prob = probs[index]
  newBound = (this$static.Range >>> 11) * prob
  if ((this$static.Code ^ -2147483648) < (newBound ^ -2147483648)) {
    this$static.Range = newBound
    probs[index] = ((prob + ((2048 - prob) >>> 5)) << 16) >> 16
    if (!(this$static.Range & -16777216)) {
      this$static.Code = (this$static.Code << 8) | $read(this$static.Stream)
      this$static.Range <<= 8
    }
    return 0
  } else {
    this$static.Range -= newBound
    this$static.Code -= newBound
    probs[index] = ((prob - (prob >>> 5)) << 16) >> 16
    if (!(this$static.Range & -16777216)) {
      this$static.Code = (this$static.Code << 8) | $read(this$static.Stream)
      this$static.Range <<= 8
    }
    return 1
  }
}

function $DecodeDirectBits(this$static, numTotalBits) {
  var i,
    t,
    result = 0
  for (i = numTotalBits; i != 0; --i) {
    this$static.Range >>>= 1
    t = (this$static.Code - this$static.Range) >>> 31
    this$static.Code -= this$static.Range & (t - 1)
    result = (result << 1) | (1 - t)
    if (!(this$static.Range & -16777216)) {
      this$static.Code = (this$static.Code << 8) | $read(this$static.Stream)
      this$static.Range <<= 8
    }
  }
  return result
}

function $Init_8(this$static) {
  this$static.Code = 0
  this$static.Range = -1
  for (var i = 0; i < 5; ++i) {
    this$static.Code = (this$static.Code << 8) | $read(this$static.Stream)
  }
}
function InitBitModels(probs) {
  for (var i = probs.length - 1; i >= 0; --i) {
    probs[i] = 1024
  }
}
var ProbPrices = (function() {
  var end,
    i,
    j,
    start,
    ProbPrices = []
  for (i = 8; i >= 0; --i) {
    start = 1 << (9 - i - 1)
    end = 1 << (9 - i)
    for (j = start; j < end; ++j) {
      ProbPrices[j] = (i << 6) + (((end - j) << 6) >>> (9 - i - 1))
    }
  }
  return ProbPrices
})()

function $Encode_3(this$static, probs, index, symbol) {
  var newBound,
    prob = probs[index]
  newBound = (this$static.Range >>> 11) * prob
  if (!symbol) {
    this$static.Range = newBound
    probs[index] = ((prob + ((2048 - prob) >>> 5)) << 16) >> 16
  } else {
    this$static.Low = add(
      this$static.Low,
      and(fromInt(newBound), [4294967295, 0])
    )
    this$static.Range -= newBound
    probs[index] = ((prob - (prob >>> 5)) << 16) >> 16
  }
  if (!(this$static.Range & -16777216)) {
    this$static.Range <<= 8
    $ShiftLow(this$static)
  }
}

function $EncodeDirectBits(this$static, v, numTotalBits) {
  for (var i = numTotalBits - 1; i >= 0; --i) {
    this$static.Range >>>= 1
    if (((v >>> i) & 1) == 1) {
      this$static.Low = add(this$static.Low, fromInt(this$static.Range))
    }
    if (!(this$static.Range & -16777216)) {
      this$static.Range <<= 8
      $ShiftLow(this$static)
    }
  }
}

function $GetProcessedSizeAdd(this$static) {
  return add(add(fromInt(this$static._cacheSize), this$static._position), [
    4,
    0
  ])
}

function $Init_9(this$static) {
  this$static._position = P0_longLit
  this$static.Low = P0_longLit
  this$static.Range = -1
  this$static._cacheSize = 1
  this$static._cache = 0
}

function $ShiftLow(this$static) {
  var temp,
    LowHi = lowBits_0(shru(this$static.Low, 32))
  if (LowHi != 0 || compare(this$static.Low, [4278190080, 0]) < 0) {
    this$static._position = add(
      this$static._position,
      fromInt(this$static._cacheSize)
    )
    temp = this$static._cache
    do {
      $write(this$static.Stream, temp + LowHi)
      temp = 255
    } while (--this$static._cacheSize != 0)
    this$static._cache = lowBits_0(this$static.Low) >>> 24
  }
  ++this$static._cacheSize
  this$static.Low = shl(and(this$static.Low, [16777215, 0]), 8)
}

function GetPrice(Prob, symbol) {
  return ProbPrices[(((Prob - symbol) ^ -symbol) & 2047) >>> 2]
}
function decode(utf) {
  var i = 0,
    j = 0,
    x,
    y,
    z,
    l = utf.length,
    buf = [],
    charCodes = []
  for (; i < l; ++i, ++j) {
    x = utf[i] & 255
    if (!(x & 128)) {
      if (!x) {
        // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
        return utf
      }
      charCodes[j] = x
    } else if ((x & 224) == 192) {
      if (i + 1 >= l) {
        // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
        return utf
      }
      y = utf[++i] & 255
      if ((y & 192) != 128) {
        // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
        return utf
      }
      charCodes[j] = ((x & 31) << 6) | (y & 63)
    } else if ((x & 240) == 224) {
      if (i + 2 >= l) {
        // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
        return utf
      }
      y = utf[++i] & 255
      if ((y & 192) != 128) {
        // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
        return utf
      }
      z = utf[++i] & 255
      if ((z & 192) != 128) {
        // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
        return utf
      }
      charCodes[j] = ((x & 15) << 12) | ((y & 63) << 6) | (z & 63)
    } else {
      // It appears that this is binary data, so it cannot be converted to a string, so just send it back.
      return utf
    }
    if (j == 16383) {
      buf.push(String.fromCharCode.apply(String, charCodes))
      j = -1
    }
  }
  if (j > 0) {
    charCodes.length = j
    buf.push(String.fromCharCode.apply(String, charCodes))
  }
  return buf.join('')
}
function encode(s) {
  var ch,
    chars = [],
    data,
    elen = 0,
    i,
    l = s.length
  // Be able to handle binary arrays and buffers.
  if (typeof s == 'object') {
    return s
  } else {
    $getChars(s, 0, l, chars, 0)
  }
  // Add extra spaces in the array to break up the unicode symbols.
  for (i = 0; i < l; ++i) {
    ch = chars[i]
    if (ch >= 1 && ch <= 127) {
      ++elen
    } else if (!ch || (ch >= 128 && ch <= 2047)) {
      elen += 2
    } else {
      elen += 3
    }
  }
  data = []
  elen = 0
  for (i = 0; i < l; ++i) {
    ch = chars[i]
    if (ch >= 1 && ch <= 127) {
      data[elen++] = (ch << 24) >> 24
    } else if (!ch || (ch >= 128 && ch <= 2047)) {
      data[elen++] = ((192 | ((ch >> 6) & 31)) << 24) >> 24
      data[elen++] = ((128 | (ch & 63)) << 24) >> 24
    } else {
      data[elen++] = ((224 | ((ch >> 12) & 15)) << 24) >> 24
      data[elen++] = ((128 | ((ch >> 6) & 63)) << 24) >> 24
      data[elen++] = ((128 | (ch & 63)) << 24) >> 24
    }
  }
  return data
}
// s is dictionarySize
// f is fb
// m is matchFinder
// NOTE: Because some values are always the same, they have been removed.
// lc is always 3
// lp is always 0
// pb is always 2
const modes = [
  { s: 16, f: 64, m: 0 },
  { s: 20, f: 64, m: 0 },
  { s: 19, f: 64, m: 1 },
  { s: 20, f: 64, m: 1 },
  { s: 21, f: 128, m: 1 },
  { s: 22, f: 128, m: 1 },
  { s: 23, f: 128, m: 1 },
  { s: 24, f: 255, m: 1 },
  { s: 25, f: 255, m: 1 }
]

function get_mode_obj(mode) {
  return modes[mode - 1] || modes[6]
}

/**
 * Compress a string with the LZMA algorithm
 *
 * @param {string}            value                 The string to be compressed
 * @param {object}            options
 * @param {1|2|3|4|5|6|7|8|9} options.mode          Which mode to use (1 through 9, defaults to 7)
 * @param {boolean}           options.enableEndMark Whether to write an end mark
 * @returns {string}
 */
function compress(value, { mode = 7, enableEndMark = true } = {}) {
  var this$static = {}

  this$static.c = $LZMAByteArrayCompressor(
    {},
    encode(value),
    get_mode_obj(mode),
    enableEndMark
  )
  while ($processChunk(this$static.c.chunker));
  return $toByteArray(this$static.c.output)
}

/**
 * Compress a string with the LZMA algorithm to URL-safe characters
 *
 * @param {string}            value                 The string to be compressed
 * @param {object}            options
 * @param {1|2|3|4|5|6|7|8|9} options.mode          Which mode to use (1 through 9, defaults to 7)
 * @param {boolean}           options.enableEndMark Whether to write an end mark
 * @returns {string}
 */
function compressUrlSafe(
  string,
  { mode = 7, enableEndMark = true } = {}
) {
  const compressedString = compress(string, { mode, enableEndMark })
  const compressedBytes = new Uint8Array(compressedString)

  return _base64_js__WEBPACK_IMPORTED_MODULE_0__.encodeFromArrayUrlSafe(compressedBytes)
}

/**
 * Decompress a string compressed with the LZMA algorithm
 *
 * @param {number[]|Int8Array} bytes The int8 array created by the compress() function
 * @returns {string}
 */
function decompress(bytes) {
  var this$static = {}

  this$static.d = $LZMAByteArrayDecompressor({}, bytes)
  while ($processChunk(this$static.d.chunker));
  return decode($toByteArray(this$static.d.output))
}

/**
 * Decompress a string compressed with the URL-safe compress function
 *
 * @param {string} string The URL-safe string generated by the compressUrlSafe() function
 * @returns {string}
 */
function decompressUrlSafe(string) {
  return decompress(new Int8Array(_base64_js__WEBPACK_IMPORTED_MODULE_0__.decodeToArrayUrlSafe(string)))
}


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./sass/codemirror.css":
/*!*******************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./sass/codemirror.css ***!
  \*******************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* BASICS */\n\n.CodeMirror {\n    /* Set height, width, borders, and global font properties here */\n    font-family: monospace;\n    height: auto;\n    color: black;\n    direction: ltr;\n  }\n  \n  /* PADDING */\n  \n  .CodeMirror-lines {\n    padding: 4px 0; /* Vertical padding around content */\n  }\n  .CodeMirror pre {\n    padding: 0 4px; /* Horizontal padding of content */\n  }\n  \n  .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n    background-color: white; /* The little square between H and V scrollbars */\n  }\n  \n  /* GUTTER */\n  \n  .CodeMirror-gutters {\n    border-right: 1px solid #ddd;\n    background-color: #f7f7f7;\n    white-space: nowrap;\n  }\n  .CodeMirror-linenumbers {}\n  .CodeMirror-linenumber {\n    padding: 0 3px 0 5px;\n    min-width: 20px;\n    text-align: right;\n    color: #999;\n    white-space: nowrap;\n  }\n  \n  .CodeMirror-guttermarker { color: black; }\n  .CodeMirror-guttermarker-subtle { color: #999; }\n  \n  /* CURSOR */\n  \n  .CodeMirror-cursor {\n    border-left: 1px solid black;\n    border-right: none;\n    width: 0;\n  }\n  /* Shown when moving in bi-directional text */\n  .CodeMirror div.CodeMirror-secondarycursor {\n    border-left: 1px solid silver;\n  }\n  .cm-fat-cursor .CodeMirror-cursor {\n    width: auto;\n    border: 0 !important;\n    background: #7e7;\n  }\n  .cm-fat-cursor div.CodeMirror-cursors {\n    z-index: 1;\n  }\n  .cm-fat-cursor-mark {\n    background-color: rgba(20, 255, 20, 0.5);\n    -webkit-animation: blink 1.06s steps(1) infinite;\n    -moz-animation: blink 1.06s steps(1) infinite;\n    animation: blink 1.06s steps(1) infinite;\n  }\n  .cm-animate-fat-cursor {\n    width: auto;\n    border: 0;\n    -webkit-animation: blink 1.06s steps(1) infinite;\n    -moz-animation: blink 1.06s steps(1) infinite;\n    animation: blink 1.06s steps(1) infinite;\n    background-color: #7e7;\n  }\n  @-moz-keyframes blink {\n    0% {}\n    50% { background-color: transparent; }\n    100% {}\n  }\n  @-webkit-keyframes blink {\n    0% {}\n    50% { background-color: transparent; }\n    100% {}\n  }\n  @keyframes blink {\n    0% {}\n    50% { background-color: transparent; }\n    100% {}\n  }\n  \n  /* Can style cursor different in overwrite (non-insert) mode */\n  .CodeMirror-overwrite .CodeMirror-cursor {}\n  \n  .cm-tab { display: inline-block; text-decoration: inherit; }\n  \n  .CodeMirror-rulers {\n    position: absolute;\n    left: 0; right: 0; top: -50px; bottom: -20px;\n    overflow: hidden;\n  }\n  .CodeMirror-ruler {\n    border-left: 1px solid #ccc;\n    top: 0; bottom: 0;\n    position: absolute;\n  }\n  \n  /* DEFAULT THEME */\n  \n  .cm-s-default .cm-header {color: blue;}\n  .cm-s-default .cm-quote {color: #090;}\n  .cm-negative {color: #d44;}\n  .cm-positive {color: #292;}\n  .cm-header, .cm-strong {font-weight: bold;}\n  .cm-em {font-style: italic;}\n  .cm-link {text-decoration: underline;}\n  .cm-strikethrough {text-decoration: line-through;}\n  \n  .cm-s-default .cm-keyword {color: #708;}\n  .cm-s-default .cm-atom {color: #219;}\n  .cm-s-default .cm-number {color: #164;}\n  .cm-s-default .cm-def {color: rgb(60, 60, 158);}\n  .cm-s-default .cm-variable,\n  .cm-s-default .cm-punctuation,\n  .cm-s-default .cm-property,\n  .cm-s-default .cm-operator {}\n  .cm-s-default .cm-variable-2 {color: rgb(41, 100, 160);}\n  .cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}\n  .cm-s-default .cm-comment {color: #a50;}\n  .cm-s-default .cm-string {color: #a11;}\n  .cm-s-default .cm-string-2 {color: #f50;}\n  .cm-s-default .cm-meta {color: #555;}\n  .cm-s-default .cm-qualifier {color: #555;}\n  .cm-s-default .cm-builtin {color: rgb(74, 42, 148);}\n  .cm-s-default .cm-bracket {color: #997;}\n  .cm-s-default .cm-tag {color: #170;}\n  .cm-s-default .cm-attribute {color: rgb(42, 42, 167);}\n  .cm-s-default .cm-hr {color: #999;}\n  .cm-s-default .cm-link {color: #00c;}\n  \n  .cm-s-default .cm-error {color: #f00;}\n  .cm-invalidchar {color: #f00;}\n  \n  .CodeMirror-composing { border-bottom: 2px solid; }\n  \n  /* Default styles for common addons */\n  \n  div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}\n  div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}\n  .CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }\n  .CodeMirror-activeline-background {background: #e8f2ff;}\n  \n  /* STOP */\n  \n  /* The rest of this file contains styles related to the mechanics of\n     the editor. You probably shouldn't touch them. */\n  \n  .CodeMirror {\n    position: relative;\n    overflow: hidden;\n    background: white;\n  }\n  \n  .CodeMirror-scroll {\n    overflow: scroll !important; /* Things will break if this is overridden */\n    /* 30px is the magic margin used to hide the element's real scrollbars */\n    /* See overflow: hidden in .CodeMirror */\n    margin-bottom: -30px; margin-right: -30px;\n    padding-bottom: 30px;\n    height: 100%;\n    outline: none; /* Prevent dragging from highlighting the element */\n    position: relative;\n  }\n  .CodeMirror-sizer {\n    position: relative;\n    border-right: 30px solid transparent;\n  }\n  \n  /* The fake, visible scrollbars. Used to force redraw during scrolling\n     before actual scrolling happens, thus preventing shaking and\n     flickering artifacts. */\n  .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n    position: absolute;\n    z-index: 6;\n    display: none;\n  }\n  .CodeMirror-vscrollbar {\n    right: 0; top: 0;\n    overflow-x: hidden;\n    overflow-y: scroll;\n  }\n  .CodeMirror-hscrollbar {\n    bottom: 0; left: 0;\n    overflow-y: hidden;\n    overflow-x: scroll;\n  }\n  .CodeMirror-scrollbar-filler {\n    right: 0; bottom: 0;\n  }\n  .CodeMirror-gutter-filler {\n    left: 0; bottom: 0;\n  }\n  \n  .CodeMirror-gutters {\n    position: absolute; left: 0; top: 0;\n    min-height: 100%;\n    z-index: 3;\n  }\n  .CodeMirror-gutter {\n    white-space: normal;\n    height: 100%;\n    display: inline-block;\n    vertical-align: top;\n    margin-bottom: -30px;\n  }\n  .CodeMirror-gutter-wrapper {\n    position: absolute;\n    z-index: 4;\n    background: none !important;\n    border: none !important;\n  }\n  .CodeMirror-gutter-background {\n    position: absolute;\n    top: 0; bottom: 0;\n    z-index: 4;\n  }\n  .CodeMirror-gutter-elt {\n    position: absolute;\n    cursor: default;\n    z-index: 4;\n  }\n  .CodeMirror-gutter-wrapper ::selection { background-color: transparent }\n  .CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }\n  \n  .CodeMirror-lines {\n    cursor: text;\n    min-height: 1px; /* prevents collapsing before first draw */\n  }\n  .CodeMirror pre {\n    /* Reset some styles that the rest of the page might have set */\n    -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;\n    border-width: 0;\n    background: transparent;\n    font-family: inherit;\n    font-size: inherit;\n    margin: 0;\n    white-space: pre;\n    word-wrap: normal;\n    line-height: inherit;\n    color: inherit;\n    z-index: 2;\n    position: relative;\n    overflow: visible;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-font-variant-ligatures: contextual;\n    font-variant-ligatures: contextual;\n  }\n  .CodeMirror-wrap pre {\n    word-wrap: break-word;\n    white-space: pre-wrap;\n    word-break: normal;\n  }\n  \n  .CodeMirror-linebackground {\n    position: absolute;\n    left: 0; right: 0; top: 0; bottom: 0;\n    z-index: 0;\n  }\n  \n  .CodeMirror-linewidget {\n    position: relative;\n    z-index: 2;\n    padding: 0.1px; /* Force widget margins to stay inside of the container */\n  }\n  \n  .CodeMirror-widget {}\n  \n  .CodeMirror-rtl pre { direction: rtl; }\n  \n  .CodeMirror-code {\n    outline: none;\n  }\n  \n  /* Force content-box sizing for the elements where we expect it */\n  .CodeMirror-scroll,\n  .CodeMirror-sizer,\n  .CodeMirror-gutter,\n  .CodeMirror-gutters,\n  .CodeMirror-linenumber {\n    -moz-box-sizing: content-box;\n    box-sizing: content-box;\n  }\n  \n  .CodeMirror-measure {\n    position: absolute;\n    width: 100%;\n    height: 0;\n    overflow: hidden;\n    visibility: hidden;\n  }\n  \n  .CodeMirror-cursor {\n    position: absolute;\n    pointer-events: none;\n  }\n  .CodeMirror-measure pre { position: static; }\n  \n  div.CodeMirror-cursors {\n    visibility: hidden;\n    position: relative;\n    z-index: 3;\n  }\n  div.CodeMirror-dragcursors {\n    visibility: visible;\n  }\n  \n  .CodeMirror-focused div.CodeMirror-cursors {\n    visibility: visible;\n  }\n  \n  .CodeMirror-selected { background: #d9d9d9; }\n  .CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }\n  .CodeMirror-crosshair { cursor: crosshair; }\n  .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }\n  .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }\n  \n  .cm-searching {\n    background-color: #ffa;\n    background-color: rgba(255, 255, 0, .4);\n  }\n  \n  /* Used to force a border model for a node */\n  .cm-force-border { padding-right: .1px; }\n  \n  /* See issue #2901 */\n  .cm-tab-wrap-hack:after { content: ''; }\n  \n  /* Help users use markselection to safely style text background */\n  span.CodeMirror-selectedtext { background: none; }\n  \n  /* The lint marker gutter */\n  .CodeMirror-lint-markers {\n    width: 16px;\n  }\n  \n  .CodeMirror-lint-tooltip {\n    background-color: #ffd;\n    border: 1px solid black;\n    border-radius: 4px 4px 4px 4px;\n    color: black;\n    font-family: monospace;\n    font-size: 10pt;\n    overflow: hidden;\n    padding: 2px 5px;\n    position: fixed;\n    white-space: pre;\n    white-space: pre-wrap;\n    z-index: 100;\n    max-width: 600px;\n    opacity: 0;\n    transition: opacity .4s;\n    -moz-transition: opacity .4s;\n    -webkit-transition: opacity .4s;\n    -o-transition: opacity .4s;\n    -ms-transition: opacity .4s;\n  }\n  \n  .CodeMirror-lint-mark-error, .CodeMirror-lint-mark-warning {\n    background-position: left bottom;\n    background-repeat: repeat-x;\n  }\n  \n  .CodeMirror-lint-marker-error, .CodeMirror-lint-marker-warning {\n    background-position: center center;\n    background-repeat: no-repeat;\n    cursor: pointer;\n    display: inline-block;\n    height: 16px;\n    width: 16px;\n    vertical-align: middle;\n    position: relative;\n  }\n  \n  .CodeMirror-lint-message-error, .CodeMirror-lint-message-warning {\n    padding-left: 18px;\n    background-position: top left;\n    background-repeat: no-repeat;\n  }\n  \n  .CodeMirror-lint-marker-multiple {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAMAAADzjKfhAAAACVBMVEUAAAAAAAC/v7914kyHAAAAAXRSTlMAQObYZgAAACNJREFUeNo1ioEJAAAIwmz/H90iFFSGJgFMe3gaLZ0od+9/AQZ0ADosbYraAAAAAElFTkSuQmCC\");\n    background-repeat: no-repeat;\n    background-position: right bottom;\n    width: 100%; height: 100%;\n  }\n\n  .CodeMirror {\n      height: 300px;\n      border: 1px solid #CCC;\n  }", "",{"version":3,"sources":["webpack://./sass/codemirror.css"],"names":[],"mappings":"AAAA,WAAW;;AAEX;IACI,gEAAgE;IAChE,sBAAsB;IACtB,YAAY;IACZ,YAAY;IACZ,cAAc;EAChB;;EAEA,YAAY;;EAEZ;IACE,cAAc,EAAE,oCAAoC;EACtD;EACA;IACE,cAAc,EAAE,kCAAkC;EACpD;;EAEA;IACE,uBAAuB,EAAE,iDAAiD;EAC5E;;EAEA,WAAW;;EAEX;IACE,4BAA4B;IAC5B,yBAAyB;IACzB,mBAAmB;EACrB;EACA,yBAAyB;EACzB;IACE,oBAAoB;IACpB,eAAe;IACf,iBAAiB;IACjB,WAAW;IACX,mBAAmB;EACrB;;EAEA,2BAA2B,YAAY,EAAE;EACzC,kCAAkC,WAAW,EAAE;;EAE/C,WAAW;;EAEX;IACE,4BAA4B;IAC5B,kBAAkB;IAClB,QAAQ;EACV;EACA,6CAA6C;EAC7C;IACE,6BAA6B;EAC/B;EACA;IACE,WAAW;IACX,oBAAoB;IACpB,gBAAgB;EAClB;EACA;IACE,UAAU;EACZ;EACA;IACE,wCAAwC;IACxC,gDAAgD;IAChD,6CAA6C;IAC7C,wCAAwC;EAC1C;EACA;IACE,WAAW;IACX,SAAS;IACT,gDAAgD;IAChD,6CAA6C;IAC7C,wCAAwC;IACxC,sBAAsB;EACxB;EACA;IACE,IAAI;IACJ,MAAM,6BAA6B,EAAE;IACrC,MAAM;EACR;EACA;IACE,IAAI;IACJ,MAAM,6BAA6B,EAAE;IACrC,MAAM;EACR;EACA;IACE,IAAI;IACJ,MAAM,6BAA6B,EAAE;IACrC,MAAM;EACR;;EAEA,8DAA8D;EAC9D,0CAA0C;;EAE1C,UAAU,qBAAqB,EAAE,wBAAwB,EAAE;;EAE3D;IACE,kBAAkB;IAClB,OAAO,EAAE,QAAQ,EAAE,UAAU,EAAE,aAAa;IAC5C,gBAAgB;EAClB;EACA;IACE,2BAA2B;IAC3B,MAAM,EAAE,SAAS;IACjB,kBAAkB;EACpB;;EAEA,kBAAkB;;EAElB,0BAA0B,WAAW,CAAC;EACtC,yBAAyB,WAAW,CAAC;EACrC,cAAc,WAAW,CAAC;EAC1B,cAAc,WAAW,CAAC;EAC1B,wBAAwB,iBAAiB,CAAC;EAC1C,QAAQ,kBAAkB,CAAC;EAC3B,UAAU,0BAA0B,CAAC;EACrC,mBAAmB,6BAA6B,CAAC;;EAEjD,2BAA2B,WAAW,CAAC;EACvC,wBAAwB,WAAW,CAAC;EACpC,0BAA0B,WAAW,CAAC;EACtC,uBAAuB,uBAAuB,CAAC;EAC/C;;;8BAG4B;EAC5B,8BAA8B,wBAAwB,CAAC;EACvD,sDAAsD,WAAW,CAAC;EAClE,2BAA2B,WAAW,CAAC;EACvC,0BAA0B,WAAW,CAAC;EACtC,4BAA4B,WAAW,CAAC;EACxC,wBAAwB,WAAW,CAAC;EACpC,6BAA6B,WAAW,CAAC;EACzC,2BAA2B,uBAAuB,CAAC;EACnD,2BAA2B,WAAW,CAAC;EACvC,uBAAuB,WAAW,CAAC;EACnC,6BAA6B,uBAAuB,CAAC;EACrD,sBAAsB,WAAW,CAAC;EAClC,wBAAwB,WAAW,CAAC;;EAEpC,yBAAyB,WAAW,CAAC;EACrC,iBAAiB,WAAW,CAAC;;EAE7B,wBAAwB,wBAAwB,EAAE;;EAElD,qCAAqC;;EAErC,gDAAgD,WAAW,CAAC;EAC5D,mDAAmD,WAAW,CAAC;EAC/D,0BAA0B,iCAAiC,EAAE;EAC7D,mCAAmC,mBAAmB,CAAC;;EAEvD,SAAS;;EAET;qDACmD;;EAEnD;IACE,kBAAkB;IAClB,gBAAgB;IAChB,iBAAiB;EACnB;;EAEA;IACE,2BAA2B,EAAE,4CAA4C;IACzE,wEAAwE;IACxE,wCAAwC;IACxC,oBAAoB,EAAE,mBAAmB;IACzC,oBAAoB;IACpB,YAAY;IACZ,aAAa,EAAE,mDAAmD;IAClE,kBAAkB;EACpB;EACA;IACE,kBAAkB;IAClB,oCAAoC;EACtC;;EAEA;;4BAE0B;EAC1B;IACE,kBAAkB;IAClB,UAAU;IACV,aAAa;EACf;EACA;IACE,QAAQ,EAAE,MAAM;IAChB,kBAAkB;IAClB,kBAAkB;EACpB;EACA;IACE,SAAS,EAAE,OAAO;IAClB,kBAAkB;IAClB,kBAAkB;EACpB;EACA;IACE,QAAQ,EAAE,SAAS;EACrB;EACA;IACE,OAAO,EAAE,SAAS;EACpB;;EAEA;IACE,kBAAkB,EAAE,OAAO,EAAE,MAAM;IACnC,gBAAgB;IAChB,UAAU;EACZ;EACA;IACE,mBAAmB;IACnB,YAAY;IACZ,qBAAqB;IACrB,mBAAmB;IACnB,oBAAoB;EACtB;EACA;IACE,kBAAkB;IAClB,UAAU;IACV,2BAA2B;IAC3B,uBAAuB;EACzB;EACA;IACE,kBAAkB;IAClB,MAAM,EAAE,SAAS;IACjB,UAAU;EACZ;EACA;IACE,kBAAkB;IAClB,eAAe;IACf,UAAU;EACZ;EACA,yCAAyC,8BAA8B;EACvE,8CAA8C,8BAA8B;;EAE5E;IACE,YAAY;IACZ,eAAe,EAAE,0CAA0C;EAC7D;EACA;IACE,+DAA+D;IAC/D,qBAAqB,EAAE,wBAAwB,EAAE,gBAAgB;IACjE,eAAe;IACf,uBAAuB;IACvB,oBAAoB;IACpB,kBAAkB;IAClB,SAAS;IACT,gBAAgB;IAChB,iBAAiB;IACjB,oBAAoB;IACpB,cAAc;IACd,UAAU;IACV,kBAAkB;IAClB,iBAAiB;IACjB,wCAAwC;IACxC,0CAA0C;IAC1C,kCAAkC;EACpC;EACA;IACE,qBAAqB;IACrB,qBAAqB;IACrB,kBAAkB;EACpB;;EAEA;IACE,kBAAkB;IAClB,OAAO,EAAE,QAAQ,EAAE,MAAM,EAAE,SAAS;IACpC,UAAU;EACZ;;EAEA;IACE,kBAAkB;IAClB,UAAU;IACV,cAAc,EAAE,yDAAyD;EAC3E;;EAEA,oBAAoB;;EAEpB,sBAAsB,cAAc,EAAE;;EAEtC;IACE,aAAa;EACf;;EAEA,iEAAiE;EACjE;;;;;IAKE,4BAA4B;IAC5B,uBAAuB;EACzB;;EAEA;IACE,kBAAkB;IAClB,WAAW;IACX,SAAS;IACT,gBAAgB;IAChB,kBAAkB;EACpB;;EAEA;IACE,kBAAkB;IAClB,oBAAoB;EACtB;EACA,0BAA0B,gBAAgB,EAAE;;EAE5C;IACE,kBAAkB;IAClB,kBAAkB;IAClB,UAAU;EACZ;EACA;IACE,mBAAmB;EACrB;;EAEA;IACE,mBAAmB;EACrB;;EAEA,uBAAuB,mBAAmB,EAAE;EAC5C,2CAA2C,mBAAmB,EAAE;EAChE,wBAAwB,iBAAiB,EAAE;EAC3C,6GAA6G,mBAAmB,EAAE;EAClI,4HAA4H,mBAAmB,EAAE;;EAEjJ;IACE,sBAAsB;IACtB,uCAAuC;EACzC;;EAEA,4CAA4C;EAC5C,mBAAmB,mBAAmB,EAAE;;EAExC,oBAAoB;EACpB,0BAA0B,WAAW,EAAE;;EAEvC,iEAAiE;EACjE,+BAA+B,gBAAgB,EAAE;;EAEjD,2BAA2B;EAC3B;IACE,WAAW;EACb;;EAEA;IACE,sBAAsB;IACtB,uBAAuB;IACvB,8BAA8B;IAC9B,YAAY;IACZ,sBAAsB;IACtB,eAAe;IACf,gBAAgB;IAChB,gBAAgB;IAChB,eAAe;IACf,gBAAgB;IAChB,qBAAqB;IACrB,YAAY;IACZ,gBAAgB;IAChB,UAAU;IACV,uBAAuB;IACvB,4BAA4B;IAC5B,+BAA+B;IAC/B,0BAA0B;IAC1B,2BAA2B;EAC7B;;EAEA;IACE,gCAAgC;IAChC,2BAA2B;EAC7B;;EAEA;IACE,kCAAkC;IAClC,4BAA4B;IAC5B,eAAe;IACf,qBAAqB;IACrB,YAAY;IACZ,WAAW;IACX,sBAAsB;IACtB,kBAAkB;EACpB;;EAEA;IACE,kBAAkB;IAClB,6BAA6B;IAC7B,4BAA4B;EAC9B;;EAEA;IACE,uNAAuN;IACvN,4BAA4B;IAC5B,iCAAiC;IACjC,WAAW,EAAE,YAAY;EAC3B;;EAEA;MACI,aAAa;MACb,sBAAsB;EAC1B","sourcesContent":["/* BASICS */\n\n.CodeMirror {\n    /* Set height, width, borders, and global font properties here */\n    font-family: monospace;\n    height: auto;\n    color: black;\n    direction: ltr;\n  }\n  \n  /* PADDING */\n  \n  .CodeMirror-lines {\n    padding: 4px 0; /* Vertical padding around content */\n  }\n  .CodeMirror pre {\n    padding: 0 4px; /* Horizontal padding of content */\n  }\n  \n  .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n    background-color: white; /* The little square between H and V scrollbars */\n  }\n  \n  /* GUTTER */\n  \n  .CodeMirror-gutters {\n    border-right: 1px solid #ddd;\n    background-color: #f7f7f7;\n    white-space: nowrap;\n  }\n  .CodeMirror-linenumbers {}\n  .CodeMirror-linenumber {\n    padding: 0 3px 0 5px;\n    min-width: 20px;\n    text-align: right;\n    color: #999;\n    white-space: nowrap;\n  }\n  \n  .CodeMirror-guttermarker { color: black; }\n  .CodeMirror-guttermarker-subtle { color: #999; }\n  \n  /* CURSOR */\n  \n  .CodeMirror-cursor {\n    border-left: 1px solid black;\n    border-right: none;\n    width: 0;\n  }\n  /* Shown when moving in bi-directional text */\n  .CodeMirror div.CodeMirror-secondarycursor {\n    border-left: 1px solid silver;\n  }\n  .cm-fat-cursor .CodeMirror-cursor {\n    width: auto;\n    border: 0 !important;\n    background: #7e7;\n  }\n  .cm-fat-cursor div.CodeMirror-cursors {\n    z-index: 1;\n  }\n  .cm-fat-cursor-mark {\n    background-color: rgba(20, 255, 20, 0.5);\n    -webkit-animation: blink 1.06s steps(1) infinite;\n    -moz-animation: blink 1.06s steps(1) infinite;\n    animation: blink 1.06s steps(1) infinite;\n  }\n  .cm-animate-fat-cursor {\n    width: auto;\n    border: 0;\n    -webkit-animation: blink 1.06s steps(1) infinite;\n    -moz-animation: blink 1.06s steps(1) infinite;\n    animation: blink 1.06s steps(1) infinite;\n    background-color: #7e7;\n  }\n  @-moz-keyframes blink {\n    0% {}\n    50% { background-color: transparent; }\n    100% {}\n  }\n  @-webkit-keyframes blink {\n    0% {}\n    50% { background-color: transparent; }\n    100% {}\n  }\n  @keyframes blink {\n    0% {}\n    50% { background-color: transparent; }\n    100% {}\n  }\n  \n  /* Can style cursor different in overwrite (non-insert) mode */\n  .CodeMirror-overwrite .CodeMirror-cursor {}\n  \n  .cm-tab { display: inline-block; text-decoration: inherit; }\n  \n  .CodeMirror-rulers {\n    position: absolute;\n    left: 0; right: 0; top: -50px; bottom: -20px;\n    overflow: hidden;\n  }\n  .CodeMirror-ruler {\n    border-left: 1px solid #ccc;\n    top: 0; bottom: 0;\n    position: absolute;\n  }\n  \n  /* DEFAULT THEME */\n  \n  .cm-s-default .cm-header {color: blue;}\n  .cm-s-default .cm-quote {color: #090;}\n  .cm-negative {color: #d44;}\n  .cm-positive {color: #292;}\n  .cm-header, .cm-strong {font-weight: bold;}\n  .cm-em {font-style: italic;}\n  .cm-link {text-decoration: underline;}\n  .cm-strikethrough {text-decoration: line-through;}\n  \n  .cm-s-default .cm-keyword {color: #708;}\n  .cm-s-default .cm-atom {color: #219;}\n  .cm-s-default .cm-number {color: #164;}\n  .cm-s-default .cm-def {color: rgb(60, 60, 158);}\n  .cm-s-default .cm-variable,\n  .cm-s-default .cm-punctuation,\n  .cm-s-default .cm-property,\n  .cm-s-default .cm-operator {}\n  .cm-s-default .cm-variable-2 {color: rgb(41, 100, 160);}\n  .cm-s-default .cm-variable-3, .cm-s-default .cm-type {color: #085;}\n  .cm-s-default .cm-comment {color: #a50;}\n  .cm-s-default .cm-string {color: #a11;}\n  .cm-s-default .cm-string-2 {color: #f50;}\n  .cm-s-default .cm-meta {color: #555;}\n  .cm-s-default .cm-qualifier {color: #555;}\n  .cm-s-default .cm-builtin {color: rgb(74, 42, 148);}\n  .cm-s-default .cm-bracket {color: #997;}\n  .cm-s-default .cm-tag {color: #170;}\n  .cm-s-default .cm-attribute {color: rgb(42, 42, 167);}\n  .cm-s-default .cm-hr {color: #999;}\n  .cm-s-default .cm-link {color: #00c;}\n  \n  .cm-s-default .cm-error {color: #f00;}\n  .cm-invalidchar {color: #f00;}\n  \n  .CodeMirror-composing { border-bottom: 2px solid; }\n  \n  /* Default styles for common addons */\n  \n  div.CodeMirror span.CodeMirror-matchingbracket {color: #0b0;}\n  div.CodeMirror span.CodeMirror-nonmatchingbracket {color: #a22;}\n  .CodeMirror-matchingtag { background: rgba(255, 150, 0, .3); }\n  .CodeMirror-activeline-background {background: #e8f2ff;}\n  \n  /* STOP */\n  \n  /* The rest of this file contains styles related to the mechanics of\n     the editor. You probably shouldn't touch them. */\n  \n  .CodeMirror {\n    position: relative;\n    overflow: hidden;\n    background: white;\n  }\n  \n  .CodeMirror-scroll {\n    overflow: scroll !important; /* Things will break if this is overridden */\n    /* 30px is the magic margin used to hide the element's real scrollbars */\n    /* See overflow: hidden in .CodeMirror */\n    margin-bottom: -30px; margin-right: -30px;\n    padding-bottom: 30px;\n    height: 100%;\n    outline: none; /* Prevent dragging from highlighting the element */\n    position: relative;\n  }\n  .CodeMirror-sizer {\n    position: relative;\n    border-right: 30px solid transparent;\n  }\n  \n  /* The fake, visible scrollbars. Used to force redraw during scrolling\n     before actual scrolling happens, thus preventing shaking and\n     flickering artifacts. */\n  .CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n    position: absolute;\n    z-index: 6;\n    display: none;\n  }\n  .CodeMirror-vscrollbar {\n    right: 0; top: 0;\n    overflow-x: hidden;\n    overflow-y: scroll;\n  }\n  .CodeMirror-hscrollbar {\n    bottom: 0; left: 0;\n    overflow-y: hidden;\n    overflow-x: scroll;\n  }\n  .CodeMirror-scrollbar-filler {\n    right: 0; bottom: 0;\n  }\n  .CodeMirror-gutter-filler {\n    left: 0; bottom: 0;\n  }\n  \n  .CodeMirror-gutters {\n    position: absolute; left: 0; top: 0;\n    min-height: 100%;\n    z-index: 3;\n  }\n  .CodeMirror-gutter {\n    white-space: normal;\n    height: 100%;\n    display: inline-block;\n    vertical-align: top;\n    margin-bottom: -30px;\n  }\n  .CodeMirror-gutter-wrapper {\n    position: absolute;\n    z-index: 4;\n    background: none !important;\n    border: none !important;\n  }\n  .CodeMirror-gutter-background {\n    position: absolute;\n    top: 0; bottom: 0;\n    z-index: 4;\n  }\n  .CodeMirror-gutter-elt {\n    position: absolute;\n    cursor: default;\n    z-index: 4;\n  }\n  .CodeMirror-gutter-wrapper ::selection { background-color: transparent }\n  .CodeMirror-gutter-wrapper ::-moz-selection { background-color: transparent }\n  \n  .CodeMirror-lines {\n    cursor: text;\n    min-height: 1px; /* prevents collapsing before first draw */\n  }\n  .CodeMirror pre {\n    /* Reset some styles that the rest of the page might have set */\n    -moz-border-radius: 0; -webkit-border-radius: 0; border-radius: 0;\n    border-width: 0;\n    background: transparent;\n    font-family: inherit;\n    font-size: inherit;\n    margin: 0;\n    white-space: pre;\n    word-wrap: normal;\n    line-height: inherit;\n    color: inherit;\n    z-index: 2;\n    position: relative;\n    overflow: visible;\n    -webkit-tap-highlight-color: transparent;\n    -webkit-font-variant-ligatures: contextual;\n    font-variant-ligatures: contextual;\n  }\n  .CodeMirror-wrap pre {\n    word-wrap: break-word;\n    white-space: pre-wrap;\n    word-break: normal;\n  }\n  \n  .CodeMirror-linebackground {\n    position: absolute;\n    left: 0; right: 0; top: 0; bottom: 0;\n    z-index: 0;\n  }\n  \n  .CodeMirror-linewidget {\n    position: relative;\n    z-index: 2;\n    padding: 0.1px; /* Force widget margins to stay inside of the container */\n  }\n  \n  .CodeMirror-widget {}\n  \n  .CodeMirror-rtl pre { direction: rtl; }\n  \n  .CodeMirror-code {\n    outline: none;\n  }\n  \n  /* Force content-box sizing for the elements where we expect it */\n  .CodeMirror-scroll,\n  .CodeMirror-sizer,\n  .CodeMirror-gutter,\n  .CodeMirror-gutters,\n  .CodeMirror-linenumber {\n    -moz-box-sizing: content-box;\n    box-sizing: content-box;\n  }\n  \n  .CodeMirror-measure {\n    position: absolute;\n    width: 100%;\n    height: 0;\n    overflow: hidden;\n    visibility: hidden;\n  }\n  \n  .CodeMirror-cursor {\n    position: absolute;\n    pointer-events: none;\n  }\n  .CodeMirror-measure pre { position: static; }\n  \n  div.CodeMirror-cursors {\n    visibility: hidden;\n    position: relative;\n    z-index: 3;\n  }\n  div.CodeMirror-dragcursors {\n    visibility: visible;\n  }\n  \n  .CodeMirror-focused div.CodeMirror-cursors {\n    visibility: visible;\n  }\n  \n  .CodeMirror-selected { background: #d9d9d9; }\n  .CodeMirror-focused .CodeMirror-selected { background: #d7d4f0; }\n  .CodeMirror-crosshair { cursor: crosshair; }\n  .CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection { background: #d7d4f0; }\n  .CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection { background: #d7d4f0; }\n  \n  .cm-searching {\n    background-color: #ffa;\n    background-color: rgba(255, 255, 0, .4);\n  }\n  \n  /* Used to force a border model for a node */\n  .cm-force-border { padding-right: .1px; }\n  \n  /* See issue #2901 */\n  .cm-tab-wrap-hack:after { content: ''; }\n  \n  /* Help users use markselection to safely style text background */\n  span.CodeMirror-selectedtext { background: none; }\n  \n  /* The lint marker gutter */\n  .CodeMirror-lint-markers {\n    width: 16px;\n  }\n  \n  .CodeMirror-lint-tooltip {\n    background-color: #ffd;\n    border: 1px solid black;\n    border-radius: 4px 4px 4px 4px;\n    color: black;\n    font-family: monospace;\n    font-size: 10pt;\n    overflow: hidden;\n    padding: 2px 5px;\n    position: fixed;\n    white-space: pre;\n    white-space: pre-wrap;\n    z-index: 100;\n    max-width: 600px;\n    opacity: 0;\n    transition: opacity .4s;\n    -moz-transition: opacity .4s;\n    -webkit-transition: opacity .4s;\n    -o-transition: opacity .4s;\n    -ms-transition: opacity .4s;\n  }\n  \n  .CodeMirror-lint-mark-error, .CodeMirror-lint-mark-warning {\n    background-position: left bottom;\n    background-repeat: repeat-x;\n  }\n  \n  .CodeMirror-lint-marker-error, .CodeMirror-lint-marker-warning {\n    background-position: center center;\n    background-repeat: no-repeat;\n    cursor: pointer;\n    display: inline-block;\n    height: 16px;\n    width: 16px;\n    vertical-align: middle;\n    position: relative;\n  }\n  \n  .CodeMirror-lint-message-error, .CodeMirror-lint-message-warning {\n    padding-left: 18px;\n    background-position: top left;\n    background-repeat: no-repeat;\n  }\n  \n  .CodeMirror-lint-marker-multiple {\n    background-image: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAcAAAAHCAMAAADzjKfhAAAACVBMVEUAAAAAAAC/v7914kyHAAAAAXRSTlMAQObYZgAAACNJREFUeNo1ioEJAAAIwmz/H90iFFSGJgFMe3gaLZ0od+9/AQZ0ADosbYraAAAAAElFTkSuQmCC\");\n    background-repeat: no-repeat;\n    background-position: right bottom;\n    width: 100%; height: 100%;\n  }\n\n  .CodeMirror {\n      height: 300px;\n      border: 1px solid #CCC;\n  }"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./sass/codemirror_custom.css":
/*!**************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./sass/codemirror_custom.css ***!
  \**************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/cssWithMappingToString.js */ "./node_modules/css-loader/dist/runtime/cssWithMappingToString.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_cssWithMappingToString_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".cm-s-elegant span.cm-number, .cm-s-elegant span.cm-atom { color: #000; }\n.cm-s-elegant span.cm-string { color: rgb(196, 32, 32); }\n.cm-s-elegant span.cm-comment { color: #888; }\n.cm-s-elegant span.cm-meta { color: #000; }\n.cm-s-elegant span.cm-variable { color: #000; }\n.cm-s-elegant span.cm-variable-2 { color: #000; }\n.cm-s-elegant span.cm-qualifier { color: #000; }\n.cm-s-elegant span.cm-keyword { color: rgb(196, 32, 32); }\n.cm-s-elegant span.cm-builtin { color: #000; }\n.cm-s-elegant span.cm-link { color: #000; }\n.cm-s-elegant span.cm-error { background-color: #000; }\n\n.cm-s-elegant .CodeMirror-activeline-background { background: #e8f2ff; }\n.cm-s-elegant .CodeMirror-matchingbracket { outline:1px solid rgba(0,0,0,0.15); color:black !important; }\n\n.CodeMirror-lint-mark-error {\n    background-position: 0 95%;\n    background-repeat: repeat-x;\n    background-size: 7px 3px;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 10'%3E%3Cpath fill='none' stroke='%23c42020' stroke-width='6' d='M0 8.5c8 0 8-7 16-7s8 7 16 7 8-7 16-7 8 7 16 7' class='st0'/%3E%3C/svg%3E\") !important;\n    padding-bottom: 5px;\n}\n.CodeMirror-lint-mark-warning {\n    background-position: 0 95%;\n    background-repeat: repeat-x;\n    background-size: 7px 4px;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='18' version='1' viewBox='0 0 32 18'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath stroke='%23A89542' stroke-width='5' d='M0 15c8 0 8-8 16-8s8 8 16 8'/%3E%3Cpath stroke='%23E0B72A' stroke-width='5' d='M0 11c8 0 8-8 16-8s8 8 16 8'/%3E%3C/g%3E%3C/svg%3E\");\n    padding-bottom: 5px;\n}\n.CodeMirror pre.CodeMirror-line {\n    padding: 0 8px;\n}\n.CodeMirror-linenumber {\n    padding-left: 0;\n}\n\n.CodeMirror-lint-message-error,\n.CodeMirror-lint-message-warning,\n.CodeMirror-lint-message-type,\n.CodeMirror-lint-message-reference {\n    padding-left: 20px;\n    background-position-y: 2px;\n    background-repeat: no-repeat;\n}\n\n.CodeMirror-lint-marker-error,\n.CodeMirror-lint-message-error {\n    background-size: 16px 16px;\n    background-image: url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2225%22%20viewBox%3D%22342%20152%2024%2025%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20fill%3D%22%23D51717%22%20fill-rule%3D%22evenodd%22%20cx%3D%22354%22%20cy%3D%22164.9775%22%20r%3D%2212%22/%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22square%22%20stroke%3D%22%23FFF%22%20stroke-width%3D%223%22%3E%3Cpath%20d%3D%22M349.0328%20169.9503L359.2832%20159.7M359.5187%20169.9503L349.2684%20159.7%22/%3E%3C/g%3E%3C/svg%3E);\n}\n.CodeMirror-lint-marker-warning,\n.CodeMirror-lint-message-warning {\n    background-size: 16px 16px;\n    background-image: url(data:image/svg+xml,%3Csvg%20width%3D%2228%22%20height%3D%2223%22%20viewBox%3D%22375%20153%2028%2023%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M389%20153.34c2.22%200%203.1%201.68%203.1%201.68l9.04%2015.37s1.55%202.54.5%203.94c-1.06%201.4-2.68%201.66-2.68%201.66h-19.53s-2.35-.32-3.2-1.66c-.85-1.35.8-3.95.8-3.95l8.9-15.38s.85-1.68%203.07-1.68z%22%20fill%3D%22%23F3CF00%22%20fill-rule%3D%22evenodd%22/%3E%3Cpath%20fill%3D%22%23544800%22%20fill-rule%3D%22evenodd%22%20d%3D%22M387%20159l.78%209%202.57.03.65-9.03%22/%3E%3Ccircle%20fill%3D%22%23544800%22%20fill-rule%3D%22evenodd%22%20cx%3D%22389%22%20cy%3D%22171.5%22%20r%3D%222%22/%3E%3C/svg%3E);\n}\n.CodeMirror-lint-marker-type,\n.CodeMirror-lint-message-type {\n    background-size: 14px 14px;\n    background-position-y: 4px;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cdefs/%3E%3Cpath fill='%233549CB' fill-rule='nonzero' d='M7.14 16.02c1.41-.03 2.47-.48 3.17-1.37a8.98 8.98 0 001.59-3.12l.26-.7-.68-.24-.29.63a9.9 9.9 0 01-1.12 2.06c-.24.32-.52.59-.85.8-.3.24-.7.35-1.17.35a.97.97 0 01-.8-.41 1.19 1.19 0 01-.35-.85c0-.42.05-.87.17-1.34L9.1 3.76c.56.07 1.34.1 2.33.1 1.18 0 2.05-.3 2.62-.88.54-.56.9-1.4 1.08-2.5h-.58c-.18.45-.5.74-.97.88a5 5 0 01-1.72.2c-.7 0-1.8-.03-3.31-.1-1.49-.04-2.78-.07-3.9-.07-1.31.03-2.3.43-2.97 1.21-.67.8-1.1 1.8-1.25 3H1C1.53 4.33 2.5 3.7 3.91 3.7c.94.02 1.72.05 2.33.1l-1.4 5.38c-.2.7-.36 1.34-.5 1.95a6.32 6.32 0 00-.27 1.76c0 .87.26 1.6.77 2.19.5.6 1.26.92 2.3.95z'/%3E%3C/svg%3E\");\n}\n.CodeMirror-lint-marker-error,\n.CodeMirror-lint-marker-warning {\n    left: 4px;\n    top: 2px;\n}\n\n\n.CodeMirror-lint-markers {\n    width: 24px;\n}\n.CodeMirror-linenumber {\n    color: #ccc;\n}\n.CodeMirror-gutters {\n    background: #fff;\n}\n\n.CodeMirror {\n    z-index: 2;\n    font-size: 14px;\n}\n", "",{"version":3,"sources":["webpack://./sass/codemirror_custom.css"],"names":[],"mappings":"AAAA,2DAA2D,WAAW,EAAE;AACxE,+BAA+B,uBAAuB,EAAE;AACxD,gCAAgC,WAAW,EAAE;AAC7C,6BAA6B,WAAW,EAAE;AAC1C,iCAAiC,WAAW,EAAE;AAC9C,mCAAmC,WAAW,EAAE;AAChD,kCAAkC,WAAW,EAAE;AAC/C,gCAAgC,uBAAuB,EAAE;AACzD,gCAAgC,WAAW,EAAE;AAC7C,6BAA6B,WAAW,EAAE;AAC1C,8BAA8B,sBAAsB,EAAE;;AAEtD,kDAAkD,mBAAmB,EAAE;AACvE,4CAA4C,kCAAkC,EAAE,sBAAsB,EAAE;;AAExG;IACI,0BAA0B;IAC1B,2BAA2B;IAC3B,wBAAwB;IACxB,2PAA2P;IAC3P,mBAAmB;AACvB;AACA;IACI,0BAA0B;IAC1B,2BAA2B;IAC3B,wBAAwB;IACxB,sWAAsW;IACtW,mBAAmB;AACvB;AACA;IACI,cAAc;AAClB;AACA;IACI,eAAe;AACnB;;AAEA;;;;IAII,kBAAkB;IAClB,0BAA0B;IAC1B,4BAA4B;AAChC;;AAEA;;IAEI,0BAA0B;IAC1B,iiBAAiiB;AACriB;AACA;;IAEI,0BAA0B;IAC1B,irBAAirB;AACrrB;AACA;;IAEI,0BAA0B;IAC1B,0BAA0B;IAC1B,mvBAAmvB;AACvvB;AACA;;IAEI,SAAS;IACT,QAAQ;AACZ;;;AAGA;IACI,WAAW;AACf;AACA;IACI,WAAW;AACf;AACA;IACI,gBAAgB;AACpB;;AAEA;IACI,UAAU;IACV,eAAe;AACnB","sourcesContent":[".cm-s-elegant span.cm-number, .cm-s-elegant span.cm-atom { color: #000; }\n.cm-s-elegant span.cm-string { color: rgb(196, 32, 32); }\n.cm-s-elegant span.cm-comment { color: #888; }\n.cm-s-elegant span.cm-meta { color: #000; }\n.cm-s-elegant span.cm-variable { color: #000; }\n.cm-s-elegant span.cm-variable-2 { color: #000; }\n.cm-s-elegant span.cm-qualifier { color: #000; }\n.cm-s-elegant span.cm-keyword { color: rgb(196, 32, 32); }\n.cm-s-elegant span.cm-builtin { color: #000; }\n.cm-s-elegant span.cm-link { color: #000; }\n.cm-s-elegant span.cm-error { background-color: #000; }\n\n.cm-s-elegant .CodeMirror-activeline-background { background: #e8f2ff; }\n.cm-s-elegant .CodeMirror-matchingbracket { outline:1px solid rgba(0,0,0,0.15); color:black !important; }\n\n.CodeMirror-lint-mark-error {\n    background-position: 0 95%;\n    background-repeat: repeat-x;\n    background-size: 7px 3px;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 10'%3E%3Cpath fill='none' stroke='%23c42020' stroke-width='6' d='M0 8.5c8 0 8-7 16-7s8 7 16 7 8-7 16-7 8 7 16 7' class='st0'/%3E%3C/svg%3E\") !important;\n    padding-bottom: 5px;\n}\n.CodeMirror-lint-mark-warning {\n    background-position: 0 95%;\n    background-repeat: repeat-x;\n    background-size: 7px 4px;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='18' version='1' viewBox='0 0 32 18'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath stroke='%23A89542' stroke-width='5' d='M0 15c8 0 8-8 16-8s8 8 16 8'/%3E%3Cpath stroke='%23E0B72A' stroke-width='5' d='M0 11c8 0 8-8 16-8s8 8 16 8'/%3E%3C/g%3E%3C/svg%3E\");\n    padding-bottom: 5px;\n}\n.CodeMirror pre.CodeMirror-line {\n    padding: 0 8px;\n}\n.CodeMirror-linenumber {\n    padding-left: 0;\n}\n\n.CodeMirror-lint-message-error,\n.CodeMirror-lint-message-warning,\n.CodeMirror-lint-message-type,\n.CodeMirror-lint-message-reference {\n    padding-left: 20px;\n    background-position-y: 2px;\n    background-repeat: no-repeat;\n}\n\n.CodeMirror-lint-marker-error,\n.CodeMirror-lint-message-error {\n    background-size: 16px 16px;\n    background-image: url(data:image/svg+xml,%3Csvg%20width%3D%2224%22%20height%3D%2225%22%20viewBox%3D%22342%20152%2024%2025%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Ccircle%20fill%3D%22%23D51717%22%20fill-rule%3D%22evenodd%22%20cx%3D%22354%22%20cy%3D%22164.9775%22%20r%3D%2212%22/%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%20stroke-linecap%3D%22square%22%20stroke%3D%22%23FFF%22%20stroke-width%3D%223%22%3E%3Cpath%20d%3D%22M349.0328%20169.9503L359.2832%20159.7M359.5187%20169.9503L349.2684%20159.7%22/%3E%3C/g%3E%3C/svg%3E);\n}\n.CodeMirror-lint-marker-warning,\n.CodeMirror-lint-message-warning {\n    background-size: 16px 16px;\n    background-image: url(data:image/svg+xml,%3Csvg%20width%3D%2228%22%20height%3D%2223%22%20viewBox%3D%22375%20153%2028%2023%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M389%20153.34c2.22%200%203.1%201.68%203.1%201.68l9.04%2015.37s1.55%202.54.5%203.94c-1.06%201.4-2.68%201.66-2.68%201.66h-19.53s-2.35-.32-3.2-1.66c-.85-1.35.8-3.95.8-3.95l8.9-15.38s.85-1.68%203.07-1.68z%22%20fill%3D%22%23F3CF00%22%20fill-rule%3D%22evenodd%22/%3E%3Cpath%20fill%3D%22%23544800%22%20fill-rule%3D%22evenodd%22%20d%3D%22M387%20159l.78%209%202.57.03.65-9.03%22/%3E%3Ccircle%20fill%3D%22%23544800%22%20fill-rule%3D%22evenodd%22%20cx%3D%22389%22%20cy%3D%22171.5%22%20r%3D%222%22/%3E%3C/svg%3E);\n}\n.CodeMirror-lint-marker-type,\n.CodeMirror-lint-message-type {\n    background-size: 14px 14px;\n    background-position-y: 4px;\n    background-image: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cdefs/%3E%3Cpath fill='%233549CB' fill-rule='nonzero' d='M7.14 16.02c1.41-.03 2.47-.48 3.17-1.37a8.98 8.98 0 001.59-3.12l.26-.7-.68-.24-.29.63a9.9 9.9 0 01-1.12 2.06c-.24.32-.52.59-.85.8-.3.24-.7.35-1.17.35a.97.97 0 01-.8-.41 1.19 1.19 0 01-.35-.85c0-.42.05-.87.17-1.34L9.1 3.76c.56.07 1.34.1 2.33.1 1.18 0 2.05-.3 2.62-.88.54-.56.9-1.4 1.08-2.5h-.58c-.18.45-.5.74-.97.88a5 5 0 01-1.72.2c-.7 0-1.8-.03-3.31-.1-1.49-.04-2.78-.07-3.9-.07-1.31.03-2.3.43-2.97 1.21-.67.8-1.1 1.8-1.25 3H1C1.53 4.33 2.5 3.7 3.91 3.7c.94.02 1.72.05 2.33.1l-1.4 5.38c-.2.7-.36 1.34-.5 1.95a6.32 6.32 0 00-.27 1.76c0 .87.26 1.6.77 2.19.5.6 1.26.92 2.3.95z'/%3E%3C/svg%3E\");\n}\n.CodeMirror-lint-marker-error,\n.CodeMirror-lint-marker-warning {\n    left: 4px;\n    top: 2px;\n}\n\n\n.CodeMirror-lint-markers {\n    width: 24px;\n}\n.CodeMirror-linenumber {\n    color: #ccc;\n}\n.CodeMirror-gutters {\n    background: #fff;\n}\n\n.CodeMirror {\n    z-index: 2;\n    font-size: 14px;\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./sass/codemirror.css":
/*!*****************************!*\
  !*** ./sass/codemirror.css ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_codemirror_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./codemirror.css */ "./node_modules/css-loader/dist/cjs.js!./sass/codemirror.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_codemirror_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_codemirror_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./sass/codemirror_custom.css":
/*!************************************!*\
  !*** ./sass/codemirror_custom.css ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_codemirror_custom_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../node_modules/css-loader/dist/cjs.js!./codemirror_custom.css */ "./node_modules/css-loader/dist/cjs.js!./sass/codemirror_custom.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_codemirror_custom_css__WEBPACK_IMPORTED_MODULE_1__["default"], options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_codemirror_custom_css__WEBPACK_IMPORTED_MODULE_1__["default"].locals || {});

/***/ }),

/***/ "./index.ts":
/*!******************!*\
  !*** ./index.ts ***!
  \******************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var CodeMirror = __webpack_require__(/*! codemirror */ "./node_modules/codemirror/lib/codemirror.js");
var onigasm_1 = __webpack_require__(/*! onigasm */ "./node_modules/onigasm/lib/index.js");
var codemirror_lint_js_1 = __webpack_require__(/*! ./codemirror_lint.js */ "./codemirror_lint.js");
__webpack_require__(/*! ./sass/codemirror.css */ "./sass/codemirror.css");
__webpack_require__(/*! ./sass/codemirror_custom.css */ "./sass/codemirror_custom.css");
var lzma_url_js_1 = __webpack_require__(/*! ./lzma-url.js */ "./lzma-url.js");
var codemirror_textmate_1 = __webpack_require__(/*! codemirror-textmate */ "./node_modules/codemirror-textmate/dist/index.js");
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var textarea, editor;
    return __generator(this, function (_a) {
        (0, codemirror_lint_js_1.add_lint)(CodeMirror);
        textarea = document.getElementById('hack_code');
        if (window.location.hash) {
            textarea.value = (0, lzma_url_js_1.decompressUrlSafe)(window.location.hash);
        }
        else {
            textarea.value = "function foo(): void {\n    $a = 1;\n    $b = 2;\n    $arr = vec[$a, $b];\n    echo $arr[0];\n}";
        }
        editor = CodeMirror.fromTextArea(textarea, {
            lineNumbers: true,
            matchBrackets: true,
            lineSeparator: "\n",
            mode: '',
            inputStyle: 'contenteditable',
            indentWithTabs: false,
            indentUnit: 4,
            theme: 'default',
        });
        editor.on('change', function () {
            window.location.hash = "";
        });
        document.querySelector('#get_link_button').addEventListener('click', function (e) {
            var hashed = (0, lzma_url_js_1.compressUrlSafe)(editor.getValue());
            e.preventDefault();
            window.location.hash = hashed;
            return false;
        });
        window.editor = editor;
        setTimeout(function () { return __awaiter(void 0, void 0, void 0, function () {
            var languageId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: 
                    // webpack has been configured to resolve `.wasm` files to actual 'paths" as opposed to using the built-in wasm-loader
                    // oniguruma is a low-level library and stock wasm-loader isn't equipped with advanced low-level API's to interact with libonig
                    return [4 /*yield*/, (0, onigasm_1.loadWASM)((__webpack_require__(/*! onigasm/lib/onigasm.wasm */ "./node_modules/onigasm/lib/onigasm.wasm")["default"]))];
                    case 1:
                        // webpack has been configured to resolve `.wasm` files to actual 'paths" as opposed to using the built-in wasm-loader
                        // oniguruma is a low-level library and stock wasm-loader isn't equipped with advanced low-level API's to interact with libonig
                        _a.sent();
                        languageId = 'source.hack';
                        (0, codemirror_textmate_1.addGrammar)(languageId, function () { return Promise.resolve().then(function () { return __webpack_require__(/*! ./tm/grammars/hack.tmLanguage.json */ "./tm/grammars/hack.tmLanguage.json"); }); });
                        return [4 /*yield*/, (0, codemirror_textmate_1.activateLanguage)(languageId, 'hack', 'asap')];
                    case 2:
                        _a.sent();
                        editor.setOption('mode', 'hack');
                        return [2 /*return*/];
                }
            });
        }); }, 0);
        return [2 /*return*/];
    });
}); })();


/***/ }),

/***/ "./tm/grammars/hack.tmLanguage.json":
/*!******************************************!*\
  !*** ./tm/grammars/hack.tmLanguage.json ***!
  \******************************************/
/***/ ((module) => {

module.exports = JSON.parse('{"scopeName":"source.hack","name":"Hack","fileTypes":["hh","php","hack"],"foldingStartMarker":"(/\\\\*|\\\\{\\\\s*$|<<<HTML)","foldingStopMarker":"(\\\\*/|^\\\\s*\\\\}|^HTML;)","patterns":[{"include":"#language"}],"repository":{"class-builtin":{"patterns":[{"captures":{"1":{"name":"punctuation.separator.inheritance.php"}},"match":"(?i)(\\\\\\\\)?\\\\b(st(dClass|reamWrapper)|R(RD(Graph|Creator|Updater)|untimeException|e(sourceBundle|cursive(RegexIterator|Ca(chingIterator|llbackFilterIterator)|TreeIterator|Iterator(Iterator)?|DirectoryIterator|FilterIterator|ArrayIterator)|flect(ion(Method|Class|ZendExtension|Object|P(arameter|roperty)|Extension|Function(Abstract)?)?|or)|gexIterator)|angeException)|G(ender\\\\Gender|lobIterator|magick(Draw|Pixel)?)|X(sltProcessor|ML(Reader|Writer)|SLTProcessor)|M(ysqlndUh(Connection|PreparedStatement)|ongo(Re(sultException|gex)|Grid(fsFile|FS(Cursor|File)?)|BinData|C(o(de|llection)|ursor(Exception)?|lient)|Timestamp|I(nt(32|64)|d)|D(B(Ref)?|ate)|Pool|Log)?|u(tex|ltipleIterator)|e(ssageFormatter|mcache(d)?))|Bad(MethodCallException|FunctionCallException)|tidy(Node)?|S(tackable|impleXML(Iterator|Element)|oap(Server|Header|Client|Param|Var|Fault)|NMP|CA(_(SoapProxy|LocalProxy))?|p(hinxClient|oofchecker|l(M(inHeap|axHeap)|S(tack|ubject)|Heap|T(ype|empFileObject)|Ob(server|jectStorage)|DoublyLinkedList|PriorityQueue|Enum|Queue|Fi(le(Info|Object)|xedArray)))|e(ssionHandler(Interface)?|ekableIterator|rializable)|DO_(Model_(ReflectionDataObject|Type|Property)|Sequence|D(ata(Object|Factory)|AS_(Relational|XML(_Document)?|Setting|ChangeSummary|Data(Object|Factory)))|Exception|List)|wish(Result(s)?|Search)?|VM(Model)?|QLite(Result|3(Result|Stmt)?|Database|Unbuffered)|AM(Message|Connection))|H(ttp(Re(sponse|quest(Pool)?)|Message|InflateStream|DeflateStream|QueryString)|aru(Image|Outline|D(oc|estination)|Page|Encoder|Font|Annotation))|Yaf_(R(oute(_(Re(write|gex)|Map|S(tatic|imple|upervar)|Interface)|r)|e(sponse_Abstract|quest_(Simple|Http|Abstract)|gistry))|Session|Con(troller_Abstract|fig_(Simple|Ini|Abstract))|Dispatcher|Plugin_Abstract|Exception|View_(Simple|Interface)|Loader|A(ction_Abstract|pplication))|N(o(RewindIterator|rmalizer)|umberFormatter)|C(o(nd|untable|llator)|a(chingIterator|llbackFilterIterator))|T(hread|okyoTyrant(Table|Iterator|Query)?|ra(nsliterator|versable))|I(n(tlDateFormatter|validArgumentException|finiteIterator)|terator(Iterator|Aggregate)?|magick(Draw|Pixel(Iterator)?)?)|php_user_filter|ZipArchive|O(CI-(Collection|Lob)|ut(erIterator|Of(RangeException|BoundsException))|verflowException)|D(irectory(Iterator)?|omainException|OM(XPath|N(ode(list)?|amedNodeMap)|C(haracterData|omment|dataSection)|Text|Implementation|Document(Fragment)?|ProcessingInstruction|E(ntityReference|lement)|Attr)|ate(Time(Zone)?|Interval|Period))|Un(derflowException|expectedValueException)|JsonSerializable|finfo|P(har(Data|FileInfo)?|DO(Statement)?|arentIterator)|E(v(S(tat|ignal)|Ch(ild|eck)|Timer|I(o|dle)|P(eriodic|repare)|Embed|Fork|Watcher|Loop)?|rrorException|xception|mptyIterator)|V(8Js(Exception)?|arnish(Stat|Log|Admin))|KTaglib_(MPEG_(File|AudioProperties)|Tag|ID3v2_(Tag|Frame|AttachedPictureFrame))|QuickHash(StringIntHash|Int(S(tringHash|et)|Hash))|Fil(terIterator|esystemIterator)|mysqli(_(stmt|driver|warning|result))?|W(orker|eak(Map|ref))|L(imitIterator|o(cale|gicException)|ua(Closure)?|engthException|apack)|A(MQP(C(hannel|onnection)|E(nvelope|xchange)|Queue)|ppendIterator|PCIterator|rray(Iterator|Object|Access)))\\\\b","name":"support.class.builtin.php"}]},"class-name":{"patterns":[{"begin":"(?i)(?=\\\\\\\\?[a-z_0-9]+\\\\\\\\)","end":"(?i)([a-z_][a-z_0-9]*)?(?=[^a-z0-9_\\\\\\\\])","endCaptures":{"1":{"name":"support.class.php"}},"patterns":[{"include":"#namespace"}]},{"include":"#class-builtin"},{"begin":"(?=[\\\\\\\\a-zA-Z_])","end":"(?i)([a-z_][a-z_0-9]*)?(?=[^a-z0-9_\\\\\\\\])","endCaptures":{"1":{"name":"support.class.php"}},"patterns":[{"include":"#namespace"}]}]},"comments":{"patterns":[{"begin":"/\\\\*\\\\*(?:#@\\\\+)?\\\\s*$","captures":{"0":{"name":"punctuation.definition.comment.php"}},"comment":"This now only highlights a docblock if the first line contains only /**\\n- this is to stop highlighting everything as invalid when people do comment banners with /******** ...\\n- Now matches /**#@+ too - used for docblock templates:\\n  http://manual.phpdoc.org/HTMLframesConverter/default/phpDocumentor/tutorial_phpDocumentor.howto.pkg.html#basics.docblocktemplate","end":"\\\\*/","name":"comment.block.documentation.phpdoc.php","patterns":[{"include":"#php_doc"}]},{"begin":"/\\\\*","captures":{"0":{"name":"punctuation.definition.comment.php"}},"end":"\\\\*/","name":"comment.block.php"},{"begin":"(^[ \\\\t]+)?(?=//)","beginCaptures":{"1":{"name":"punctuation.whitespace.comment.leading.php"}},"end":"(?!\\\\G)","patterns":[{"begin":"//","beginCaptures":{"0":{"name":"punctuation.definition.comment.php"}},"end":"\\\\n|(?=\\\\?>)","name":"comment.line.double-slash.php"}]},{"begin":"(^[ \\\\t]+)?(?=#)","beginCaptures":{"1":{"name":"punctuation.whitespace.comment.leading.php"}},"end":"(?!\\\\G)","patterns":[{"begin":"#","beginCaptures":{"0":{"name":"punctuation.definition.comment.php"}},"end":"\\\\n|(?=\\\\?>)","name":"comment.line.number-sign.php"}]}]},"generics":{"patterns":[{"begin":"(<)","beginCaptures":{"1":{"name":"punctuation.definition.generics.php"}},"end":"(>)","endCaptures":{"1":{"name":"punctuation.definition.generics.php"}},"name":"meta.generics.php","patterns":[{"include":"#comments"},{"include":"#generics"},{"match":"([-+])?([A-Za-z_][A-Za-z0-9_]*)(?:\\\\s+(as|super)\\\\s+([A-Za-z_][A-Za-z0-9_]*))?","name":"support.type.php"},{"include":"#type-annotation"}]}]},"implements":{"patterns":[{"begin":"(?i)(implements)\\\\s+","beginCaptures":{"1":{"name":"storage.modifier.implements.php"}},"end":"(?i)(?=[;{])","patterns":[{"include":"#comments"},{"begin":"(?i)(?=[a-z0-9_\\\\\\\\]+)","contentName":"meta.other.inherited-class.php","end":"(?i)(?:\\\\s*(?:,|(?=[^a-z0-9_\\\\\\\\\\\\s]))\\\\s*)","patterns":[{"begin":"(?i)(?=\\\\\\\\?[a-z_0-9]+\\\\\\\\)","end":"(?i)([a-z_][a-z_0-9]*)?(?=[^a-z0-9_\\\\\\\\])","endCaptures":{"1":{"name":"entity.other.inherited-class.php"}},"patterns":[{"include":"#namespace"}]},{"include":"#class-builtin"},{"include":"#namespace"},{"match":"(?i)[a-z_][a-z_0-9]*","name":"entity.other.inherited-class.php"}]}]}]},"attributes":{"patterns":[{"begin":"(<<)(?!<)","beginCaptures":{"1":{"name":"punctuation.definition.attributes.php"}},"end":"(>>)","endCaptures":{"1":{"name":"punctuation.definition.attributes.php"}},"name":"meta.attributes.php","patterns":[{"include":"#comments"},{"match":"([A-Za-z_][A-Za-z0-9_]*)","name":"entity.other.attribute-name.php"},{"begin":"(\\\\()","beginCaptures":{"1":{"name":"punctuation.definition.parameters.begin.php"}},"end":"(\\\\))","endCaptures":{"1":{"name":"punctuation.definition.parameters.end.php"}},"patterns":[{"include":"#language"}]}]}]},"constants":{"patterns":[{"begin":"(?xi)\\n(?=\\n  (\\n    (\\\\\\\\[a-z_][a-z_0-9]*\\\\\\\\[a-z_][a-z_0-9\\\\\\\\]*)\\n    |\\n    ([a-z_][a-z_0-9]*\\\\\\\\[a-z_][a-z_0-9\\\\\\\\]*)\\n  )\\n  [^a-z_0-9\\\\\\\\]\\n)","end":"(?i)([a-z_][a-z_0-9]*)?(?=[^a-z0-9_\\\\\\\\])","endCaptures":{"1":{"name":"constant.other.php"}},"patterns":[{"include":"#namespace"}]},{"begin":"(?=\\\\\\\\?[a-zA-Z_\\\\x{7f}-\\\\x{ff}])","end":"(?=[^\\\\\\\\a-zA-Z_\\\\x{7f}-\\\\x{ff}])","patterns":[{"match":"(?i)\\\\b(TRUE|FALSE|NULL|__(FILE|DIR|FUNCTION|CLASS|METHOD|LINE|NAMESPACE)__)\\\\b","name":"constant.language.php"},{"captures":{"1":{"name":"punctuation.separator.inheritance.php"}},"match":"(\\\\\\\\)?\\\\b(STD(IN|OUT|ERR)|ZEND_(THREAD_SAFE|DEBUG_BUILD)|DEFAULT_INCLUDE_PATH|P(HP_(R(OUND_HALF_(ODD|DOWN|UP|EVEN)|ELEASE_VERSION)|M(INOR_VERSION|A(XPATHLEN|JOR_VERSION))|BINDIR|S(HLIB_SUFFIX|YSCONFDIR|API)|CONFIG_FILE_(SCAN_DIR|PATH)|INT_(MAX|SIZE)|ZTS|O(S|UTPUT_HANDLER_(START|CONT|END))|D(EBUG|ATADIR)|URL_(SCHEME|HOST|USER|P(ORT|A(SS|TH))|QUERY|FRAGMENT)|PREFIX|E(XT(RA_VERSION|ENSION_DIR)|OL)|VERSION(_ID)?|WINDOWS_(NT_(SERVER|DOMAIN_CONTROLLER|WORKSTATION)|VERSION_(M(INOR|AJOR)|BUILD|S(UITEMASK|P_M(INOR|AJOR))|P(RODUCTTYPE|LATFORM)))|L(IBDIR|OCALSTATEDIR))|EAR_(INSTALL_DIR|EXTENSION_DIR))|E_(RECOVERABLE_ERROR|STRICT|NOTICE|CO(RE_(ERROR|WARNING)|MPILE_(ERROR|WARNING))|DEPRECATED|USER_(NOTICE|DEPRECATED|ERROR|WARNING)|PARSE|ERROR|WARNING|ALL))\\\\b","name":"support.constant.core.php"},{"captures":{"1":{"name":"punctuation.separator.inheritance.php"}},"match":"(\\\\\\\\)?\\\\b(RADIXCHAR|GROUPING|M(_(1_PI|SQRT(1_2|2|3|PI)|2_(SQRTPI|PI)|PI(_(2|4))?|E(ULER)?|L(N(10|2|PI)|OG(10E|2E)))|ON_(GROUPING|1(1|2|0)?|7|2|8|THOUSANDS_SEP|3|DECIMAL_POINT|9|4|5|6))|S(TR_PAD_(RIGHT|BOTH|LEFT)|ORT_(REGULAR|STRING|NUMERIC|DESC|LOCALE_STRING|ASC)|EEK_(SET|CUR|END))|H(TML_(SPECIALCHARS|ENTITIES)|ASH_HMAC)|YES(STR|EXPR)|N(_(S(IGN_POSN|EP_BY_SPACE)|CS_PRECEDES)|O(STR|EXPR)|EGATIVE_SIGN|AN)|C(R(YPT_(MD5|BLOWFISH|S(HA(256|512)|TD_DES|ALT_LENGTH)|EXT_DES)|NCYSTR|EDITS_(G(ROUP|ENERAL)|MODULES|SAPI|DOCS|QA|FULLPAGE|ALL))|HAR_MAX|O(NNECTION_(NORMAL|TIMEOUT|ABORTED)|DESET|UNT_(RECURSIVE|NORMAL))|URRENCY_SYMBOL|ASE_(UPPER|LOWER))|__COMPILER_HALT_OFFSET__|T(HOUS(EP|ANDS_SEP)|_FMT(_AMPM)?)|IN(T_(CURR_SYMBOL|FRAC_DIGITS)|I_(S(YSTEM|CANNER_(RAW|NORMAL))|USER|PERDIR|ALL)|F(O_(GENERAL|MODULES|C(REDITS|ONFIGURATION)|ENVIRONMENT|VARIABLES|LICENSE|ALL))?)|D(_(T_FMT|FMT)|IRECTORY_SEPARATOR|ECIMAL_POINT|A(Y_(1|7|2|3|4|5|6)|TE_(R(SS|FC(1(123|036)|2822|8(22|50)|3339))|COOKIE|ISO8601|W3C|ATOM)))|UPLOAD_ERR_(NO_(TMP_DIR|FILE)|CANT_WRITE|INI_SIZE|OK|PARTIAL|EXTENSION|FORM_SIZE)|P(M_STR|_(S(IGN_POSN|EP_BY_SPACE)|CS_PRECEDES)|OSITIVE_SIGN|ATH(_SEPARATOR|INFO_(BASENAME|DIRNAME|EXTENSION|FILENAME)))|E(RA(_(YEAR|T_FMT|D_(T_FMT|FMT)))?|XTR_(REFS|SKIP|IF_EXISTS|OVERWRITE|PREFIX_(SAME|I(NVALID|F_EXISTS)|ALL))|NT_(NOQUOTES|COMPAT|IGNORE|QUOTES))|FRAC_DIGITS|L(C_(M(ONETARY|ESSAGES)|NUMERIC|C(TYPE|OLLATE)|TIME|ALL)|O(G_(MAIL|SYSLOG|N(O(TICE|WAIT)|DELAY|EWS)|C(R(IT|ON)|ONS)|INFO|ODELAY|D(EBUG|AEMON)|U(SER|UCP)|P(ID|ERROR)|E(RR|MERG)|KERN|WARNING|L(OCAL(1|7|2|3|4|5|0|6)|PR)|A(UTH(PRIV)?|LERT))|CK_(SH|NB|UN|EX)))|A(M_STR|B(MON_(1(1|2|0)?|7|2|8|3|9|4|5|6)|DAY_(1|7|2|3|4|5|6))|SSERT_(BAIL|CALLBACK|QUIET_EVAL|WARNING|ACTIVE)|LT_DIGITS))\\\\b","name":"support.constant.std.php"},{"captures":{"1":{"name":"punctuation.separator.inheritance.php"}},"match":"(\\\\\\\\)?\\\\b(GLOB_(MARK|BRACE|NO(SORT|CHECK|ESCAPE)|ONLYDIR|ERR|AVAILABLE_FLAGS)|XML_(SAX_IMPL|HTML_DOCUMENT_NODE|N(OTATION_NODE|AMESPACE_DECL_NODE)|C(OMMENT_NODE|DATA_SECTION_NODE)|TEXT_NODE|OPTION_(SKIP_(TAGSTART|WHITE)|CASE_FOLDING|TARGET_ENCODING)|D(TD_NODE|OCUMENT_(NODE|TYPE_NODE|FRAG_NODE))|PI_NODE|E(RROR_(RECURSIVE_ENTITY_REF|MISPLACED_XML_PI|B(INARY_ENTITY_REF|AD_CHAR_REF)|SYNTAX|NO(NE|_(MEMORY|ELEMENTS))|TAG_MISMATCH|IN(CORRECT_ENCODING|VALID_TOKEN)|DUPLICATE_ATTRIBUTE|UN(CLOSED_(CDATA_SECTION|TOKEN)|DEFINED_ENTITY|KNOWN_ENCODING)|JUNK_AFTER_DOC_ELEMENT|PAR(TIAL_CHAR|AM_ENTITY_REF)|EXTERNAL_ENTITY_HANDLING|A(SYNC_ENTITY|TTRIBUTE_EXTERNAL_ENTITY_REF))|NTITY_(REF_NODE|NODE|DECL_NODE)|LEMENT_(NODE|DECL_NODE))|LOCAL_NAMESPACE|ATTRIBUTE_(N(MTOKEN(S)?|O(TATION|DE))|CDATA|ID(REF(S)?)?|DECL_NODE|EN(TITY|UMERATION)))|M(HASH_(RIPEMD(1(28|60)|256|320)|GOST|MD(2|4|5)|S(HA(1|2(24|56)|384|512)|NEFRU256)|HAVAL(1(28|92|60)|2(24|56))|CRC32(B)?|TIGER(1(28|60))?|WHIRLPOOL|ADLER32)|YSQL(_(BOTH|NUM|CLIENT_(SSL|COMPRESS|I(GNORE_SPACE|NTERACTIVE))|ASSOC)|I_(RE(PORT_(STRICT|INDEX|OFF|ERROR|ALL)|FRESH_(GRANT|MASTER|BACKUP_LOG|S(TATUS|LAVE)|HOSTS|T(HREADS|ABLES)|LOG)|AD_DEFAULT_(GROUP|FILE))|GROUP_FLAG|MULTIPLE_KEY_FLAG|B(INARY_FLAG|OTH|LOB_FLAG)|S(T(MT_ATTR_(CURSOR_TYPE|UPDATE_MAX_LENGTH|PREFETCH_ROWS)|ORE_RESULT)|E(RVER_QUERY_(NO_(GOOD_INDEX_USED|INDEX_USED)|WAS_SLOW)|T_(CHARSET_NAME|FLAG)))|N(O(_D(EFAULT_VALUE_FLAG|ATA)|T_NULL_FLAG)|UM(_FLAG)?)|C(URSOR_TYPE_(READ_ONLY|SCROLLABLE|NO_CURSOR|FOR_UPDATE)|LIENT_(SSL|NO_SCHEMA|COMPRESS|I(GNORE_SPACE|NTERACTIVE)|FOUND_ROWS))|T(YPE_(GEOMETRY|MEDIUM_BLOB|B(IT|LOB)|S(HORT|TRING|ET)|YEAR|N(ULL|EWD(ECIMAL|ATE))|CHAR|TI(ME(STAMP)?|NY(_BLOB)?)|INT(24|ERVAL)|D(OUBLE|ECIMAL|ATE(TIME)?)|ENUM|VAR_STRING|FLOAT|LONG(_BLOB|LONG)?)|IMESTAMP_FLAG)|INIT_COMMAND|ZEROFILL_FLAG|O(N_UPDATE_NOW_FLAG|PT_(NET_(READ_BUFFER_SIZE|CMD_BUFFER_SIZE)|CONNECT_TIMEOUT|INT_AND_FLOAT_NATIVE|LOCAL_INFILE))|D(EBUG_TRACE_ENABLED|ATA_TRUNCATED)|U(SE_RESULT|N(SIGNED_FLAG|IQUE_KEY_FLAG))|P(RI_KEY_FLAG|ART_KEY_FLAG)|ENUM_FLAG|A(S(SOC|YNC)|UTO_INCREMENT_FLAG)))|CRYPT_(R(C(2|6)|IJNDAEL_(1(28|92)|256)|AND)|GOST|XTEA|M(ODE_(STREAM|NOFB|C(BC|FB)|OFB|ECB)|ARS)|BLOWFISH(_COMPAT)?|S(ERPENT|KIPJACK|AFER(128|PLUS|64))|C(RYPT|AST_(128|256))|T(RIPLEDES|HREEWAY|WOFISH)|IDEA|3DES|DE(S|CRYPT|V_(RANDOM|URANDOM))|PANAMA|EN(CRYPT|IGNA)|WAKE|LOKI97|ARCFOUR(_IV)?))|S(TREAM_(REPORT_ERRORS|M(UST_SEEK|KDIR_RECURSIVE)|BUFFER_(NONE|FULL|LINE)|S(HUT_(RD(WR)?|WR)|OCK_(R(DM|AW)|S(TREAM|EQPACKET)|DGRAM)|ERVER_(BIND|LISTEN))|NOTIFY_(RE(SOLVE|DIRECTED)|MIME_TYPE_IS|SEVERITY_(INFO|ERR|WARN)|CO(MPLETED|NNECT)|PROGRESS|F(ILE_SIZE_IS|AILURE)|AUTH_RE(SULT|QUIRED))|C(RYPTO_METHOD_(SSLv(2(_(SERVER|CLIENT)|3_(SERVER|CLIENT))|3_(SERVER|CLIENT))|TLS_(SERVER|CLIENT))|LIENT_(CONNECT|PERSISTENT|ASYNC_CONNECT)|AST_(FOR_SELECT|AS_STREAM))|I(GNORE_URL|S_URL|PPROTO_(RAW|TCP|I(CMP|P)|UDP))|O(OB|PTION_(READ_(BUFFER|TIMEOUT)|BLOCKING|WRITE_BUFFER))|U(RL_STAT_(QUIET|LINK)|SE_PATH)|P(EEK|F_(INET(6)?|UNIX))|ENFORCE_SAFE_MODE|FILTER_(READ|WRITE|ALL))|UNFUNCS_RET_(STRING|TIMESTAMP|DOUBLE)|QLITE(_(R(OW|EADONLY)|MIS(MATCH|USE)|B(OTH|USY)|SCHEMA|N(O(MEM|T(FOUND|ADB)|LFS)|UM)|C(O(RRUPT|NSTRAINT)|ANTOPEN)|TOOBIG|I(NTER(RUPT|NAL)|OERR)|OK|DONE|P(ROTOCOL|ERM)|E(RROR|MPTY)|F(ORMAT|ULL)|LOCKED|A(BORT|SSOC|UTH))|3_(B(OTH|LOB)|NU(M|LL)|TEXT|INTEGER|OPEN_(READ(ONLY|WRITE)|CREATE)|FLOAT|ASSOC)))|CURL(M(SG_DONE|_(BAD_(HANDLE|EASY_HANDLE)|CALL_MULTI_PERFORM|INTERNAL_ERROR|O(UT_OF_MEMORY|K)))|SSH_AUTH_(HOST|NONE|DEFAULT|P(UBLICKEY|ASSWORD)|KEYBOARD)|CLOSEPOLICY_(SLOWEST|CALLBACK|OLDEST|LEAST_(RECENTLY_USED|TRAFFIC))|_(HTTP_VERSION_(1_(1|0)|NONE)|NETRC_(REQUIRED|IGNORED|OPTIONAL)|TIMECOND_(IF(MODSINCE|UNMODSINCE)|LASTMOD)|IPRESOLVE_(V(4|6)|WHATEVER)|VERSION_(SSL|IPV6|KERBEROS4|LIBZ))|INFO_(RE(DIRECT_(COUNT|TIME)|QUEST_SIZE)|S(SL_VERIFYRESULT|TARTTRANSFER_TIME|IZE_(DOWNLOAD|UPLOAD)|PEED_(DOWNLOAD|UPLOAD))|H(TTP_CODE|EADER_(SIZE|OUT))|NAMELOOKUP_TIME|C(ON(NECT_TIME|TENT_(TYPE|LENGTH_(DOWNLOAD|UPLOAD)))|ERTINFO)|TOTAL_TIME|PR(IVATE|ETRANSFER_TIME)|EFFECTIVE_URL|FILETIME)|OPT_(R(E(SUME_FROM|TURNTRANSFER|DIR_PROTOCOLS|FERER|AD(DATA|FUNCTION))|AN(GE|DOM_FILE))|MAX(REDIRS|CONNECTS)|B(INARYTRANSFER|UFFERSIZE)|S(S(H_(HOST_PUBLIC_KEY_MD5|P(RIVATE_KEYFILE|UBLIC_KEYFILE)|AUTH_TYPES)|L(CERT(TYPE|PASSWD)?|_(CIPHER_LIST|VERIFY(HOST|PEER))|ENGINE(_DEFAULT)?|VERSION|KEY(TYPE|PASSWD)?))|TDERR)|H(TTP(GET|HEADER|200ALIASES|_VERSION|PROXYTUNNEL|AUTH)|EADER(FUNCTION)?)|N(O(BODY|SIGNAL|PROGRESS)|ETRC)|C(RLF|O(NNECTTIMEOUT(_MS)?|OKIE(SESSION|JAR|FILE)?)|USTOMREQUEST|ERTINFO|LOSEPOLICY|A(INFO|PATH))|T(RANSFERTEXT|CP_NODELAY|IME(CONDITION|OUT(_MS)?|VALUE))|I(N(TERFACE|FILE(SIZE)?)|PRESOLVE)|DNS_(CACHE_TIMEOUT|USE_GLOBAL_CACHE)|U(RL|SER(PWD|AGENT)|NRESTRICTED_AUTH|PLOAD)|P(R(IVATE|O(GRESSFUNCTION|XY(TYPE|USERPWD|PORT|AUTH)?|TOCOLS))|O(RT|ST(REDIR|QUOTE|FIELDS)?)|UT)|E(GDSOCKET|NCODING)|VERBOSE|K(RB4LEVEL|EYPASSWD)|QUOTE|F(RESH_CONNECT|TP(SSLAUTH|_(S(SL|KIP_PASV_IP)|CREATE_MISSING_DIRS|USE_EP(RT|SV)|FILEMETHOD)|PORT|LISTONLY|APPEND)|ILE(TIME)?|O(RBID_REUSE|LLOWLOCATION)|AILONERROR)|WRITE(HEADER|FUNCTION)|LOW_SPEED_(TIME|LIMIT)|AUTOREFERER)|PRO(XY_(SOCKS(4|5)|HTTP)|TO_(S(CP|FTP)|HTTP(S)?|T(ELNET|FTP)|DICT|F(TP(S)?|ILE)|LDAP(S)?|ALL))|E_(RE(CV_ERROR|AD_ERROR)|GOT_NOTHING|MALFORMAT_USER|BAD_(C(ONTENT_ENCODING|ALLING_ORDER)|PASSWORD_ENTERED|FUNCTION_ARGUMENT)|S(S(H|L_(C(IPHER|ONNECT_ERROR|ERTPROBLEM|ACERT)|PEER_CERTIFICATE|ENGINE_(SETFAILED|NOTFOUND)))|HARE_IN_USE|END_ERROR)|HTTP_(RANGE_ERROR|NOT_FOUND|PO(RT_FAILED|ST_ERROR))|COULDNT_(RESOLVE_(HOST|PROXY)|CONNECT)|T(OO_MANY_REDIRECTS|ELNET_OPTION_SYNTAX)|O(BSOLETE|UT_OF_MEMORY|PERATION_TIMEOUTED|K)|U(RL_MALFORMAT(_USER)?|N(SUPPORTED_PROTOCOL|KNOWN_TELNET_OPTION))|PARTIAL_FILE|F(TP_(BAD_DOWNLOAD_RESUME|SSL_FAILED|C(OULDNT_(RETR_FILE|GET_SIZE|S(TOR_FILE|ET_(BINARY|ASCII))|USE_REST)|ANT_(RECONNECT|GET_HOST))|USER_PASSWORD_INCORRECT|PORT_FAILED|QUOTE_ERROR|W(RITE_ERROR|EIRD_(SERVER_REPLY|227_FORMAT|USER_REPLY|PAS(S_REPLY|V_REPLY)))|ACCESS_DENIED)|ILE(SIZE_EXCEEDED|_COULDNT_READ_FILE)|UNCTION_NOT_FOUND|AILED_INIT)|WRITE_ERROR|L(IBRARY_NOT_FOUND|DAP_(SEARCH_FAILED|CANNOT_BIND|INVALID_URL))|ABORTED_BY_CALLBACK)|VERSION_NOW|FTP(METHOD_(MULTICWD|SINGLECWD|NOCWD)|SSL_(NONE|CONTROL|TRY|ALL)|AUTH_(SSL|TLS|DEFAULT))|AUTH_(GSSNEGOTIATE|BASIC|NTLM|DIGEST|ANY(SAFE)?))|I(MAGETYPE_(GIF|XBM|BMP|SWF|COUNT|TIFF_(MM|II)|I(CO|FF)|UNKNOWN|J(B2|P(X|2|C|EG(2000)?))|P(SD|NG)|WBMP)|NPUT_(REQUEST|GET|SE(RVER|SSION)|COOKIE|POST|ENV)|CONV_(MIME_DECODE_(STRICT|CONTINUE_ON_ERROR)|IMPL|VERSION))|D(NS_(MX|S(RV|OA)|HINFO|N(S|APTR)|CNAME|TXT|PTR|A(NY|LL|AAA|6)?)|OM(STRING_SIZE_ERR|_(SYNTAX_ERR|HIERARCHY_REQUEST_ERR|N(O(_(MODIFICATION_ALLOWED_ERR|DATA_ALLOWED_ERR)|T_(SUPPORTED_ERR|FOUND_ERR))|AMESPACE_ERR)|IN(DEX_SIZE_ERR|USE_ATTRIBUTE_ERR|VALID_(MODIFICATION_ERR|STATE_ERR|CHARACTER_ERR|ACCESS_ERR))|PHP_ERR|VALIDATION_ERR|WRONG_DOCUMENT_ERR)))|JSON_(HEX_(TAG|QUOT|A(MP|POS))|NUMERIC_CHECK|ERROR_(S(YNTAX|TATE_MISMATCH)|NONE|CTRL_CHAR|DEPTH|UTF8)|FORCE_OBJECT)|P(REG_(RECURSION_LIMIT_ERROR|GREP_INVERT|BA(CKTRACK_LIMIT_ERROR|D_UTF8_(OFFSET_ERROR|ERROR))|S(PLIT_(NO_EMPTY|OFFSET_CAPTURE|DELIM_CAPTURE)|ET_ORDER)|NO_ERROR|INTERNAL_ERROR|OFFSET_CAPTURE|PATTERN_ORDER)|SFS_(PASS_ON|ERR_FATAL|F(EED_ME|LAG_(NORMAL|FLUSH_(CLOSE|INC))))|CRE_VERSION|OSIX_(R_OK|X_OK|S_IF(REG|BLK|SOCK|CHR|IFO)|F_OK|W_OK))|F(NM_(NOESCAPE|CASEFOLD|P(ERIOD|ATHNAME))|IL(TER_(REQUIRE_(SCALAR|ARRAY)|SANITIZE_(MAGIC_QUOTES|S(TRI(NG|PPED)|PECIAL_CHARS)|NUMBER_(INT|FLOAT)|URL|E(MAIL|NCODED)|FULL_SPECIAL_CHARS)|NULL_ON_FAILURE|CALLBACK|DEFAULT|UNSAFE_RAW|VALIDATE_(REGEXP|BOOLEAN|I(NT|P)|URL|EMAIL|FLOAT)|F(ORCE_ARRAY|LAG_(S(CHEME_REQUIRED|TRIP_(BACKTICK|HIGH|LOW))|HOST_REQUIRED|NO(NE|_(RES_RANGE|PRIV_RANGE|ENCODE_QUOTES))|IPV(4|6)|PATH_REQUIRED|E(MPTY_STRING_NULL|NCODE_(HIGH|LOW|AMP))|QUERY_REQUIRED|ALLOW_(SCIENTIFIC|HEX|THOUSAND|OCTAL|FRACTION))))|E(_(BINARY|SKIP_EMPTY_LINES|NO_DEFAULT_CONTEXT|TEXT|IGNORE_NEW_LINES|USE_INCLUDE_PATH|APPEND)|INFO_(RAW|MIME(_(TYPE|ENCODING))?|SYMLINK|NONE|CONTINUE|DEVICES|PRESERVE_ATIME)))|ORCE_(GZIP|DEFLATE))|LIBXML_(XINCLUDE|N(SCLEAN|O(XMLDECL|BLANKS|NET|CDATA|E(RROR|MPTYTAG|NT)|WARNING))|COMPACT|D(TD(VALID|LOAD|ATTR)|OTTED_VERSION)|PARSEHUGE|ERR_(NONE|ERROR|FATAL|WARNING)|VERSION|LOADED_VERSION))\\\\b","name":"support.constant.ext.php"},{"captures":{"1":{"name":"punctuation.separator.inheritance.php"}},"match":"(\\\\\\\\)?\\\\bT_(RE(TURN|QUIRE(_ONCE)?)|G(OTO|LOBAL)|XOR_EQUAL|M(INUS_EQUAL|OD_EQUAL|UL_EQUAL|ETHOD_C|L_COMMENT)|B(REAK|OOL(_CAST|EAN_(OR|AND))|AD_CHARACTER)|S(R(_EQUAL)?|T(RING(_(CAST|VARNAME))?|A(RT_HEREDOC|TIC))|WITCH|L(_EQUAL)?)|HALT_COMPILER|N(S_(SEPARATOR|C)|UM_STRING|EW|AMESPACE)|C(HARACTER|O(MMENT|N(ST(ANT_ENCAPSED_STRING)?|CAT_EQUAL|TINUE))|URLY_OPEN|L(O(SE_TAG|NE)|ASS(_C)?)|A(SE|TCH))|T(RY|HROW)|I(MPLEMENTS|S(SET|_(GREATER_OR_EQUAL|SMALLER_OR_EQUAL|NOT_(IDENTICAL|EQUAL)|IDENTICAL|EQUAL))|N(STANCEOF|C(LUDE(_ONCE)?)?|T(_CAST|ERFACE)|LINE_HTML)|F)|O(R_EQUAL|BJECT_(CAST|OPERATOR)|PEN_TAG(_WITH_ECHO)?|LD_FUNCTION)|D(NUMBER|I(R|V_EQUAL)|O(C_COMMENT|UBLE_(C(OLON|AST)|ARROW)|LLAR_OPEN_CURLY_BRACES)?|E(C(LARE)?|FAULT))|U(SE|NSET(_CAST)?)|P(R(I(NT|VATE)|OTECTED)|UBLIC|LUS_EQUAL|AAMAYIM_NEKUDOTAYIM)|E(X(TENDS|IT)|MPTY|N(CAPSED_AND_WHITESPACE|D(SWITCH|_HEREDOC|IF|DECLARE|FOR(EACH)?|WHILE))|CHO|VAL|LSE(IF)?)|VAR(IABLE)?|F(I(NAL|LE)|OR(EACH)?|UNC(_C|TION))|WHI(TESPACE|LE)|L(NUMBER|I(ST|NE)|OGICAL_(XOR|OR|AND))|A(RRAY(_CAST)?|BSTRACT|S|ND_EQUAL))\\\\b","name":"support.constant.parser-token.php"},{"comment":"In PHP, any identifier which is not a variable is taken to be a constant.\\nHowever, if there is no constant defined with the given name then a notice\\nis generated and the constant is assumed to have the value of its name.","match":"[a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*","name":"constant.other.php"}]}]},"function-return-type":{"patterns":[{"begin":"(:)","beginCaptures":{"1":{"name":"punctuation.definition.type.php"}},"end":"(?=[{;])","patterns":[{"include":"#comments"},{"include":"#type-annotation"},{"include":"#class-name"}]}]},"type-annotation":{"name":"support.type.php","patterns":[{"match":"\\\\barray\\\\b","name":"support.type.array.php"},{"match":"\\\\b(?:bool|int|float|string|array|resource|mixed|arraykey|nonnull|dict|vec|keyset)\\\\b","name":"support.type.php"},{"begin":"([A-Za-z_][A-Za-z0-9_]*)<","beginCaptures":{"1":{"name":"support.class.php"}},"end":">","patterns":[{"include":"#type-annotation"}]},{"begin":"(shape\\\\()","end":"((,|\\\\.\\\\.\\\\.)?\\\\s*\\\\))","endCaptures":{"1":{"name":"keyword.operator.key.php"}},"name":"storage.type.shape.php","patterns":[{"include":"#type-annotation"},{"include":"#strings"},{"include":"#constants"}]},{"begin":"\\\\(","end":"\\\\)","patterns":[{"include":"#type-annotation"}]},{"include":"#class-name"},{"include":"#comments"}]},"function-arguments":{"patterns":[{"include":"#comments"},{"include":"#attributes"},{"include":"#type-annotation"},{"begin":"(?xi)\\n\\\\s*(&)?      # Reference\\n\\\\s*((\\\\$+)[a-z_\\\\x{7f}-\\\\x{ff}][a-z0-9_\\\\x{7f}-\\\\x{ff}]*)  # The variable name","end":"(?xi)\\n\\\\s*(?=,|\\\\)|$) # A closing parentheses (end of argument list) or a comma","beginCaptures":{"1":{"name":"storage.modifier.reference.php"},"2":{"name":"variable.other.php"},"3":{"name":"punctuation.definition.variable.php"}},"patterns":[{"begin":"(=)","end":"(?=,|\\\\))","beginCaptures":{"1":{"name":"keyword.operator.assignment.php"}},"patterns":[{"include":"#language"}]}]}]},"literal-collections":{"patterns":[{"begin":"(Vector|ImmVector|Set|ImmSet|Map|ImmMap|Pair)\\\\s*({)","end":"(})","beginCaptures":{"1":{"name":"support.class.php"},"2":{"name":"punctuation.section.array.begin.php"}},"endCaptures":{"1":{"name":"punctuation.section.array.end.php"}},"name":"meta.collection.literal.php","patterns":[{"include":"#language"}]}]},"function-call":{"patterns":[{"begin":"(?i)(?=\\\\\\\\?[a-z_0-9\\\\\\\\]+\\\\\\\\[a-z_][a-z0-9_]*\\\\s*\\\\()","comment":"Functions in a user-defined namespace (overrides any built-ins)","end":"(?=\\\\s*\\\\()","patterns":[{"include":"#user-function-call"}]},{"match":"(?i)\\\\b(print|echo)\\\\b","name":"support.function.construct.php"},{"begin":"(?i)(\\\\\\\\)?(?=\\\\b[a-z_][a-z_0-9]*\\\\s*\\\\()","beginCaptures":{"1":{"name":"punctuation.separator.inheritance.php"}},"comment":"Root namespace function calls (built-in or user)","end":"(?=\\\\s*\\\\()","patterns":[{"match":"(?i)\\\\b(isset|unset|e(val|mpty)|list)(?=\\\\s*\\\\()","name":"support.function.construct.php"},{"include":"#support"},{"include":"#user-function-call"}]}]},"heredoc":{"patterns":[{"begin":"<<<\\\\s*(\\"?)([a-zA-Z_]+[a-zA-Z0-9_]*)(\\\\1)\\\\s*$","beginCaptures":{"2":{"name":"keyword.operator.heredoc.php"}},"end":"^(\\\\2)(?=;?$)","endCaptures":{"1":{"name":"keyword.operator.heredoc.php"}},"name":"string.unquoted.heredoc.php","patterns":[{"include":"#interpolation"}]},{"begin":"<<<\\\\s*(\'?)([a-zA-Z_]+[a-zA-Z0-9_]*)(\\\\1)\\\\s*$","beginCaptures":{"2":{"name":"keyword.operator.heredoc.php"}},"end":"^(\\\\2)(?=;?$)","endCaptures":{"1":{"name":"keyword.operator.heredoc.php"}},"name":"string.unquoted.heredoc.nowdoc.php"}]},"instantiation":{"begin":"(?i)(new)\\\\s+","beginCaptures":{"1":{"name":"keyword.other.new.php"}},"end":"(?i)(?=[^$a-z0-9_\\\\\\\\])","patterns":[{"match":"(parent|static|self)(?=[^a-z0-9_])","name":"support.type.php"},{"include":"#class-name"},{"include":"#variable-name"}]},"interpolation":{"comment":"http://www.php.net/manual/en/language.types.string.php#language.types.string.parsing","patterns":[{"comment":"Interpolating octal values e.g. \\\\01 or \\\\07.","match":"\\\\\\\\[0-7]{1,3}","name":"constant.numeric.octal.php"},{"comment":"Interpolating hex values e.g. \\\\x1 or \\\\xFF.","match":"\\\\\\\\x[0-9A-Fa-f]{1,2}","name":"constant.numeric.hex.php"},{"comment":"Escaped characters in double-quoted strings e.g. \\\\n or \\\\t.","match":"\\\\\\\\[nrt\\\\\\\\\\\\$\\\\\\"]","name":"constant.character.escape.php"},{"comment":"Interpolating expressions in double-quoted strings with {} e.g. {$x->y->z[0][1]}.","match":"(\\\\{\\\\$.*?\\\\})","name":"variable.other.php"},{"comment":"Interpolating simple variables, e.g. $x, $x->y, $x[z] but not $x->y->z.","match":"(\\\\$[a-zA-Z_][a-zA-Z0-9_]*((->[a-zA-Z_][a-zA-Z0-9_]*)|(\\\\[[a-zA-Z0-9_]+\\\\]))?)","name":"variable.other.php"}]},"invoke-call":{"captures":{"1":{"name":"punctuation.definition.variable.php"},"2":{"name":"variable.other.php"}},"match":"(?i)(\\\\$+)([a-z_][a-z_0-9]*)(?=\\\\s*\\\\()","name":"meta.function-call.invoke.php"},"interface":{"begin":"^(?i)\\\\b(interface)\\\\b","beginCaptures":{"1":{"name":"storage.type.interface.php"}},"name":"meta.interface.php","end":"(?=[;{])","patterns":[{"include":"#comments"},{"match":"\\\\b(extends)\\\\b","captures":{"1":{"name":"storage.modifier.extends.php"}}},{"include":"#generics"},{"include":"#namespace"},{"match":"(?i)[a-z0-9_]+","name":"entity.name.type.class.php"}]},"language":{"patterns":[{"include":"#comments"},{"begin":"(?=^\\\\s*<<)","end":"(?<=>>)","patterns":[{"include":"#attributes"}]},{"include":"#xhp"},{"include":"#interface"},{"begin":"(?xi)\\n^\\\\s*\\n(type|newtype)\\n\\\\s+\\n([a-z0-9_]+)","beginCaptures":{"1":{"name":"storage.type.typedecl.php"},"2":{"name":"entity.name.type.typedecl.php"}},"end":"(;)","endCaptures":{"1":{"name":"punctuation.termination.expression.php"}},"name":"meta.typedecl.php","patterns":[{"include":"#comments"},{"include":"#generics"},{"match":"(=)","name":"keyword.operator.assignment.php"},{"include":"#type-annotation"}]},{"begin":"(?i)^\\\\s*(trait)\\\\s+([a-z0-9_]+)\\\\s*","beginCaptures":{"1":{"name":"storage.type.trait.php"},"2":{"name":"entity.name.type.class.php"}},"end":"(?=[{])","name":"meta.trait.php","patterns":[{"include":"#comments"},{"include":"#generics"},{"include":"#implements"}]},{"begin":"(?i)(?:^\\\\s*|\\\\s*)(namespace)\\\\b\\\\s+(?=([a-z0-9_\\\\\\\\]*\\\\s*($|[;{]|(\\\\/[\\\\/*])))|$)","beginCaptures":{"1":{"name":"keyword.other.namespace.php"}},"contentName":"entity.name.type.namespace.php","end":"(?i)(?=\\\\s*$|[^a-z0-9_\\\\\\\\])","name":"meta.namespace.php","patterns":[{"match":"\\\\\\\\","name":"punctuation.separator.inheritance.php"}]},{"begin":"(?i)\\\\s*\\\\b(use)\\\\s+","beginCaptures":{"1":{"name":"keyword.other.use.php"}},"end":"(?=;|(?:^\\\\s*$))","name":"meta.use.php","patterns":[{"include":"#comments"},{"begin":"(?i)\\\\s*(?=[a-z_0-9\\\\\\\\])","end":"(?xi)\\n(?:\\n  (?:\\\\s*(as)\\\\b\\\\s*([a-z_0-9]*)\\\\s*(?=,|;|$))|\\n  (?=,|;|$)\\n)","endCaptures":{"1":{"name":"keyword.other.use-as.php"},"2":{"name":"support.other.namespace.use-as.php"}},"patterns":[{"include":"#class-builtin"},{"begin":"(?i)\\\\s*(?=[\\\\\\\\a-z_0-9])","end":"$|(?=[\\\\s,;])","name":"support.other.namespace.use.php","patterns":[{"match":"\\\\\\\\","name":"punctuation.separator.inheritance.php"}]}]},{"match":"\\\\s*,\\\\s*"}]},{"begin":"(?i)^\\\\s*(abstract|final)?\\\\s*(abstract|final)?\\\\s*(class)\\\\s+([a-z0-9_]+)\\\\s*","beginCaptures":{"1":{"name":"storage.modifier.php"},"2":{"name":"storage.modifier.php"},"3":{"name":"storage.type.class.php"},"4":{"name":"entity.name.type.class.php"}},"end":"(?=[;{])","name":"meta.class.php","patterns":[{"include":"#comments"},{"include":"#generics"},{"include":"#implements"},{"begin":"(?i)(extends)\\\\s+","beginCaptures":{"1":{"name":"storage.modifier.extends.php"}},"contentName":"meta.other.inherited-class.php","end":"(?i)(?=[^a-z_0-9\\\\\\\\])","patterns":[{"begin":"(?i)(?=\\\\\\\\?[a-z_0-9]+\\\\\\\\)","end":"(?i)([a-z_][a-z_0-9]*)?(?=[^a-z0-9_\\\\\\\\])","endCaptures":{"1":{"name":"entity.other.inherited-class.php"}},"patterns":[{"include":"#namespace"}]},{"include":"#class-builtin"},{"include":"#namespace"},{"match":"(?i)[a-z_][a-z_0-9]*","name":"entity.other.inherited-class.php"}]}]},{"captures":{"1":{"name":"keyword.control.php"}},"match":"\\\\s*\\\\b((break|c(ase|ontinue)|d(e(clare|fault)|ie|o)|e(lse(if)?|nd(declare|for(each)?|if|switch|while)|xit)|for(each)?|if|return|switch|use|while))\\\\b"},{"begin":"(?i)\\\\b((?:require|include)(?:_once)?)\\\\b\\\\s*","beginCaptures":{"1":{"name":"keyword.control.import.include.php"}},"end":"(?=\\\\s|;|$)","name":"meta.include.php","patterns":[{"include":"#language"}]},{"begin":"\\\\b(catch)\\\\s*(\\\\()","beginCaptures":{"1":{"name":"keyword.control.exception.catch.php"},"2":{"name":"punctuation.definition.parameters.begin.bracket.round.php"}},"end":"\\\\)","endCaptures":{"0":{"name":"punctuation.definition.parameters.end.bracket.round.php"}},"name":"meta.catch.php","patterns":[{"include":"#namespace"},{"match":"(?xi)\\n([a-z_\\\\x{7f}-\\\\x{10ffff}][a-z0-9_\\\\x{7f}-\\\\x{10ffff}]*)                 # Exception class\\n((?:\\\\s*\\\\|\\\\s*[a-z_\\\\x{7f}-\\\\x{10ffff}][a-z0-9_\\\\x{7f}-\\\\x{10ffff}]*)*) # Optional additional exception classes\\n\\\\s*\\n((\\\\$+)[a-z_\\\\x{7f}-\\\\x{10ffff}][a-z0-9_\\\\x{7f}-\\\\x{10ffff}]*)           # Variable","captures":{"1":{"name":"support.class.exception.php"},"2":{"patterns":[{"match":"(?i)[a-z_\\\\x{7f}-\\\\x{10ffff}][a-z0-9_\\\\x{7f}-\\\\x{10ffff}]*","name":"support.class.exception.php"},{"match":"\\\\|","name":"punctuation.separator.delimiter.php"}]},"3":{"name":"variable.other.php"},"4":{"name":"punctuation.definition.variable.php"}}}]},{"match":"\\\\b(catch|try|throw|exception|finally)\\\\b","name":"keyword.control.exception.php"},{"begin":"(?i)\\\\b(function)\\\\s*(&\\\\s*)?(?=\\\\()","beginCaptures":{"1":{"name":"storage.type.function.php"},"2":{"name":"storage.modifier.reference.php"}},"end":"\\\\{|\\\\)","name":"meta.function.closure.php","patterns":[{"begin":"(\\\\()","beginCaptures":{"1":{"name":"punctuation.definition.parameters.begin.php"}},"contentName":"meta.function.arguments.php","end":"(\\\\))","endCaptures":{"1":{"name":"punctuation.definition.parameters.end.php"}},"patterns":[{"include":"#function-arguments"}]},{"begin":"(?i)(use)\\\\s*(\\\\()","beginCaptures":{"1":{"name":"keyword.other.function.use.php"},"2":{"name":"punctuation.definition.parameters.begin.php"}},"end":"(\\\\))","endCaptures":{"1":{"name":"punctuation.definition.parameters.end.php"}},"patterns":[{"captures":{"1":{"name":"storage.modifier.reference.php"},"2":{"name":"variable.other.php"},"3":{"name":"punctuation.definition.variable.php"}},"match":"(?:\\\\s*(&))?\\\\s*((\\\\$+)[a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*)\\\\s*(?=,|\\\\))","name":"meta.function.closure.use.php"}]}]},{"begin":"(?x)\\n\\\\s*((?:(?:final|abstract|public|private|protected|static|async)\\\\s+)*)\\n(function)\\n(?:\\\\s+|(\\\\s*&\\\\s*))\\n(?:\\n  (__(?:call|construct|destruct|get|set|isset|unset|tostring|clone|set_state|sleep|wakeup|autoload|invoke|callStatic|dispose|disposeAsync)(?=[^a-zA-Z0-9_\\\\x7f-\\\\xff]))\\n  |\\n  ([a-zA-Z0-9_]+)\\n)","beginCaptures":{"1":{"patterns":[{"match":"final|abstract|public|private|protected|static|async","name":"storage.modifier.php"}]},"2":{"name":"storage.type.function.php"},"3":{"name":"storage.modifier.reference.php"},"4":{"name":"support.function.magic.php"},"5":{"name":"entity.name.function.php"},"6":{"name":"meta.function.generics.php"}},"end":"(?=[{;])","name":"meta.function.php","patterns":[{"include":"#generics"},{"begin":"(\\\\()","beginCaptures":{"1":{"name":"punctuation.definition.parameters.begin.php"}},"end":"(?=\\\\))","contentName":"meta.function.arguments.php","patterns":[{"include":"#function-arguments"}]},{"begin":"(\\\\))","beginCaptures":{"1":{"name":"punctuation.definition.parameters.end.php"}},"end":"(?=[{;])","patterns":[{"include":"#function-return-type"}]}]},{"include":"#invoke-call"},{"begin":"(?xi)\\n\\\\s*\\n  (?=\\n    [a-z_0-9$\\\\\\\\]+(::)\\n    (?:\\n      ([a-z_][a-z_0-9]*)\\\\s*\\\\(\\n      |\\n      ((\\\\$+)[a-z_\\\\x{7f}-\\\\x{ff}][a-z0-9_\\\\x{7f}-\\\\x{ff}]*)\\n      |\\n      ([a-z_\\\\x{7f}-\\\\x{ff}][a-z0-9_\\\\x{7f}-\\\\x{ff}]*)\\n    )?\\n  )","end":"(?x)\\n(::)\\n(?:\\n  ([A-Za-z_][A-Za-z_0-9]*)\\\\s*\\\\(\\n  |\\n  ((\\\\$+)[a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*)\\n  |\\n  ([a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*)\\n)?","endCaptures":{"1":{"name":"keyword.operator.class.php"},"2":{"name":"meta.function-call.static.php"},"3":{"name":"variable.other.class.php"},"4":{"name":"punctuation.definition.variable.php"},"5":{"name":"constant.other.class.php"}},"patterns":[{"match":"(self|static|parent)\\\\b","name":"support.type.php"},{"include":"#class-name"},{"include":"#variable-name"}]},{"include":"#variables"},{"include":"#strings"},{"captures":{"1":{"name":"support.function.construct.php"},"2":{"name":"punctuation.definition.array.begin.php"},"3":{"name":"punctuation.definition.array.end.php"}},"match":"(array)(\\\\()(\\\\))","name":"meta.array.empty.php"},{"begin":"(array)(\\\\()","beginCaptures":{"1":{"name":"support.function.construct.php"},"2":{"name":"punctuation.definition.array.begin.php"}},"end":"\\\\)","endCaptures":{"0":{"name":"punctuation.definition.array.end.php"}},"name":"meta.array.php","patterns":[{"include":"#language"}]},{"captures":{"1":{"name":"support.type.php"}},"match":"(?i)\\\\s*\\\\(\\\\s*(array|real|double|float|int(eger)?|bool(ean)?|string|object|binary|unset|arraykey|nonnull|dict|vec|keyset)\\\\s*\\\\)"},{"match":"(?i)\\\\b(array|real|double|float|int(eger)?|bool(ean)?|string|class|clone|var|function|interface|trait|parent|self|object|arraykey|nonnull|dict|vec|keyset)\\\\b","name":"support.type.php"},{"match":"(?i)\\\\b(global|abstract|const|extends|implements|final|p(r(ivate|otected)|ublic)|static)\\\\b","name":"storage.modifier.php"},{"include":"#object"},{"match":";","name":"punctuation.terminator.expression.php"},{"include":"#heredoc"},{"match":"\\\\.=?","name":"keyword.operator.string.php"},{"match":"=>","name":"keyword.operator.key.php"},{"match":"==>","name":"keyword.operator.lambda.php"},{"match":"\\\\|>","name":"keyword.operator.pipe.php"},{"match":"(@)","name":"keyword.operator.error-control.php"},{"match":"(!==|!=|===|==)","name":"keyword.operator.comparison.php"},{"match":"=|\\\\+=|\\\\-=|\\\\*=|/=|%=|&=|\\\\|=|\\\\^=|<<=|>>=","name":"keyword.operator.assignment.php"},{"match":"(<=|>=|<|>)","name":"keyword.operator.comparison.php"},{"match":"(\\\\-\\\\-|\\\\+\\\\+)","name":"keyword.operator.increment-decrement.php"},{"match":"(\\\\-|\\\\+|\\\\*|/|%)","name":"keyword.operator.arithmetic.php"},{"match":"(!|&&|\\\\|\\\\|)","name":"keyword.operator.logical.php"},{"begin":"(?i)\\\\b(as|is)\\\\b\\\\s+(?=[\\\\\\\\$a-z_])","beginCaptures":{"1":{"name":"keyword.operator.type.php"}},"end":"(?=[^\\\\\\\\$A-Za-z_0-9])","patterns":[{"include":"#class-name"},{"include":"#variable-name"}]},{"match":"(?i)\\\\b(is|as)\\\\b","name":"keyword.operator.type.php"},{"include":"#function-call"},{"match":"<<|>>|~|\\\\^|&|\\\\|","name":"keyword.operator.bitwise.php"},{"include":"#numbers"},{"include":"#instantiation"},{"begin":"\\\\[","beginCaptures":{"0":{"name":"punctuation.section.array.begin.php"}},"end":"\\\\]","endCaptures":{"0":{"name":"punctuation.section.array.end.php"}},"patterns":[{"include":"#language"}]},{"include":"#literal-collections"},{"begin":"\\\\{","beginCaptures":{"0":{"name":"punctuation.section.scope.begin.php"}},"end":"\\\\}","endCaptures":{"0":{"name":"punctuation.section.scope.end.php"}},"patterns":[{"include":"#language"}]},{"include":"#constants"}]},"namespace":{"begin":"(?i)((namespace)|[a-z0-9_]+)?(\\\\\\\\)(?=.*?[^a-z_0-9\\\\\\\\])","beginCaptures":{"1":{"name":"entity.name.type.namespace.php"},"3":{"name":"punctuation.separator.inheritance.php"}},"end":"(?i)(?=[a-z0-9_]*[^a-z0-9_\\\\\\\\])","name":"support.other.namespace.php","patterns":[{"name":"entity.name.type.namespace.php","match":"(?i)[a-z0-9_]+(?=\\\\\\\\)"},{"captures":{"1":{"name":"punctuation.separator.inheritance.php"}},"match":"(?i)(\\\\\\\\)"}]},"numbers":{"match":"\\\\b((0(x|X)[0-9a-fA-F]*)|(([0-9]+\\\\.?[0-9]*)|(\\\\.[0-9]+))((e|E)(\\\\+|-)?[0-9]+)?)\\\\b","name":"constant.numeric.php"},"object":{"patterns":[{"begin":"(->)(\\\\$?\\\\{)","beginCaptures":{"1":{"name":"keyword.operator.class.php"},"2":{"name":"punctuation.definition.variable.php"}},"end":"(\\\\})","endCaptures":{"1":{"name":"punctuation.definition.variable.php"}},"patterns":[{"include":"#language"}]},{"captures":{"1":{"name":"keyword.operator.class.php"},"2":{"name":"meta.function-call.object.php"},"3":{"name":"variable.other.property.php"},"4":{"name":"punctuation.definition.variable.php"}},"match":"(?x)\\n(->)\\n  (?:\\n    ([A-Za-z_][A-Za-z_0-9]*)\\\\s*\\\\(\\n    |\\n    ((\\\\$+)?[a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*)\\n  )?"}]},"parameter-default-types":{"patterns":[{"include":"#strings"},{"include":"#numbers"},{"include":"#variables"},{"match":"=>","name":"keyword.operator.key.php"},{"match":"=","name":"keyword.operator.assignment.php"},{"match":"&(?=\\\\s*\\\\$)","name":"storage.modifier.reference.php"},{"begin":"(array)\\\\s*(\\\\()","beginCaptures":{"1":{"name":"support.function.construct.php"},"2":{"name":"punctuation.definition.array.begin.php"}},"end":"\\\\)","endCaptures":{"0":{"name":"punctuation.definition.array.end.php"}},"name":"meta.array.php","patterns":[{"include":"#parameter-default-types"}]},{"include":"#instantiation"},{"begin":"(?xi)\\n\\\\s*\\n(?=\\n  [a-z_0-9\\\\\\\\]+(::)\\n  ([a-z_\\\\x{7f}-\\\\x{ff}][a-z0-9_\\\\x{7f}-\\\\x{ff}]*)?\\n)","end":"(?i)(::)([a-z_\\\\x{7f}-\\\\x{ff}][a-z0-9_\\\\x{7f}-\\\\x{ff}]*)?","endCaptures":{"1":{"name":"keyword.operator.class.php"},"2":{"name":"constant.other.class.php"}},"patterns":[{"include":"#class-name"}]},{"include":"#constants"}]},"php_doc":{"patterns":[{"comment":"PHPDocumentor only recognises lines with an asterisk as the first non-whitespaces character","match":"^(?!\\\\s*\\\\*).*$\\\\n?","name":"invalid.illegal.missing-asterisk.phpdoc.php"},{"captures":{"1":{"name":"keyword.other.phpdoc.php"},"3":{"name":"storage.modifier.php"},"4":{"name":"invalid.illegal.wrong-access-type.phpdoc.php"}},"match":"^\\\\s*\\\\*\\\\s*(@access)\\\\s+((public|private|protected)|(.+))\\\\s*$"},{"captures":{"1":{"name":"keyword.other.phpdoc.php"},"2":{"name":"markup.underline.link.php"}},"match":"(@xlink)\\\\s+(.+)\\\\s*$"},{"match":"\\\\@(a(bstract|uthor)|c(ategory|opyright)|example|global|internal|li(cense|nk)|pa(ckage|ram)|return|s(ee|ince|tatic|ubpackage)|t(hrows|odo)|v(ar|ersion)|uses|deprecated|final|ignore)\\\\b","name":"keyword.other.phpdoc.php"},{"captures":{"1":{"name":"keyword.other.phpdoc.php"}},"match":"\\\\{(@(link)).+?\\\\}","name":"meta.tag.inline.phpdoc.php"}]},"regex-double-quoted":{"begin":"(?x)\\n\\"/ (?=(\\\\\\\\.|[^\\"/])++/[imsxeADSUXu]*\\")","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.php"}},"end":"(/)([imsxeADSUXu]*)(\\")","endCaptures":{"0":{"name":"punctuation.definition.string.end.php"}},"name":"string.regexp.double-quoted.php","patterns":[{"comment":"Escaped from the regexp – there can also be 2 backslashes (since 1 will escape the first)","match":"(\\\\\\\\){1,2}[.$^\\\\[\\\\]{}]","name":"constant.character.escape.regex.php"},{"include":"#interpolation"},{"captures":{"1":{"name":"punctuation.definition.arbitrary-repetition.php"},"3":{"name":"punctuation.definition.arbitrary-repetition.php"}},"match":"(\\\\{)\\\\d+(,\\\\d+)?(\\\\})","name":"string.regexp.arbitrary-repetition.php"},{"begin":"\\\\[(?:\\\\^?\\\\])?","captures":{"0":{"name":"punctuation.definition.character-class.php"}},"end":"\\\\]","name":"string.regexp.character-class.php","patterns":[{"include":"#interpolation"}]},{"match":"[$^+*]","name":"keyword.operator.regexp.php"}]},"regex-single-quoted":{"begin":"(?x)\\n\'/ (?=(\\\\\\\\.|[^\'/])++/[imsxeADSUXu]*\')","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.php"}},"end":"(/)([imsxeADSUXu]*)(\')","endCaptures":{"0":{"name":"punctuation.definition.string.end.php"}},"name":"string.regexp.single-quoted.php","patterns":[{"captures":{"1":{"name":"punctuation.definition.arbitrary-repetition.php"},"3":{"name":"punctuation.definition.arbitrary-repetition.php"}},"match":"(\\\\{)\\\\d+(,\\\\d+)?(\\\\})","name":"string.regexp.arbitrary-repetition.php"},{"comment":"Escaped from the regexp – there can also be 2 backslashes (since 1 will escape the first)","match":"(\\\\\\\\){1,2}[.$^\\\\[\\\\]{}]","name":"constant.character.escape.regex.php"},{"comment":"Escaped from the PHP string – there can also be 2 backslashes (since 1 will escape the first)","match":"\\\\\\\\{1,2}[\\\\\\\\\']","name":"constant.character.escape.php"},{"begin":"\\\\[(?:\\\\^?\\\\])?","captures":{"0":{"name":"punctuation.definition.character-class.php"}},"end":"\\\\]","name":"string.regexp.character-class.php","patterns":[{"match":"\\\\\\\\[\\\\\\\\\'\\\\[\\\\]]","name":"constant.character.escape.php"}]},{"match":"[$^+*]","name":"keyword.operator.regexp.php"}]},"string-double-quoted":{"begin":"\\"","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.php"}},"comment":"This contentName is just to allow the usage of “select scope” to select the string contents first, then the string with quotes","contentName":"meta.string-contents.quoted.double.php","end":"\\"","endCaptures":{"0":{"name":"punctuation.definition.string.end.php"}},"name":"string.quoted.double.php","patterns":[{"include":"#interpolation"}]},"string-single-quoted":{"begin":"\'","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.php"}},"contentName":"meta.string-contents.quoted.single.php","end":"\'","endCaptures":{"0":{"name":"punctuation.definition.string.end.php"}},"name":"string.quoted.single.php","patterns":[{"match":"\\\\\\\\[\\\\\\\\\']","name":"constant.character.escape.php"}]},"strings":{"patterns":[{"include":"#regex-double-quoted"},{"include":"#string-double-quoted"},{"include":"#regex-single-quoted"},{"include":"#string-single-quoted"}]},"support":{"patterns":[{"match":"(?i)\\\\bapc_(s(tore|ma_info)|c(ompile_file|lear_cache|a(s|che_info))|inc|de(c|fine_constants|lete(_file)?)|exists|fetch|load_constants|add|bin_(dump(file)?|load(file)?))\\\\b","name":"support.function.apc.php"},{"match":"(?i)\\\\b(s(huffle|izeof|ort)|n(ext|at(sort|casesort))|c(o(unt|mpact)|urrent)|in_array|u(sort|ksort|asort)|p(os|rev)|e(nd|ach|xtract)|k(sort|ey|rsort)|list|a(sort|r(sort|ray(_(s(hift|um|plice|earch|lice)|c(h(unk|ange_key_case)|o(unt_values|mbine))|intersect(_(u(key|assoc)|key|assoc))?|diff(_(u(key|assoc)|key|assoc))?|u(n(shift|ique)|intersect(_(uassoc|assoc))?|diff(_(uassoc|assoc))?)|p(op|ush|ad|roduct)|values|key(s|_exists)|f(il(ter|l(_keys)?)|lip)|walk(_recursive)?|r(e(duce|place(_recursive)?|verse)|and)|m(ultisort|erge(_recursive)?|ap)))?))|r(sort|eset|ange))\\\\b","name":"support.function.array.php"},{"match":"(?i)\\\\b(s(how_source|ys_getloadavg|leep)|highlight_(string|file)|con(stant|nection_(status|timeout|aborted))|time_(sleep_until|nanosleep)|ignore_user_abort|d(ie|efine(d)?)|u(sleep|n(iqid|pack))|__halt_compiler|p(hp_(strip_whitespace|check_syntax)|ack)|e(val|xit)|get_browser)\\\\b","name":"support.function.basic_functions.php"},{"match":"(?i)\\\\bbc(s(cale|ub|qrt)|comp|div|pow(mod)?|add|m(od|ul))\\\\b","name":"support.function.bcmath.php"},{"match":"(?i)\\\\bbz(c(ompress|lose)|open|decompress|err(str|no|or)|flush|write|read)\\\\b","name":"support.function.bz2.php"},{"match":"(?i)\\\\b(GregorianToJD|cal_(to_jd|info|days_in_month|from_jd)|unixtojd|jdto(unix|jewish)|easter_da(ys|te)|J(ulianToJD|ewishToJD|D(MonthName|To(Gregorian|Julian|French)|DayOfWeek))|FrenchToJD)\\\\b","name":"support.function.calendar.php"},{"match":"(?i)\\\\b(c(lass_(exists|alias)|all_user_method(_array)?)|trait_exists|i(s_(subclass_of|a)|nterface_exists)|__autoload|property_exists|get_(c(lass(_(vars|methods))?|alled_class)|object_vars|declared_(classes|traits|interfaces)|parent_class)|method_exists)\\\\b","name":"support.function.classobj.php"},{"match":"(?i)\\\\b(com_(set|create_guid|i(senum|nvoke)|pr(int_typeinfo|op(set|put|get))|event_sink|load(_typelib)?|addref|release|get(_active_object)?|message_pump)|variant_(s(ub|et(_type)?)|n(ot|eg)|c(a(st|t)|mp)|i(nt|div|mp)|or|d(iv|ate_(to_timestamp|from_timestamp))|pow|eqv|fix|a(nd|dd|bs)|round|get_type|xor|m(od|ul)))\\\\b","name":"support.function.com.php"},{"match":"(?i)\\\\bctype_(space|cntrl|digit|upper|p(unct|rint)|lower|al(num|pha)|graph|xdigit)\\\\b","name":"support.function.ctype.php"},{"match":"(?i)\\\\bcurl_(setopt(_array)?|c(opy_handle|lose)|init|e(rr(no|or)|xec)|version|getinfo|multi_(select|close|in(it|fo_read)|exec|add_handle|remove_handle|getcontent))\\\\b","name":"support.function.curl.php"},{"match":"(?i)\\\\b(str(totime|ptime|ftime)|checkdate|time(zone_(name_(from_abbr|get)|transitions_get|identifiers_list|o(pen|ffset_get)|version_get|location_get|abbreviations_list))?|idate|date(_(su(n(set|_info|rise)|b)|create(_from_format)?|time(stamp_(set|get)|zone_(set|get)|_set)|i(sodate_set|nterval_(create_from_date_string|format))|offset_get|d(iff|efault_timezone_(set|get)|ate_set)|parse(_from_format)?|format|add|get_last_errors|modify))?|localtime|g(et(timeofday|date)|m(strftime|date|mktime))|m(icrotime|ktime))\\\\b","name":"support.function.datetime.php"},{"match":"(?i)\\\\bdba_(sync|handlers|nextkey|close|insert|op(timize|en)|delete|popen|exists|key_split|f(irstkey|etch)|list|replace)\\\\b","name":"support.function.dba.php"},{"match":"(?i)\\\\bdbx_(sort|c(o(nnect|mpare)|lose)|e(scape_string|rror)|query|fetch_row)\\\\b","name":"support.function.dbx.php"},{"match":"(?i)\\\\b(scandir|c(h(dir|root)|losedir)|opendir|dir|re(winddir|addir)|getcwd)\\\\b","name":"support.function.dir.php"},{"match":"(?i)\\\\bdotnet_load\\\\b","name":"support.function.dotnet.php"},{"match":"(?i)\\\\beio_(s(y(nc(_file_range|fs)?|mlink)|tat(vfs)?|e(ndfile|t_m(in_parallel|ax_(idle|p(oll_(time|reqs)|arallel)))|ek))|n(threads|op|pending|re(qs|ady))|c(h(own|mod)|ustom|lose|ancel)|truncate|init|open|dup2|u(nlink|time)|poll|event_loop|f(s(ync|tat(vfs)?)|ch(own|mod)|truncate|datasync|utime|allocate)|write|l(stat|ink)|r(e(name|a(d(dir|link|ahead)?|lpath))|mdir)|g(et_(event_stream|last_error)|rp(_(cancel|limit|add))?)|mk(nod|dir)|busy)\\\\b","name":"support.function.eio.php"},{"match":"(?i)\\\\benchant_(dict_(s(tore_replacement|uggest)|check|is_in_session|describe|quick_check|add_to_(session|personal)|get_error)|broker_(set_ordering|init|d(ict_exists|escribe)|free(_dict)?|list_dicts|request_(dict|pwl_dict)|get_error))\\\\b","name":"support.function.enchant.php"},{"match":"(?i)\\\\b(s(plit(i)?|ql_regcase)|ereg(i(_replace)?|_replace)?)\\\\b","name":"support.function.ereg.php"},{"match":"(?i)\\\\b(set_e(rror_handler|xception_handler)|trigger_error|debug_(print_backtrace|backtrace)|user_error|error_(log|reporting|get_last)|restore_e(rror_handler|xception_handler))\\\\b","name":"support.function.errorfunc.php"},{"match":"(?i)\\\\b(s(hell_exec|ystem)|p(assthru|roc_(nice|close|terminate|open|get_status))|e(scapeshell(cmd|arg)|xec))\\\\b","name":"support.function.exec.php"},{"match":"(?i)\\\\b(exif_(t(humbnail|agname)|imagetype|read_data)|read_exif_data)\\\\b","name":"support.function.exif.php"},{"match":"(?i)\\\\b(s(ymlink|tat|et_file_buffer)|c(h(own|grp|mod)|opy|learstatcache)|t(ouch|empnam|mpfile)|is_(dir|uploaded_file|executable|file|writ(eable|able)|link|readable)|d(i(sk(_(total_space|free_space)|freespace)|rname)|elete)|u(nlink|mask)|p(close|open|a(thinfo|rse_ini_(string|file)))|f(s(canf|tat|eek)|nmatch|close|t(ell|runcate)|ile(size|ctime|type|inode|owner|_(put_contents|exists|get_contents)|perms|atime|group|mtime)?|open|p(ut(s|csv)|assthru)|eof|flush|write|lock|read|get(s(s)?|c(sv)?))|l(stat|ch(own|grp)|ink(info)?)|r(e(name|wind|a(d(file|link)|lpath(_cache_(size|get))?))|mdir)|glob|m(ove_uploaded_file|kdir)|basename)\\\\b","name":"support.function.file.php"},{"match":"(?i)\\\\b(finfo_(set_flags|close|open|file|buffer)|mime_content_type)\\\\b","name":"support.function.fileinfo.php"},{"match":"(?i)\\\\bfilter_(has_var|i(nput(_array)?|d)|var(_array)?|list)\\\\b","name":"support.function.filter.php"},{"match":"(?i)\\\\b(c(all_user_func(_array)?|reate_function)|unregister_tick_function|f(orward_static_call(_array)?|unc(tion_exists|_(num_args|get_arg(s)?)))|register_(shutdown_function|tick_function)|get_defined_functions)\\\\b","name":"support.function.funchand.php"},{"match":"(?i)\\\\b(ngettext|textdomain|d(ngettext|c(ngettext|gettext)|gettext)|gettext|bind(textdomain|_textdomain_codeset))\\\\b","name":"support.function.gettext.php"},{"match":"(?i)\\\\bgmp_(s(can(1|0)|trval|ign|ub|etbit|qrt(rem)?)|hamdist|ne(g|xtprime)|c(om|lrbit|mp)|testbit|in(tval|it|vert)|or|div(_(q(r)?|r)|exact)?|jacobi|p(o(pcount|w(m)?)|erfect_square|rob_prime)|fact|legendre|a(nd|dd|bs)|random|gcd(ext)?|xor|m(od|ul))\\\\b","name":"support.function.gmp.php"},{"match":"(?i)\\\\bhash(_(hmac(_file)?|copy|init|update(_(stream|file))?|pbkdf2|fi(nal|le)|algos))?\\\\b","name":"support.function.hash.php"},{"match":"(?i)\\\\b(http_(s(upport|end_(st(atus|ream)|content_(type|disposition)|data|file|last_modified))|head|negotiate_(c(harset|ontent_type)|language)|c(hunked_decode|ache_(etag|last_modified))|throttle|inflate|d(eflate|ate)|p(ost_(data|fields)|ut_(stream|data|file)|ersistent_handles_(c(ount|lean)|ident)|arse_(headers|cookie|params|message))|re(direct|quest(_(method_(name|unregister|exists|register)|body_encode))?)|get(_request_(headers|body(_stream)?))?|match_(etag|request_header|modified)|build_(str|cookie|url))|ob_(inflatehandler|deflatehandler|etaghandler))\\\\b","name":"support.function.http.php"},{"match":"(?i)\\\\b(iconv(_(s(tr(pos|len|rpos)|ubstr|et_encoding)|get_encoding|mime_(decode(_headers)?|encode)))?|ob_iconv_handler)\\\\b","name":"support.function.iconv.php"},{"match":"(?i)\\\\biis_(s(t(op_serv(ice|er)|art_serv(ice|er))|et_(s(cript_map|erver_rights)|dir_security|app_settings))|add_server|remove_server|get_(s(cript_map|erv(ice_state|er_(rights|by_(comment|path))))|dir_security))\\\\b","name":"support.function.iisfunc.php"},{"match":"(?i)\\\\b(i(ptc(parse|embed)|mage(s(y|tring(up)?|et(style|t(hickness|ile)|pixel|brush)|avealpha|x)|c(har(up)?|o(nvolution|py(res(ized|ampled)|merge(gray)?)?|lor(s(total|et|forindex)|closest(hwb|alpha)?|transparent|deallocate|exact(alpha)?|a(t|llocate(alpha)?)|resolve(alpha)?|match))|reate(truecolor|from(string|jpeg|png|wbmp|g(if|d(2(part)?)?)|x(pm|bm)))?)|t(ypes|tf(text|bbox)|ruecolortopalette)|i(struecolor|nterlace)|2wbmp|d(estroy|ashedline)|jpeg|_type_to_(extension|mime_type)|p(s(slantfont|text|e(ncodefont|xtendfont)|freefont|loadfont|bbox)|ng|olygon|alettecopy)|ellipse|f(t(text|bbox)|il(ter|l(toborder|ed(polygon|ellipse|arc|rectangle))?)|ont(height|width))|wbmp|l(ine|oadfont|ayereffect)|a(ntialias|lphablending|rc)|r(otate|ectangle)|g(if|d(2)?|ammacorrect|rab(screen|window))|xbm))|jpeg2wbmp|png2wbmp|g(d_info|etimagesize(fromstring)?))\\\\b","name":"support.function.image.php"},{"match":"(?i)\\\\b(s(ys_get_temp_dir|et_(time_limit|include_path|magic_quotes_runtime))|ini_(set|alter|restore|get(_all)?)|zend_(thread_id|version|logo_guid)|dl|p(hp(credits|info|_(sapi_name|ini_(scanned_files|loaded_file)|uname|logo_guid)|version)|utenv)|extension_loaded|version_compare|assert(_options)?|restore_include_path|g(c_(collect_cycles|disable|enable(d)?)|et(opt|_(c(urrent_user|fg_var)|include(d_files|_path)|defined_constants|extension_funcs|loaded_extensions|required_files|magic_quotes_(runtime|gpc))|env|lastmod|rusage|my(inode|uid|pid|gid)))|m(emory_get_(usage|peak_usage)|a(in|gic_quotes_runtime)))\\\\b","name":"support.function.info.php"},{"match":"(?i)\\\\bibase_(se(t_event_handler|rv(ice_(detach|attach)|er_info))|n(um_(params|fields)|ame_result)|c(o(nnect|mmit(_ret)?)|lose)|trans|d(elete_user|rop_db|b_info)|p(connect|aram_info|repare)|e(rr(code|msg)|xecute)|query|f(ield_info|etch_(object|assoc|row)|ree_(event_handler|query|result))|wait_event|a(dd_user|ffected_rows)|r(ollback(_ret)?|estore)|gen_id|m(odify_user|aintain_db)|b(lob_(c(lose|ancel|reate)|i(nfo|mport)|open|echo|add|get)|ackup))\\\\b","name":"support.function.interbase.php"},{"match":"(?i)\\\\b(n(ormalizer_(normalize|is_normalized)|umfmt_(set_(symbol|text_attribute|pattern|attribute)|create|parse(_currency)?|format(_currency)?|get_(symbol|text_attribute|pattern|error_(code|message)|locale|attribute)))|collator_(s(ort(_with_sort_keys)?|et_(strength|attribute))|c(ompare|reate)|asort|get_(s(trength|ort_key)|error_(code|message)|locale|attribute))|transliterator_(create(_(inverse|from_rules))?|transliterate|list_ids|get_error_(code|message))|i(ntl_(is_failure|error_name|get_error_(code|message))|dn_to_(u(nicode|tf8)|ascii))|datefmt_(set_(calendar|timezone(_id)?|pattern|lenient)|create|is_lenient|parse|format(_object)?|localtime|get_(calendar(_object)?|time(type|zone(_id)?)|datetype|pattern|error_(code|message)|locale))|locale_(set_default|compose|parse|filter_matches|lookup|accept_from_http|get_(script|d(isplay_(script|name|variant|language|region)|efault)|primary_language|keywords|all_variants|region))|resourcebundle_(c(ount|reate)|locales|get(_error_(code|message))?)|grapheme_(s(tr(str|i(str|pos)|pos|len|r(ipos|pos))|ubstr)|extract)|msgfmt_(set_pattern|create|parse(_message)?|format(_message)?|get_(pattern|error_(code|message)|locale)))\\\\b","name":"support.function.intl.php"},{"match":"(?i)\\\\bjson_(decode|encode|last_error)\\\\b","name":"support.function.json.php"},{"match":"(?i)\\\\bldap_(s(tart_tls|ort|e(t_(option|rebind_proc)|arch)|asl_bind)|next_(entry|attribute|reference)|c(o(n(nect|trol_paged_result(_response)?)|unt_entries|mpare)|lose)|t61_to_8859|d(n2ufn|elete)|8859_to_t61|unbind|parse_re(sult|ference)|e(rr(no|2str|or)|xplode_dn)|f(irst_(entry|attribute|reference)|ree_result)|list|add|re(name|ad)|get_(option|dn|entries|values(_len)?|attributes)|mod(ify|_(del|add|replace))|bind)\\\\b","name":"support.function.ldap.php"},{"match":"(?i)\\\\blibxml_(set_(streams_context|external_entity_loader)|clear_errors|disable_entity_loader|use_internal_errors|get_(errors|last_error))\\\\b","name":"support.function.libxml.php"},{"match":"(?i)\\\\b(ezmlm_hash|mail)\\\\b","name":"support.function.mail.php"},{"match":"(?i)\\\\b(s(in(h)?|qrt|rand)|h(ypot|exdec)|c(os(h)?|eil)|tan(h)?|is_(nan|infinite|finite)|octdec|de(c(hex|oct|bin)|g2rad)|p(i|ow)|exp(m1)?|f(loor|mod)|l(cg_value|og(1(p|0))?)|a(sin(h)?|cos(h)?|tan(h|2)?|bs)|r(ound|a(nd|d2deg))|getrandmax|m(t_(srand|rand|getrandmax)|in|ax)|b(indec|ase_convert))\\\\b","name":"support.function.math.php"},{"match":"(?i)\\\\bmb_(s(tr(str|cut|to(upper|lower)|i(str|pos|mwidth)|pos|width|len|r(chr|i(chr|pos)|pos))|ubst(itute_character|r(_count)?)|plit|end_mail)|http_(input|output)|c(heck_encoding|onvert_(case|encoding|variables|kana))|internal_encoding|output_handler|de(code_(numericentity|mimeheader)|tect_(order|encoding))|p(arse_str|referred_mime_name)|e(ncod(ing_aliases|e_(numericentity|mimeheader))|reg(i(_replace)?|_(search(_(setpos|init|pos|regs|get(pos|regs)))?|replace(_callback)?|match))?)|l(ist_encodings|anguage)|regex_(set_options|encoding)|get_info)\\\\b","name":"support.function.mbstring.php"},{"match":"(?i)\\\\bm(crypt_(c(fb|reate_iv|bc)|ofb|decrypt|e(nc(_(self_test|is_block_(algorithm(_mode)?|mode)|get_(supported_key_sizes|iv_size|key_size|algorithms_name|modes_name|block_size))|rypt)|cb)|list_(algorithms|modes)|ge(neric(_(init|deinit|end))?|t_(cipher_name|iv_size|key_size|block_size))|module_(self_test|close|is_block_(algorithm(_mode)?|mode)|open|get_(supported_key_sizes|algo_(key_size|block_size))))|decrypt_generic)\\\\b","name":"support.function.mcrypt.php"},{"match":"(?i)\\\\bmemcache_debug\\\\b","name":"support.function.memcache.php"},{"match":"(?i)\\\\bmhash(_(count|keygen_s2k|get_(hash_name|block_size)))?\\\\b","name":"support.function.mhash.php"},{"match":"(?i)\\\\bbson_(decode|encode)\\\\b","name":"support.function.mongo.php"},{"match":"(?i)\\\\bmysql_(s(tat|e(t_charset|lect_db))|num_(fields|rows)|c(onnect|l(ient_encoding|ose)|reate_db)|t(hread_id|ablename)|in(sert_id|fo)|d(ata_seek|rop_db|b_(name|query))|unbuffered_query|p(connect|ing)|e(scape_string|rr(no|or))|query|f(ield_(seek|name|t(ype|able)|flags|len)|etch_(object|field|lengths|a(ssoc|rray)|row)|ree_result)|list_(tables|dbs|processes|fields)|affected_rows|re(sult|al_escape_string)|get_(server_info|host_info|client_info|proto_info))\\\\b","name":"support.function.mysql.php"},{"match":"(?i)\\\\bmysqli_(s(sl_set|t(ore_result|at|mt_(s(tore_result|end_long_data)|next_result|close|init|data_seek|prepare|execute|f(etch|ree_result)|attr_(set|get)|res(ult_metadata|et)|get_(warnings|result)|more_results|bind_(param|result)))|e(nd_(query|long_data)|t_(charset|opt|local_infile_(handler|default))|lect_db)|lave_query)|next_result|c(ha(nge_user|racter_set_name)|o(nnect|mmit)|l(ient_encoding|ose))|thread_safe|init|options|d(isable_r(pl_parse|eads_from_master)|ump_debug_info|ebug|ata_seek)|use_result|p(ing|oll|aram_count|repare)|e(scape_string|nable_r(pl_parse|eads_from_master)|xecute|mbedded_server_(start|end))|kill|query|f(ield_seek|etch(_(object|field(s|_direct)?|a(ssoc|ll|rray)|row))?|ree_result)|autocommit|r(ollback|pl_(p(arse_enabled|robe)|query_type)|e(port|fresh|a(p_async_query|l_(connect|escape_string|query))))|get_(c(harset|onnection_stats|lient_(stats|info|version)|ache_stats)|warnings|metadata)|m(ore_results|ulti_query|aster_query)|bind_(param|result))\\\\b","name":"support.function.mysqli.php"},{"match":"(?i)\\\\bmysqlnd_memcache_(set|get_config)\\\\b","name":"support.function.mysqlnd-memcache.php"},{"match":"(?i)\\\\bmysqlnd_ms_(set_(user_pick_server|qos)|query_is_select|get_(stats|last_(used_connection|gtid))|match_wild)\\\\b","name":"support.function.mysqlnd-ms.php"},{"match":"(?i)\\\\bmysqlnd_qc_(set_(storage_handler|cache_condition|is_select|user_handlers)|clear_cache|get_(normalized_query_trace_log|c(ore_stats|ache_info)|query_trace_log|available_handlers))\\\\b","name":"support.function.mysqlnd-qc.php"},{"match":"(?i)\\\\bmysqlnd_uh_(set_(statement_proxy|connection_proxy)|convert_to_mysqlnd)\\\\b","name":"support.function.mysqlnd-uh.php"},{"match":"(?i)\\\\b(s(yslog|ocket_(set_(timeout|blocking)|get_status)|et(cookie|rawcookie))|h(ttp_response_code|eader(s_(sent|list)|_re(gister_callback|move))?)|c(heckdnsrr|loselog)|i(net_(ntop|pton)|p2long)|openlog|d(ns_(check_record|get_(record|mx))|efine_syslog_variables)|pfsockopen|fsockopen|long2ip|get(servby(name|port)|host(name|by(name(l)?|addr))|protobyn(umber|ame)|mxrr))\\\\b","name":"support.function.network.php"},{"match":"(?i)\\\\bnsapi_(virtual|re(sponse_headers|quest_headers))\\\\b","name":"support.function.nsapi.php"},{"match":"(?i)\\\\b(deaggregate|aggregat(ion_info|e(_(info|properties(_by_(list|regexp))?|methods(_by_(list|regexp))?))?))\\\\b","name":"support.function.objaggregation.php"},{"match":"(?i)\\\\boci(s(tatementtype|e(tprefetch|rverversion)|avelob(file)?)|n(umcols|ew(c(ollection|ursor)|descriptor)|logon)|c(o(l(umn(s(cale|ize)|name|type(raw)?|isnull|precision)|l(size|trim|a(ssign(elem)?|ppend)|getelem|max))|mmit)|loselob|ancel)|internaldebug|definebyname|_(s(tatement_type|e(t_(client_i(nfo|dentifier)|prefetch|edition|action|module_name)|rver_version))|n(um_(fields|rows)|ew_(c(o(nnect|llection)|ursor)|descriptor))|c(o(nnect|mmit)|l(ient_version|ose)|ancel)|internal_debug|define_by_name|p(connect|a(ssword_change|rse))|e(rror|xecute)|f(ield_(s(cale|ize)|name|type(_raw)?|is_null|precision)|etch(_(object|a(ssoc|ll|rray)|row))?|ree_(statement|descriptor))|lob_(copy|is_equal)|r(ollback|esult)|bind_(array_by_name|by_name))|p(logon|arse)|e(rror|xecute)|f(etch(statement|into)?|ree(statement|c(ollection|ursor)|desc))|write(temporarylob|lobtofile)|lo(adlob|go(n|ff))|r(o(wcount|llback)|esult)|bindbyname)\\\\b","name":"support.function.oci8.php"},{"match":"(?i)\\\\bopenssl_(s(ign|eal)|c(sr_(sign|new|export(_to_file)?|get_(subject|public_key))|ipher_iv_length)|open|d(h_compute_key|igest|ecrypt)|p(ublic_(decrypt|encrypt)|k(cs(12_(export(_to_file)?|read)|7_(sign|decrypt|encrypt|verify))|ey_(new|export(_to_file)?|free|get_(details|p(ublic|rivate))))|rivate_(decrypt|encrypt))|e(ncrypt|rror_string)|verify|free_key|random_pseudo_bytes|get_(cipher_methods|p(ublickey|rivatekey)|md_methods)|x509_(check(_private_key|purpose)|parse|export(_to_file)?|free|read))\\\\b","name":"support.function.openssl.php"},{"match":"(?i)\\\\b(o(utput_(add_rewrite_var|reset_rewrite_vars)|b_(start|clean|implicit_flush|end_(clean|flush)|flush|list_handlers|g(zhandler|et_(status|c(ontents|lean)|flush|le(ngth|vel)))))|flush)\\\\b","name":"support.function.output.php"},{"match":"(?i)\\\\bpassword_(hash|needs_rehash|verify|get_info)\\\\b","name":"support.function.password.php"},{"match":"(?i)\\\\bpcntl_(s(ig(nal(_dispatch)?|timedwait|procmask|waitinfo)|etpriority)|exec|fork|w(stopsig|termsig|if(s(topped|ignaled)|exited)|exitstatus|ait(pid)?)|alarm|getpriority)\\\\b","name":"support.function.pcntl.php"},{"match":"(?i)\\\\bpg_(se(nd_(prepare|execute|query(_params)?)|t_(client_encoding|error_verbosity)|lect)|host|num_(fields|rows)|c(o(n(nect(ion_(status|reset|busy))?|vert)|py_(to|from))|l(ient_encoding|ose)|ancel_query)|t(ty|ra(nsaction_status|ce))|insert|options|d(elete|bname)|u(n(trace|escape_bytea)|pdate)|p(connect|ing|ort|ut_line|arameter_status|repare)|e(scape_(string|identifier|literal|bytea)|nd_copy|xecute)|version|query(_params)?|f(ield_(size|n(um|ame)|t(ype(_oid)?|able)|is_null|prtlen)|etch_(object|a(ssoc|ll(_columns)?|rray)|r(ow|esult))|ree_result)|l(o_(seek|c(lose|reate)|tell|import|open|unlink|export|write|read(_all)?)|ast_(notice|oid|error))|affected_rows|result_(s(tatus|eek)|error(_field)?)|get_(notify|pid|result)|meta_data)\\\\b","name":"support.function.pgsql.php"},{"match":"(?i)\\\\b(virtual|apache_(setenv|note|child_terminate|lookup_uri|re(s(ponse_headers|et_timeout)|quest_headers)|get(_(version|modules)|env))|getallheaders)\\\\b","name":"support.function.php_apache.php"},{"match":"(?i)\\\\bdom_import_simplexml\\\\b","name":"support.function.php_dom.php"},{"match":"(?i)\\\\bftp_(s(sl_connect|ystype|i(te|ze)|et_option)|n(list|b_(continue|put|f(put|get)|get))|c(h(dir|mod)|onnect|dup|lose)|delete|p(ut|wd|asv)|exec|quit|f(put|get)|login|alloc|r(ename|aw(list)?|mdir)|get(_option)?|m(dtm|kdir))\\\\b","name":"support.function.php_ftp.php"},{"match":"(?i)\\\\bimap_(s(can(mailbox)?|tatus|ort|ubscribe|e(t(_quota|flag_full|acl)|arch)|avebody)|header(s|info)?|num_(recent|msg)|c(heck|l(ose|earflag_full)|reate(mailbox)?)|t(hread|imeout)|open|delete(mailbox)?|8bit|u(n(subscribe|delete)|tf(7_(decode|encode)|8)|id)|ping|e(rrors|xpunge)|qprint|fetch(structure|header|text|_overview|mime|body)|l(sub|ist(s(can|ubscribed)|mailbox)?|ast_error)|a(ppend|lerts)|r(e(name(mailbox)?|open)|fc822_(parse_(headers|adrlist)|write_address))|g(c|et(subscribed|_quota(root)?|acl|mailboxes))|m(sgno|ime_header_decode|ail(_(co(py|mpose)|move)|boxmsginfo)?)|b(inary|ody(struct)?|ase64))\\\\b","name":"support.function.php_imap.php"},{"match":"(?i)\\\\bmssql_(select_db|n(um_(fields|rows)|ext_result)|c(onnect|lose)|init|data_seek|pconnect|execute|query|f(ield_(seek|name|type|length)|etch_(object|field|a(ssoc|rray)|row|batch)|ree_(statement|result))|r(ows_affected|esult)|g(uid_string|et_last_message)|min_(error_severity|message_severity)|bind)\\\\b","name":"support.function.php_mssql.php"},{"match":"(?i)\\\\bodbc_(s(tatistics|pecialcolumns|etoption)|n(um_(fields|rows)|ext_result)|c(o(nnect|lumn(s|privileges)|mmit)|ursor|lose(_all)?)|table(s|privileges)|d(o|ata_source)|p(connect|r(imarykeys|ocedure(s|columns)|epare))|e(rror(msg)?|xec(ute)?)|f(ield_(scale|n(um|ame)|type|precision|len)|oreignkeys|etch_(into|object|array|row)|ree_result)|longreadlen|autocommit|r(ollback|esult(_all)?)|gettypeinfo|binmode)\\\\b","name":"support.function.php_odbc.php"},{"match":"(?i)\\\\bpreg_(split|quote|filter|last_error|replace(_callback)?|grep|match(_all)?)\\\\b","name":"support.function.php_pcre.php"},{"match":"(?i)\\\\b(spl_(classes|object_hash|autoload(_(call|unregister|extensions|functions|register))?)|class_(implements|uses|parents)|iterator_(count|to_array|apply))\\\\b","name":"support.function.php_spl.php"},{"match":"(?i)\\\\bzip_(close|open|entry_(name|c(ompress(ionmethod|edsize)|lose)|open|filesize|read)|read)\\\\b","name":"support.function.php_zip.php"},{"match":"(?i)\\\\bposix_(s(trerror|et(sid|uid|pgid|e(uid|gid)|gid))|ctermid|t(tyname|imes)|i(satty|nitgroups)|uname|errno|kill|access|get(sid|cwd|uid|_last_error|p(id|pid|w(nam|uid)|g(id|rp))|e(uid|gid)|login|rlimit|g(id|r(nam|oups|gid)))|mk(nod|fifo))\\\\b","name":"support.function.posix.php"},{"match":"(?i)\\\\bset(threadtitle|proctitle)\\\\b","name":"support.function.proctitle.php"},{"match":"(?i)\\\\bpspell_(s(tore_replacement|uggest|ave_wordlist)|new(_(config|personal))?|c(heck|onfig_(save_repl|create|ignore|d(ict_dir|ata_dir)|personal|r(untogether|epl)|mode)|lear_session)|add_to_(session|personal))\\\\b","name":"support.function.pspell.php"},{"match":"(?i)\\\\breadline(_(c(ompletion_function|lear_history|allback_(handler_(install|remove)|read_char))|info|on_new_line|write_history|list_history|add_history|re(display|ad_history)))?\\\\b","name":"support.function.readline.php"},{"match":"(?i)\\\\brecode(_(string|file))?\\\\b","name":"support.function.recode.php"},{"match":"(?i)\\\\brrd_(create|tune|info|update|error|version|f(irst|etch)|last(update)?|restore|graph|xport)\\\\b","name":"support.function.rrd.php"},{"match":"(?i)\\\\b(s(hm_(has_var|detach|put_var|attach|remove(_var)?|get_var)|em_(acquire|re(lease|move)|get))|ftok|msg_(s(tat_queue|e(nd|t_queue))|queue_exists|re(ceive|move_queue)|get_queue))\\\\b","name":"support.function.sem.php"},{"match":"(?i)\\\\bsession_(s(ta(tus|rt)|et_(save_handler|cookie_params)|ave_path)|name|c(ommit|ache_(expire|limiter))|i(s_registered|d)|de(stroy|code)|un(set|register)|encode|write_close|reg(ister(_shutdown)?|enerate_id)|get_cookie_params|module_name)\\\\b","name":"support.function.session.php"},{"match":"(?i)\\\\bshmop_(size|close|open|delete|write|read)\\\\b","name":"support.function.shmop.php"},{"match":"(?i)\\\\bsimplexml_(import_dom|load_(string|file))\\\\b","name":"support.function.simplexml.php"},{"match":"(?i)\\\\bsnmp(set|2_(set|walk|real_walk|get(next)?)|_(set_(oid_(numeric_print|output_format)|enum_print|valueretrieval|quick_print)|read_mib|get_(valueretrieval|quick_print))|3_(set|walk|real_walk|get(next)?)|walk(oid)?|realwalk|get(next)?)\\\\b","name":"support.function.snmp.php"},{"match":"(?i)\\\\b(is_soap_fault|use_soap_error_handler)\\\\b","name":"support.function.soap.php"},{"match":"(?i)\\\\bsocket_(s(hutdown|trerror|e(nd(to)?|t_(nonblock|option|block)|lect))|c(onnect|l(ose|ear_error)|reate(_(pair|listen))?)|import_stream|write|l(isten|ast_error)|accept|re(cv(from)?|ad)|get(sockname|_option|peername)|bind)\\\\b","name":"support.function.sockets.php"},{"match":"(?i)\\\\bsqlite_(s(ingle_query|eek)|has_(prev|more)|n(um_(fields|rows)|ext)|c(hanges|olumn|urrent|lose|reate_(function|aggregate))|open|u(nbuffered_query|df_(decode_binary|encode_binary))|p(open|rev)|e(scape_string|rror_string|xec)|valid|key|query|f(ield_name|etch_(s(tring|ingle)|column_types|object|a(ll|rray))|actory)|l(ib(encoding|version)|ast_(insert_rowid|error))|array_query|rewind|busy_timeout)\\\\b","name":"support.function.sqlite.php"},{"match":"(?i)\\\\bsqlsrv_(se(nd_stream_data|rver_info)|has_rows|n(um_(fields|rows)|ext_result)|c(o(n(nect|figure)|mmit)|l(ient_info|ose)|ancel)|prepare|e(rrors|xecute)|query|f(ield_metadata|etch(_(object|array))?|ree_stmt)|ro(ws_affected|llback)|get_(config|field)|begin_transaction)\\\\b","name":"support.function.sqlsrv.php"},{"match":"(?i)\\\\bstats_(s(ta(ndard_deviation|t_(noncentral_t|correlation|in(nerproduct|dependent_t)|p(owersum|ercentile|aired_t)|gennch|binomial_coef))|kew)|harmonic_mean|c(ovariance|df_(n(oncentral_(chisquare|f)|egative_binomial)|c(hisquare|auchy)|t|uniform|poisson|exponential|f|weibull|l(ogistic|aplace)|gamma|b(inomial|eta)))|den(s_(n(ormal|egative_binomial)|c(hisquare|auchy)|t|pmf_(hypergeometric|poisson|binomial)|exponential|f|weibull|l(ogistic|aplace)|gamma|beta)|_uniform)|variance|kurtosis|absolute_deviation|rand_(setall|phrase_to_seeds|ranf|ge(n_(no(ncen(tral_(t|f)|ral_chisquare)|rmal)|chisquare|t|i(nt|uniform|poisson|binomial(_negative)?)|exponential|f(uniform)?|gamma|beta)|t_seeds)))\\\\b","name":"support.function.stats.php"},{"match":"(?i)\\\\bs(tream_(s(ocket_(s(hutdown|e(ndto|rver))|client|pair|enable_crypto|accept|recvfrom|get_name)|upports_lock|e(t_(chunk_size|timeout|write_buffer|read_buffer|blocking)|lect))|notification_callback|co(ntext_(set_(option|default|params)|create|get_(options|default|params))|py_to_stream)|is_local|encoding|filter_(prepend|append|re(gister|move))|wrapper_(unregister|re(store|gister))|re(solve_include_path|gister_wrapper)|get_(contents|transports|filters|wrappers|line|meta_data)|bucket_(new|prepend|append|make_writeable))|et_socket_blocking)\\\\b","name":"support.function.streamsfuncs.php"},{"match":"(?i)\\\\b(s(scanf|ha1(_file)?|tr(s(tr|pn)|n(c(asecmp|mp)|atc(asecmp|mp))|c(spn|hr|oll|asecmp|mp)|t(o(upper|k|lower)|r)|i(str|p(slashes|cslashes|os|_tags))|_(s(huffle|plit)|ireplace|pad|word_count|r(ot13|ep(eat|lace))|getcsv)|p(os|brk)|len|r(chr|ipos|pos|ev))|imilar_text|oundex|ubstr(_(co(unt|mpare)|replace))?|printf|etlocale)|h(tml(specialchars(_decode)?|_entity_decode|entities)|e(x2bin|brev(c)?))|n(umber_format|l(2br|_langinfo))|c(h(op|unk_split|r)|o(nvert_(cyr_string|uu(decode|encode))|unt_chars)|r(ypt|c32))|trim|implode|ord|uc(first|words)|join|p(arse_str|rint(f)?)|e(cho|xplode)|v(sprintf|printf|fprintf)|quote(d_printable_(decode|encode)|meta)|fprintf|wordwrap|l(cfirst|trim|ocaleconv|evenshtein)|add(slashes|cslashes)|rtrim|get_html_translation_table|m(oney_format|d5(_file)?|etaphone)|bin2hex)\\\\b","name":"support.function.string.php"},{"match":"(?i)\\\\bsybase_(se(t_message_handler|lect_db)|num_(fields|rows)|c(onnect|lose)|d(eadlock_retry_count|ata_seek)|unbuffered_query|pconnect|query|f(ield_seek|etch_(object|field|a(ssoc|rray)|row)|ree_result)|affected_rows|result|get_last_message|min_(server_severity|client_severity|error_severity|message_severity))\\\\b","name":"support.function.sybase.php"},{"match":"(?i)\\\\b(taint|is_tainted|untaint)\\\\b","name":"support.function.taint.php"},{"match":"(?i)\\\\b(tidy_(s(et(opt|_encoding)|ave_config)|c(onfig_count|lean_repair)|is_x(html|ml)|diagnose|parse_(string|file)|error_count|warning_count|load_config|access_count|re(set_config|pair_(string|file))|get(opt|_(status|h(tml(_ver)?|ead)|config|o(utput|pt_doc)|r(oot|elease)|body)))|ob_tidyhandler)\\\\b","name":"support.function.tidy.php"},{"match":"(?i)\\\\btoken_(name|get_all)\\\\b","name":"support.function.tokenizer.php"},{"match":"(?i)\\\\btrader_(s(t(och(f|rsi)?|ddev)|in(h)?|u(m|b)|et_(compat|unstable_period)|qrt|ar(ext)?|ma)|ht_(sine|trend(line|mode)|dcp(hase|eriod)|phasor)|natr|c(ci|o(s(h)?|rrel)|dl(s(ho(otingstar|rtline)|t(icksandwich|alledpattern)|pinningtop|eparatinglines)|h(i(kkake(mod)?|ghwave)|omingpigeon|a(ngingman|rami(cross)?|mmer))|c(o(ncealbabyswall|unterattack)|losingmarubozu)|t(hrusting|a(sukigap|kuri)|ristar)|i(n(neck|vertedhammer)|dentical3crows)|2crows|onneck|d(oji(star)?|arkcloudcover|ragonflydoji)|u(nique3river|psidegap2crows)|3(starsinsouth|inside|outside|whitesoldiers|linestrike|blackcrows)|piercing|e(ngulfing|vening(star|dojistar))|kicking(bylength)?|l(ongl(ine|eggeddoji)|adderbottom)|a(dvanceblock|bandonedbaby)|ri(sefall3methods|ckshawman)|g(apsidesidewhite|ravestonedoji)|xsidegap3methods|m(orning(star|dojistar)|a(t(hold|chinglow)|rubozu))|b(elthold|reakaway))|eil|mo)|t(sf|ypprice|3|ema|an(h)?|r(i(x|ma)|ange))|obv|d(iv|ema|x)|ultosc|p(po|lus_d(i|m))|e(rrno|xp|ma)|var|kama|floor|w(clprice|illr|ma)|l(n|inearreg(_(slope|intercept|angle))?|og10)|a(sin|cos|t(an|r)|d(osc|d|x(r)?)?|po|vgprice|roon(osc)?)|r(si|oc(p|r(100)?)?)|get_(compat|unstable_period)|m(i(n(index|us_d(i|m)|max(index)?)?|dp(oint|rice))|om|ult|edprice|fi|a(cd(ext|fix)?|vp|x(index)?|ma)?)|b(op|eta|bands))\\\\b","name":"support.function.trader.php"},{"match":"(?i)\\\\b(http_build_query|url(decode|encode)|parse_url|rawurl(decode|encode)|get_(headers|meta_tags)|base64_(decode|encode))\\\\b","name":"support.function.url.php"},{"match":"(?i)\\\\b(s(trval|e(ttype|rialize))|i(s(set|_(s(calar|tring)|nu(ll|meric)|callable|int(eger)?|object|double|float|long|array|re(source|al)|bool|arraykey|nonnull|dict|vec|keyset))|ntval|mport_request_variables)|d(oubleval|ebug_zval_dump)|unse(t|rialize)|print_r|empty|var_(dump|export)|floatval|get(type|_(defined_vars|resource_type))|boolval)\\\\b","name":"support.function.var.php"},{"match":"(?i)\\\\bwddx_(serialize_va(lue|rs)|deserialize|packet_(start|end)|add_vars)\\\\b","name":"support.function.wddx.php"},{"match":"(?i)\\\\bxhprof_(sample_(disable|enable)|disable|enable)\\\\b","name":"support.function.xhprof.php"},{"match":"(?i)\\\\b(utf8_(decode|encode)|xml_(set_(start_namespace_decl_handler|notation_decl_handler|character_data_handler|object|default_handler|unparsed_entity_decl_handler|processing_instruction_handler|e(nd_namespace_decl_handler|lement_handler|xternal_entity_ref_handler))|parse(_into_struct|r_(set_option|create(_ns)?|free|get_option))?|error_string|get_(current_(column_number|line_number|byte_index)|error_code)))\\\\b","name":"support.function.xml.php"},{"match":"(?i)\\\\bxmlrpc_(se(t_type|rver_(c(all_method|reate)|destroy|add_introspection_data|register_(introspection_callback|method)))|is_fault|decode(_request)?|parse_method_descriptions|encode(_request)?|get_type)\\\\b","name":"support.function.xmlrpc.php"},{"match":"(?i)\\\\bxmlwriter_(s(tart_(c(omment|data)|d(td(_(e(ntity|lement)|attlist))?|ocument)|pi|element(_ns)?|attribute(_ns)?)|et_indent(_string)?)|text|o(utput_memory|pen_(uri|memory))|end_(c(omment|data)|d(td(_(e(ntity|lement)|attlist))?|ocument)|pi|element|attribute)|f(ull_end_element|lush)|write_(c(omment|data)|dtd(_(e(ntity|lement)|attlist))?|pi|element(_ns)?|attribute(_ns)?|raw))\\\\b","name":"support.function.xmlwriter.php"},{"match":"(?i)\\\\bxslt_(set(opt|_(s(cheme_handler(s)?|ax_handler(s)?)|object|e(ncoding|rror_handler)|log|base))|create|process|err(no|or)|free|getopt|backend_(name|info|version))\\\\b","name":"support.function.xslt.php"},{"match":"(?i)\\\\b(zlib_(decode|encode|get_coding_type)|readgzfile|gz(seek|c(ompress|lose)|tell|inflate|open|de(code|flate)|uncompress|p(uts|assthru)|e(ncode|of)|file|write|re(wind|ad)|get(s(s)?|c)))\\\\b","name":"support.function.zlib.php"},{"match":"(?i)\\\\bis_int(eger)?\\\\b","name":"support.function.alias.php"}]},"user-function-call":{"begin":"(?i)(?=[a-z_0-9\\\\\\\\]*[a-z_][a-z0-9_]*\\\\s*\\\\()","end":"(?i)[a-z_][a-z_0-9]*(?=\\\\s*\\\\()","endCaptures":{"0":{"name":"entity.name.function.php"}},"name":"meta.function-call.php","patterns":[{"include":"#namespace"}]},"var_basic":{"patterns":[{"captures":{"1":{"name":"punctuation.definition.variable.php"}},"match":"(?x)\\n(\\\\$+)\\n[a-zA-Z_\\\\x{7f}-\\\\x{ff}]\\n[a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*?\\n\\\\b","name":"variable.other.php"}]},"var_global":{"captures":{"1":{"name":"punctuation.definition.variable.php"}},"match":"(\\\\$)((_(COOKIE|FILES|GET|POST|REQUEST))|arg(v|c))\\\\b","name":"variable.other.global.php"},"var_global_safer":{"captures":{"1":{"name":"punctuation.definition.variable.php"}},"match":"(\\\\$)((GLOBALS|_(ENV|SERVER|SESSION)))","name":"variable.other.global.safer.php"},"variable-name":{"patterns":[{"include":"#var_global"},{"include":"#var_global_safer"},{"captures":{"1":{"name":"variable.other.php"},"2":{"name":"punctuation.definition.variable.php"},"4":{"name":"keyword.operator.class.php"},"5":{"name":"variable.other.property.php"},"6":{"name":"punctuation.section.array.begin.php"},"7":{"name":"constant.numeric.index.php"},"8":{"name":"variable.other.index.php"},"9":{"name":"punctuation.definition.variable.php"},"10":{"name":"string.unquoted.index.php"},"11":{"name":"punctuation.section.array.end.php"}},"comment":"Simple syntax: $foo, $foo[0], $foo[$bar], $foo->bar","match":"(?x)\\n((\\\\$)(?<name>[a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*))\\n(?:\\n  (->)(\\\\g<name>)\\n  |\\n  (\\\\[)\\n    (?:(\\\\d+)|((\\\\$)\\\\g<name>)|(\\\\w+))\\n  (\\\\])\\n)?"},{"captures":{"1":{"name":"variable.other.php"},"2":{"name":"punctuation.definition.variable.php"},"4":{"name":"punctuation.definition.variable.php"}},"comment":"Simple syntax with braces: \\"foo${bar}baz\\"","match":"(?x)\\n((\\\\$\\\\{)(?<name>[a-zA-Z_\\\\x{7f}-\\\\x{ff}][a-zA-Z0-9_\\\\x{7f}-\\\\x{ff}]*)(\\\\}))"}]},"variables":{"patterns":[{"include":"#var_global"},{"include":"#var_global_safer"},{"include":"#var_basic"},{"begin":"(\\\\$\\\\{)(?=.*?\\\\})","beginCaptures":{"1":{"name":"punctuation.definition.variable.php"}},"end":"(\\\\})","endCaptures":{"1":{"name":"punctuation.definition.variable.php"}},"patterns":[{"include":"#language"}]}]},"xhp":{"comment":"Avoid < operator expressions as best we can using Zertosh\'s regex","patterns":[{"contentName":"source.xhp","begin":"(?<=\\\\(|\\\\{|\\\\[|,|&&|\\\\|\\\\||\\\\?|:|=|=>|\\\\Wreturn|^return|^)\\\\s*(?=<[_\\\\p{L}])","end":"(?=.)","applyEndPatternLast":1,"patterns":[{"include":"#xhp-tag-element-name"}]}]},"xhp-tag-element-name":{"patterns":[{"comment":"Tags that end > are trapped in #xhp-tag-termination","begin":"\\\\s*(<)([_\\\\p{L}](?:[:\\\\p{L}\\\\p{Mn}\\\\p{Mc}\\\\p{Nd}\\\\p{Nl}\\\\p{Pc}-])*+)(?=[/>\\\\s])(?<![\\\\:])","end":"\\\\s*(?<=</)(\\\\2)(>)|(/>)|((?<=</)[\\\\S ]*?)>","beginCaptures":{"1":{"name":"punctuation.definition.tag.xhp"},"2":{"name":"entity.name.tag.open.xhp"}},"endCaptures":{"1":{"name":"entity.name.tag.close.xhp"},"2":{"name":"punctuation.definition.tag.xhp"},"3":{"name":"punctuation.definition.tag.xhp"},"4":{"name":"invalid.illegal.termination.xhp"}},"patterns":[{"include":"#xhp-tag-termination"},{"include":"#xhp-html-comments"},{"include":"#xhp-tag-attributes"}]}]},"xhp-tag-termination":{"patterns":[{"comment":"uses non consuming search for </ in </tag>","begin":"(?<!--)(>)","end":"(</)","beginCaptures":{"0":{"name":"punctuation.definition.tag.xhp"},"1":{"name":"XHPStartTagEnd"}},"endCaptures":{"0":{"name":"punctuation.definition.tag.xhp"},"1":{"name":"XHPEndTagStart"}},"patterns":[{"include":"#xhp-evaluated-code"},{"include":"#xhp-entities"},{"include":"#xhp-html-comments"},{"include":"#xhp-tag-element-name"}]}]},"xhp-tag-attributes":{"patterns":[{"include":"#xhp-attribute-name"},{"include":"#xhp-assignment"},{"include":"#xhp-string-double-quoted"},{"include":"#xhp-string-single-quoted"},{"include":"#xhp-evaluated-code"},{"include":"#xhp-tag-element-name"},{"include":"#comments"}]},"xhp-attribute-name":{"patterns":[{"comment":"look for attribute name","match":"(?<!\\\\S)([_\\\\p{L}](?:[\\\\p{L}\\\\p{Mn}\\\\p{Mc}\\\\p{Nd}\\\\p{Nl}\\\\p{Pc}-](?<!\\\\.\\\\.))*+)(?<!\\\\.)(?=//|/\\\\*|=|\\\\s|>|/>)","captures":{"0":{"name":"entity.other.attribute-name.xhp"}}}]},"xhp-assignment":{"patterns":[{"comment":"look for attribute assignment","name":"keyword.operator.assignment.xhp","match":"=(?=\\\\s*(?:\'|\\"|{|/\\\\*|<|//|\\\\n))"}]},"xhp-string-double-quoted":{"name":"string.quoted.double.php","begin":"\\"","end":"\\"(?<!\\\\\\\\\\")","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.xhp"}},"endCaptures":{"0":{"name":"punctuation.definition.string.end.xhp"}},"patterns":[{"include":"#xhp-entities"}]},"xhp-string-single-quoted":{"name":"string.quoted.single.php","begin":"\'","end":"\'(?<!\\\\\\\\\')","beginCaptures":{"0":{"name":"punctuation.definition.string.begin.xhp"}},"endCaptures":{"0":{"name":"punctuation.definition.string.end.xhp"}},"patterns":[{"include":"#xhp-entities"}]},"xhp-evaluated-code":{"name":"meta.embedded.expression.php","begin":"{","end":"}","beginCaptures":{"0":{"name":"punctuation.section.embedded.begin.xhp"}},"endCaptures":{"0":{"name":"punctuation.section.embedded.end.xhp"}},"contentName":"source.php.xhp","patterns":[{"include":"#language"}]},"xhp-entities":{"patterns":[{"comment":"Embeded HTML entities &blah","match":"(&)([a-zA-Z0-9]+|#[0-9]+|#x[0-9a-fA-F]+)(;)","captures":{"0":{"name":"constant.character.entity.xhp"},"1":{"name":"punctuation.definition.entity.xhp"},"2":{"name":"entity.name.tag.html.xhp"},"3":{"name":"punctuation.definition.entity.xhp"}}},{"comment":"Entity with & and invalid name","match":"&\\\\S*;","name":"invalid.illegal.bad-ampersand.xhp"}]},"xhp-html-comments":{"begin":"<!--","captures":{"0":{"name":"punctuation.definition.comment.html"}},"end":"--\\\\s*>","name":"comment.block.html","patterns":[{"match":"--(?!-*\\\\s*>)","name":"invalid.illegal.bad-comments-or-CDATA.html"}]}}}');

/***/ })

}]);
//# sourceMappingURL=1.bootstrap.js.map