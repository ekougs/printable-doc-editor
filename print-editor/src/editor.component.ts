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
// Important to load selection capability
let select = require('svg.select.js');
// Important to load resize capability, depends on select
let resize = require('svg.resize.js');

const SELECT_OPTIONS_RESIZE = {deepSelect: false, radius: 5, rotationPoint: false};
const SELECT_OPTIONS_NO_RESIZE = {deepSelect: false, radius: 5, rotationPoint: false, points: false};

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
    private suppressFns:(() => void)[] = [];
    private deselectFns:(() => void)[] = [];
    private selectedElement = false;

    constructor(private _viewContainer:ViewContainerRef, private _resolver:ComponentResolver,
                private _compService:ComponentService, private _injService:InjectionService) {
    }


    ngAfterViewInit() {
        this.initSvgDoc();
        this.initImageInputListener();
        Observable.fromEvent<any>(this.editorBody.element.nativeElement, 'click')
                  .subscribe(this.deselectElement.bind(this));
    }

    private initSvgDoc() {
        let editorBodyNative = this.editorBody.element.nativeElement;
        let bounds = editorBodyNative.getBoundingClientRect();
        this._doc = SVG(editorBodyNative).size(bounds.width, bounds.height);
    }

    private initImageInputListener() {
        const height = 100;
        let fileChanges = Observable.fromEvent<any>(this.imageInput.nativeElement, 'change')
                                    .flatMap((event) => {
                                        return event.target.files;
                                    });
        fileChanges.subscribe((file:any) => {
            var reader = new FileReader();
            reader.onload = (event:any) => {
                this.openImageElement(event, height);
            };
            reader.readAsDataURL(file);
        });
    }

    private openImageElement(event:any, height:number) {
        let image = this._doc.image((this._injService.guid()));
        image.load(event.target.result)
             .loaded((loader) => {
                 image.height(height).width(height / loader.ratio);
             })
             .x(10)
             .y(10)
             .draggable();
        this.initSelectionListener(image, true);
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

    private initSelectionListener(element:any, resizable:boolean = false) {
        console.log(element);
        let selectFn = () => {
            this.selectedElement = true;
            if (resizable) {
                element.selectize(SELECT_OPTIONS_RESIZE).resize();
            } else {
                element.selectize(SELECT_OPTIONS_NO_RESIZE);
            }
        };
        let deselectFn: () => void = () => {
            element.selectize(false);
            if (resizable) {
                element.resize('stop');
            }
        };

        Observable.fromEvent<any>(element, 'click')
                  .subscribe((event) => {
                      event.stopPropagation();
                      selectFn();
                      this.deselectFns.push(deselectFn);
                      this.suppressFns.push(() => {
                          this.destroySVGElement(element)
                      });
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
        this.deselectFns.forEach((deselectFn) => {
            deselectFn();
        });
        this.suppressFns = [];
        this.deselectFns = [];
        this.selectedElement = false;
    }

    private deleteElements() {
        this.suppressFns.forEach((suppressFn) => {
            suppressFn();
        });
    }
}