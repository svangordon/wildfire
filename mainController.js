angular.module('app')
  .controller('mainController', ['$scope', '$interval', 'landFactory', function(scope, interval, landFactory) {
    
    scope.map = landFactory.map;

    scope.brush = null;

    scope.setBrush = function (str) {
        scope.brush = str;
    }    

    scope.tileClick = function (index) {
        var brush = scope.brush;
        var tile = scope.map.contents[index];
        if (brush) {
            if (brush === 'fire') {
                tile.fireStatus = 2;
            } else {
                tile.fireStatus = 0;
                tile.flammable = false;
            }
        }
    }

    var flames = interval(function() {
        scope.map.burnEvent.call(scope.map)
    }, 500);

  }])
