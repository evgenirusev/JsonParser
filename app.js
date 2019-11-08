import { MOCK } from "./MOCK_DATA.js";
export class Row {
}
class RowBuilder {
    // Not original GOF builder. I need this for runtime param parsing
    build(user) {
        let row = new Row();
        row.avatar = user.avatar;
        row.email = user.email;
        row.firstName = user.first_name;
        row.lastName = user.last_name;
        row.IPAddress = user.ip_address;
        row.friends = user.friends.map(friend => {
            return {
                firstName: friend.first_name,
                lastName: friend.last_name
            };
        });
        row.gender = user.gender;
        row.id = user.id;
        return row;
    }
}
class DataParser {
    constructor(rowBuilder) {
        this.rowBuilder = rowBuilder;
    }
    parseData(users) {
        return users.map(this.rowBuilder.build);
    }
}
class HTMLElement {
    constructor(tag, value) {
        this.tag = tag;
        this.value = value;
    }
    render() {
        return `<${this.tag}>${this.value}</${this.tag}>`;
    }
}
class TH extends HTMLElement {
    constructor(value) {
        super("th", value);
    }
}
class TD extends HTMLElement {
    constructor(value) {
        super("td", value);
    }
}
class TR extends HTMLElement {
    constructor(value) {
        super("tr", value);
    }
}
class Table extends HTMLElement {
    constructor(value) {
        super("table", value);
    }
}
// TODO: abstraction
class ElementFactory {
    constructor() {
        this.map = new Map();
        this.map.set("th", TH);
        this.map.set("td", TD);
        this.map.set("tr", TR);
        this.map.set("table", Table);
    }
    // TODO: refactor
    create(element, value) {
        return new (this.map.get(element))(value);
    }
}
export class TableUI {
    constructor(elementFactory, rows) {
        this.rows = rows;
        this.elementFactory = elementFactory;
        this.map = new Map();
    }
    render() {
        return this.renderTable(this.rows.map(this.renderRow.bind(this)).join(""));
    }
    renderTable(value) {
        return this.elementFactory.create("table", value).render();
    }
    renderRow(row) {
        return this.elementFactory.create("tr", this.parseRow(row)).render();
    }
    parseRow(row) {
        return Object.keys(row).map(key => {
            return this.renderTd(this.map.has(key) ? this.map.get(key) : row[key]);
        }).join("");
    }
    renderTd(value) {
        return this.elementFactory.create("td", value).render();
    }
}
(function (data, document) {
    let rows = new DataParser(new RowBuilder()).parseData(data);
    let table = new TableUI(new ElementFactory(), rows);
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0, 10), document));
