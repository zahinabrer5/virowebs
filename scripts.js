async function fetchData(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
    }
}

function getStats(data, country, date) {
    for (let x in data) {
        if (data[x].location == country) {
            const stats = data[x].data;
            if (date == "" || date == "today") {
                return stats.at(-1);
            }
            for (let y = 0; y < stats.length; y++) {
                if (stats[y].date == date) {
                    return stats[y];
                }
            }
            return {error: "No data for given date"};
        }
    }
    return {error: "No data for given country"};
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const tbody = document.getElementById("tbody");

async function printData(url, country, date) {
    const data = await fetchData(url);
    const stats = getStats(data, country, date);
    for (let [key, value] of Object.entries(stats)) {
        key = capitalizeFirstLetter(key.split("_").join(" "));
        tbody.insertAdjacentHTML('beforeend', `<tr><th scope="row">${key}</th><td>${value}</td></tr>`);
    }
}

const url = "https://covid.ourworldindata.org/data/owid-covid-data.json";

const params = new URLSearchParams(location.search);
const country = params.get("country");
const date = params.get("date");

printData(url, country, date);
