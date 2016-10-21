'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _gradientParser = require('gradient-parser');

var _gradientParser2 = _interopRequireDefault(_gradientParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var positionsForOrientation = function positionsForOrientation(orientation) {
	var positions = {
		x1: '0%',
		x2: '0%',
		y1: '0%',
		y2: '0%'
	};

	if (orientation.type == 'angular') {
		var pointOfAngle = function pointOfAngle(a) {
			return {
				x: Math.cos(a),
				y: Math.sin(a)
			};
		};

		var degreesToRadians = function degreesToRadians(d) {
			return d * Math.PI / 180;
		};

		var eps = Math.pow(2, -52);
		var angle = orientation.value % 360;

		var startPoint = pointOfAngle(degreesToRadians(180 - angle));
		var endPoint = pointOfAngle(degreesToRadians(360 - angle));

		if (startPoint.x <= 0 || Math.abs(startPoint.x) <= eps) {
			startPoint.x = 0;
		}

		if (startPoint.y <= 0 || Math.abs(startPoint.y) <= eps) {
			startPoint.y = 0;
		}

		if (endPoint.x <= 0 || Math.abs(endPoint.x) <= eps) {
			endPoint.x = 0;
		}

		if (endPoint.y <= 0 || Math.abs(endPoint.y) <= eps) {
			endPoint.y = 0;
		}

		positions.x1 = startPoint.x * 100 + '%';
		positions.y1 = startPoint.y * 100 + '%';
		positions.x2 = endPoint.x * 100 + '%';
		positions.y2 = endPoint.y * 100 + '%';
	} else if (orientation.type == 'directional') {
		switch (orientation.value) {
			case 'left':
				positions.x1 = '100%';
				break;

			case 'up':
				positions.y1 = '100%';
				break;

			case 'right':
				positions.x2 = '100%';
				break;

			case 'down':
				positions.y2 = '100%';
				break;

			default:
				throw 'Invalid orientation value: ' + orientation.value;
				break;
		}
	}

	return positions;
};

var LinearGradient = function LinearGradient(props) {
	var id = props.id;
	var fill = props.fill;


	if (!fill) {
		return _react2.default.createElement('linearGradient', { id: id });
	}

	var _GradientParser$parse = _gradientParser2.default.parse(fill)[0];

	var colorStops = _GradientParser$parse.colorStops;
	var orientation = _GradientParser$parse.orientation;

	var positions = positionsForOrientation(orientation);

	var renderColorStop = function renderColorStop(colorStop, index) {
		var key = 'color-stop-' + index;
		var offset = index / (colorStops.length - 1) * 100 + '%';
		var stopColor = 'rgb(0,0,0)';
		var stopOpacity = 1.0;

		switch (colorStop.type) {
			case 'rgb':
				{
					var _colorStop$value = _slicedToArray(colorStop.value, 3);

					var r = _colorStop$value[0];
					var g = _colorStop$value[1];
					var b = _colorStop$value[2];

					stopColor = 'rgb(' + r + ',' + g + ',' + b + ')';
					break;
				}

			case 'rgba':
				{
					var _colorStop$value2 = _slicedToArray(colorStop.value, 4);

					var _r = _colorStop$value2[0];
					var _g = _colorStop$value2[1];
					var _b = _colorStop$value2[2];
					var a = _colorStop$value2[3];

					stopColor = 'rgb(' + _r + ',' + _g + ',' + _b + ')';
					stopOpacity = Number(a);
					break;
				}

			case 'hex':
				{
					stopColor = '#' + colorStop.value;
					break;
				}

			case 'literal':
				{
					stopColor = colorStop.value;
					break;
				}

			default:
				break;
		}

		var stopProps = {
			key: key, offset: offset, stopColor: stopColor
		};

		if (stopOpacity < 1.0) {
			stopProps.stopOpacity = stopOpacity;
		}

		return _react2.default.createElement('stop', stopProps);
	};

	return _react2.default.createElement(
		'linearGradient',
		{ id: id, x1: '0%', y1: '0%', x2: '0%', y2: '100%' },
		colorStops.map(renderColorStop)
	);
};

LinearGradient.defaultProps = {
	id: null
};

exports.default = LinearGradient;
