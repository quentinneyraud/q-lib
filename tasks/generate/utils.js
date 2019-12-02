const gc = require('gitconfig')

// https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url/43467144
const isUrl = str => {
  const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
  return !pattern.test(str)
}

// https://medium.com/@mhagemann/the-ultimate-way-to-slugify-a-url-string-in-javascript-b8e4a0d849e1
const slugify = str => {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return str.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

// Extract package name and scope from a full name package
const getPackageInfos = (packageName) => {
  const pattern = new RegExp('^(?:@([^/]+?)[/])?([^/]+?)$')
  const nameMatch = packageName.match(pattern)
  if (nameMatch) {
    return {
      scope: nameMatch[1],
      name: nameMatch[2]
    }
  } else {
    return {
      scope: null,
      name: packageName
    }
  }
}

// Log blank line n times
const logBlank = n => console.log('\n'.repeat(n))

// Convert string to PascalCase
// https://gist.github.com/jacks0n/e0bfb71a48c64fbbd71e5c6e956b17d7
const toPascalCase = str => {
  return str.match(/[a-z]+/gi)
    .map((word) => {
      return word.charAt(0).toUpperCase() + word.substr(1).toLowerCase()
    })
    .join('')
}

const getGlobalGitUser = () => {
  return gc.get('user', {
    location: 'global'
  })
}

module.exports = {
  isUrl,
  slugify,
  getPackageInfos,
  logBlank,
  toPascalCase,
  getGlobalGitUser
}
