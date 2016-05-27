'use strict';

angular
    .module('photoFrameAppControllers')
    .controller('SlideshowController', [
        '$scope',
        '$interval',
        '$location',
        '$rootScope',
        '$routeParams',
        '$window',
        'PlexPlaylist',
        function ($scope,
                  $interval,
                  $location,
                  $rootScope,
                  $routeParams,
                  $window,
                  PlexPlaylist) {

            /**
             * Photo rotator object - rotates photos from the list
             * @param scope - scope to which rotator will be applied
             * @param photosObject - photos object, see PlexPlaylistService#mapSinglePlaylistToJson()
             * @param isShuffled - true to shuffle the list
             * @returns {{changePhoto: changePhoto}} - rotator object which has changePhoto method
             * @constructor
             */
            function PhotoRotator(scope, photosObject, isShuffled) {
                var photosList = [];

                var calculateDimensions = function(photo) {
                    var width = $window.innerHeight * photo.aspectRatio,
                        height = $window.innerHeight;
                    if(width > $window.innerWidth) {
                        width = $window.innerWidth;
                        height = width / photo.aspectRatio;
                    }
                    return {
                        width: width,
                        height: height
                    }
                };

                return {
                    changePhoto: function() {
                        if(photosList.length == 0) {
                            photosList = photosObject.photos.copy();
                            if(isShuffled) {
                                photosList.shuffle()
                            }
                        }
                        var photo = photosList.shift();
                        var dimensions = calculateDimensions(photo);
                        scope.imageSrc = photo.url;
                        scope.imageWidth = dimensions.width;
                        scope.imageHeight = dimensions.height;
                    }
                };
            }

            $scope.cfg = window.Config;
            $scope.imageSrc = '';

            PlexPlaylist.getPhotos($routeParams.playlistId).then(function (response) {
                var photoRotator = new PhotoRotator($scope, response, $scope.cfg.slideshow.shuffle);
                photoRotator.changePhoto();
                $interval(photoRotator.changePhoto, $scope.cfg.slideshow.time * 1000);
            });
            // TODO use https://code.angularjs.org/1.5.0-rc.0/docs/api/ngAnimate/directive/ngAnimateSwap
            // http://angularjs.blogspot.co.uk/2015/11/angularjs-15-beta2-and-14-releases.html
        }]);