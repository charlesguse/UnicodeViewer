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
