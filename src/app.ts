import { MOCK } from "./mock/MOCK_DATA";
import { ElementFactory } from "./Factories/ElementFactory/ElementFactory";
import { SingleTagElementFactory } from "./Factories/SingleTagElementFactory/SingleTagElementFactory";
import { DataParser } from "./Parser/DataParser";
import { RowParser } from "./Parser/RowParser";
import { sortRowsById } from "./Strategies/Sorting/sortRowsById";
import { ITableBuilder } from "./Builders/ITableBuilder";
import { TableBuilder } from "./Builders/TableBuilder";
import { dictionary } from "./dict/dictionary";
import { keysInOrder } from "./config/keysInOrder";

export class TableUI {
    private wrapper: HTMLElement;
    private tableBuilder: ITableBuilder;

    constructor(tableBuilder: ITableBuilder, wrapper: HTMLElement) {
        this.tableBuilder = tableBuilder;
        this.wrapper = wrapper;
        this.wrapper.addEventListener("click", this);
    }

    public render(): string {
        this.cleanHTML();
        return this.tableBuilder.buildTable(
            this.tableBuilder.buildTr(this.tableBuilder.buildKeys()) 
            + this.tableBuilder.buildTableBody()
        );
    }

    public handleEvent(event: MouseEvent): void {
        this.tableBuilder.setSortingStrategyID((event.target as HTMLInputElement).id);
        this.wrapper.innerHTML = this.render();
    }

    private cleanHTML(): void {
        while (this.wrapper.firstElementChild !== null) {
            this.wrapper.removeChild(this.wrapper.firstElementChild);
        }
    }
}

(function(data, document) {
    const tableBuilder: ITableBuilder = new TableBuilder({
        elementFactory: new ElementFactory(),
        singleTagElementFactory: new SingleTagElementFactory(),
        dictionary,
        keys: keysInOrder,
        rows: new DataParser(new RowParser()).parseData(data),
        sortingStrategy: sortRowsById
    });
    
    document.getElementById("app").innerHTML = new TableUI(tableBuilder, document.getElementById("app")).render();
}(MOCK.slice(0,10), document))
