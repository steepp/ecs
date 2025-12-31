function* getMockData() {
        const LIMIT = 750;
        let max = LIMIT / 2;
        let x,
                y = 0;

        x = max;

        while (true) {
                y = (y + 1) % LIMIT;
                yield { t: Date.now(), data: [{ x, y, color: "blue" }] };
        }
}

function print(data) {
        console.log(JSON.stringify(data));
}

export let dataGenerator = getMockData();
