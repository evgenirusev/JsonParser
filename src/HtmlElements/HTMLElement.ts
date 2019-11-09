import { IHtmlElement } from "../Contracts/IHtmlElement";
import { IAttributes } from "../Contracts/IAttributes";

export class HTMLElement implements IHtmlElement {
    private tag: string;
    private value: string;
    private attributes?: IAttributes;

    constructor(tag: string, value: string, attributes?: IAttributes) {
        this.tag = tag;
        this.value = value;
        this.attributes = attributes;
    }

    render() {
        return `<${this.tag} ${this.getAttributes()}>${this.value}</${this.tag}>`;
    }

    // DRY - reuse this
    private getAttributes() {
        return this.attributes 
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}