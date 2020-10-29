const randomWords =	['SPÖKE', 'HÄXA', 'BUS', 'GODIS', 'SPINDEL', 'BLOD', 'VAMPYR', 'SKELETT', 'MORD',
					'SKRIK', 'ALIEN', 'FLADDERMUS', 'ZOMBIE', 'CLOWN', 'LIEMANNEN', 'ORM', 'PUMPA'];

let randomWord = '';
let numberOfIncorrectGuesses = 0;
let numberOfCorrectGuesses = 0;
let guessedKeys = [];
let guessedKeysIncorrect = [];
let keyDisabled = false;
let validKey = false;
let timeOut = false;

const endHeaderText = document.getElementById('end-text');
const endText = document.getElementById('end-paragraph');
const guessesText = document.getElementById('guesses');

// Genererar ett random ord från array
function generateRandomWord() {
	let random = Math.floor(Math.random() * randomWords.length);
	randomWord = randomWords[random];
	generateBoxes();
	console.log(randomWord); // PS: visar ordet i consolen
}

/*
Gör om bokstaven till en versal
Kollar om det är en godkänd input (d.v.s. A-Ö)
Kollar om bokstaven redan är använd från en array
Kollar om tangentbordet inte är tillfälligt inaktiverat
Om inte lägger in den i array och kör funktionen för att kolla om bokstaven är i ordet
*/
function checkKey(userKey) {
	userKey = userKey.toUpperCase();
	checkValidKey(userKey);
	if (!keyDisabled && validKey) {
	if (guessedKeys.indexOf(userKey) == -1) {
		guessedKeys.push(userKey);
		checkKeyInWord(userKey);
	}
	}
}

/*
Kollar om inputen är A-Ö, i så fall är validKey true
Har lagt in alla bokstäver genom att bara följa tangentbordet med QWERTY o.s.v. om man undrar över ordningen
*/
function checkValidKey(userKey) {
	switch(userKey){
		case "Q": validKey = true; break;
		case "W": validKey = true; break;
		case "E": validKey = true; break;
		case "R": validKey = true; break;
		case "T": validKey = true; break;
		case "Y": validKey = true; break;
		case "U": validKey = true; break;
		case "I": validKey = true; break;
		case "O": validKey = true; break;
		case "P": validKey = true; break;
		case "Å": validKey = true; break;
		case "A": validKey = true; break;
		case "S": validKey = true; break;
		case "D": validKey = true; break;
		case "F": validKey = true; break;
		case "G": validKey = true; break;
		case "H": validKey = true; break;
		case "J": validKey = true; break;
		case "K": validKey = true; break;
		case "L": validKey = true; break;
		case "Ö": validKey = true; break;
		case "Ä": validKey = true; break;
		case "Z": validKey = true; break;
		case "X": validKey = true; break;
		case "C": validKey = true; break;
		case "V": validKey = true; break;
		case "B": validKey = true; break;
		case "N": validKey = true; break;
		case "M": validKey = true; break;
		default: validKey = false;
	}
}

/*
Kollar om ordet innehåller bokstaven användaren tryckt på
Om inte läggs den i en array med fel bokstäver
*/
function checkKeyInWord(userKey) {
	if (randomWord.includes(userKey)) {
		addInBox(userKey);
	} else {
		guessedKeysIncorrect.push(userKey);
		displayGuessesText();
		numberOfIncorrectGuesses++;
		checkForLoss();
	}
}

// Varje fel bokstav visas på skärmen för användaren istället för Happy Halloween
function displayGuessesText() {
	guessesText.innerHTML = '';
	for (let i = 0; i < guessedKeysIncorrect.length; i++) {
		guessesText.innerHTML += guessedKeysIncorrect[i];
	}
}

/*
Genererar boxes till ordet man ska gissa
Data-position kommer hålla reda på boxarna i förhållande till array
*/
function generateBoxes() {
	for (let i = 0; i < randomWord.length; i++) {
		let node = document.createElement('div');
		node.setAttribute('class', 'text-container');
		node.setAttribute('data-position', i);
		document.querySelector('.text-containers').append(node);
	}
}

/*
Box hämtar alla div som har genererats med attributen data-position
For loop som kollar igenom alla boxar för de tillfällen då ett ord innehåller samma bokstav mer än en gång
*/
function addInBox(userKey) {
	let box = document.querySelectorAll('[data-position]');
	for (i = 0; i < randomWord.length; i++) {
		if (randomWord.charAt(i) == userKey) {
			box[i].innerHTML = userKey;
			numberOfCorrectGuesses++;
			checkForWin();
		}
	}
}

// Om antalet korrekta gissningar är lika långt som ordet har användaren vunnit
function checkForWin() {
	if (numberOfCorrectGuesses == randomWord.length) {
		document.querySelector('.overlay').classList.add('show');
		endHeaderText.innerHTML = 'Du vann!';
		endText.innerHTML =	'Du gissade rätt på det hemliga ordet som var ' + randomWord.toLowerCase() +
							' med en tid kvar på ' + startTime + ' ' + secondOrSeconds();
		keyDisabled = true;
		clearInterval(countDown);
	}
}

// Liten detalj men jag gillar inte när det står att det är 1 sekunder kvar av någonting
function secondOrSeconds() {
	if (startTime == 1) {
		return 'sekund.';
	} else {
		return 'sekunder.';
	}
}

/*
Om användaren gissar fel fem gånger så är spelet förlorat
För varje gång användaren gissar fel läggs en klass till på figuren
keyDisabled används både vid vinst och förlust så att användaren inte kan fortsätta
Stänger av timern tillfälligt
*/
function checkForLoss() {
	if (numberOfIncorrectGuesses == 1) {
		document.querySelector('figure').classList.add('scaffold');
	} else if (numberOfIncorrectGuesses == 2) {
		document.querySelector('figure').classList.add('head');
	} else if (numberOfIncorrectGuesses == 3) {
		document.querySelector('figure').classList.add('body');
	} else if (numberOfIncorrectGuesses == 4) {
		document.querySelector('figure').classList.add('arms');
	} else {
		if (numberOfIncorrectGuesses == 5) { // Visar enbart benen om man inte förlorar på tid
			document.querySelector('figure').classList.add('legs');
		}
		document.querySelector('.overlay').classList.add('show');
		endHeaderText.innerHTML = 'Du förlorade!';
		if (timeOut == true) {
			endText.innerHTML = 'Tiden tog slut. Det hemliga ordet var ' + randomWord.toLowerCase() + '.';
		} else {
			endText.innerHTML = 'Du gissade fel på för många bokstäver. Det hemliga ordet var ' + randomWord.toLowerCase() + '.';
		}
		keyDisabled = true;
		clearInterval(countDown);
	}
}

/*
För att spela igen behöver alla globala variabler återställas
Div-boxarna behöver tas bort för att sedan genereras igen
Alla klasser på figuren återställs
Ett nytt ord genereras
Startar timern igen
*/
function restartGame() {
	startTime = 60;
	timeOut = false;
	document.querySelector('.text-containers').innerHTML = '';
	document.querySelector('figure').classList = '';
	numberOfIncorrectGuesses = 0;
	numberOfCorrectGuesses = 0;
	guessedKeys = [];
	guessedKeysIncorrect = [];
	keyDisabled = false;
	guessesText.innerHTML = 'Happy Halloween';
	generateRandomWord();
	document.querySelector('.overlay').classList.remove('show');
	countDown = setInterval(countingDown, 1000);
	document.querySelector('.timer').innerHTML = 'Tid kvar: 60'; //Så att texten inte laggar
}

// Timer som gör att man förlorar efter en minut
let startTime = 60;
let countDown = setInterval(countingDown, 1000);
function countingDown() {
	startTime--;
	document.querySelector('.timer').innerHTML = 'Tid kvar: ' + startTime;
	if (startTime == 0) {
		clearInterval(countDown);
		timeOut = true; // Visar att användaren förlorade på tid
		numberOfIncorrectGuesses = 6; // Högre än fem så att inte benen på figuren visas om man förlorar på tid
		checkForLoss();
	}
}

/*
Funktion för att kunna starta om spelet genom att trycka på enter
Fungerar enbart om spelaren befinner sig vid vunnit/förlorat skärmen
*/
function checkEnterKey(enterKey) {
	if (enterKey == 'Enter') {
	if (document.querySelector('.overlay').classList.contains('show')){
		restartGame();
	}
	}
}

generateRandomWord();

window.addEventListener('keyup', function(event){
	checkKey(event.key);
	checkEnterKey(event.key);
});

document.querySelector('#end-button').addEventListener('click', restartGame);