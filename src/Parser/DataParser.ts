import { RowParser } from "./RowParser";
import { Row } from "../Entities/Row";
import { UserMockType } from "../Contracts/UserMockType";

export class DataParser {
    // TODO: depend on interface
    private rowParser: RowParser;
    constructor(rowBuilder: RowParser) {
        this.rowParser = rowBuilder;
    }

    public parseData(users: Array<UserMockType>): Array<Row> {
        return users.map(this.rowParser.parseToRow);
    }
}
