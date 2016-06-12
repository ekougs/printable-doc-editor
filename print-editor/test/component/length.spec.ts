import {describe, it, expect} from "@angular/core/testing";
import {Length} from "../../src/component/length";
import {EmConverter} from "../../src/component/length-converter";
import {LengthUnit} from "../../src/component/length-unit";

describe("Bounding rectangle tests", function () {
    let converter:EmConverter = {
        toPx(lengthInEm:number): number {
            return lengthInEm * 10;
        }
    };

    it("should convert length 250px to 250 within", function () {
        let length = new Length(250);
        expect(length.sizeInPx(converter)).toEqual(250);
    });

    it("should convert length 10em to 100 within", function () {
        let length = new Length(10, LengthUnit.em);
        expect(length.sizeInPx(converter)).toEqual(100);
    });
});