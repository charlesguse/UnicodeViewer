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
        // reSharper restore InconsistentNaming
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
//# sourceMappingURL=UnicodeFont.js.map
