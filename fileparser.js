const fs = require('fs')
fs.readFile('./list.txt', 'utf8', function (err, data) {
  if (err) {
    return console.log(err)
  }
  data = data.split('\n')
  data = data.map(company => ({name: company, contact: ''}))
  fs.writeFile('./companies.js', JSON.stringify(data), function (err) {
    if (err) {
      return console.log(err)
    }

    console.log('The file was saved!')
  })
})
