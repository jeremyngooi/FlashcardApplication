export async function createFlashcardSet(name) {
    const response = await fetch(`/flashcard/createSet?name=${name}`,
    {
        method: 'POST',
    });
    const data = await response.json();
    return data;
}

export async function createFlashcard(term, definition, name) {
    const response = await fetch(`/flashcard/create?term=${term}&definition=${definition}&name=${name}`,
    {
        method: 'POST',
    });
    const data = await response.json();
    return data;
}

export async function readFlashcard(term, name) {
    const response = await fetch(`/flashcard/read?term=${term}&name=${name}`, 
    {
        method: 'GET',
    });
    const data = await response.json();
    return data;
}

export async function updateFlashcard(term, definition, name) {
    const response = await fetch(`/flashcard/update?term=${term}&definition=${definition}&name=${name}`,
    {
        method: 'PUT',
    });
    const data = await response.json();
    return data;
}

export async function deleteFlashcard(term, name) {
    const response = await fetch(`/flashcard/delete?term=${term}&name=${name}`, 
    {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}

export async function deleteSet(name) {
    const response = await fetch(`/flashcard/deleteSet?name=${name}`,
    {
        method: 'DELETE',
    });
    const data = await response.json();
    return data;
}