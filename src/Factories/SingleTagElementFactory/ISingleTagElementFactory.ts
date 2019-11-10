import { IHtmlElement, IAttributes } from "../../Contracts/index";

export interface ISingleTagElementFactory {
    create(element: string, attributes?: IAttributes): IHtmlElement;
}
