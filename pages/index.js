class Cell extends React.Component {
	render() {
		return (
			<div className="cell">
				<div className="value">
					{this.props.valueDefault}
				</div>
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
						font-weight: bold;
						text-align: center;
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
				<Board />
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
						min-width: 560px;
					}
				`}</style>
			</div>
		)
	}
}

class Index extends React.Component {
	render() {
		return (
			<Game />
		)
	}
}

export default Index;
