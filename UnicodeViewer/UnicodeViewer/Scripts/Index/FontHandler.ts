class FontHandler {
    constructor(public fontInput: JQuery) {

    }

    public bindFontInput(callback: Function) {
        this.bindInput(this.fontInput, callback);
    }

    private bindInput(input: JQuery, callback: Function) {
        input.on("keyup bind cut copy paste", () => setTimeout(() => callback(), 100));
    }

    public getFont(): UnicodeFont {
        return new UnicodeFont(this.fontInput);
    }
}