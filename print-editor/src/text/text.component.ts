import {Component, OpaqueToken, Inject, AfterViewInit, ElementRef, ViewChild} from "@angular/core";
import {Size} from "../component/size";
import {Length} from "../component/length";
import {LengthUnit} from "../component/length-unit";
import {Observable} from "rxjs/Rx";

export const VIEW_STATE_TOKEN:OpaqueToken = new OpaqueToken('textComponentViewState');
export const ON_VALUE_CHANGED_TOKEN:OpaqueToken = new OpaqueToken('textComponentOnValueChanged');

export interface TextComponentState {
    guid:string;
    top:string;
    left:string;
    topPx:number;
    leftPx:number;
    width?:string;
    height?:string;
    value?:string;
}

@Component({
               selector: 'text',
               templateUrl: 'text.component.html',
               styleUrls: ['text.component.css'],
               directives: []
           })
export class TextComponent implements AfterViewInit {
    static DEFAULT_SIZE:Size = new Size(new Length(150), new Length(1.9, LengthUnit.em));
    @ViewChild('textComp', {read: ElementRef}) private textCompRef:ElementRef;

    constructor(@Inject(VIEW_STATE_TOKEN) private state:TextComponentState,
                @Inject(ON_VALUE_CHANGED_TOKEN) private onValueChanged:(TextComponentState, String)=>void) {
        state.width = state.width ? state.width : TextComponent.DEFAULT_SIZE.widthAndUnit();
        state.height = state.height ? state.height : TextComponent.DEFAULT_SIZE.heightAndUnit();
        state.value = state.value ? state.value : '';
    }

    ngAfterViewInit() {
        let element = this.textCompRef.nativeElement;
        element.focus();
        this.resizeToContent(element);

        const ENTER:number = 13;
        const BACKSPACE:number = 8;
        const DELETE:number = 46;
        const RESIZE_KEYS = [ENTER, BACKSPACE, DELETE];
        const ESCAPE:number = 27;
        
        const WATCHED_KEYS = [];
        WATCHED_KEYS.push(...RESIZE_KEYS);
        WATCHED_KEYS.push(ESCAPE);
        
        let onEnters = Observable.fromEvent<any>(element, 'keyup')
                                 .filter((event) => {
                                     return WATCHED_KEYS.indexOf(event.keyCode) !== -1;
                                 })
                                 .map((event) => {
                                     return event.keyCode;
                                 });
        onEnters.subscribe((key) => {
            if(RESIZE_KEYS.indexOf(key) !== -1) {
                this.resizeToContent(element);
            }
            if(ESCAPE === key) {
                this.onValueChanged(this.state, undefined);
            }
        });
    }

    private resizeToContent(element) {
        element.style.height = "1px";
        element.style.height = (5 + element.scrollHeight) + "px";
    }

    propagateValueChanged() {
        this.onValueChanged(this.state, this.textCompRef.nativeElement.value);
    }
}