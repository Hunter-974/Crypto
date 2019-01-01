export const environment = {
    name: "dev",
    settings: {
        production: false,
        apiBaseUrl: "/api"
    }
};

export const environmentLoader = new Promise<any>((resolve, reject) => {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/assets/environments/environment.json', true);
    xmlhttp.onload = function () {
        if (xmlhttp.status === 200) {
            resolve(JSON.parse(xmlhttp.responseText));
        } else {
            resolve(environment);
        }
    };
    xmlhttp.send();
});