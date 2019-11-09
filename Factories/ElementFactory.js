import { THTag } from "../HtmlElements/ConcreteElements/THTag";
import { TDTag } from "../HtmlElements/ConcreteElements/TDTag";
import { TRTag } from "../HtmlElements/ConcreteElements/TRTag";
import { TableTag } from "../HtmlElements/ConcreteElements/TableTag";
import { ULTag } from "../HtmlElements/ConcreteElements/ULTag";
import { LITag } from "../HtmlElements/ConcreteElements/LITag";
import { ATag } from "../HtmlElements/ConcreteElements/ATag";
export class ElementFactory {
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
