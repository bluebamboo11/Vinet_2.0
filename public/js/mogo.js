function updatePass(user, callback) {
    postData('updatePass', {user}).then(function (data) {
        callback(data);
    })
}

function addUser(name, call) {
    postData('addUser', {name: name}).then(function (data) {
        call(data);
    })
}

function removeUser(name, call) {
    postData('removeUser', {name: name}).then(function (data) {
        call(data);
    })
}

function addPartner(name, call) {
    postData('partner/addPartner', {name: name}).then(function (data) {
        call(data);
    })
}

function getPartner(call) {
    getData('partner/getPartner').then(function (data) {
        call(data);
    })
}

function removePartner(partner, call) {
    postData('partner/removePartner', {partner: partner}).then(function (data) {
        call(data);
    })
}

function addOrder(order, call) {
    postData('order/addOrder',order).then(function (data) {
        call(data);
    })
}
function addBlackPhone(phone, call) {
    postData('order/addBlackPhone',phone).then(function (data) {
        call(data);
    })
}
function getAllOrder(obj, call) {
    postData('order/getAllOrder',obj).then(function (data) {
        call(data);
    })
}
function getAllOrderByEmployee(obj, call) {
    postData('order/getAllOrderByEmployee',obj).then(function (data) {
        call(data);
    })
}

function findOrderByCode(code, call) {
    postData('order/findOrderByCode',{code:code}).then(function (data) {
        call(data);
    })
}
function findOrderBlack(obj, call) {
    postData('order/findOrderBlack',obj).then(function (data) {
        call(data);
    })
}
function getTotalOrder(obj, call) {
    postData('order/getTotalOrder',obj).then(function (data) {
        call(data);
    })
}
function removeOrderInMonth(obj, call) {
    postData('order/removeOrderInMonth',obj).then(function (data) {
        call(data);
    })
}
function removeOrderByCode(code, call) {
    postData('order/removeOrderByCode',{code:code}).then(function (data) {
        call(data);
    })
}
function importOrder(dataImport, call) {
    postData('order/importOrder',dataImport).then(function (data) {
        call(data);
    })
}
function importBlackList(dataImport, call) {
    postData('order/importBlackList',dataImport).then(function (data) {
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