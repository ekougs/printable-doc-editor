import {it, describe, expect} from "@angular/core/testing";
import {Size} from "../../src/component/size";
import {Length} from "../../src/component/length";
import {LengthUnit} from "../../src/component/length-unit";

describe('inject.service Tests', function () {
    it('should return lengths with correct units', function () {
        let size = new Size(new Length(15), new Length(3, LengthUnit.em));
        expect(size.widthAndUnit()).toEqual("15px");
        expect(size.heightAndUnit()).toEqual("3em");
    });
});
