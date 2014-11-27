var UnicodeParser = (function () {
    function UnicodeParser(input, display) {
        this.input = input;
        this.display = display;
        this.initBindings();
        var defaultCharacter = this.input.getDefault();
        this.display.display(defaultCharacter);

        var font = this.input.getFont();
        this.display.displayFont(font);
    }
    UnicodeParser.prototype.initBindings = function () {
        var _this = this;
        this.input.bindHexInput(function () {
            return _this.onHexInputKeyUp();
        });
        this.input.bindDecInput(function () {
            return _this.onDecInputKeyUp();
        });
        this.input.bindUniInput(function () {
            return _this.onUniInputKeyUp();
        });
        this.input.bindFontInput(function () {
            return _this.onFontInputKeyUp();
        });
    };

    UnicodeParser.prototype.onHexInputKeyUp = function () {
        var character = this.input.parseHexCodeToUse();
        this.display.display(character);
    };

    UnicodeParser.prototype.onDecInputKeyUp = function () {
        var character = this.input.parseDecCodeToUse();
        this.display.display(character);
    };

    UnicodeParser.prototype.onUniInputKeyUp = function () {
        var character = this.input.parseUnicodeToUse();
        this.display.display(character);
    };

    UnicodeParser.prototype.onFontInputKeyUp = function () {
        var font = this.input.getFont();
        this.display.displayFont(font);
    };
    return UnicodeParser;
})();
//# sourceMappingURL=UnicodeParser.js.map
