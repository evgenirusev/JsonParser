import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class TableTag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("table", value, attributes);
    }
}