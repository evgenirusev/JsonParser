import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class LITag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("li", value, attributes);
    }
}
