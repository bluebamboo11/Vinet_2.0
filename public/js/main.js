// Initialize Firebase
let options = {
    emptyMessage: 'Không có đơn hàng ',
    rowHeight: 50,
    headerHeight: 40,
    footerHeight: 50,
    columns: [{
        name: "Mã Đơn hàng",
        prop: "code",
        width: 200
    }, {
        name: "Ngày",
        prop: "date"
    }, {
        name: "Số điện thoại",
        prop: "phone"
    }, {
        name: "Nhân viên",
        prop: "nv"
    }, {
        name: "Đối tác",
        prop: "partner"
    }],
    columnMode: 'force',
    paging: {
        externalPaging: true
    }
};
angular.module('MyApp', ['ngMaterial', 'data-table', 'ngFileUpload', 'ngMessages'])
    .controller('AppCtrl', function ($scope, $http, $mdDialog, $mdToast, $timeout) {
        let all = 'Tất cả';
        $scope.isOrder = true;
        let datePicker = getDateByMontg(new Date());
        $scope.dateStart = datePicker.start;
        $scope.dateEnd = datePicker.end;
        $scope.partner = all;
        $scope.lstPartner = [all];
        getPartner(function (data) {
            data.forEach(function (partner) {
                $scope.lstPartner.push(partner.name);
            });
            $scope.$digest();
        });
        $scope.dateSearch = new Date();
        $scope.data = [];
        $scope.blackLst = false;
        $scope.locDay = 'month';
        $scope.users = [];
        $scope.user = {};
        $scope.userSelect = {};
        $scope.isLogin = false;
        $scope.removeHDCode = function (ev) {
            let confirm = $mdDialog.prompt()
                .title('Xóa đơn hàng theo mã')
                .textContent('Nhập mã đơn hàng cần xóa')
                .placeholder('nhập ...')
                .ariaLabel('Mã đơn hàng')
                .targetEvent(ev)
                .required(true)
                .ok('Xóa')
                .cancel('Hủy');
            $mdDialog.show(confirm).then(function (result) {
                result = result.toUpperCase();
                removeOrderByCode(result, function (data) {
                    if (data.ok) {
                        getOrderByEmployee();
                    }
                })
            });
        };
        $scope.removePartner = function (ev) {
            let confirm = $mdDialog.prompt()
                .title('Xóa đối tác')
                .textContent('Nhập tên đối tác cần xóa')
                .placeholder('nhập ...')
                .ariaLabel('Tên đối tác')
                .targetEvent(ev)
                .required(true)
                .ok('Xóa')
                .cancel('Hủy');
            $mdDialog.show(confirm).then(function (result) {
                removePartner(result, function () {
                    for (let i = 0; i < $scope.lstPartner.length; i++) {
                        if ($scope.lstPartner[i] === result) {
                            $scope.lstPartner.splice(i, 1);
                            $scope.$digest();
                        }
                    }
                });
            });
        };
        $scope.logOut = function () {
            $scope.isLogin = false;
        };
//
//
        $scope.removeNV = function (ev) {
            let confirm = $mdDialog.prompt()
                .title('Xóa nhân viên')
                .textContent('Nhập tên nhân viên cần xóa')
                .placeholder('nhập ...')
                .ariaLabel('Tên nhân viên')
                .targetEvent(ev)
                .required(true)
                .ok('Xóa')
                .cancel('Hủy');
            $mdDialog.show(confirm).then(function (result) {
                removeUser(result, function () {
                    for (let i = 0; i < $scope.users.length; i++) {
                        if ($scope.users[i].name === result) {
                            $scope.users.splice(i, 1);
                            $scope.$digest();
                        }
                    }
                });
            });
        };
        $scope.showAddPhoneBlack = function (ev) {
            let confirm = $mdDialog.prompt()
                .title('Thêm số điện thoại đen')
                .textContent('Nhập số điện thoại')
                .placeholder('nhập ...')
                .ariaLabel('Số điện thoại')
                .targetEvent(ev)
                .required(true)
                .ok('Thêm')
                .cancel('Hủy');
            $mdDialog.show(confirm).then(function (result) {
                addBlackPhone({phone: result}, function (data) {
                    if (data.ok) {
                        toast('Thêm thành công');
                    } else {
                        toast('Thêm thất bại');
                    }
                });
            });
        };
        $scope.login = function () {
            if ($scope.user && $scope.pass) {
                $scope.showLoad = true;
                if ($scope.user.pass === $scope.pass) {
                    $scope.userSelect = $scope.user;
                    $scope.isLogin = true;
                    $scope.showLoad = false;
                    getOrderByEmployee();
                }
                else {
                    toast('Mật khẩu không đúng');
                    $scope.showLoad = false;
                }
            }
        };

        $scope.dateLocale = {
            formatDate: function (date) {
                let m = moment(date);
                return m.isValid() ? m.format('DD/MM/YYYY') : '';
            }
        };
        $scope.dateLocaleMonth = {
            formatDate: function (date) {
                let m = moment(date);
                return m.isValid() ? m.format('MM/YYYY') : '';
            }
        };
        $scope.getNv = function () {
            return getData('getAllUser').then((data) => {
                $scope.users = data;
                $scope.userSelect = data[0];
                getOrderByEmployee();
            });
        };
        $scope.addPartner = function (ev) {
            let confirm = $mdDialog.prompt()
                .parent(angular.element(document.body))
                .title('Thêm nhân đối tác')
                .textContent('Nhập tên đối tác.')
                .placeholder('Nhập...')
                .targetEvent(ev)
                .required(true)
                .ok('Xong!')
                .cancel('Hủy');

            $mdDialog.show(confirm).then(function (result) {
                addPartner(result, function (doc) {
                    if (doc.ok) {
                        $scope.lstPartner.push(result);
                        $scope.$digest();
                        toast('Thêm đối tác thành công');
                    } else {
                        toast('Tên đối tác đã tồn tại');
                    }
                });

            });
        };
        $scope.options = angular.copy(options);

        $scope.paging = function (offset, size) {
            if ($scope.data.length > size && offset === parseInt($scope.data.length / size)) {
                let obj = getDate();
                obj.end = $scope.data[$scope.data.length - 1].created_at;
                getAllOrderByEmployee(obj, function (data) {
                    data.forEach(function (order) {
                        $scope.data.push({
                            code: order.code,
                            date: moment(order.created_at).format('DD-MM-YYYY H:mm'),
                            created_at: order.created_at,
                            phone: order.phone ? order.phone : '',
                            nv: order.employee,
                            partner: order.partner
                        })
                    });
                    $scope.options.paging.count = $scope.data.length;
                    $scope.$digest();
                })
            }
        };
        $scope.addNewNV = function (ev) {
            const confirm = $mdDialog.prompt()
                .parent(angular.element(document.body))
                .title('Thêm nhân viên mới')
                .textContent('Nhập tên nhân viên.')
                .placeholder('Nhập...')
                .targetEvent(ev)
                .required(true)
                .ok('Xong!')
                .cancel('Hủy');

            $mdDialog.show(confirm).then(function (result) {
                addUser(result, function (data) {
                    if (!data.ok) {
                        toast('Tên nhân viên đã tồn tại');
                    } else {
                        $scope.users.push(data.data);
                        $scope.$digest();
                    }
                });
            }, function () {

            });
        };

        $scope.upHd = function (file, ev) {
            if (file) {
                let confirm = $mdDialog.confirm()
                    .parent(angular.element(document.body))
                    .title('Tải Lên file đơn hàng')
                    .textContent('Xác nhân tải lên file ' + file.name)
                    .targetEvent(ev)
                    .ok('Xác nhận')
                    .cancel('Hủy');

                $mdDialog.show(confirm).then(function () {
                    Papa.parse(file, {
                        header: true,
                        complete: function (results, file) {
                            $scope.isLoading = true;
                            let dataImport = [];
                            for (let i = 0; i < results.data.length; i++) {
                                if (results.data[i]['Order Number'] && results.data[i]['Shipping Phone Number'] && !isNaN(results.data[i]['Shipping Phone Number'])) {
                                    dataImport.push({
                                        code: results.data[i]['Order Number'],
                                        phone: results.data[i]['Shipping Phone Number']
                                    })
                                }
                            }
                            $scope.$digest();
                            importOrder(dataImport, function (data) {
                                $timeout(function () {
                                    $scope.isLoading = false;
                                    if (data.ok) {
                                        toast('Tải lên thành công');
                                        getOrderByEmployee();
                                    }
                                }, 1000)
                            })
                        }
                    });
                });
            }
        };
        $scope.isLoading = false;
        $scope.upBlackLst = function (file, ev) {
            let confirm = $mdDialog.confirm()
                .parent(angular.element(document.body))
                .title('Tải Lên file khách hàng đen')
                .textContent('Xác nhân tải lên file ' + file.name)
                .targetEvent(ev)
                .ok('Xác nhận')
                .cancel('Hủy');

            $mdDialog.show(confirm).then(function () {
                Papa.parse(file, {
                    header: true,
                    complete: function (results, file) {
                        $scope.isLoading = true;
                        let dataImport = [];
                        for (let i = 0; i < results.data.length; i++) {
                            if (results.data[i]['Order Number'] && results.data[i]['Shipping Phone Number'] && !isNaN(results.data[i]['Shipping Phone Number'])) {
                                dataImport.push({
                                    code: results.data[i]['Order Number'],
                                    phone: results.data[i]['Shipping Phone Number']
                                })
                            }
                        }
                        $scope.$digest();
                        importBlackList(dataImport, function (data) {
                            $timeout(function () {
                                $scope.isLoading = false;
                                toast('Tải lên thành công');
                                if (data.ok) {
                                    getOrderByEmployee();
                                }
                            }, 1000)
                        })
                    }
                });
            });
        };

        $scope.selectNv = function (user) {
            if ($scope.userSelect !== user) {
                $scope.userSelect = user;
                $scope.total = 0;
                $scope.options.paging.count = 0;
                if (user.name === 'admin') {
                    $scope.options.columns = [{
                        name: "Mã Đơn hàng",
                        prop: "code",
                        width: 200
                    }, {
                        name: "Ngày",
                        prop: "date"

                    }, {
                        name: "Số điện thoại",
                        prop: "phone"
                    }, {
                        name: "Nhân Viên",
                        prop: "nv"
                    }, {
                        name: "Đối tác",
                        prop: "partner"
                    }]
                }
                else {
                    if ($scope.options.columns.length === 5) {
                        $scope.options.columns = [
                            {
                                name: "Mã Đơn hàng",
                                prop: "code"
                            },
                            {
                                name: "Ngày",
                                prop: "date"
                            }, {
                                name: "Đối tác",
                                prop: "partner"
                            }]
                    }

                }
                getOrderByEmployee();

            }
        };
        $scope.addHD = function (ev) {
            $scope.maDonHang = $scope.maDonHang.toUpperCase();
            let maDonHang = angular.copy($scope.maDonHang);
            if ($scope.maDonHang) {
                if (!($scope.maDonHang.indexOf(" ") > -1)) {
                    addOrder({
                        code: maDonHang,
                        partner: $scope.partner,
                        employee: $scope.userSelect.name
                    }, function (data) {
                        let order = data.order;
                        if (data.ok) {
                            $scope.$apply(function () {
                                $scope.maDonHang = '';
                                $scope.data.unshift({
                                    code: order.code,
                                    date: moment(order.created_at).format('DD-MM-YYYY H:mm'),
                                    created_at: order.created_at,
                                    phone: order.phone ? order.phone : '',
                                    nv: order.employee,
                                    partner: order.partner
                                });
                                $scope.options.paging.count = $scope.data.length;
                            });

                        } else {
                            playAudio();
                            if (data.phone) {thanht
                                alert('Đơn hàng ' + order.code + ' Có sủ dụng  số điện thoại đen ' + data.phone , ev)
                            } else {
                                alert('Đơn hàng ' + order.code + ' Đã được nhân viên ' + order.employee + ' Thêm vào ' + moment(order.created_at).format('DD-MM-YYYY H:mm'), ev)
                            }

                        }

                    })
                } else {
                    playAudio();
                    toast('Mã không hợp lệ')
                }
            } else {
                playAudio();
                toast('Mã đơn hàng không được để trống');
            }

        };

        function alert(text, ev) {
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(angular.element(document.body))
                    .clickOutsideToClose(true)
                    .title('Lỗi thêm đơn hàng')
                    .textContent(text)
                    .ok('Ok')
                    .targetEvent(ev)
            )
        }

        function playAudio() {
            let audio = new Audio('sound/nasty-error-long.mp3');
            audio.play();
        }

        $scope.searchHD = function (ev) {
            $scope.searchKey = $scope.searchKey.toLocaleUpperCase();
            if ($scope.searchKey) {
                findOrderByCode($scope.searchKey, function (data) {
                    if (data.code) {
                        if (data.employee) {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.body))
                                    .clickOutsideToClose(true)
                                    .title('Đơn hàng : ' + data.code)
                                    .textContent('Nhân viên : ' + data.employee + ' -- Thời gian : ' + moment(data.created_at).format('DD-MM-YYYY H:mm') + ' -- Đối tác : ' + data.partner)
                                    .ok('Ok')
                                    .targetEvent(ev)
                            );
                        } else {
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.body))
                                    .clickOutsideToClose(true)
                                    .title('Đơn hàng : ' + data.code)
                                    .textContent('Đơn hàng chưa được nhân viên nào xử lý')
                                    .ok('Ok')
                                    .targetEvent(ev)
                            );
                        }
                    }
                    else {
                        $mdDialog.show(
                            $mdDialog.alert()
                                .parent(angular.element(document.body))
                                .clickOutsideToClose(true)
                                .title('Tìm Đơn Hàng')
                                .textContent('Đơn hàng không tồn tại')
                                .ok('Ok')
                                .targetEvent(ev)
                        );

                    }
                })
            }
        };
        $scope.locHd = function () {

            getOrderByEmployee();

        };
        $scope.selectPartner = function () {
            getOrderByEmployee();
        };

        $scope.getTotal = function () {
            getTotalOrder(getDate(), function (data) {
                $scope.total = data.count;
                $scope.$digest();
            })
        };
        $scope.exportOrder = function () {
            $scope.disableExport = true;
            let dataExport = [];
            let obj = getDate();
            obj.isFull = true;
            getAllOrderByEmployee(obj, function (data) {
                for (let order of data) {
                    dataExport.push([order.code, moment(order.created_at).format('DD-MM-YYYY H:mm'), order.employee, order.partner])
                }
                let csv = Papa.unparse({
                    fields: ["Mã Đơn Hàng", "Thời gian", "Nhân viên", "Đối tác"],
                    data: dataExport
                }, {delimiter: ';'});
                let blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
                saveAs(blob, "order.export.csv");
                $scope.disableExport = false;
            });
        };
        $scope.removeHDMonth = function (ev) {
            showDialogRemoveHD(ev, function (date) {
                removeOrderInMonth(getDateByMontg(date), function (data) {
                    getOrderByEmployee();
                })
            });
        };
        $scope.checkPri = function () {

            if ($scope.userSelect.name === 'admin' || $scope.partner === all) {
                return true;
            }
            if ($scope.user.name === 'admin') {
                return false;
            }
            if ($scope.userSelect === $scope.user) {
                return false;
            } else {
                return true;
            }


        };


        function updatePhone(ref, name, phone, code) {
            database.ref(ref + name + '/order/' + code).once('value').then(function (snapshot) {
                if (snapshot.val()) {
                    database.ref(ref + name + '/order/' + snapshot.key + '/phone')
                        .set(phone).then(function (value) {
                        if (checkBlackList(phone)) {
                            database.ref('employees/' + name + '/order/' + code).once('value').then(function (snapshot) {
                                if (snapshot.val()) {
                                    database.ref('blackLst/' + name + '/order/' + code).set(snapshot.val());
                                }
                            })
                        }
                    })
                }
            });
        }

        function getDate() {
            let obj = {};
            if ($scope.partner !== all) {
                obj.partner = $scope.partner;
            }
            if ($scope.userSelect.name !== 'admin') {
                obj.name = $scope.userSelect.name;
            }
            if ($scope.blackLst) {
                obj.isBlack = true;
            }
            if ($scope.virtualOrder) {
                obj.virtualOrder = true;
            }
            if ($scope.isOrder && $scope.dateStart && $scope.dateEnd) {
                $scope.dateEnd.setHours(24);
                $scope.dateEnd.setMinutes(0);
                obj.start = $scope.dateStart;
                obj.end = $scope.dateEnd;
                return obj;
            }
            obj.all = true;
            return obj;
        }

        function getOrderByEmployee() {
            $scope.total = 0;
            $scope.data = [];
            let obj = getDate();
            getAllOrderByEmployee(obj, function (data) {
                $scope.$apply(function () {
                    data.forEach(function (order) {
                        $scope.data.push({
                            code: order.code,
                            date: moment(order.created_at).format('DD-MM-YYYY H:mm'),
                            created_at: order.created_at,
                            phone: order.phone ? order.phone : '',
                            nv: order.employee,
                            partner: order.partner
                        });
                    });
                    $scope.options.paging.count = $scope.data.length;
                });
            });
        }


        function showDialogRemoveHD($event, remove) {
            $scope.items = [1, 2, 3];
            let parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                template:
                '<md-dialog aria-label="Xóa đơn hàng theo tháng">\n' +
                '    <md-dialog-content class="md-dialog-content">\n' +
                '        <h2 class="md-title ">Xóa Đơn hàng theo tháng</h2>\n' +
                '<div  class="md-dialog-content-body " ><p >Nhập tháng cần xóa</p></div>' +
                '   <md-datepicker style="margin-left: -16x!important;" md-mode="month" ng-model="dateRemove" md-placeholder="Nhập tháng"\n' +
                '                       md-date-locale="dateLocaleMonth"></md-datepicker>\n' +
                '    </md-dialog-content>\n' +
                '    <md-dialog-actions>\n' +
                '        <md-button ng-click="closeDialog()" class="md-primary">Hủy</md-button>\n' +
                '        <md-button  ng-disabled="!dateRemove" ng-click="removeOderMonth()" class="md-primary"> Xóa</md-button>\n' +
                '    </md-dialog-actions>\n' +
                '</md-dialog>',
                locals: {
                    items: $scope.items
                },
                controller: DialogController
            });

            function DialogController($scope, $mdDialog, items) {
                $scope.dateRemove = null;
                $scope.dateLocaleMonth = {
                    formatDate: function (date) {
                        let m = moment(date);
                        return m.isValid() ? m.format('MM / YYYY') : '';
                    }
                };
                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };
                $scope.removeOderMonth = function () {
                    $mdDialog.hide();
                    remove($scope.dateRemove);
                }
            }
        }

        $scope.showFindBlackOrder = function ($event) {
            let parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                clickOutsideToClose: true,
                template:
                '<div class="black-order">' +
                '  <md-toolbar md-colors="{background: \'blue-grey\'}">\n' +
                '      <div class="md-toolbar-tools"  >\n' +
                '        <h2>Tìm đơn hàng đen</h2>\n' +
                '        <span flex></span>\n' +
                '        <md-button class="md-icon-button" ng-click="cancel()">\n' +
                '          <md-icon md-svg-src="img/baseline-close-24px.svg" aria-label="Close dialog"></md-icon>\n' +
                '        </md-button>\n' +
                '      </div>\n' +
                '  </md-toolbar>' +
                '  <form class="input-search-black" ng-submit="searchBlackOrder()">\n' +
                '                  <md-input-container class="md-icon-float md-block">\n' +
                '                        <label>Tìm hóa đơn ...</label>\n' +
                '                        <md-icon md-svg-src="img/ic_search_black_24px.svg"></md-icon>\n' +
                '                        <input ng-model="searchKey" type="text" style="text-transform: uppercase">\n' +
                '                    </md-input-container>\n' +
                '                   <md-select ng-model="modeFind"  class="md-no-underline">\n' +
                '                       <md-option value="code">Mã đơn hàng</md-option>\n' +
                '                       <md-option value="phone">Số điện thoại</md-option>\n' +
                '                 </md-select>' +
                '   </form>' +
                '  <dtable  ng-if="isRenderTable" options="options" rows="data" class="material" ></dtable>' +
                ' <md-progress-linear class="loading" ng-show="showLoad" md-mode="indeterminate"></md-progress-linear>' +
                '</div>',

                controller: DialogController
            });

            function DialogController($scope, $mdDialog, $timeout) {
                $scope.options = angular.copy(options);
                $scope.options.paging.count = 0;
                $scope.modeFind = 'code';
                $scope.showLoad = false;
                $scope.isRenderTable = false;
                $timeout(function () {
                    $scope.isRenderTable = true;
                }, 1000);
                $scope.data = [];
                $scope.cancel = function () {
                    $mdDialog.cancel();
                };
                $scope.searchBlackOrder = function () {
                    $scope.showLoad = true;
                    let obj = {phone: $scope.searchKey};
                    if ($scope.modeFind === 'code') {
                        obj = {code: $scope.searchKey};
                    }
                    findOrderBlack(obj, function (data) {
                        $scope.data = [];
                        $timeout(function () {
                            $scope.showLoad = false;
                        }, 500);
                        data.forEach(function (order) {
                            $scope.data.push({
                                code: order.code,
                                date: moment(order.created_at).format('DD-MM-YYYY H:mm'),
                                created_at: order.created_at,
                                phone: order.phone ? order.phone : '',
                                nv: order.employee,
                                partner: order.partner
                            })
                        });
                        $scope.options.paging.count = $scope.data.length;
                        $scope.$digest();
                    })
                }
            }
        };
        $scope.openChangePass = function (ev) {
            showDialogChangePass(ev);
        };
        $scope.closeDialog = function () {
            $mdDialog.hide();
        };

        function showDialogChangePass($event) {
            let parentEl = angular.element(document.body);
            $mdDialog.show({
                parent: parentEl,
                targetEvent: $event,
                template:
                '<md-dialog aria-label="Xóa đơn hàng theo tháng">\n' +
                '    <md-dialog-content class="md-dialog-content">\n' +
                '        <h2 class="md-title ">Đối mật khẩu</h2>\n' +
                '  <md-select ng-disabled="userLogin.name!==admin" name="user" required placeholder="Chọn tài khoản" ng-model="userPass" \n' +
                '                           style="width: 100%;">\n' +
                '    <md-option ng-value="user" ng-repeat="user in users">{{user.name}}</md-option>\n' +
                '   </md-select>' +
                '<md-input-container>\n' +
                ' <label>Nhập mật khẩu tài khoản</label>\n' +
                '         <input name="pass" type="password" md-maxlength="30" required  name="description"\n' +
                '                           ng-model="passOld">\n' +
                '          </md-input-container>' + '' +
                '<md-input-container>\n' +
                '                    <label>Nhập mật khẩu mới</label>\n' +
                '                    <input name="pass"  md-maxlength="30" required  name="description"\n' +
                '                           ng-model="passNew">\n' +
                '                </md-input-container>' +
                '    </md-dialog-content>\n' +
                '    <md-dialog-actions>\n' +
                '        <md-button ng-click="closeDialog()" class="md-primary">Hủy</md-button>\n' +
                '        <md-button  ng-disabled="!userPass||!passOld||!passNew" ng-click="changePass()" class="md-primary"> Xác nhận</md-button>\n' +
                '    </md-dialog-actions>\n' +
                '</md-dialog>',
                locals: {
                    pass: $scope.pass,
                    userLogin: $scope.user,
                    users: $scope.users
                },
                controller: DialogController
            });

//
            function DialogController($scope, $mdDialog, pass, userLogin, users) {
                $scope.userLogin = userLogin;
                $scope.userPass = angular.copy(userLogin);
                $scope.users = users;
                $scope.admin = 'admin';
                $scope.changePass = function () {
                    if ($scope.userLogin.pass === $scope.passOld) {
                        $mdDialog.hide();
                        $scope.userPass.pass = $scope.passNew;
                        updatePass($scope.userPass, function (value) {
                            toast('Đổi mật khẩu thành công');
                        });
                    }
                    else {
                        toast('Mật khẩu không chính xác');
                    }
                };

                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

            }


        }

        function toast(text) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('top left')
                    .hideDelay(3000)
            );
        }

        $scope.getNv();
    })
    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        $mdDateLocaleProvider.shortMonths = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];
        $mdDateLocaleProvider.days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        $mdDateLocaleProvider.shortDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    });

function getDateByMontg(date) {
    const startOfMonth = moment(date).startOf('month').toDate();
    const endOfMonth = moment(date).endOf('month').toDate();
    console.log({start: startOfMonth, end: endOfMonth});
    return {start: startOfMonth, end: endOfMonth}
}