let selectedWords = [];
let groupedWords = [];
let wordIndex = 0;
let listIsFull = false;
let overallScore = 0;
// let slotIndexes = []
// let slotNumber = 1;
let guesses = 4;
const groupCategoryContainer = document.querySelector('.category-container');


const guessesContainer = document.querySelector('.guesses-container');
function showGuesses(){
    for(let i=0; i < guesses; i++){
        console.log(guesses);
        //create guesses things
        const guessImg = document.createElement('div');
        guessImg.className = `guess${i}`;
        guessesContainer.appendChild(guessImg);

    }
}

function shuffle(grid) {
    let flatGrid = grid.flat();

    for (let i = flatGrid.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [flatGrid[i], flatGrid[j]] = [flatGrid[j], flatGrid[i]];
    }

    let rows = grid.length;
    let cols = grid[0] ? grid[0].length : 0;
    let shuffledGrid = [];

    for (let i = 0; i < rows; i++) {
        let start = i * cols;
        let end = start + cols;
        shuffledGrid.push(flatGrid.slice(start, end));
    }

    return shuffledGrid;
}
        
function displayWords(){
    let shuffledArray = shuffle(wordGroups);

    const groupContainer = document.querySelector('.word-group-container');

    shuffledArray.forEach((group, index) => {

        // create the answers and hide them
        const groupCategory = document.createElement('div');
        groupCategory.className = `group-title-${index}`;
        groupCategory.textContent = catagoryNames[index];
        // groupCategory.style.visibility = 'none';
        // groupCategory.style.height = '0px';

        // create sections of 4
        const wordGroup = document.createElement('div');
        wordGroup.className = 'group';

        group.forEach(word => {
            const wordButton = document.createElement('div');
            wordButton.className = 'word';
            wordButton.textContent = word;
            wordGroup.appendChild(wordButton);

            listIsFull = (selectedWords.length === 4) ? true : false; 

            wordButton.addEventListener('click', () => {
               if(!selectedWords.includes(wordButton.textContent)){
                    if(selectedWords.length === 4){ return; }
                    if(!wordButton.classList.contains('grouped')){ 
                        wordButton.classList.add('selected');
                        selectedWords.push(wordButton.textContent);
                    }
               }else{
                    wordButton.classList.remove('selected');
                    wordIndex = selectedWords.indexOf(wordButton.textContent);
                    selectedWords.splice(wordIndex, 1);
               }
            //    console.log(selectedWords)
            });
        });

        groupContainer.appendChild(wordGroup);
        groupCategoryContainer.appendChild(groupCategory);
    });
}

function checkAnswer(){
    if(selectedWords.length < 4){ 
        message.innerHTML = 'select 4 words';
        message.style.color = 'blue';
        return;
    }
    guesses--;

    // if each word has the same index of wordGroups[] then they match
    // check group index of each word
    // search through wordGroups to see if includes words
    // or compare arrays somehow within matrix
    let score = 0;
    for(let i=0; i<wordGroups.length; i++){
        // console.log('next group check', i);
        selectedWords.forEach(word => {
            if(wordGroups[i].includes(word)){
                score++;
                // console.log(word, score);
            }else{
                score = 0;
                // console.log('score:', score);
            }
        });
        if(score === 4){ 
            winCategory(i);
            break;
        }
        if(score === 3){ message.innerHTML = 'one away'; }
        else{
            message.innerHTML = 'incorrect';
            message.style.color = 'red';
            // showGuesses();// if remaking guess things
        }
    }
    // guesses--;
    document.querySelector(`.guess${guesses}`).style.backgroundColor  = 'red';

    if(guesses === 0){
        loseGame();
    }
}

function loseGame(){
    message.innerHTML = 'YOU LOSE';
    message.style.color = 'red';
    submitButton.setAttribute('disabled', true);
    clearButton.setAttribute('disabled', true);
}

function winCategory(categoryIndex){
    guesses++;
    message.innerHTML = 'correct!';
    message.style.color = 'green';
    score = 0;
    overallScore++;

    // set the word buttons as .grouped
    highlightCorrectWords(selectedWords, categoryIndex);
    
    // reveil category title
    document.querySelector(`.group-title-${categoryIndex}`).classList.add('expanded');
    unselectAllWords();

    // check if all categories are found
    if(overallScore === 4){
        message.innerHTML = 'you win!';
        message.style.color = 'lime';
        stopTimer();
    }
}

function unselectAllWords(){
    document.querySelectorAll('.word').forEach(word =>{
        word.classList.remove('selected');
        selectedWords = [];
    });
}

function highlightCorrectWords(words, category){
    words.forEach(word =>{
        // if button text matches word in selected array
        document.querySelectorAll('.word').forEach(button =>{
            if(button.textContent === word){
                // check which index it has from answers
                // assign color in switch
                switch(category){
                    case 0: button.classList.add('yellow'); break;
                    case 1: button.classList.add('red');    break;
                    case 2: button.classList.add('green');  break;
                    case 3: button.classList.add('blue');   break;
                }
                button.classList.add('grouped');
            }
        });
    });
}

// ---------------- buttons ----------------------

const message = document.querySelector('.message');
const submitButton = document.querySelector('.submit-button');
submitButton.addEventListener('click', () => checkAnswer());

const reloadButton = document.querySelector('.reset-button');
reloadButton.addEventListener('click', () =>{
    location.reload();
});

const clearButton = document.querySelector('.clear-button');
clearButton.addEventListener('click', () => {
    unselectAllWords();
    message.innerHTML = 'Find words that have something in common';
});

const pauseScreen = document.querySelector('.pause-container');
const pauseButton = document.querySelector('.pause-button');
pauseButton.addEventListener('click', () => {
    pauseScreen.classList.toggle('hidden');
    stopTimer();
});

const resumeButton = document.querySelector('.resume-button');
resumeButton.addEventListener('click', () => {
    pauseScreen.classList.toggle('hidden');
    startTimer();
});

// ---------------- begin game ----------------------


displayWords();
showGuesses();

// ---------------- timer ----------------------

let startTime;
let timerInterval;
let elapsedTime = 0;
const timerDisplay = document.querySelector('.timer');

startTimer();

function formatTime(ms) {
    let date = new Date(ms);
    let hours = date.getUTCHours().toString().padStart(2, '0');
    let minutes = date.getUTCMinutes().toString().padStart(2, '0');
    let seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    startTime = Date.now() - elapsedTime;
    timerInterval = setInterval(function() {
        elapsedTime = Date.now() - startTime;
        timerDisplay.textContent = formatTime(elapsedTime);
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    elapsedTime = 0;
    timerDisplay.textContent = '00:00:00';
}
