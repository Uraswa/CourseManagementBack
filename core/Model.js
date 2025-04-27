import pg from "pg";

const {pool} = pg;
class Model {

    static globalPool;
    pool;
    constructor() {
        this.pool = Model.globalPool;
    }

    static connect(){
        Model.globalPool = new pool({
            user: 'nice',
            host: 'localhost',
            database: 'lr4',
            password: 'nice',
            port: 5432,
        })
    }

}

Model.connect();
export default Model;