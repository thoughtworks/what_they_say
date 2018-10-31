class LocalStorage {
    constructor(database) {
        this.database = database;
    }
    // Adding a method to the constructor
    save(data,callback) {
        return this.database.storage.local.set(data, callback());;
    }
}