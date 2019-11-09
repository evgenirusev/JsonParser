import { Row } from "../Entities/Row";
import { UserMockType } from "../Contracts/UserMockType";

// consider renaming to builder
export class RowParser {
    public parseToRow(user: UserMockType): Row {
        let row: Row = new Row();
        row.avatar = user.avatar;
        row.email = user.email;
        row.firstName = user.first_name;
        row.lastName = user.last_name;
        row.IPAddress = user.ip_address;
        row.friends = user.friends.map(friend => {
            return {
                firstName: friend.first_name,
                lastName: friend.last_name 
            }
        });
        row.gender = user.gender;
        row.id = user.id;
        return row;
    }
}