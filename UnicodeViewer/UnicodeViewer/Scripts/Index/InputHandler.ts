class InputHandler {
    private defaultHexCode = "2697";

    constructor(public hexInput: JQuery, public decInput: JQuery, public uniInput: JQuery, public fontInput: JQuery) {

    }

    public getDefault() {
        return UnicodeCharacter.getDefault(this.defaultHexCode);
    }

    public bindHexInput(callback: Function) {
        this.bindInput(this.hexInput, callback);
    }

    public bindDecInput(callback: Function) {
        this.bindInput(this.decInput, callback);
    }

    public bindUniInput(callback: Function) {
        this.bindInput(this.uniInput, callback);
    }

    public bindFontInput(callback: Function) {
        this.bindInput(this.fontInput, callback);
    }

    private bindInput(input: JQuery, callback: Function) {
        input.on("keyup bind cut copy paste", () => setTimeout(() => callback(), 100));
    }

    parseHexCodeToUse() {
        var inputeLength = this.getInputLength(this.hexInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getHex(this.hexInput.val());
            return character;
        }
    }

    parseDecCodeToUse() {
        var inputeLength = this.getInputLength(this.decInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getDec(this.decInput.val());
            return character;
        }
    }

    parseUnicodeToUse() {
        var inputeLength = this.getInputLength(this.uniInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getText(this.uniInput.val());
            return character;
        }
    }

    getInputLength(element: JQuery) {
        return (<string>element.val()).length;
    }


    getFont(): UnicodeFont {
        return new UnicodeFont(this.fontInput);
    }
}