class UnicodeParser {
    constructor(private input: InputHandler, private display: InputDisplayer, private fontInput: FontHandler, private fontDisplay: FontDisplayer) {
        this.initBindings();

        if (this.hasInputHandlerAndDisplayer()) {
            var defaultCharacter = this.input.getDefault();
            this.display.display(defaultCharacter);
        }
        var font = this.fontInput.getFont();
        this.fontDisplay.display(font);
    }

    private initBindings() {
        if (this.hasInputHandlerAndDisplayer()) {
            this.input.bindHexInput(() => this.onHexInputKeyUp());
            this.input.bindDecInput(() => this.onDecInputKeyUp());
            this.input.bindUniInput(() => this.onUniInputKeyUp());
        }
        this.fontInput.bindFontInput(() => this.onFontInputKeyUp());
    }

    private onHexInputKeyUp() {
        var character = this.input.parseHexCodeToUse();
        this.display.display(character);
    }

    private onDecInputKeyUp() {
        var character = this.input.parseDecCodeToUse();
        this.display.display(character);
    }

    private onUniInputKeyUp() {
        var character = this.input.parseUnicodeToUse();
        this.display.display(character);
    }

    private onFontInputKeyUp() {
        var font = this.fontInput.getFont();
        this.fontDisplay.display(font);
    }

    private hasInputHandlerAndDisplayer() {
        return this.input != null && this.display != null;
    }
}
