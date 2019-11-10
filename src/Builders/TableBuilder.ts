import { ITableBuilder } from "./ITableBuilder";
import { Dictionary } from "../Contracts/IDictionary";
import { IElementFactory } from "../Factories/ElementFactory/IElementFactory";
import { Row } from "../Entities/Row";
import { ISingleTagElementFactory } from "../Factories/SingleTagElementFactory/ISingleTagElementFactory";
import { Friend } from "../Entities/index";

type TableBuilderProps = {
    elementFactory: IElementFactory,
    singleTagElementFactory: ISingleTagElementFactory,
    dictionary: Dictionary<string>,
    keys: Array<string>,
    rows: Array<Row>,
    defaultSortingStrategy: (a: Row, b: Row) => number,
    IDsToSortingStrategies: Dictionary<(a: Row, b: Row) => number>
}

export class TableBuilder implements ITableBuilder {
    private elementFactory: IElementFactory;
    private singleTagElementFactory: ISingleTagElementFactory;
    private dictionary: Dictionary<string>;
    private keys: Array<string>;
    private rows: Array<Row>;
    private sortingStrategy: (a: Row, b: Row) => number;
    private elementHandlers = new Map();
    private IDsToSortingStrategies: Dictionary<(a: Row, b: Row) => number>;
    
    constructor(args: TableBuilderProps) {
        this.elementFactory = args.elementFactory;
        this.singleTagElementFactory = args.singleTagElementFactory;
        this.dictionary = args.dictionary;
        this.keys = args.keys;
        this.rows = args.rows;
        this.elementHandlers.set("avatar", this.avatarHandler.bind(this));
        this.elementHandlers.set("email", this.emailHandler.bind(this));
        this.elementHandlers.set("friends", this.friendsHandler.bind(this));
        this.sortingStrategy = args.defaultSortingStrategy;
        this.IDsToSortingStrategies = args.IDsToSortingStrategies;
    }

    public buildTable(value: string): string {
        return this.elementFactory.create("table", value).render();
    }

    public buildTableBody(): string {
        return this.rows.sort(this.sortingStrategy).map(this.buildRow.bind(this)).join("")
    }

    public buildTr(value: string): string {
        return this.elementFactory.create("tr", value).render();
    }

    public buildTd(value: string): string {
        return this.elementFactory.create("td", value).render();
    }

    public buildUl(value: string): string {
        return this.elementFactory.create("ul", value).render();
    }

    public buildLi(value: string): string {
        return this.elementFactory.create("li", value).render();
    }

    public buildKeys(): string {
        return this.keys.map(this.buildKey.bind(this)).join("")
    }

    public setSortingStrategyID(id: string): void {
        this.sortingStrategy = this.IDsToSortingStrategies[id];
    }

    private buildKey(key: string): string {
        return this.elementFactory.create("td", this.dictionary[key] || key, {
            id: key
        }).render();
    }

    private buildRow(row: Row): string {
        return this.buildTr(this.parseRow(row));
    }

    private parseRow(row: Row): string {
        return this.keys.map(key => {
            return this.buildTd(
                this.elementHandlers.has(key) 
                    ? this.elementHandlers.get(key)(row[key])
                    : row[key]
            );
        }).join("");
    }

    private avatarHandler(value: string): string {
        return this.singleTagElementFactory.create("img", {
            src: value
        }).render();
    }

    private emailHandler(value: string): string {
        return this.elementFactory.create("a", value, {
            href: `mailto:${value}`
        }).render();
    }

    private friendsHandler(friends: Array<Friend>): string {
        return this.buildUl(
            friends.map((friend: Friend) => {
                return this.buildLi(`${friend.firstName} ${friend.lastName}`)
            }).join("")
        )
    }
}