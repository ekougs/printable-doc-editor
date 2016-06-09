import {Injectable} from "@angular/core";

@Injectable()
export class EmConverterProvider {
    converter(context):EmConverter {
        return new EmConverter(context);
    }
}

export class EmConverter {
    constructor(private context?) {
    }

    toPx(lengthInEm:number):number {
        let fontSize = getComputedStyle(this.context || document.documentElement).fontSize.replace("px", "");
        return lengthInEm * parseFloat(fontSize);
    }
} 