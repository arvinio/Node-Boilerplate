const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const Company = require('./db/model')
const bodyParser = require('body-parser')
const keys = require('./keys.json')

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

mongoose.connect(keys.MONGO_URL)

router.route('/add')
  .post((req, res) => {
    let company = new Company()
    company.name = req.body.name
    company.email = req.body.email

    company.save((err) => {
      if (err) res.send(err)
      else {
        res.json({message: 'Company details added'})
      }
    })
  })
