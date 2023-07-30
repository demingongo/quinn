var sliders;
var addButton;
var values = [15, 30, 70];

function log() {
  sliders.each(function(index){
    console.log(this.superslide)
  });
}

function loadSlider() {
	sliders = $('.slider').quinn({

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
  value: values,

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

  change:function (newValue) {
    console.log(newValue);
	values = newValue;
  },

  drag: function (newValue) {
	  console.log(newValue);
  },

  formatText: function(value) {
    var seconds = value * 15 * 60;
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var hoursRest = minutes % 60;
    /*
    console.log(minutes);
console.log(hours);
console.log(hoursRest);
*/
    return '' + hours + 'h' + (hoursRest ? hoursRest : '')
  }
});
}

function createSlider(){
  $( "p.superslide" ).append( '<div class="slider"></div>' );
}

function addPointer(v){
	if (!values.includes(v))
		{
			values.unshift(v);
      //sliders.each(function(index){
      //  this.superslide.setValue(values, true, true);
      //});
      sliders.remove();
      createSlider();
      loadSlider();
		}
}

function loadAddButton() {
	addButton = $('button.add').on('click', function(){
		addPointer(0);
	})
}

function loadLogButton() {
	addButton = $('button.log').on('click', function(){
		log();
	})
}

// A $( document ).ready() block.
$( document ).ready(function() {
    console.log( "ready!" );
	loadSlider();
	loadAddButton();
  loadLogButton();
});


