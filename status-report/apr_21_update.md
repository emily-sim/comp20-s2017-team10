April 21 Progress Update
Group 10
Members: Emily Sim, Sophia Wang, Maddie Payne, Ian Mao, Jose Lemus


#What we’ve done this week
- The game page dynamically updates random album covers and song names, 4 at a time, using Spotify API
- The game page plays the randomly selected demo url 
- Incrementing score based on what the “correct” answer is 
- The facebook login is now a popup linked to the bootstrap nav bar 
- Successfully made requests from the server side back-end files on heroku

#Problems we’ve encountered
- How to create the loop that will run the rounds of the game, calling the function to load the 30 sec music clip for each question, controlling the game flow



#What’s Next?
- Changing state for logged in versus not logged in. On all pages the sidebar needs to display your profile if logged in or if not clicking the side bar needs to bring up the facebook login page
- Back end for the sidebar still needs to be done, specifically linking a user’s high score to their database document
- The sidebar will display a user’s nearest major city using the Google Geocoder API. We need to link the user’s location to their account because if they are not logged in yet it probably shouldn’t display their location. We don’t necessarily need to link it but only display the location if the state is logged in.
- Having the game be able to run through all 10 questions

# Comments by Ming
* "Making Facebook login button look nice" => wouldn't focus on this as there isn't much you can reall do.
* "- Having the game be able to run through all 10 questions" => top priority
