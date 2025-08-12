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
// let slotIndexes = []
// let slotNumber = 1;


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
        const groupTitle = document.createElement('div');
        groupTitle.className = `group-title-${index}`;
        groupTitle.style.display = 'none';

        const wordGroup = document.createElement('div');
        wordGroup.className = 'group';

        const groupCategoryContainer = document.createElement('div');
        const groupCategory = document.createElement('div');
        // todo: use category names instead of index
        // [index 1: "Name"] 
        groupCategory.textContent = `Group ${index + 1}`;
        groupTitle.appendChild(groupCategoryContainer);
        groupCategoryContainer.appendChild(groupCategory);
        
        // shuffle(group);

        group.forEach(word => {
            const wordButton = document.createElement('div');
            wordButton.className = 'word';
            wordButton.textContent = word;
            // slotIndexes.push(slotNumber);
            // slotNumber++;

            // todo: append in random order
            // randomize()
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
            //    console.log(selectedWords)
            });
        });

        groupContainer.appendChild(groupTitle);
        groupContainer.appendChild(wordGroup);
    });
    // shuffle(slotIndexes)
    // console.log('SlotIndexes: ', slotIndexes)
}

function checkAnswer(){
    if(selectedWords.length < 4){ 
        message.innerHTML = 'select 4 words';
        message.style.color = 'blue';
        return;
    }
    
    message.innerHTML = 'incorrect';
    message.style.color = 'red';

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
        if(score === 3){ message.innerHTML = 'one away'; } // todo finish
    }
}

function winCategory(categoryIndex){
    message.innerHTML = 'correct';
    message.style.color = 'green';
    score = 0;
    overallScore++;

    // set the word buttons as .grouped
    highlightCorrectWords(selectedWords);
    // reveil category title
    document.querySelector(`.group-title-${categoryIndex}`).style.display = 'block';
    unselectAllWords();

    // check if all categories are found
    if(overallScore === 4){
        message.innerHTML = 'you win!';
        message.style.color = 'lime';
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