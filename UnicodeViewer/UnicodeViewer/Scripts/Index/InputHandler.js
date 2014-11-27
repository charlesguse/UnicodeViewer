var InputHandler = (function () {
    function InputHandler(hexInput, decInput, uniInput, fontInput) {
        this.hexInput = hexInput;
        this.decInput = decInput;
        this.uniInput = uniInput;
        this.fontInput = fontInput;
        this.defaultHexCode = "2697";
    }
    InputHandler.prototype.getDefault = function () {
        return UnicodeCharacter.getDefault(this.defaultHexCode);
    };

    InputHandler.prototype.bindHexInput = function (callback) {
        this.bindInput(this.hexInput, callback);
    };

    InputHandler.prototype.bindDecInput = function (callback) {
        this.bindInput(this.decInput, callback);
    };

    InputHandler.prototype.bindUniInput = function (callback) {
        this.bindInput(this.uniInput, callback);
    };

    InputHandler.prototype.bindFontInput = function (callback) {
        this.bindInput(this.fontInput, callback);
    };

    InputHandler.prototype.bindInput = function (input, callback) {
        input.on("keyup bind cut copy paste", function () {
            return setTimeout(function () {
                return callback();
            }, 100);
        });
    };

    InputHandler.prototype.parseHexCodeToUse = function () {
        var inputeLength = this.getInputLength(this.hexInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getHex(this.hexInput.val());
            return character;
        }
    };

    InputHandler.prototype.parseDecCodeToUse = function () {
        var inputeLength = this.getInputLength(this.decInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getDec(this.decInput.val());
            return character;
        }
    };

    InputHandler.prototype.parseUnicodeToUse = function () {
        var inputeLength = this.getInputLength(this.uniInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getText(this.uniInput.val());
            return character;
        }
    };

    InputHandler.prototype.getInputLength = function (element) {
        return element.val().length;
    };

    InputHandler.prototype.getFont = function () {
        return new UnicodeFont(this.fontInput);
    };
    return InputHandler;
})();
//# sourceMappingURL=InputHandler.js.map
