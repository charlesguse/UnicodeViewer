var DisplayHandler = (function () {
    function DisplayHandler(displayOutput, fontOutput, fontElements, input) {
        this.displayOutput = displayOutput;
        this.fontOutput = fontOutput;
        this.fontElements = fontElements;
        this.input = input;
    }
    DisplayHandler.prototype.display = function (character) {
        if (character.entryType === 3 /* Default */) {
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
    };

    DisplayHandler.prototype.displayFont = function (font) {
        this.fontElements.css("font-family", font.font);
        var fonts = font.font.split(",");
        if (fonts.length > 1) {
            this.fontOutput.html("Attempting to display with " + fonts[0] + ". Your browser will use a fallback if " + fonts[0] + " does not exist.");
        } else {
            this.fontOutput.html("<br/>");
        }

        this.checkFontInputForError(font);
    };

    DisplayHandler.prototype.checkFontInputForError = function (font) {
        this.checkForError(this.input.fontInput.parent().parent(), font.hasError);
    };

    DisplayHandler.prototype.checkInputsForErrors = function (character) {
        if (character.entryType === 1 /* Hex */) {
            this.checkForError(this.input.hexInput.parent().parent(), character.hasError);
        } else if (character.entryType === 0 /* Dec */) {
            this.checkForError(this.input.decInput.parent().parent(), character.hasError);
        } else if (character.entryType === 2 /* Text */) {
            this.checkForError(this.input.uniInput.parent().parent(), character.hasError);
        }
    };

    DisplayHandler.prototype.checkForError = function (input, error) {
        if (error) {
            input.addClass("has-error");
        } else {
            input.removeClass("has-error");
        }
    };
    return DisplayHandler;
})();
//# sourceMappingURL=DisplayHandler.js.map
