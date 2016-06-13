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
var text_component_1 = require("./text/text.component");
var component_service_1 = require("./component/component.service");
var length_converter_1 = require("./component/length-converter");
var injection_service_1 = require("./inject/injection.service");
var EditorComponent = (function () {
    function EditorComponent(_viewContainer, _resolver, _compService, _injService) {
        this._viewContainer = _viewContainer;
        this._resolver = _resolver;
        this._compService = _compService;
        this._injService = _injService;
        this.textChildren = {};
        this.selectedElement = false;
        this.suppressAction = function () {
        };
    }
    EditorComponent.prototype.openTextElementFromDblClick = function (clickEvent) {
        var positionWithinBounds = this._compService.getPositionWithinParentElement(clickEvent, text_component_1.TextComponent.DEFAULT_SIZE);
        var state = this.textComponentState(positionWithinBounds.x, positionWithinBounds.y);
        this.openTextElement(state);
    };
    EditorComponent.prototype.openTextElementFromAction = function (event) {
        var state = this.textComponentState(event.x, event.y);
        this.openTextElement(state);
    };
    EditorComponent.prototype.textComponentState = function (left, top) {
        return {
            guid: this._injService.guid(),
            left: this._compService.pxSize(left),
            top: this._compService.pxSize(top)
        };
    };
    EditorComponent.prototype.openTextElement = function (state) {
        var _this = this;
        this._resolver.resolveComponent(text_component_1.TextComponent).then(function (textCompFactory) {
            var onTextValueChanged = _this.onTextValueChanged.bind(_this);
            var onTextFocus = _this.onTextFocus.bind(_this);
            var textComponentContext = _this._injService.injector(_this._viewContainer.injector, core_1.provide(text_component_1.VIEW_STATE_TOKEN, { useValue: state }), core_1.provide(text_component_1.ON_VALUE_CHANGED_TOKEN, { useValue: onTextValueChanged }), core_1.provide(text_component_1.ON_FOCUS_TOKEN, { useValue: onTextFocus }));
            _this.textChildren[state.guid] =
                _this.editorBody.createComponent(textCompFactory, undefined, textComponentContext);
        });
    };
    EditorComponent.prototype.onTextFocus = function (state) {
        var _this = this;
        this.selectedElement = true;
        this.suppressAction = function () {
            _this.destroyText(state);
        };
    };
    EditorComponent.prototype.onTextValueChanged = function (state, value) {
        // Text component without value is not useful and vainly retains space
        if (!value || "" === value.trim()) {
            this.destroyText(state);
        }
    };
    EditorComponent.prototype.destroyText = function (state) {
        this.selectedElement = false;
        this.suppressAction = function () {
        };
        this.textChildren[state.guid].destroy();
        delete this.textChildren[state.guid];
    };
    __decorate([
        core_1.ViewChild('editorBody', { read: core_1.ViewContainerRef }), 
        __metadata('design:type', core_1.ViewContainerRef)
    ], EditorComponent.prototype, "editorBody", void 0);
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            template: '<div class="editor-container"><div class="editor-toolbar"><button type="button" aria-label="Add Image" class="btn btn-default"><span class="glyphicon glyphicon-picture"></span></button><button type="button" aria-label="Add Text" (click)="openTextElementFromAction()" class="btn btn-default"><span class="glyphicon glyphicon-text-background"></span></button><button type="button" aria-label="Add Text" (click)="suppressAction()" [disabled]="!selectedElement" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button></div><div (dblclick)="openTextElementFromDblClick($event)" class="wrapper editor-body"><div #editorBody=""></div></div></div>',
            styles: ['div.editor-container {  width: 100%;  min-height: 250px; }div.editor-toolbar {  background: linear-gradient(to top, #e2e2e2, #fbfbfb);  padding: 4px 6px;  border: 1px solid #ccc;  border-top-left-radius: 4px;  border-top-right-radius: 4px;  border-bottom-width: 0; }div.editor-toolbar > .btn:first-child {  margin-left: 2px; }div.editor-toolbar > .btn:last-child {  margin-right: 2px; }div.editor-toolbar .btn {  margin-left: 2px;  margin-right: 2px;  background-color: white; }div.editor-body {  position: relative;  width: 100%;  border: 1px solid #ccc;  border-bottom-left-radius: 4px;  border-bottom-right-radius: 4px;  min-height: 220px; }div.text-element {  position: absolute; }:host /deep/ [draggable] {  -moz-user-select: none;  -khtml-user-select: none;  -webkit-user-select: none;  user-select: none;  /* Required to make elements draggable in old WebKit */  -khtml-user-drag: element;  -webkit-user-drag: element; }:host /deep/ .dragging {  opacity: 0.4;  background-color: #eeeeee !important; }'],
            providers: [component_service_1.ComponentService, length_converter_1.EmConverterProvider, injection_service_1.InjectionService],
            directives: [text_component_1.TextComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ComponentResolver, component_service_1.ComponentService, injection_service_1.InjectionService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUErRixlQUFlLENBQUMsQ0FBQTtBQUMvRywrQkFNTyx1QkFBdUIsQ0FBQyxDQUFBO0FBQy9CLGtDQUErQiwrQkFBK0IsQ0FBQyxDQUFBO0FBQy9ELGlDQUFrQyw4QkFBOEIsQ0FBQyxDQUFBO0FBQ2pFLGtDQUErQiw0QkFBNEIsQ0FBQyxDQUFBO0FBUzVEO0lBT0kseUJBQW9CLGNBQStCLEVBQVUsU0FBMkIsRUFDcEUsWUFBNkIsRUFBVSxXQUE0QjtRQURuRSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNwRSxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFOL0UsaUJBQVksR0FBK0MsRUFBRSxDQUFDO1FBQzlELG9CQUFlLEdBQVcsS0FBSyxDQUFDO1FBQ2hDLG1CQUFjLEdBQWM7UUFDcEMsQ0FBQyxDQUFDO0lBSUYsQ0FBQztJQUVELHFEQUEyQixHQUEzQixVQUE0QixVQUFVO1FBQ2xDLElBQUksb0JBQW9CLEdBQ3BCLElBQUksQ0FBQyxZQUFZLENBQUMsOEJBQThCLENBQUMsVUFBVSxFQUFFLDhCQUFhLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDN0YsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLG9CQUFvQixDQUFDLENBQUMsRUFBRSxvQkFBb0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNwRixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFFRCxtREFBeUIsR0FBekIsVUFBMEIsS0FBSztRQUMzQixJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxLQUFLLENB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