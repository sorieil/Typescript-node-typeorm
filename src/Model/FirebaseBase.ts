import * as firebase from "firebase";
import { database } from "firebase/app";
import { firebaseAdmin, timestamp } from "../library/Firebase";

export abstract class ModelFirebaseBase {
    protected _timestamp: any;
    protected _ref: firebase.database.Reference;
    constructor() {
        this.timestamp = timestamp;
        this.refreshReferencePath();
    }

    public async getValue(nodeName: string): Promise<any> {
        this.refreshReferencePath();
        return this.snapValue(this.ref.child(nodeName));
    }

    public async getsValue(): Promise<any> {
        this.refreshReferencePath();
        return this.snapValue(this.ref);
    }

    public async getOn(nodeName: string): Promise<any> {
        this.refreshReferencePath();
        return this.snapOn(this.ref.child(nodeName));
    }

    public async getsOn(): Promise<any> {
        this.refreshReferencePath();
        return this.snapOn(this.ref);
    }

    // 모델에서 push를 재정의 하는건 아닌거 같아서 public 으로 했음.
    public async push(data: {}): Promise<any> {
        this.refreshReferencePath();
        return this.firebasePush(this.ref, data);
    }

    public abstract baseNodeChild(): string;

    private get ref(): any {
        return this._ref;
    }

    private set ref(value: any) {
        this._ref = value;
    }

    // private get timestamp(): any {
    //     return this._timestamp;
    // }

    private set timestamp(value: any) {
        this._timestamp = value;
    }

    protected abstract baseNode(): string;

    protected refreshReferencePath(): void {
        if (this.baseNodeChild() === null) {
            this.ref = firebaseAdmin.database().ref(this.baseNode());
        } else {
            this.ref = firebaseAdmin.database().ref(this.baseNode() + "/" + this.baseNodeChild());
        }
    }

    protected snapValue(ref: firebase.database.Reference): any {
        try {
            return ref.once("value").then((snap: database.DataSnapshot) => {
                return snap.val();
            });
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error("Model combination value try catch error \n", e);
        }
    }

    protected snapOn(ref: firebase.database.Reference): any {
        try {
            return ref.on("value", (snap: any) => {
                return snap.val();
            });
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error("Model combination on try catch error \n", e);
        }
    }

    protected firebasePush(ref: firebase.database.Reference, data: {}): any {

        try {
            return ref.push(data).then((snap: any) => {
                this.resetSetBaseNodeChild(); // 재사용을 위해서 초기화.
                return snap.key;
            });
        } catch (e) {
            // tslint:disable-next-line:no-console
            console.error("Model combination push try catch error \n", e);
        }
    }

    protected resetSetBaseNodeChild(): void {
        this.baseNodeChild = (): string => {
            return null;
        };
    }
}
