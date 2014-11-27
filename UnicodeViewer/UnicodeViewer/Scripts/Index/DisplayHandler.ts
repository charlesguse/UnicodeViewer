class DisplayHandler {
    constructor(private displayOutput: JQuery, private fontOutput: JQuery, private fontElements: JQuery, private input: InputHandler) { }

    display(character: UnicodeCharacter) {

        if (character.entryType === EntryType.Default) {
            this.input.hexInput.attr("placeholder", character.hex);
            this.input.decInput.attr("placeholder", character.dec);
            this.input.uniInput.attr("placeholder", character.text);
            this.input.hexInput.val("");
            this.input.decInput.val("");
            this.input.uniInput.val("");
        } else {
            this.input.hexInput.val(character.hex);
            this.input.decInput.val(character.dec);
            this.input.uniInput.val(character.text);

            this.checkInputsForErrors(character);
        }

        this.displayOutput.html(character.text.charAt(0));
    }

    displayFont(font: UnicodeFont) {
        this.fontElements.css("font-family", font.font);
        var fonts = font.font.split(",");
        if (fonts.length > 1) {
            this.fontOutput.html("Attempting to display with " + fonts[0] +
                ". Your browser will use a fallback if " + fonts[0] + " does not exist.");
        } else {
            this.fontOutput.html("<br/>");
        }

        this.checkFontInputForError(font);
    }

    checkFontInputForError(font: UnicodeFont) {
        this.checkForError(this.input.fontInput.parent().parent(), font.hasError);
    }


    checkInputsForErrors(character: UnicodeCharacter) {
        if (character.entryType === EntryType.Hex) {
            this.checkForError(this.input.hexInput.parent().parent(), character.hasError);
        } else if (character.entryType === EntryType.Dec) {
            this.checkForError(this.input.decInput.parent().parent(), character.hasError);
        } else if (character.entryType === EntryType.Text) {
            this.checkForError(this.input.uniInput.parent().parent(), character.hasError);
        }
    }

    checkForError(input: JQuery, error: boolean) {
        if (error) {
            input.addClass("has-error");
        } else {
            input.removeClass("has-error");
        }
    }
}