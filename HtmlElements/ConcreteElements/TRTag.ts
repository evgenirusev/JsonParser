import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class TRTag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("tr", value, attributes);
    }
}