(function () {
    'use strict';
    var myApp = angular.module('ies');
    myApp.controller('userCtrl', userCtrl);
    userCtrl.$inject = ['$scope', '$rootScope', '$state', '$window', '$filter', '$timeout', 'userServices', 'bootstrapError'];
    function userCtrl($scope, $rootScope, $state, $window, $filter, $timeout, userServices, bootstrapError) {
        $scope.Math = window.Math;
        $scope.page = {};
        $scope.page.currentPage = 0;
        $scope.page.pageSize = 5;
        $scope.page.searchBox = '';
        $scope.hideErrors = function (id) {
            $scope.incharge = {};
            bootstrapError.hideErrors(id);
        }
        $scope.closeModal = function (model, form) {
            $scope.hideErrors(form);
            $('#' + model).modal('hide');
        }
        function getAlluser() {
            userServices.getuserPepole(function (err, res) {
                if (!err) {
                    $scope.users = res.sort(function (a, b) {
                        return (a.employeeId > b.employeeId) ? 1 : ((b.employeeId > a.employeeId) ? -1 : 0);
                    });

                }
            });
        }
        getAlluser();
        $scope.getData = function () {
            var filterData = $filter('filter')($scope.users, $scope.page.q);
            return filterData
        }
        $scope.numberOfPages = function () {
            var data = $scope.getData();
            return Math.ceil(data.length / $scope.page.pageSize);
        }
        $scope.$watch('page.searchBox', function (newValue, oldValue) {
            if (oldValue != newValue) {
                $scope.page.currentPage = 0;
            }
        }, true);

        $scope.nextPage = function () {
            $scope.page.currentPage = $scope.page.currentPage + 1;
        }
        $scope.previousPage = function () {
            $scope.page.currentPage = $scope.page.currentPage - 1;
        }
        $scope.lastPage = function () {
            $scope.page.currentPage = Math.ceil($scope.getData().length / $scope.page.pageSize) - 1;
        }
        $scope.firstPage = function () {
            $scope.page.currentPage = 0;
        }

        $scope.add = function () {
            var form = document.getElementById('adduser');
            var check = form.checkValidity();
            if (check === true) {
                $scope.incharge.employeeId = ($scope.incharge.employeeId).toUpperCase();
                $scope.incharge.name = ($scope.incharge.name).toUpperCase();
                $scope.incharge.email = ($scope.incharge.email).toLowerCase();
                userServices.adduser($scope.incharge, function (err, res) {
                    if (!err) {
                        $("html").stop().animate({ scrollTop: 0 }, 200);
                        $scope.success = true;
                        $scope.successMsg = "Successfully added the user infomation";
                        $scope.users.push($scope.incharge);
                        $('#add_user').modal("hide");
                        $timeout(function () {
                            $scope.success = false;
                            $scope.successMsg = "";
                        }, 2000);
                    }
                    else {
                        $("html").stop().animate({ scrollTop: 0 }, 200);
                        $scope.error = true;
                        $scope.errorMsg = (err.data && err.data.message) ? err.data.message : err.statusText;
                        $timeout(function () {
                            $scope.error = false;
                            $scope.errorMsg = "";
                        }, 2000);
                    }
                });
            }
            else {
                bootstrapError.showErrors('adduser')
            }
        };

        $scope.del=function(userId){
            userServices.remove(userId,function(err,res){
                console.log(res)
                getAlluser();
            })
        };
    
        // function select(employeeId){
        //     for(let i=0; i<$scope.users.length; i++){
        //         if($scope.user[i].employeeId==employeeId){
        //             return i;
        //         }
        //     }
        //     return -1;
        // };
    
        $scope.edit=function(employee){
            $scope.incharge = employee
            $("#add_user").modal({
                backdrop: 'static',
                keyboard: false
            });
            
        };
    
        $scope.save=function(){
            var index = select($scope.employeeId);
            $scope.users[index].name=$scope.name;
            $scope.users[index].email=$scope.email;
            $scope.users[index].mobileNo=$scope.mobileNo;
            $scope.employeeId='';
            $scope.name='';
            $scope.email='';
            $scope.mobileNo='';
        };
    }
    myApp.service('userServices', userServices);
    userServices.$inject = ['$http'];
    function userServices($http) {
        this.getuserPepole = function (callback) {
            var request = {
                url: "user/getuserDetails",
                method: 'GET',
                timeout: 2 * 60 * 1000,
                headers: { 'Content-type': 'application/json' }
            };
            $http(request).then(function (response) {
                callback(null, response.data);
            }, function (error) {
                callback(error, null);
            });
        };
        this.adduser = function (details, callback) {
            var request = {
                url: "user/adduser",
                method: 'POST',
                data: details,
                timeout: 2 * 60 * 1000,
                headers: { 'Content-type': 'application/json' }
            };
            $http(request).then(function (response) {
                callback(null, response.data);
            }, function (error) {
                callback(error, null);
            });
        };
        this.update = function (details, callback) {
            var request = {
                url: "user/:id",
                method: 'PUT',
                data: details,
                timeout: 2 * 60 * 1000,
                headers: { 'Content-type': 'application/json' }
            };
            $http(request).then(function (response) {
                callback(null, response.data);
            }, function (error) {
                callback(error, null);
            });
        };
        this.remove = function (id, callback) {
            var request = {
                url: "user/"+id,
                method: 'DELETE',
                timeout: 2 * 60 * 1000,
                headers: { 'Content-type': 'application/json' }
            };
            $http(request).then(function (response) {
                callback(null, response.data);
            }, function (error) {
                callback(error, null);
            });
        };

    }
})();