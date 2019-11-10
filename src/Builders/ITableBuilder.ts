import { Row } from "../Entities/Row";

export interface ITableBuilder {
    buildKeys(): string;
    buildTable(value: string): string;
    buildTr(value: string): string;
    buildTd(value: string): string;
    buildUL(value: string): string;
    buildLI(value: string): string;
    buildTableBody(): string;
    setSortingStrategyID(id: string): void;
}