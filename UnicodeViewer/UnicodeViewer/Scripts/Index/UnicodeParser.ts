﻿class UnicodeParser {
    //private character: UnicodeCharacter;
    private defaultFonts = "Times New Roman";


    constructor(private codeInput: JQuery, private displayOutput: JQuery, private fontInput: JQuery, private fontOutput: JQuery, private defaultCode: string) {
        this.initBindings();

        codeInput.attr("placeholder", defaultCode);
        fontInput.attr("placeholder", this.defaultFonts.split(",")[0]);
        this.displayOutput.css("font-family", this.defaultFonts);

        var defaultCharacter = UnicodeCharacter.getHex(this.defaultCode);
        //var output = this.parseInput(defaultCode);
        this.display(defaultCharacter);
    }

    initBindings() {
        this.codeInput.on("keyup bind cut copy paste", () => setTimeout(() => this.onCharacterInputKeyUp(), 100));
        this.fontInput.on("keyup bind cut copy paste", () => setTimeout(() => this.onFontInputKeyUp(), 100));
    }

    onCharacterInputKeyUp() {
        var character = this.parseCodeToUse();
        //var output = this.parseInput(defaultCharacter);
        this.display(character);
    }

    parseCodeToUse() {
        var inputeLength = this.getInputLength(this.codeInput);

        if (inputeLength === 1) {
            return UnicodeCharacter.getText(this.codeInput.val());
        } else if (this.getInputLength(this.codeInput) > 0) {
            return UnicodeCharacter.getHex(this.codeInput.val());
        }
        return UnicodeCharacter.getHex(this.defaultCode);
    }

    onFontInputKeyUp() {
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
    }

    getInputLength(element: JQuery) {
        return (<string>element.val()).length;
    }

    setDisplayFontFamily(newFont: string) {
        if (newFont === null ||
            newFont === undefined ||
            newFont.length === 0) {
            this.displayOutput.css("font-family", this.defaultFonts);
        }

        this.displayOutput.css("font-family", newFont + "," + this.defaultFonts);
    }

    display(character: UnicodeCharacter) {
        if (character.entryType == EntryType.Hex || character.entryType == EntryType.Dec) {
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
    }

    getDisplayOutputFont() {
        var fonts = this.displayOutput.css("font-family").split(",");

        var fontUsed: string = "";

        for (var i = 0; i < fonts.length; i++) {
            if (this.doesFontExist(fonts[i])) {
                fontUsed = fonts[i];
                break;
            }
        }
        return fontUsed;
    }

    doesFontExist(font: string) {
        if (font == "Comic Sans MS" || font == "'Comic Sans MS'") {
            return true;
        }

        var clone = $('<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>').css({ 'font-family': "Comic Sans MS", 'font-size': '100px', 'display': 'inline', 'visibility': 'hidden' }).appendTo('body');
        var dummy = $('<span>abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890</span>').css({ 'font-family': font + ",'Comic Sans MS'", 'font-size': '100px', 'display': 'inline', 'visibility': 'hidden' }).appendTo('body');
        var exists: boolean = false;
        var difference = clone.width() - dummy.width();

        if (difference != 0) {
            exists = true;
        }
        clone.remove();
        dummy.remove();

        return exists;
    }
}

enum EntryType {
    Dec,
    Hex,
    Text
}

class UnicodeCharacter {
    // ReSharper disable InconsistentNaming
    private _dec: number
    private _hex: string
    private _text: string
    private _entryType: EntryType
    // ReSharper restore InconsistentNaming

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

    static getHex(hex: string) {
        var character = new UnicodeCharacter();

        character._entryType = EntryType.Hex;
        character._dec = parseInt(hex, 16);
        character._hex = hex;
        character._text = String.fromCharCode(character.dec);

        return character;
    }

    static getDec(dec: number) {
        var character = new UnicodeCharacter();

        character._entryType = EntryType.Dec;
        character._hex = dec.toString(16);
        character._dec = dec;
        character._text = String.fromCharCode(character.dec);

        return character;
    }

    static getText(text: string) {
        var character = new UnicodeCharacter();

        character._entryType = EntryType.Text;
        if (text.length == 1) {
            character._dec = text.charCodeAt(0);
        } else {
            character._dec = NaN;
        }
        character._hex = character.dec.toString(16);
        character._text = text;

        return character;
    }
}

var parser = getUnicodeParser();

function getUnicodeParser() {
    //return new UnicodeParser($("#characterInput"), $("#characterDisplay"), $("#fontInput"), $("#fontDisplay"), "2620");
    return new UnicodeParser($("#characterInput"), $("#characterDisplay"), $("#fontInput"), $("#fontDisplay"), "2697");
}