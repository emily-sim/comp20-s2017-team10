var tracks = [];
var albumcovers = [];
var demos = [];
var answers = [];

    function spotifyRequest(url) {

        var request = new XMLHttpRequest();
        request.open("GET", url, true);
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        request.send();
        request.onreadystatechange = function() {
            if (request.readyState === 4 && request.status === 200) {
                var data = JSON.parse(request.responseText);  
                storeData(data);                
            } // else -- handle errors
        }

    }

    function storeData(data) {
      for (var i = 0; i < 4; i++) {
        tracks[i] = data.tracks.items[i].name;
        // 300px x 300px on API
        albumcovers[i] = data.tracks.items[i].album.images[1].url;
        demos[i] = data.tracks.items[i].preview_url;
        console.log("from spotify request: " + tracks[i] + " " + albumcovers[i] + " " + demos[i]);
      }  
    }

    function loadPlaylist() {
        var queryString = window.location.search;
        queryString = queryString.substring(1);

        var genre = queryString.split('=');

        console.log("GENRE: " + genre[1]);

        if (genre[1] === 'pop') {
            var data = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Apop&type=track&market=US&limit=4"); 
        } else if (genre[1] === 'hiphop') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Ahip-hop&type=track&market=US&limit=4");

        } else if (genre[1] === 'punkrock') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Apunk&type=track&market=US&limit=4");

            console.log("in load playlist" + tracks);

            var tracksJSON = JSON.parse(tracks);
            //tracks.JSON.

        } else if (genre[1] === 'r&b') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3AR%26B&type=track&market=US&limit=4");

        } else if (genre[1] === 'electronic') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Aelectronic&type=track&market=US&limit=4");

        } else if (genre[1] === 'country') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Acountry&type=track&market=US&limit=4");

        } else if (genre[1] === 'latin') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Alatin&type=track&market=US&limit=4");

        } else if (genre[1] === 'rock') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Arock&type=track&market=US&limit=4");

        } else if (genre[1] === 'indie') {

            var tracks = spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Aindiepop&type=track&market=US&limit=4");

        }

        /* call function to start timer */
        move();
    }

    function move() {
        var elem = document.getElementById("bar");
        var time = document.getElementById("time");
        var width = 0;
        var id = setInterval(frame, 300);

        function frame() {
            if (width >= 100) {
                time.innerHTML = "Time's up!";
                //function move();

                clearInterval(id);

            } else {
                width++;
                elem.style.width = width + '%';
                if (width % 3 == 0) {
                    /****this is counting too fast*******/
                    time.innerHTML = (30 - width / 3) + ' s';
                }

                /* when width == 100 restart timer, start playing next song clip, reset multiple choice buttons */
                /* can you just call the move func again does it do weird returns like recursion */

            }
        }
    }


    var score = 0;

    function updateScore() {
        var scoreDisplay = document.getElementById("score-display");

        /************************************/
        /* check if answer is correct first */
        /* if correct -- a "correct!" message?, add to score, stop timer, go to next song which resets timer and buttons */

        /* add 1 to score, maybe more if got it with less time? */
        score += 1;
        scoreDisplay.innerHTML = "Score: " + score;
    };
