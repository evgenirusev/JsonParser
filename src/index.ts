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
import { Grid } from "./Grid/Grid";

// APPLICATION ENTRY POINT
class JsonParser {
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

document.addEventListener("DOMContentLoaded", new JsonParser());