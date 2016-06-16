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
var text_component_1 = require("./text/text.component");
var component_service_1 = require("./component/component.service");
var length_converter_1 = require("./component/length-converter");
var injection_service_1 = require("./inject/injection.service");
var SVG = require('svg.js');
var draggable = require('svg.draggable.js');
var EditorComponent = (function () {
    function EditorComponent(_viewContainer, _resolver, _compService, _injService) {
        this._viewContainer = _viewContainer;
        this._resolver = _resolver;
        this._compService = _compService;
        this._injService = _injService;
        this.textInputChildren = {};
        this.suppressFn = function () {
        };
        this.selectedElement = false;
    }
    EditorComponent.prototype.ngAfterViewInit = function () {
        this.initSvgDoc();
    };
    EditorComponent.prototype.initSvgDoc = function () {
        var editorBodyNative = this.editorBody.element.nativeElement;
        var bounds = editorBodyNative.getBoundingClientRect();
        this._doc = SVG(editorBodyNative).size(bounds.width, bounds.height);
    };
    EditorComponent.prototype.openTextElementFromDblClick = function (clickEvent) {
        var positionWithinBounds = this._compService.getPositionWithinParentElement(clickEvent, text_component_1.TextComponent.DEFAULT_SIZE);
        var state = this.textComponentState(positionWithinBounds.x, positionWithinBounds.y);
        this.openTextElement(state);
    };
    EditorComponent.prototype.textComponentState = function (left, top) {
        return {
            guid: this._injService.guid(),
            left: this._compService.pxSize(left),
            top: this._compService.pxSize(top),
            leftPx: left,
            topPx: top
        };
    };
    EditorComponent.prototype.openTextElement = function (state) {
        var _this = this;
        this._resolver.resolveComponent(text_component_1.TextComponent).then(function (textCompFactory) {
            var onTextValueChanged = _this.onTextValueChanged.bind(_this);
            var textComponentContext = _this._injService.injector(_this._viewContainer.injector, core_1.provide(text_component_1.VIEW_STATE_TOKEN, { useValue: state }), core_1.provide(text_component_1.ON_VALUE_CHANGED_TOKEN, { useValue: onTextValueChanged }));
            _this.textInputChildren[state.guid] =
                _this.editorBodyInner.createComponent(textCompFactory, undefined, textComponentContext);
        });
    };
    EditorComponent.prototype.onTextValueChanged = function (state, value) {
        this.destroyTextInput(state);
        if (!value || '' === value) {
            return;
        }
        var text = this.createText(value, state);
        this.initSelectionListener(text);
    };
    EditorComponent.prototype.initSelectionListener = function (text) {
        var _this = this;
        var clicks = Rx_1.Observable.fromEvent(text, 'click')
            .flatMap(function (event) {
            return Rx_1.Observable.of(event).delay(200);
        });
        clicks.subscribe(function () {
            _this.selectedElement = true;
            _this.suppressFn = function () {
                _this.destroyText(text);
            };
        });
    };
    EditorComponent.prototype.createText = function (value, state) {
        var text = this._doc.text(function (add) {
            var lines = value.split('\n');
            lines.forEach(function (line) {
                add.tspan(line).newLine();
            });
        });
        text.x(state.leftPx).y(state.topPx).draggable();
        return text;
    };
    EditorComponent.prototype.destroyTextInput = function (state) {
        this.textInputChildren[state.guid].destroy();
        delete this.textInputChildren[state.guid];
    };
    EditorComponent.prototype.destroyText = function (element) {
        element.remove();
        this.deselectText();
    };
    EditorComponent.prototype.deselectText = function () {
        this.suppressFn = function () {
        };
        this.selectedElement = false;
    };
    __decorate([
        core_1.ViewChild('editorBody', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], EditorComponent.prototype, "editorBody", void 0);
    __decorate([
        core_1.ViewChild('deleteBtn', { read: core_1.ElementRef }), 
        __metadata('design:type', core_1.ElementRef)
    ], EditorComponent.prototype, "deleteBtn", void 0);
    __decorate([
        core_1.ViewChild('editorBodyInner', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], EditorComponent.prototype, "editorBodyInner", void 0);
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            template: '<div class="editor-container"><div class="editor-toolbar"><button #deleteBtn="" type="button" aria-label="Add Text" [disabled]="!selectedElement" (click)="suppressFn()" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button></div><div (dblclick)="openTextElementFromDblClick($event)" #editorBody="" class="wrapper editor-body"><div #editorBodyInner="" class="editor-body-inner"></div></div></div>',
            styles: ['div.editor-container {  width: 100%;  min-height: 250px; }div.editor-toolbar {  background: linear-gradient(to top, #e2e2e2, #fbfbfb);  padding: 4px 6px;  border: 1px solid #ccc;  border-top-left-radius: 4px;  border-top-right-radius: 4px;  border-bottom-width: 0; }div.editor-toolbar > .btn:first-child {  margin-left: 2px; }div.editor-toolbar > .btn:last-child {  margin-right: 2px; }div.editor-toolbar .btn {  margin-left: 2px;  margin-right: 2px;  background-color: white; }div.editor-body {  position: relative;  width: 100%;  border: 1px solid #ccc;  border-bottom-left-radius: 4px;  border-bottom-right-radius: 4px;  min-height: 220px; }div.editor-body-inner {  display: none; }div.text-element {  position: absolute; }:host /deep/ [draggable] {  -moz-user-select: none;  -khtml-user-select: none;  -webkit-user-select: none;  user-select: none;  /* Required to make elements draggable in old WebKit */  -khtml-user-drag: element;  -webkit-user-drag: element; }:host /deep/ .dragging {  opacity: 0.4;  background-color: #eeeeee !important; }'],
            providers: [component_service_1.ComponentService, length_converter_1.EmConverterProvider, injection_service_1.InjectionService],
            directives: [text_component_1.TextComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ComponentResolver, component_service_1.ComponentService, injection_service_1.InjectionService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUNuQywrQkFBMEYsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSCxrQ0FBK0IsK0JBQStCLENBQUMsQ0FBQTtBQUMvRCxpQ0FBa0MsOEJBQThCLENBQUMsQ0FBQTtBQUNqRSxrQ0FBK0IsNEJBQTRCLENBQUMsQ0FBQTtBQUk1RCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFTNUM7SUFVSSx5QkFBb0IsY0FBK0IsRUFBVSxTQUEyQixFQUNwRSxZQUE2QixFQUFVLFdBQTRCO1FBRG5FLG1CQUFjLEdBQWQsY0FBYyxDQUFpQjtRQUFVLGNBQVMsR0FBVCxTQUFTLENBQWtCO1FBQ3BFLGlCQUFZLEdBQVosWUFBWSxDQUFpQjtRQUFVLGdCQUFXLEdBQVgsV0FBVyxDQUFpQjtRQVAvRSxzQkFBaUIsR0FBK0MsRUFBRSxDQUFDO1FBRW5FLGVBQVUsR0FBYztRQUNoQyxDQUFDLENBQUM7UUFDTSxvQkFBZSxHQUFHLEtBQUssQ0FBQztJQUloQyxDQUFDO0lBR0QseUNBQWUsR0FBZjtRQUNJLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztJQUN0QixDQUFDO0lBRU8sb0NBQVUsR0FBbEI7UUFDSSxJQUFJLGdCQUFnQixHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQztRQUM3RCxJQUFJLE1BQU0sR0FBRyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1FBQ3RELElBQUksQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFB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