
// to display the highest scores of the five best players
const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];

// go to and iterate trough each score and for each one of them, add an li to the ul. Exact usecase for map:
highScoresList.innerHTML = highScores
.map( score => {
    // this is printing out each li total
    return `<li class="section-highscores__list">${score.name}: ${score.score}%</li>`;
    // map takes an incoming array which is highScores and allows to convert each of those items to something new in a new array. Its taking in the score object and returning back a string version of a li that has the name and score in it. Since this is an array, it's possible to join all those elements in the array with an empty string 
})
.join("");