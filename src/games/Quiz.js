'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireDefault(require('react'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

const Quiz = ({ sendData, sendFinish, sendScore, name, gameDataEntries }) => {
  const a = 'a';
  return /*#__PURE__*/ _react.default.createElement(
    'div',
    null,
    /*#__PURE__*/ _react.default.createElement('span', null, a),
    /*#__PURE__*/ _react.default.createElement(
      'button',
      {
        type: 'button',
        onClick: () => {
          console.log(gameDataEntries);
        },
      },
      'test button',
    ),
  );
};

var _default = Quiz;
exports.default = _default;
