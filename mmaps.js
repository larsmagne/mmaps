function initMap() {
  // Specify features and elements to define styles.
  var styleArray = [
    {
      featureType: "road",
      elementType: "all",
      stylers: [
	{ visibility: "off" }
      ]
    },{
      featureType: "administrative",
      elementType: "all",
      stylers: [
	{ visibility: "off" }
      ]
    },{
      featureType: "landscape.natural.terrain",
      elementType: "all",
      stylers: [
	{ visibility: "off" }
      ]
    },{
      featureType: "landscape.natural.landcover",
      elementType: "all",
      stylers: [
	{ visibility: "off" }
      ]
    },{
      featureType: "poi",
      elementType: "all",
      stylers: [
	{ visibility: "off" }
      ]
    },{
      featureType: "water",
      elementType: "labels",
      stylers: [
	{ visibility: "off" }
      ]
    },{
      featureType: "water",
      elementType: "all",
      stylers: [
	{ color: "#000000" }
      ]
    },{ 
      featureType: "landscape", 
      elementType: "geometry", 
      stylers: [ 
	{ color: "#000000" }
      ] 
    } 

  ];

  // Create a map object and specify the DOM element for display.
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 30, lng: 0},
    scrollwheel: false,
    // Apply the map style array to the map.
    styles: styleArray,
    zoom: 2,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControlOptions: { mapTypeIds: [] } 
  });
}

