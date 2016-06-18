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
var Rx_1 = require("rxjs/Rx");
exports.VIEW_STATE_TOKEN = new core_1.OpaqueToken('textComponentViewState');
exports.ON_VALUE_CHANGED_TOKEN = new core_1.OpaqueToken('textComponentOnValueChanged');
var TextComponent = (function () {
    function TextComponent(state, onValueChanged) {
        this.state = state;
        this.onValueChanged = onValueChanged;
        state.width = state.width ? state.width : TextComponent.DEFAULT_SIZE.widthAndUnit();
        state.height = state.height ? state.height : TextComponent.DEFAULT_SIZE.heightAndUnit();
        state.value = state.value ? state.value : '';
    }
    TextComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var element = this.textCompRef.nativeElement;
        element.focus();
        this.resizeToContent(element);
        var ENTER = 13;
        var BACKSPACE = 8;
        var DELETE = 46;
        var RESIZE_KEYS = [ENTER, BACKSPACE, DELETE];
        var ESCAPE = 27;
        var WATCHED_KEYS = [];
        WATCHED_KEYS.push.apply(WATCHED_KEYS, RESIZE_KEYS);
        WATCHED_KEYS.push(ESCAPE);
        var onEnters = Rx_1.Observable.fromEvent(element, 'keyup')
            .filter(function (event) {
            return WATCHED_KEYS.indexOf(event.keyCode) !== -1;
        })
            .map(function (event) {
            return event.keyCode;
        });
        onEnters.subscribe(function (key) {
            if (RESIZE_KEYS.indexOf(key) !== -1) {
                _this.resizeToContent(element);
            }
            if (ESCAPE === key) {
                _this.onValueChanged(_this.state, undefined);
            }
        });
    };
    TextComponent.prototype.resizeToContent = function (element) {
        element.style.height = "1px";
        element.style.height = (5 + element.scrollHeight) + "px";
    };
    TextComponent.prototype.propagateValueChanged = function () {
        this.onValueChanged(this.state, this.textCompRef.nativeElement.value);
    };
    TextComponent.DEFAULT_SIZE = new size_1.Size(new length_1.Length(150), new length_1.Length(1.9, length_unit_1.LengthUnit.em));
    __decorate([
        core_1.ViewChild('textComp', { read: core_1.ElementRef }), 
        __metadata('design:type', core_1.ElementRef)
    ], TextComponent.prototype, "textCompRef", void 0);
    TextComponent = __decorate([
        core_1.Component({
            selector: 'text',
            template: '<textarea [ngClass]="{edit: edit, readOnly: !edit}" [style.top]="state.top" [style.left]="state.left" [style.width]="state.width" [style.height]="state.height" (blur)="propagateValueChanged()" rows="1" [value]="state.value" #textComp="" class="form-control"></textarea>',
            styles: ['textarea {  position: absolute;  padding: 4px;  background-color: transparent; }'],
            directives: []
        }),
        __param(0, core_1.Inject(exports.VIEW_STATE_TOKEN)),
        __param(1, core_1.Inject(exports.ON_VALUE_CHANGED_TOKEN)), 
        __metadata('design:paramtypes', [Object, Function])
    ], TextComponent);
    return TextComponent;
}());
exports.TextComponent = TextComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXh0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBQW1GLGVBQWUsQ0FBQyxDQUFBO0FBQ25HLHFCQUFtQixtQkFBbUIsQ0FBQyxDQUFBO0FBQ3ZDLHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBQzNDLDRCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ3BELG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUV0Qix3QkFBZ0IsR0FBZSxJQUFJLGtCQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN6RSw4QkFBc0IsR0FBZSxJQUFJLGtCQUFXLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQW1Cakc7SUFJSSx1QkFBOEMsS0FBd0IsRUFDbEIsY0FBaUQ7UUFEdkQsVUFBSyxHQUFMLEtBQUssQ0FBbUI7UUFDbEIsbUJBQWMsR0FBZCxjQUFjLENBQW1DO1FBQ2pHLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsS0FBSyxHQUFHLGFBQWEsQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLENBQUM7UUFDcEYsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQztRQUN4RixLQUFLLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7SUFDakQsQ0FBQztJQUVELHVDQUFlLEdBQWY7UUFBQSxpQkE4QkM7UUE3QkcsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxhQUFhLENBQUM7UUFDN0MsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENB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