import {Component, ViewContainerRef, ComponentRef, ComponentResolver, provide, ViewChild} from "@angular/core";
import {
    TextComponent,
    TextComponentState,
    VIEW_STATE_TOKEN,
    ON_VALUE_CHANGED_TOKEN,
    ON_FOCUS_TOKEN
} from "./text/text.component";
import {ComponentService} from "./component/component.service";
import {EmConverterProvider} from "./component/length-converter";
import {InjectionService} from "./inject/injection.service";

@Component({
               selector: 'editor',
               templateUrl: 'editor.component.html',
               styleUrls: ['editor.component.css'],
               providers: [ComponentService, EmConverterProvider, InjectionService],
               directives: [TextComponent]
           })
export class EditorComponent {
    @ViewChild('editorBody', {read: ViewContainerRef}) editorBody:ViewContainerRef;
    private textChildren:{[guid:string]:ComponentRef<TextComponent>} = {};
    private selectedElement:boolean = false;
    private suppressAction:() => void = () => {
    };

    constructor(private _viewContainer:ViewContainerRef, private _resolver:ComponentResolver,
                private _compService:ComponentService, private _injService:InjectionService) {
    }

    openTextElementFromDblClick(clickEvent) {
        let positionWithinBounds = this._compService.getPositionWithinParentElement(clickEvent,
                                                                                    TextComponent.DEFAULT_SIZE);
        let state = this.textComponentState(positionWithinBounds.x, positionWithinBounds.y);
        this.openTextElement(state);
    }

    openTextElementFromAction(event) {
        let state = this.textComponentState(event.x, event.y);
        this.openTextElement(state);
    }

    private textComponentState(left:number, top:number):TextComponentState {
        return {
            guid: this._injService.guid(),
            left: this._compService.pxSize(left),
            top: this._compService.pxSize(top)
        };
    }

    openTextElement(state:TextComponentState) {
        this._resolver.resolveComponent(TextComponent).then(textCompFactory => {
            let onTextValueChanged = this.onTextValueChanged.bind(this);
            let onTextFocus = this.onTextFocus.bind(this);
            let textComponentContext =
                this._injService.injector(this._viewContainer.injector,
                                          provide(VIEW_STATE_TOKEN, {useValue: state}),
                                          provide(ON_VALUE_CHANGED_TOKEN, {useValue: onTextValueChanged}),
                                          provide(ON_FOCUS_TOKEN, {useValue: onTextFocus}));
            this.textChildren[state.guid] =
                this.editorBody.createComponent(textCompFactory, undefined, textComponentContext);
        });
    }

    private onTextFocus(state:TextComponentState) {
        this.setSelected(true, () => this.destroyText(state));
    }

    private onTextValueChanged(state:TextComponentState, value:string) {
        // This function is called on text blur
        this.setSelected(false, () => {
        });
        // Text component without value is not useful and vainly retains space
        if (!value || "" === value.trim()) {
            this.destroyText(state);
        }
    }

    private setSelected(selected:boolean, suppressAction:() => void) {
        // Differ remove button enabling/disabling because it happens on focus/blur
        // Setting it immediately make it impossible to click on the button
        setTimeout(() => {
            this.selectedElement = selected;
            this.suppressAction = suppressAction;
        }, 20);
    }

    private destroyText(state:TextComponentState) {
        this.textChildren[state.guid].destroy();
        delete this.textChildren[state.guid];
    }
}