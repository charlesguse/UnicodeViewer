var UnicodeParser = (function () {
    function UnicodeParser(codeInput, displayOutput, fontInput, fontOutput, defaultCode) {
        this.codeInput = codeInput;
        this.displayOutput = displayOutput;
        this.fontInput = fontInput;
        this.fontOutput = fontOutput;
        this.defaultCode = defaultCode;
        this.defaultFonts = "Times New Roman";
        this.initBindings();

        codeInput.attr("placeholder", defaultCode);
        fontInput.attr("placeholder", this.defaultFonts.split(",")[0]);
        this.displayOutput.css("font-family", this.defaultFonts);

        var output = this.parseInput(defaultCode);
        this.display(output);
    }
    UnicodeParser.prototype.initBindings = function () {
        var _this = this;
        this.codeInput.on("keyup bind cut copy paste", function () {
            return _this.onCharacterInputKeyUp();
        });
        this.fontInput.on("keyup bind cut copy paste", function () {
            return _this.onFontInputKeyUp();
        });
    };

    UnicodeParser.prototype.onCharacterInputKeyUp = function () {
        var code = this.parseCodeToUse();
        var output = this.parseInput(code);
        this.display(output);
    };

    UnicodeParser.prototype.parseCodeToUse = function () {
        var code = this.defaultCode;
        if (this.getInputLength(this.codeInput) > 0) {
            code = this.codeInput.val();
        }
        return code;
    };

    UnicodeParser.prototype.onFontInputKeyUp = function () {
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
    };

    UnicodeParser.prototype.getInputLength = function (element) {
        return element.val().length;
    };

    //getDisplayFontFamily() {
    //    return this.displayOutput.css("font-family");
    //}
    UnicodeParser.prototype.setDisplayFontFamily = function (newFont) {
        if (newFont === null || newFont === undefined || newFont.length === 0) {
            this.displayOutput.css("font-family", this.defaultFonts);
        }

        this.displayOutput.css("font-family", newFont + "," + this.defaultFonts);
    };

    UnicodeParser.prototype.parseInput = function (input) {
        return String.fromCharCode(parseInt(input, 16));
    };

    UnicodeParser.prototype.display = function (text) {
        this.displayOutput.html(text + "<br/>");
        this.fontOutput.html(document.getElementById(this.displayOutput.attr("id")).style.font);
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

        //console.log(font + "\nClone Width: " + clone.width() + "\nDummy Width: " + dummy.width());
        var difference = Math.abs(clone.width() - dummy.width());

        if (difference >= 1) {
            exists = true;
        }
        clone.remove();
        dummy.remove();

        return exists;
    };
    return UnicodeParser;
})();

//$(document).ready(function() {
//    var parser = getUnicodeParser();
//});
var parser = getUnicodeParser();

function getUnicodeParser() {
    return new UnicodeParser($("#characterInput"), $("#characterDisplay"), $("#fontInput"), $("#fontDisplay"), "2620");
}
//# sourceMappingURL=UnicodeParser.js.map
