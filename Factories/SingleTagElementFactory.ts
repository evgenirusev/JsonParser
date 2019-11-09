import { SingleTagElement } from "../HtmlElements/SingleTagElement";
import { IAttributes } from "../Contracts/IAttributes";

export class SingleTagElementFactory {
    public create(element: string, attributes?: IAttributes) {
        return new SingleTagElement(element, attributes);
    }
}