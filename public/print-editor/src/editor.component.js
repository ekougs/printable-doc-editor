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
        var width = 250;
        var fileChanges = Rx_1.Observable.fromEvent(this.imageInput.nativeElement, 'change')
            .flatMap(function (event) {
            return event.target.files;
        });
        fileChanges.subscribe(function (file) {
            var reader = new FileReader();
            reader.onload = function (event) {
                _this.openImageElement(event, width);
            };
            reader.readAsDataURL(file);
        });
    };
    EditorComponent.prototype.openImageElement = function (event, width) {
        var image = this._doc.image((this._injService.guid()));
        image.load(event.target.result)
            .loaded(function (loader) {
            image.height(loader.ratio * width).width(width);
        })
            .x(10)
            .y(10)
            .draggable();
        this.initSelectionListener(image);
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
    EditorComponent.prototype.initSelectionListener = function (element) {
        var _this = this;
        Rx_1.Observable.fromEvent(element, 'click')
            .subscribe(function (event) {
            event.stopPropagation();
            _this.selectedElement = true;
            _this.suppressFn = function () {
                _this.destroySVGElement(element);
            };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUNuQywrQkFBMEYsdUJBQXVCLENBQUMsQ0FBQTtBQUNsSCxrQ0FBK0IsK0JBQStCLENBQUMsQ0FBQTtBQUMvRCxpQ0FBa0MsOEJBQThCLENBQUMsQ0FBQTtBQUNqRSxrQ0FBK0IsNEJBQTRCLENBQUMsQ0FBQTtBQUU1RCxJQUFJLEdBQUcsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDNUIsb0NBQW9DO0FBQ3BDLElBQUksU0FBUyxHQUFHLE9BQU8sQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0FBUzVDO0lBV0kseUJBQW9CLGNBQStCLEVBQVUsU0FBMkIsRUFDcEUsWUFBNkIsRUFBVSxXQUE0QjtRQURuRSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNwRSxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFQL0Usc0JBQWlCLEdBQStDLEVBQUUsQ0FBQztRQUVuRSxlQUFVLEdBQWM7UUFDaEMsQ0FBQyxDQUFDO1FBQ00sb0JBQWUsR0FBRyxLQUFLLENBQUM7SUFJaEMsQ0FBQztJQUdELHlDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEIsSUFBSSxDQUFDLHNCQUFzQixFQUFFLENBQUM7UUFDOUIsZUFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsT0FBTyxDQUFDO2FBQzlELFNBQVMsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDO0lBQ3pELENBQUM7SUFFTyxvQ0FBVSxHQUFsQjtRQUNJLElBQUksZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDO1FBQzdELElBQUksTUFBTSxHQUFHLGdCQUFnQixDQUFDLHFCQUFxQixFQUFFLENBQUM7UUFDdEQsSUFBSSxDQUFDLElBQUksR0FBRyxHQUFHLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDeEUsQ0FBQztJQUVPLGdEQUFzQixHQUE5QjtRQUFBLGlCQWFDO1FBWkcsSUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ2xCLElBQUksV0FBVyxHQUFHLGVBQVUsQ0FBQyxTQUFTLENBQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsUUFBUSxDQUFDO2FBQ3ZELE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFDL0IsV0FBVyxDQUFDLFNBQVMsQ0FBQyxVQUFDLElBQVE7WUFDM0IsSUFBSSxNQUFNLEdBQUcsSUFBSSxVQUFVLEVBQUUsQ0FBQztZQUM5QixNQUFNLENBQUMsTUFBTSxHQUFHLFVBQUMsS0FBUztnQkFDdEIsS0FBSSxDQUFDLGdCQUFnQixDQUFDLEtBQUssRUFBRSxLQUFLLENBQUMsQ0FBQztZQUN4QyxDQUFDLENBQUM7WUFDRixNQUFNLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVPLDBDQUFnQixHQUF4QixVQUF5QixLQUFTLEVBQUUsS0FBWTtRQUM1QyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3ZELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDekIsTUFBTSxDQUFDLFVBQUMsTUFBTTtZQUNYLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEQsQ0FBQyxDQUFDO2FBQ0QsQ0FBQyxDQUFDLEVBQUUsQ0FBQzthQUNMLENBQUMsQ0FBQyxFQUFFLENBQUM7YUFDTCxTQUFTLEVBQUUsQ0FBQztRQUNsQixJQUFJLENBQUMscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVELHFEQUEyQixHQUEzQixVQUE0QixVQUFVO1FBQ2xDLElBQUksb0JBQW9CLEdBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsOEJBQThCLENBQUMsVUFBVSxFQUFFLDhCQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0YsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFTyw0Q0FBa0IsR0FBMUIsVUFBMkIsSUFBVyxFQUFFLEdBQVU7UUFDOUMsTUFBTSxDQUFDO1lBQ0gsSUFBSSxFQUFFLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFO1lBQzdCLElBQUksRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUM7WUFDcEMsR0FBRyxFQUFFLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQztZQUNsQyxNQUFNLEVBQUUsSUFBSTtZQUNaLEtBQUssRUFBRSxHQUFHO1NBQ2IsQ0FBQztJQUNOLENBQUM7SUFFTyx5Q0FBZSxHQUF2QixVQUF3QixLQUF3QjtRQUFoRCxpQkFVQztRQVRHLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsOEJBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLGVBQWU7WUFDL0QsSUFBSSxrQkFBa0IsR0FBRyxLQUFJLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLEtBQUksQ0FBQyxDQUFDO1lBQzVELElBQUksb0JBQW9CLEdBQ3BCLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxFQUM1QixjQUFPLENBQUMsaUNBQWdCLEVBQUUsRUFBQyxRQUFRLEVBQUUsS0FBSyxFQUFDLENBQUMsRUFDNUMsY0FBTyxDQUFDLHVDQUFzQixFQUFFLEVBQUMsUUFBUSxFQUFFLGtCQUFrQixFQUFDLENBQUMsQ0FBQyxDQUFDO1lBQy9GLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO2dCQUM5QixLQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsQ0FBQyxlQUFlLEVBQUUsU0FBUyxFQUFFLG9CQUFvQixDQUFDLENBQUM7UUFDL0YsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU8sNENBQWtCLEdBQTFCLFVBQTJCLEtBQXdCLEVBQUUsS0FBWTtRQUM3RCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDN0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLElBQUksRUFBRSxLQUFLLEtBQUssQ0FBQyxDQUFDLENBQUM7WUFDekIsTUFBTSxDQUFDO1FBQ1gsQ0FBQztRQUNELElBQUksSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3pDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNqQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVPLCtDQUFxQixHQUE3QixVQUE4QixPQUFXO1FBQXpDLGlCQVNDO1FBUkcsZUFBVSxDQUFDLFNBQVMsQ0FBTSxPQUFPLEVBQUUsT0FBTyxDQUFDO2FBQ2hDLFNBQVMsQ0FBQyxVQUFDLEtBQUs7WUFDYixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7WUFDeEIsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDNUIsS0FBSSxDQUFDLFVBQVUsR0FBRztnQkFDZCxLQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDO1FBQ04sQ0FBQyxDQUFDLENBQUM7SUFDakIsQ0FBQztJQUVPLHNEQUE0QixHQUFwQyxVQUFxQyxJQUFRO1FBQTdDLGlCQWNDO1FBYkcsZUFBVSxDQUFDLFNBQVMsQ0FBTSxJQUFJLEVBQUUsVUFBVSxDQUFDO2FBQ2hDLFNBQVMsQ0FBQztZQUNQLEtBQUssQ0FBQyxlQUFlLEVBQUUsQ0FBQztZQUN4QixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDekIsSUFBSSxLQUFLLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3hELEtBQUssQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ2pCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUM7Z0JBQ2QsS0FBSyxDQUFDLEtBQUssSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxDQUFDO1lBQ2xELENBQUMsQ0FBQyxDQUFDO1lBQ0gsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQ2pDLEtBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUM3QixLQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hDLENBQUMsQ0FBQyxDQUFDO0lBQ2pCLENBQUM7SUFFTyxvQ0FBVSxHQUFsQixVQUFtQixLQUFZLEVBQUUsS0FBd0I7UUFDckQsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQUMsR0FBRztZQUN0QixJQUFJLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzlCLEtBQUssQ0FBQyxPQUFPLENBQUMsVUFBQyxJQUFJO2dCQUNmLEdBQUcsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDOUIsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEQsQ0FBQztJQUVPLDBDQUFnQixHQUF4QixVQUF5QixLQUFLO1FBQzFCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDN0MsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFTywyQ0FBaUIsR0FBekIsVUFBMEIsT0FBTztRQUM3QixPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakIsSUFBSSxDQUFDLGVBQWUsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFTyx5Q0FBZSxHQUF2QjtRQUNJLElBQUksQ0FBQyxVQUFVLEdBQUc7UUFDbEIsQ0FBQyxDQUFDO1FBQ0YsSUFBSSxDQUFDLGVBQWUsR0FBRyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQWhKRDtRQUFDLGdCQUFTLENBQUMsWUFBWSxFQUFFLEVBQUMsSUFBSSxFQUFFLHVCQUFnQixFQUFDLENBQUM7O3VEQUFBO0lBQ2xEO1FBQUMsZ0JBQVMsQ0FBQyxXQUFXLEVBQUUsRUFBQyxJQUFJLEVBQUUsaUJBQVUsRUFBQyxDQUFDOztzREFBQTtJQUMzQztRQUFDLGdCQUFTLENBQUMsV0FBVyxFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFVLEVBQUMsQ0FBQzs7dURBQUE7SUFDM0M7UUFBQyxnQkFBUyxDQUFDLGlCQUFpQixFQUFFLEVBQUMsSUFBSSxFQUFFLHVCQUFnQixFQUFDLENBQUM7OzREQUFBO0lBWDNEO1FBQUMsZ0JBQVMsQ0FBQztZQUNJLFFBQVEsRUFBRSxRQUFRO1lBQ2xCLFdBQVcsRUFBRSx1QkFBdUI7WUFDcEMsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7WUFDbkMsU0FBUyxFQUFFLENBQUMsb0NBQWdCLEVBQUUsc0NBQW1CLEVBQUUsb0NBQWdCLENBQUM7WUFDcEUsVUFBVSxFQUFFLENBQUMsOEJBQWEsQ0FBQztTQUM5QixDQUFDOzt1QkFBQTtJQW1KYixzQkFBQztBQUFELENBQUMsQUFsSkQsSUFrSkM7QUFsSlksdUJBQWUsa0JBa0ozQixDQUFBIn0=