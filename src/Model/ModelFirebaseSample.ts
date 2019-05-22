import { ModelFirebaseBase } from "./FirebaseBase";
interface InterfaceModel {
    idx: string;
    name: string;
    insert_date: string;
}
export class ModelFirebaseSample extends ModelFirebaseBase {
    public fields: InterfaceModel = {
        idx: "id",
        name: "name",
        insert_date: "insert_date",
    };
    constructor() {
        super();
    }

    public baseNodeChild(): string {
        return "";
    }

    protected baseNode(): string {
        return "restaurant";
    }
}
