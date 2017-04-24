var geocoder;
var returnLocation;

//Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    console.log(1);
    codeLatLng(lat, lng, changeLocLabel);
}

function errorFunction() {
    console.log("error");
    alert("Geocoder failed");
}

function initializeLocation() {
    console.log(3);
    geocoder = new google.maps.Geocoder();
    if (navigator.geolocation) {
        // console.log("successful geolocation");
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
}

function changeLocLabel(locationString){
  console.log("callback called")
  var locationLabel = document.getElementById("location");
  locationLabel.innerHTML = returnLocation;
}

function codeLatLng(lat, lng, callback) {

    console.log(4);

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // console.log(results)
            if (results[1]) {
                //formatted address
                // alert(results[0].formatted_address)
                //find country name
                for (var i = 0; i < results[0].address_components.length; i++) {
                    for (var b = 0; b < results[0].address_components[i].types.length; b++) {

                        //there are different types that might hold a city admin_area_lvl_1 usually does in come cases looking for sublocality type will be more appropriate
                        if (results[0].address_components[i].types[b] == "administrative_area_level_1") {
                            //this is the object you are looking for
                            state = results[0].address_components[i];
                        }
                        if (results[0].address_components[i].types[b] == "country") {
                            country = results[0].address_components[i];
                            break;
                        }
                    }
                }
                //city data
                returnLocation = state.short_name + ", " + country.long_name;
                callback(returnLocation);
                // console.log(userLocation);
                // alert("Your location: " + state.short_name + ", " + country.long_name);

            } else {
                // alert("No results found");
            }
        } else {
            // alert("Geocoder failed due to: " + status);
        }
    });
}
