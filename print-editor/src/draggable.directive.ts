import {Directive, ElementRef, OnInit} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {ComponentService} from "./component/component.service";
import {Length} from "./component/length";
import {Size} from "./component/size";

@Directive({
               selector: '[draggable]'
           })
export class DraggableDirective implements OnInit {
    constructor(private _element:ElementRef, private _service:ComponentService) {
    }

    ngOnInit() {
        let nativeElement = this._element.nativeElement;
        nativeElement.setAttribute('draggable', 'true');

        let dragstarts = Observable.fromEvent(nativeElement, 'dragstart');
        let dragends = Observable.fromEvent(nativeElement, 'dragend');

        dragstarts.subscribe(() => {
            nativeElement.className += ' dragging';
        });
        dragends.subscribe((event) => {
            this.moveElementOnDragEnd(event, nativeElement);
        });
    }
    
    private moveElementOnDragEnd(event, nativeElement) {
        let service = this._service;
        let parent = nativeElement.offsetParent;
        nativeElement.className = nativeElement.className.replace(' dragging', '');
        let size = this.getSize(nativeElement);
        // This one is necessary for the moment otherwise height 'jumps' by element size
        let yPositionGetter:(position) => number = (position) => {
            return position.y - this._service.height(size, nativeElement);
        };
        if (service.positionWithinParentElement(event, size, parent, yPositionGetter)) {
            let position = service.getPositionWithinParentElement(event, size, parent, yPositionGetter);
            nativeElement.style.left = service.pxSize(position.x);
            nativeElement.style.top = service.pxSize(yPositionGetter(position));
        }
    }

    private getSize(element):Size {
        let rect = element.getBoundingClientRect();
        return new Size(new Length(rect.width), new Length(rect.height));
    }
}