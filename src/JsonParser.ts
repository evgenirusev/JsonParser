import { ITableBuilder } from "./Builders/ITableBuilder";
import { TableBuilder } from "./Builders/TableBuilder";
import { ElementFactory, SingleTagElementFactory } from "./Factories/index";
import { keysInOrder } from "./config/keysInOrder";
import { DataParser, RowParser } from "./Parser/index";
import { MOCK } from "./mock/MOCK_DATA";
import { sortRowsById } from "./Strategies/Sorting/sortRowsById";
import { Grid } from "./Grid/Grid";
import { dictionary } from "./dict/dictionary";

export class JsonParser {
    handleEvent(e) {
        const tableBuilder: ITableBuilder = new TableBuilder({
            elementFactory: new ElementFactory(),
            singleTagElementFactory: new SingleTagElementFactory(),
            dictionary,
            keys: keysInOrder,
            rows: new DataParser(new RowParser()).parseData(MOCK.slice(0, 150)),
            sortingStrategy: sortRowsById
        });

        document.getElementById("app").innerHTML = new Grid(tableBuilder, document.getElementById("app")).render();
    }
}