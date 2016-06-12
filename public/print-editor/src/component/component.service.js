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
    ComponentService.prototype.getPositionWithinParentElement = function (event, componentSize, parent, yPositionGetter) {
        if (parent === void 0) { parent = event.currentTarget; }
        if (yPositionGetter === void 0) { yPositionGetter = bounding_rectangle_1.BoundingRectangle.trivialYGetter; }
        var position = this.getPosition(event, parent);
        var bounds = this.getParentBoundingRectangle(parent);
        return this.getPositionWithinBounds(position, componentSize, bounds, this.provider.converter(event.currentTarget), yPositionGetter);
    };
    /**
     * Helps giving a position within a parent element taking in consideration element's size
     * @param event: a mouse event
     * @param componentSize: size of the element being positioned
     * @param parent: parent of the component being positioned, default value is event's current target
     * @param yPositionGetter : How to get y using position if not trivial
     * @returns {Point} the corrected position
     */
    ComponentService.prototype.positionWithinParentElement = function (event, componentSize, parent, yPositionGetter) {
        if (parent === void 0) { parent = event.currentTarget; }
        if (yPositionGetter === void 0) { yPositionGetter = bounding_rectangle_1.BoundingRectangle.trivialYGetter; }
        var position = this.getPosition(event, parent);
        var bounds = this.getParentBoundingRectangle(parent);
        return bounds.within(position, componentSize, this.provider.converter(event.currentTarget), yPositionGetter);
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
    ComponentService.prototype.getPositionWithinBounds = function (position, size, bounds, converter, yPositionGetter) {
        if (yPositionGetter === void 0) { yPositionGetter = bounding_rectangle_1.BoundingRectangle.trivialYGetter; }
        if (bounds.within(position, size, converter, yPositionGetter)) {
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
        if (!bounds.withinHeight(position, size, converter, yPositionGetter)) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcG9uZW50LnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJjb21wb25lbnQuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUEscUJBQXlCLGVBQWUsQ0FBQyxDQUFBO0FBRXpDLHFCQUFtQixRQUFRLENBQUMsQ0FBQTtBQUM1QixtQ0FBZ0Msc0JBQXNCLENBQUMsQ0FBQTtBQUN2RCx1QkFBcUIsVUFBVSxDQUFDLENBQUE7QUFDaEMsaUNBQStDLG9CQUFvQixDQUFDLENBQUE7QUFHcEU7SUFDSSwwQkFBb0IsUUFBNEI7UUFBNUIsYUFBUSxHQUFSLFFBQVEsQ0FBb0I7SUFDaEQsQ0FBQztJQUVELGlDQUFNLEdBQU4sVUFBTyxJQUFTLEVBQUUsT0FBTztRQUNyQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQ3pELENBQUM7SUFFRCxnQ0FBSyxHQUFMLFVBQU0sSUFBUyxFQUFFLE9BQU87UUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUN4RCxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGlDQUFNLEdBQU4sVUFBTyxNQUFhO1FBQ2hCLE1BQU0sQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSCx5REFBOEIsR0FBOUIsVUFBK0IsS0FBSyxFQUFFLGFBQWtCLEVBQUUsTUFBNEIsRUFDdkQsZUFBdUU7UUFENUMsc0JBQTRCLEdBQTVCLFNBQVMsS0FBSyxDQUFDLGFBQWE7UUFDdkQsK0JBQXVFLEdBQXZFLGtCQUF1QyxzQ0FBaUIsQ0FBQyxjQUFjO1FBQ2xHLElBQUksUUFBUSxHQUFTLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE1BQU0s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