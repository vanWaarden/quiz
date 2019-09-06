
// to get a reference to the username. 
const username = document.getElementById("username");

// to enable and disable clicking on the saveScoreBtn (Only after username is typed in, the save button can be used):
const saveScoreBtn = document.getElementById("saveScoreBtn");

// get score value of mostRecentScore from LocalStorage (the getNewQuestion function in game.js ensured that each score achieved by a player is saved in localStorage under 'mostRecentScore')
const mostRecentScore = localStorage.getItem("mostRecentScore");

// to be able to show the user which score has been achieved:
const finalScore = document.getElementById("finalScore");

// The score is shown in the blank text field of the HTML element with id finalScore
finalScore.innerText = `${mostRecentScore}%`;

// a highscores array is created to sort, get, set, delete etc the data stored in LocalStorage under mostRecentScore. As long as no scores have been saved yet, it's an empty array:
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// only the score objects with the five highest scores will be saved
const MAX_HIGH_SCORES = 5;

// to share the score achieved by a user and challenge other people to play the quiz:
const shareText = document.getElementById("share");

// First: a score can only be saved if someone provides an username. As long as someone has not provided this, the saveScoreButton cannot be used.
username.addEventListener('keyup', () =>{
    console.log(username.value);
    saveScoreBtn.disabled = !username.value; // saveScoreBtn is disabled as long as value property of username is empty
});

// to capitalize the first letter of a username:
const capitalize = (s) => {
  if(typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
}

/* Second: in case that a user wants to save his/her score, a function is created to keep track of the scores achieved by a certain user. Only the score of the five best candidates is stored in LocalStorage. On the highscores page users can see if they belong to the 5 best players and if so, what position they have achieved. */
saveHighScore = e =>{
    
    e.preventDefault();

    // create score object so that for every score we remember which username achieved that score and what score was achieved:
    const score = {
        score: mostRecentScore,  // reference most recent score
        name: capitalize(username.value)  // reference to the user's name with first letter capitalized
    };
    // fill the highScores array with the score objects:
    highScores.push(score);
    // sort the score objects in the highscores array based on the value of their score property, from high to low:
    highScores.sort((a, b) => b.score - a.score); 
    // remove all objects after index 5 (incl) to keep only the score objects with the 5 highest scores:
    highScores.splice(5); 
    // Save highscores in local storage:
    localStorage.setItem("highScores", JSON.stringify(highScores));
    // when done with this, refresh the page:
    window.location.assign("https://vanwaarden.github.io/quiz/end.html");
};

/* Third: a function is needed to allow a user to share his / her score via twitter and email and to challenge other people to also play the quizcreate the links for twitter and email so users can share their scores and challenge other people to also take the quiz:
*/
createShareLinks = function(finalScore) {
    var url = "https://vanwaarden.github.io/quiz/";

    var emailLink =
      '<a class="btn btn--email" href="mailto:?subject=Try to beat my quiz score!&amp;body=I scored ' +
      finalScore + 
      "%25 on this General Knowledge quiz. Try to beat my score at&amp;hashtags=myQuiz&amp;url=" +
      url +
      '">Email your score</a>';

    var twitterLink =
    '<a class="btn btn--twitter" target="_blank" href="http://twitter.com/share?text=I scored ' +
    finalScore +
    "%25 on this General Knowledge quiz. Try to beat my score at&amp;hashtags=myQuiz&amp;url=" +
    url +
    '">Tweet your score</a>';

    var newMarkup = emailLink + twitterLink;

    shareText.outerHTML = newMarkup;
};

/* last: to display this function 
*/ 
createShareLinks(mostRecentScore);