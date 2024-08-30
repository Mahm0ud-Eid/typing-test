// Setting Levels
const lvls = {
  Easy: 7,
  Normal: 4,
  Hard: 2,
};

// Default Level
let defaultLevelName = "Easy"; // Change Level From Here
let defaultLevelSeconds = lvls[defaultLevelName];

// Catch Selectors
let startButton = document.querySelector(".start");
let lvlNameSpan = document.querySelector(".message .lvl");
let secondsSpan = document.querySelector(".message .seconds");
let theWord = document.querySelector(".the-word");
let upcomingWords = document.querySelector(".upcoming-words");
let input = document.querySelector(".input");
let timeLeftSpan = document.querySelector(".time span");
let scoreGot = document.querySelector(".score .got");
let scoreTotal = document.querySelector(".score .total");
let finishMessage = document.querySelector(".finish");
let startOverBtn = document.querySelector(".start-over");
let stateDiv = document.querySelector(".btns");

// Setting Level Name + Seconds + Score
lvlNameSpan.innerHTML = defaultLevelName;
secondsSpan.innerHTML = defaultLevelSeconds;
timeLeftSpan.innerHTML = defaultLevelSeconds;
scoreTotal.innerHTML = 100;

const wordContainer = document.getElementById("wordContainer");
let categorySelect = document.getElementById("categorySelect");
let selectedCategory = categorySelect.value;
let apdateBtn = document.getElementById("generateWordsButton");
let words = [];

// Function to call Datamuse API and get words based on category
async function getWordsFromDatamuse(category) {
  const response = await fetch(
    `https://api.datamuse.com/words?ml=${category}&max=100`
  ); // Increase max to get more options
  let data = await response.json();
  data = data.map((item) => item.word);

  // split words into 10 chunks of 10 words each
  let chunkSize = 10;
  let chunks = [];
  for (let i = 0; i < data.length; i += chunkSize) {
    chunks.push(data.slice(i, i + chunkSize));
  }
  return chunks;
}

(async () => {
  words = await getWordsFromDatamuse(selectedCategory);
})();

categorySelect.addEventListener("change", () => {
  updateWords();
  (async () => {
    words = await getWordsFromDatamuse(selectedCategory);
  })();
  chuncksCtr = 0;
});

var chuncksCtr = 0;
function updateWords() {
  selectedCategory = categorySelect.value;
}

// Start Game
startButton.onclick = function () {
  this.remove();
  input.focus();
  input.value = "";
  // Generate Word Function
  loopWords(words);
  categorySelect.parentElement.style.display = "none";
};

// Disable Paste Event
input.onpaste = function () {
  return false;
};

// Func to loop on the words array then pass it to genWords func
function loopWords(words) {
  let wordsArr = words[chuncksCtr];
  chuncksCtr == words.length - 1 ? (chuncksCtr = 0) : chuncksCtr;
  genWords(wordsArr);
}

// Func to generate nth of chunks from the words array
function genWords(words) {
  // Empty Upcoming Wordss
  upcomingWords.innerHTML = "";
  // Get Random Word From Array
  let randomWord = words[Math.floor(Math.random() * words.length)];
  // Get Word Index
  let wordIndex = words.indexOf(randomWord);
  // Remove Random Word From Array
  words.splice(wordIndex, 1);
  // words = words.filter((word) => word !== randomWord);
  // Show The Random Word
  theWord.innerHTML = randomWord;

  // Display initial set of words
  for (let i = 0; i < words.length; i++) {
    // Create Div Element
    let div = document.createElement("div");
    let txt = document.createTextNode(words[i]);
    div.appendChild(txt);
    upcomingWords.appendChild(div);
  }
  startPlay(words);
}

// Update words when button is clicked
apdateBtn.addEventListener("click", () => {
  chuncksCtr += 1;
  stateDiv.firstElementChild.remove();
  stateDiv.parentElement.style.display = "none";
  loopWords(words);
  input.focus();
});

function startPlay(words) {
  timeLeftSpan.innerHTML = defaultLevelSeconds;
  let theWord = document.querySelector(".the-word");
  // Start Timer
  let start = setInterval(() => {
    timeLeftSpan.innerHTML--;
    if (timeLeftSpan.innerHTML === "0") {
      // Stop Timer
      clearInterval(start);
      // Compare Words
      if (theWord.innerHTML.toLowerCase() === input.value.toLowerCase()) {
        // Empty Input Field
        input.value = "";
        // Increase Score
        scoreGot.innerHTML++;
        if (scoreGot.innerHTML == scoreTotal.innerHTML) {
          let span = document.createElement("span");
          span.className = "good";
          let spanText = document.createTextNode("Congrats!");
          span.appendChild(spanText);
          stateDiv.firstElementChild.innerText =
            document.querySelector(".score").innerText;
          stateDiv.prepend(span);
          stateDiv.parentElement.style.display = "block";
          stateDiv.lastElementChild.remove();
          return;
        }
        if (words.length > 0) {
          // Call Generate Word Function
          genWords(words);
        } else {
          let span = document.createElement("span");
          span.className = "good";
          let spanText = document.createTextNode("good job!");
          span.appendChild(spanText);
          stateDiv.firstElementChild.innerText =
            document.querySelector(".score").innerText;
          stateDiv.prepend(span);
          stateDiv.parentElement.style.display = "block";
        }
      } else {
        let span = document.createElement("span");
        span.className = "bad";
        let spanText = document.createTextNode("Game Over");
        span.appendChild(spanText);
        stateDiv.firstElementChild.innerText =
          document.querySelector(".score").innerText;
        stateDiv.prepend(span);
        stateDiv.parentElement.style.display = "block";
        stateDiv.lastElementChild.remove();
      }
    }
  }, 1000);
}

// Start Over Button
startOverBtn.onclick = function () {
  window.location.reload();
};
