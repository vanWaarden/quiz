// const in lower case because the variable identifier cannot be reassigned but the references may change

// to display the question and ensuring the right answer to the right question
const question = document.getElementById("question");

// to display the possible answers per question in each of the four possible choice text paragraphs:
const choices = Array.from(document.getElementsByClassName("choice__text"));

// to keep track of which question of the total number of questions is being displayed:
const questionCounterText = document.getElementById("questionCounter");

// to keep track of the user's score per question:
const scoreText = document.getElementById("score");

// while all the questions will be loaded, a loader gets displayed:
const loader = document.getElementById("loader");

// to be able to add or remove the classList 'hidden': 
const game = document.getElementById("game");

// keeps track of every second per question:
const counter = document.getElementById("counter");

// to be able to fill the btimeGauge by 1/10 of its total width (of 150px) per second up to full width at 10 seconds (when time is up to answer the question):
let timeGauge = document.getElementById("timeGauge");

// constants in capital letters because the variable and its properties will not change
// to add 1/5 (20%) of the total 5 questions for every question that is answered correctly.
const CORRECT_BONUS = 20; 

// maximum of 5 questions will be displayed (even if there are more questions available in the questions.json file):
const MAX_QUESTIONS = 5; 

// to store the fetched questions data from the questions.json file in this array:
let questions= []; 

// each question is an object with the question, the answers to choose and which answer is correct
let currentQuestion = {}; 

// array of questions that are still left to be answered
let availableQuestions = []; 

// so users cannot answer questions before all questions are loaded.
let acceptingAnswers = false; 

// questions begins at 0
let questionCounter = 0; 

// for every new question the time starts at 0:
let count = 0; 

// 10 sec per question: 
const questionTime = 10;

// 150 px width is the time gauge:
const gaugeWidth = 150; 

// will fill the time gauge by 1/10 of its total width per second up to full width of 10 seconds per question:
const gaugeUnit = gaugeWidth / questionTime; 

// to set interval and call renderCounter() function every 1 sec: 
let timer; 

// score begins at 0
let score = 0; 

// if someone chooses the correct answer, they will hear a certain sound that shows that
const correct = new Audio("sounds/correct.mp3");

// if someone chooses the incorrect answer, they will hear a certain sound that shows that
const incorrect = new Audio("sounds/incorrect.mp3");

// First: fetch the questions from the JSON file (so from local storage) into the application
// Second: after the questions are fetched, the game is ready to start so the startGame function gets called

// uses the fetch api and fetches the questions from the json file: 
fetch("questions.json")
    .then(res =>{
        return res.json();
    })
    .then(loadedQuestions =>{
        console.log(loadedQuestions); // to check the questions in the console
        questions = loadedQuestions;
        startGame(); // once the questions are loaded, startGame function gets called
    })
    .catch(err =>{ // when something goes wrong with loading the questions, an error will be displayed in the console:
    console.log(err);
});

/* Third: startGame function
* to start the game appropriatly the startGame function must have the correct initial values:
* questionCounter starts from 0
* score starts from 0
* all the questions from the questions.JSON file have to be added to the availableQuestions array
* then the function getNewQuestion() gets called to provide the game with a random question from the availableQuestions array
* when the first random question is provided by the getNewQuestion function the 'hidden' class that is applied to the 'game' section will be removed so the questions and answers can be seen by the user. And will be applied to the loader so that instead of the loader, the game is now shown
* now the function renderCounter needs to be called to start the time a user has to answer a question (per question)
* and the timer needs to be set to the value that renderCounter() gets cakled every second
*/
startGame = () =>{
    questionCounter = 0; // to start with the first question
    score = 0; // score will be set to 0
    availableQuestions = [...questions]; // at the start of the game, all the questions data from the questions array (so all the questions available) are set equal to availableQuestions array. (From the second question, every question that has already been randomly picked will be taken from the availableQuestions array and the remaining quiz questions will be chosen from the availableQuestions array. This way, duplicates are prevented (this is arranged in the getNewQuestion function))
    getNewQuestion(); // getNewQuestion() function gets called
    // when sure the questions are loaded, the loader gets hidden and the questions will be displayed:
    game.classList.remove('hidden');
    loader.classList.add('hidden'); 
    renderCounter(); // function renderCounter() gets called so that the 10 seconds (time per question) start running
    timer = setInterval(renderCounter, 1000); // timer will call renderCounter() every 1 sec. 
};

/* Fourth: the renderCounter function
* a user has 10 seconds to answer a question. As long as this time runs, the timeGauge must be further filled every second with 1/10 of 150px. In this way the user can see how much time there is left
* When the user ran out of time or answered a question whithin the time and there are still questions in the availableQuestions array and the maximum questions to be answered per quiz has not yet been reached, the next question has to be displayed. 
* For that the getNewQuestion() function needs to get called
* and the gauge unit has to start over again (so called as well)
*/
function renderCounter(){
    // as long as the time per question is less than or equal to 10 seconds, the timeGauge is further filled by 1/10 every second:
    if(count <= questionTime){ 
        timeGauge.style.width = count * gaugeUnit + "px" ;
        count++;
    } else {
        // if a user did not answer the question whithin 10 seconds and there are still questions left to be answered: 
        count = 0;
        if(currentQuestion < availableQuestions.length || MAX_QUESTIONS){
            currentQuestion++; //  the next question has to be displayed
            getNewQuestion(); // new question has to be rendered
            renderCounter(); // and renderCounter has to start over again from 0 (empty)
        }
    }
}

/* Fifth: getNewQuestion needs to be created
 * All necessary thinking steps and explanations can be found below
 */
getNewQuestion = () => { 
    // If there aren't any questions left to display or the maximum amount of questions that will be displayed are reached, 
    if(availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS){
        
        // save the score of a player in LocalStorage 
        localStorage.setItem('mostRecentScore', score);

        // and redirect the player to the end page:
        return window.location.assign('https://vanwaarden.github.io/quiz/end.html');
    } // else, go to the next question:
    questionCounter++;
    // and show the user at which question of the total number of questions he/she is:
    questionCounterText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    
    /* select a new question randomly from the maximum number of questions by picking a random number from 0 to maximun questions available in the availableQuestions array and store this number as the questionIndex. Math.floor is used because it rounds down and index starts at 0. So if there are 5 questions in the availableQuestions array, the fifth question has an index of 4
    Also the random picked index number can only be a whole number:
    */
    const questionIndex = Math.floor(Math.random() * availableQuestions.length);

    // set value of currentQuestion object equal to the value belonging to this random generated questionIndex from the availableQuestions array of objects:
    currentQuestion = availableQuestions[questionIndex];
    // console.log(currentQuestion); // to check if it gets generated correctly

    // set the inner text (content) of the html question item equal to that of the value of the question property from the currentQuestion object:
    question.innerText = currentQuestion.question;

    // and show the correct answer options that go with this question:
    // in the questions.json file, the 
    choices.forEach( choice =>{
        // for every choice, every html choice element's data number is set equal to corresponding choice option with this number in the currentQuestion object:
        const number = choice.dataset["number"]; 
        // to display the correct multiple choice options at the right position for the current question:
        choice.innerText = currentQuestion["choice" + number]; 
    });

    // From the second question, every question that has already been randomly picked will be taken from the availableQuestions array and the remaining quiz questions will be chosen from the availableQuestions array. This way, duplicates are prevented. 
    availableQuestions.splice(questionIndex, 1); // questionIndex tells the position where to start from and number of questions that have to be removed is 1: 

    // once the (new) question with the correct answer options are generated and will be correctly displayed to the user, users are now allowed to answer the questions:
    acceptingAnswers = true;
};

/* Sixth: For each answer option, it must be noted whether the user chooses this answer and whether the user has chosen the correct or incorrect answer. Once a user has chosen an answer, he or she will immediately receive feedback whether the answer was correct or incorrect. If it was wrong, the chosen answer field will turn red, if it was correct the chosen asnwer field will turn 'green'. The rest of the steps of my thinking process you can read below
*/

choices.forEach(choice =>{
    // graps each choice option, adds eventlistener, takes click event as its argument to get a reference to each choice the user clicks:
    choice.addEventListener('click', e =>{
        // if users are not allowed to click yet, the fact they clicked on it gets ignored:
        if(!acceptingAnswers) return; // if not acceptingAnswers is true, return. 
        acceptingAnswers = false; // else, 
        const selectedChoice = e.target; // e.target returns which html element with class choice__text, has been clicked 
        console.log(selectedChoice);
        const selectedAnswer = selectedChoice.dataset["number"]; // returns wich data-number belongs to the selectedChoice
        console.log(selectedAnswer);
       
        let selectedAnswerInt = parseInt(selectedAnswer); // to convert the html string number to number
        
        // based on user input, correct or incorrect class gets added. I use === because "number" is converted in a number and I want it to compare with a number. If selectedAnswer is the right answer, classToApply is the class 'choice--correct' (green overlay), else apply the class 'choice--incorrect' (red overlay):
        const classToApply = selectedAnswerInt === currentQuestion.answer? "choice--correct" : "choice--incorrect";
        // if the user answers the question correctly, the score will be incremented by 10 points:
        if(classToApply === "choice--correct"){
            incrementScore(CORRECT_BONUS); 
            correct.play();
        } else if (classToApply === "choice--incorrect") {
            incorrect.play();
        } 
        // applies the classToApply to the HTML parent (container) element of the choice thas has been selected by the user: 
        selectedChoice.parentElement.classList.add(classToApply);
        // adds a delay of 1 second before removing the class (otherwise it would hardly be visible):
        setTimeout( () => {
            selectedChoice.parentElement.classList.remove(classToApply);
            // count from 0, renderCounter() and getNewQuestion() all have to start at the same time once the delay of the applied class is removed:
            count = 0; 
            renderCounter();
            getNewQuestion();
        }, 1000); // 1 second delay
    });
});

/* Seventh: 
* every time a user answers a question correctly, his score must be increased by 10 points
incrementScore gets called in the function above with CORRECT_BONUS as an argument, so num is equal to CORRECT_BONUS. 
*/
incrementScore = num =>{ 
    score += num;
};
