import {OpaqueToken, Injector, provide} from "@angular/core";
import {it, describe, expect} from "@angular/core/testing";
import {InjectionService} from "../../src/inject/injection.service";
import {Point} from "../../src/component/point";
import {point} from "../utils";

const BASE_POINT_TOKEN = new OpaqueToken('BASE_POINT');

class DummyInjector extends Injector {
    get(token:any, notFoundValue?:any):any {
        throw notFoundValue;
    }
}

describe('Injection Service Tests', function () {
    let service = new InjectionService();

    it('should return 2 different guids', function () {
        expect(service.guid()).not.toEqual(service.guid());
    });

    it('should return retrieve provided value', function () {
        let basePoint:Point = point(42, 42);
        let injector = service.injector(new DummyInjector(), provide(BASE_POINT_TOKEN, {useValue: basePoint}));
        expect(injector.get(BASE_POINT_TOKEN)).toEqual(basePoint);
    });

    it('should throw not found value if no provider', function () {
        let injector = service.injector(new DummyInjector());
        expect(() => injector.get(BASE_POINT_TOKEN)).toThrow();
    });
});