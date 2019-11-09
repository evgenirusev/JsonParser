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
class ULTag extends HTMLElement {
    constructor(value) {
        super("ul", value);
    }
}
class LITag extends HTMLElement {
    constructor(value) {
        super("li", value);
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
        this.map.set("ul", ULTag);
        this.map.set("li", LITag);
    }
    create(element, value) {
        return new (this.map.get(element))(value);
    }
}
export class TableUI {
    constructor(elementFactory, rows, keys) {
        this.rows = rows;
        this.keys = keys;
        this.elementFactory = elementFactory;
        this.specialElements = new Map();
        this.specialElements.set("avatar", this.avatarHandler.bind(this));
        this.specialElements.set("email", this.emailHandler.bind(this));
        this.specialElements.set("friends", this.friendsHandler.bind(this));
    }
    avatarHandler(value) {
        return this.elementFactory.create("img", value).render();
    }
    emailHandler(value) {
        return this.elementFactory.create("email", value).render();
    }
    friendsHandler(friends) {
        return this.renderUL(friends.map((friend) => {
            return this.renderLI(`${friend.firstName} ${friend.lastName}`);
        }).join(""));
    }
    render() {
        return this.renderTable(this.renderTr(this.keys.map(this.renderTd.bind(this)).join(""))
            + this.rows.map(this.renderRow.bind(this)).join(""));
    }
    renderTable(value) {
        return this.elementFactory.create("table", value).render();
    }
    renderRow(row) {
        return this.renderTr(this.parseRow(row));
    }
    parseRow(row) {
        return this.keys.map(key => {
            return this.renderTd(this.specialElements.has(key)
                ? this.specialElements.get(key)(row[key])
                : row[key]);
        }).join("");
    }
    renderTr(value) {
        return this.elementFactory.create("tr", value).render();
    }
    renderTd(value) {
        return this.elementFactory.create("td", value).render();
    }
    renderUL(value) {
        return this.elementFactory.create("ul", value).render();
    }
    renderLI(value) {
        return this.elementFactory.create("li", value).render();
    }
}
(function (data, document) {
    let rows = new DataParser(new RowParser()).parseData(data);
    // todo: refactor keys
    let table = new TableUI(new ElementFactory(), rows, ["avatar", "id", "firstName", "lastName", "email", "gender", "IPAddress", "friends"]);
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0, 10), document));
