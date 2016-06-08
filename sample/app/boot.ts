import {enableProdMode} from "@angular/core";
import {ROUTER_PROVIDERS} from "@angular/router";
import {HTTP_PROVIDERS} from "@angular/http";
import {bootstrap} from "@angular/platform-browser-dynamic";
import {AppComponent} from "./app.component";

bootstrap(AppComponent, [
    ROUTER_PROVIDERS, HTTP_PROVIDERS
]);
