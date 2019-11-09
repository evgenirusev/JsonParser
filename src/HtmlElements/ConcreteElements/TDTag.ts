import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class TDTag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("td", value, attributes);
    }
}