
async function load(config, route) {
    return new Promise(async (resolve, reject) => {
        if (route !== 'Home') return resolve();
        const time = new Date();
        const dataPoints = { charity: 'Charity', submissions: "Game Submissions", volunteer: "Volunteer Submissions", location: "Location", attendee: "Attendee Registration", dates: "Event Dates" }
        const live = await (await fetch(config.twitchLiveApiUrl)).json();
        if (live.live) document.querySelector('.twitch-section').style.display = 'block';
        let parent = document.querySelector('.upcoming-events-details');

        document.querySelector('.upcoming-events-heading').innerHTML = `${config.eventInfo[0].name} Information`;

        config.eventInfo.forEach((event, index) => {
            Object.keys(event).forEach(key => {
                if (dataPoints[key] && typeof event[key] === 'object' && event[key].openText && event[key].openText !== "") populateData(event, key);
                else if (dataPoints[key] && typeof event[key] !== 'object' && event[key] && event[key] !== "") populateData(event, key);
            })
        })

        resolve();

        function populateData(event, key) {
            let div = document.createElement('div');
            div.setAttribute('class', 'upcoming-event');

            let title = document.createElement('div');
            title.setAttribute('class', 'bold-text');
            title.innerHTML = dataPoints[key]

            let data = document.createElement('div');
            data.setAttribute('class', 'text');
            if (typeof event[key] === "object") {
                const start = new Date(event[key].start);
                const end = new Date(event[key].end);
                if (start < time && end < time) data.innerHTML = event[key].closedText;
                else if (start < time) data.innerHTML = event[key].openText;
                else data.innerHTML = event[key].beforeOpenText;
            }
            else data.innerHTML = event[key]

            div.appendChild(title);
            div.appendChild(data);
            parent.append(div);
        }
    })
}