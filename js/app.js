'use strict';

var MapMarker = function MapMarker(name, lat, lon, phone) {
	var self = this;
	this.name = ko.observable(name);
	this.lat = ko.observable(lat);
	this.lon = ko.observable(lon);
	self.phone = phone;
  
	var bounds = window.mapBounds;

	self.marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(lat, lon),
		title: name,
		animation: google.maps.Animation.DROP
	});
  
	google.maps.event.addListener(self.marker, 'click', function() {
		var new_marker = self.marker;
		loadYelpContent(self);
		infoWindow.open(map,new_marker);
		animateMarker(new_marker);
	});
  
	this.isVisible = ko.observable(false);

	this.isVisible.subscribe(function(currentState) {
		if (currentState) {
			self.marker.setVisible(true);
		} else {
			self.marker.setVisible(false);
		}
	});

	this.isVisible(true);
  
	//bounds.extend(placeData.geometry.location);
	bounds.extend(new google.maps.LatLng(lat, lon));
	// fit the map to the new marker
	map.fitBounds(bounds);
	// center the map
	map.setCenter(bounds.getCenter()); 
};


var contentString, map, infoWindow, previous_animation, num, placeList;

function googleSuccess() {   
	infoWindow = new google.maps.InfoWindow({
		content: contentString
	});
	
	map = new google.maps.Map(document.getElementById('mapDiv'), {
		zoom: 11,
		center: {lat: 33.341389, lng: -105.666111},
		mapTypeId: google.maps.MapTypeId.ROADMAP	
	});
	// Sets the boundaries of the map based on pin locations
	window.mapBounds = new google.maps.LatLngBounds();
  
	ko.applyBindings(new PlacesViewModel());
}
  
function googleError() {
	alert("Google Maps Error");
}

function animateMarker(new_marker) {
	if( previous_animation ) {
		if(previous_animation.title === new_marker.title){
			toggleBounce(new_marker);
		} else {	
			previous_animation.setAnimation(null);
			new_marker.setAnimation(google.maps.Animation.BOUNCE);
			previous_animation = new_marker;
		}
	} else {
		new_marker.setAnimation(google.maps.Animation.BOUNCE);
		previous_animation = new_marker;
	}
}

function toggleBounce(new_marker) {
	if (new_marker.getAnimation() !== null) {
		new_marker.setAnimation(null);
	} else {
		new_marker.setAnimation(google.maps.Animation.BOUNCE);
	}
}
  
  
function loadYelpContent(currentMarker) {
	var auth = {
		//
		// Update with your auth tokens.
		//
		accessToken : "bG5PPVfMNsIsrQLvRP_1RMWsycPUTTQXME9JuR7JgETYV_lCyU6GsH_IvgPw9_u6-r1c2_h_Ztq6OnJWE_k8Zm-QiQzJWEeFml6s_2RdfRSK1Y4CkyY7qh2RfAibX3Yx",
		// This example is a proof of concept, for how to use the Yelp v3 API with javascript.
		// You wouldn't actually want to expose your access token secret like this in a real application.
	};

	//var terms = 'food';
	//var near = 'San+Francisco';
	var terms = currentMarker.name();
	var near = 'Ruidoso';

	var yelpUrl = 'https://cors-anywhere.herokuapp.com/';
	if( currentMarker.phone ){
		var phoneStr = currentMarker.phone.replace(/-/g, "");
		yelpUrl += 'https://api.yelp.com/v3/businesses/search/phone?phone=+1'+phoneStr;
	} else {
		var busStr = terms.replace(/\s+/g, '-').toLowerCase();
		yelpUrl += 'https://api.yelp.com/v3/businesses/search?term='+busStr+'&location='+near;
	}

	var message = {
		'action' : yelpUrl,
		'method' : 'GET',
	};


	$.ajax({
		'url' : message.action,
		headers: {
			'Authorization':'Bearer '+auth.accessToken,
		},
		'cache' : true,
		'dataType' : 'json',
		'timeout' : 5000,
		'success' : function(data, textStats, XMLHttpRequest) {
			console.log("Yelp Success");
			var contentString = '<div>'+currentMarker.name()+'<br/>Rating: '+ data.businesses[0].rating +'</div>';
			infoWindow.setContent(contentString);
		},
		'error' : function(parsedjson, textStatus, errorThrown) {
			alert('Yelp data cannot be loaded '+errorThrown);
		}
	});
	
}
	  
function PlacesViewModel () {
	var self = this;
		
	var placeList = ko.observableArray([
		new MapMarker('Noisy Water Winery','33.33138','-105.669602','575-257-9335'),
		new MapMarker('Hubbard Museum of the American West','33.332302','-105.59623699999997','575-378-4142'),
		new MapMarker('Spencer Theater for the Performing Arts','33.434','-105.60209299999997',''),
		new MapMarker('Ski Apache','33.397343','-105.788771','575-464-3600'),
		new MapMarker('Flying J Ranch','33.41421','-105.66796699999998','575-336-4330')
	]);
	
	// filter map markers from search input	
	self.filterText  = ko.observable('');
	
	self.filteredRecords = ko.computed(function () {
		return ko.utils.arrayFilter(placeList(), function ( rec ) {
			var doesMatch = self.filterText().length === 0 || rec.name().toLowerCase().indexOf(self.filterText().toLowerCase()) > -1;
			
			rec.isVisible(doesMatch);
			
			return doesMatch;      
		});
	});
	
	// select initial map marker
	this.currentSelected = ko.observable( this.filteredRecords()[0] );
	var currentPlace = this.filteredRecords()[0];
	var new_marker = currentPlace.marker;
	loadYelpContent(currentPlace);
	infoWindow.open(map,new_marker);
	animateMarker(new_marker);

	// respond to clicks from the list
    this.registerClick = function(that, clickedPlace) {
		var new_marker = clickedPlace.marker;
		loadYelpContent(clickedPlace);
		infoWindow.open(map,new_marker);
		animateMarker(new_marker);
		that.currentSelected(clickedPlace.name);
	};
	 
}

// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
	// Make sure the map bounds get updated on page resize
	map.fitBounds(mapBounds);
});
/*
* Open the drawer when the menu ison is clicked.
*/
var menu = document.querySelector('#menu');
var main = document.querySelector('main');
var drawer = document.querySelector('#drawer');

menu.addEventListener('click', function(e) {
	drawer.classList.toggle('open');
	e.stopPropagation();
});
main.addEventListener('click', function() {
	drawer.classList.remove('open');
});
	  

	  
	  