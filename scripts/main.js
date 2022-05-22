const VERBS = []

const PRETTY_NAMES = {
  'pres'   : 'Present',
  'pst'    : 'Past',
  'rsp'    : 'Resultative',
  'imper'  : 'Imperative',
  'inf'    : 'Infinitive',
  'prog'   : 'Progressive',
  'vn'     : 'Verbal noun',
  'ap'     : 'Active',
  'hab'    : 'Habitual',
  'future' : 'Future',
  'stem'   : 'Stem',
  's_suff' : 'S-suffx.',
  's_long_suff' : 'S-suffx. (long)',
  'l_suff' : 'L-suffx.',
}

let isDict = dict => typeof dict === 'object' && !Array.isArray(dict)

let firstVal = val => isDict(val) ? firstVal(Object.values(val)[0]) : val

let tableToHtml = (table, level=0) => {
    if (!isDict(table)) {return ''}
    
    let html = ''
    for (let k in table) {
        let v = table[k]
        let left = k in PRETTY_NAMES ? PRETTY_NAMES[k] : k
        let right = (!isDict(v) || level === 0) ? firstVal(v) : ''
        let classes = []
        if (level === 0) {
            classes.push('section')
            if (isDict(v)) {
                classes.push('collapsible')
            }
        }
        let rest = tableToHtml(v, level+1)
        html += `<tr class="${classes.join(' ')}">
  <td class="indent${level}">${left}</td>
  <td>${right}</td>
</tr>
${rest}`
  }

  return html
}


class Verb {
  constructor(verb_dict) {
    this.search_fields = [verb_dict['definition'], verb_dict['word']]
    this.elem = document.createElement('section')
    this.elem.innerHTML = `
    <table>
    <thead>
    <tr><th colspan="2">
      <span class="word">${verb_dict['word']}</span>
      <span class="pattern">${verb_dict['pattern']}</span>
      (root <span class="root">${verb_dict['root']}</span>)
      <span class="definition">${verb_dict['definition']}</span>
    </th></tr>
    </thead>
    <tbody>${tableToHtml(verb_dict['table'])}</tbody>
    </table>
    `
    document.querySelector('main').append(this.elem)
    this.hide()
    VERBS.push(this)
  }
  relates_to = search => search && this.search_fields.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  hide = _ => this.elem.style.display = 'none'
  show = _ => this.elem.style.display = 'block'
}


let filter = async _ => {
  search = document.querySelector('input').value
  document.querySelector('#explanation').style.display = search ? 'none' : 'block'
  for (const verb of VERBS) {
    await verb.relates_to(search) ? verb.show() : verb.hide()
  }
}

let hide_collapsible = elem => {
  if (!elem.matches('tr.collapsible')) return
  elem.classList.toggle('collapsed')

  let next = elem.nextElementSibling
  while (next) {
    if (next.matches('tr.section')) break
    next.classList.toggle('hide')
    next = next.nextElementSibling
  }

  previews = elem.querySelectorAll('td:not(:first-child)')
  previews.forEach(elem => elem.classList.toggle('hide'))
}

fetch('data.json')
  .then(response => response.text())
  .then(text => JSON.parse(text))
  .then(json => json.forEach(verb => new Verb(verb)))
  .then(_ => {
    hello_message = document.createElement('p')
    hello_message.innerHTML = `This website presents the various inflections of ${VERBS.length} Assyrian verbs. Use the search bar on the left-hand side to search for various verbs by their English definition.`
    document.querySelector('#explanation').prepend(hello_message)
  })
  .then(_ => {
    document.querySelectorAll('tr.collapsible').forEach(elem => {
      previews = elem.querySelectorAll('td:not(:first-child)')
      previews.forEach(elem => elem.classList.toggle('hide'))
      elem.querySelector('td:first-child').addEventListener('click', _ => hide_collapsible(elem))
      hide_collapsible(elem)
    })
  })
