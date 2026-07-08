const fs = require('fs');
const pdf = require('pdf-parse');

let dataBuffer = fs.readFileSync('Copywriting_Aruna.pdf');

pdf(dataBuffer).then(function(data) {
    fs.writeFileSync('C:\\Users\\mbntn\\.gemini\\antigravity-ide\\brain\\8be69079-4667-4624-93b5-d8e1dd757bca\\scratch\\pdf_text.txt', data.text);
    console.log("Extracted PDF text to scratch directory.");
}).catch(err => {
    console.error(err);
});
