// const fs = require('fs')
const cli = require('./userInput')

// fs.promises.mkdir('test/ok/ydegcg', {
//   recursive: true
// })
//   .then(datas => {
//     console.log(datas)
//   })

cli()
  .then(datas => console.log(datas))
