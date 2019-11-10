import { MOCK } from "./mock/MOCK_DATA";
import { Row } from "./Entities/Row";
import { ElementFactory } from "./Factories/ElementFactory";
import { SingleTagElementFactory } from "./Factories/SingleTagElementFactory";
import { Friend } from "./Entities/Friend";
import { DataParser } from "./Parser/DataParser";
import { RowParser } from "./Parser/RowParser";

// todo
const sortRowsById = (a: Row, b: Row) =>  a.id - b.id;
const sortRowsByFirstName = (a: Row, b: Row) => a.firstName.localeCompare(b.firstName);
const sortRowsByLastName = (a: Row, b: Row) => a.lastName.localeCompare(b.lastName);
const sortRowsByEmail = (a: Row, b: Row) => a.email.localeCompare(b.email);

export class TableUI {
    private keys: Array<string>;
    private rows: Array<Row>;
    private elementFactory: ElementFactory;
    private singleTagElementFactory: SingleTagElementFactory;
    private elementHandlers: Map<string, any>;
    private sortingStrategy: (a: Row, b: Row) => number;
    private keysToSortingFunctions: Map<string, (a: Row, b: Row) => number>;
    private wrapper: HTMLElement;

    constructor(elementFactory: ElementFactory, singleTagElementFactory: SingleTagElementFactory, rows: Array<Row>, keys: Array<string>, wrapper: HTMLElement) {
        this.rows = rows;
        this.keys = keys;
        this.elementFactory = elementFactory;
        this.singleTagElementFactory = singleTagElementFactory;
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
        this.wrapper = wrapper;
        this.wrapper.addEventListener("click", this);
    }

    public render(): string {
        return this.renderTable(
            this.renderTr(this.keys.map(this.renderKey.bind(this)).join("")) 
            + this.rows.sort(this.sortingStrategy).map(this.renderRow.bind(this)).join("")
        );
    }

    public setSortingStrategy(sortingStrategy: (a: Row, b: Row) => number) {
        this.sortingStrategy = sortingStrategy;
    }

    private renderKey(key: string) {
        return this.elementFactory.create("td", key, {
            id: key
        }).render();
    }

    public handleEvent(event: MouseEvent): void {
        this.setSortingStrategy(
            this.keysToSortingFunctions.get((event.target as HTMLInputElement).id)
        );
        this.cleanHTML()
        this.wrapper.innerHTML = this.render();
    }

    private cleanHTML(): void {
        while (this.wrapper.firstElementChild !== null) {
            this.wrapper.removeChild(this.wrapper.firstElementChild);
        }
    }

    private renderTable(value: string): string {
        return this.elementFactory.create("table", value).render();
    }

    private renderRow(row: Row): string {
        return this.renderTr(this.parseRow(row));
    }

    private parseRow(row: Row): string {
        return this.keys.map(key => {
            return this.renderTd(
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
        return this.renderUL(
            friends.map((friend: Friend) => {
                return this.renderLI(`${friend.firstName} ${friend.lastName}`)
            }).join("")
        )
    }

    private renderTr(value: string): string {
        return this.elementFactory.create("tr", value).render();
    }

    private renderTd(value: string): string {
        return this.elementFactory.create("td", value).render();
    }

    private renderUL(value: string): string {
        return this.elementFactory.create("ul", value).render();
    }

    private renderLI(value: string): string {
        return this.elementFactory.create("li", value).render();
    }
}

(function(data, document) {
    const keysInOrder: Array<string> = ["avatar", "id", "firstName", "lastName", "email", "gender", "IPAddress", "friends"];
    let rows: Array<Row> = new DataParser(new RowParser()).parseData(data);
    let table: TableUI = new TableUI(new ElementFactory(), new SingleTagElementFactory, rows, keysInOrder, document.getElementById("app"));

    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0,10), document))
