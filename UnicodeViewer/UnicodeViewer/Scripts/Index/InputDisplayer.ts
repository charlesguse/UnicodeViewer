class InputDisplayer extends Displayer {
    constructor(private displayOutput: JQuery, private input: InputHandler) {
        super();
    }

    public display(character: UnicodeCharacter) {

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

    private checkInputsForErrors(character: UnicodeCharacter) {
        if (character.entryType === EntryType.Hex) {
            this.checkForError(this.input.hexInput.parent().parent(), character.hasError);
        } else if (character.entryType === EntryType.Dec) {
            this.checkForError(this.input.decInput.parent().parent(), character.hasError);
        } else if (character.entryType === EntryType.Text) {
            this.checkForError(this.input.uniInput.parent().parent(), character.hasError);
        }
    }
}