'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _react = _interopRequireWildcard(require('react'));

var _react2 = require('@chakra-ui/react');

function _getRequireWildcardCache(nodeInterop) {
  if (typeof WeakMap !== 'function') return null;
  var cacheBabelInterop = new WeakMap();
  var cacheNodeInterop = new WeakMap();
  return (_getRequireWildcardCache = function (nodeInterop) {
    return nodeInterop ? cacheNodeInterop : cacheBabelInterop;
  })(nodeInterop);
}

function _interopRequireWildcard(obj, nodeInterop) {
  if (!nodeInterop && obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache(nodeInterop);
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (key !== 'default' && Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}

const Question = ({ question, answers, onAnswerClick }) =>
  /*#__PURE__*/ _react.default.createElement(
    _react2.SimpleGrid,
    {
      columns: 1,
    },
    /*#__PURE__*/ _react.default.createElement(
      _react2.Heading,
      {
        size: 'lg',
      },
      question,
    ),
    answers.map((answer, index) =>
      /*#__PURE__*/ _react.default.createElement(
        _react2.Flex,
        {
          justify: 'center',
          key: answer,
        },
        /*#__PURE__*/ _react.default.createElement(
          _react2.Button,
          {
            onClick: () => onAnswerClick(index),
          },
          answer,
        ),
      ),
    ),
  );

const Quiz = ({
  sendData,
  sendFinish,
  sendScore,
  name,
  gameDataEntries,
  isFinished,
  currentData,
  usersCount,
}) => {
  var _gameDataEntries$filt;

  const toast = (0, _react2.useToast)();
  const [isClientFinished, setClientFinished] = (0, _react.useState)(false);
  const [correctAnswersCount, setCorrectAnswersCount] = (0, _react.useState)(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = (0, _react.useState)(
    0,
  );
  (0, _react.useEffect)(() => {
    if (isFinished) {
      sendScore(correctAnswersCount * 10);
      toast({
        duration: 5000,
        isClosable: true,
        position: 'bottom-right',
        title: 'Score',
        description: `Your score was ${correctAnswersCount * 10}`,
        status: 'info',
      });
    }
  }, [isFinished]);
  (0, _react.useEffect)(() => {
    if (
      !!usersCount &&
      (currentData === null || currentData === void 0
        ? void 0
        : currentData.length) === usersCount &&
      isClientFinished
    ) {
      sendFinish();
    }
  }, [currentData, isClientFinished]);
  return /*#__PURE__*/ _react.default.createElement(
    _react2.SimpleGrid,
    {
      columns: 1,
    },
    /*#__PURE__*/ _react.default.createElement(_react2.Heading, null, name),
    currentQuestionIndex ===
      (gameDataEntries === null || gameDataEntries === void 0
        ? void 0
        : gameDataEntries.length) -
        1 && isClientFinished
      ? /*#__PURE__*/ _react.default.createElement(
          _react2.SimpleGrid,
          {
            columns: 1,
          },
          /*#__PURE__*/ _react.default.createElement(_react2.Spinner, null),
          /*#__PURE__*/ _react.default.createElement(
            _react2.Text,
            null,
            'Please wait while other users finish their games',
          ),
        )
      : gameDataEntries === null || gameDataEntries === void 0
      ? void 0
      : (_gameDataEntries$filt = gameDataEntries.filter(
          (_, index) => index === currentQuestionIndex,
        )) === null || _gameDataEntries$filt === void 0
      ? void 0
      : _gameDataEntries$filt.map(entry => {
          const object = JSON.parse(entry);
          return /*#__PURE__*/ _react.default.createElement(Question, {
            question: object.question,
            answers: object.answers,
            onAnswerClick: index => {
              if (object.correctAnswerIndex === index) {
                setCorrectAnswersCount(correctAnswersCount + 1);
              }

              if (currentQuestionIndex === gameDataEntries.length - 1) {
                sendData(
                  JSON.stringify({
                    finished: true,
                  }),
                );
                setClientFinished(true);
              } else {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              }
            },
          });
        }),
  );
};

var _default = Quiz;
exports.default = _default;
