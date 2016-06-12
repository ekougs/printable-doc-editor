import {Injectable} from "@angular/core";

@Injectable()
export class EmConverterProvider {
    converter(context):EmConverter {
        return new ActualEmConverter(context);
    }
}

export interface EmConverter {
    toPx(lengthInEm:number):number;
}

export class ActualEmConverter {
    constructor(private context?) {
    }

    toPx(lengthInEm:number):number {
        let fontSize = getComputedStyle(this.context || document.documentElement).fontSize.replace("px", "");
        return lengthInEm * parseFloat(fontSize);
    }
} 