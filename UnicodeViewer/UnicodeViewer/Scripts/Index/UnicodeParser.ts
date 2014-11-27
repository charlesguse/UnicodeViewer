class UnicodeParser {
    constructor(private input: InputHandler, private display: DisplayHandler) {
        this.initBindings();
        var defaultCharacter = this.input.getDefault();
        this.display.display(defaultCharacter);

        var font = this.input.getFont();
        this.display.displayFont(font);
    }

    initBindings() {
        this.input.bindHexInput(() => this.onHexInputKeyUp());
        this.input.bindDecInput(() => this.onDecInputKeyUp());
        this.input.bindUniInput(() => this.onUniInputKeyUp());
        this.input.bindFontInput(() => this.onFontInputKeyUp());
    }

    onHexInputKeyUp() {
        var character = this.input.parseHexCodeToUse();
        this.display.display(character);
    }

    onDecInputKeyUp() {
        var character = this.input.parseDecCodeToUse();
        this.display.display(character);
    }

    onUniInputKeyUp() {
        var character = this.input.parseUnicodeToUse();
        this.display.display(character);
    }

    onFontInputKeyUp() {
        var font = this.input.getFont();
        this.display.displayFont(font);
    }
}
