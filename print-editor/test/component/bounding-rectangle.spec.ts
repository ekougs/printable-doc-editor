import {describe, it, expect} from "@angular/core/testing";
import {BoundingRectangle} from "../../src/component/bounding-rectangle";
import {Point} from "../../src/component/point";
import {Size} from "../../src/component/size";
import {EmConverter} from "../../src/component/length-converter";
import {point, size} from "../utils";

describe("Bounding rectangle tests", function () {
    let origin:Point = point(220, 80);
    let boundsSize:Size = size(550, 280);
    let bounds:BoundingRectangle = new BoundingRectangle(origin, boundsSize);
    let dummyConverter:EmConverter = {
        toPx(lengthInEm:number): number {
            return 0;
        }
    };

    it("should consider element with origin (250, 100) and size (150, 100) within", function () {
        expect(bounds.within(point(250, 100), size(150, 100), dummyConverter)).toBeTruthy();
    });

    it("should consider element with origin (500, 300) and size (150, 100) not within", function () {
        expect(bounds.within(point(500, 300), size(150, 100), dummyConverter)).toBeFalsy();
    });

    it("should consider element with origin (500, 300) and size (150, 100) not within width", function () {
        expect(bounds.withinWidth(point(500, 300), size(150, 100), dummyConverter)).toBeFalsy();
    });

    it("should consider element with origin (500, 300) and size (150, 100) not within height", function () {
        expect(bounds.withinHeight(point(500, 300), size(150, 100), dummyConverter)).toBeFalsy();
    });
});