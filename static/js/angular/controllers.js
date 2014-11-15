/**
 * Created by etayschur on 11/8/14.
 */

var mainController = angular.module('mainController' , []);
mainController.controller('MainController', ['$rootScope' , '$scope' ,'$location' ,'$http' , '$timeout' ,  function($rootScope , $scope , $location , $http , $timeout ){


    var restCallManager = new RestCallManager();
    $scope.currency = [];
    $scope.currency.from = 'USD';
    $scope.currency.to = 'EUR';
    $scope.restCallCounter = 0;
    console.log('this is init countdown');
    console.log($scope.countdown);
    $scope.timepercent = 5;
    $scope.bet = [];
    $scope.bet.active = false;
    $scope.stacked = [];
    $scope.stacked.push({
        value: 50,
        type: 'success'
    });

    $scope.stacked.push({
        value: 50,
        type: 'danger'
    });

    $scope.timerbar = [];

    $scope.timerbar.push({
        value: 0,
        type: 'primary'
    });







    /* Styles */
    $scope.scaleParam = 0.6;

    $scope.winningStyle ={
        "background":"green"
    }





    $scope.checkCurrency = function(){


        if($scope.bet.active){
            $timeout($scope.checkCurrency , 500);
        }

        data = {
            'from' : $scope.currency.from,
            'to' : $scope.currency.to
        };
        restCallManager.getCurrency(getCurrencyCallback , $http , data , 'currency_check' );
        $scope.restCallCounter++;
        console.log($scope.restCallCounter % 2);


        console.log($scope.scaleParam);


        function getCurrencyCallback (result , status , success){
            if($scope.currency.init == true){
                $scope.initRate = result.yahoo[0];
                $scope.currency.init = false;
                console.log('init rate');
                console.log($scope.initRate);
            }

            if(($scope.restCallCounter % 2) === 0 ){
                console.log($scope.winningStyle);

                $scope.scaleParam -=0.3;
                //$scope.winningStyle.transform = "scale("+$scope.scaleParam+")";

            }else{

                $scope.scaleParam +=0.3;
                //$scope.winningStyle.transform = "scale("+$scope.scaleParam+")";

            }

            console.log(result);

            if($scope.currency.rate){
                console.log("this is new rate");
                console.log($scope.currency.rate);
                $scope.oldRate = $scope.currency.rate;
                console.log("this is old rate");
                console.log($scope.oldRate);
            }
            $scope.currency.rate = result.yahoo[0];

            if($scope.initRate == result.yahoo[0]) {
                $scope.timerbar[0].type = 'primary';
                $scope.stacked[0].value = 50;
                $scope.stacked[1].value = 50;
                $scope.progressText = 'Even';
            }
            if($scope.initRate > result.yahoo[0]){
                console.log($scope.oldRate);
                console.log($scope.currency.rate);
                console.log("To is Winning");
                if($scope.oldRate !== $scope.currency.rate){
                    $scope.timerbar[0].type = 'success';
                    $scope.stacked[1].value += 10;
                    $scope.stacked[0].value -= 10;
                }

                $scope.progressText = 'To Is Winning ';
            }
            if($scope.initRate < $scope.currency.rate){
                $scope.progressText = 'From Is Winning ';
                if($scope.oldRate !== $scope.currency.rate){
                    $scope.timerbar[0].type = 'danger';
                    $scope.stacked[1].value += 10;
                    $scope.stacked[0].value -= 10;
                    $scope.stacked[0].value += 10;
                    $scope.stacked[1].value -= 10;
                }

            }

            $scope.currency.date = result.yahoo[1];
            $scope.currency.time = result.yahoo[2];



        }
    }





    $scope.startBet = function(){
        $scope.$broadcast('progressbar-timer');
        console.log('Starting The BET :) ');
        console.log($scope.countdown);
        $scope.$broadcast('timer-start');
        $scope.bet.active = true;
        $scope.currency.init = true;
        $scope.checkCurrency();

    }

    $scope.setCounter = function(seconds){
        console.log(seconds);
        $scope.countdown = seconds;
        console.log($scope.countdown);
    }

    $scope.$on('timer-tick', function (event, data){
        console.log('tick-tack');
        $scope.timerbar[0].value = ($scope.countdown - (data.millis / 1000)) / $scope.countdown * 100 ;
        console.log($scope.timerbar[0].value);
    });

    $scope.$on('timer-stopped', function (event, data){
        $scope.bet.active = false;
        console.log('Timer Stopped - data = ', data);
        if($scope.initRate >= $scope.currency.rate){
            $scope.progressText = 'You WON !!!';
        }else{
            $scope.progressText = 'You LOST !!!';
        }
    });










}]);
