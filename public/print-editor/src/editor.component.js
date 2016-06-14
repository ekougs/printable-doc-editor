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
var core_1 = require('@angular/core');
var text_component_1 = require('./text/text.component');
var component_service_1 = require('./component/component.service');
var length_converter_1 = require('./component/length-converter');
var injection_service_1 = require('./inject/injection.service');
var Rx_1 = require('rxjs/Rx');
var EditorComponent = (function () {
    function EditorComponent(_viewContainer, _resolver, _compService, _injService) {
        this._viewContainer = _viewContainer;
        this._resolver = _resolver;
        this._compService = _compService;
        this._injService = _injService;
        this.selectSubject = new Rx_1.Subject();
        this.deselectSubject = new Rx_1.Subject();
        this.textChildren = {};
        this.selectedElement = false;
    }
    EditorComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var DESELECT = 'DESELECT';
        var SELECT = 'SELECT';
        var DELETE = 'DELETE';
        var deselects = Rx_1.Observable.from(this.deselectSubject).flatMap(function (deselect) {
            return Rx_1.Observable.of([DESELECT, deselect]).delay(200);
        });
        var selects = Rx_1.Observable.from(this.selectSubject).flatMap(function (select) {
            return Rx_1.Observable.of([SELECT, select]);
        });
        var deletes = Rx_1.Observable.fromEvent(this.deleteBtn.nativeElement, 'click').flatMap(function (click) {
            return Rx_1.Observable.of([DELETE, click]);
        });
        var deselectDeleteSeq = deselects.merge(deletes).merge(selects);
        var last;
        deselectDeleteSeq.subscribe(function (current) {
            var typeCur = current[0];
            if (SELECT === typeCur) {
                _this.selectElement();
            }
            else if (DESELECT === typeCur) {
                _this.deselectElement();
            }
            else if (DELETE === typeCur) {
                _this.destroyText(last[1]);
            }
            last = current;
        });
    };
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
        this.selectSubject.next(state);
    };
    EditorComponent.prototype.onTextValueChanged = function (state, value) {
        this.deselectSubject.next(state);
        // Text component without value is not useful and vainly retains space
        if (!value || '' === value.trim()) {
            this.destroyText(state);
        }
    };
    EditorComponent.prototype.destroyText = function (state) {
        this.deselectElement();
        this.textChildren[state.guid].destroy();
        delete this.textChildren[state.guid];
    };
    EditorComponent.prototype.selectElement = function () {
        this.selectedElement = true;
    };
    EditorComponent.prototype.deselectElement = function () {
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
    EditorComponent = __decorate([
        core_1.Component({
            selector: 'editor',
            template: '<div class="editor-container"><div class="editor-toolbar"><button type="button" aria-label="Add Image" class="btn btn-default"><span class="glyphicon glyphicon-picture"></span></button><button type="button" aria-label="Add Text" (click)="openTextElementFromAction()" class="btn btn-default"><span class="glyphicon glyphicon-text-background"></span></button><button #deleteBtn="" type="button" aria-label="Add Text" [disabled]="!selectedElement" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button></div><div (dblclick)="openTextElementFromDblClick($event)" class="wrapper editor-body"><div #editorBody=""></div></div></div>',
            styles: ['div.editor-container {  width: 100%;  min-height: 250px; }div.editor-toolbar {  background: linear-gradient(to top, #e2e2e2, #fbfbfb);  padding: 4px 6px;  border: 1px solid #ccc;  border-top-left-radius: 4px;  border-top-right-radius: 4px;  border-bottom-width: 0; }div.editor-toolbar > .btn:first-child {  margin-left: 2px; }div.editor-toolbar > .btn:last-child {  margin-right: 2px; }div.editor-toolbar .btn {  margin-left: 2px;  margin-right: 2px;  background-color: white; }div.editor-body {  position: relative;  width: 100%;  border: 1px solid #ccc;  border-bottom-left-radius: 4px;  border-bottom-right-radius: 4px;  min-height: 220px; }div.text-element {  position: absolute; }:host /deep/ [draggable] {  -moz-user-select: none;  -khtml-user-select: none;  -webkit-user-select: none;  user-select: none;  /* Required to make elements draggable in old WebKit */  -khtml-user-drag: element;  -webkit-user-drag: element; }:host /deep/ .dragging {  opacity: 0.4;  background-color: #eeeeee !important; }'],
            providers: [component_service_1.ComponentService, length_converter_1.EmConverterProvider, injection_service_1.InjectionService],
            directives: [text_component_1.TextComponent]
        }), 
        __metadata('design:paramtypes', [core_1.ViewContainerRef, core_1.ComponentResolver, component_service_1.ComponentService, injection_service_1.InjectionService])
    ], EditorComponent);
    return EditorComponent;
}());
exports.EditorComponent = EditorComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImVkaXRvci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQVNPLGVBQWUsQ0FBQyxDQUFBO0FBQ3ZCLCtCQU1PLHVCQUF1QixDQUFDLENBQUE7QUFDL0Isa0NBQStCLCtCQUErQixDQUFDLENBQUE7QUFDL0QsaUNBQWtDLDhCQUE4QixDQUFDLENBQUE7QUFDakUsa0NBQStCLDRCQUE0QixDQUFDLENBQUE7QUFDNUQsbUJBQWtDLFNBQVMsQ0FBQyxDQUFBO0FBUzVDO0lBUUkseUJBQW9CLGNBQStCLEVBQVUsU0FBMkIsRUFDcEUsWUFBNkIsRUFBVSxXQUE0QjtRQURuRSxtQkFBYyxHQUFkLGNBQWMsQ0FBaUI7UUFBVSxjQUFTLEdBQVQsU0FBUyxDQUFrQjtRQUNwRSxpQkFBWSxHQUFaLFlBQVksQ0FBaUI7UUFBVSxnQkFBVyxHQUFYLFdBQVcsQ0FBaUI7UUFOL0Usa0JBQWEsR0FBK0IsSUFBSSxZQUFPLEVBQXNCLENBQUM7UUFDOUUsb0JBQWUsR0FBK0IsSUFBSSxZQUFPLEVBQXNCLENBQUM7UUFDaEYsaUJBQVksR0FBK0MsRUFBRSxDQUFDO1FBQzlELG9CQUFlLEdBQVcsS0FBSyxDQUFDO0lBSXhDLENBQUM7SUFFRCx5Q0FBZSxHQUFmO1FBQUEsaUJBNEJDO1FBM0JHLElBQU0sUUFBUSxHQUFHLFVBQVUsQ0FBQztRQUM1QixJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7UUFDeEIsSUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO1FBRXhCLElBQUksU0FBUyxHQUFHLGVBQVUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLFFBQVE7WUFDbkUsTUFBTSxDQUFDLGVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxRQUFRLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsR0FB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