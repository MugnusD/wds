class DataProvider {
    constructor() {
    }

    async fetchData() {
        throw new Error('fetchData method must be implemented');
    }
}

module.exports = DataProvider;