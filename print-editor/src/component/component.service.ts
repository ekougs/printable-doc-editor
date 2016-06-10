import {Injectable} from "@angular/core";
import {Point} from "./point";
import {Size} from "./size";
import {BoundingRectangle} from "./bounding-rectangle";
import {Length} from "./length";
import {EmConverterProvider, EmConverter} from "./length-converter";

@Injectable()
export class ComponentService {
    constructor(private provider:EmConverterProvider) {
    }

    pxSize(size):string {
        return size + 'px';
    }

    getPositionWithinParentElement(clickEvent, componentSize:Size):Point {
        let position:Point = this.getClickPosition(clickEvent);
        let bounds = this.getParentBoundingRectangle(clickEvent);
        let target = clickEvent.target;
        return this.getPositionWithinBounds(position, componentSize, bounds, this.provider.converter(target));
    }

    private getPositionWithinBounds(position:Point, size:Size, bounds:BoundingRectangle, converter:EmConverter):Point {
        if (bounds.within(position, size, converter)) {
            return position;
        }

        let x = position.x;
        let left:number = x;
        if (!bounds.withinWidth(position, size, converter)) {
            // Because x is relative to parent
            left = x - (x + size.width(converter) - bounds.size.width(converter)) - 10;
        }

        let y = position.y;
        let top:number = y;
        if (!bounds.withinHeight(position, size, converter)) {
            // Because y is relative to parent
            top = y - (y + size.height(converter) - bounds.size.height(converter)) - 5;
        }

        return {
            x: left,
            y: top
        }
    }

    // Special thanks to https://www.kirupa.com/snippets/move_element_to_click_position.htm
    // It would have been much longer to implement this service without this blog post
    getClickPosition(clickEvent):Point {
        let parentPosition = this.getParentPosition(clickEvent);
        var clientX = clickEvent.clientX;
        var clientY = clickEvent.clientY;
        let x = clientX - parentPosition.x; // - (theThing.clientWidth / 2);
        let y = clientY - parentPosition.y; // - (theThing.clientHeight / 2);
        return {
            x: x,
            y: y
        };
    }

    getParentBoundingRectangle(clickEvent):BoundingRectangle {
        let parentPosition:Point = this.getParentPosition(event);
        let boundingClientRect = clickEvent.target.getBoundingClientRect();
        let boundsSize = new Size(new Length(boundingClientRect.width),
            new Length(boundingClientRect.height));
        return new BoundingRectangle(parentPosition, boundsSize);
    }

    private getParentPosition(clickEvent):Point {
        var parent = clickEvent.currentTarget;
        return this.getPosition(parent);
    }

    private getPosition(element):Point {
        var xPosition = 0;
        var yPosition = 0;

        while (element) {
            if (element.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScrollPos = element.scrollLeft || document.documentElement.scrollLeft;
                var yScrollPos = element.scrollTop || document.documentElement.scrollTop;

                xPosition += (element.offsetLeft - xScrollPos + element.clientLeft);
                yPosition += (element.offsetTop - yScrollPos + element.clientTop);
            } else {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            }
            element = element.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    }
}