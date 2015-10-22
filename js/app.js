var MapMarker = function MapMarker(name, lat, lon) {
  var self = this;
  this.name = ko.observable(name);
  //this.address = ko.observable(placeData.formatted_address);
  this.lat = ko.observable(lat);
  this.lon = ko.observable(lon);
 
  //this.name = ko.observable(name);
  //this.address = ko.observable(address);
  
  var bounds = window.mapBounds;
	 /*
	  // marker is an object with additional data about the pin for a single location
	  var marker = new google.maps.Marker({
		  map: map,
		  position: placeData.geometry.location,
		  title: placeData.name,
		  animation: google.maps.Animation.DROP
	  });
	  */
	  self.marker = new google.maps.Marker({
		  map: map,
		  position: new google.maps.LatLng(lat, lon),
		  title: name,
		  animation: google.maps.Animation.DROP
	  });
	  
	  //marker.addListener('click', toggleBounce);
	  
	  function toggleBounce() {
		  if (self.marker.getAnimation() !== null) {
			self.marker.setAnimation(null);
		  } else {
			self.marker.setAnimation(google.maps.Animation.BOUNCE);
		  }
	  }
	  /*
	  var infoWindow = new google.maps.InfoWindow({
		  content: placeData.name
	  });
	  */
	  self.contentString = '<div>'+name+'<br/>'+lat+'<br/>'+lon+'</div>';
	  /*
	  this.infoWindow = new google.maps.InfoWindow({
		  content: contentString
	  });
	  */
	  google.maps.event.addListener(self.marker, 'click', function() {
		infoWindow.setContent(self.contentString);
		infoWindow.open(map,self.marker);
		toggleBounce();
	  });
	  
	  // the reason multiple items are getting and staying selected
	  //this.currentSelected = ko.observable();
	 /* 
	  this.registerClick = function() {
		// do whatever
		infoWindow.open(map,marker);
		toggleBounce();
		this.currentSelected(this.name);
	  }
	  */
	/*  
	  currentSelected: ko.observable(),
	  selectItem: function (that, site) {
	    that.currentSelected(site.siteID);
	  }
	  */
	  this.isVisible = ko.observable(false);
/*
	  this.isVisible.subscribe(function(currentState) {
		if (currentState) {
		  this.marker.setMap(map);
		} else {
		  this.marker.setMap(null);
		}
	  });
*/	  
	  this.isVisible.subscribe(function(currentState) {
		if (currentState) {
		  self.marker.setMap(map);
		} else {
		  self.marker.setMap(null);
		}
	  });


	  this.isVisible(true);
	  
	  //bounds.extend(placeData.geometry.location);
	 //bounds.extend(new google.maps.LatLng(lat, lon));
	  // fit the map to the new marker
	 // map.fitBounds(bounds);
	  // center the map
	  //map.setCenter(bounds.getCenter());
 
}


var contentString, map, infoWindow;

  function googleSuccess() {
	    
	infoWindow = new google.maps.InfoWindow({
		  content: contentString
	});
	map = new google.maps.Map(document.getElementById('mapDiv'), {
		zoom: 11,
		center: {lat: 33.341389, lng: -105.666111},
		mapTypeId: google.maps.MapTypeId.ROADMAP	
	});
	
	ko.applyBindings(new PlacesViewModel());
  }
  
  function googleError() {
	alert("Google Maps Error");
  }
  
  var $yelpElem = $('#yelp-info');
  
  //var wikiUrl = 'https://en.wikipediaadfadf.org/w/api.php?action=opensearch&search='+city+'&format=json&callback=wikiCallback';
  
  var yelpUrl = 'https://api.yelp.com/v2/business/moisy-water-winery-ruidoso';
  
  function loadYelp() {
	
	var auth = {
		//
		// Update with your auth tokens.
		//
		consumerKey : "euBfBx5SQjHNAezR9xtXKg",
		consumerSecret : "JG53OZAb1zoDQfAGm7HQx8vAkwo",
		accessToken : "VRb4ue8gf9pHiN5A3NIuM3DcMH5JHLWm",
		// This example is a proof of concept, for how to use the Yelp v2 API with javascript.
		// You wouldn't actually want to expose your access token secret like this in a real application.
		accessTokenSecret : "uJJMS2g1BUZpy9bc-qH0pW_rHqo",
		serviceProvider : {
			signatureMethod : "HMAC-SHA1"
		}
	};

	//var terms = 'food';
	//var near = 'San+Francisco';

	var accessor = {
		consumerSecret : auth.consumerSecret,
		tokenSecret : auth.accessTokenSecret
	};
	parameters = [];
	//parameters.push(['term', terms]);
	//parameters.push(['location', near]);
	parameters.push(['callback', 'cb']);
	parameters.push(['oauth_consumer_key', auth.consumerKey]);
	parameters.push(['oauth_consumer_secret', auth.consumerSecret]);
	parameters.push(['oauth_token', auth.accessToken]);
	parameters.push(['oauth_signature_method', 'HMAC-SHA1']);

	var message = {
		'action' : 'https://api.yelp.com/v2/business/noisy-water-winery-ruidoso',
		'method' : 'GET',
		'parameters' : parameters
	};

	OAuth.setTimestampAndNonce(message);
	OAuth.SignatureMethod.sign(message, accessor);

	var parameterMap = OAuth.getParameterMap(message.parameters);
	parameterMap.oauth_signature = OAuth.percentEncode(parameterMap.oauth_signature)
	console.log(parameterMap);
	
	$.ajax({
		'url' : message.action,
		'data' : parameterMap,
		'cache' : true,
		'dataType' : 'jsonp',
		'jsonpCallback' : 'cb',
		'success' : function(data, textStats, XMLHttpRequest) {
			console.log(data);
			//$("body").append(output);
			var info = "<li>Telephone: "+data.display_phone+"</li>"
			var pic = "<li><img src='"+data.image_url+"'/></li>";
			$yelpElem.append(info+pic);
		}
	});
  };
	  
function PlacesViewModel () {
	console.log("ViewModel");
	var self = this;
	
	var placeList = ko.observableArray([
		new MapMarker('Noisy Water Winery','33.33138','-105.669602'),
		new MapMarker('Hubbard Museum of the American West','33.332302','-105.59623699999997'),
		new MapMarker('Spencer Theater for the Performing Arts','33.434','-105.60209299999997'),
		new MapMarker('Ski Apache','33.397343','-105.788771'),
		new MapMarker('Flying J Ranch','33.41421','-105.66796699999998')
	]);
	
	self.filterText  = ko.observable('');
	
	self.filteredRecords = ko.computed(function () {
		return ko.utils.arrayFilter(placeList(), function ( rec ) {
            var doesMatch = self.filterText ().length == 0 || rec.name().toLowerCase().indexOf(self.filterText ().toLowerCase()) > -1;
			
			rec.isVisible(doesMatch);
			
			return doesMatch;      
		});
	});
	
	// 	  this.currentSelected = ko.observable();
	//		want to set a location upon loading the app
	//  this Map Marker shud have the info window open
	this.currentSelected = ko.observable( this.filteredRecords()[0] );
	//this.currentSelected().infoWindow
	//google.maps.event.trigger(this.filteredRecords()[0], 'click');
	var currentPlace = this.filteredRecords()[0];
	infoWindow.setContent(currentPlace.contentString);
	infoWindow.open(map,currentPlace.marker);
	// undefined - probably since callback
	//currentPlace.infoWindow.open(map, currentPlace.marker);
	
	  this.registerClick = function(that, clickedPlace) {
		  // do i need to issue a click event
		 // google.maps.event.trigger(clickedPlace, 'click');
		//clickedPlace.infoWindow.open(map,clickedPlace.marker);
		infoWindow.setContent(clickedPlace.contentString);
		infoWindow.open(map,clickedPlace.marker);
		//toggleBounce();
		console.log("click me");
		that.currentSelected(clickedPlace.name);
	  }
	 
};
//ko.applyBindings(new PlacesViewModel());

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
	  

	  
	  