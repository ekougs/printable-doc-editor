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
exports.ON_FOCUS_TOKEN = new core_1.OpaqueToken('textComponentOnFocus');
var TextComponent = (function () {
    function TextComponent(state, onValueChanged) {
        this.state = state;
        this.onValueChanged = onValueChanged;
        state.width = TextComponent.DEFAULT_SIZE.widthAndUnit();
        state.height = TextComponent.DEFAULT_SIZE.heightAndUnit();
    }
    TextComponent.prototype.ngAfterViewInit = function () {
        var _this = this;
        var element = this.textCompRef.nativeElement;
        element.focus();
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
                element.style.height = "1px";
                element.style.height = (5 + element.scrollHeight) + "px";
            }
            if (ESCAPE === key) {
                _this.onValueChanged(_this.state, undefined);
            }
        });
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
            template: '<textarea [ngClass]="{edit: edit, readOnly: !edit}" [style.top]="state.top" [style.left]="state.left" [style.width]="state.width" [style.height]="state.height" (blur)="propagateValueChanged()" rows="1" #textComp="" class="form-control"></textarea>',
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGV4dC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ0ZXh0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBQUEscUJBQW1GLGVBQWUsQ0FBQyxDQUFBO0FBQ25HLHFCQUFtQixtQkFBbUIsQ0FBQyxDQUFBO0FBQ3ZDLHVCQUFxQixxQkFBcUIsQ0FBQyxDQUFBO0FBQzNDLDRCQUF5QiwwQkFBMEIsQ0FBQyxDQUFBO0FBQ3BELG1CQUF5QixTQUFTLENBQUMsQ0FBQTtBQUV0Qix3QkFBZ0IsR0FBZSxJQUFJLGtCQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQztBQUN6RSw4QkFBc0IsR0FBZSxJQUFJLGtCQUFXLENBQUMsNkJBQTZCLENBQUMsQ0FBQztBQUNwRixzQkFBYyxHQUFlLElBQUksa0JBQVcsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0FBa0JsRjtJQUlJLHVCQUE4QyxLQUF3QixFQUNsQixjQUFpRDtRQUR2RCxVQUFLLEdBQUwsS0FBSyxDQUFtQjtRQUNsQixtQkFBYyxHQUFkLGNBQWMsQ0FBbUM7UUFDakcsS0FBSyxDQUFDLEtBQUssR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3hELEtBQUssQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxhQUFhLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRUQsdUNBQWUsR0FBZjtRQUFBLGlCQThCQztRQTdCRyxJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQztRQUM3QyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7UUFFaEIsSUFBTSxLQUFLLEdBQVUsRUFBRSxDQUFDO1FBQ3hCLElBQU0sU0FBUyxHQUFVLENBQUMsQ0FBQztRQUMzQixJQUFNLE1BQU0sR0FBVSxFQUFFLENBQUM7UUFDekIsSUFBTSxXQUFXLEdBQUcsQ0FBQyxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQy9DLElBQU0sTUFBTSxHQUFVLEVBQUUsQ0FBQztRQUV6QixJQUFNLFlBQVksR0FBRyxFQUFFLENBQUM7UUFDeEIsWUFBWSxDQUFDLElBQUksT0FBakIsWUFBWSxFQUFTLFdBQVcsQ0FBQyxDQUFDO1FBQ2xDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFMUIsSUFBSSxRQUFRLEdBQUcsZUFBVSxDQUFDLFNBQVMsQ0FBTSxPQUFPLEVBQUUsT0FBTyxDQUFDO2FBQ2hDLE1BQU0sQ0FBQyxVQUFDLEtBQUs7WUFDVixNQUFNLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7UUFDdEQsQ0FBQyxDQUFDO2FBQ0QsR0FBRyxDQUFDLFVBQUMsS0FBSztZQUNQLE1BQU0sQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDO1FBQ3pCLENBQUMsQ0FBQyxDQUFDO1FBQzVCLFFBQVEsQ0FBQyxTQUFTLENBQUMsVUFBQyxHQUFHO1lBQ25CLEVBQUUsQ0FBQSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNqQyxPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxLQUFLLENBQUM7Z0JBQzdCLE9BQU8sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsR0FBRyxJQUFJLENBQUM7WUFDN0QsQ0FBQztZQUNELEVBQUUsQ0FBQSxDQUFDLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDO2dCQUNoQixLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxLQUFLLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDL0MsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELDZDQUFxQixHQUFyQjtRQUNJLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMxRSxDQUFDO0lBM0NNLDBCQUFZLEdBQVEsSUFBSSxXQUFJLENBQUMsSUFBSSxlQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsSUFBSSxlQUFNLENBQUMsR0FBRyxFQUFFLHdCQUFVLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNyRjtRQUFDLGdCQUFTLENBQUMsVUFBVSxFQUFFLEVBQUMsSUFBSSxFQUFFLGlCQUFVLEVBQUMsQ0FBQzs7c0RBQUE7SUFSOUM7UUFBQyxnQkFBUyxDQUFDO1lBQ0ksUUFBUSxFQUFFLE1BQU07WUFDaEIsV0FBVyxFQUFFLHFCQUFxQjtZQUNsQyxTQUFTLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQztZQUNqQyxVQUFVLEVBQUUsRUFBRTtTQUNqQixDQUFDO21CQUtJLGFBQU0sQ0FBQyx3QkFBZ0IsQ0FBQzttQkFDeEIsYUFBTSxDQUFDLDhCQUFzQixDQUFDOztxQkFObEM7SUE4Q2Isb0JBQUM7QUFBRCxDQUFDLEFBN0NELElBNkNDO0FBN0NZLHFCQUFhLGdCQTZDekIsQ0FBQSJ9