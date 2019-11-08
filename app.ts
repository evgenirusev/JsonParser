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

class RowBuilder {
    // Not original GOF builder. I need this for runtime param parsing
    public build(user: UserMock): Row {
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
    // TODO: abstraction - to depend on interface
    private rowBuilder: RowBuilder;
    constructor(rowBuilder: RowBuilder) {
        this.rowBuilder = rowBuilder;
    }

    public parseData(users: Array<UserMock>): Array<Row> {
        return users.map(this.rowBuilder.build);
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

class TH extends HTMLElement {
    constructor(value: string) {
        super("th", value);
    }
}

class TD extends HTMLElement {
    constructor(value: string) {
        super("td", value);
    }
}

class TR extends HTMLElement {
    constructor(value: string) {
        super("tr", value);
    }
}

class Table extends HTMLElement {
    constructor(value: string) {
        super("table", value);
    }
}

// TODO: abstraction
class ElementFactory {
    private map: Map<string, any>;
    constructor() {
        this.map = new Map();
        this.map.set("th", TH);
        this.map.set("td", TD);
        this.map.set("tr", TR);
        this.map.set("table", Table);
    }

    // TODO: refactor
    public create(element: string, value: string) {
        return new (this.map.get(element))(value);
    }
}

export class TableUI {
    private rows: Array<Row>;
    private elementFactory: ElementFactory;
    private map: Map<string, string>;

    constructor(elementFactory: ElementFactory, rows: Array<Row>) {
        this.rows = rows;
        this.elementFactory = elementFactory;
        this.map = new Map();
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
            this.parseRow(row)
        ).render();
    }
    
    private parseRow(row: Row) {
        return Object.keys(row).map(key => {
            return this.renderTd(this.map.has(key) ? this.map.get(key) : row[key]);
        }).join("")
    }

    private renderTd(value: string) {
        return this.elementFactory.create("td", value).render();
    }
}

(function(data, document) {
    let rows: Array<Row> = new DataParser(new RowBuilder()).parseData(data);
    let table: TableUI = new TableUI(new ElementFactory(), rows);
    
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0,10), document))
