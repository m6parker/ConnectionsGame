const wordGroups = [
        ["apple", "banana", "cherry", "date"],
        ["cat", "dog", "bird", "fish"],
        ["red", "blue", "green", "yellow"],
        ["one", "two", "three", "four"]
    ];

let selectedWords = [];
let groupedWords = [];
let wordIndex = 0;
let listIsFull = false;
let overallScore = 0;
        
function displayWords(){
    const groupContainer = document.querySelector('.word-group-container');

    wordGroups.forEach((group, index) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';

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
                    wordButton.classList.add('selected');
                    selectedWords.push(wordButton.textContent);
               }else{
                    wordButton.classList.remove('selected');
                    wordIndex = selectedWords.indexOf(wordButton.textContent);
                    selectedWords.splice(wordIndex, 1);
               }
               console.log(selectedWords)
            });
        });

        groupDiv.appendChild(wordGroup);
        groupContainer.appendChild(groupDiv);
    });
}

function checkAnswer(){
    if(selectedWords.length < 4){ 
        message.innerHTML = 'select 4 words';
        return;
    }
    
    message.innerHTML = 'incorrect';

    // if each word has the same index of wordGroups[] then they match
    // check group index of each word
    // search through wordGroups to see if includes words
    // or compare arrays somehow within matrix
    let score = 0;
    for(let i=0; i<wordGroups.length; i++){
        console.log('next group check', i);
        selectedWords.forEach(word => {
            if(wordGroups[i].includes(word)){
                score++;
                console.log(word, score);
            }else{
                score = 0;
                console.log('score:', score);
            }
        });
        if(score === 4){ winCategory(); break; }
        if(score === 3){ message.innerHTML = 'one away'; } // todo finish
    }
}

function winCategory(){
    message.innerHTML = 'correct';
    score = 0;
    overallScore++;

    // set the word buttons as .grouped
    highlightCorrectWords(selectedWords);
    unselectAllWords();

    // check if all categories are found
    if(overallScore === 4){
        message.innerHTML = 'you win!';
    }
}

function unselectAllWords(){
    document.querySelectorAll('.word').forEach(word =>{
        word.classList.remove('selected');
        selectedWords = [];
    });
}

function highlightCorrectWords(words){
    words.forEach(word =>{
        // if button text matches word in selected array
        document.querySelectorAll('.word').forEach(button =>{
            if(button.textContent === word){
                button.classList.add('grouped');
            }
        });
    });
}

const submitButton = document.querySelector('.submit-button');
const message = document.querySelector('.message');
submitButton.addEventListener('click', () => checkAnswer());

const clearButton = document.querySelector('.clear-button');
clearButton.addEventListener('click', () => {
    unselectAllWords();
    message.innerHTML = 'Find words that have something in common';
})

displayWords();