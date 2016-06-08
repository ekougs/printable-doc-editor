import {Component} from "@angular/core";
// TODO replace with import {EditorComponent} from "print-editor"
import {EditorComponent} from "../../print-editor/src/editor.component";

@Component({
               selector: 'sample-app',
               template: '<div class="row">' +
               '<div class="col-md-2 col-lg-2"></div>' +
               '<div class="col-md-8 col-lg-8"><editor></editor></div>' +
               '<div class="col-md-2 col-lg-2"></div>' +
               '</div>',
               directives: [EditorComponent]
           })
export class AppComponent {
}