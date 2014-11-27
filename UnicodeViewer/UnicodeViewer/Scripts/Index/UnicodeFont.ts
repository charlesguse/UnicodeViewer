class UnicodeFont {
    private defaultFonts = "Segoe UI Symbol";// ", Lucida Grande, Unifont";
    // reSharper disable InconsistentNaming
    private _font: string
    private _hasError: boolean
    // reSharper restore InconsistentNaming

    public get font() {
        return this._font;
    }

    public get hasError() {
        return this._hasError;
    }

    constructor(fontInput: JQuery) {
        var fontLength = this.getInputLength(fontInput);
        var fontExists = this.doesFontExist(fontInput.val());

        this._font = this.defaultFonts;
        if (fontLength > 0 && fontExists) {
            this._font = fontInput.val() + "," + this.defaultFonts;
        }
        this._hasError = fontLength > 0 && !fontExists;
    }

    doesFontExist(font: string) {
        if (font == null || font.length === 0) {
            return false;
        } else if (font === "Comic Sans MS" || font === "'Comic Sans MS'") {
            return true;
        }

        var base = $("<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>")
            .css({ "font-family": "Comic Sans MS", "font-size": "100px", "display": "inline", "visibility": "hidden" })
            .appendTo("body");
        var test = $("<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>")
            .css({ "font-family": font + ",'Comic Sans MS'", "font-size": "100px", "display": "inline", "visibility": "hidden" })
            .appendTo("body");
        var exists: boolean = false;
        var difference = base.width() - test.width();

        if (difference !== 0) {
            exists = true;
        }
        base.remove();
        test.remove();

        return exists;
    }

    getInputLength(element: JQuery) {
        return (<string>element.val()).length;
    }
} 