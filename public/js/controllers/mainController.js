angular.module('MainController', []).controller('MainController', ['$scope', '$location', '$rootScope', 'SocketService', function($scope, $location, $rootScope, SocketService) {
    $scope.socket = SocketService.getSocket();
    $scope.gameRooms = [];
    $scope.openGameRooms = [];
    $scope.intervalTime = 0;

    $scope.HostGame = function() {
        var player = {
            id: '',
            name: $scope.username
        };
        $scope.socket.emit('createNewGame', player);
    };

    $scope.socket.on('gameRoomList', function(GameRooms) {
        $scope.$apply(function () {
            $scope.gameRooms = GameRooms;
            for(var i = 0; i < $scope.gameRooms.length; i++) {
                if($scope.gameRooms[i].status == 1) {
                    $scope.openGameRooms.push($scope.gameRooms[i]);
                }
            }
        });
    });

    $scope.JoinGame = function() {
        var player = {
            id: '',
            name: $scope.username
        };
        $scope.socket.emit('playerJoinGame', $scope.openGameRooms[0], player);
    };

    //var newCombination = '';
    //var numberOfStepsComplete = 0;
    //var currentAnswer;
    //var answerOne = null;
    //var answerTwo = null;
    //var thirdEquestion;
    //var separators = ['\\\+', '-', '\\*', '/'];
    //document.getElementById('file').onchange = function(){
    //
    //    var file = this.files[0];
    //    var newFile = '{"combinations":[ \n';
    //    var reader = new FileReader();
    //    reader.onload = function(progressEvent){
    //        // Entire file
    //        //console.log(this.result);
    //
    //        // By lines
    //
    //        var lines = this.result.split('\n');
    //        for(var line = 0; line < lines.length; line++){
    //            newCombination = '';
    //            newCombination += "{\n";
    //
    //            var values = lines[line].substr(0, lines[line].indexOf(":"));
    //            var valueArray = values.split(" ");
    //            valueArray = cleanUpArray(valueArray);
    //            for(var i = 0; i < valueArray.length; i++) {
    //                newCombination += '\t"' + (i + 1) + '":"' + valueArray[i] + '",\n';   //"1":"1",
    //            }
    //
    //            var solution = lines[line].substr(lines[line].indexOf(":") + 1, lines[line].length);
    //            solution = solution.replace(/ /g,'');
    //            if(solution.indexOf("nope") > -1) {
    //                newCombination += '\t"solution":"impossible"\n';
    //            } else {
    //                newCombination += '\t"solution":"possible",\n';
    //                newCombination += '\t"answer": [\n';
    //                newCombination += '\t\t{\n';
    //
    //                var firstEquation = solution.substring(solution.indexOf("(") + 1, solution.indexOf(")"));
    //                var secondEquation = solution.substring(solution.lastIndexOf("(") + 1, solution.lastIndexOf(")"));
    //
    //                var numberArray = firstEquation.split(new RegExp(separators.join('|'), 'g'));
    //                if(numberArray.length == 4) {
    //                    //(10*12/8+9)
    //                    firstEquation = "";
    //                    secondEquation = "";
    //                    solution = solution.replace("(", "");
    //                    solution = solution.replace(")", "");
    //                }
    //
    //                if((solution.indexOf("(") +  1 == solution.lastIndexOf("(") + 1)) {
    //                    secondEquation = "";
    //                }
    //
    //                if(firstEquation != "") {
    //                    writeOutBracketEquations(firstEquation);
    //                    var numberArray = firstEquation.split(new RegExp(separators.join('|'), 'g'));
    //                    if(numberArray.length == 3 && solution.substring(solution.indexOf(")") + 1, solution.length) != "") {
    //                        //(10-1-17)*12
    //                        var lastOpperand = solution.substring(solution.indexOf(")") + 1, solution.indexOf(")") + 2);
    //                        var lastNumber = solution.substring(solution.lastIndexOf(lastOpperand) + 1, solution.length);
    //                        newCombination += '\t\t\t"' + getStep() + '":"' + answerOne + ' ' + lastOpperand + ' ' + lastNumber + '" \n';
    //                    } else if (numberArray.length == 3) {
    //                        //12/(12/8-1)
    //                        var thirdEquestion = solution.substring(0, solution.indexOf("("));
    //                        numberArray = thirdEquestion.split(new RegExp(separators.join('|'), 'g'));
    //                        var opperandList = thirdEquestion.replace(/\d+/g, '');
    //                        var opperandArray = opperandList.split("");
    //                        newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + answerOne + '" \n';
    //                    }
    //                }
    //
    //                if (secondEquation != "") {
    //                    writeOutBracketEquations(secondEquation);
    //                    var lastOpperand = solution.substring(solution.indexOf(")") + 1, solution.lastIndexOf("("));
    //                    newCombination += '\t\t\t"' + getStep() + '":"' + answerOne + ' ' + lastOpperand + ' ' + answerTwo + '" \n';
    //                }
    //
    //                if(numberOfStepsComplete <= 1) {
    //                    //One or no brackets
    //                    if(numberOfStepsComplete == 1) {
    //                        var beforeBracket = false;
    //                        thirdEquestion = '';
    //                        thirdEquestion = solution.substring(solution.indexOf(")") + 1, solution.length);
    //                        thirdEquestion = thirdEquestion.replace(/ /g, '');
    //                        thirdEquestion = thirdEquestion.replace(/\n/g, '');
    //                        if(thirdEquestion.length <= 1) thirdEquestion = "";
    //                        if(thirdEquestion == "") {
    //                            thirdEquestion = solution.substring(0, solution.indexOf("("));
    //                            beforeBracket = true;
    //                        }
    //                        numberArray = thirdEquestion.split(new RegExp(separators.join('|'), 'g'));
    //
    //                        for(var i = 0; i < numberArray.length; i++) {
    //                            if(numberArray[i] == "") numberArray.splice(i, 1);
    //                        }
    //                        var opperandList = thirdEquestion.replace(/\d+/g, '');
    //                        var opperandArray = opperandList.split("");
    //
    //                        if((opperandArray[1] == '*' || opperandArray[1] == '/') && (opperandArray[0] != '*' && opperandArray[0] != '/')) {
    //                            //8*2+(5-3)
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[1] + ' ' + numberArray[1] + '", \n';
    //                            currentAnswer = calculate(numberArray[0], numberArray[1], opperandArray[1]);
    //                            answerTwo = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerOne + ' ' + opperandArray[0] + ' ' + answerTwo + '" \n';
    //                        } else if((opperandArray[1] == '*' || opperandArray[1] == '/') && (opperandArray[0] == '*' || opperandArray[0] == '/') && beforeBracket) {
    //                            //8*2*(5-3)
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + numberArray[1] + '", \n';
    //                            currentAnswer = calculate(numberArray[0], numberArray[1], opperandArray[0]);
    //                            answerTwo = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerTwo + ' ' + opperandArray[1] + ' ' + answerOne + '" \n';
    //                        } else {
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerOne + ' ' + opperandArray[0] + ' ' + numberArray[0] + '", \n';
    //                            currentAnswer = calculate(answerOne, numberArray[0], opperandArray[0]);
    //                            answerTwo = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerTwo + ' ' + opperandArray[1] + ' ' + numberArray[1] + '" \n';
    //                        }
    //
    //                    } else {
    //                        //(1+1+1+1)
    //                        //1+1+1+1
    //                        thirdEquestion = solution;
    //                        numberArray = thirdEquestion.split(new RegExp(separators.join('|'), 'g'));
    //
    //                        var opperandList = thirdEquestion.replace(/\d+/g, '');
    //                        var opperandArray = opperandList.split("");
    //
    //                        if((opperandArray[0] == "*" || opperandArray[0] == "/") && (opperandArray[2] == "*" || opperandArray[2] == "/") && (opperandArray[1] != "*" || opperandArray[1] != "/")) {
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + numberArray[1] + '", \n';
    //                            currentAnswer = calculate(numberArray[0], numberArray[1], opperandArray[0]);
    //                            answerOne = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[2] + ' ' + opperandArray[2] + ' ' + numberArray[3] + '", \n';
    //                            currentAnswer = calculate(numberArray[2], numberArray[3], opperandArray[2]);
    //                            answerTwo = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerOne + ' ' + opperandArray[1] + ' ' + answerTwo + '" \n';
    //                        } else {
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + numberArray[1] + '", \n';
    //                            currentAnswer = calculate(numberArray[0], numberArray[1], opperandArray[0]);
    //                            answerOne = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerOne + ' ' + opperandArray[1] + ' ' + numberArray[2] + '", \n';
    //                            currentAnswer = calculate(answerOne, numberArray[2], opperandArray[1]);
    //                            answerTwo = currentAnswer;
    //
    //                            newCombination += '\t\t\t"' + getStep() + '":"' + answerTwo + ' ' + opperandArray[2] + ' ' + numberArray[3] + '" \n';
    //                        }
    //                    }
    //
    //                }
    //                newCombination += "\t\t}\n";
    //                newCombination += "\t]\n";
    //            }
    //            newCombination += "},\n";
    //
    //            console.log(newCombination);
    //            newFile += newCombination;
    //            numberOfStepsComplete = 0;
    //            answerOne = null;
    //            answerTwo = null;
    //            thirdEquestion = '';
    //        }
    //    };
    //    console.log(newCombination);
    //    reader.readAsText(file);
    //
    //};
    //
    //var cleanUpArray = function(array) {
    //  var newArray = [];
    //    for(var i = 0; i < array.length; i++) {
    //        if(array[i] != "") {
    //            newArray.push(array[i]);
    //        }
    //    }
    //    return newArray;
    //
    //};
    //
    //var writeOutBracketEquations = function(equation) {
    //    var numberArray = equation.split(new RegExp(separators.join('|'), 'g'));
    //
    //    var opperandList = equation.replace(/\d+/g, '');
    //    var opperandArray = opperandList.split("");
    //
    //    if(numberArray.length > 2) {
    //        //(13-13/13)
    //        if((opperandArray[1] == '*' || opperandArray[1] == '/') && (opperandArray[0] != '*' || opperandArray[0] != '/')) {
    //            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[1] + ' ' + opperandArray[1] + ' ' + numberArray[2] + '", \n';
    //            currentAnswer = calculate(numberArray[1], numberArray[2], opperandArray[1]);
    //            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + currentAnswer + '", \n';
    //            currentAnswer = calculate(numberArray[0], currentAnswer, opperandArray[0]);
    //            answerOne = currentAnswer;
    //        } else {
    //            newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + numberArray[1] + '", \n';
    //            currentAnswer = calculate(numberArray[0], numberArray[1], opperandArray[0]);
    //            newCombination += '\t\t\t"' + getStep() + '":"' + currentAnswer + ' ' + opperandArray[1] + ' ' + numberArray[2] + '", \n';
    //            currentAnswer = calculate(currentAnswer, numberArray[2], opperandArray[1]);
    //            answerOne = currentAnswer;
    //        }
    //
    //    } else {
    //        newCombination += '\t\t\t"' + getStep() + '":"' + numberArray[0] + ' ' + opperandArray[0] + ' ' + numberArray[1] + '", \n';
    //        currentAnswer = calculate(numberArray[0], numberArray[1], opperandArray[0]);
    //        if(numberOfStepsComplete == 1) answerOne = currentAnswer;
    //        if(numberOfStepsComplete == 2) answerTwo = currentAnswer;
    //    }
    //};
    //
    //var getStep = function() {
    //    var currentStep = '';
    //
    //    if(numberOfStepsComplete == 0) currentStep = "stepOne";
    //    else if(numberOfStepsComplete == 1) currentStep = "stepTwo";
    //    else if(numberOfStepsComplete == 2) currentStep = "stepThree";
    //
    //    numberOfStepsComplete++;
    //    return currentStep;
    //};
    //
    // var calculate = function(value1, value2, opperand) {
    //    var answer;
    //    if(opperand == "+") answer = parseFloat(value1) + parseFloat(value2);
    //    else if(opperand == "-") answer = parseFloat(value1) - parseFloat(value2);
    //    else if(opperand == "*") answer = parseFloat(value1) * parseFloat(value2);
    //    else if(opperand == "/") answer = parseFloat(value1) / parseFloat(value2);
    //    return answer;
    //}


}]);