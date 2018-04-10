import $ from 'jquery'
import router from 'page'
import Handlebars from 'hbsfy/runtime'

// templates
import homeTpl from './templates/home.hbs'
import driversTpl from './templates/drivers.hbs'
import driverTpl from './templates/driver.hbs'
import constructorsTpl from './templates/constructors.hbs'
import constructorTpl from './templates/constructor.hbs'
import contactTpl from './templates/contact.hbs'
import notFoundTpl from './templates/not-found.hbs'

// json
// import playersJson from './players.json'

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

function driver(context){
  const pSlug = context.params.driverID
  let url = "http://ergast.com/api/f1/drivers/" + pSlug + ".json"
  let urlConst = "http://ergast.com/api/f1/drivers/" + pSlug + "/constructors.json"
  let urlResults = "http://ergast.com/api/f1/drivers/" + pSlug + "/results.json"
  let obj = {}
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    obj = myJson.MRData.DriverTable.Drivers[0]

    fetch(urlConst)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      obj.constructors = myJson.MRData.ConstructorTable.Constructors

      fetch(urlResults)
      .then(function(response) {
        return response.json();
      })
      .then(function(myJson) {
        obj.races = myJson.MRData.RaceTable.Races
        $app.html(driverTpl(obj))
      })

    })
  });
}

function drivers(){
  fetch('http://ergast.com/api/f1/drivers.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    $app.html(driversTpl(myJson.MRData.DriverTable))
  });
}

function constructor(context){
  const pSlug = context.params.constructorID
  let url = "http://ergast.com/api/f1/constructors/" + pSlug + ".json"
  let urlDrivers = "http://ergast.com/api/f1/constructors/" + pSlug + "/drivers.json"
  let obj = {}
  fetch(url)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    obj = myJson.MRData.ConstructorTable.Constructors[0]
    fetch(urlDrivers)
    .then(function(response) {
      return response.json();
    })
    .then(function(myJson) {
      obj.drivers = myJson.MRData.DriverTable.Drivers
      $app.html(constructorTpl(obj))
    })
  });
}

function constructors(){
  fetch('http://ergast.com/api/f1/constructors.json')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    $app.html(constructorsTpl(myJson.MRData.ConstructorTable))
  });
}

function notFound() {
  $app.html(notFoundTpl())
}

router('/', index)
router('/drivers/:driverID', driver)
router('/drivers', drivers)
router('/constructor/:constructorID', constructor)
router('/constructors', constructors)
router('/contact', contact)
router('*', notFound)
router()
