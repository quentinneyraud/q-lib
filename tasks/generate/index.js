const fs = require('fs')

fs.promises.mkdir('test/ok/ydegcg', {
  recursive: true
})
  .then(datas => {
    console.log(datas)
  })
