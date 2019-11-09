import { MOCK } from "./MOCK_DATA.js";
export class Row {
}
class RowParser {
    parseToRow(user) {
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
        return users.map(this.rowBuilder.parseToRow);
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
class THTag extends HTMLElement {
    constructor(value) {
        super("th", value);
    }
}
class TDTag extends HTMLElement {
    constructor(value) {
        super("td", value);
    }
}
class TRTag extends HTMLElement {
    constructor(value) {
        super("tr", value);
    }
}
class TableTag extends HTMLElement {
    constructor(value) {
        super("table", value);
    }
}
class ImageTag {
    constructor(value, alt) {
        this.value = value;
        this.alt = alt;
    }
    render() {
        return `<img src="${this.value}" ${this.alt ? this.alt : ""}>`;
    }
}
class ATag {
    constructor(href, value) {
        this.href = href;
        this.value = value;
    }
    render() {
        return `<a href="${this.href}">${this.value}</a>`;
    }
}
class EmailTag extends ATag {
    constructor(email) {
        super(`mailto:${email}`, email);
    }
}
class ElementFactory {
    constructor() {
        this.map = new Map();
        this.map.set("th", THTag);
        this.map.set("td", TDTag);
        this.map.set("tr", TRTag);
        this.map.set("table", TableTag);
        this.map.set("img", ImageTag);
        this.map.set("email", EmailTag);
    }
    create(element, value) {
        return new (this.map.get(element))(value);
    }
}
export class TableUI {
    constructor(elementFactory, rows) {
        this.rows = rows;
        this.elementFactory = elementFactory;
        this.specialElements = new Map();
        this.specialElements.set("avatar", "img");
        this.specialElements.set("email", "email");
        this.specialElements.set("friends", "ul");
    }
    render() {
        return this.renderTable(this.rows.map(this.renderRow.bind(this)).join(""));
    }
    renderTable(value) {
        return this.elementFactory.create("table", value).render();
    }
    renderRow(row) {
        return this.elementFactory.create("tr", Object.keys(row).map(key => {
            return this.parseRow(key, row[key]);
        }).join("")).render();
    }
    parseRow(key, value) {
        return this.renderTd(this.specialElements.has(key) ? this.parseSpecialElement(key, value) : value);
    }
    renderTd(value) {
        return this.elementFactory.create("td", value).render();
    }
    parseSpecialElement(key, value) {
        console.log(value);
        if (key === "friends") {
            return "Friends :)";
        }
        return this.elementFactory.create(this.specialElements.get(key), value).render();
    }
}
(function (data, document) {
    let rows = new DataParser(new RowParser()).parseData(data);
    let table = new TableUI(new ElementFactory(), rows);
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0, 10), document));
