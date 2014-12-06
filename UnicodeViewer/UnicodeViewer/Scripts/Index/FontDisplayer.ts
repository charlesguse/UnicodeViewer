class FontDisplayer extends Displayer {
    constructor(private fontOutput: JQuery, private fontElements: JQuery, private handler: FontHandler) {
        super();
    }

    display(font: UnicodeFont) {
        this.fontElements.css("font-family", font.font);
        if (font.displayFont != "") {
            this.fontOutput.html("Attempting to display with " + font.displayFont +
                ". Your browser will use a fallback if " + font.displayFont + " does not exist.");
        } else {
            this.fontOutput.html("<br />");
        }

        this.checkFontInputForError(font);
    }

    checkFontInputForError(font: UnicodeFont) {
        this.checkForError(this.handler.fontInput.parent().parent(), font.hasError);
    }
}