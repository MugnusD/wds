import {RemoteDataProvider} from "../../../../src/utils/data_provider/remote_data_provider";
import {generatePosterWikiText} from "../../../../src/utils/wiki_text_processing/generate_poster_wt";
import {PosterService} from "sirius-calculator";


describe('test poster wikitext generator',  () => {
    it('should generate wiki text', async () => {
            const posterDataProvider = new RemoteDataProvider();
            const posterDetails = await posterDataProvider.fetchData('poster');
            const testPoster = posterDetails.find(_ => _.id === 230210);
            console.log(generatePosterWikiText(testPoster));
        }
    , 60000)

    it('check json', async () => {
        const posterService = new PosterService();
        const posterData = await posterService.getPosterDetail(230210);
        console.log(posterData);
    })
})