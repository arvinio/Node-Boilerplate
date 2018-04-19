const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Company = require('./db/model')
const bodyParser = require('body-parser')

let keys
let MONGO_URL
if (process.env.NODE_ENV === 'production') {
  MONGO_URL = process.env.MONGO_URL
} else {
  keys = require('./keys.json')
  MONGO_URL = keys.MONGO_URL
}

const app = express()
const router = express.Router()
const PORT = process.env.PORT || 9000

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.all('/*', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,OPTIONS,POST,PUT,DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers')
  res.setHeader('Cache-Control', 'no-cache')
  next()
})

app.options(/(.*)/, (req, res, next) => {
  res.sendStatus(200) // Always respond OK on OPTIONS requests.
})

// Serve static assets
app.use(express.static(path.resolve(__dirname, 'build')))

router.get('/', function (req, res) {
  res.send('Ready!')
})

app.use('/api', router)
app.listen(PORT, function () {
  console.log(`API running on PORT ${PORT}`)
})

mongoose.connect(MONGO_URL)

router.route('/companies')
  .get((req, res) => {
    Company.find((err, companies) => {
      if (err) res.send(err)
      res.json(companies)
    })
  })
  .post((req, res) => {
    let {name, email} = req.body
    Company.findOneAndUpdate({name}, {$set: {email}}, {new: true}, (err, company) => {
      if (err) res.send(err)
      res.json(company)
    })
  })
