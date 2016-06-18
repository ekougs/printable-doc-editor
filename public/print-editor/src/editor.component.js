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
        this.initImageInputListener();
    };
    EditorComponent.prototype.initSvgDoc = function () {
        var editorBodyNative = this.editorBody.element.nativeElement;
        var bounds = editorBodyNative.getBoundingClientRect();
        this._doc = SVG(editorBodyNative).size(bounds.width, bounds.height);
    };
    EditorComponent.prototype.initImageInputListener = function () {
        var _this = this;
        var width = 250;
        var fileChanges = Rx_1.Observable.fromEvent(this.imageInput.nativeElement, 'change')
            .flatMap(function (event) {
            return event.target.files;
        });
        fileChanges.subscribe(function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                var image = _this._doc.image((_this._injService.guid()));
                image.load(event.target.result)
                    .loaded(function (loader) {
                    image.height(loader.ratio * width).width(width);
                })
                    .x(10)
                    .y(10)
                    .draggable();
            };
            reader.readAsDataURL(file);
        });
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
        core_1.ViewChild('fileInput', { read: core_1.ElementRef }), 
        __metadata('design:type', core_1.ElementRef)
    ], EditorComponent.prototype, "imageInput", void 0);
    __decorate([
        core_1.ViewChild('editorBodyInner', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], EditorComponent.prototype, "editorBodyInner", void 0);
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            template: '<div class="editor-container"><div class="editor-toolbar"><button #deleteBtn="" type="button" aria-label="Add Text" [disabled]="!selectedElement" (click)="suppressFn()" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button><button type="button" aria-label="Add Picture" class="btn btn-default file-chooser"><span class="glyphicon glyphicon-picture"></span><input #fileInput="" type="file" accept="image/*"/></button></div><div (dblclick)="openTextElementFromDblClick($event)" #editorBody="" class="wrapper editor-body"><div #editorBodyInner="" class="editor-body-inner"></div></div></div>',
            styles: ['div.editor-container {  width: 100%;  min-height: 250px; }div.editor-toolbar {  background: linear-gradient(to top, #e2e2e2, #fbfbfb);  padding: 4px 6px;  border: 1px solid #ccc;  border-top-left-radius: 4px;  border-top-right-radius: 4px;  border-bottom-width: 0; }div.editor-toolbar > .btn:first-child {  margin-left: 2px; }div.editor-toolbar > .btn:last-child {  margin-right: 2px; }div.editor-toolbar .btn {  margin-left: 2px;  margin-right: 2px;  background-color: white; }div.editor-body {  position: relative;  width: 100%;  border: 1px solid #ccc;  border-bottom-left-radius: 4px;  border-bottom-right-radius: 4px;  min-height: 220px; }div.editor-body-inner {  display: none; }div.text-element {  position: absolute; }button.file-chooser {  position: relative;  overflow: hidden;  width: 3em;  height: 2.5em; }button.file-chooser input[type="file"] {  position: absolute;  opacity: 0;  height: 100%;  line-height: 30px;  top: 0;  right: 0;  margin: 0;  padding: 0; }:host /deep/ [draggable] {  -moz-user-select: none;  -khtml-user-select: none;  -webkit-user-select: none;  user-select: none;  /* Required to make elements draggable in old WebKit */  -khtml-user-drag: element;  -webkit-user-drag: element; }:host /deep/ .dragging {  opacity: 0.4;  background-color: #eeeeee !important; }'],
            providers: [component_service_1.ComponentService, length_converter_1.EmConverterProvider, injection_service_1.InjectionService],
            directives: [text_component_1.TextComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ComponentResolver, component_service_1.ComponentService, injection_service_1.InjectionService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUNuQywrQkFBMEYsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSCxrQ0FBK0IsK0JBQStCLENBQUMsQ0FBQTtBQUMvRCxpQ0FBa0MsOEJBQThCLENBQUMsQ0FBQTtBQUNqRSxrQ0FBK0IsNEJBQTRCLENBQUMsQ0FBQTtBQUU1RCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsb0NBQW9DO0FBQ3BDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBUzVDO0lBV0kseUJBQW9CLGNBQStCLEVBQVUsU0FBMkIsRUFDcEUsWUFBNkIsRUFBVSxXQUE0QjtRQURuRSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNwRSxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFQL0Usc0JBQWlCLEdBQStDLEVBQUUsQ0FBQztRQUVuRSxlQUFVLEdBQWM7UUFDaEMsQ0FBQyxDQUFDO1FBQ00sb0JBQWUsR0FBRyxLQUFLLENBQUM7SUFJaEMsQ0FBQztJQUdELHlDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7SUFDbEMsQ0FBQztJQUVPLG9DQUFVLEdBQWxCO1FBQ0ksSUFBSSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUM7UUFDN0QsSUFBSSxNQUFNLEdBQUcsZ0JBQWdCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztRQUN0RCxJQUFJ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