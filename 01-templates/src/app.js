import $ from 'jquery'
import router from 'page'
import Handlebars from 'hbsfy/runtime'

// templates
import homeTpl from './templates/home.hbs'
import playersTpl from './templates/players.hbs'
import playerTpl from './templates/player.hbs'
import contactTpl from './templates/contact.hbs'
import notFoundTpl from './templates/not-found.hbs'

// json
import playersJson from './players.json'

Handlebars.registerHelper('age', function(date){
  return 2018 - parseInt(date.substr(0,4))
})

const $app = $('#app')

function index() {
  $app.html(homeTpl())
}

function contact() {
  $app.html(contactTpl())
}

function player(context){
  const pSlug = context.params.player
  const match = playersJson.players.find(function(e) {
    if(e.slug === pSlug) return e
  })
  console.log(match)
  $app.html(playerTpl(match))
}

function players(){
  $app.html(playersTpl(playersJson))
}

function notFound() {
  $app.html(notFoundTpl())
}

router('/', index)
router('/players/:player', player)
router('/players', players)
router('/contact', contact)
router('*', notFound)
router()
