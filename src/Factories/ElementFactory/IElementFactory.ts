import { IHtmlElement, IAttributes } from "../../Contracts/index";

export interface IElementFactory {
    create(element: string, value: string, attributes?: IAttributes): IHtmlElement;
}
