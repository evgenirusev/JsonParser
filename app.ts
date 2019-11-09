// import { MOCK } from "./MOCK_DATA.js";

// export type UserMock = {
//     "avatar": string;
//     "id": number;
//     "first_name": string;
//     "last_name": string;
//     "email": string;
//     "gender": string;
//     "ip_address": string;
//     "friends": {
//         "first_name": string;
//         "last_name": string;
//     }[];
// }

// export class Row {
//     avatar: string;
//     id: number;
//     firstName: string;
//     lastName: string;
//     email: string;
//     gender: string;
//     IPAddress: string;
//     friends: Array<Friend>;
// }

// export type Friend = {
//     firstName: string,
//     lastName: string
// }

// class RowParser {
//     public parseToRow(user: UserMock): Row {
//         let row: Row = new Row();
//         row.avatar = user.avatar;
//         row.email = user.email;
//         row.firstName = user.first_name;
//         row.lastName = user.last_name;
//         row.IPAddress = user.ip_address;
//         row.friends = user.friends.map(friend => {
//             return {
//                 firstName: friend.first_name,
//                 lastName: friend.last_name 
//             }
//         });
//         row.gender = user.gender;
//         row.id = user.id;
//         return row;
//     }
// }

// class DataParser {
//     private rowBuilder: RowParser;
//     constructor(rowBuilder: RowParser) {
//         this.rowBuilder = rowBuilder;
//     }

//     public parseData(users: Array<UserMock>): Array<Row> {
//         return users.map(this.rowBuilder.parseToRow);
//     }
// }

// interface IHtmlElement {
//     render(): string;
// }

// class HTMLElement implements IHtmlElement {
//     private tag: string;
//     private value: string;
//     constructor(tag: string, value: string) {
//         this.tag = tag;
//         this.value = value;
//     }

//     render() {
//         return `<${this.tag}>${this.value}</${this.tag}>`;
//     }
// }

// class THTag extends HTMLElement {
//     constructor(value: string) {
//         super("th", value);
//     }
// }

// class TDTag extends HTMLElement {
//     constructor(value: string) {
//         super("td", value);
//     }
// }

// class TRTag extends HTMLElement {
//     constructor(value: string) {
//         super("tr", value);
//     }
// }

// class TableTag extends HTMLElement {
//     constructor(value: string) {
//         super("table", value);
//     }
// }

// class ULTag extends HTMLElement {
//     constructor(value: string) {
//         super("ul", value);
//     }
// }

// class LITag extends HTMLElement {
//     constructor(value: string) {
//         super("li", value);
//     }
// }

// class ImageTag implements IHtmlElement {
//     private value: string;
//     private alt?: string;
//     constructor(value: string, alt?: string) {
//         this.value = value;
//         this.alt = alt;
//     }

//     render(): string {
//         return `<img src="${this.value}" ${this.alt ? this.alt : ""}>`
//     }
// }

// class ATag implements IHtmlElement {
//     private href: string;
//     private value: string;
//     constructor(href: string, value: string) {
//         this.href = href;
//         this.value = value;
//     }

//     render() {
//         return `<a href="${this.href}">${this.value}</a>`;
//     }
// }

// class EmailTag extends ATag {
//     constructor(email: string) {
//         super(`mailto:${email}`, email);
//     }
// }

// class ElementFactory {
//     private map: Map<string, any>;
//     constructor() {
//         this.map = new Map();
//         this.map.set("th", THTag);
//         this.map.set("td", TDTag);
//         this.map.set("tr", TRTag);
//         this.map.set("table", TableTag);
//         this.map.set("img", ImageTag);
//         this.map.set("email", EmailTag);
//         this.map.set("ul", ULTag);
//         this.map.set("li", LITag);
//     }

//     public create(element: string, value: string) {
//         return new (this.map.get(element))(value);
//     }
// }

// export class TableUI {
//     private keys: Array<string>;
//     private rows: Array<Row>;
//     private elementFactory: ElementFactory;
//     private specialElements: Map<string, any>;

//     constructor(elementFactory: ElementFactory, rows: Array<Row>, keys: Array<string>) {
//         this.rows = rows;
//         this.keys = keys;
//         this.elementFactory = elementFactory;
//         this.specialElements = new Map();
//         this.specialElements.set("avatar", this.avatarHandler.bind(this));
//         this.specialElements.set("email", this.emailHandler.bind(this));
//         this.specialElements.set("friends", this.friendsHandler.bind(this));
//     }

//     private avatarHandler(value: string): string {
//         return this.elementFactory.create("img", value).render();
//     }

//     private emailHandler(value: string): string {
//         return this.elementFactory.create("email", value).render();
//     }

//     private friendsHandler(friends: Array<Friend>): string {
//         return this.renderUL(
//             friends.map((friend: Friend) => {
//                 return this.renderLI(`${friend.firstName} ${friend.lastName}`)
//             }).join("")
//         )
//     }

//     public render(): string {
//         return this.renderTable(
//             this.renderTr(this.keys.map(this.renderTd.bind(this)).join("")) 
//             + this.rows.map(this.renderRow.bind(this)).join("")
//         );
//     }

//     private renderTable(value: string): string {
//         return this.elementFactory.create("table", value).render();
//     }

//     private renderRow(row: Row): string {
//         return this.renderTr(this.parseRow(row));
//     }

//     private parseRow(row: Row): string {
//         return this.keys.map(key => {
//             return this.renderTd(
//                 this.specialElements.has(key) 
//                     ? this.specialElements.get(key)(row[key])
//                     : row[key]
//             );
//         }).join("");
//     }

//     private renderTr(value: string): string {
//         return this.elementFactory.create("tr", value).render();
//     }

//     private renderTd(value: string): string {
//         return this.elementFactory.create("td", value).render();
//     }

//     private renderUL(value: string): string {
//         return this.elementFactory.create("ul", value).render();
//     }

//     private renderLI(value: string): string {
//         return this.elementFactory.create("li", value).render();
//     }
// }

// (function(data, document) {
//     let rows: Array<Row> = new DataParser(new RowParser()).parseData(data);
//     // todo
//     let table: TableUI = new TableUI(new ElementFactory(), rows, ["avatar","id","firstName","lastName","email","gender","IPAddress","friends"]);
    
//     document.getElementById("app").innerHTML = table.render();
// }(MOCK.slice(0,10), document))
