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

sequelize.sync().then(() => {
	app.post('/puzzles/new', async (req, res) => {
		const cellsDisclosedCount = 40
		const cellsDisclosed = sudoku.generate(cellsDisclosedCount)
		const cellsSolution = sudoku.solve(cellsDisclosed)

		const puzzle = await Puzzle.create({
			cellsDisclosedCount,
			cellsDisclosed,
			cellsSolution,
		})

		res.json({
			id: puzzle.id,
			cells: puzzle.cellsDisclosed,
		})
	})

	app.listen(API_SERVER_PORT, () => {
		console.log(`Sudoku XV API server listening on port ${API_SERVER_PORT}.`)
	})
})
