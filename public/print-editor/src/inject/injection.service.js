"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
var InjectionService = (function () {
    function InjectionService() {
    }
    InjectionService.prototype.injector = function (baseInjector) {
        var providers = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            providers[_i - 1] = arguments[_i];
        }
        var reflectiveInjector = core_1.ReflectiveInjector.resolveAndCreate(providers);
        return new ComposedInjector(baseInjector, reflectiveInjector);
    };
    InjectionService.prototype.guid = function () {
        var s4 = this.s4;
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    };
    InjectionService.prototype.s4 = function () {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    };
    InjectionService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], InjectionService);
    return InjectionService;
}());
exports.InjectionService = InjectionService;
var ComposedInjector = (function (_super) {
    __extends(ComposedInjector, _super);
    function ComposedInjector(_injector1, _injector2) {
        _super.call(this);
        this._injector1 = _injector1;
        this._injector2 = _injector2;
    }
    ComposedInjector.prototype.get = function (token, notFoundValue) {
        var result = undefined;
        try {
            result = this._injector1.get(token, notFoundValue);
        }
        catch (e) {
        }
        try {
            result = this._injector2.get(token, notFoundValue);
        }
        catch (e) {
        }
        if (result === undefined) {
            throw new Error("No provider for " + token);
        }
        return result;
    };
    return ComposedInjector;
}(core_1.Injector));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5qZWN0aW9uLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmplY3Rpb24uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7QUFBQSxxQkFBaUUsZUFBZSxDQUFDLENBQUE7QUFHakY7SUFBQTtJQWNBLENBQUM7SUFiRyxtQ0FBUSxHQUFSLFVBQVMsWUFBcUI7UUFBRSxtQkFBdUI7YUFBdkIsV0FBdUIsQ0FBdkIsc0JBQXVCLENBQXZCLElBQXVCO1lBQXZCLGtDQUF1Qjs7UUFDbkQsSUFBSSxrQkFBa0IsR0FBRyx5QkFBa0IsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUN4RSxNQUFNLENBQUMsSUFBSSxnQkFBZ0IsQ0FBQyxZQUFZLEVBQUUsa0JBQWtCLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBRUQsK0JBQUksR0FBSjtRQUNJLElBQUksRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUM7UUFDakIsTUFBTSxDQUFDLEVBQUUsRUFBRSxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxHQUFHLEdBQUcsRUFBRSxFQUFFLEdBQUcsR0FBRyxHQUFHLEVBQUUsRUFBRSxHQUFHLEdBQUcsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsR0FBRyxFQUFFLEVBQUUsQ0FBQztJQUN6RixDQUFDO0lBRU8sNkJBQUUsR0FBVjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDL0UsQ0FBQztJQWRMO1FBQUMsaUJBQVUsRUFBRTs7d0JBQUE7SUFlYix1QkFBQztBQUFELENBQUMsQUFkRCxJQWNDO0FBZFksd0JBQWdCLG1CQWM1QixDQUFBO0FBRUQ7SUFBK0Isb0NBQVE7SUFDbkMsMEJBQW9CLFVBQW1CLEVBQVUsVUFBbUI7UUFDaEUsaUJBQU8sQ0FBQztRQURRLGVBQVUsR0FBVixVQUFVLENBQVM7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFTO0lBRXBFLENBQUM7SUFFRCw4QkFBRyxHQUFILFVBQUksS0FBUyxFQUFFLGFBQWtCO1FBQzdCLElBQUksTUFBTSxHQUFHLFNBQVMsQ0FBQztRQUN2QixJQUFJLENBQUM7WUFDRCxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZELENBQUU7UUFBQSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRWIsQ0FBQztRQUNELElBQUksQ0FBQztZQUNELE1BQU0sR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFDdkQsQ0FBRTtRQUFBLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFYixDQUFDO1FBQ0QsRUFBRSxDQUFDLENBQUMsTUFBTSxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsTUFBTSxJQUFJLEtBQUssQ0FBQyxrQkFBa0IsR0FBRyxLQUFLLENBQUMsQ0FBQTtRQUMvQyxDQUFDO1FBQ0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztJQUNsQixDQUFDO0lBQ0wsdUJBQUM7QUFBRCxDQUFDLEFBdEJELENBQStCLGVBQVEsR0FzQnRDIn0=