import { ITableBuilder } from "./Builders/ITableBuilder";
import { TableBuilder } from "./Builders/TableBuilder";
import { ElementFactory, SingleTagElementFactory } from "./Factories/index";
import { keysInOrder } from "./config/keysInOrder";
import { DataParser, RowParser } from "./Parser/index";
import { MOCK } from "./mock/MOCK_DATA";
import { sortRowsById } from "./Strategies/Sorting/sortRowsById";
import { Grid } from "./Grid/Grid";
import { dictionary } from "./dict/dictionary";
import { IDsToSortingStrategies } from "./Strategies/Sorting/IDsToSortingStrategies"

export class JsonParser {
    handleEvent() {
        const tableBuilder: ITableBuilder = new TableBuilder({
            elementFactory: new ElementFactory(),
            singleTagElementFactory: new SingleTagElementFactory(),
            dictionary,
            keys: keysInOrder,
            rows: new DataParser(new RowParser()).parseData(MOCK.slice(0, 100)),
            defaultSortingStrategy: sortRowsById,
            IDsToSortingStrategies
        });

        document.getElementById("app").innerHTML = new Grid(tableBuilder, document.getElementById("app")).render();
    }
}