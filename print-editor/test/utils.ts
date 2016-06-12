import {Point} from "../src/component/point";
import {Size} from "../src/component/size";
import {Length} from "../src/component/length";

export const point:(x:number, y:number)=>Point = (x, y) => {
    return {x: x, y: y};
};

export const size:(width:number, height:number)=>Size = (width, height) => {
    return new Size(new Length(width), new Length(height));
};