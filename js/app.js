var MapMarker = function MapMarker(placeData) {
  
  this.name = ko.observable(placeData.name);
  this.address = ko.observable(placeData.formatted_address);
  this.lat = ko.observable(placeData.geometry.location.k);
  this.lon = ko.observable(placeData.geometry.location.D);
 
  //this.name = ko.observable(name);
  //this.address = ko.observable(address);
  
  var bounds = window.mapBounds;
	 
	  // marker is an object with additional data about the pin for a single location
	  var marker = new google.maps.Marker({
		  map: map,
		  position: placeData.geometry.location,
		  title: placeData.name,
		  animation: google.maps.Animation.DROP
	  });
	  
	  //marker.addListener('click', toggleBounce);
	  
	  function toggleBounce() {
		  if (marker.getAnimation() !== null) {
			marker.setAnimation(null);
		  } else {
			marker.setAnimation(google.maps.Animation.BOUNCE);
		  }
	  }
	  
	  var infoWindow = new google.maps.InfoWindow({
		  content: placeData.name
	  });

	  google.maps.event.addListener(marker, 'click', function() {
		infoWindow.open(map,marker);
		toggleBounce();
	  });
	  
	  this.registerClick = function() {
		// do whatever
		infoWindow.open(map,marker);
		toggleBounce();
	  }
	  
	  this.isVisible = ko.observable(false);

	  this.isVisible.subscribe(function(currentState) {
		if (currentState) {
		  marker.setMap(map);
		} else {
		  marker.setMap(null);
		}
	  });

	  this.isVisible(true);
	  
	  bounds.extend(placeData.geometry.location);
	  // fit the map to the new marker
	  map.fitBounds(bounds);
	  // center the map
	  map.setCenter(bounds.getCenter());
 
}

var googleMap = '<div id="map"></div>';

/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/
var map;    // declares a global map variable

 var names = [
		"Pinecliff Village",
		"Ski Apache",
		"Spencer Theater for the Performing Arts",
		"Flying J Ranch",
		"Hubbard Museum of the American West",
		"Noisy Water Winery"
	];	

 var places = [
		"26060 U.S. Highway 70, Ruidoso, NM 88345",
		"1200 Ski Run Road, Alto, NM 88312",
		"108 Spencer Dr, Alto, NM 88312",
		"1028 NM-48, Alto, NM 88312",
		"26301 Highway 70 West, Ruidoso Downs, NM 88346",
		"2342 Sudderth Dr, Ruidoso, NM 88345"
	];
	
 var placeList = ko.observableArray([]);
/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var locations;

  var mapOptions = {
	disableDefaultUI: false
  };

  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);



  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
	if (status == google.maps.places.PlacesServiceStatus.OK) {
	  //createMapMarker(results[0]);
	  //var index = placeList.length;
	  placeList.push( new MapMarker( results[0]) );
	}
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

	// creates a Google place search service object. PlacesService does the work of
	// actually searching for location data.
	var service = new google.maps.places.PlacesService(map);

	// Iterates through the array of locations, creates a search object for each location
	for (var place in locations) {
	  
	  // the search request object
	  var request = {
		query: locations[place]	// place really is integer
	  };
	  // Actually searches the Google Maps API for location data and runs the callback
	  // function with the search results after each search.
	  service.textSearch(request, callback);
	  //self.placeList[place].label = locations[place].name;		// place really is integer

	}
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = names;
  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
   pinPoster(locations);	// just addresses
  //pinPoster(attractions);	
}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
window.addEventListener('load', initializeMap);

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  // Make sure the map bounds get updated on page resize
  map.fitBounds(mapBounds);
});

$("#mapDiv").append(googleMap);


	  
var ViewModel = function() {
	var self = this;
	
	self.filterText  = ko.observable('');
	// replace?
	self.filteredRecords = ko.computed(function () {
		return ko.utils.arrayFilter(placeList(), function ( rec ) {
            var doesMatch = self.filterText ().length == 0 || rec.name().toLowerCase().indexOf(self.filterText ().toLowerCase()) > -1;
			
			rec.isVisible(doesMatch);
			
			return doesMatch;      
		});
	});
	
	
};
ko.applyBindings(new ViewModel());

