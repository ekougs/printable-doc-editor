"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Rx_1 = require("rxjs/Rx");
var component_service_1 = require("./component/component.service");
var length_1 = require("./component/length");
var size_1 = require("./component/size");
var DraggableDirective = (function () {
    function DraggableDirective(_element, _service) {
        this._element = _element;
        this._service = _service;
    }
    DraggableDirective.prototype.ngOnInit = function () {
        var _this = this;
        var nativeElement = this._element.nativeElement;
        nativeElement.setAttribute('draggable', 'true');
        var dragstarts = Rx_1.Observable.fromEvent(nativeElement, 'dragstart');
        var dragends = Rx_1.Observable.fromEvent(nativeElement, 'dragend');
        dragstarts.subscribe(function () {
            nativeElement.className += ' dragging';
        });
        dragends.subscribe(function (event) {
            _this.moveElementOnDragEnd(event, nativeElement);
        });
    };
    DraggableDirective.prototype.moveElementOnDragEnd = function (event, nativeElement) {
        var _this = this;
        var service = this._service;
        var parent = nativeElement.offsetParent;
        nativeElement.className = nativeElement.className.replace(' dragging', '');
        var size = this.getSize(nativeElement);
        // This one is necessary for the moment otherwise height 'jumps' by element size
        var yPositionGetter = function (position) {
            return position.y - _this._service.height(size, nativeElement);
        };
        if (service.positionWithinParentElement(event, size, parent, yPositionGetter)) {
            var position = service.getPositionWithinParentElement(event, size, parent, yPositionGetter);
            nativeElement.style.left = service.pxSize(position.x);
            nativeElement.style.top = service.pxSize(yPositionGetter(position));
        }
    };
    DraggableDirective.prototype.getSize = function (element) {
        var rect = element.getBoundingClientRect();
        return new size_1.Size(new length_1.Length(rect.width), new length_1.Length(rect.height));
    };
    DraggableDirective = __decorate([
        core_1.Directive({
            selector: '[draggable]'
        }), 
        __metadata('design:paramtypes', [core_1.ElementRef, component_service_1.ComponentService])
    ], DraggableDirective);
    return DraggableDirective;
}());
exports.DraggableDirective = DraggableDirective;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhZ2dhYmxlLmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRyYWdnYWJsZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUE0QyxlQUFlLENBQUMsQ0FBQTtBQUM1RCxtQkFBeUIsU0FBUyxDQUFDLENBQUE7QUFDbkMsa0NBQStCLCtCQUErQixDQUFDLENBQUE7QUFDL0QsdUJBQXFCLG9CQUFvQixDQUFDLENBQUE7QUFDMUMscUJBQW1CLGtCQUFrQixDQUFDLENBQUE7QUFLdEM7SUFDSSw0QkFBb0IsUUFBbUIsRUFBVSxRQUF5QjtRQUF0RCxhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBaUI7SUFDMUUsQ0FBQztJQUVELHFDQUFRLEdBQVI7UUFBQSxpQkFhQztRQVpHLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsYUFBYSxDQUFDO1FBQ2hELGFBQWEsQ0FBQyxZQUFZLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBRWhELElBQUksVUFBVSxHQUFHLGVBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xFLElBQUksUUFBUSxHQUFHLGVBQVUsQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1FBRTlELFVBQVUsQ0FBQyxTQUFTLENBQUM7WUFDakIsYUFBYSxDQUFDLFNBQVMsSUFBSSxXQUFXLENBQUM7UUFDM0MsQ0FBQyxDQUFDLENBQUM7UUFDSCxRQUFRLENBQUMsU0FBUyxDQUFDLFVBQUMsS0FBSztZQUNyQixLQUFJLENBQUMsb0JBQW9CLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3BELENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLGlEQUFvQixHQUE1QixVQUE2QixLQUFLLEVBQUUsYUFBYTtRQUFqRCxpQkFjQztRQWJHLElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7UUFDNUIsSUFBSSxNQUFNLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQztRQUN4QyxhQUFhLENBQUMsU0FBUyxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUMzRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZDLGdGQUFnRjtRQUNoRixJQUFJLGVBQWUsR0FBd0IsVUFBQyxRQUFRO1lBQ2hELE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLEtBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUNsRSxDQUFDLENBQUM7UUFDRixFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsMkJBQTJCLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzVFLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLENBQUMsQ0FBQztZQUM1RixhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0RCxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLGVBQWUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLENBQUM7SUFDTCxDQUFDO0lBRU8sb0NBQU8sR0FBZixVQUFnQixPQUFPO1FBQ25CLElBQUksSUFBSSxHQUFHLE9BQU8sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLFdBQUksQ0FBQyxJQUFJLGVBQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsSUFBSSxlQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7SUFDckUsQ0FBQztJQXpDTDtRQUFDLGdCQUFTLENBQUM7WUFDSSxRQUFRLEVBQUUsYUFBYTtTQUMxQixDQUFDOzswQkFBQTtJQXdDYix5QkFBQztBQUFELENBQUMsQUF2Q0QsSUF1Q0M7QUF2Q1ksMEJBQWtCLHFCQXVDOUIsQ0FBQSJ9