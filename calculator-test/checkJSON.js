const cal = require('sirius-calculator');
const fs = require('fs');
const path = require('path');

const characterService = new cal.CharacterService();
const scriptDirectory = __dirname;

characterService.getAllCharacterDetails()
    .then(result => {
        fs.writeFileSync(__dirname + '/cache/all_character.json',JSON.stringify(result, null, 2));
    })