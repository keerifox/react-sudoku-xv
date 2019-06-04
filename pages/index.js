import fetch from 'isomorphic-unfetch'

class Connection extends React.Component {
	render() {
		if(this.props.value === null) {
			return null
		}

		return (
			<div>
				<div
					className={`connection ${this.props.direction} ${this.props.value}`}
				>
					<div className="value">{this.props.value}</div>
				</div>
				<style jsx>{`
					.connection {
						display: flex;
						flex-direction: row;
						align-items: center;
						justify-content: center;
						position: absolute;
						font-family: 'ChivoBold';
						font-size: 24px;
						text-align: center;
						top: 0;
						z-index: 2;
					}

					.connection > .value {
						width: 20px;
						height: 20px;
						background: #FFF;
						text-align: center;
						line-height: 0.9;
					}

					.connection.right {
						width: 200%;
						height: 100%;
					}

					.connection.bottom {
						width: 100%;
						height: 200%;
					}

					.connection.x {
						color: #228;
					}

					.connection.v {
						color: #822;
					}
				`}</style>
			</div>
		)
	}
}

class Cell extends React.Component {
	render() {
		const connectionRight = (
				( (this.props.connection & 1) !== 0 )
			? 'v'
			: (
					( (this.props.connection & 2) !== 0 )
				? 'x'
				: null
			)
		)

		const connectionBottom = (
				( (this.props.connection & 4) !== 0 )
			? 'v'
			: (
					( (this.props.connection & 8) !== 0 )
				? 'x'
				: null
			)
		)

		return (
			<div className="cell">
				<div className="value">
					{this.props.valueDefault}
				</div>
				<Connection
					direction="right"
					value={connectionRight}
				/>
				<Connection
					direction="bottom"
					value={connectionBottom}
				/>
				<style jsx>{`
					.cell {
						flex: 1;
						border-left: 1px solid #444;
						position: relative;
					}

					.cell > .value {
						position: absolute;
						width: 100%;
						height: 100%;
						top: 18%;
						font-family: 'ChivoBold';
						font-size: 40px;
						text-align: center;
						line-height: 1;
						-webkit-touch-callout: none;
						-webkit-user-select: none;
						-khtml-user-select: none;
						-moz-user-select: -moz-none;
						-ms-user-select: none;
						user-select: none;
					}

					.cell:nth-child(3), .cell:nth-child(6) {
						border-right: 2px solid #444;
					}

					.cell:before {
						content: "";
						display: block;
						padding-top: 100%;
					}
				`}</style>
			</div>
		)
	}
}

class Board extends React.Component {
	renderCell(cellId, puzzleCells, puzzleConnections) {
		const valueDefault =
				( puzzleCells[cellId] !== '.' )
			? puzzleCells[cellId]
			: null

		const connection = parseInt( puzzleConnections[cellId], 16 )

		return <Cell
			key={cellId}
			valueDefault={valueDefault}
			connection={connection}
		/>
	}

	render() {
		const puzzleCells = this.props.puzzleCells
		const puzzleConnections = this.props.puzzleConnections

		let rows = []

		for(let rowIdx = 0; rowIdx < 9; rowIdx++) {
			let columns = []

			for(let columnIdx = 0; columnIdx < 9; columnIdx++) {
				columns.push(
					this.renderCell(
						rowIdx * 9 + columnIdx,
						puzzleCells,
						puzzleConnections
					)
				)
			}

			rows.push(
				<div className="row" key={rowIdx}>
					{columns}
					<style jsx>{`
						.row {
							flex: 1;
							display: flex;
							flex-direction: row;
							border-collapse: collapse;
							border-top: 1px solid #444;
							border-right: 1px solid #444;
						}

						.row:nth-child(3), .row:nth-child(6) {
							border-bottom: 2px solid #444;
						}

						.row:last-child {
							border-bottom: 1px solid #444;
						}
					`}</style>
				</div>
			)
		}

		return (
			<div id="board">
				{rows}
				<style jsx>{`
					#board {
						display: flex;
						flex-direction: column;
						width: 540px;
					}
				`}</style>
			</div>
		)
	}
}

class Game extends React.Component {
	render() {
		return (
			<div id="game">
				<Board
					puzzleCells={this.props.puzzleCells}
					puzzleConnections={this.props.puzzleConnections}
				/>
				<style jsx>{`
					@font-face {
						font-family: 'ChivoMedium';
						src: url('/static/fonts/Chivo-Medium-webfont.woff') format('woff');
						font-weight: normal;
						font-style: normal;
					}

					@font-face {
						font-family: 'ChivoBold';
						src: url('/static/fonts/Chivo-Bold-webfont.woff') format('woff');
						font-weight: normal;
						font-style: normal;
					}

					#game {
						display: flex;
						flex-direction: column;
						align-items: center;
						justify-content: center;
						min-width: 560px;
						height: 95vh;
					}
				`}</style>
			</div>
		)
	}
}

const Index = (props) => (
	<Game
		puzzleId={props.puzzleId}
		puzzleCells={props.puzzleCells}
		puzzleConnections={props.puzzleConnections}
	/>
)

Index.getInitialProps = async () => {
	const res = await fetch('http://localhost:3001/puzzles/new', { method: 'POST' })
	const data = await res.json()

	return {
		puzzleId: data.id,
		puzzleCells: data.cells,
		puzzleConnections: data.connections,
	}
}

export default Index;
