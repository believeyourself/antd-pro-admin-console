"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.queryData = queryData;

var _requestNoPrefix = _interopRequireDefault(require("@/utils/requestNoPrefix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function queryData(params) {
  return regeneratorRuntime.async(function queryData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          return _context.abrupt("return", _requestNoPrefix["default"].put('https://fkz3gphuoa.execute-api.us-west-2.amazonaws.com/Prod/marketing/search', {
            params: params
          }));

        case 1:
        case "end":
          return _context.stop();
      }
    }
  });
}