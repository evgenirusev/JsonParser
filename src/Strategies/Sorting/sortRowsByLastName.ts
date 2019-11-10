import { Row } from "../../Entities/Row";

export const sortRowsByLastName = (a: Row, b: Row) => a.lastName.localeCompare(b.lastName);