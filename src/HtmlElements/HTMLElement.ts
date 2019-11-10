import { IAttributes } from "../Contracts/IAttributes";
import { BaseHTMLElement } from "./BaseHTMLElement";

export class HTMLElement extends BaseHTMLElement {
    private tag: string;
    private value: string;
    
    constructor(tag: string, value: string, attributes?: IAttributes) {
        super(attributes);
        this.tag = tag;
        this.value = value;
    }

    render() {
        return `<${this.tag} ${super.getAttributes()}>${this.value}</${this.tag}>`;
    }
}