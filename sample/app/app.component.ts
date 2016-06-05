import {Component} from '@angular/core';
import {EditorComponent} from "../../src/editor.component";

@Component({
               selector: 'sample-app',
               template: '<editor></editor>',
               directives: [EditorComponent]
           })
export class AppComponent {
}