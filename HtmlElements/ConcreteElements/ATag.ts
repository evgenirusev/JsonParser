import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class ATag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("a", value, attributes);
    }
}