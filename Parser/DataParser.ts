export class DataParser {
    private rowBuilder: RowParser;
    constructor(rowBuilder: RowParser) {
        this.rowBuilder = rowBuilder;
    }

    public parseData(users: Array<UserMock>): Array<Row> {
        return users.map(this.rowBuilder.parseToRow);
    }
}
