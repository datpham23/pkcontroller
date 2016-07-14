//################################################################### Client Stuff ########################################################################################
var map;
var myLocation;
var moveConstant = 0.00009;

function initMap() {
  var myLatLng = {lat: 37.7756, lng: -122.4193};

  map = new google.maps.Map(document.getElementById('map'), {
    center: myLatLng,
    zoom: 17

  });

  myLocation = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: 'Im here'
  });

  initSearchBox();
  bidnKeyEvents();
}

function initSearchBox(){
  var input = document.getElementById('search');
  var searchBox = new google.maps.places.SearchBox(input);
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
    myLocation.setPosition(map.getCenter());
  });
}

function bidnKeyEvents(){
  document.addEventListener("keydown", function(e){
    var newLocation = myLocation.getPosition().toJSON();

    //Move left
    if(e.keyCode === 65 || e.keyCode === 37){
      newLocation.lng = newLocation.lng - moveConstant;
    }
    //Move up
    if(e.keyCode === 87 || e.keyCode === 38){
      newLocation.lat = newLocation.lat + moveConstant;
    }
    //Move right
    if(e.keyCode === 68 || e.keyCode === 39){
      newLocation.lng = newLocation.lng + moveConstant;
    }
    //Move down
    if(e.keyCode === 83 || e.keyCode === 40){
      newLocation.lat = newLocation.lat - moveConstant;
    }
    myLocation.setPosition(newLocation);
    map.panTo(newLocation);
    writeGPXAndClick(newLocation);
  }, false);
}

//################################################################### Node Stuff ########################################################################################
var gpxLocation = 'you gpx location';

var fs = require('fs');
var robot = require('robotjs');
function writeGPXAndClick(location){
  var gpxContent = '<gpx creator="Xcode" version="1.1"><wpt lat="'+location.lat+'" lon="'+location.lng+'"><name>PokemonLocation</name></wpt></gpx>';

  fs.writeFile(gpxLocation, gpxContent, function (err) {
    if (err)
      return console.log(err);
    console.log('Wrote File');
    //click location thingy
    robot.moveMouse(575, 1172);
    robot.mouseClick();

    //choose location
    robot.moveMouse(584, 888);
    robot.mouseClick();

    //focus back to electron app
    setTimeout(function(){
      robot.moveMouse(1222, 35);
      robot.mouseClick();
    },100)

    //catch scenarios where you've pressed a key while its clicking
    setTimeout(function(){
      robot.moveMouse(1222, 32);
      robot.mouseClick();
    },500)

  });
}
