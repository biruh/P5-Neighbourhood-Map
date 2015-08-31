/* TO DO

Location = Geneva

Load the map
    - read google maps api
    - get the coordinates for Geneva

Load the locations
    - Where do I get those from? Do I have to search them myself and add them one by one to an array?
    - Populate the list
    - Add the pins on the map
    - Bind each location to a pin

Enable the search bar
    - filter list of locations
    - filter pins on the map

Add animation
    - bounce the pin
    - highlight the location item
    - pop-up more info


*** LATER ON ***
- Styling
- Make it responsive
- Allow chosing the city?

*/



/*
*
*   MODEL
*
*/

//Places of interest
var placesOfInterest = [
    {
        name: "Cathédrale de Saint-Pierre",
        pos: {lat: 46.201094, lng: 6.148642},
        map: map
    },
    {
        name: "Grand Théatre de Genève",
        pos: {lat: 46.201614, lng: 6.147087},
        map: map
    }

];

// Function to create KO observables for each place of interest
var Place = function(data) {

    this.name = ko.observable(data.name);
    this.pos = ko.observable(data.pos);
    this.map = ko.observable(data.map);
};




/*
*
*   View Model
*
*/

var ViewModel = function() {
    var self = this;

    // Create the map object and set the map's options (including the location)
    var map;
    var mapOptions = {
        draggable: false,
        center: {lat: 46.20381, lng: 6.139959}, // these are the coordinates for Geneva
        disableDefaultUI: true,
        zoom: 15
    };

    // Initialize the Google Map
    this.initMap = function() {
      map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }


    // create ko observables to hold the names of places
    this.places = ko.observableArray([]);

    placesOfInterest.forEach(function(placeObj) {
        self.places.push(  placeObj  );
    });

    // create ko observable to hold markers of places
    this.markerList = ko.observable([]);

    // Add markers for each place in the placesOfInterest
    this.addMarkers = function(places) {
        var i;

        for (i = 0; i < places.length; i++) {

            var marker = new google.maps.Marker({
                position: places[i].pos,
                map: map
            });

            var infowindow = new google.maps.InfoWindow({
                content: '<p>Marker Location:' + marker.getPosition() + '</p>'
            });

            google.maps.event.addListener(marker, 'click', function() {
                infowindow.open(map, marker);
            });

            // Add markert to observed list
            self.markerList().push(marker);
        };

    }


    this.visibleOrNot = ko.observable(true);

    // query is our search term
    this.query = ko.observable('');

    // Create search algorithm
    this.search = function(searchTerm) {
        // If the field is empty, shall all markers and places
        if (searchTerm != null) {
            // Loop through the places object and check for matches with the search term
            var i;
            for(i = 0; i < self.places().length; i++) {

                var placeName = self.places()[i].name; // ERROR! placeName is for some reason a function, not a string...
                placeName = placeName.toLowerCase();
                searchTerm = searchTerm.toLowerCase();

                if(placeName.indexOf(searchTerm) >= -0) {
                    console.log(placeName);
                }
            };
        }
    }




    // Monitor changes to the value of query and run search() whenever it changes
    this.query.subscribe(function(newValue) {
        self.search(newValue);
    });


    // The init function. Initialize the map, then the markers.
    this.init = function() {
        self.initMap();
        self.addMarkers(placesOfInterest);
    }

    // Set the magic free
    this.init();
}

var vm = new ViewModel;
ko.applyBindings(vm);
