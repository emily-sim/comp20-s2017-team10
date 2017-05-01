//var user_id;
var tracks = [];
var albumcovers = [];
var artists = [];
var demos = [];
var answers = [];
var correct_answer;
var score = 0;
var counter = 0;
var gameOver = false;
var offset;
var genre;
var trackdata;
var endgame_timeout;

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
    console.log("score is " + score);
    document.getElementById("final-score-display").innerHTML = "Final Score: " + score;
    $('#game-play-wrapper').hide();
    $('#game-over-wrapper').show();
}

function addPlayedSongs() {
    var tableBody = $('#played-songs tbody');
    var tr = $('<tr><td class="song"></td><td class="artist"></td></tr>').appendTo(tableBody);
    console.log("correct answer in addPlayedSongs " + correct_answer);
    console.log(tracks[correct_answer]);
    tr.find("td.song").text(tracks[correct_answer]);
    tr.find("td.artist").text(artists[correct_answer]);
}

function sendScore() {
    // send back end game score to database
    var request = new XMLHttpRequest();
    request.open("POST", url, true);
    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            request.send();
        } // else -- handle errors
    }
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
        score += 1;
    }

    scoreDisplay.innerHTML = "Score: " + score;

    document.getElementById("btn0").disabled = true;
    document.getElementById("btn1").disabled = true;
    document.getElementById("btn2").disabled = true;
    document.getElementById("btn3").disabled = true;
};

function endButton() {
    counter = 10;
    document.getElementById("media").src = "";
    addPlayedSongs();
    // clearTimeout(endgame_timeout);
    renderFinalPg();
}

/* used in sidebar.js */
function returnScore() {
    return score;
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
