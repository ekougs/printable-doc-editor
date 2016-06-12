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
var EmConverterProvider = (function () {
    function EmConverterProvider() {
    }
    EmConverterProvider.prototype.converter = function (context) {
        return new ActualEmConverter(context);
    };
    EmConverterProvider = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], EmConverterProvider);
    return EmConverterProvider;
}());
exports.EmConverterProvider = EmConverterProvider;
var ActualEmConverter = (function () {
    function ActualEmConverter(context) {
        this.context = context;
    }
    ActualEmConverter.prototype.toPx = function (lengthInEm) {
        var fontSize = getComputedStyle(this.context || document.documentElement).fontSize.replace("px", "");
        return lengthInEm * parseFloat(fontSize);
    };
    return ActualEmConverter;
}());
exports.ActualEmConverter = ActualEmConverter;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGVuZ3RoLWNvbnZlcnRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImxlbmd0aC1jb252ZXJ0ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBLHFCQUF5QixlQUFlLENBQUMsQ0FBQTtBQUd6QztJQUFBO0lBSUEsQ0FBQztJQUhHLHVDQUFTLEdBQVQsVUFBVSxPQUFPO1FBQ2IsTUFBTSxDQUFDLElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUpMO1FBQUMsaUJBQVUsRUFBRTs7MkJBQUE7SUFLYiwwQkFBQztBQUFELENBQUMsQUFKRCxJQUlDO0FBSlksMkJBQW1CLHNCQUkvQixDQUFBO0FBTUQ7SUFDSSwyQkFBb0IsT0FBUTtRQUFSLFlBQU8sR0FBUCxPQUFPLENBQUM7SUFDNUIsQ0FBQztJQUVELGdDQUFJLEdBQUosVUFBSyxVQUFpQjtRQUNsQixJQUFJLFFBQVEsR0FBRyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLFFBQVEsQ0FBQyxlQUFlLENBQUMsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztRQUNyRyxNQUFNLENBQUMsVUFBVSxHQUFHLFVBQVUsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM3QyxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLEFBUkQsSUFRQztBQVJZLHlCQUFpQixvQkFRN0IsQ0FBQSJ9