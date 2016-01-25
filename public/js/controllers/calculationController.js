angular.module('CalculationController', []).controller('CalculationController', ['$scope', 'SocketService', function($scope, SocketService) {
    $scope.numbersDisabled = false;
    $scope.operandsDisabled = true;
    $scope.calculationDisabled = true;
    $scope.undoDisabled = true;
    $scope.passDisabled = false;

    $scope.calculationBox = '';
    $scope.calcBoxData = [];
    $scope.currentValues = [];
    $scope.oldCards = [];

    $scope.previousState = [];



    var interval = setInterval(function() {
        if($scope.currentCards != $scope.oldCards) {
            $scope.oldCards = $scope.currentCards;
            $scope.$apply(function() {
                $scope.currentValues = FillButtonValues();
                $scope.previousState = FillButtonValues();
            });
        }
    }, 150);

    $scope.AddValueToCalculation = function(value) {
        $scope.undoDisabled = false;
        if(isOperand(value)) EnableNumbers();
        else EnableOperands(value);
        $scope.calcBoxData.push(value);
        $scope.calculationBox += value;
        if($scope.calcBoxData.length >= 3) DisableNumbersAndOperands();
    };

    $scope.CalculateEquation = function() {
        var result;
        var firstNumber = parseFloat($scope.calcBoxData[0]);
        var operand = $scope.calcBoxData[1];
        var secondNumber = parseFloat($scope.calcBoxData[2]);
        result = ApplyOperand(firstNumber, operand, secondNumber);

        $scope.currentValues.splice(PositionMatchingValue(firstNumber), 1);
        $scope.currentValues.splice(PositionMatchingValue(secondNumber), 1);
        $scope.currentValues.push(dataAttributes(result, false));

        if(result == 24 && $scope.currentValues.length == 1) {
            $scope.socket.emit('equationSolved', SocketService.getGameRoomId());
            console.log("Congrats!!");
        }
        if($scope.currentValues.length == 1) DisableNumbersAndOperands();
        $scope.calcBoxData = [];
        $scope.calculationBox = "";
        $scope.previousState = $scope.currentValues.slice(0);
        $scope.undoDisabled = true;
        EnableNumbers();
    };

    $scope.ResetEquation = function() {
        $scope.currentValues = FillButtonValues();
        $scope.previousState = FillButtonValues();

        $scope.calcBoxData = [];
        $scope.calculationBox = "";
        EnableNumbers();
        $scope.undoDisabled = true;
    };

    $scope.UndoAction = function() {
        $scope.currentValues.forEach(function(value) {
            value.disabled = false;
        });

        EnableNumbers();
        $scope.calcBoxData = [];
        $scope.calculationBox = "";
    };

    $scope.$on("startNextRound", function(event, data) {
        $scope.passDisabled = false;
    });

    $scope.Pass = function() {
        $scope.passDisabled = true;
        $scope.socket.emit('pass', SocketService.getGameRoomId());
    };

    function isOperand(value) {
        if(value == "-" || value == "+" || value == "*" || value == "/") return true;
        return false;
    }

    function DisableNumbersAndOperands() {
        $scope.numbersDisabled = true;
        $scope.operandsDisabled = true;
        $scope.calculationDisabled = false;
    }

    function EnableNumbers() {
        $scope.numbersDisabled = false;
        $scope.operandsDisabled = true;
        $scope.calculationDisabled = true;
    }

    function EnableOperands(value) {
        var disablePosition = PositionMatchingValue(value);
        $scope.currentValues[disablePosition].disabled = true;
        $scope.operandsDisabled = false;
        $scope.numbersDisabled = true;
        $scope.calculationDisabled = true;
    }

    function PositionMatchingValue(value) {
        for(var i = 0; i < $scope.currentValues.length; i++) {
            if($scope.currentValues[i].number == value) {
                return i;
            }
        }
    }

    function ApplyOperand(firstNumber, operand, secondNumber) {
        if(operand == "-") return firstNumber - secondNumber;
        if(operand == "+") return firstNumber + secondNumber;
        if(operand == "*") return firstNumber * secondNumber;
        if(operand == "/") return firstNumber / secondNumber;
    }

    function FillButtonValues() {
        var values = [];
        for (var i = 0; i < $scope.currentCards.length; i++) {
            values.push(dataAttributes($scope.currentCards[i].numericValue, false));
        }
        return values;
    }

    function dataAttributes(number, disabled) {
        return {
            number: number,
            disabled: disabled
        };
    }
}]);