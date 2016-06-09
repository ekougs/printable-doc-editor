import {Injectable, Injector, ReflectiveInjector, Provider} from "@angular/core";

export interface Point {
    x:number;
    y:number;
}

@Injectable()
export class ComponentService {
    pxSize(size):string {
        return size + 'px';
    }

    injector(baseInjector:Injector, ...providers:Provider[]):Injector {
        let reflectiveInjector = ReflectiveInjector.resolveAndCreate(providers);
        return new ComposedInjector(baseInjector, reflectiveInjector);
    }

    guid():string {
        let s4 = this.s4;
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }


    // Special thanks to https://www.kirupa.com/snippets/move_element_to_click_position.htm
    // It would have been much longer to implement this service without this blog post
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

class ComposedInjector extends Injector {
    constructor(private _injector1:Injector, private _injector2:Injector) {
        super();
    }

    get(token:any, notFoundValue?:any) {
        let result = undefined;
        try {
            result = this._injector1.get(token, notFoundValue);
        } catch (e) {

        }
        try {
            result = this._injector2.get(token, notFoundValue);
        } catch (e) {

        }
        if (result === undefined) {
            throw new Error("No provider for " + token)
        }
        return result;
    }
}