/**
 * ng.cork.field-marked - v0.0.1 - 2015-04-08
 * https://github.com/cork-labs/ng.cork.field-marked
 *
 * Copyright (c) 2015 Cork Labs <http://cork-labs.org>
 * License: MIT <http://cork-labs.mit-license.org/2015>
 */
angular.module('ng.cork.field-marked.templates', []).run(['$templateCache', function($templateCache) {
$templateCache.put("lib/ng.cork.field-marked/fieldMarked.tpl.html",
"<div class=\"cork-field-marked {{mode}}\" ng-class=\"{'is-disabled': disabled}\"><div ng-show=\"mode === 'edit' || mode === 'split'\" class=\"markdown-mode markdown-edit\"><textarea class=form-control ng-model=modelValue placeholder={{placeholder}} cork-ui-textarea-auto-resize></textarea><div class=markdown-toolbar><button tab-index=0 class=\"toolbar-button done\" ng-show=\"hasPreview && (mode === 'edit' || mode === 'split')\" class=pull-right ng-click=done()><i class=\"icon fa fa-check\"></i> <span class=text>done</span></button> <button tab-index=0 class=\"toolbar-button split\" ng-show=\"hasSplit && mode === 'edit'\" class=pull-right ng-click=split()><i class=\"icon fa fa-eye\"></i> <span class=text>preview</span></button></div></div><div ng-show=\"mode === 'preview' || mode === 'split'\" class=\"markdown-mode markdown-preview\" ng-click=\"mode === 'preview' ? edit() : noop()\"><div class=markdown-toolbar><button tab-index=0 class=\"toolbar-button edit\" ng-show=\"!disabled && hasEdit && mode === 'preview'\" class=pull-right ng-click=edit()><i class=\"icon fa fa-pencil\"></i> <span class=text>edit</span></button> <button tab-index=0 class=\"toolbar-button edit\" ng-show=\"!disabled && hasEdit && mode === 'split'\" class=pull-right ng-click=edit()><i class=\"icon fa fa-times\"></i> <span class=text>close</span></button></div><div marked=placeholder ng-if=!modelValue></div><div marked=modelValue></div></div></div>");
}]);

(function (angular) {
    'use strict';

    var module = angular.module('ng.cork.field-marked', [
        'hc.marked',
        'ng.cork.ui.textarea-auto-resize',
        'ng.cork.field-marked.templates'
    ]);

    /**
     * @ngdoc directive
     * @name ng.cork.field-marked.corkFieldMarked
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
     * @param {boolean=} corkDisabled Optionally expression to enable/disable the field.
     * @param {string=} corkPlaceholder Optional string to add as a placeholder
     * @param {array=} corkModes Array of allowed modes. Defaults to `['preview', 'edit' ,'split']`
     */
    module.directive('corkFieldMarked', [
        '$rootScope',
        '$timeout',
        function corkFieldMarked($rootScope, $timeout) {

            return {
                restrict: 'A',
                templateUrl: 'lib/ng.cork.field-marked/fieldMarked.tpl.html',
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
