import { ElementFactory } from "../Factories/index";
import { ITableBuilder } from "./ITableBuilder";
import { Dictionary } from "../Contracts/IDictionary";
import { IElementFactory } from "../Factories/ElementFactory/IElementFactory";

export class TableBuilder implements ITableBuilder {
    private elementFactory: IElementFactory;
    private dictionary: Dictionary<string>;
    private keys: Array<string>;
    
    constructor(elementFactory: ElementFactory, dictionary: Dictionary<string>, keys: Array<string>) {
        this.elementFactory = elementFactory;
        this.dictionary = dictionary;
        this.keys = keys;
    }

    public buildKeys(): string {
        return this.keys.map(this.renderKey.bind(this)).join("")
    }

    public buildTable(value: string): string {
        return this.elementFactory.create("table", value).render();
    }
    public buildTr(value: string): string {
        return this.elementFactory.create("tr", value).render();
    }

    public buildTd(value: string): string {
        return this.elementFactory.create("td", value).render();
    }

    public buildUL(value: string): string {
        return this.elementFactory.create("ul", value).render();
    }

    public buildLI(value: string): string {
        return this.elementFactory.create("li", value).render();
    }

    private renderKey(key: string): string {
        return this.elementFactory.create("td", this.dictionary[key] || key, {
            id: key
        }).render();
    }

}