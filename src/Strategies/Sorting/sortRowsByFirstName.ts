import { Row } from "../../Entities/Row";

export const sortRowsByFirstName = (a: Row, b: Row) => a.firstName.localeCompare(b.firstName);