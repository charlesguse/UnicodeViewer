class FontDisplayer extends Displayer {
    constructor(private fontOutput: JQuery, private fontElements: JQuery, private handler: FontHandler) {
        super();
    }

    display(font: UnicodeFont) {
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
        this.checkForError(this.handler.fontInput.parent().parent(), font.hasError);
    }
}