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
// TODO replace with import {EditorComponent} from "print-editor"
var editor_component_1 = require("../../print-editor/src/editor.component");
var AppComponent = (function () {
    function AppComponent() {
    }
    AppComponent = __decorate([
        core_1.Component({
            selector: 'sample-app',
            template: '<div class="row">' +
                '<div class="col-md-2 col-lg-2"></div>' +
                '<div class="col-md-8 col-lg-8"><editor></editor></div>' +
                '<div class="col-md-2 col-lg-2"></div>' +
                '</div>',
            directives: [editor_component_1.EditorComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImFwcC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF3QixlQUFlLENBQUMsQ0FBQTtBQUN4QyxpRUFBaUU7QUFDakUsaUNBQThCLHlDQUF5QyxDQUFDLENBQUE7QUFXeEU7SUFBQTtJQUNBLENBQUM7SUFWRDtRQUFDLGdCQUFTLENBQUM7WUFDSSxRQUFRLEVBQUUsWUFBWTtZQUN0QixRQUFRLEVBQUUsbUJBQW1CO2dCQUM3Qix1Q0FBdUM7Z0JBQ3ZDLHdEQUF3RDtnQkFDeEQsdUNBQXVDO2dCQUN2QyxRQUFRO1lBQ1IsVUFBVSxFQUFFLENBQUMsa0NBQWUsQ0FBQztTQUNoQyxDQUFDOztvQkFBQTtJQUViLG1CQUFDO0FBQUQsQ0FBQyxBQURELElBQ0M7QUFEWSxvQkFBWSxlQUN4QixDQUFBIn0=