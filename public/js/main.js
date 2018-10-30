// Initialize Firebase

angular.module('MyApp', ['ngMaterial', 'data-table', 'ngFileUpload', 'ngMessages'])
    .controller('AppCtrl', function ($scope, $http, $mdDialog, $mdToast) {
        var all = 'Tất cả';
//         var admin = 'Admin';
//         $scope.total = 0;
        $scope.partner = all;
        $scope.lstPartner = [all];
        getPartner(function (data) {
            data.forEach(function (partner) {
                $scope.lstPartner.push(partner.name);
            });
            $scope.$digest();
        });
        $scope.userSelect = {};
        $scope.dateSearch = new Date();
//         $scope.data = [];
//         $scope.blackLst = false;
//         $scope.erorr = true;
//         var show = true;
//         $scope.maDonHang = '';
//         $scope.index = 0;
//         $scope.lstNV = [];
//         $scope.searchKey = '';
        $scope.locDay = 'month';
        $scope.users = [];
        $scope.user = {name: 'admin', pass: '1234'};
//         $scope.pass = null;
        $scope.isLogin = true;
//         var blackLst = [];
//         var database = firebase.database();
//         getListHD(all);
//         getBlackLst();
//         var removeLis;
//         getPartner();
//         listenRemove();
//         var commentsRef = database.ref('nv');
//         commentsRef.on('child_added', function (data) {
//             $scope.$apply(function () {
//                 $scope.lstNV.push({name: data.key})
//             });
//         });
//         $scope.removeHDCode = function (ev) {
//             var confirm = $mdDialog.prompt()
//                 .title('Xóa đơn hàng theo mã')
//                 .textContent('Nhập mã đơn hàng cần xóa')
//                 .placeholder('nhập ...')
//                 .ariaLabel('Mã đơn hàng')
//                 .targetEvent(ev)
//                 .required(true)
//                 .ok('Xóa')
//                 .cancel('Hủy');
//             $mdDialog.show(confirm).then(function (result) {
//                 show = true;
//                 result = result.toUpperCase();
//                 database.ref('employees/Tất cả/order/' + result).once('value').then(function (snapshot) {
//                     if (snapshot.val()) {
//                         for (var i = 0; i < $scope.lstNV.length; i++) {
//                             removeHd('employees/', $scope.lstNV[i].name, result);
//                             removeHd('blackLst/', $scope.lstNV[i].name, result);
//                         }
//                     } else {
//                         $mdDialog.show(
//                             $mdDialog.alert()
//                                 .parent(angular.element(document.body))
//                                 .clickOutsideToClose(true)
//                                 .title('Tìm Đơn Hàng')
//                                 .textContent('Đơn hàng không tồn tại')
//                                 .ok('Ok')
//                                 .targetEvent(ev)
//                         );
//                     }
//                 })
//
//
//             });
//         };
        $scope.removePartner = function (ev) {
            var confirm = $mdDialog.prompt()
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
            var confirm = $mdDialog.prompt()
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
                            $scope.users.splice(i, 1)
                            $scope.$digest();
                        }
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
                }
                else {
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Mật khẩu không đúng')
                            .position('top left')
                            .hideDelay(3000)
                    );
                    $scope.showLoad = false;
                }
            }
        }
        ;
//         $scope.dateLocale = {
//             formatDate: function (date) {
//                 var m = moment(date);
//                 return m.isValid() ? m.format('DD / MM / YYYY') : '';
//             }
//         };
//         $scope.dateLocaleMonth = {
//             formatDate: function (date) {
//                 var m = moment(date);
//                 return m.isValid() ? m.format('MM / YYYY') : '';
//             }
//         };
        $scope.getNv = function () {
            return getData('getAllUser').then((data) => {
                $scope.users = data;
            });
        };
        $scope.addPartner = function (ev) {
            var confirm = $mdDialog.prompt()
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
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Thêm đối tác thành công')
                                .position('top left')
                                .hideDelay(3000)
                        );
                    } else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Tên đối tác đã tồn tại')
                                .position('top left')
                                .hideDelay(3000)
                        );
                    }
                });

            });
        };
        $scope.options = {
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
        $scope.paging = function (offset, size) {
            if ( $scope.data.length>size&&offset === parseInt($scope.data.length / size)) {
                let obj = getDate();
                obj.end = $scope.data[$scope.data.length - 1].created_at;
                getAllOrderByEmployee(obj, function (data) {
                    data.forEach(function (order) {
                        $scope.data.push({
                            code: order.code,
                            date: moment(order.created_at).format('DD-MM-YYYY H:mm'),
                            created_at:order.created_at,
                            phone: order.phone,
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
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Tên nhân viên đã tồn tại')
                                .position('top left')
                                .hideDelay(3000)
                        );
                    } else {
                        $scope.users.push(data.data);
                        $scope.$digest();
                    }
                });
            }, function () {

            });
        };
//
//         $scope.upHd = function (file, ev) {
//             if (file) {
//                 var confirm = $mdDialog.confirm()
//                     .parent(angular.element(document.body))
//                     .title('Tải Lên file đơn hàng')
//                     .textContent('Xác nhân tải lên file ' + file.name)
//                     .targetEvent(ev)
//                     .ok('Xác nhận')
//                     .cancel('Hủy');
//
//                 $mdDialog.show(confirm).then(function () {
//                     Papa.parse(file, {
//                         header: true,
//                         complete: function (results, file) {
//                             show = true;
//                             for (var i = 0; i < results.data.length; i++) {
//                                 if (results.data[i]['Order Number'] && results.data[i]['Shipping Phone Number'] && !isNaN(results.data[i]['Shipping Phone Number'])) {
//                                     setDataAll(results.data[i]['Shipping Phone Number'], results.data[i]['Order Number']);
//                                     for (var j = 1; j < $scope.lstNV.length; j++) {
//                                         if (results.data[i]['Order Number'] && !isNaN(results.data[i]['Shipping Phone Number'])) {
//                                             updatePhone('employees/', $scope.lstNV[j].name, results.data[i]['Shipping Phone Number'], results.data[i]['Order Number']);
//                                         }
//
//                                     }
//                                 }
//                             }
//                         }
//                     });
//                 });
//             }
//         };
//
//         $scope.upBlackLst = function (file, ev) {
//             var confirm = $mdDialog.confirm()
//                 .parent(angular.element(document.body))
//                 .title('Tải Lên file khách hàng đen')
//                 .textContent('Xác nhân tải lên file ' + file.name)
//                 .targetEvent(ev)
//                 .ok('Xác nhận')
//                 .cancel('Hủy');
//
//             $mdDialog.show(confirm).then(function () {
//                 Papa.parse(file, {
//                     header: true,
//                     complete: function (results, file) {
//                         show = true;
//                         for (var i = 0; i < results.data.length; i++) {
//                             for (var j = 0; j < $scope.lstNV.length; j++) {
//                                 if (results.data[i]['Order Number'] && !isNaN(results.data[i]['Shipping Phone Number'])) {
//                                     database.ref('phoneBlack/' + results.data[i]['Shipping Phone Number']).set('').then(function (value) {
//                                         if (show) {
//                                             show = false;
//                                             $mdToast.show(
//                                                 $mdToast.simple()
//                                                     .textContent('Tải file thành công')
//                                                     .position('top left')
//                                                     .hideDelay(3000)
//                                             );
//                                         }
//                                     });
//                                     updateBlackLst($scope.lstNV[j].name, results.data[i]['Shipping Phone Number'], results.data[i]['Order Number']);
//                                 }
//                             }
//                         }
//                     }
//                 });
//             });
//         };
//
//         function updateBlackLst(name, phone, code) {
//             database.ref('employees/' + name + '/order/').orderByChild('phone').equalTo(phone).once('value').then(function (snapshot) {
//                 if (snapshot.val()) {
//                     database.ref('blackLst/' + name + '/order/' + code).set(snapshot.val()[code]);
//                 }
//             })
//         };
//
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
            var maDonHang = angular.copy($scope.maDonHang);
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
                                    created_at:order.created_at,
                                    phone: order.phone,
                                    nv: order.employee,
                                    partner: order.partner
                                });
                                $scope.options.paging.count = $scope.data.length;
                            });

                        } else {
                            playAudio();
                            $mdDialog.show(
                                $mdDialog.alert()
                                    .parent(angular.element(document.body))
                                    .clickOutsideToClose(true)
                                    .title('Lỗi thêm đơn hàng')
                                    .textContent('Đơn hàng ' + order.code + ' Đã được nhân viên ' + order.employee + ' Thêm vào ' + moment(order.created_at).format('DD-MM-YYYY H:mm'))
                                    .ok('Ok')
                                    .targetEvent(ev)
                            )
                        }

                    })
                } else {
                    playAudio();
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent('Mã không hợp lệ')
                            .position('top left')
                            .hideDelay(3000)
                    );
                }
            } else {
                playAudio();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent('Mã đơn hàng không được để trống')
                        .position('top left')
                        .hideDelay(3000)
                );
            }

        };


        function playAudio() {
            var audio = new Audio('sound/nasty-error-long.mp3');
            audio.play();
        }

//         $scope.searchHD = function (ev) {
//             $scope.searchKey = $scope.searchKey.toLocaleUpperCase();
//             var searchKey = convertString($scope.searchKey);
//             if ($scope.searchKey) {
//                 database.ref('employees/Tất cả/order/' + searchKey).once('value').then(function (snapshot) {
//                     if (snapshot.val()) {
//                         if (snapshot.val().nv) {
//                             $mdDialog.show(
//                                 $mdDialog.alert()
//                                     .parent(angular.element(document.body))
//                                     .clickOutsideToClose(true)
//                                     .title('Đơn hàng : ' + convertStringPart(snapshot.key))
//                                     .textContent('Nhân viên : ' + snapshot.val().nv + ' -- Thời gian : ' + snapshot.val().date + '-- Đối tác : ' + snapshot.val().partner)
//                                     .ok('Ok')
//                                     .targetEvent(ev)
//                             );
//                         } else {
//                             $mdDialog.show(
//                                 $mdDialog.alert()
//                                     .parent(angular.element(document.body))
//                                     .clickOutsideToClose(true)
//                                     .title('Đơn hàng : ' + convertStringPart(snapshot.key))
//                                     .textContent('Đơn hàng chưa được nhân viên nào xử lý')
//                                     .ok('Ok')
//                                     .targetEvent(ev)
//                             );
//                         }
//                     }
//                     else {
//                         $mdDialog.show(
//                             $mdDialog.alert()
//                                 .parent(angular.element(document.body))
//                                 .clickOutsideToClose(true)
//                                 .title('Tìm Đơn Hàng')
//                                 .textContent('Đơn hàng không tồn tại')
//                                 .ok('Ok')
//                                 .targetEvent(ev)
//                         );
//
//                     }
//                 })
//             }
//         };
        $scope.locHd = function () {
            if ($scope.isOrder && $scope.dateStart && $scope.dateEnd) {
                getOrderByEmployee();
            }
        };
        $scope.selectPartner = function () {
            getOrderByEmployee();
        };
//         var dataExport;
//         $scope.getTotal = function (callback) {
//             var code = $scope.lstNV[$scope.index].name;
//             var ref = '';
//             if (!$scope.blackLst) {
//                 ref = 'employees/';
//             } else {
//                 ref = 'blackLst/';
//
//             }
//             if (removeLis) {
//                 removeLis.off();
//             }
//             if ($scope.locDay === 'all' && $scope.partner === all) {
//                 removeLis = database.ref(ref + code + '/order');
//             }
//             if ($scope.locDay !== 'all' && $scope.partner === all) {
//                 var dateSearch = '';
//                 if ($scope.locDay === 'day') {
//                     dateSearch = moment($scope.dateSearch).format('DD / MM / YYYY');
//                 } else {
//                     dateSearch =) moment($scope.dateSearch.format('MM / YYYY');
//                 }
//                 removeLis = database.ref(ref + code + '/order').orderByChild($scope.locDay).equalTo(dateSearch);
//             }
//             if ($scope.locDay === 'all' && $scope.partner !== all) {
//                 removeLis = database.ref(ref + code + '/order').orderByChild($scope.partner + 'date');
//             }
//             if ($scope.locDay !== 'all' && $scope.partner !== all) {
//                 var dateSearch = '';
//                 if ($scope.locDay === 'day') {
//                     dateSearch = moment($scope.dateSearch).format('DD / MM / YYYY');
//                 } else {
//                     dateSearch = moment($scope.dateSearch).format('MM / YYYY');
//                 }
//                 removeLis = database.ref(ref + code + '/order').orderByChild($scope.partner + $scope.locDay).equalTo(dateSearch);
//             }
//             removeLis.once('value').then(function (snapshot) {
//                 if (callback) {
//                     callback(snapshot.val());
//                 }
//                 dataExport = snapshot.val();
//                 $scope.$apply(function () {
//                     $scope.total = Object.keys(snapshot.val()).length;
//                 })
//             });
//         };
//         $scope.exportOrder = function () {
//             $scope.disableExport = true;
//             var dataExport = [];
//             $scope.getTotal(function (data) {
//                 if ($scope.lstNV[$scope.index].name !== all) {
//                     for (key in data) {
//                         dataExport.push([convertStringPart(key), data[key].date, $scope.lstNV[$scope.index].name, data[key].partner])
//                     }
//                 } else {
//                     for (key in data) {
//                         dataExport.push([convertStringPart(key), data[key].date, data[key].nv, data[key].partner])
//                     }
//                 }
//                 var csv = Papa.unparse({
//                     fields: ["Mã Đơn Hàng", "Thời gian", "Nhân viên", "Đối tác"],
//                     data: dataExport
//                 }, {delimiter: ';'});
//                 var blob = new Blob([csv], {type: "text/plain;charset=utf-8"});
//                 saveAs(blob, "order.export.csv");
//                 $scope.disableExport = false;
//             });
//
//         };
//         $scope.removeHDMonth = function (ev) {
//             showDialogRemoveHD(ev, function (date) {
//                 var dateSearch = moment(date).format('MM / YYYY');
//                 show = true;
//                 for (var i = 0; i < $scope.lstNV.length; i++) {
//                     var removeLis1 = database.ref('employees/' + $scope.lstNV[i].name + '/order');
//                     var removeLis2 = database.ref('blackLst/' + $scope.lstNV[i].name + '/order');
//                     removeByOrder(removeLis1, removeLis2, dateSearch);
//                 }
//
//             });
//         };
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
//
//         function listenRemove() {
//             database.ref('partner/').on('child_removed', function (data) {
//                 $scope.lstPartner.splice($scope.lstPartner.indexOf(data.val().name), 1);
//                 $mdToast.show(
//                     $mdToast.simple()
//                         .textContent('Đã xóa đối tác ' + data.key)
//                         .position('top left')
//                         .hideDelay(3000)
//                 );
//             });
//             database.ref('nv/').on('child_removed', function (data) {
//                 $scope.lstNV.splice($scope.lstNV.indexOf({name: data.val().name}), 1);
//                 $mdToast.show(
//                     $mdToast.simple()
//                         .textContent('Đã xóa nhân viên ' + data.key)
//                         .position('top left')
//                         .hideDelay(3000)
//                 );
//             });
//         }
//
//         function removeHd(black, name, code) {
//             database.ref(black + name + '/order/' + code).remove().then(function (value) {
//                 if (show) {
//                     show = false;
//                     $mdToast.show(
//                         $mdToast.simple()
//                             .textContent('Xóa thành công')
//                             .position('top left')
//                             .hideDelay(3000)
//                     );
//                 }
//             });
//         }
//
//         function removeByOrder(data1, data2, dateSearch) {
//             data1.orderByChild('month').equalTo(dateSearch).once('value').then(function (snapshot) {
//                 var updates = {};
//                 for (var key in snapshot.val()) {
//                     updates[key] = null;
//                 }
//                 data1.update(updates);
//             });
//             data2.orderByChild('month').equalTo(dateSearch).once('value').then(function (snapshot) {
//                 var updates = {};
//                 for (var key in snapshot.val()) {
//                     updates[key] = null;
//                 }
//                 data2.update(updates).then(function (value) {
//                     if (updates && show) {
//                         show = false;
//                         $mdToast.show(
//                             $mdToast.simple()
//                                 .textContent('Xoá đơn hàng thành công')
//                                 .position('top left')
//                                 .hideDelay(3000)
//                         );
//                     }
//                 });
//
//             });
//         }
//
//         function converLex(code) {
//             if (code.split('-')[1]) {
//                 return code.split('-')[1];
//             } else {
//                 return code;
//             }
//
//         }
//
//
//         function getPartner() {
//             database.ref('partner').on('child_added', function (data) {
//                 $scope.$apply(function () {
//                     $scope.lstPartner.push(data.key)
//                 });
//             });
//         }
//
//         function setDataAll(phone, code) {
//
//             database.ref('employees/Tất cả/order/' + code + '/phone')
//                 .set(phone).then(function (value) {
//                 if (checkBlackList(phone)) {
//                     database.ref('employees/Tất cả/order/' + code).once('value').then(function (snapshot) {
//                         if (snapshot.val()) {
//                             database.ref('blackLst/Tất cả/order/' + code).set(snapshot.val());
//                         }
//                     })
//                 }
//                 if (show) {
//                     $mdToast.show(
//                         $mdToast.simple()
//                             .textContent('Tải file thành công')
//                             .position('top left')
//                             .hideDelay(3000)
//                     );
//                 }
//                 show = false;
//             }).catch(function (value) {
//                 if (show) {
//                     show = false;
//                     $mdToast.show({
//                         hideDelay: 3000,
//                         position: 'top left',
//                         template: '<md-toast><span style="color: red ">Tải file không thành công</span> </md-toast>'
//                     })
//                 }
//             });
//
//         }
//
//         function checkBlackList(phone) {
//             for (var i = 0; i < blackLst.length; i++) {
//                 if (phone === blackLst[i]) {
//                     return true;
//                 }
//             }
//         }
//
//         function convertString(value) {
//             value = value.split('/').join('&');
//             return value.split('.').join('+');
//         }
//
//         function convertStringPart(value) {
//             value = value.split('&').join('/');
//             return value.split('+').join('.');
//         }
//
//
//         function getBlackLst() {
//             database.ref('phoneBlack').on('child_added', function (data) {
//                 blackLst.push(data.key);
//             })
//         }
//
//         function updatePhone(ref, name, phone, code) {
//             database.ref(ref + name + '/order/' + code).once('value').then(function (snapshot) {
//                 if (snapshot.val()) {
//                     database.ref(ref + name + '/order/' + snapshot.key + '/phone')
//                         .set(phone).then(function (value) {
//                         if (checkBlackList(phone)) {
//                             database.ref('employees/' + name + '/order/' + code).once('value').then(function (snapshot) {
//                                 if (snapshot.val()) {
//                                     database.ref('blackLst/' + name + '/order/' + code).set(snapshot.val());
//                                 }
//                             })
//                         }
//                     })
//                 }
//             });
//         }
// function checlOderBlackList() {
//
// }

//
//         function creatRef(code) {
//             var ref = '';
//             if (!$scope.blackLst) {
//                 ref = 'employees/';
//             } else {
//                 ref = 'blackLst/';
//
//             }
//             if (removeLis) {
//                 removeLis.off();
//             }
//             if ($scope.locDay === 'all' && $scope.partner === all) {
//                 removeLis = database.ref(ref + code + '/order').limitToLast(maxDh);
//             }
//             if ($scope.locDay !== 'all' && $scope.partner === all) {
//                 var dateSearch = '';
//                 if ($scope.locDay === 'day') {
//                     dateSearch = moment($scope.dateSearch).format('DD / MM / YYYY');
//                 } else {
//                     dateSearch = moment($scope.dateSearch).format('MM / YYYY');
//                 }
//                 removeLis = database.ref(ref + code + '/order').limitToLast(maxDh).orderByChild($scope.locDay).equalTo(dateSearch);
//             }
//             if ($scope.locDay === 'all' && $scope.partner !== all) {
//                 removeLis = database.ref(ref + code + '/order').limitToLast(maxDh).orderByChild($scope.partner + 'date');
//             }
//             if ($scope.locDay !== 'all' && $scope.partner !== all) {
//                 var dateSearch = '';
//                 if ($scope.locDay === 'day') {
//                     dateSearch = moment($scope.dateSearch).format('DD / MM / YYYY');
//                 } else {
//                     dateSearch = moment($scope.dateSearch).format('MM / YYYY');
//                 }
//                 removeLis = database.ref(ref + code + '/order').limitToLast(maxDh).orderByChild($scope.partner + $scope.locDay).equalTo(dateSearch);
//             }
//         }
//
        getOrderByEmployee();

        function getDate() {
            let obj = {};
            if ($scope.partner !== all) {
                obj.partner = $scope.partner;
            }
            if ($scope.userSelect.name !== 'admin') {
                obj.name = $scope.userSelect.name;
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
                            created_at:order.created_at,
                            phone: order.phone,
                            nv: order.employee,
                            partner: order.partner
                        });
                    });
                    $scope.options.paging.count = $scope.data.length;
                });
            });
        }

//
//         function showDialogRemoveHD($event, remove) {
//             $scope.items = [1, 2, 3];
//             var parentEl = angular.element(document.body);
//             $mdDialog.show({
//                 parent: parentEl,
//                 targetEvent: $event,
//                 template:
//                 '<md-dialog aria-label="Xóa đơn hàng theo tháng">\n' +
//                 '    <md-dialog-content class="md-dialog-content">\n' +
//                 '        <h2 class="md-title ">Xóa Đơn hàng theo tháng</h2>\n' +
//                 '<div  class="md-dialog-content-body " ><p >Nhập tháng cần xóa</p></div>' +
//                 '   <md-datepicker style="margin-left: -16x!important;" md-mode="month" ng-model="dateRemove" md-placeholder="Nhập tháng"\n' +
//                 '                       md-date-locale="dateLocaleMonth"></md-datepicker>\n' +
//                 '    </md-dialog-content>\n' +
//                 '    <md-dialog-actions>\n' +
//                 '        <md-button ng-click="closeDialog()" class="md-primary">Hủy</md-button>\n' +
//                 '        <md-button  ng-disabled="!dateRemove" ng-click="removeOderMonth()" class="md-primary"> Xóa</md-button>\n' +
//                 '    </md-dialog-actions>\n' +
//                 '</md-dialog>',
//                 locals: {
//                     items: $scope.items
//                 },
//                 controller: DialogController
//             });
//
//             function DialogController($scope, $mdDialog, items) {
//                 $scope.dateRemove = null;
//                 $scope.closeDialog = function () {
//                     $mdDialog.hide();
//                 };
//                 $scope.removeOderMonth = function () {
//                     $mdDialog.hide();
//                     remove($scope.dateRemove);
//                 }
//             }
//         }
//
        $scope.openChangePass = function (ev) {
            showDialogChangePass(ev);
        };
//         $scope.closeDialog = function () {
//             $mdDialog.hide();
//         };
//         $scope.passOld = '';
//         $scope.passNew = '';
//         $scope.userPass = '';
//
//         $scope.changePass = function () {
//             if ($scope.pass === $scope.passOld) {
//                 if ($scope.userPass !== admin) {
//                     database.ref('nv/' + $scope.userPass + '/pass').set($scope.passNew).then(function (value) {
//                         $mdToast.show(
//                             $mdToast.simple()
//                                 .textContent('Đổi mật khẩu thành công')
//                                 .position('top left')
//                                 .hideDelay(3000)
//                         );
//                     });
//                 } else {
//                     database.ref('admin/pass').set($scope.passNew).then(function (value) {
//                         $mdToast.show(
//                             $mdToast.simple()
//                                 .textContent('Đổi mật khẩu thành công')
//                                 .position('top left')
//                                 .hideDelay(3000)
//                         );
//                     });
//                 }
//             }
//             else {
//                 $mdToast.show(
//                     $mdToast.simple()
//                         .textContent('Mật khẩu không chính xác')
//                         .position('top left')
//                         .hideDelay(3000)
//                 );
//             }
//         };
//
        function showDialogChangePass($event) {
            var parentEl = angular.element(document.body);
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
                    if ($scope.userPass.pass === $scope.passOld) {
                        $mdDialog.hide();
                        $scope.userPass.pass = $scope.passNew;
                        updatePass($scope.userPass, function (value) {
                            $mdToast.show(
                                $mdToast.simple()
                                    .textContent('Đổi mật khẩu thành công')
                                    .position('top left')
                                    .hideDelay(3000)
                            );
                        });
                    }
                    else {
                        $mdToast.show(
                            $mdToast.simple()
                                .textContent('Mật khẩu không chính xác')
                                .position('top left')
                                .hideDelay(3000)
                        );
                    }
                };

                $scope.closeDialog = function () {
                    $mdDialog.hide();
                };

            }


        }

        $scope.getNv();
    })
    .config(function ($mdDateLocaleProvider) {
        $mdDateLocaleProvider.months = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
        $mdDateLocaleProvider.shortMonths = ['Th 1', 'Th 2', 'Th 3', 'Th 4', 'Th 5', 'Th 6', 'Th 7', 'Th 8', 'Th 9', 'Th 10', 'Th 11', 'Th 12'];
        $mdDateLocaleProvider.days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
        $mdDateLocaleProvider.shortDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

    });

