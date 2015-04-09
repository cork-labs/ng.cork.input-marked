(function (angular) {
    'use strict';

    var module = angular.module('ng.cork.input-marked', [
        'hc.marked',
        'ng.cork.ui.textarea-auto-resize',
        'ng.cork.input-marked.templates'
    ]);

    /**
     * @ngdoc directive
     * @name ng.cork.input-marked.corkInputMarked
     *
     * @description
     * Provides a markup textarea field with 3 modes: preview, edit and split editing modes.
     *
     * You need
     *
     * @scope
     * @restrict A
     * @requires ngModel
     *
     * @param {boolean=} corkDisabled Optional expression to enable/disable the field.
     * @param {string=} corkPlaceholder Optional string to add as a placeholder
     * @param {array=} corkModes Array of allowed modes. Defaults to `['preview', 'edit' ,'split']`
     */
    module.directive('corkInputMarked', [
        '$rootScope',
        '$timeout',
        function corkInputMarked($rootScope, $timeout) {

            return {
                restrict: 'A',
                templateUrl: 'lib/ng.cork.input-marked/inputMarked.tpl.html',
                replace: 'element',
                require: 'ngModel',
                scope: {
                    modelValue: '=ngModel',
                    disabled: '=corkDisabled',
                    placeholder: '=corkPlaceholder',
                    modes: '=corkModes'
                },
                link: function ($scope, $element) {

                    var input = $element.find('textarea')[0];

                    var modes = [];

                    $scope.mode = 'preview';

                    $scope.edit = function () {
                        if (!$scope.disabled) {
                            $scope.mode = 'edit';
                            $timeout(function () {
                                input.focus();
                            });
                        }
                    };

                    $scope.split = function () {
                        if (!$scope.disabled) {
                            $scope.mode = 'split';
                        }
                    };

                    $scope.done = function () {
                        $scope.mode = 'preview';
                    };

                    $scope.$watch('modes', function (val) {
                        if (!angular.isArray(val) || !val.length) {
                            val = ['preview', 'edit', 'split'];
                        }
                        modes = val;
                        $scope.hasEdit = val.indexOf('edit') !== -1;
                        $scope.hasPreview = val.indexOf('preview') !== -1;
                        $scope.hasSplit = val.indexOf('split') !== -1;
                        if (val.indexOf($scope.mode) === -1) {
                            $scope.mode = val[0];
                        }
                    }, true);

                    $scope.$watch('disabled', function (val) {
                        if (val && $scope.mode !== 'preview') {
                            $scope.done();
                        }
                    });
                }
            };
        }
    ]);

})(angular);
