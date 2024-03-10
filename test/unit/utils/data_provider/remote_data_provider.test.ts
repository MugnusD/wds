import {RemoteDataProvider} from "../../../../src/utils/data_provider/remote_data_provider";

describe('RemoteDataProvider test', () => {
    it('download', async () => {
        const dataProvider = new RemoteDataProvider();
        const result = await dataProvider.downloadToLocalCache();
        console.log(result);
    },60000)
})