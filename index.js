const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const fetch = require('isomorphic-fetch')

let keys
let YELP_KEY
if (process.env.NODE_ENV === 'production') {
  YELP_KEY = process.env.YELP_KEY
} else {
  keys = require('./keys.json')
  YELP_KEY = keys.yelpKey
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

router.route('/getBusinesses')
  .get((req, res) => {
    const {term, location, sortBy} = req.query
    fetch(`https://api.yelp.com/v3/businesses/search?term=${term}&location=${location}&sort_by=${sortBy}`, {
      headers: {
        Authorization: `Bearer ${YELP_KEY}`
      }
    }).then(res => res.json()).then(response => {
      res.json(response)
    })
  })
