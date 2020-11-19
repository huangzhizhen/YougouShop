"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.request = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var request = function request(params) {
  return new Promise(function (reslove, reject) {
    /*reslove、reject分别为两种接口返回的回调函数，
    回调函数中具体 */
    var reqTask = wx.request(_objectSpread({}, params, {
      /*接收到的的参数将被放在这里（对象形式） */
      success: function success(result) {
        reslove(result);
      },
      fail: function fail(err) {
        reject(err);
      }
    }));
  });
};

exports.request = request;