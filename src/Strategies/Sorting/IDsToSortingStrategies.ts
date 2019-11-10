import { Dictionary } from "../../Contracts/IDictionary";
import { Row } from "../../Entities/Row";
import { sortRowsByLastName } from "./sortRowsByLastName";
import { sortRowsById } from "./sortRowsById";
import { sortRowsByFirstName } from "./sortRowsByFirstName";
import { sortRowsByEmail } from "./sortRowsByEmail";

export const IDsToSortingStrategies: Dictionary<(a: Row, b: Row) => number> = {
    "id": sortRowsById,
    "firstName": sortRowsByFirstName,
    "lastName": sortRowsByLastName,
    "email": sortRowsByEmail
}