import {
    Component,
    ViewContainerRef,
    ElementRef,
    ComponentRef,
    ComponentResolver,
    AfterViewInit,
    provide,
    ViewChild
} from "@angular/core";
import {Observable} from "rxjs/Rx";
import {TextComponent, TextComponentState, VIEW_STATE_TOKEN, ON_VALUE_CHANGED_TOKEN} from "./text/text.component";
import {ComponentService} from "./component/component.service";
import {EmConverterProvider} from "./component/length-converter";
import {InjectionService} from "./inject/injection.service";

let SVG = require('svg.js');
// Important to load drag capability
let draggable = require('svg.draggable.js');

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
    @ViewChild('fileInput', {read: ElementRef}) private imageInput:ElementRef;
    @ViewChild('editorBodyInner', {read: ViewContainerRef}) private editorBodyInner:ViewContainerRef;
    private textInputChildren:{[guid:string]:ComponentRef<TextComponent>} = {};
    private _doc;
    private suppressFn:() => void = () => {
    };
    private selectedElement = false;

    constructor(private _viewContainer:ViewContainerRef, private _resolver:ComponentResolver,
                private _compService:ComponentService, private _injService:InjectionService) {
    }


    ngAfterViewInit() {
        this.initSvgDoc();
        this.initImageInputListener();
        Observable.fromEvent<any>(this.editorBody.element.nativeElement, 'click')
                  .subscribe(this.deselectElement.bind(this);
    }

    private initSvgDoc() {
        let editorBodyNative = this.editorBody.element.nativeElement;
        let bounds = editorBodyNative.getBoundingClientRect();
        this._doc = SVG(editorBodyNative).size(bounds.width, bounds.height);
    }

    private initImageInputListener() {
        const width = 250;
        let fileChanges = Observable.fromEvent<any>(this.imageInput.nativeElement, 'change')
                                    .flatMap((event) => {
                                        return event.target.files;
                                    });
        fileChanges.subscribe((file:any) => {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.openImageElement(event, width);
            };
            reader.readAsDataURL(file);
        });
    }

    private openImageElement(event:any, width:number) {
        let image = this._doc.image((this._injService.guid()));
        image.load(event.target.result)
             .loaded((loader) => {
                 image.height(loader.ratio * width).width(width);
             })
             .x(10)
             .y(10)
             .draggable();
        this.initSelectionListener(image);
    }

    openTextElementFromDblClick(clickEvent) {
        let positionWithinBounds =
            this._compService.getPositionWithinParentElement(clickEvent, TextComponent.DEFAULT_SIZE);
        let state = this.textComponentState(positionWithinBounds.x, positionWithinBounds.y);
        this.openTextElement(state);
    }

    private textComponentState(left:number, top:number):TextComponentState {
        return {
            guid: this._injService.guid(),
            left: this._compService.pxSize(left),
            top: this._compService.pxSize(top),
            leftPx: left,
            topPx: top
        };
    }

    private openTextElement(state:TextComponentState) {
        this._resolver.resolveComponent(TextComponent).then(textCompFactory => {
            let onTextValueChanged = this.onTextValueChanged.bind(this);
            let textComponentContext =
                this._injService.injector(this._viewContainer.injector,
                                          provide(VIEW_STATE_TOKEN, {useValue: state}),
                                          provide(ON_VALUE_CHANGED_TOKEN, {useValue: onTextValueChanged}));
            this.textInputChildren[state.guid] =
                this.editorBodyInner.createComponent(textCompFactory, undefined, textComponentContext);
        });
    }

    private onTextValueChanged(state:TextComponentState, value:string) {
        this.destroyTextInput(state);
        if (!value || '' === value) {
            return;
        }
        let text = this.createText(value, state);
        this.initSelectionListener(text);
        this.initTextModificationListener(text);
    }

    private initSelectionListener(element:any) {
        Observable.fromEvent<any>(element, 'click')
                  .subscribe((event) => {
                      event.stopPropagation();
                      this.selectedElement = true;
                      this.suppressFn = () => {
                          this.destroySVGElement(element);
                      };
                  });
    }

    private initTextModificationListener(text:any) {
        Observable.fromEvent<any>(text, 'dblclick')
                  .subscribe(() => {
                      event.stopPropagation();
                      let bounds = text.bbox();
                      let state = this.textComponentState(bounds.x, bounds.y);
                      state.value = '';
                      text.lines().each(function () {
                          state.value += (this.node.textContent + '\n');
                      });
                      state.value = state.value.trim();
                      this.destroySVGElement(text);
                      this.openTextElement(state);
                  });
    }

    private createText(value:string, state:TextComponentState) {
        return this._doc.text((add) => {
            let lines = value.split('\n');
            lines.forEach((line) => {
                add.tspan(line).newLine();
            });
        }).x(state.leftPx).y(state.topPx).draggable();
    }

    private destroyTextInput(state) {
        this.textInputChildren[state.guid].destroy();
        delete this.textInputChildren[state.guid];
    }

    private destroySVGElement(element) {
        element.remove();
        this.deselectElement();
    }

    private deselectElement() {
        this.suppressFn = () => {
        };
        this.selectedElement = false;
    }
}