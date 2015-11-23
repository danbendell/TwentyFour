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
        }
    }
}]);