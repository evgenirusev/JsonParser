import { IAttributes, IHtmlElement } from "../Contracts/index";

export abstract class BaseHTMLElement implements IHtmlElement {
    private defaultValue: string;
    protected attributes?: IAttributes;
    constructor(attributes?: IAttributes) {
        this.attributes = attributes;
        this.defaultValue = "";
    }

    public abstract render(): string;
    
    protected getAttributes() {
        return this.attributes 
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : this.defaultValue;
    }
}
