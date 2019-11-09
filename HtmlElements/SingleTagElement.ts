import { IHtmlElement } from "../Contracts/IHtmlElement";
import { IAttributes } from "../Contracts/IAttributes";

export class SingleTagElement implements IHtmlElement {
    private tag: string;
    private attributes?: IAttributes;

    constructor(tag: string, attributes?: IAttributes) {
        this.tag = tag;
        this.attributes = attributes;
    }

    render(): string {
        return `<${this.tag} ${this.getAttributes()}>`
    }

    // create abstraction for this in BaseHTML element !!!!!!
    private getAttributes() {
        return this.attributes 
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}