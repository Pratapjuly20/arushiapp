var app = angular.module("firstapp", []);
app.factory('todoservice', function($http){
    var todos = {};
    todos.getTodos = function(){
        return $http.get('/api/todos');
    };
    return todos;
});

app.controller("maincontroller", function($scope, $http, todoservice){
    $scope.formdata = {};
    todoservice.getTodos().success(function(data){
        $scope.todos = data;
    }).error(function(data){
        console.log('Error: ' + data);
    });






    $scope.todos = todoservice;
    $scope.paginate = {};
    var totItems = todoservice.totItems;
    console.log(todoservice);
    var pageItems = 5;
    if(totItems % pageItems == 0){
        var pages = totItems / pageItems;
    } else {
        var pages = (totItems / pageItems) + 1;
    }
    var firstPage = 1;
    var lastPage = pages;
    var countArr = [];
    for(var i = 0; i < pages; i++){
        countArr.push(i+1);
    }
    $scope.paginate.pages = pages;
    $scope.paginate.count = countArr;
    console.log($scope.paginate);

    $scope.createtodo = function(){
        console.log($scope.formdata);
        $http.post('/api/todos', $scope.formdata).success(function(data){
            $scope.formdata = {};
            $scope.todos.data = data;
            console.log(data);
        }).error(function(data){
            console.log('Error:' + data);
        });
    };

    $scope.deletetodo = function(id){
        $http.post('/api/todos/' + id).success(function(data){
            console.log(data);
            $scope.todos.data = data;
        }).error(function(data){
            console.log('Error:' + data);
        });
    };
});