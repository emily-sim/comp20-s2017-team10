// This is called with the results from from FB.getLoginStatus().

var geocoder = new google.maps.Geocoder();
function statusChangeCallback(response) {
  var loginButton = document.getElementById("loginButton");
  var logoutButton = document.getElementById("logoutButton");
  var profilePic = document.getElementById("profile");
  var nameLabel = document.getElementById("name");
  var scoreLabel = document.getElementById("score");


  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    logoutButton.style.visibility = "visible";
    loginButton.style.visibility = "hidden";

      FB.api (
      '/me', {fields: "first_name, last_name"},
      function (response) {
        if (response && !response.error) {
          var name = response.first_name + " " + response.last_name;
          nameLabel.innerHTML = name;
          var oReq = new XMLHttpRequest();
          var url = "https://musicguessing.herokuapp.com/username";
          var params = "userid=" + response.id + "&username=" + name;
          oReq.open("POST",url,true);
          oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          oReq.send(params);
          oReq.onreadystatechange = function(){
            if(oReq.readyState === 4 && oReq.status === 200){
              var resp = oReq.responseText;
              resp = (JSON.parse(resp));

              if(resp.players[0].score == null || isNaN(resp.players[0].score)) {
                scoreLabel.innerHTML = 0;
              }else {
              scoreLabel.innerHTML = resp.players[0].score;
            }

              }
          }

        }
      }
      );

      /* make the API call */
      FB.api(
          "/me/picture?type=large",
          function (response) {
            if (response && !response.error) {
                profilePic.src = response.data.url;
            }
          }
      );

  } else {
    loginButton.style.visibility = "visible";
    logoutButton.style.visibility = "hidden";
    nameLabel.innerHTML = "Guest";
    profilePic.src = "images/guest.png";
    scoreLabel.innerHTML = 0;
  }
}


function fblogin(){
  FB.login(function(response){
    statusChangeCallback(response);
  });
}

function fblogout(){
FB.logout(function(response){
  statusChangeCallback(response);
  });
}
// This function is called when someone finishes with the Login
// Button.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}

window.fbAsyncInit = function() {
FB.init({
  appId      : '839801796183910',
  cookie     : true,  // enable cookies to allow the server to access
                      // the session
  xfbml      : true,  // parse social plugins on this page
  version    : 'v2.8' // use graph api version 2.8
});

// Gets the state of the person visiting this page and can return one
// of three states to the callback you provide.
FB.getLoginStatus(function(response) {
  statusChangeCallback(response);
});

};

// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/*
Geolocaiton portion of the code
Was once contained in sidebar.js
*/
var geocoder;
var returnLocation;

//Get the latitude and the longitude;
function successFunction(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    FB.getLoginStatus(function(response) {

      if (response.status === 'connected') {
        var oReq = new XMLHttpRequest();
        var url = "https://musicguessing.herokuapp.com/newLoc";
        var params = "userid=" + response.authResponse.userID+ "&lat=" + lat + "&lng=" + lng;
        oReq.open("POST",url,true);
        oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        oReq.send(params);
        oReq.onreadystatechange = function(){
          if(oReq.readyState === 4 && oReq.status === 200){
            var resp = oReq.responseText;
            resp = (JSON.parse(resp));
          }
      }
    }
});
codeLatLng(lat, lng, changeLocLabel);
}

function errorFunction() {
    alert("Geocoder failed");
}

function initializeLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
    }
}


function returnLoc(loc){
  return loc;
}


function changeLocLabel(locationString){
  var locationLabel = document.getElementById("location");
  locationLabel.innerHTML = returnLocation;
}

function codeLatLng(lat, lng, callback) {

    var latlng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({ 'latLng': latlng }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[1]) {
                //formatted address
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

            } else {
                // alert("No results found");
            }
        } else {
            // alert("Geocoder failed due to: " + status);
        }
    });
}
