//var user_id;
var tracks = [];
var albumcovers = [];
var artists = [];
var demos = [];
var answers = [];
var correct_answer;
var myscore = 0;
var counter = 0;
var gameOver = false;
var offset;
var genre;
var trackdata;
var endgame_timeout;
var runningScore;

function spotifyRequest(url) {
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            var data = JSON.parse(request.responseText);
            storeTrackData(data);
        } // else -- handle errors
    }
}

function storeTrackData(data) {
    trackdata = data.tracks;
    for (var i = 0; i < 4; i++) {
        tracks[i] = data.tracks.items[i].name;
        albumcovers[i] = data.tracks.items[i].album.images[1].url;
        demos[i] = data.tracks.items[i].preview_url;
        // console.log(data.tracks.items[i].album.artists[0].name);
        artists[i] = data.tracks.items[i].album.artists[0].name;
        // console.log("from spotify request: " + tracks[i] + " " + albumcovers[i] + " " + demos[i]);
    }
    correct_answer = getRandomArbitrary(0, 4); //min inclusive, max exclusive
    // checks if demo uri exists
    if (demos[correct_answer] == null) {
        if (correct_answer == '3') {
            correct_answer--;
        } else {
            correct_answer++;
        }
    }
    updatePage();
}

function runGame() {
    // FIX LATER WITH NEW POST UER FUNCTION
    $('#game-play-wrapper').show();
    $('#game-over-wrapper').hide();

    $('#media').hide();


    
    var user_id = 135;
    offset = getRandomArbitrary(0, 50);
    genre = getQuery();
    gameLoop();
    endgame_timeout = window.setTimeout(renderFinalPg, 150000);
}

function gameLoop() {
    if (counter < 10) {
        startTimer();
        enableBtns();
        loadPlaylist(genre, offset); // makes request, stores data into array, updates choices
        counter++;
        offset = offset + 4;
        addPlayedSongs();
        console.log(counter);
        console.log(offset);
        window.setTimeout(gameLoop, 15000);
    }
}

function renderFinalPg() {
    gameOver = true;
    console.log("score is " + myscore);
    sendScore();
    addPlayedSongs();

    document.getElementById("media").src = "";
    document.getElementById("final-score-display").innerHTML = "Final Score: " + myscore;
    $('#game-play-wrapper').hide();
    $('#game-over-wrapper').show();
    $('#media').hide();
}

function addPlayedSongs() {
    var tableBody = $('#played-songs tbody');
    var tr = $('<tr><td class="song"></td><td class="artist"></td></tr>').appendTo(tableBody);
    tr.find("td.song").text(tracks[correct_answer]);
    tr.find("td.artist").text(artists[correct_answer]);
}

function sendScore() {
    // send back end game score to database
    FB.getLoginStatus(function(response) {
      console.log("Inside check");
      console.log(response);
      if (response.status === 'connected') {
        var oReq = new XMLHttpRequest();
        var url = "https://musicguessing.herokuapp.com/endRound";
        var newScore = myscore + runningScore;
        var params = "userid=" + response.authResponse.userID+ "&score=" + newScore;
//        console.log(response.id);
        oReq.open("POST",url,true);
        oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        oReq.send(params);
        oReq.onreadystatechange = function(){
          if(oReq.readyState === 4 && oReq.status === 200){
            console.log("Updating score");
            var resp = oReq.responseText;
            resp = (JSON.parse(resp));
            console.log(resp);
          }
      }
    }
});
}

function startTimer() {
    times_up = false;
    var elem = document.getElementById("bar");
    //var time = document.getElementById("timer");
    var width = 0;
    var id = setInterval(frame, 150);

    function frame() {
        if (width >= 100) {
            //time.innerHTML = "Time's up!";
            //times_up = true;
            clearInterval(id);

        } else {
            width++;
            elem.style.width = width + '%';
        }
    }
}

function enableBtns() {
    document.getElementById("btn0").disabled = false;
    document.getElementById("btn1").disabled = false;
    document.getElementById("btn2").disabled = false;
    document.getElementById("btn3").disabled = false;
}


function updateScore(button_num) {
    console.log("update score is called!");

    var scoreDisplay = document.getElementById("score-display");

    if (button_num == correct_answer) {
        myscore += 1;
    }

    scoreDisplay.innerHTML = "Score: " + myscore;

    document.getElementById("btn0").disabled = true;
    document.getElementById("btn1").disabled = true;
    document.getElementById("btn2").disabled = true;
    document.getElementById("btn3").disabled = true;
};

function endButton() {
    counter = 10;
    //document.getElementById("media").src = "";
    addPlayedSongs();
    // clearTimeout(endgame_timeout);
    renderFinalPg();
}

/* used in sidebar.js */
function returnScore() {
    return myscore;
}

function getRandomArbitrary(min, max) {
    var num = Math.random() * (max - min) + min;
    num = Math.floor(num);
    return num;
}

function updatePage() {
    /* update MC */
    var img_src = albumcovers[0]
    document.getElementById("button-album-cover-0").src = img_src;
    img_src = albumcovers[1]
    document.getElementById("button-album-cover-1").src = img_src;
    img_src = albumcovers[2]
    document.getElementById("button-album-cover-2").src = img_src;
    img_src = albumcovers[3]
    document.getElementById("button-album-cover-3").src = img_src;

    document.getElementById("button-song-name-0").innerHTML = tracks[0];
    document.getElementById("button-song-name-1").innerHTML = tracks[1];
    document.getElementById("button-song-name-2").innerHTML = tracks[2];
    document.getElementById("button-song-name-3").innerHTML = tracks[3];

    /* play music */
    var demo_track = demos[correct_answer];
    document.getElementById("media").src = demo_track;
}

function getUserInfo(id) {
    var request = new XMLHttpRequest();
    request.open("GET", "http://musicguessing.herokuapp.com/user", true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            // returns player.cursor?
            var data = JSON.parse(request.responseText);
        } // else -- handle errors
    }
}

function getQuery() {
    var queryString = window.location.search;
    queryString = queryString.substring(1);
    var genre = queryString.split('=');
    return genre[1];
}

function loadPlaylist(genre, offset) {
    spotifyRequest("https://api.spotify.com/v1/search?q=genre%3A" + genre + "&type=track&market=US&limit=4&offset=" + offset);
}













/*
START OF FACEBOOK SDK SECTION
*/

// This is called with the results from from FB.getLoginStatus().


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
        console.log("Inside FB API function");
        console.log(response);
        if (response && !response.error) {
          var name = response.first_name + " " + response.last_name;
          nameLabel.innerHTML = name;
          var oReq = new XMLHttpRequest();
          var url = "https://musicguessing.herokuapp.com/username";
          var params = "userid=" + response.id + "&username=" + name;
          console.log(params);
          oReq.open("POST",url,true);
          oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          oReq.send(params);
          oReq.onreadystatechange = function(){
            if(oReq.readyState === 4 && oReq.status === 200){
              var resp = oReq.responseText;
              resp = (JSON.parse(resp));
              console.log(resp);
              console.log(resp.players[0].score);
              if(resp.players[0].score == null || isNaN(resp.players[0].score)) {
                scoreLabel.innerHTML = 0;
                runningScore = 0;
              }else {
              scoreLabel.innerHTML = resp.players[0].score;
              runningScore = resp.players[0].score;
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
    console.log("Not logged in");
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
    console.log(1);
    console.log(lat);
    console.log(lng);
    FB.getLoginStatus(function(response) {
      console.log("Inside check");
      console.log(response);
      if (response.status === 'connected') {
        var oReq = new XMLHttpRequest();
        var url = "https://musicguessing.herokuapp.com/newLoc";
        var params = "userid=" + response.authResponse.userID+ "&lat=" + lat + "&lng=" + lng;
//        console.log(response.id);
        oReq.open("POST",url,true);
        oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        oReq.send(params);
        oReq.onreadystatechange = function(){
          if(oReq.readyState === 4 && oReq.status === 200){
            console.log("Should have changed");
            var resp = oReq.responseText;
            resp = (JSON.parse(resp));
            console.log(resp);
          }
      }
    }
});
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
