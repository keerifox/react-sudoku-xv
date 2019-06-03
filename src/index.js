import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

class Cell extends React.Component {
	render() {
		return (
			<div className="cell">
				<div className="value">
					{this.props.valueDefault}
				</div>
			</div>
		)
	}
}

class Board extends React.Component {
	renderCell(cellId) {
		return <Cell
			key={cellId}
			valueDefault={cellId}
		/>
	}

	render() {
		let rows = []

		for(let rowIdx = 0; rowIdx < 9; rowIdx++) {
			let columns = []

			for(let columnIdx = 0; columnIdx < 9; columnIdx++) {
				columns.push(
					this.renderCell(rowIdx * 9 + columnIdx)
				)
			}

			rows.push(
				<div className="row" key={rowIdx}>
					{columns}
				</div>
			)
		}

		return (
			<div id="board">
				{rows}
			</div>
		)
	}
}

class Game extends React.Component {
	render() {
		return (
			<Board />
		)
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('game')
)
