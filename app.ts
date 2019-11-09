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

class HTMLElement {
    private tag: string;
    private value: string;
    constructor(tag: string, value: string) {
        this.tag = tag;
        this.value = value;
    }

    render() {
        return `<${this.tag}>${this.value}</${this.tag}>`;
    }
}

class THTag extends HTMLElement {
    constructor(value: string) {
        super("th", value);
    }
}

class TDTag extends HTMLElement {
    constructor(value: string) {
        super("td", value);
    }
}

class TRTag extends HTMLElement {
    constructor(value: string) {
        super("tr", value);
    }
}

class TableTag extends HTMLElement {
    constructor(value: string) {
        super("table", value);
    }
}

class ImageTag {
    private value: string;
    private alt?: string;
    constructor(value: string, alt?: string) {
        this.value = value;
        this.alt = alt;
    }

    render() {
        return `<img src="${this.value}" ${this.alt ? this.alt : ""}>`
    }
}

class ATag {
    private href: string;
    private value: string;
    constructor(href: string, value: string) {
        this.href = href;
        this.value = value;
    }

    render() {
        return `<a href="${this.href}">${this.value}</a>`;
    }
}

class EmailTag extends ATag {
    constructor(email: string) {
        super(`mailto:${email}`, email);
    }
}

class ElementFactory {
    private map: Map<string, any>;
    constructor() {
        this.map = new Map();
        this.map.set("th", THTag);
        this.map.set("td", TDTag);
        this.map.set("tr", TRTag);
        this.map.set("table", TableTag);
        this.map.set("img", ImageTag);
        this.map.set("email", EmailTag);
    }

    public create(element: string, value: string) {
        return new (this.map.get(element))(value);
    }
}

export class TableUI {
    private rows: Array<Row>;
    private elementFactory: ElementFactory;
    private specialElements: Map<string, string>;

    constructor(elementFactory: ElementFactory, rows: Array<Row>) {
        this.rows = rows;
        this.elementFactory = elementFactory;
        this.specialElements = new Map();
        this.specialElements.set("avatar", "img");
        this.specialElements.set("email", "email");
        this.specialElements.set("friends", "ul");
    }

    public render(): string {
        return this.renderTable(
            this.rows.map(this.renderRow.bind(this)).join("")
        );
    }

    private renderTable(value: string): string {
        return this.elementFactory.create("table", value).render();
    }

    private renderRow(row: Row): string {
        return this.elementFactory.create("tr",
            Object.keys(row).map(key => {

                return this.parseRow(key, row[key]);
                
            }).join("")
        ).render();
    }

    private parseRow(key: string, value: any): string {
        return this.renderTd(
            this.specialElements.has(key) ? this.parseSpecialElement(key, value) : value
        );
    }

    private renderTd(value: string): string {
        return this.elementFactory.create("td", value).render();
    }

    private parseSpecialElement(key: string, value: any): string {
        console.log(value);
        if (key === "friends") {
            return "Friends :)";
        }

        return this.elementFactory.create(this.specialElements.get(key), value).render();
    }
}

(function(data, document) {
    let rows: Array<Row> = new DataParser(new RowParser()).parseData(data);
    let table: TableUI = new TableUI(new ElementFactory(), rows);
    
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0,10), document))
