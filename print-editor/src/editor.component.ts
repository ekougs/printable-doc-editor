import {
    Component,
    ViewContainerRef,
    ElementRef,
    ComponentRef,
    ComponentResolver,
    AfterViewInit,
    provide,
    ViewChild
} from '@angular/core';
import {
    TextComponent,
    TextComponentState,
    VIEW_STATE_TOKEN,
    ON_VALUE_CHANGED_TOKEN,
    ON_FOCUS_TOKEN
} from './text/text.component';
import {ComponentService} from './component/component.service';
import {EmConverterProvider} from './component/length-converter';
import {InjectionService} from './inject/injection.service';
import {Observable, Subject} from 'rxjs/Rx';

@Component({
               selector: 'editor',
               templateUrl: 'editor.component.html',
               styleUrls: ['editor.component.css'],
               providers: [ComponentService, EmConverterProvider, InjectionService],
               directives: [TextComponent]
           })
export class EditorComponent implements AfterViewInit {
    @ViewChild('editorBody', {read: ViewContainerRef}) private editorBody:ViewContainerRef;
    @ViewChild('deleteBtn', {read: ElementRef}) private deleteBtn:ElementRef;
    private selectSubject:Subject<TextComponentState> = new Subject<TextComponentState>();
    private deselectSubject:Subject<TextComponentState> = new Subject<TextComponentState>();
    private textChildren:{[guid:string]:ComponentRef<TextComponent>} = {};
    private selectedElement:boolean = false;

    constructor(private _viewContainer:ViewContainerRef, private _resolver:ComponentResolver,
                private _compService:ComponentService, private _injService:InjectionService) {
    }

    ngAfterViewInit() {
        const DESELECT = 'DESELECT';
        const SELECT = 'SELECT';
        const DELETE = 'DELETE';

        let deselects = Observable.from(this.deselectSubject).flatMap((deselect) => {
            return Observable.of([DESELECT, deselect]).delay(200);
        });
        let selects = Observable.from(this.selectSubject).flatMap((select) => {
            return Observable.of([SELECT, select]);
        });
        let deletes = Observable.fromEvent(this.deleteBtn.nativeElement, 'click').flatMap((click) => {
            return Observable.of([DELETE, click]);
        });
        let deselectDeleteSeq = deselects.merge(deletes).merge(selects);

        let last;
        deselectDeleteSeq.subscribe((current) => {
            let typeCur = current[0];
            if(SELECT === typeCur) {
                this.selectElement();
            } else if(DESELECT === typeCur) {
                this.deselectElement();
            } else if(DELETE === typeCur) {
                this.destroyText(last[1]);
            }
            last = current;
        });
    }

    openTextElementFromDblClick(clickEvent) {
        let positionWithinBounds =
            this._compService.getPositionWithinParentElement(clickEvent, TextComponent.DEFAULT_SIZE);
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
        this.selectSubject.next(state);
    }

    private onTextValueChanged(state:TextComponentState, value:string) {
        this.deselectSubject.next(state);
        // Text component without value is not useful and vainly retains space
        if (!value || '' === value.trim()) {
            this.destroyText(state);
        }
    }

    private destroyText(state) {
        this.deselectElement();
        this.textChildren[state.guid].destroy();
        delete this.textChildren[state.guid];
    }

    private selectElement() {
        this.selectedElement = true;
    }

    private deselectElement() {
        this.selectedElement = false;
    }
}