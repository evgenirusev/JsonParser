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
    constructor(tag, value, attributes) {
        this.tag = tag;
        this.value = value;
        this.attributes = attributes;
    }
    render() {
        return `<${this.tag} ${this.getAttributes()}>${this.value}</${this.tag}>`;
    }
    // DRY - reuse this
    getAttributes() {
        return this.attributes
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}
class ATag extends HTMLElement {
    constructor(value, attributes) {
        super("a", value, attributes);
    }
}
class THTag extends HTMLElement {
    constructor(value, attributes) {
        super("th", value, attributes);
    }
}
class TDTag extends HTMLElement {
    constructor(value, attributes) {
        super("td", value, attributes);
    }
}
class TRTag extends HTMLElement {
    constructor(value, attributes) {
        super("tr", value, attributes);
    }
}
class TableTag extends HTMLElement {
    constructor(value, attributes) {
        super("table", value, attributes);
    }
}
class ULTag extends HTMLElement {
    constructor(value, attributes) {
        super("ul", value, attributes);
    }
}
class LITag extends HTMLElement {
    constructor(value, attributes) {
        super("li", value, attributes);
    }
}
class SingleTagElement {
    constructor(tag, attributes) {
        this.tag = tag;
        this.attributes = attributes;
    }
    render() {
        return `<${this.tag} ${this.getAttributes()}>`;
    }
    // create abstraction for this in BaseHTML element !!!!!!
    getAttributes() {
        return this.attributes
            ? Object.keys(this.attributes).map(key => `${key}=${this.attributes[key]}`).join(" ")
            : "";
    }
}
class ElementFactory {
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
    create(element, value, attributes) {
        return new (this.map.get(element))(value, attributes);
    }
}
class SingleTagElementFactory {
    create(element, attributes) {
        return new SingleTagElement(element, attributes);
    }
}
export class TableUI {
    // todo: type
    constructor(elementFactory, singleTagElementFactory, rows, keys) {
        this.rows = rows;
        this.keys = keys;
        this.elementFactory = elementFactory;
        this.singleTagElementFactory = singleTagElementFactory;
        this.elementHandlers = new Map();
        this.elementHandlers.set("avatar", this.avatarHandler.bind(this));
        this.elementHandlers.set("email", this.emailHandler.bind(this));
        this.elementHandlers.set("friends", this.friendsHandler.bind(this));
    }
    avatarHandler(value) {
        return this.singleTagElementFactory.create("img", {
            src: value
        }).render();
    }
    emailHandler(value) {
        return this.elementFactory.create("a", value, {
            href: `mailto:${value}`
        }).render();
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
            return this.renderTd(this.elementHandlers.has(key)
                ? this.elementHandlers.get(key)(row[key])
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
    // todo
    let table = new TableUI(new ElementFactory(), new SingleTagElementFactory, rows, ["avatar", "id", "firstName", "lastName", "email", "gender", "IPAddress", "friends"]);
    document.getElementById("app").innerHTML = table.render();
}(MOCK.slice(0, 10), document));
