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

class InputHandler {
    private defaultHexCode = "2697";

    constructor(public hexInput: JQuery, public decInput: JQuery, public uniInput: JQuery, public fontInput: JQuery) {

    }

    public getDefault() {
        return UnicodeCharacter.getDefault(this.defaultHexCode);
    }

    public bindHexInput(callback: Function) {
        this.bindInput(this.hexInput, callback);
    }

    public bindDecInput(callback: Function) {
        this.bindInput(this.decInput, callback);
    }

    public bindUniInput(callback: Function) {
        this.bindInput(this.uniInput, callback);
    }

    public bindFontInput(callback: Function) {
        this.bindInput(this.fontInput, callback);
    }

    private bindInput(input: JQuery, callback: Function) {
        input.on("keyup bind cut copy paste", () => setTimeout(() => callback(), 100));
    }

    parseHexCodeToUse() {
        var inputeLength = this.getInputLength(this.hexInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getHex(this.hexInput.val());
            return character;
        }
    }

    parseDecCodeToUse() {
        var inputeLength = this.getInputLength(this.decInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getDec(this.decInput.val());
            return character;
        }
    }

    parseUnicodeToUse() {
        var inputeLength = this.getInputLength(this.uniInput);

        if (inputeLength === 0) {
            return UnicodeCharacter.getDefault(this.defaultHexCode);
        } else {
            var character = UnicodeCharacter.getText(this.uniInput.val());
            return character;
        }
    }

    getInputLength(element: JQuery) {
        return (<string>element.val()).length;
    }


    getFont(): Font {
        return new Font(this.fontInput);
    }
}

class DisplayHandler {
    constructor(private displayOutput: JQuery, private fontOutput: JQuery, private fontElements: JQuery, private input: InputHandler) { }

    display(character: UnicodeCharacter) {

        if (character.entryType === EntryType.Default) {
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
    }

    displayFont(font: Font) {
        this.fontElements.css("font-family", font.font);
        var fonts = font.font.split(",");
        if (fonts.length > 1) {
            this.fontOutput.html("Attempting to display with " + fonts[0] +
                ". Your browser will use a fallback if " + fonts[0] + " does not exist.");
        } else {
            this.fontOutput.html("<br/>");
        }

        this.checkFontInputForError(font);
    }

    checkFontInputForError(font: Font) {
        this.checkForError(this.input.fontInput.parent().parent(), font.hasError);
    }


    checkInputsForErrors(character: UnicodeCharacter) {
        if (character.entryType === EntryType.Hex) {
            this.checkForError(this.input.hexInput.parent().parent(), character.hasError);
        } else if (character.entryType === EntryType.Dec) {
            this.checkForError(this.input.decInput.parent().parent(), character.hasError);
        } else if (character.entryType === EntryType.Text) {
            this.checkForError(this.input.uniInput.parent().parent(), character.hasError);
        }
    }

    checkForError(input: JQuery, error: boolean) {
        if (error) {
            input.addClass("has-error");
        } else {
            input.removeClass("has-error");
        }
    }
}

enum EntryType {
    Dec,
    Hex,
    Text,
    Default,
}

class Font {
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

class UnicodeCharacter {
    // reSharper disable InconsistentNaming
    private _dec: string
    private _hex: string
    private _text: string
    private _entryType: EntryType
    private _hasError: boolean
    // reSharper restore InconsistentNaming

    public get dec() {
        return this._dec;
    }

    public get hex() {
        return this._hex;
    }

    public get text() {
        return this._text;
    }

    public get entryType() {
        return this._entryType;
    }

    public get hasError() {
        return this._hasError;
    }

    static getDefault(hex: string) {
        var character = this.getHex(hex);
        character._entryType = EntryType.Default;
        return character;
    }

    static getHex(hex: string) {
        var character = new UnicodeCharacter();

        character._entryType = EntryType.Hex;
        character._hex = hex;
        character._dec = parseInt(hex, 16).toString();
        character._text = String.fromCharCode(parseInt(character.dec, 10));
        character._hasError = !/^[0-9A-F]*$/i.test(hex);

        return character;
    }

    static getDec(dec: string) {
        var character = new UnicodeCharacter();

        character._entryType = EntryType.Dec;
        character._hex = parseInt(dec, 10).toString(16);
        character._dec = dec;
        character._text = String.fromCharCode(parseInt(character.dec, 10));
        character._hasError = !/^[0-9]*$/i.test(dec);

        return character;
    }

    static getText(text: string) {
        var character = new UnicodeCharacter();

        character._entryType = EntryType.Text;
        character._hex = text.charCodeAt(0).toString(16);
        character._dec = text.charCodeAt(0).toString();
        character._text = text;
        character._hasError = text.length > 1;

        return character;
    }
}

getUnicodeParser();

function getUnicodeParser() {
    "use strict";
    var input = new InputHandler($("#hexInput"), $("#decInput"), $("#uniInput"), $("#fontInput"));
    var display = new DisplayHandler($("#characterDisplay"), $("#fontDisplay"), $(".unicode-font-choice"), input);

    return new UnicodeParser(input, display);
}