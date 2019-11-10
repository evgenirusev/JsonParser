import { Row } from "../../Entities/Row";

export const sortRowsByEmail = (a: Row, b: Row) => a.email.localeCompare(b.email);