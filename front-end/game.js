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
      updateChoices();
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
      var user_id = 135   // hard coded for now
      var highscore = getUserInfo(user_id);
      var count = 10;

      while (count > 0) {
        //play song  http://html.com/attributes/audio-src/

      }
    }

    function updateChoices() {
      var img_src = albumcovers[0]
      document.getElementById("button-album-cover-1").src=img_src;
      img_src = albumcovers[1]
      document.getElementById("button-album-cover-2").src=img_src;
      img_src = albumcovers[2]
      document.getElementById("button-album-cover-3").src=img_src;
      img_src = albumcovers[3]
      document.getElementById("button-album-cover-4").src=img_src;
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

    function loadPlaylist() {
        var queryString = window.location.search;
        queryString = queryString.substring(1);

        var genre = queryString.split('=');

        console.log("GENRE: " + genre[1]);

        if (genre[1] === 'pop') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Apop&type=track&market=US&limit=4"); 
          
        } else if (genre[1] === 'hiphop') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Ahip-hop&type=track&market=US&limit=4");

        } else if (genre[1] === 'punkrock') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Apunk&type=track&market=US&limit=4");

        } else if (genre[1] === 'r&b') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3AR%26B&type=track&market=US&limit=4");

        } else if (genre[1] === 'electronic') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Aelectronic&type=track&market=US&limit=4");

        } else if (genre[1] === 'country') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Acountry&type=track&market=US&limit=4");

        } else if (genre[1] === 'latin') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Alatin&type=track&market=US&limit=4");

        } else if (genre[1] === 'rock') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Arock&type=track&market=US&limit=4");

        } else if (genre[1] === 'indie') {
          spotifyRequest("https://api.spotify.com/v1/search?q=genre%3Aindiepop&type=track&market=US&limit=4");

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
