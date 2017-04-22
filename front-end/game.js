var tracks = [];
var albumcovers = [];
var demos = [];
var answers = [];
var correct_answer;
var score = 0;
var counter = 0;
var clicked = false; 

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
  for (var i = 0; i < 4; i++) {
    tracks[i] = data.tracks.items[i].name;
    // img 300px x 300px on API
    albumcovers[i] = data.tracks.items[i].album.images[1].url;
    demos[i] = data.tracks.items[i].preview_url;
    console.log("from spotify request: " + tracks[i] + " " + albumcovers[i] + " " + demos[i]);
  }  
  updatePage();
}

    /*  client side:
     * 1) while loop for 10 songs for one round 
     * 2) load album covers into HTML http://stackoverflow.com/questions/554273/changing-the-image-source-using-jquery
     * 3) autoplay a random demo[] element
     * 4) keep track of user score
     * 5) keep track of album covers and song names of correct songs
     * 6) when round complete -- go to new static page displaying 5) and 4) 
     * server side:
     * 1) get request user info via \players
     * 2) send new high score back using post request \submit
    */
function runGame() {
  // FIX LATER WITH NEW POST UER FUNCTION
  var user_id = 135;   // hard coded for now
  //var highscore = getUserInfo(user_id);
  var offset = getRandomArbitrary(0, 50);
  var genre = getQuery();
  
  gameLoop(genre, offset);
  /*for (var i = 0; i < 9; i++) {
    setTimeout(gameLoop(genre, offset), 30000)
    offset = offset + 4; 
  }*/

  

}

function gameLoop(genre, offset) {
  if (counter < 10) {
    startTimer();
    correct_answer = getRandomArbitrary(0, 4);  // min inclusive, max exclusive
    loadPlaylist(genre, offset); // makes request, stores data into array, updates choices
    counter++;
    offset = offset + 4;
    console.log(counter);
    console.log(offset);
    setTimeout(gameLoop(genre, offset), 30000);
  }
}

function startTimer() {
  times_up = false;
  var elem = document.getElementById("bar");
  //var time = document.getElementById("timer");
  var width = 0;
  var id = setInterval(frame, 300);

  function frame() {
    if (width >= 100) {
      //time.innerHTML = "Time's up!";
      //times_up = true;
      clearInterval(id);

      } else {
        width++;
        elem.style.width = width + '%';
        //if (width % 3 == 0) {
          /****this is counting too fast*******/
          //time.innerHTML = (30 - width / 3) + ' s';
        //}
      }
    }
  }


function updateScore(button_num) {
  var scoreDisplay = document.getElementById("score-display");

  if (button_num == correct_answer && clicked == false) {
    clicked = true;
    score += 1;
  } 
  counter++;
  scoreDisplay.innerHTML = "Score: " + score;

  document.getElementById("btn0").disabled = true;
  document.getElementById("btn1").disabled = true;
  document.getElementById("btn2").disabled = true;
  document.getElementById("btn3").disabled = true;
};

function returnScore() {
  return score;
};

function getRandomArbitrary(min, max) {
  var num = Math.random() * (max - min) + min;
  num = Math.floor(num);
  return num;
}

function updatePage() {
  /* update MC */
  var img_src = albumcovers[0]
  document.getElementById("button-album-cover-0").src=img_src;
  img_src = albumcovers[1]
  document.getElementById("button-album-cover-1").src=img_src;
  img_src = albumcovers[2]
  document.getElementById("button-album-cover-2").src=img_src;
  img_src = albumcovers[3]
  document.getElementById("button-album-cover-3").src=img_src;

  /* not showing up currently */
  document.getElementById("button-song-name-0").innerHTML = tracks[0];
  document.getElementById("button-song-name-1").innerHTML = tracks[1];
  document.getElementById("button-song-name-2").innerHTML = tracks[2];
  document.getElementById("button-song-name-3").innerHTML = tracks[3];

  /* play music */
  var demo_track = demos[correct_answer];
  document.getElementById("media").src=demo_track;
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

function getQuery(){
  var queryString = window.location.search;
  queryString = queryString.substring(1);
  var genre = queryString.split('=');
  return genre[1];
}

function loadPlaylist(genre, offset) {
  spotifyRequest("https://api.spotify.com/v1/search?q=genre%3A" + genre + "&type=track&market=US&limit=4&offset=" + offset);
}
