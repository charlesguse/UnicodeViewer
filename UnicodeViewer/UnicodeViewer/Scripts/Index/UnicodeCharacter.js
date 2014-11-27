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
//# sourceMappingURL=UnicodeCharacter.js.map
