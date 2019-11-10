import { SingleTagElement } from "../../HtmlElements/SingleTagElement";
import { IAttributes } from "../../Contracts/IAttributes";
import { ISingleTagElementFactory } from "./ISingleTagElementFactory";

export class SingleTagElementFactory implements ISingleTagElementFactory {
    public create(element: string, attributes?: IAttributes) {
        return new SingleTagElement(element, attributes);
    }
}