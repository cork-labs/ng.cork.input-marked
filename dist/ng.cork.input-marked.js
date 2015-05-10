/**
 * ng.cork.input-marked - v0.0.6 - 2015-05-11
 * https://github.com/cork-labs/ng.cork.input-marked
 *
 * Copyright (c) 2015 Cork Labs <http://cork-labs.org>
 * License: MIT <http://cork-labs.mit-license.org/2015>
 */
angular.module('ng.cork.input-marked.templates', []).run(['$templateCache', function($templateCache) {
$templateCache.put("lib/ng.cork.input-marked/inputMarked.tpl.html",
"<div class=\"cork-input-marked cork-im-mode-{{mode}}\" ng-class=\"{'cork-is-disabled': disabled}\"><div ng-show=\"mode === 'edit' || mode === 'split'\" class=\"cork-im-panel cork-im-panel-edit\"><textarea class=form-control ng-model=modelValue placeholder={{placeholder}} cork-ui-textarea-auto-resize></textarea><div class=cork-im-toolbar><button tab-index=0 class=\"cork-im-toolbar-btn cork-im-done\" ng-show=\"hasPreview && (mode === 'edit' || mode === 'split')\" class=pull-right ng-click=done()><i class=\"cork-icon fa fa-check\"></i> <span class=cork-icon-text>done</span></button> <button tab-index=0 class=\"cork-im-toolbar-btn cork-im-split\" ng-show=\"hasSplit && mode === 'edit'\" class=pull-right ng-click=split()><i class=\"cork-icon fa fa-eye\"></i> <span class=cork-icon-text>preview</span></button></div></div><div ng-show=\"mode === 'preview' || mode === 'split'\" class=\"cork-im-panel cork-im-panel-preview\" ng-click=\"mode === 'preview' ? edit() : noop()\"><div class=cork-im-toolbar><button tab-index=0 class=\"cork-im-toolbar-btn cork-im-edit\" ng-show=\"!disabled && hasEdit && mode === 'preview'\" class=pull-right ng-click=edit()><i class=\"cork-icon fa fa-pencil\"></i> <span class=cork-icon-text>edit</span></button> <button tab-index=0 class=\"cork-im-toolbar-btn edit\" ng-show=\"!disabled && hasEdit && mode === 'split'\" class=pull-right ng-click=edit()><i class=\"cork-icon fa fa-times\"></i> <span class=cork-icon-text>close</span></button></div><div class=cork-im-markdown><div marked=placeholder ng-if=!modelValue></div><div marked=modelValue></div></div></div></div>");
}]);

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
