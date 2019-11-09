import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class ULTag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("ul", value, attributes);
    }
}
