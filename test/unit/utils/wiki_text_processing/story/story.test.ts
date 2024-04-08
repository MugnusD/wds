

describe('story test', () => {
    it('fetch story', async () => {
        await fetch('https://sirius.3-3.dev/scene/140911.json')
            .then(response => response.json())
            })
    })