'use strict';

/**
 * Photo browser controller
 */
angular
    .module('photoFrameAppControllers')
    .controller('BrowserController',
        ['$scope', '$window', 'PlexPlaylist', function ($scope, $window, PlexPlaylist) {
            var SETTINGS_KEY = 'slideshowSettings';

            $scope.cfg = $window.Config;
            $scope.cfg.slideshow = $.cookie(SETTINGS_KEY) ? JSON.parse($.cookie(SETTINGS_KEY)) : $window.Config.slideshow;

            /**
             * Saves slideshow settings (time, randomization) to the cookie
             */
            $scope.saveSlideshowSettings = function() {
                $.cookie(SETTINGS_KEY, JSON.stringify($scope.cfg.slideshow));
            };

            PlexPlaylist.getPlaylists().then(function(playlists) {
                $scope.playlists = playlists;
            });
        }]);
