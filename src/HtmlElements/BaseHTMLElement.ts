import { IAttributes, IHtmlElement } from "../Contracts/index";

export abstract class BaseHTMLElement implements IHtmlElement {
    protected attributes?: IAttributes;
    constructor(attributes?: IAttributes) {
        this.attributes = attributes;
    }

    public abstract render(): string;
    
    protected getAttributes() {
        return this.attributes 
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}
