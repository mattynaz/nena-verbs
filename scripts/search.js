const VERBS = []

let template = `
<h1>
  <span class="term"></span>
  <span class="pattern"></span>
  <span class="def"></span>
  <span class="root"></span>
</h1>
<div class="pres"></div>
<div class="past"></div>
<div class="rp"></div>
<div class="imp"></div>
<div class="inf"></div>
<div class="prog"></div>
<div class="vn"></div>
<div class="ap"></div>
`

class Verb {
  constructor(verb) {
    this.verb = verb
    this.search_fields = [this.verb.def]
    this.elem = document.createElement('section')
    this.elem.innerHTML = `
    <h1>
      <span class="term">${this.verb['term']}</span>
      <span class="pattern">${this.verb['pattern']}</span>
      <span class="def">${this.verb['def']}</span>
      <span class="root">${this.verb['root']}</span>
    </h1>
    <div class="pres">${this.verb['forms']['pres']}</div>
    <div class="pst">${this.verb['forms']['pst']}</div>
    <div class="rsp">${this.verb['forms']['rsp']}</div>
    <div class="imper">${this.verb['forms']['imper']}</div>
    <div class="inf">${this.verb['forms']['inf']}</div>
    <div class="prog">${this.verb['forms']['prog']}</div>
    <div class="vn">${this.verb['forms']['vn']}</div>
    <div class="ap">${this.verb['forms']['ap']}</div>
    `
    document.querySelector('main').append(this.elem)
    this.hide()
    VERBS.push(this)
  }
  relates_to = search => search && this.search_fields.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  hide = _ => this.elem.style.display = 'none'
  show = _ => this.elem.style.display = 'block'
}

filter = async _ => {
  search = document.querySelector('input').value
  document.querySelector('#explanation').style.display = search ? 'none' : 'block'
  for (const verb of VERBS) {
    await verb.relates_to(search) ? verb.show() : verb.hide()
  }
  //  VERBS.forEach(verb => verb.relates_to(search) ? verb.show() : verb.hide())
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


// fetch('recipes/published_recipes.md')
//   .then(response => response.text())
//   .then(text => [...text.matchAll(/# ([^\n]+)(?:\s*- id: *([a-z]*))(?:\s*- tags: *([a-z\d, ]*))?/gi)])
//   .then(matches => matches.map(match => match.slice(1)))
//   .then(recipes => recipes.forEach(recipe => new Recipe(recipe)))

