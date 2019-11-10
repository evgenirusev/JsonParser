import { IAttributes } from "../Contracts/IAttributes";
import { BaseHTMLElement } from "./BaseHTMLElement";

export class SingleTagElement extends BaseHTMLElement {
    private tag: string;

    constructor(tag: string, attributes?: IAttributes) {
        super(attributes);
        this.tag = tag;
    }

    render(): string {
        return `<${this.tag} ${super.getAttributes()}>`
    }
}