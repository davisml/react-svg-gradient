import React from 'react'
import GradientParser from 'gradient-parser'

const positionsForOrientation = (orientation) => {
	let positions = {
		x1: '0%',
		x2: '0%',
		y1: '0%',
		y2: '0%'
	}

	if (orientation.type == 'angular') {
		const pointOfAngle = (a) => ({
            x: Math.cos(a),
            y: Math.sin(a)
        })

        const degreesToRadians = (d) => ((d * Math.PI) / 180)

        const eps = Math.pow(2, -52)
        const angle = (orientation.value % 360)
        
        let startPoint = pointOfAngle(degreesToRadians(180 - angle))
        let endPoint = pointOfAngle(degreesToRadians(360 - angle))

        if (startPoint.x <= 0 || Math.abs(startPoint.x) <= eps) {
            startPoint.x = 0
        }

        if (startPoint.y <= 0 || Math.abs(startPoint.y) <= eps) {
            startPoint.y = 0
        }

        if (endPoint.x <= 0 || Math.abs(endPoint.x) <= eps) {
            endPoint.x = 0
        }

        if (endPoint.y <= 0 || Math.abs(endPoint.y) <= eps) {
            endPoint.y = 0
        }

        positions.x1 = (startPoint.x * 100) + '%'
        positions.y1 = (startPoint.y * 100) + '%'
        positions.x2 = (endPoint.x * 100) + '%'
        positions.y2 = (endPoint.y * 100) + '%'
	} else if (orientation.type == 'directional') {
		switch (orientation.value) {
			case 'left':
				positions.x1 = '100%'
				break

			case 'up':
				positions.y1 = '100%'
				break

			case 'right':
				positions.x2 = '100%'
				break

			case 'down':
				positions.y2 = '100%'
				break

			default:
				throw(`Invalid orientation value: ${ orientation.value }`)
				break
		}
	}

	return positions
}

const LinearGradient = (props) => {
	const {id, fill} = props
	
	if (!fill) {
		return <linearGradient id={ id } />
	}
	
	const {colorStops, orientation} = GradientParser.parse(fill)[0]
	const positions = positionsForOrientation(orientation)

	const renderColorStop = (colorStop, index) => {
		const key = `color-stop-${ index }`
		const offset = (index / (colorStops.length - 1)) * 100 + '%'
		let stopColor = 'rgb(0,0,0)'

		switch (colorStop.type) {
			case 'rgb': {
				const [r, g, b] = colorStop.value
				stopColor = `rgb(${ r },${ g },${ b })`
				break
			}

			case 'rgba': {
				const [r, g, b, a] = colorStop.value
				stopColor = `rgba(${ r },${ g },${ b },${ a })`
				break
			}

			case 'hex': {
				stopColor = `#${ colorStop.value }`
				break
			}

			case 'literal': {
				console.log(`Literal '${ colorStop.value }' is not supported`)
				break
			}
			
			default:
				break
		}
		
		return <stop key={ key } offset={ offset } stopColor={ stopColor } />
	}

	return <linearGradient id={ id } x1="0%" y1="0%" x2="0%" y2="100%">
		{ colorStops.map(renderColorStop) }
	</linearGradient>
}

LinearGradient.defaultProps = {
	id: null
}

export default LinearGradient