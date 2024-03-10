interface DataProvider {
    fetchData(key: string): Promise<any[]>;
}

export {DataProvider};

