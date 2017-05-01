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
          var url = "https://musicguessing.herokuapp.com/user";
          var params = "userid=" + response.id;
          oReq.open("POST",url,true);
          oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          oReq.send(params);
          oReq.onreadystatechange = function(){
            if(oReq.readyState === 4 && oReq.status === 200){
              var resp = oReq.responseText;
              resp = (JSON.parse(resp));
              console.log(resp);
              console.log(resp.player[0].score);
              scoreLabel.innerHTML = resp.player[0].score;
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
