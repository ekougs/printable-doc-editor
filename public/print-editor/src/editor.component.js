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
// Important to load drag capability
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
        this.initModificationListener(text);
    };
    EditorComponent.prototype.initSelectionListener = function (text) {
        var _this = this;
        Rx_1.Observable.fromEvent(text, 'click')
            .subscribe(function (event) {
            event.stopPropagation();
            _this.selectedElement = true;
            _this.suppressFn = function () {
                _this.destroyText(text);
            };
        });
    };
    EditorComponent.prototype.initModificationListener = function (text) {
        var _this = this;
        Rx_1.Observable.fromEvent(text, 'dblclick')
            .subscribe(function () {
            event.stopPropagation();
            var bounds = text.bbox();
            var state = _this.textComponentState(bounds.x, bounds.y);
            state.value = '';
            text.lines().each(function () {
                state.value += (this.node.textContent + '\n');
            });
            state.value = state.value.trim();
            _this.destroyText(text);
            _this.openTextElement(state);
        });
    };
    EditorComponent.prototype.createText = function (value, state) {
        return this._doc.text(function (add) {
            var lines = value.split('\n');
            lines.forEach(function (line) {
                add.tspan(line).newLine();
            });
        }).x(state.leftPx).y(state.topPx).draggable();
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUNuQywrQkFBMEYsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSCxrQ0FBK0IsK0JBQStCLENBQUMsQ0FBQTtBQUMvRCxpQ0FBa0MsOEJBQThCLENBQUMsQ0FBQTtBQUNqRSxrQ0FBK0IsNEJBQTRCLENBQUMsQ0FBQTtBQUU1RCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsb0NBQW9DO0FBQ3BDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBUzVDO0lBVUkseUJBQW9CLGNBQStCLEVBQVUsU0FBMkIsRUFDcEUsWUFBNkIsRUFBVSxXQUE0QjtRQURuRSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNwRSxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFQL0Usc0JBQWlCLEdBQStDLEVBQUUsQ0FBQztRQUVuRSxlQUFVLEdBQWM7UUFDaEMsQ0FBQyxDQUFDO1FBQ00sb0JBQWUsR0FBRyxLQUFLLENBQUM7SUFJaEMsQ0FBQztJQUdELHlDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7SUFDdEIsQ0FBQztJQUVPLG9DQUFVLEdBQWxCO1FBQ0ksSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDN0QsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0RCxJQUFJLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQyxnQkFBZ0Is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