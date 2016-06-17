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
var size_1 = require("./size");
var bounding_rectangle_1 = require("./bounding-rectangle");
var length_1 = require("./length");
var length_converter_1 = require("./length-converter");
var ComponentService = (function () {
    function ComponentService(provider) {
        this.provider = provider;
    }
    ComponentService.prototype.height = function (size, element) {
        return size.height(this.provider.converter(element));
    };
    ComponentService.prototype.width = function (size, element) {
        return size.width(this.provider.converter(element));
    };
    /**
     * A string representing length with pixel unit usable in inline styling of a component
     * @param length: length in pixels
     * @returns {string}
     */
    ComponentService.prototype.pxSize = function (length) {
        return length + 'px';
    };
    /**
     * Helps giving a position within a parent element taking in consideration element's size
     * @param event: a mouse event
     * @param componentSize: size of the element being positioned
     * @param parent: parent of the component being positioned, default value is event's current target
     * @returns {Point} the corrected position
     */
    ComponentService.prototype.getPositionWithinParentElement = function (event, componentSize, parent) {
        if (parent === void 0) { parent = event.currentTarget; }
        var position = this.getPosition(event, parent);
        var bounds = this.getParentBoundingRectangle(parent);
        return this.getPositionWithinBounds(position, componentSize, bounds, this.provider.converter(event.currentTarget));
    };
    /**
     * Helps giving a position within a parent element taking in consideration element's size
     * @param event: a mouse event
     * @param componentSize: size of the element being positioned
     * @param parent: parent of the component being positioned, default value is event's current target
     * @returns {Point} the corrected position
     */
    ComponentService.prototype.positionWithinParentElement = function (event, componentSize, parent) {
        if (parent === void 0) { parent = event.currentTarget; }
        var position = this.getPosition(event, parent);
        var bounds = this.getParentBoundingRectangle(parent);
        return bounds.within(position, componentSize, this.provider.converter(event.currentTarget));
    };
    /**
     * Get an element absolute position in page
     * @param element
     * @returns {{x: number, y: number}}
     */
    ComponentService.prototype.getElementPosition = function (element) {
        var xPosition = 0;
        var yPosition = 0;
        while (element) {
            if (element.tagName == "BODY") {
                // deal with browser quirks with body/window/document and page scroll
                var xScrollPos = element.scrollLeft || document.documentElement.scrollLeft;
                var yScrollPos = element.scrollTop || document.documentElement.scrollTop;
                xPosition += (element.offsetLeft - xScrollPos + element.clientLeft);
                yPosition += (element.offsetTop - yScrollPos + element.clientTop);
            }
            else {
                xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
                yPosition += (element.offsetTop - element.scrollTop + element.clientTop);
            }
            element = element.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    };
    ComponentService.prototype.getPositionWithinBounds = function (position, size, bounds, converter) {
        if (bounds.within(position, size, converter)) {
            return position;
        }
        var x = position.x;
        var left = x;
        if (!bounds.withinWidth(position, size, converter)) {
            // Because x is relative to parent
            left = x - (x + size.width(converter) - bounds.size.width(converter)) - 10;
        }
        var y = position.y;
        var top = y;
        if (!bounds.withinHeight(position, size, converter)) {
            // Because y is relative to parent
            top = y - (y + size.height(converter) - bounds.size.height(converter)) - 5;
        }
        return {
            x: left,
            y: top
        };
    };
    // Special thanks to https://www.kirupa.com/snippets/move_element_to_click_position.htm
    // It would have been much longer to implement this service without this blog post
    ComponentService.prototype.getPosition = function (event, parent) {
        var parentPosition = this.getElementPosition(parent);
        var clientX = event.clientX;
        var clientY = event.clientY;
        var x = clientX - parentPosition.x; // - (theThing.clientWidth / 2);
        var y = clientY - parentPosition.y; // - (theThing.clientHeight / 2);
        return {
            x: x,
            y: y
        };
    };
    ComponentService.prototype.getParentBoundingRectangle = function (parent) {
        var parentPosition = this.getElementPosition(parent);
        var boundingClientRect = parent.getBoundingClientRect();
        var boundsSize = new size_1.Size(new length_1.Length(boundingClientRect.width), new length_1.Length(boundingClientRect.height));
        return new bounding_rectangle_1.BoundingRectangle(parentPosition, boundsSize);
    };
    ComponentService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [length_converter_1.EmConverterProvider])
    ], ComponentService);
    return ComponentService;
}());
exports.ComponentService = ComponentService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21wb25lbnQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBRXpDLHFCQUFtQixRQUFRLENBQUMsQ0FBQTtBQUM1QixtQ0FBZ0Msc0JBQXNCLENBQUMsQ0FBQTtBQUN2RCx1QkFBcUIsVUFBVSxDQUFDLENBQUE7QUFDaEMsaUNBQStDLG9CQUFvQixDQUFDLENBQUE7QUFHcEU7SUFDSSwwQkFBb0IsUUFBNEI7UUFBNUIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7SUFDaEQsQ0FBQztJQUVELGlDQUFNLEdBQU4sVUFBTyxJQUFTLEVBQUUsT0FBTztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxnQ0FBSyxHQUFMLFVBQU0sSUFBUyxFQUFFLE9BQU87UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlDQUFNLEdBQU4sVUFBTyxNQUFhO1FBQ2hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCx5REFBOEIsR0FBOUIsVUFBK0IsS0FBSyxFQUFFLGFBQWtCLEVBQUUsTUFBNEI7UUFBNUIsc0JBQTRCLEdBQTVCLFNBQVMsS0FBSyxDQUFDLGFBQWE7UUFDbEYsSUFBSSxRQUFRLEdBQVMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFDckQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLDBCQUEwQixDQUFDLE1B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