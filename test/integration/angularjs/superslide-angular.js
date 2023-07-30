angular.module('superslide', []);

angular.module('superslide').component('superslideComponent', {
    template:
        '<div>' +
        '<p><button ng-click="$ctrl.addPointer(0)">Add</button><button ng-click="$ctrl.editTitles()">Edit titles</button></p>' +
        '<superslide-directive ng-model="$ctrl.values" init="$ctrl.init(addValue)" formatter="$ctrl.formatter(value)"></superslide-directive>' +
        '</div>',
    controller: function SuperslideComponentController($timeout) {
        var ctrl = this;
        var addValue = function(){};
        this.values = {values: [{value: 0, title: "first"}, {value: 30, title: "last"}]};
        this.formatter = function (value) {
            var seconds = value * 15 * 60;
            var minutes = Math.floor(seconds / 60);
            var hours = Math.floor(minutes / 60);
            var hoursRest = minutes % 60;
            var text = '' + hours + 'h' + (hoursRest ? hoursRest : '');
            return text;
        };

        this.init = function (addValueFn) {
            addValue = addValueFn;
        };

        this.addPointer = function (v) {
            addValue(v);
        };

        this.editTitles = function () {
            ctrl.values = {
                values: ctrl.values.values.map(element => {
                    element.title = "boom"
                    return element
                })
            };
        };

        $timeout(function(){
            ctrl.values = {values: [{value: 50, title: "middle *"}, {value: 10, title: "first *"}, {value: 90, title: "last *"}]}
        },5000);

        //setInterval(function () {
            //console.log('monitoring', ctrl.values);
        //}, 60000);
    },
});

angular
    .module('superslide')
    .directive('superslideDirective', function ($timeout) {
        return {
            require: ['ngModel'],
            restrict: 'E',
            transclude: false,
            controllerAs: 'vm',
            bindToController: true,
            scope: {
                customerFormatter: '&formatter',
                customerInit: '&init',
            },
            template:
                '<div class="superslide">' +
                '<div ng-if="vm.show" class="superslide-slider"></div>' +
                '</div>',
            link: function (scope, elem, attrs, ctrls) {
                var ngModel = ctrls[0];

                scope.vm.show = true;

                scope.getCtrl = function () {
                    return ngModel;
                };

                scope.getElem = function () {
                    return elem;
                };

                scope.updateModel = function (value) {
                    ngModel.$setViewValue(value);
                    ngModel.$validate();
                    //scope.vm.model = ngModel.$viewValue;
                };

                scope.$watch(
                    'vm.model',
                    function (value) {
                        //console.log('$watch', value);
                        scope.updateModel(value);
                        //scope.vm.updateView();
                    },
                    true
                );

                ngModel.$render = function () {
                    if (
                        !(
                            ngModel.$viewValue &&
                            angular.isObject(ngModel.$viewValue) &&
                            !angular.isArray(ngModel.$viewValue) &&
                            angular.isArray(ngModel.$viewValue.values)
                        )
                    ) {
                        ngModel.$viewValue = {values: []};
                    }
                    ngModel.$viewValue.values.sort(function(a, b) {
                        return a.value - b.value
                    });
                    scope.vm.model = ngModel.$viewValue;
                    console.log('$render', scope.vm.model)
                    scope.vm.updateView();
                };

                $timeout(function(){
                    scope.vm.customerInit({
                        addValue: function(v) {
                            console.log('addValue')
                            //console.log(scope.vm.model)
                            if (!scope.vm.model.values.find(function(elem){
                                var scalarV = v && typeof v == "object" ? v.value : v;
                                var scalarElem = elem && typeof elem == "object" ? elem.value : elem;
                                return scalarV == scalarElem;
                            })) {
                                scope.vm.model.values.unshift({value: v, title: 5});
                                scope.vm.model.values.sort(function(a, b) {
                                    return a.value - b.value
                                });
                                $timeout(
                                    function(){
                                        scope.updateModel(scope.vm.model)
                                        scope.vm.updateView();
                                    },10);
                            }
                        }
                    });
                },50);
            },
            controller: function ($scope) {
                var vm = this;
                var mainElem, elem;

                function updateView() {
                    //console.log('updateView');
                    if (!elem) return;
                    vm.show = false;
                    $timeout(function(){
                        vm.show = true;
                        $timeout(function(){
                            elem = mainElem.find('div.superslide-slider');
                            loadQuinnSlider();
                        }, 100);
                    }, 100);
                }

                function loadQuinnSlider() {
                    elem.quinn({
                        // minimum value
                        min: 0,

                        // maximum value
                        max: 95,

                        // If you wish the slider to be drawn so that it is wider than the
                        // range of values which a user may select, supply the values as a
                        // two-element array.
                        drawTo: null,

                        // step size
                        step: 1,

                        // initial value
                        value: vm.model.values,

                        // Snaps the initial value to fit with the given "step" value. For
                        // example, given a step of 0.1 and an initial value of 1.05, the
                        // value will be changes to fit the step, and rounded to 1.1.
                        //
                        // Notes:
                        //
                        //  * Even with `strict` disabled, initial values which are outside
                        //    the given `min` and `max` will still be changed to fit within
                        //    the permitted range.
                        //
                        //  * The `strict` setting affects the *initial value only*.
                        strict: true,

                        // Restrics the values which may be chosen to those listed in the
                        // `only` array.
                        only: null,

                        // Disables the slider when initialized so that a user may not change
                        // it's value.
                        disable: false,

                        // By default, Quinn fades the opacity of the slider to 50% when
                        // disabled, however this may not work perfectly with older Internet
                        // Explorer versions when using transparent PNGs. Setting this to 1.0
                        // will tell Quinn not to fade the slider when disabled.
                        disabledOpacity: 0.5,

                        // If using Quinn on an element which isn't attached to the DOM, the
                        // library won't be able to determine it's width; supply it as a
                        // number (in pixels).
                        width: null,

                        // If using Quinn on an element which isn't attached to the DOM, the
                        // library won't be able to determine the width of the handle; suppl
                        // it as a number (in pixels).
                        handleWidth: null,

                        // Enables a slightly delay after keyboard events, in case the user
                        // presses the key multiple times in quick succession. False disables,
                        // otherwise provide a integer indicating how many milliseconds to
                        // wait.
                        keyFloodWait: false,

                        // When using animations (such as clicking on the bar), how long
                        // should the duration be? Any jQuery effect duration value is
                        // permitted.
                        effectSpeed: 'fast',

                        // Set to false to disable all animation on the slider.
                        effects: true,

                        change: function (newValue) {
                            console.log("change", newValue);
                            if (!angular.isArray(newValue)) {
                                newValue = [newValue];
                            }
                            vm.model.values = newValue;
                            $scope.updateModel(vm.model);
                        },

                        drag: function (newValue) {
                            //console.log(newValue);
                        },

                        formatText: function (value) {
                            return (
                                vm.customerFormatter({ value: value }) || value
                            );
                        },
                    });
                }

                vm.updateView = updateView;

                $timeout(function () {
                    mainElem = $($scope.getElem());
                    elem = mainElem.find('div.superslide-slider');
                    //console.log(elem);
                    loadQuinnSlider();
                }, 100);
            },
        };
    });
