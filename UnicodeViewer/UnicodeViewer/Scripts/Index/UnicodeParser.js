var UnicodeParser = (function () {
    function UnicodeParser(codeInput, displayOutput, fontInput, fontOutput, defaultCode) {
        this.codeInput = codeInput;
        this.displayOutput = displayOutput;
        this.fontInput = fontInput;
        this.fontOutput = fontOutput;
        this.defaultCode = defaultCode;
        //private character: UnicodeCharacter;
        this.defaultFonts = "Times New Roman";
        this.initBindings();

        codeInput.attr("placeholder", defaultCode);
        fontInput.attr("placeholder", this.defaultFonts.split(",")[0]);
        this.displayOutput.css("font-family", this.defaultFonts);

        var defaultCharacter = UnicodeCharacter.getHex(this.defaultCode);

        //var output = this.parseInput(defaultCode);
        this.display(defaultCharacter);
    }
    UnicodeParser.prototype.initBindings = function () {
        var _this = this;
        this.codeInput.on("keyup bind cut copy paste", function () {
            return setTimeout(function () {
                return _this.onCharacterInputKeyUp();
            }, 100);
        });
        this.fontInput.on("keyup bind cut copy paste", function () {
            return setTimeout(function () {
                return _this.onFontInputKeyUp();
            }, 100);
        });
    };

    UnicodeParser.prototype.onCharacterInputKeyUp = function () {
        var character = this.parseCodeToUse();

        //var output = this.parseInput(defaultCharacter);
        this.display(character);
    };

    UnicodeParser.prototype.parseCodeToUse = function () {
        var inputeLength = this.getInputLength(this.codeInput);

        if (inputeLength === 1) {
            return UnicodeCharacter.getText(this.codeInput.val());
        } else if (this.getInputLength(this.codeInput) > 0) {
            return UnicodeCharacter.getHex(this.codeInput.val());
        }
        return UnicodeCharacter.getHex(this.defaultCode);
    };

    UnicodeParser.prototype.onFontInputKeyUp = function () {
        this.setDisplayFontFamily(this.fontInput.val());

        if (this.getInputLength(this.fontInput) == 0) {
            this.fontInput.parent().parent().removeClass("has-error");
            this.fontInput.parent().parent().removeClass("has-success");
        } else if (this.doesFontExist(this.fontInput.val())) {
            this.fontInput.parent().parent().removeClass("has-error");
            this.fontInput.parent().parent().addClass("has-success");
        } else {
            this.fontInput.parent().parent().removeClass("has-success");
            this.fontInput.parent().parent().addClass("has-error");
        }

        this.onCharacterInputKeyUp();
    };

    UnicodeParser.prototype.getInputLength = function (element) {
        return element.val().length;
    };

    UnicodeParser.prototype.setDisplayFontFamily = function (newFont) {
        if (newFont === null || newFont === undefined || newFont.length === 0) {
            this.displayOutput.css("font-family", this.defaultFonts);
        }

        this.displayOutput.css("font-family", newFont + "," + this.defaultFonts);
    };

    UnicodeParser.prototype.display = function (character) {
        if (character.entryType == 1 /* Hex */ || character.entryType == 0 /* Dec */) {
            if (!character.dec) {
                this.displayOutput.html("<div style='font-size: 36px'> Enter a single unicode character or Hexidecimal (0-f)</div>");
            } else {
                //this.displayOutput.html(character.text + "<br/>");
                this.displayOutput.html(character.text);
            }
        } else {
            //this.displayOutput.html("U+" + character.hex + "<br/>");
            this.displayOutput.html("U+" + character.hex);
        }
        this.fontOutput.html(this.getDisplayOutputFont());
    };

    UnicodeParser.prototype.getDisplayOutputFont = function () {
        var fonts = this.displayOutput.css("font-family").split(",");

        var fontUsed = "";

        for (var i = 0; i < fonts.length; i++) {
            if (this.doesFontExist(fonts[i])) {
                fontUsed = fonts[i];
                break;
            }
        }
        return fontUsed;
    };

    UnicodeParser.prototype.doesFontExist = function (font) {
        if (font == "Comic Sans MS" || font == "'Comic Sans MS'") {
            return true;
        }

        var clone = $('<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>').css({ 'font-family': "Comic Sans MS", 'font-size': '100px', 'display': 'inline', 'visibility': 'hidden' }).appendTo('body');
        var dummy = $('<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>').css({ 'font-family': font + ",'Comic Sans MS'", 'font-size': '100px', 'display': 'inline', 'visibility': 'hidden' }).appendTo('body');
        var exists = false;
        var difference = clone.width() - dummy.width();

        if (difference != 0) {
            exists = true;
        }
        clone.remove();
        dummy.remove();

        return exists;
    };
    return UnicodeParser;
})();

var EntryType;
(function (EntryType) {
    EntryType[EntryType["Dec"] = 0] = "Dec";
    EntryType[EntryType["Hex"] = 1] = "Hex";
    EntryType[EntryType["Text"] = 2] = "Text";
})(EntryType || (EntryType = {}));

var UnicodeCharacter = (function () {
    function UnicodeCharacter() {
    }
    Object.defineProperty(UnicodeCharacter.prototype, "dec", {
        // ReSharper restore InconsistentNaming
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

    UnicodeCharacter.getHex = function (hex) {
        var character = new UnicodeCharacter();

        character._entryType = 1 /* Hex */;
        character._dec = parseInt(hex, 16);
        character._hex = hex;
        character._text = String.fromCharCode(character.dec);

        return character;
    };

    UnicodeCharacter.getDec = function (dec) {
        var character = new UnicodeCharacter();

        character._entryType = 0 /* Dec */;
        character._hex = dec.toString(16);
        character._dec = dec;
        character._text = String.fromCharCode(character.dec);

        return character;
    };

    UnicodeCharacter.getText = function (text) {
        var character = new UnicodeCharacter();

        character._entryType = 2 /* Text */;
        if (text.length == 1) {
            character._dec = text.charCodeAt(0);
        } else {
            character._dec = NaN;
        }
        character._hex = character.dec.toString(16);
        character._text = text;

        return character;
    };
    return UnicodeCharacter;
})();

var parser = getUnicodeParser();

function getUnicodeParser() {
    //return new UnicodeParser($("#characterInput"), $("#characterDisplay"), $("#fontInput"), $("#fontDisplay"), "2620");
    return new UnicodeParser($("#characterInput"), $("#characterDisplay"), $("#fontInput"), $("#fontDisplay"), "2697");
}
//# sourceMappingURL=UnicodeParser.js.map
