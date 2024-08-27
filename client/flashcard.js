import * as crud from './crud.js';

let i = 0;
let bool = 0;
export class Flashcard {
    constructor() {
        if (localStorage.getItem('flashcards') !== null) {
            this.flashcards = JSON.parse(localStorage.getItem('flashcards'));
        } 
        else {
            this.flashcards = {};
            localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
        }
    }
    
    userInput(text) {
        const label = document.createElement('label');
        const input = document.createElement('input');
        label.innerText = text;
        return {label, input}
    }

    renderFlashcards(element, name) {
        element.innerHTML = 'Flashcards:';
        if (JSON.stringify(this.flashcards) === '{}') { //empty
            const empty = document.createElement('div');
            empty.innerText = 'You have no flashcards';
            element.appendChild(empty);
        }
        else {
            Object.keys(this.flashcards[name]).forEach(async (flashcard) => {
                await crud.readFlashcard(flashcard, name);
                const newFlashcard = document.createElement('div');
                const term = document.createElement('div');
                const definition = document.createElement('div');
                const divider = document.createElement('div');

                term.innerText = 'Term: ' + flashcard;
                definition.innerText = 'Definition: ' + this.flashcards[name][flashcard] + ' ';
                divider.innerText = "=>";

                const remove = document.createElement('input');
                remove.type = 'button';
                remove.classList.add('button');
                remove.classList.add('trash-icon');
                remove.addEventListener('click', async () => {
                    await crud.deleteFlashcard(flashcard, name);
                    delete this.flashcards[name][flashcard];
                    localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
                    this.renderFlashcards(element, name);
                });

                const edit = document.createElement('input');
                edit.type = 'button';
                edit.classList.add('button');
                edit.classList.add('pencil-icon');
                edit.addEventListener('click', async () => {
                    if (element.childNodes[element.childNodes.length-1].tagName === "INPUT" ||
                        element.childNodes[element.childNodes.length-1].classList.value === "flashcard") {
                        const wrapper = document.createElement('div');
                        const {label:termLabel, input:termInput} = this.userInput('Updated Term: ');
                        const {label:defLabel, input:defInput} = this.userInput('Updated Definition: ');

                        const button = document.createElement('input');
                        button.type = 'button';
                        button.value = 'Enter';

                        wrapper.appendChild(termLabel);
                        wrapper.appendChild(termInput);
                        wrapper.appendChild(defLabel);
                        wrapper.appendChild(defInput);
                        wrapper.appendChild(button);

                        button.addEventListener('click', async () => {
                            await crud.updateFlashcard(termInput.value, defInput.value, name);
                            if (termInput.value !== flashcard) {
                                await crud.deleteFlashcard(flashcard, name);
                                delete this.flashcards[name][flashcard];
                                await crud.createFlashcard(termInput.value, defInput.value, name);
                            }
                            this.flashcards[name][termInput.value] = defInput.value;
                            localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
                            this.renderFlashcards(element, name);
                        });
                        element.appendChild(wrapper);
                    }
                });

                definition.appendChild(edit);
                definition.appendChild(remove);
                
                newFlashcard.appendChild(term);
                newFlashcard.appendChild(definition);
                newFlashcard.classList.add('flashcard');
                element.appendChild(newFlashcard);
                });

            const add = document.createElement('input');
            add.type = 'button';
            add.value = 'Add';
            add.classList.add('button');
            add.addEventListener('click', () => {
                if (element.childNodes[element.childNodes.length-1].tagName === "INPUT" ||
                    element.childNodes[element.childNodes.length-1].classList.value === "flashcard") {
                    const wrapper = document.createElement('div');
                    const termLabel = document.createElement('label');
                    const termInput = document.createElement('input');
                    termLabel.innerText = 'Term: ';
                    const defLabel = document.createElement('label');
                    const defInput = document.createElement('input');
                    defLabel.innerText = 'Definition: ';

                    const button = document.createElement('input');
                    button.type = 'button';
                    button.value = 'Enter';
                    button.addEventListener('click', async () => {
                        if (this.flashcards[name][termInput.value]) {
                            await crud.updateFlashcard(termInput.value, defInput.value, name);
                        }
                        else {
                            await crud.createFlashcard(termInput.value, defInput.value, name);
                        }
                        this.flashcards[name][termInput.value] = defInput.value;
                        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
                        this.renderFlashcards(element, name);
                    });

                    wrapper.appendChild(termLabel);
                    wrapper.appendChild(termInput);
                    wrapper.appendChild(defLabel);
                    wrapper.appendChild(defInput);
                    wrapper.appendChild(button);
                    element.appendChild(wrapper);
                }
            });
            element.appendChild(add);

            const deleteSet = document.createElement('input');
            deleteSet.type = 'button';
            deleteSet.value = 'Delete Set';
            deleteSet.classList.add('button');
            deleteSet.addEventListener('click', async () => {
                await crud.deleteSet(name);
                delete this.flashcards[name];
                localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
                element.innerHTML = 'Set Deleted';
            });
            element.appendChild(deleteSet);
        }
    }    
    
    studyFlashcards(element, name) {
        element.innerHTML = '';
        if (JSON.stringify(this.flashcards[name]) === '{}') { //empty
            const empty = document.createElement('div');
            empty.innerText = 'You have no flashcards in this set to study. Add some in the your flashcards section.';
            element.appendChild(empty);
        }
        else {
            const screen = document.createElement('div');
            screen.classList.add('screen');
            screen.innerText = Object.keys(this.flashcards[name])[i%Object.keys(this.flashcards[name]).length];

            const flip = document.createElement('input');
            flip.type = 'button';
            flip.value = 'Flip';
            flip.addEventListener('click', () => {
                if (!bool) {
                    screen.innerText = this.flashcards[name][Object.keys(this.flashcards[name])[i%Object.keys(this.flashcards[name]).length]];
                }
                else {
                    screen.innerText = Object.keys(this.flashcards[name])[i%Object.keys(this.flashcards[name]).length];
                }
                bool = 1-bool;
            });
            
            const next = document.createElement('input');
            next.type = 'button';
            next.value = 'Next';
            next.addEventListener('click', () => {
                i++;
                bool = 0;
                this.studyFlashcards(element, name);
            });

            element.appendChild(screen);
            element.appendChild(flip);
            element.appendChild(next);
        }
    }

    testFlashcards(element, name, i, score) {
        element.innerHTML = '';
        if (JSON.stringify(this.flashcards[name]) === '{}') { //empty
            const empty = document.createElement('div');
            empty.innerText = 'You have no flashcards in this set to study. Add some in the your flashcards section.';
            element.appendChild(empty);
        }
        else if (i === Object.keys(this.flashcards[name]).length) {
            if (score !== i) {
                element.innerHTML = 'Your score is ' + score + '! Keep practicing till you get a perfect score!';
            }
            else {
                element.innerHTML = 'Your score is ' + score + '! Congratulations on a perfect score!';
            }
        }
        else {
            const screen = document.createElement('div');
            screen.classList.add('screen');
            screen.innerText = Object.keys(this.flashcards[name])[i%Object.keys(this.flashcards[name]).length];
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('center');
            const enter = document.createElement('input');
            enter.type = 'button';
            enter.value = 'Enter';
            enter.classList.add('center');
            enter.addEventListener('click', () => {
                const check = document.createElement('div');
                if (input.value === this.flashcards[name][Object.keys(this.flashcards[name])[i%Object.keys(this.flashcards[name]).length]]) {
                    check.innerText = 'Correct!';
                    this.testFlashcards(element, name, ++i, ++score);
                }
                else {
                    check.innerText = `Wrong! Correct answer is: ${this.flashcards[name][Object.keys(this.flashcards[name])[i%Object.keys(this.flashcards[name]).length]]}`;
                    this.testFlashcards(element, name, ++i, score);
                }
                element.appendChild(check);
            });

            element.appendChild(screen);
            element.appendChild(input);
            element.appendChild(enter);
        }
    }

    async createSet(element, name) {
        await crud.createFlashcardSet(name);
        this.flashcards[name] = {};
        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
        element.innerHTML = `Set ${name} Created`;
    }
}