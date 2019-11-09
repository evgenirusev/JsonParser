import { RowParser } from "./RowParser";
import { Row } from "../Entities/Row";
import { UserMockType } from "../Contracts/UserMockType";

export class DataParser {
    private rowBuilder: RowParser;
    constructor(rowBuilder: RowParser) {
        this.rowBuilder = rowBuilder;
    }

    public parseData(users: Array<UserMockType>): Array<Row> {
        return users.map(this.rowBuilder.parseToRow);
    }
}
