import {Injectable} from "@angular/core";

export interface Point {
    x:number;
    y:number;
}

// Special thanks to https://www.kirupa.com/snippets/move_element_to_click_position.htm
// It would have been much longer to implement this service without this blog post
@Injectable()
export class PositionService {

    getClickPosition(clickEvent):Point {
        var parent = clickEvent.currentTarget;
        let parentPosition = this.getPosition(parent);
        var clientX = clickEvent.clientX;
        var clientY = clickEvent.clientY;
        let x = clientX - parentPosition.x; // - (theThing.clientWidth / 2);
        // To compensate induced Angular 2 container height
        let y = clientY - parentPosition.y + parent.offsetParent.offsetHeight - parent.offsetHeight; // - (theThing.clientHeight / 2);
        return {
            x: x,
            y: y
        };
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