const mongoose = require('mongoose')
const Schema = mongoose.Schema

let CompanySchema = new Schema({
  name: String,
  email: String
})

module.exports = mongoose.model('Company', CompanySchema)
