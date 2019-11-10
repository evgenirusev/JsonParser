import { Row } from "../Entities/Row";

export interface ITableBuilder {
    buildTable(value: string): string;
    buildTableBody(): string;
    buildTr(value: string): string;
    buildTd(value: string): string;
    buildUl(value: string): string;
    buildLi(value: string): string;
    buildKeys(): string;
    setSortingStrategyID(id: string): void;
}