const responses = {
    continue: 'media/continue.mp3',
    cry: 'media/cry.mp3',
    details: 'media/details.mp3',
    empathy: 'media/empathy.mp3',
    finish: 'media/finish.mp3',
    shock: 'media/shock.mp3'
}

const responsesText = {
    continue: 'There, there, tell me more...',
    cry: 'It is perfectly fine to cry. Better to cry than lie to yourself about how you feel.',
    details: 'Pardon moi, I need more clarification.',
    empathy: 'Do not be so hard on yourself. I would feel the same.',
    finish: 'Excuse moi, you know I am always here to listen. But right now, I have to go poop.',
    shock: 'Oh my goodness. That is, how you say? Some fucked up shit.'
}

let currentlyPlaying = null;
let isListening = false;

function playAudio(buttonId) {
    const audioSrc = responses[buttonId];
    if (audioSrc) {
        if (currentlyPlaying) {
            currentlyPlaying.pause();
        }
        const audio = new Audio(audioSrc);
        audio.play();
        currentlyPlaying = audio;

        const responseText = responsesText[buttonId];
        if (responseText) {
            const response = document.querySelector('.response');
            response.textContent = responseText;
        }
    }
}

const buttons = document.querySelectorAll('button');
buttons.forEach(button => {
    button.addEventListener('click', () => {
        const buttonId = button.textContent.toLowerCase();
        playAudio(buttonId);
    });
});

const tlkBtn = document.querySelector('.talk');
const content = document.querySelector('.content');
const response = document.querySelector('.response');

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onstart = function () {
    console.log("Tell me what's on your mind...");
    isListening = true;
    startBlinking();
};

recognition.onend = function () {
    isListening = false;
    stopBlinking();
};

recognition.onresult = function(event) {
    const current = event.resultIndex;

    const transcript = event.results[current][0].transcript;
    let keywordFound = false;

    if (transcript.includes('embarrassed')) {
        playAudio('continue');
        keywordFound = true;
    } else if (transcript.includes('cry')) {
        playAudio('cry');
        keywordFound = true;
    } else if (transcript.includes('loser')) {
        playAudio('empathy');
        keywordFound = true;
    } else if (transcript.includes('had the nerve')) {
        playAudio('shock');
        keywordFound = true;
    }
    if (!keywordFound) {
        playAudio('details'); // details audio for the temp "catch-all" response
    }
// include limiter after 7 turns?

    content.textContent = transcript;
};

function startBlinking() {
    tlkBtn.classList.add('blink');
};

function stopBlinking() {
    tlkBtn.classList.remove('blink');
}

const listeningCue = new Audio('media/listening.mp3');
tlkBtn.addEventListener('click', () => {
    response.textContent = "*She's listening.*";
    tlkBtn.style.backgroundColor = 'rebeccapurple';
    tlkBtn.style.color = 'white';
    // listeningCue.play();
    recognition.start();
});
