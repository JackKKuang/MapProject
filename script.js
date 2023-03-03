let myLat = 48.4284;
let myLong = -123.3656;

var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
let range = 5000;
var directionsRenderer;
var diretionsService;

let anchort = false;
let mapAnchor;
let currentPosition;

let map;
let lookFor = "restuarant";

let infoWindowPark; // for park info
let infoWindowCurrentLocation // for your location

let markers = [];
let marker;

function initMap() {

  InfoWindowCurrentLocation = new google.maps.InfoWindow();
  infoWindowPark = new google.maps.InfoWindow();

  const victoria = { lat: 48.4284, lng: -123.3656 };

  map = new google.maps.Map(document.getElementById("map"),{
    zoom: 16,
    center: victoria,
  });

  marker = new google.maps.Marker({
    position: victoria,
    map: map,
  });
  
  directionsRenderer = new google.maps.DirectionsRenderer();
  
  var request = {
    location: victoria,
    radius: '3000',
    query: 'restaurant'
  };

  currentPosition = victoria;
  
  let service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  
  const locationButton = document.createElement("button");

  locationButton.textContent = "Pan to location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  
  
  let selection = document.getElementById("selection");
  
  selection.addEventListener('change', function(){
    lookFor = selection.value;
    refreshMarkers();
  });
  
  locationButton.addEventListener("click", () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        currentPosition = pos;
        
        infoWindowPark.setPosition(pos);
        infoWindowPark.setContent("Location Found");
        infoWindowPark.open(map);
        map.setCenter(pos);
        setCurrentLocation(pos);
      },
      () => {
        handleLocationError(true, infoWindowPark, map.getCenter());
      }
      );
    }else {
      handleLocationError(false, infoWindowPark, map.getCenter());
    }
    
    
    
  });
  
google.maps.event.addListener(map, "click", function(event){
 
  if(anchort == true){
   
    var lat = event.latLng.lat().toFixed(4);
    var lng = event.latLng.lng().toFixed(4); 
  
    let pos = { lat: +lat, lng: +lng };
    console.log(pos);
    console.log(victoria);
    
    setCurrentLocation(pos);
    
    anchort = false;
    anchor.innerHTML = "anchor"
  }
  
});
  
let anchor = document.getElementById("anchor");
  
  anchor.addEventListener("click", function(event){
    console.log("yo");
    
    if(anchort == true){
      anchor.innerHTML = "Anchor"
      anchort = false;
    }else{
      anchort = true;
      anchor.innerHTML = "Click on map to anchor position"
    }
  });

}

function createMarker(request, iconColor) {
  
  let marker = new google.maps.Marker({
    position: request.geometry.location,
    map: map,

    icon: {
      url: iconColor,
      scaledSize: new google.maps.Size(40,40),
      origin: new google.maps.Point(0, 0), //origin,
    }
    
   //marker.rating = request.rating;
    
    
  });
  
  const content = '<h3>' + request.name + '<h3> \n Rating: ' + request.rating + " <br> <button class = 'button' onclick=showDirections(" + request.geometry.location.lat() + "," + request.geometry.location.lng() + "," + "'WALKING'" + ")" + "> Walk There! </button> <br> " + " <button class = 'button' onclick=showDirections(" + request.geometry.location.lat() + "," + request.geometry.location.lng() + "," + "'TRANSIT'" + ")" + "> Bus There! </button>  " + "<br> <button class = 'button' onclick=showDirections(" + request.geometry.location.lat() + "," + request.geometry.location.lng() + "," + "'DRIVING'" + ")" + "> Drive There! </button> ";
  
  google.maps.event.addListener(marker, "click", () => {
    infoWindowPark.setContent(content);
    infoWindowPark.open(map, marker);
  });
  
  markers.push(marker);
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    
    results.sort((a, b) => b.rating - a.rating);
    
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      
      console.log(results)
      
      if(i < 3){
        createMarker(results[i], "https://maps.google.com/mapfiles/ms/icons/green-dot.png");
      }else{
        createMarker(results[i], "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png");
      }
    }
  }
}

function setMapOnAll(map){
  for (let i = 0; i < markers.length; i++){
    markers[i].setMap(map);
  }
}

function refreshMarkers(){
  setMapOnAll(null);
  markers = [];
  
  var request = {
    location: currentPosition,
    radius: range,
    query: lookFor
  };

  let service = new google.maps.places.PlacesService(map);
  service.textSearch(request, callback);
  
}
window.initMap = initMap;

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  range = this.value * 1000;
  refreshMarkers();
}

function setCurrentLocation(pos){
  console.log("ref")
  marker.setPosition(pos);
  console.log(marker);
  currentPosition = pos;
  refreshMarkers();
}

function showDirections(lat, long, mode) {
 
  var directionsService = new google.maps.DirectionsService();
  directionsRenderer.setMap(null);
  
  directionsService.route({
    origin: currentPosition,
    destination: new google.maps.LatLng(lat, long),
    travelMode: mode
  }, function(response, status) {
    if (status === 'OK'){
      directionsRenderer.setDirections(response);
      directionsRenderer.setMap(map);
    }else{
      alert('Directions request failed due to ' + status);
    }
  });
  
  /*console.log(lat + " " + long);
  
  var request = {
    origin: currentPosition,
    destination: new google.maps.LatLng(lat, long),
    travelMode: 'DRIVING'
  };
  
 directionsService.route(request, function(response, status) {
    if (status === 'OK') {
      directionsRenderer.setDirections(response);
      console.log("ok");
    }
  });*/
}

window.onLoad = function(){
  
 
};