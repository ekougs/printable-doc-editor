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
// Important to load selection capability
var select = require('svg.select.js');
// Important to load resize capability, depends on select
var resize = require('svg.resize.js');
var SELECT_OPTIONS_RESIZE = { deepSelect: false, radius: 5, rotationPoint: false };
var SELECT_OPTIONS_NO_RESIZE = { deepSelect: false, radius: 5, rotationPoint: false, points: false };
var EditorComponent = (function () {
    function EditorComponent(_viewContainer, _resolver, _compService, _injService) {
        this._viewContainer = _viewContainer;
        this._resolver = _resolver;
        this._compService = _compService;
        this._injService = _injService;
        this.textInputChildren = {};
        this.suppressFns = [];
        this.deselectFns = [];
        this.selectedElement = false;
    }
    EditorComponent.prototype.ngAfterViewInit = function () {
        this.initSvgDoc();
        this.initImageInputListener();
        Rx_1.Observable.fromEvent(this.editorBody.element.nativeElement, 'click')
            .subscribe(this.deselectElement.bind(this));
    };
    EditorComponent.prototype.initSvgDoc = function () {
        var editorBodyNative = this.editorBody.element.nativeElement;
        var bounds = editorBodyNative.getBoundingClientRect();
        this._doc = SVG(editorBodyNative).size(bounds.width, bounds.height);
    };
    EditorComponent.prototype.initImageInputListener = function () {
        var _this = this;
        var height = 100;
        var fileChanges = Rx_1.Observable.fromEvent(this.imageInput.nativeElement, 'change')
            .flatMap(function (event) {
            return event.target.files;
        });
        fileChanges.subscribe(function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.openImageElement(event, height);
            };
            reader.readAsDataURL(file);
        });
    };
    EditorComponent.prototype.openImageElement = function (event, height) {
        var image = this._doc.image((this._injService.guid()));
        image.load(event.target.result)
            .loaded(function (loader) {
            image.height(height).width(height / loader.ratio);
        })
            .x(10)
            .y(10)
            .draggable();
        this.initSelectionListener(image, true);
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
        this.initTextModificationListener(text);
    };
    EditorComponent.prototype.initSelectionListener = function (element, resizable) {
        var _this = this;
        if (resizable === void 0) { resizable = false; }
        console.log(element);
        var selectFn = function () {
            _this.selectedElement = true;
            if (resizable) {
                element.selectize(SELECT_OPTIONS_RESIZE).resize();
            }
            else {
                element.selectize(SELECT_OPTIONS_NO_RESIZE);
            }
        };
        var deselectFn = function () {
            element.selectize(false);
            if (resizable) {
                element.resize('stop');
            }
        };
        Rx_1.Observable.fromEvent(element, 'click')
            .subscribe(function (event) {
            event.stopPropagation();
            selectFn();
            _this.deselectFns.push(deselectFn);
            _this.suppressFns.push(function () {
                _this.destroySVGElement(element);
            });
        });
    };
    EditorComponent.prototype.initTextModificationListener = function (text) {
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
            _this.destroySVGElement(text);
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
    EditorComponent.prototype.destroySVGElement = function (element) {
        element.remove();
        this.deselectElement();
    };
    EditorComponent.prototype.deselectElement = function () {
        this.deselectFns.forEach(function (deselectFn) {
            deselectFn();
        });
        this.suppressFns = [];
        this.deselectFns = [];
        this.selectedElement = false;
    };
    EditorComponent.prototype.deleteElements = function () {
        this.suppressFns.forEach(function (suppressFn) {
            suppressFn();
        });
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
            template: '<div class="editor-container"><div class="editor-toolbar"><button #deleteBtn="" type="button" aria-label="Add Text" [disabled]="!selectedElement" (click)="deleteElements()" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button><button type="button" aria-label="Add Picture" class="btn btn-default file-chooser"><span class="glyphicon glyphicon-picture"></span><input #fileInput="" type="file" accept="image/*"/></button></div><div (dblclick)="openTextElementFromDblClick($event)" #editorBody="" class="wrapper editor-body"><div #editorBodyInner="" class="editor-body-inner"></div></div></div>',
            styles: ['div.editor-container {  width: 100%;  min-height: 250px; }div.editor-toolbar {  background: linear-gradient(to top, #e2e2e2, #fbfbfb);  padding: 4px 6px;  border: 1px solid #ccc;  border-top-left-radius: 4px;  border-top-right-radius: 4px;  border-bottom-width: 0; }div.editor-toolbar > .btn:first-child {  margin-left: 2px; }div.editor-toolbar > .btn:last-child {  margin-right: 2px; }div.editor-toolbar .btn {  margin-left: 2px;  margin-right: 2px;  background-color: white; }div.editor-body {  position: relative;  width: 100%;  border: 1px solid #ccc;  border-bottom-left-radius: 4px;  border-bottom-right-radius: 4px;  min-height: 220px; }div.editor-body-inner {  display: none; }div.text-element {  position: absolute; }button.file-chooser {  position: relative;  overflow: hidden;  width: 3em;  height: 2.5em; }button.file-chooser input[type="file"] {  position: absolute;  opacity: 0;  height: 100%;  line-height: 30px;  top: 0;  right: 0;  margin: 0;  padding: 0; }:host /deep/ .svg_select_points, :host /deep/ .svg_select_boundingRect {  stroke: #66afe9; }:host /deep/ .svg_select_boundingRect {  fill-opacity: 0; }:host /deep/ .svg_select_points {  fill: #66afe9; }:host /deep/ [draggable] {  -moz-user-select: none;  -khtml-user-select: none;  -webkit-user-select: none;  user-select: none;  /* Required to make elements draggable in old WebKit */  -khtml-user-drag: element;  -webkit-user-drag: element; }:host /deep/ .dragging {  opacity: 0.4;  background-color: #eeeeee !important; }'],
            providers: [component_service_1.ComponentService, length_converter_1.EmConverterProvider, injection_service_1.InjectionService],
            directives: [text_component_1.TextComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ComponentResolver, component_service_1.ComponentService, injection_service_1.InjectionService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUNuQywrQkFBMEYsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSCxrQ0FBK0IsK0JBQStCLENBQUMsQ0FBQTtBQUMvRCxpQ0FBa0MsOEJBQThCLENBQUMsQ0FBQTtBQUNqRSxrQ0FBK0IsNEJBQTRCLENBQUMsQ0FBQTtBQUU1RCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsb0NBQW9DO0FBQ3BDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBQzVDLHlDQUF5QztBQUN6QyxJQUFJLE1BQU0sR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7QUFDdEMseURBQXlEO0FBQ3pELElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxlQUFlLENBQUMsQ0FBQztBQUV0QyxJQUFNLHFCQUFxQixHQUFHLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUMsQ0FBQztBQUNuRixJQUFNLHdCQUF3QixHQUFHLEVBQUMsVUFBVSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBQyxDQUFDO0FBU3JHO0lBV0kseUJBQW9CLGNBQStCLEVBQVUsU0FBMkIsRUFDcEUsWUFBNkIsRUFBVSxXQUE0QjtRQURuRSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNwRSxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFQ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