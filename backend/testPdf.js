const { PDFParse } = require("pdf-parse");
const fs = require("fs");


async function test(){

    const buffer = fs.readFileSync(
        "uploads/1785064769247-UML diagrams.pdf"
    );


    const parser = new PDFParse({
        data: buffer
    });


    const result = await parser.getText();


    console.log(result.text);

}


test();