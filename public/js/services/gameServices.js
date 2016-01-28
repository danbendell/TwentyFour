angular.module('GameService', []).factory('GameService', ['$http', '$q', function($http, $q) {
    return {
        getCards: function() {
            var def = $q.defer();
            $http.get('http://localhost:8080/api/cards')
                .success(function(res) {
                    def.resolve(res)
                })
                .error(function() {
                    def.reject("Failed to get cards");
                });
            return def.promise;
        },
        getCombinations: function() {
            var def = $q.defer();
            $http.get('http://localhost:8080/api/combinations')
                .success(function(res) {
                    def.resolve(res)
                })
                .error(function() {
                    def.reject("Failed to get combinations");
                });
            return def.promise;
        },
        getOptimalStartPosition: function(firstValue) {
            switch(firstValue) {
                case "1":
                    return 0;
                case "2":
                    return 455;
                case "3":
                    return 819;
                case "4":
                    return 1105;
                case "5":
                    return 1325;
                case "6":
                    return 1490;
                case "7":
                    return 1610;
                case "8":
                    return 1694;
                case "9":
                    return 1750;
                case "10":
                    return 1785;
                case "11":
                    return 1805;
                case "12":
                    return 1815;
                case "13":
                    return 1819;
                default :
                    return 0;
            }
        }
    }
}]);