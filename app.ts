import { MOCK } from "./MOCK_DATA.js";
import { Row } from "./Entities/Row.js";
import { ElementFactory } from "./Factories/ElementFactory.js";
import { SingleTagElementFactory } from "./Factories/SingleTagElementFactory.js";
import { Friend } from "./Entities/Friend.js";
import { DataParser } from "./Parser/DataParser.js";
import { RowParser } from "./Parser/RowParser.js";

export class TableUI {
    private keys: Array<string>;
    private rows: Array<Row>;
    private elementFactory: ElementFactory;
    private singleTagElementFactory: SingleTagElementFactory;
    private elementHandlers: Map<string, any>;

    // todo: type
    constructor(elementFactory: ElementFactory, singleTagElementFactory: SingleTagElementFactory, rows: Array<Row>, keys: Array<string>) {
        this.rows = rows;
        this.keys = keys;
        this.elementFactory = elementFactory;
        this.singleTagElementFactory = singleTagElementFactory;
        this.elementHandlers = new Map();
        this.elementHandlers.set("avatar", this.avatarHandler.bind(this));
        this.elementHandlers.set("email", this.emailHandler.bind(this));
        this.elementHandlers.set("friends", this.friendsHandler.bind(this));
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

    public render(): string {
        return this.renderTable(
            this.renderTr(this.keys.map(this.renderTd.bind(this)).join("")) 
            + this.rows.map(this.renderRow.bind(this)).join("")
        );
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
    const keysInOrder = ["avatar", "id", "firstName", "lastName", "email", "gender", "IPAddress", "friends"];
    let rows: Array<Row> = new DataParser(new RowParser()).parseData(data);
    let table: TableUI = new TableUI(new ElementFactory(), new SingleTagElementFactory, rows, keysInOrder);
    
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0,10), document))
