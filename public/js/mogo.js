function updatePass(user,callback) {
    postData('updatePass',{user}).then(function (data) {
        callback(data);
    })
}
function addUser(name,call) {
    postData('addUser',{name:name}).then(function (data) {
        call(data);
    })
}
function removeUser(name,call) {
    postData('removeUser',{name:name}).then(function (data) {
        call(data);
    })
}
function postData(url = ``, data = {}) {
    // Default options are marked with *
    return fetch(url, {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    })
        .then(response => response.json()); // parses response to JSON
}


function getData(url = ``,) {
    return fetch(url, {
        method: "GET", // *GET, POST, PUT, DELETE, etc.
        mode: "no-cors", // no-cors, cors, *same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    })
        .then(response => response.json()); // parses response to JSON
}