 // This is called with the results from from FB.getLoginStatus().
  function statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    if (response.status === 'connected') {
      // Logged into your app and Facebook.
      testAPI();



// TEST DATA
// Uploading to the database
// currently sending id and last name
      console.log("testing");
        FB.api (
        '/me', {fields: "last_name"},
        function (response) {
          console.log("inside function");
          console.log(response);
          if (response && !response.error) {
            var oReq = new XMLHttpRequest();
            var url = "https://musicguess.herokuapp.com";
         //   var params = "user-id=" + response.id;
            console.log("RESPONSE THING BEING CHECKED");
            console.log(response);

            var oReq = new XMLHttpRequest();
 //           var url = "https://musicguess.herokuapp.com/submit";
            var url = "http://localhost:5000/submit"
            var params = "userid=" + response.id + "&username=" + response.last_name;
            oReq.open("POST", url, true);
            oReq.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            oReq.send(params);
            console.log(response.id);
            console.log("Should have just sent the request");
            oReq.onreadystatechange = function(){
              console.log("Changing state");
              if(oReq.readyState === 4 && oReq.status === 200){
                var resp = oReq.responseText;
                resp = (JSON.parse(resp));
                console.log(resp);
              }
            }

          }
        }
        );

    } else {
      // The person is not logged into your app or we are unable to tell.
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }


  }

  // This function is called when someone finishes with the Login
  // Button.  See the onlogin handler attached to it in the sample
  // code below.
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

  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  //
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  //
  // These three cases are handled in the callback function.

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
