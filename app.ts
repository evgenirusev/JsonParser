import { MOCK } from "./MOCK_DATA.js";

export type UserMock = {
    "avatar": string;
    "id": number;
    "first_name": string;
    "last_name": string;
    "email": string;
    "gender": string;
    "ip_address": string;
    "friends": {
        "first_name": string;
        "last_name": string;
    }[];
}

export class Row {
    avatar: string;
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    IPAddress: string;
    friends: Array<Friend>;
}

export type Friend = {
    firstName: string,
    lastName: string
}

class RowParser {
    public parseToRow(user: UserMock): Row {
        let row: Row = new Row();
        row.avatar = user.avatar;
        row.email = user.email;
        row.firstName = user.first_name;
        row.lastName = user.last_name;
        row.IPAddress = user.ip_address;
        row.friends = user.friends.map(friend => {
            return {
                firstName: friend.first_name,
                lastName: friend.last_name 
            }
        });
        row.gender = user.gender;
        row.id = user.id;
        return row;
    }
}

class DataParser {
    private rowBuilder: RowParser;
    constructor(rowBuilder: RowParser) {
        this.rowBuilder = rowBuilder;
    }

    public parseData(users: Array<UserMock>): Array<Row> {
        return users.map(this.rowBuilder.parseToRow);
    }
}

interface IHtmlElement {
    render(): string;
}

interface Attributes {
    [key: string]: string
}

class HTMLElement implements IHtmlElement {
    private tag: string;
    private value: string;
    private attributes?: Attributes;

    constructor(tag: string, value: string, attributes?: Attributes) {
        this.tag = tag;
        this.value = value;
        this.attributes = attributes;
    }

    render() {
        return `<${this.tag} ${this.getAttributes()}>${this.value}</${this.tag}>`;
    }

    // DRY - reuse this
    private getAttributes() {
        return this.attributes 
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}

class ATag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("a", value, attributes);
    }
}

class THTag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("th", value, attributes);
    }
}

class TDTag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("td", value, attributes);
    }
}

class TRTag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("tr", value, attributes);
    }
}

class TableTag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("table", value, attributes);
    }
}

class ULTag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("ul", value, attributes);
    }
}

class LITag extends HTMLElement {
    constructor(value: string, attributes?: Attributes) {
        super("li", value, attributes);
    }
}

class SingleTagElement implements IHtmlElement {
    private tag: string;
    private attributes?: Attributes;

    constructor(tag: string, attributes?: Attributes) {
        this.tag = tag;
        this.attributes = attributes;
    }

    render(): string {
        return `<${this.tag} ${this.getAttributes()}>`
    }

    // create abstraction for this in BaseHTML element !!!!!!
    private getAttributes() {
        return this.attributes 
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}

type Class = { new(...args: any[]): any; };
class ElementFactory {
    private map: Map<string, Class>;
    constructor() {
        this.map = new Map();
        this.map.set("th", THTag);
        this.map.set("td", TDTag);
        this.map.set("tr", TRTag);
        this.map.set("table", TableTag);
        this.map.set("ul", ULTag);
        this.map.set("li", LITag);
        this.map.set("a", ATag);
    }

    public create(element: string, value: string, attributes?: Attributes) {
        return new (this.map.get(element))(value, attributes);
    }
}

class SingleTagElementFactory {
    public create(element: string, attributes?: Attributes) {
        return new SingleTagElement(element, attributes);
    }
}

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
