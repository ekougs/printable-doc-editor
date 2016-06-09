import {Injectable, Provider, Injector, ReflectiveInjector} from "@angular/core";

@Injectable()
export class InjectionService {
    injector(baseInjector:Injector, ...providers:Provider[]):Injector {
        let reflectiveInjector = ReflectiveInjector.resolveAndCreate(providers);
        return new ComposedInjector(baseInjector, reflectiveInjector);
    }

    guid():string {
        let s4 = this.s4;
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    private s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
}

class ComposedInjector extends Injector {
    constructor(private _injector1:Injector, private _injector2:Injector) {
        super();
    }

    get(token:any, notFoundValue?:any) {
        let result = undefined;
        try {
            result = this._injector1.get(token, notFoundValue);
        } catch (e) {

        }
        try {
            result = this._injector2.get(token, notFoundValue);
        } catch (e) {

        }
        if (result === undefined) {
            throw new Error("No provider for " + token)
        }
        return result;
    }
}