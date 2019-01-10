import { environment } from "./environment";
export var environmentLoader = new Promise(function (resolve, reject) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open('GET', '/assets/environments/environment.json', true);
    xmlhttp.onload = function () {
        if (xmlhttp.status === 200) {
            resolve(JSON.parse(xmlhttp.responseText));
        }
        else {
            resolve(environment);
        }
    };
    xmlhttp.send();
});
//# sourceMappingURL=environmentLoader.js.map