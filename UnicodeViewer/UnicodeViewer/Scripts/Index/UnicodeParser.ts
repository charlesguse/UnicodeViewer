class UnicodeParser {
    private defaultFonts = "Times New Roman";


    constructor(private codeInput: JQuery, private displayOutput: JQuery, private fontInput: JQuery, private fontOutput: JQuery, private defaultCode: string) {
        this.initBindings();

        codeInput.attr("placeholder", defaultCode);
        fontInput.attr("placeholder", this.defaultFonts.split(",")[0]);
        this.displayOutput.css("font-family", this.defaultFonts);

        var output = this.parseInput(defaultCode);
        this.display(output);
    }

    initBindings() {
        this.codeInput.on("keyup bind cut copy paste", () => this.onCharacterInputKeyUp());
        this.fontInput.on("keyup bind cut copy paste", () => this.onFontInputKeyUp());
    }

    onCharacterInputKeyUp() {
        var code = this.parseCodeToUse();
        var output = this.parseInput(code);
        this.display(output);
    }

    parseCodeToUse() {
        var code = this.defaultCode;
        if (this.getInputLength(this.codeInput) > 0) {
            code = <string>this.codeInput.val();

            //if (code)
        }
        return code;
    }

    onFontInputKeyUp() {
        this.setDisplayFontFamily(this.fontInput.val());

        if (this.getInputLength(this.fontInput) == 0) {
            this.fontInput.parent().parent().removeClass("has-error");
            this.fontInput.parent().parent().removeClass("has-success");
        } else if (this.doesFontExist(this.fontInput.val())) {
        //} else if (this.fontExists(this.fontInput.val())) {
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

    //getDisplayFontFamily() {
    //    return this.displayOutput.css("font-family");
    //}

    setDisplayFontFamily(newFont: string) {
        if (newFont === null ||
            newFont === undefined ||
            newFont.length === 0) {
            this.displayOutput.css("font-family", this.defaultFonts);
        }
            
        this.displayOutput.css("font-family", newFont + "," + this.defaultFonts);
    }

    parseInput(input: string): string {
        return String.fromCharCode(parseInt(input, 16));
    }

    display(text: string) {
        this.displayOutput.html(text + "<br/>");
        this.fontOutput.html(document.getElementById(this.displayOutput.attr("id")).style.font);
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

        //console.log(font + "\nClone Width: " + clone.width() + "\nDummy Width: " + dummy.width());
        var difference = Math.abs(clone.width() - dummy.width());

        if (difference >= 1) {
            exists = true;
        }
        clone.remove();
        dummy.remove();

        return exists;
    }
}

//$(document).ready(function() {
//    var parser = getUnicodeParser();
//});
var parser = getUnicodeParser();

function getUnicodeParser() {
    return new UnicodeParser($("#characterInput"), $("#characterDisplay"), $("#fontInput"), $("#fontDisplay"), "2620");
}