import { IAttributes } from "../../Contracts/IAttributes";
import { HTMLElement } from "../HTMLElement";

export class THTag extends HTMLElement {
    constructor(value: string, attributes?: IAttributes) {
        super("th", value, attributes);
    }
} 