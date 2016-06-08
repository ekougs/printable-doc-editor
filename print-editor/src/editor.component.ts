import {
    Component,
    ViewContainerRef,
    ComponentResolver,
    ReflectiveInjector,
    Injector,
    provide,
    ViewChild
} from "@angular/core";
import {TextComponent, VIEW_STATE_TOKEN, TextComponentState} from "./text/text.component";
import {PositionService, Point} from "./position.service";

@Component({
               selector: 'editor',
               templateUrl: 'editor.component.html',
               styleUrls: ['editor.component.css'],
               providers: [PositionService],
               directives: [TextComponent]
           })
export class EditorComponent {
    @ViewChild('editorBody', {read: ViewContainerRef}) editorBody:ViewContainerRef;
    private elementCount:number = 0;

    constructor(private _viewContainer:ViewContainerRef, private _resolver:ComponentResolver,
                private positionService:PositionService) {
    }

    openTextElementFromDblClick(event) {
        let position:Point = this.positionService.getClickPosition(event);
        console.log(position);
        let state = {
            left: EditorComponent.getPxSize(position.x),
            top: EditorComponent.getPxSize(position.y)
        };
        this.openTextElement(state);
    }

    openTextElementFromAction(event) {
        console.log(event);
        let state = {
            left: EditorComponent.getPxSize(event.offsetX),
            top: EditorComponent.getPxSize(event.offsetY)
        };
        this.openTextElement(state);
    }

    openTextElement(state:TextComponentState) {
        this._resolver.resolveComponent(TextComponent).then(textCompFactory => {
            this.editorBody.createComponent(textCompFactory, undefined,
                                            EditorComponent.getComponentContext(this._viewContainer.injector, state));
        });
    }

    private static getComponentContext(injector:Injector, state:TextComponentState):Injector {
        let reflectiveInjector =
            ReflectiveInjector.resolveAndCreate([
                                                    provide(Injector, {useValue: injector}),
                                                    provide(VIEW_STATE_TOKEN, {useValue: state})
                                                ]);
        return new ComposedInjector(injector, reflectiveInjector);
    }

    private static getPxSize(size):String {
        return size + 'px';
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