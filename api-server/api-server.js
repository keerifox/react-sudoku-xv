const sudoku = require('sudoku-umd')
const express = require('express')
const Sequelize = require('Sequelize')
const Model = Sequelize.Model
const app = express()

const API_SERVER_PORT = 3001

const sequelize = new Sequelize(
	'sudoku-db',
	'sudoku-user',
	'sudoku-password',
	{
		dialect: 'sqlite',
		storage: __dirname + '/sudoku-db.sqlite',
		define: {
			timestamps: false,
		},
	}
)

class Puzzle extends Model {}
Puzzle.init({
	id: {
		type: Sequelize.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	cellsDisclosedCount: {
		type: Sequelize.INTEGER,
		allowNull: false,
	},
	cellsDisclosed: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cellsConnections: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	cellsSolution: {
		type: Sequelize.STRING,
		allowNull: false,
	},
	solvedAt: {
		type: Sequelize.DATE,
		allowNull: true,
	},
	createdAt: {
		type: Sequelize.DATE,
		defaultValue: Sequelize.NOW,
	},
}, {
	sequelize,
})

const getCellsConnections = (cellsSolution) => {
	let cellsConnections = ''
	let cellIdx = 0

	for(let rowIdx = 0; rowIdx < 9; rowIdx++) {
		const isLastRow = (rowIdx === 8)

		for(let columnIdx = 0; columnIdx < 9; columnIdx++) {
			const isLastColumn = (columnIdx === 8)

			const sumWithRight =
					(isLastColumn === false)
				? (
						parseInt( cellsSolution[cellIdx] )
					+ parseInt( cellsSolution[cellIdx + 1] )
				)
				: 0

			const sumWithBottom =
					(isLastRow === false)
				? (
						parseInt( cellsSolution[cellIdx] )
					+ parseInt( cellsSolution[cellIdx + 9] )
				)
				: 0

			const connection = (
					( (sumWithBottom === 10) << 3 )
				| ( (sumWithBottom === 5) << 2 )
				| ( (sumWithRight === 10) << 1 )
				| (sumWithRight === 5)
			)

			cellsConnections += connection.toString(16)

			cellIdx++
		}
	}

	return cellsConnections
}

sequelize.sync().then(() => {
	app.post('/puzzles/new', async (req, res) => {
		const cellsDisclosedCount = 20
		const cellsDisclosed = sudoku.generate(cellsDisclosedCount)
		const cellsSolution = sudoku.solve(cellsDisclosed)

		const cellsConnections = getCellsConnections(cellsSolution)

		const puzzle = await Puzzle.create({
			cellsDisclosedCount,
			cellsDisclosed,
			cellsConnections,
			cellsSolution,
		})

		res.json({
			id: puzzle.id,
			cells: cellsDisclosed,
			connections: cellsConnections,
		})
	})

	app.listen(API_SERVER_PORT, () => {
		console.log(`Sudoku XV API server listening on port ${API_SERVER_PORT}.`)
	})
})
