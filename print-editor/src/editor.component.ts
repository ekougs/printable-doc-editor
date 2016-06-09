import {Component, ViewContainerRef, ComponentRef, ComponentResolver, provide, ViewChild} from "@angular/core";
import {TextComponent, TextComponentState, VIEW_STATE_TOKEN, ON_VALUE_CHANGED_TOKEN} from "./text/text.component";
import {ComponentService, Point} from "./component.service";

@Component({
               selector: 'editor',
               templateUrl: 'editor.component.html',
               styleUrls: ['editor.component.css'],
               providers: [ComponentService],
               directives: [TextComponent]
           })
export class EditorComponent {
    @ViewChild('editorBody', {read: ViewContainerRef}) editorBody:ViewContainerRef;
    private textChildren:{[guid:string]:ComponentRef<TextComponent>} = {};

    constructor(private _viewContainer:ViewContainerRef, private _resolver:ComponentResolver,
                private _service:ComponentService) {
    }

    openTextElementFromDblClick(event) {
        let position:Point = this._service.getClickPosition(event);
        let state = this.textComponentState(position.x, position.y);
        this.openTextElement(state);
    }

    openTextElementFromAction(event) {
        let state = this.textComponentState(event.x, event.y);
        this.openTextElement(state);
    }

    private textComponentState(left:number, top:number):TextComponentState {
        return {
            guid: this._service.guid(),
            left: this._service.pxSize(left),
            top: this._service.pxSize(top)
        };
    }

    openTextElement(state:TextComponentState) {
        this._resolver.resolveComponent(TextComponent).then(textCompFactory => {
            let textComponentContext =
                this._service.injector(this._viewContainer.injector,
                                       provide(VIEW_STATE_TOKEN, {useValue: state}),
                                       provide(ON_VALUE_CHANGED_TOKEN, {useValue: this.onTextValueChanged.bind(this)}));
            this.textChildren[state.guid] =
                this.editorBody.createComponent(textCompFactory, undefined, textComponentContext);
        });
    }

    private onTextValueChanged(state:TextComponentState, value:string) {
        // Text component without value is not useful and vainly retains space
        if (!value || "" === value.trim()) {
            this.textChildren[state.guid].destroy();
        }
    }
}