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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require("@angular/core");
var size_1 = require("../component/size");
var length_1 = require("../component/length");
var length_unit_1 = require("../component/length-unit");
var draggable_directive_1 = require("../draggable.directive");
exports.VIEW_STATE_TOKEN = new core_1.OpaqueToken('textComponentViewState');
exports.ON_VALUE_CHANGED_TOKEN = new core_1.OpaqueToken('textComponentOnValueChanged');
exports.ON_FOCUS_TOKEN = new core_1.OpaqueToken('textComponentOnFocus');
var TextComponent = (function () {
    function TextComponent(state, onValueChanged, onFocus) {
        this.state = state;
        this.onValueChanged = onValueChanged;
        this.onFocus = onFocus;
        this.edit = true;
        state.width = TextComponent.DEFAULT_SIZE.widthAndUnit();
        state.height = TextComponent.DEFAULT_SIZE.heightAndUnit();
    }
    TextComponent.prototype.ngAfterViewInit = function () {
        this.editMode(this.textCompRef.nativeElement);
    };
    TextComponent.prototype.editMode = function (textComp) {
        textComp.contentEditable = true;
        this.edit = true;
        textComp.focus();
    };
    TextComponent.prototype.readOnlyMode = function (textComp) {
        this.onValueChanged(this.state, textComp.innerText);
        textComp.contentEditable = false;
        this.edit = false;
    };
    TextComponent.DEFAULT_SIZE = new size_1.Size(new length_1.Length(150), new length_1.Length(1.9, length_unit_1.LengthUnit.em));
    __decorate([
        core_1.ViewChild('textComp', { read: core_1.ElementRef }), 
        __metadata('design:type', core_1.ElementRef)
    ], TextComponent.prototype, "textCompRef", void 0);
    TextComponent = __decorate([
        core_1.Component({
            selector: 'text',
            template: '<div [ngClass]="{edit: edit, readOnly: !edit}" [style.top]="state.top" [style.left]="state.left" [style.width]="state.width" [style.height]="state.height" (click)="editMode(textComp)" (blur)="readOnlyMode(textComp)" (focus)="onFocus(state)" [draggable]="" #textComp="" class="card-txt">{{value}}</div>',
            styles: ['.card-txt {  position: absolute;  overflow: auto;  padding: 4px;  line-height: 1em;  background-color: transparent; }.card-txt.edit {  resize: both;  border: dotted 2px;  border-radius: 5px; }.card-txt.edit:focus {  resize: both;  border: dotted 2px;  border-radius: 5px;  outline: none; }.card-txt.readOnly {  resize: inherit;  border: none; }'],
            directives: [draggable_directive_1.DraggableDirective]
        }),
        __param(0, core_1.Inject(exports.VIEW_STATE_TOKEN)),
        __param(1, core_1.Inject(exports.ON_VALUE_CHANGED_TOKEN)),
        __param(2, core_1.Inject(exports.ON_FOCUS_TOKEN)), 
        __metadata('design:paramtypes', [Object, Function, Function])
    ], TextComponent);
    return TextComponent;
}());
exports.TextComponent = TextComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXh0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBQW1GLGVBQWUsQ0FBQyxDQUFBO0FBQ25HLHFCQUFtQixtQkFBbUIsQ0FBQyxDQUFBO0FBQ3ZDLHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBQzNDLDRCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ3BELG9DQUFpQyx3QkFBd0IsQ0FBQyxDQUFBO0FBRTdDLHdCQUFnQixHQUFlLElBQUksa0JBQVcsQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDO0FBQ3pFLDhCQUFzQixHQUFlLElBQUksa0JBQVcsQ0FBQyw2QkFBNkIsQ0FBQyxDQUFDO0FBQ3BGLHNCQUFjLEdBQWUsSUFBSSxrQkFBVyxDQUFDLHNCQUFzQixDQUFDLENBQUM7QUFnQmxGO0lBS0ksdUJBQThDLEtBQXdCLEVBQ2xCLGNBQWlELEVBQ3pELE9BQWtDO1FBRmhDLFVBQUssR0FBTCxLQUFLLENBQW1CO1FBQ2xCLG1CQUFjLEdBQWQsY0FBYyxDQUFtQztRQUN6RCxZQUFPLEdBQVAsT0FBTyxDQUEyQjtRQUp0RSxTQUFJLEdBQVcsSUFBSSxDQUFDO1FBS3hCLEtBQUssQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsQ0FBQztRQUN4RCxLQUFLLENBQUMsTUFBTSxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsYUFBYSxFQUFFLENBQUM7SUFDOUQsQ0FBQztJQUVELHVDQUFlLEdBQWY7UUFDSSxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELGdDQUFRLEdBQVIsVUFBUyxRQUFRO1FBQ2IsUUFBUSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsUUFBUSxDQUFDLEtBQUssRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCxvQ0FBWSxHQUFaLFVBQWEsUUFBUTtRQUNqQixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLEVBQUUsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BELFFBQVEsQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDO0lBQ3RCLENBQUM7SUF6Qk0sMEJBQVksR0FBUSxJQUFJLFdBQUksQ0FBQyxJQUFJLGVBQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLGVBQU0sQ0FBQyxHQUFHLEVBQUUsd0JBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3JGO1FBQUMsZ0JBQVMsQ0FBQyxVQUFVLEVBQUUsRUFBQyxJQUFJLEVBQUUsaUJBQVUsRUFBQyxDQUFDOztzREFBQTtJQVI5QztRQUFDLGdCQUFTLENBQUM7WUFDSSxRQUFRLEVBQUUsTUFBTTtZQUNoQixXQUFXLEVBQUUscUJBQXFCO1lBQ2xDLFNBQVMsRUFBRSxDQUFDLG9CQUFvQixDQUFDO1lBQ2pDLFVBQVUsRUFBRSxDQUFDLHdDQUFrQixDQUFDO1NBQ25DLENBQUM7bUJBTUksYUFBTSxDQUFDLHdCQUFnQixDQUFDO21CQUN4QixhQUFNLENBQUMsOEJBQXNCLENBQUM7bUJBQzlCLGFBQU0sQ0FBQyxzQkFBYyxDQUFDOztxQkFSMUI7SUE0QmIsb0JBQUM7QUFBRCxDQUFDLEFBM0JELElBMkJDO0FBM0JZLHFCQUFhLGdCQTJCekIsQ0FBQSJ9