interface DataProvider {
    fetchData(): Promise<any[]>;
}

export {DataProvider};

