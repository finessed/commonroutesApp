angular.module('app.travel', ['pascalprecht.translate'])

.controller('TravelCtrl', function($scope, $stateParams, $http, $ionicModal, $ionicPopup, $filter) {
    if(localStorage.getItem('c_token')){// adding token to the headers
        $http.defaults.headers.common['X-Access-Token'] = localStorage.getItem('c_token');
    }
    $scope.storageusername=localStorage.getItem("c_username");
    console.log($stateParams.travelId);
    $scope.travels= JSON.parse(localStorage.getItem('c_travels'));
    $scope.travel = $filter('filter')($scope.travels, $stateParams.travelId, true)[0];

    /*$http.get(urlapi + 'travels/comment/'+$stateParams.travelId)
        .success(function(data, status, headers,config){
            console.log(data); // for browser console
            $scope.comments = data; // for UI
        })
        .error(function(data, status, headers,config){
            console.log('data error');
        })
        .then(function(result){
            comments = result.data;
    });*/

    $scope.deleteTravel = function(){

       var confirmPopup = $ionicPopup.confirm({
         title: 'Deleting publication',
         template: 'Are you sure you want to delete <b>'+ $scope.travel.title+'</b>?'
       });
       confirmPopup.then(function(res) {
       if(res) {
         console.log('You are sure');
         console.log("delete travel: " + $stateParams.travelId);
         $http({
             url: urlapi + 'travels/' + $stateParams.travelId,
             method: "DELETE"
         })
         .then(function(response) {
                 console.log(response);
                 $scope.travels=response.data;
                 localStorage.setItem('c_travels', JSON.stringify($scope.travels));
                 localStorage.setItem('c_travelsLastDate', JSON.stringify(new Date()));

         },
         function(response) { // optional
                 // failed
         });
       } else {
         console.log('You are not sure');
       }
     });


    };
    $scope.joinTravel = function(){
        $scope.newjoin={
            //travelId: $stateParams.travelId,
            /*joinedUserId: localStorage.getItem("c_userid"),
            joinedUsername: localStorage.getItem("c_username"),
            joinedAvatar: localStorage.getItem("c_avatar")*/
        };
        $http({
            url: urlapi + 'travels/'+ $stateParams.travelId+'/join',
            method: "POST",
            data: $scope.newjoin
        })
        .then(function(response) {
                // success
                console.log("response: ");
                console.log(response);

                $scope.travels=response.data;
                localStorage.setItem('c_travels', JSON.stringify($scope.travels));
                localStorage.setItem('c_travelsLastDate', JSON.stringify(new Date()));
                $scope.travel = $filter('filter')($scope.travels, $stateParams.travelId, true)[0];

        },
        function(response) { // optional
                // failed
        });
    };
    $scope.unjoinTravel = function(){
        console.log("unjoin");
        $scope.unjoin={
            travelId: $stateParams.travelId,
            /*joinedUserId: localStorage.getItem("c_userid"),
            joinedUsername: localStorage.getItem("c_username"),
            joinedAvatar: localStorage.getItem("c_avatar")*/
        };
        $http({
            url: urlapi + 'travels/'+ $stateParams.travelId+'/unjoin',
            method: "POST",
            data: $scope.unjoin
        })
        .then(function(response) {
                // success
                console.log("response: ");
                console.log(response);

                $scope.travels=response.data;
                localStorage.setItem('c_travels', JSON.stringify($scope.travels));
                localStorage.setItem('c_travelsLastDate', JSON.stringify(new Date()));
                $scope.travel = $filter('filter')($scope.travels, $stateParams.travelId, true)[0];

        },
        function(response) { // optional
                // failed
        });
    };

    /* adding comment */
    $scope.doingNewComment=false;
    $scope.newComment={};

    $scope.showNewComment = function() {
      $scope.doingNewComment=true;
    };
    $scope.closeNewComment = function() {
        $scope.doingNewComment=false;
    };
    $scope.doNewComment = function() {
        /*$scope.newComment.commentUserId=localStorage.getItem("c_userid");
        $scope.newComment.commentUsername=localStorage.getItem("c_username");
        $scope.newComment.commentAvatar=localStorage.getItem("c_avatar");*/
console.log($scope.newComment);
        $http({
          url: urlapi + 'travels/'+ $stateParams.travelId+'/comment',
          method: "POST",
          data: $scope.newComment
        })
        .then(function(response) {
              // success
              console.log("newComment added to server: " + response);
              console.log(response);
              $scope.travels=response.data;
              localStorage.setItem('c_travels', JSON.stringify($scope.travels));
              localStorage.setItem('c_travelsLastDate', JSON.stringify(new Date()));
              $scope.travel = $filter('filter')($scope.travels, $stateParams.travelId, true)[0];

              if(response.data.success==false){

                  $ionicLoading.show({ template: 'failed to generate new asking package', noBackdrop: true, duration: 2000 });
              }
        },
        function(response) { // optional
              // failed
        });
        $scope.closeNewComment();
    };
    console.log("a");
    console.log($scope.storageusername);
    console.log($scope.travel.owner);


    $scope.arrayObjectIndexOf = function(myArray, searchTerm, property) {
      //console.log(myArray+", "+searchTerm+", "+property);
        if(myArray)
        {
            for(var i = 0, len = myArray.length; i < len; i++) {
                if (myArray[i][property] === searchTerm){
                    //console.log("i: " + i);
                    return i;
                }
            }
        }
        //console.log("i: -1");
        return -1;
    };
});