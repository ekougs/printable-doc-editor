import {LengthUnit} from "./length-unit";
import {EmConverter} from "./length-converter";

export class Length {
    constructor(private _length:number, private unit:LengthUnit) {
    }
    
    sizeInPx(converter:EmConverter):number {
        let length = this._length;
        if(LengthUnit.px === this.unit) {
            return length;
        }
        return converter.toPx(length);
    }

    toString():string {
        return this._length + '' + LengthUnit[this.unit];
    }
}