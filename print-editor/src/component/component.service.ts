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

    height(size:Size, element) {
        return size.height(this.provider.converter(element));
    }

    width(size:Size, element) {
        return size.width(this.provider.converter(element));
    }

    /**
     * A string representing length with pixel unit usable in inline styling of a component
     * @param length: length in pixels
     * @returns {string}
     */
    pxSize(length:number):string {
        return length + 'px';
    }

    /**
     * Helps giving a position within a parent element taking in consideration element's size
     * @param event: a mouse event
     * @param componentSize: size of the element being positioned
     * @param parent: parent of the component being positioned, default value is event's current target
     * @returns {Point} the corrected position
     */
    getPositionWithinParentElement(event, componentSize:Size, parent = event.currentTarget,
                                   yPositionGetter:(position) => number = BoundingRectangle.trivialYGetter):Point {
        let position:Point = this.getPosition(event, parent);
        let bounds = this.getParentBoundingRectangle(parent);
        return this.getPositionWithinBounds(position, componentSize, bounds,
                                            this.provider.converter(event.currentTarget), yPositionGetter);
    }

    /**
     * Helps giving a position within a parent element taking in consideration element's size
     * @param event: a mouse event
     * @param componentSize: size of the element being positioned
     * @param parent: parent of the component being positioned, default value is event's current target
     * @param yPositionGetter : How to get y using position if not trivial
     * @returns {Point} the corrected position
     */
    positionWithinParentElement(event, componentSize:Size, parent = event.currentTarget,
                                yPositionGetter:(position) => number = BoundingRectangle.trivialYGetter):boolean {
        let position:Point = this.getPosition(event, parent);
        let bounds = this.getParentBoundingRectangle(parent);
        return bounds.within(position, componentSize, this.provider.converter(event.currentTarget), yPositionGetter);
    }

    /**
     * Get an element absolute position in page
     * @param element
     * @returns {{x: number, y: number}}
     */
    private getElementPosition(element):Point {
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

    private getPositionWithinBounds(position:Point, size:Size, bounds:BoundingRectangle, converter:EmConverter,
                                    yPositionGetter:(position) => number = BoundingRectangle.trivialYGetter):Point {
        if (bounds.within(position, size, converter, yPositionGetter)) {
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
        if (!bounds.withinHeight(position, size, converter, yPositionGetter)) {
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
    private getPosition(event, parent):Point {
        let parentPosition = this.getElementPosition(parent);
        var clientX = event.clientX;
        var clientY = event.clientY;
        let x = clientX - parentPosition.x; // - (theThing.clientWidth / 2);
        let y = clientY - parentPosition.y; // - (theThing.clientHeight / 2);
        return {
            x: x,
            y: y
        };
    }

    private getParentBoundingRectangle(parent):BoundingRectangle {
        let parentPosition:Point = this.getElementPosition(parent);
        let boundingClientRect = parent.getBoundingClientRect();
        let boundsSize = new Size(new Length(boundingClientRect.width),
            new Length(boundingClientRect.height));
        return new BoundingRectangle(parentPosition, boundsSize);
    }
}