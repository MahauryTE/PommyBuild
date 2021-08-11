const { ipcRenderer, ipcMain} = require('electron');

/**
 * Method used for generate the cards of characters in the DOM with the data received by the main
 * @param characters
 */
function generateCards(characters) {
    const cardsContainer = document.querySelector("#cards");

    //For all offers
    characters.forEach(character => {
        //Creation of the HTML of a card with information of the character
        let content = `
        <div class="content">
            <h2>${character.name}</h2>
        </div>`

        let card = document.createElement('div');
        card.style.backgroundImage = `url("https://api.genshin.dev/characters/${character.nameId}/portrait")`
        card.classList.add('card', "col-lg-3");

        //Put the content in the div card
        card.innerHTML = content;

        //We add the card to the container
        cardsContainer.appendChild(card);
    });
}

//Init data in the view
ipcRenderer.on('init-data', (e, characters) => {
    generateCards(characters);
});

//Add data in the view
ipcRenderer.on('new-character-added', (e, character) => {
    generateCards(character);
});