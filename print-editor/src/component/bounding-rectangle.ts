import {Point} from "./point";
import {Size} from "./size";
import {EmConverter} from "./length-converter";

export class BoundingRectangle {
    constructor(private _topLeft:Point, private _size:Size) {
    }

    get topLeft():Point {
        return this._topLeft;
    }

    get size():Size {
        return this._size;
    }

    within(position:Point, size:Size, converter:EmConverter):boolean {
        return this.withinWidth(position, size, converter) && this.withinHeight(position, size, converter);
    }

    withinWidth(position:Point, size:Size, converter:EmConverter):boolean {
        let x = position.x + this._topLeft.x;
        let furthestPointX = x + size.width(converter);
        return this._topLeft.x <= x && furthestPointX <= this._topLeft.x + this._size.width(converter);
    }

    withinHeight(position:Point, size:Size, converter:EmConverter):boolean {
        let y = position.y + this._topLeft.y;
        let furthestPointY = y + size.height(converter);
        return this._topLeft.y <= y && furthestPointY <= this._topLeft.y + this._size.height(converter);
    }
}