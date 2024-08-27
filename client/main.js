//imports
import { Flashcard } from "./flashcard.js";

//Top_bar
const home = document.getElementById('home');

//Flashcard_bar
const create = document.getElementById('create');
const your = document.getElementById('your');
const learn = document.getElementById('learn');

//Flashcards
const flashcards = document.getElementById('flashcards');
const flashcard = new Flashcard();

your.addEventListener('click', () => {
    if (JSON.stringify(flashcard.flashcards) === '{}') {
        flashcards.innerHTML = 'You have no flashcard sets. Create some using the button to the left.';
    }
    else {
        flashcards.innerHTML = 'Pick your flashcard set';
        const wrapper = document.createElement('div');
        Object.keys(flashcard.flashcards).forEach(set => {
            const button = document.createElement('input');
            button.type = 'button';
            button.value = set;
            button.classList.add('button');
            button.addEventListener('click', () => {
                flashcard.renderFlashcards(flashcards, set);
            });
            wrapper.appendChild(button);
        });
        flashcards.appendChild(wrapper);
    }
}); 

create.addEventListener('click', () => {
    flashcards.innerHTML = '';
    const wrapper = document.createElement('div');
    const nameLabel = document.createElement('label');
    const nameInput = document.createElement('input');
    nameLabel.innerText = 'Name of Set: ';

    const button = document.createElement('input');
    button.type = 'button';
    button.value = 'Enter';
    button.addEventListener('click', () => {
        flashcard.createSet(flashcards, nameInput.value);
    });

    wrapper.appendChild(nameLabel);
    wrapper.appendChild(nameInput);
    wrapper.appendChild(button);
    flashcards.appendChild(wrapper);
});

home.addEventListener('click', () => {
    flashcards.innerHTML = '';
});

learn.addEventListener('click', () => {
    if (JSON.stringify(flashcard.flashcards) === '{}') {
        flashcards.innerHTML = 'You have no flashcard sets. Create some using the button to the left.';
    }
    else {
        flashcards.innerHTML = 'Pick what mode you want'
        const mainWrapper = document.createElement('div');

        const study = document.createElement('input');
        study.type = 'button';
        study.value = 'Study';
        study.classList.add('button');
        study.addEventListener('click', () => {
            flashcards.innerHTML = 'Pick your flashcard set';
            const wrapper = document.createElement('div');
            Object.keys(flashcard.flashcards).forEach(set => {
                const button = document.createElement('input');
                button.type = 'button';
                button.value = set;
                button.classList.add('button');
                button.addEventListener('click', () => {
                    flashcard.studyFlashcards(flashcards, set);
                });
                wrapper.appendChild(button);
            });
            flashcards.appendChild(wrapper);
        });

        const test = document.createElement('input');
        test.type = 'button';
        test.value = 'Test';
        test.classList.add('button');
        test.addEventListener('click', () => {
            flashcards.innerHTML = 'Pick your flashcard set';
            const wrapper = document.createElement('div');
            Object.keys(flashcard.flashcards).forEach(set => {
                const button = document.createElement('input');
                button.type = 'button';
                button.value = set;
                button.classList.add('button');
                button.addEventListener('click', () => {
                    flashcard.testFlashcards(flashcards, set, 0, 0);
                });
                wrapper.appendChild(button);
            });
            flashcards.appendChild(wrapper);
        });

        mainWrapper.appendChild(study);
        mainWrapper.appendChild(test);
        flashcards.appendChild(mainWrapper);
    }
});
