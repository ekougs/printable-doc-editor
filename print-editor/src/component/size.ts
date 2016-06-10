import {Length} from "./length";
import {EmConverter} from "./length-converter";

export class Size {
    constructor(private _width:Length, private _height:Length){
    }
    
    width(converter:EmConverter):number {
        return this._width.sizeInPx(converter);
    }
    
    widthAndUnit():string {
        return this._width.toString();
    }
    
    height(converter:EmConverter):number {
        return this._height.sizeInPx(converter);
    }

    heightAndUnit():string {
        return this._height.toString();
    }
}