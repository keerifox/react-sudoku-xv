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
						z-index: 3;
						-webkit-touch-callout: none;
						-webkit-user-select: none;
						-khtml-user-select: none;
						-moz-user-select: -moz-none;
						-ms-user-select: none;
						user-select: none;
						pointer-events: none;
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
						color: #229;
					}

					.connection.v {
						color: #922;
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

		const isActiveCell = (this.props.activeCellId === this.props.id)

		return (
			<div
				className={`cell ${isActiveCell ? 'active' : 'inactive'}`}
				onClick={this.props.onClick}
			>
				<div
					className="value user"
				>
					{
							(this.props.valueUser !== '.')
						? this.props.valueUser
						: ''
					}
				</div>
				<Connection
					direction="right"
					value={connectionRight}
				/>
				<Connection
					direction="bottom"
					value={connectionBottom}
				/>
				<div
					className="value default"
					onKeyDown={this.props.onKeyDown}
					onFocus={this.props.onFocus}
					tabIndex="0"
				>
					{
							(this.props.valueDefault !== '.')
						? this.props.valueDefault
						: ''
					}
				</div>
				<style jsx>{`
					.cell {
						flex: 1;
						border-left: 1px solid #444;
						position: relative;
					}

					.cell.active:after {
						content: "";
						display: block;
						position: relative;
						width: 100%;
						height: 100%;
						top: -100%;
						border: 3px solid #E55;
						margin: -3px;
						z-index: 2;
					}

					.cell > .value {
						position: absolute;
						width: 100%;
						height: 100%;
						top: 0;
						padding-top: 18%;
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

					.cell > .value.default {
						font-family: 'ChivoBold';
						color: #111;
					}

					.cell > .value.user {
						font-family: 'ChivoMedium';
						color: #229;
					}

					.cell > .value:focus {
						outline: none;
						box-shadow: none;
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
	constructor(props) {
		super(props)

		let initialPuzzleInput = ''

		for(let cellIdx = 0; cellIdx < 81; cellIdx++) {
			initialPuzzleInput += '.'
		}

		this.state = {
			activeCellId: -1,
			puzzleInput: initialPuzzleInput,
		}
	}

	setActiveCellId(cellId) {
		this.setState({
			activeCellId: cellId,
		})
	}

	onKeyDown(event) {
		const activeCellId = this.state.activeCellId

		if(event.key === 'Escape') {
			this.setActiveCellId(-1)
		} else if(event.key === 'ArrowLeft') {
			if(activeCellId % 9 === 0) {
				return
			}

			this.setActiveCellId(activeCellId - 1)
		} else if(event.key === 'ArrowRight') {
			if(activeCellId % 9 === 8) {
				return
			}

			this.setActiveCellId(activeCellId + 1)
		} else if(event.key === 'ArrowUp') {
			if(activeCellId < 9) {
				return
			}

			this.setActiveCellId(activeCellId - 9)
		} else if(event.key === 'ArrowDown') {
			if(activeCellId > 71) {
				return
			}

			this.setActiveCellId(activeCellId + 9)
		}

		if( this.props.puzzleCells[activeCellId] !== '.' ) {
			return
		}

		let inputValue = event.key.toString()

		if(/[1-9]/.test(event.key) === false) {
			if(
						(event.key !== 'Backspace')
					&& (event.key !== 'Delete')
				) {
					return
			}

			inputValue = '.'
		}

		let newPuzzleInput =
				this.state.puzzleInput.slice(0, activeCellId)
			+ inputValue
			+ this.state.puzzleInput.slice(activeCellId + 1)

		this.setState({
			puzzleInput: newPuzzleInput,
		})
	}

	renderCell(cellId, puzzleCells, puzzleConnections) {
		const connection = parseInt( puzzleConnections[cellId], 16 )

		return <Cell
			key={cellId}
			id={cellId}
			valueDefault={puzzleCells[cellId]}
			valueUser={this.state.puzzleInput[cellId]}
			connection={connection}
			activeCellId={this.state.activeCellId}
			onClick={() => this.setActiveCellId(cellId)}
			onFocus={() => this.setActiveCellId(cellId)}
			onKeyDown={this.onKeyDown.bind(this)}
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
