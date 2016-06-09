import {Component, OpaqueToken, Inject, AfterViewInit, ElementRef, ViewChild} from "@angular/core";

export const VIEW_STATE_TOKEN:OpaqueToken = new OpaqueToken('textComponentViewState');
export const ON_VALUE_CHANGED_TOKEN:OpaqueToken = new OpaqueToken('textComponentOnValueChanged');

export interface TextComponentState {
    guid:string;
    top:string;
    left:string;
    width?:string;
    height?:string;
}

@Component({
               selector: 'text',
               templateUrl: 'text.component.html',
               styleUrls: ['text.component.css']
           })
export class TextComponent implements AfterViewInit {
    @ViewChild('textComp', {read: ElementRef}) private textCompRef:ElementRef;
    private edit:boolean = true;

    constructor(@Inject(VIEW_STATE_TOKEN) private state:TextComponentState,
                @Inject(ON_VALUE_CHANGED_TOKEN) private onValueChanged:(TextComponentState, String)=>void) {
        state.width = 150 + 'px';
        state.height = 1.9 + 'em';
    }

    ngAfterViewInit() {
        this.editMode(this.textCompRef.nativeElement);
    }

    editMode(textComp) {
        textComp.contentEditable = true;
        this.edit = true;
        textComp.focus();
    }

    readOnlyMode(textComp) {
        this.onValueChanged(this.state, textComp.innerText);
        textComp.contentEditable = true;
        this.edit = false;
    }
}