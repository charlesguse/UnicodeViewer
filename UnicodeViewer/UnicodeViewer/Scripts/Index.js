var Displayer = (function () {
    function Displayer() {
    }
    Displayer.prototype.checkForError = function (input, error) {
        if (error) {
            input.addClass("has-error");
        } else {
            input.removeClass("has-error");
        }
    };
    return Displayer;
})();
var EntryType;
(function (EntryType) {
    EntryType[EntryType["Dec"] = 0] = "Dec";
    EntryType[EntryType["Hex"] = 1] = "Hex";
    EntryType[EntryType["Text"] = 2] = "Text";
    EntryType[EntryType["Default"] = 3] = "Default";
})(EntryType || (EntryType = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var FontDisplayer = (function (_super) {
    __extends(FontDisplayer, _super);
    function FontDisplayer(fontOutput, fontElements, handler) {
        _super.call(this);
        this.fontOutput = fontOutput;
        this.fontElements = fontElements;
        this.handler = handler;
    }
    FontDisplayer.prototype.display = function (font) {
        this.fontElements.css("font-family", font.font);
        var fonts = font.font.split(",");
        if (fonts.length > 1) {
            this.fontOutput.html("Attempting to display with " + fonts[0] + ". Your browser will use a fallback if " + fonts[0] + " does not exist.");
        } else {
            this.fontOutput.html("<br/>");
        }

        this.checkFontInputForError(font);
    };

    FontDisplayer.prototype.checkFontInputForError = function (font) {
        this.checkForError(this.handler.fontInput.parent().parent(), font.hasError);
    };
    return FontDisplayer;
})(Displayer);
var FontHandler = (function () {
    function FontHandler(fontInput) {
        this.fontInput = fontInput;
    }
    FontHandler.prototype.bindFontInput = function (callback) {
        this.bindInput(this.fontInput, callback);
    };

    FontHandler.prototype.bindInput = function (input, callback) {
        input.on("keyup bind cut copy paste", function () {
            return setTimeout(function () {
                return callback();
            }, 100);
        });
    };

    FontHandler.prototype.getFont = function () {
        return new UnicodeFont(this.fontInput);
    };
    return FontHandler;
})();
var InputDisplayer = (function (_super) {
    __extends(InputDisplayer, _super);
    function InputDisplayer(displayOutput, input) {
        _super.call(this);
        this.displayOutput = displayOutput;
        this.input = input;
    }
    InputDisplayer.prototype.display = function (character) {
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

    InputDisplayer.prototype.checkInputsForErrors = function (character) {
        if (character.entryType === 1 /* Hex */) {
            this.checkForError(this.input.hexInput.parent().parent(), character.hasError);
        } else if (character.entryType === 0 /* Dec */) {
            this.checkForError(this.input.decInput.parent().parent(), character.hasError);
        } else if (character.entryType === 2 /* Text */) {
            this.checkForError(this.input.uniInput.parent().parent(), character.hasError);
        }
    };
    return InputDisplayer;
})(Displayer);
var InputHandler = (function () {
    function InputHandler(hexInput, decInput, uniInput) {
        this.hexInput = hexInput;
        this.decInput = decInput;
        this.uniInput = uniInput;
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
    return InputHandler;
})();
var UnicodeCharacter = (function () {
    function UnicodeCharacter() {
    }
    Object.defineProperty(UnicodeCharacter.prototype, "dec", {
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
var UnicodeFont = (function () {
    function UnicodeFont(fontInput) {
        this.defaultFonts = "Segoe UI Symbol";
        var fontLength = this.getInputLength(fontInput);
        var fontExists = this.doesFontExist(fontInput.val());

        this._font = this.defaultFonts;
        if (fontLength > 0 && fontExists) {
            this._font = fontInput.val() + "," + this.defaultFonts;
        }
        this._hasError = fontLength > 0 && !fontExists;
    }
    Object.defineProperty(UnicodeFont.prototype, "font", {
        get: function () {
            return this._font;
        },
        enumerable: true,
        configurable: true
    });

    Object.defineProperty(UnicodeFont.prototype, "hasError", {
        get: function () {
            return this._hasError;
        },
        enumerable: true,
        configurable: true
    });

    UnicodeFont.prototype.doesFontExist = function (font) {
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

    UnicodeFont.prototype.getInputLength = function (element) {
        return element.val().length;
    };
    return UnicodeFont;
})();
var UnicodeParser = (function () {
    function UnicodeParser(input, display, fontInput, fontDisplay) {
        this.input = input;
        this.display = display;
        this.fontInput = fontInput;
        this.fontDisplay = fontDisplay;
        this.initBindings();

        if (this.hasInputHandlerAndDisplayer()) {
            var defaultCharacter = this.input.getDefault();
            this.display.display(defaultCharacter);
        }
        var font = this.fontInput.getFont();
        this.fontDisplay.display(font);
    }
    UnicodeParser.prototype.initBindings = function () {
        var _this = this;
        if (this.hasInputHandlerAndDisplayer()) {
            this.input.bindHexInput(function () {
                return _this.onHexInputKeyUp();
            });
            this.input.bindDecInput(function () {
                return _this.onDecInputKeyUp();
            });
            this.input.bindUniInput(function () {
                return _this.onUniInputKeyUp();
            });
        }
        this.fontInput.bindFontInput(function () {
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
        var font = this.fontInput.getFont();
        this.fontDisplay.display(font);
    };

    UnicodeParser.prototype.hasInputHandlerAndDisplayer = function () {
        return this.input != null && this.display != null;
    };
    return UnicodeParser;
})();
