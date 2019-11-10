import { MOCK } from "./mock/MOCK_DATA";
import { Row } from "./Entities/Row";
import { ElementFactory } from "./Factories/ElementFactory";
import { SingleTagElementFactory } from "./Factories/SingleTagElementFactory";
import { Friend } from "./Entities/Friend";
import { DataParser } from "./Parser/DataParser";
import { RowParser } from "./Parser/RowParser";
import { sortRowsById } from "./Strategies/Sorting/sortRowsById";
import { sortRowsByFirstName } from "./Strategies/Sorting/sortRowsByFirstName";
import { sortRowsByLastName } from "./Strategies/Sorting/sortRowsByLastName";
import { sortRowsByEmail } from "./Strategies/Sorting/sortRowsByEmail";
import { ITableBuilder } from "./Builders/ITableBuilder";
import { TableBuilder } from "./Builders/TableBuilder";
import { dictionary } from "./dict/dictionary";

type TableUIArgs = {
    elementFactory: ElementFactory,
    singleTagElementFactory: SingleTagElementFactory,
    rows: Array<Row>,
    keys: Array<string>,
    wrapper: HTMLElement,
    tableBuilder: ITableBuilder
}

export class TableUI {
    private keys: Array<string>;
    private rows: Array<Row>;
    private elementFactory: ElementFactory;
    private singleTagElementFactory: SingleTagElementFactory;
    private elementHandlers: Map<string, any>;
    private sortingStrategy: (a: Row, b: Row) => number;
    private keysToSortingFunctions: Map<string, (a: Row, b: Row) => number>;
    private wrapper: HTMLElement;
    private tableBuilder: ITableBuilder;

    constructor(args: TableUIArgs) {
        this.rows = args.rows;
        this.keys = args.keys;
        this.elementFactory = args.elementFactory;
        this.singleTagElementFactory = args.singleTagElementFactory;
        this.elementHandlers = new Map();
        this.elementHandlers.set("avatar", this.avatarHandler.bind(this));
        this.elementHandlers.set("email", this.emailHandler.bind(this));
        this.elementHandlers.set("friends", this.friendsHandler.bind(this));
        this.sortingStrategy = sortRowsById;
        this.keysToSortingFunctions = new Map();
        this.keysToSortingFunctions.set("id", sortRowsById);
        this.keysToSortingFunctions.set("firstName", sortRowsByFirstName);
        this.keysToSortingFunctions.set("lastName", sortRowsByLastName);
        this.keysToSortingFunctions.set("email", sortRowsByEmail);
        this.tableBuilder = args.tableBuilder;
        this.wrapper = args.wrapper;
        this.wrapper.addEventListener("click", this);
    }

    public render(): string {
        this.cleanHTML()
        return this.tableBuilder.buildTable(
            this.tableBuilder.buildTr(this.tableBuilder.buildKeys()) 
            + this.rows.sort(this.sortingStrategy).map(this.renderRow.bind(this)).join("")
        );
    }

    public setSortingStrategy(sortingStrategy: (a: Row, b: Row) => number) {
        this.sortingStrategy = sortingStrategy;
    }

    public handleEvent(event: MouseEvent): void {
        this.setSortingStrategy(
            this.keysToSortingFunctions.get((event.target as HTMLInputElement).id)
        );
        this.wrapper.innerHTML = this.render();
    }

    

    private cleanHTML(): void {
        while (this.wrapper.firstElementChild !== null) {
            this.wrapper.removeChild(this.wrapper.firstElementChild);
        }
    }

    private parseRow(row: Row): string {
        return this.keys.map(key => {
            return this.tableBuilder.buildTd(
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
        return this.tableBuilder.buildUL(
            friends.map((friend: Friend) => {
                return this.tableBuilder.buildLI(`${friend.firstName} ${friend.lastName}`)
            }).join("")
        )
    }

    private renderRow(row: Row): string {
        return this.tableBuilder.buildTr(this.parseRow(row));
    }
}

(function(data, document) {
    const keysInOrder: Array<string> = ["avatar", "id", "firstName", "lastName", "email", "gender", "IPAddress", "friends"];
    let rows: Array<Row> = new DataParser(new RowParser()).parseData(data);
    const elementFactory: ElementFactory = new ElementFactory();
    
    document.getElementById("app").innerHTML = new TableUI(
        {
            elementFactory: new ElementFactory(),
            singleTagElementFactory: new SingleTagElementFactory,
            rows,
            keys: keysInOrder,
            wrapper: document.getElementById("app"),
            tableBuilder: new TableBuilder(elementFactory, dictionary, keysInOrder)
        }
    ).render();
}(MOCK.slice(0,10), document))
