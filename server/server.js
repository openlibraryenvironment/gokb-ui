const fs = require('fs')
const bodyParser = require('body-parser')
const jsonServer = require('json-server')
const jwt = require('jsonwebtoken')

const server = jsonServer.create()
const router = jsonServer.router('./database.json')
const userdb = JSON.parse(fs.readFileSync('./users.json', 'UTF-8'))

server.use(bodyParser.urlencoded({ extended: true }))
server.use(bodyParser.json())
server.use(jsonServer.defaults())

const SECRET_KEY = '123456789'
const expiresIn = '1h'

// create a token from a payload
const createToken = payload => jwt.sign(payload, SECRET_KEY, { expiresIn })

// verify the token
const verifyToken = token => jwt.verify(token, SECRET_KEY, (err, decode) => decode !== undefined ? decode : err)

// check if the user exists in database
const isAuthenticated = ({ username, password }) => userdb.users.findIndex(user => user.username === username && user.password === password) !== -1

// register New User
server.post('/auth/register', (req, res) => {
  console.log('register endpoint called request body:')
  console.log(req.body)
  const { username, password } = req.body

  if (isAuthenticated({ username, password }) === true) {
    const status = 401
    const message = 'Email and Password already exist'
    res.status(status).json({ status, message })
    return
  }

  fs.readFile('./users.json', (err, data) => {
    if (err) {
      const status = 401
      const message = err
      res.status(status).json({ status, message })
      return
    }

    // Get current users data
    const userData = JSON.parse(data.toString())

    // Get the id of last user
    const lastItemId = userData.users[data.users.length - 1].id

    // add new user
    userData.users.push({ id: lastItemId + 1, username, password }) // add some data
    fs.writeFile('./users.json', JSON.stringify(userData), (err, result) => {
      if (err) {
        const status = 401
        const message = err
        res.status(status).json({ status, message })
      }
    })
  })

// Create token for new user
  const accessToken = createToken({ username, password })
  console.log('Access Token:' + accessToken)
  res
    .status(200)
    .json({ accessToken })
})

// login to one of the users from ./users.json
server.post('/auth/login', (req, res) => {
  console.log('login endpoint called request body:')
  console.log(req.body)
  const { username, password } = req.body
  if (isAuthenticated({ username, password }) === false) {
    const status = 401
    const message = 'Incorrect email or password'
    res
      .status(status)
      .json({ status, message })
      return
  }

  const accessToken = createToken({ username, password })
  console.log('Access Token:' + accessToken)
  res
    .status(200)
    .json({ access_token: accessToken, token_type: 'Bearer', expires_in: 60 * 60 })
})

server.use(/^(?!\/auth).*$/, (req, res, next) => {
  // console.log('method', req.method)
  if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
    const status = 401
    const message = 'Error in authorization format'
    res
      .status(status)
      .json({ status, message })
    return
  }
  try {
    let verifyTokenResult
    verifyTokenResult = verifyToken(req.headers.authorization.split(' ')[1])

    if (verifyTokenResult instanceof Error) {
      const status = 401
      const message = 'Access token not provided'
      res
        .status(status)
        .json({ status, message })
      return
    }
    next()
  } catch (err) {
    const status = 401
    const message = 'Error access_token is revoked'
    res
      .status(status)
      .json({ status, message })
  }
})

server.use(router)

server.listen(3000, () => {
  console.log('Run Auth API Server')
})
