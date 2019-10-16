const Pool = require('pg').Pool
const pool = new Pool({
  user: 'pi',
  host: 'localhost',
  database: 'quizzbot',
  password: '$#Cur1tyDB',
  port: 5432,
})

const getUsers = (request, response) => {
  pool.query('SELECT * FROM players ORDER BY uid ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getUserById = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('SELECT * FROM players WHERE uid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    //response.status(200).json(results.rows)
    response.render('home',{question:results.rows[0].name});
  })
}
const createTeam = (request, response) => {
  const { qbid, teamname } = request.body

  pool.query('INSERT INTO leaderboard (qbid, teamname) VALUES ($1, $2)', [qbid, teamname], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Team added with QBID: ${result.insertId}`)
  })
}

const updateUser = (request, response) => {
  const id = parseInt(request.params.id)
  const { name, email } = request.body

  pool.query(
    'UPDATE players SET name = $1, email = $2 WHERE uid = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User modified with UID: ${uid}`)
    }
  )
}
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id)

  pool.query('DELETE FROM players WHERE uid = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).send(`User deleted with UID: ${uid}`)
  })
}

const updateScore = (request, response) => {
  const qbid = parseInt(request.params.qbid)

  pool.query(
    'UPDATE leaderboard SET score = score + 1 WHERE qbid = $1',
    [qbid],
    (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`Score increased for QBID: ${qbid}`)
    }
  )
}

module.exports = {
  getUsers,
  getUserById,
  createTeam,
  updateUser,
  deleteUser,
  updateScore,
}
