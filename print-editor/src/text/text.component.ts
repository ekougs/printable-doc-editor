import {Component, OpaqueToken, Inject, AfterViewInit, ElementRef, forwardRef, ViewChild} from "@angular/core";

export const VIEW_STATE_TOKEN:OpaqueToken = new OpaqueToken('suggestComponentViewState');

export interface TextComponentState {
    top:String;
    left:String;
    width?:String;
    height?:String;
}

@Component({
               selector: 'text',
               templateUrl: 'text.component.html',
               styleUrls: ['text.component.css']
           })
export class TextComponent implements AfterViewInit{
    @ViewChild('textComp', {read: ElementRef}) private textCompRef:ElementRef;
    private value:String;
    private firstBag:String = "first-bag";
    private edit:Boolean = true;

    constructor(@Inject(VIEW_STATE_TOKEN) private state:TextComponentState) {
        state.width = 150 + 'px';
        state.height = 1.9 + 'em';
    }

    ngAfterViewInit() {
        this.editMode(this.textCompRef.nativeElement);
    }

    updateValue(event) {
        this.value = event.target.innerText;
    }

    editMode(textComp) {
        textComp.contentEditable = true;
        this.edit = true;
        textComp.focus();
    }

    readOnlyMode(textComp) {
        if (!this.value || this.value === "") {
        }
        textComp.contentEditable = true;
        this.edit = false;
    }
}