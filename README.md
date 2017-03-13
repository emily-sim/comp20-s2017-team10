Project Proposal and Design Doc

Title: MIXR (subject to change) 

There aren’t many programs available for multiplayer song-guessing games. There also aren’t many ways for a user to explore or discover random music outside their usual favorite genres. 

Our website will offer a multiplayer and individual version of a song-guessing game. A user will hear a 30 second clip of an unknown song, then will be able to select from 4 multiple-choice options what they think the song is. Users will be able to brush up on their song knowledge, and hear clips of music that they’ve potentially never heard of before. Once the user has guessed their answer, the correct answer will be revealed, allowing them to use that information to find out more about the song or artist.

Features
- Login and password
- 4 multiple choice options for the artist and the song (each)
- A final score page once you exit the game
- A button to end the game at any time
- Limit on how many songs one can guess. Always 10 songs per round
- User is able to select a different genre for each round. 
- For each question there will be a song clip playing, which is the song the user will guess
- There is a leaderboard

Technologies and Ideas
Server Side Data Persistence: needing to store data that our game generates in the long term eg high scores from the beginning of time
Front end framework: bootstrap etc. 
RESTful API framework: without refreshing the page your data gets sent from the page etc. 
Reporting with charts and graphs: world map, where the users are from, high scores, user’s progress over time, checking regional times. 

We will be using and collecting:
- The user’s location
- The user’s genre preference
- Artist name and song name via the Spotify API (possibly the album artwork to display)
- User’s login info via Facebook API
- Collecting their answers to generate a final scores this will also be stored into a master database to generate a list of all-time high scores. 


Algorithms/Special Techniques
User interaction with game: we don’t want to regenerate the web page with each new question in the round. We need a while loop that will request however many songs from the Spotify API while the game is being played.

Electronic Mockups

#comments by Ming
* LOL, the previous team I just reviewed (team 9) also have a very similar idea. This is great. How sad no one even thought of this last semester.
