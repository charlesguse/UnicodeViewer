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
        return new Font(this.fontInput);
    };
    return InputHandler;
})();

var DisplayHandler = (function () {
    function DisplayHandler(displayOutput, fontOutput, input) {
        this.displayOutput = displayOutput;
        this.fontOutput = fontOutput;
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
        this.input.uniInput.css("font-family", font.font);
        this.displayOutput.css("font-family", font.font);
        this.fontOutput.css("font-family", font.font);

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

var EntryType;
(function (EntryType) {
    EntryType[EntryType["Dec"] = 0] = "Dec";
    EntryType[EntryType["Hex"] = 1] = "Hex";
    EntryType[EntryType["Text"] = 2] = "Text";
    EntryType[EntryType["Default"] = 3] = "Default";
})(EntryType || (EntryType = {}));

var Font = (function () {
    function Font(fontInput) {
        this.defaultFonts = "Segoe UI Symbol";
        var fontLength = this.getInputLength(fontInput);
        var fontExists = this.doesFontExist(fontInput.val());

        this._font = this.defaultFonts;
        if (fontLength > 0 && fontExists) {
            this._font = fontInput.val() + "," + this.defaultFonts;
        }
        this._hasError = fontLength > 0 && !fontExists;
    }
    Object.defineProperty(Font.prototype, "font", {
        // reSharper restore InconsistentNaming
        get: function () {
            return this._font;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(Font.prototype, "hasError", {
        get: function () {
            return this._hasError;
        },
        enumerable: true,
        configurable: true
    });

    Font.prototype.doesFontExist = function (font) {
        if (font == null || font.length === 0) {
            return false;
        } else if (font === "Comic Sans MS" || font === "'Comic Sans MS'") {
            return true;
        }

        var base = $("<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>").css({ "font-family": "Comic Sans MS", "font-size": "100px", "display": "inline", "visibility": "hidden" }).appendTo("body");
        var test = $("<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>").css({ "font-family": font + ",'Comic Sans MS'", "font-size": "100px", "display": "inline", "visibility": "hidden" }).appendTo("body");
        var exists = false;
        var difference = base.width() - test.width();

        if (difference !== 0) {
            exists = true;
        }
        base.remove();
        test.remove();

        return exists;
    };

    Font.prototype.getInputLength = function (element) {
        return element.val().length;
    };
    return Font;
})();

var UnicodeCharacter = (function () {
    function UnicodeCharacter() {
    }
    Object.defineProperty(UnicodeCharacter.prototype, "dec", {
        // reSharper restore InconsistentNaming
        get: function () {
            return this._dec;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(UnicodeCharacter.prototype, "hex", {
        get: function () {
            return this._hex;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(UnicodeCharacter.prototype, "text", {
        get: function () {
            return this._text;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(UnicodeCharacter.prototype, "entryType", {
        get: function () {
            return this._entryType;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(UnicodeCharacter.prototype, "hasError", {
        get: function () {
            return this._hasError;
        },
        enumerable: true,
        configurable: true
    });

    UnicodeCharacter.getDefault = function (hex) {
        var character = this.getHex(hex);
        character._entryType = 3 /* Default */;
        return character;
    };

    UnicodeCharacter.getHex = function (hex) {
        var character = new UnicodeCharacter();

        character._entryType = 1 /* Hex */;
        character._hex = hex;
        character._dec = parseInt(hex, 16).toString();
        character._text = String.fromCharCode(parseInt(character.dec, 10));
        character._hasError = !/^[0-9A-F]*$/i.test(hex);

        return character;
    };

    UnicodeCharacter.getDec = function (dec) {
        var character = new UnicodeCharacter();

        character._entryType = 0 /* Dec */;
        character._hex = parseInt(dec, 10).toString(16);
        character._dec = dec;
        character._text = String.fromCharCode(parseInt(character.dec, 10));
        character._hasError = !/^[0-9]*$/i.test(dec);

        return character;
    };

    UnicodeCharacter.getText = function (text) {
        var character = new UnicodeCharacter();

        character._entryType = 2 /* Text */;
        character._hex = text.charCodeAt(0).toString(16);
        character._dec = text.charCodeAt(0).toString();
        character._text = text;
        character._hasError = text.length > 1;

        return character;
    };
    return UnicodeCharacter;
})();

getUnicodeParser();

function getUnicodeParser() {
    "use strict";
    var input = new InputHandler($("#hexInput"), $("#decInput"), $("#uniInput"), $("#fontInput"));
    var display = new DisplayHandler($("#characterDisplay"), $("#fontDisplay"), input);

    return new UnicodeParser(input, display);
}
//# sourceMappingURL=UnicodeParser.js.map
