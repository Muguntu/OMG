// --------------
// INITIALISATION
// --------------

var user;
var scanned_scores;

// ---------
// TEMPLATES
// ---------
// TODO: lazy load these templates
var templates = [
  'about',
  'character',
  'feedback',
  'powers',
  'scanned',
  'scanning',
  'settings'
]

// Generic function to render a template in the DOM
function render(template_name, context, selector){
  var html = templates[template_name](context);
  $(selector).html(html);
}

function waitForTemplates(callback) {
  if(loaded_count < templates.length) {
    setTimeout(waitForTemplates, 50, callback);
    return;
  }
  // Carry on with page rendering
  callback();
}

function isInt(value) {
  return !isNaN(value) && 
         parseInt(Number(value)) == value && 
         !isNaN(parseInt(value, 10));
}

// Fetch all the templates ready for rendering
var loaded_count = 0;
$.each(templates, function(index, template_name){
  $.get('templates/' + template_name + '.html', function(template) {;
    templates[template_name] = _.template(template);
    loaded_count = loaded_count + 1;
  });
});

// Hide the navbar when an item is chosen
$('.navbar-collapse a').click(function(){
  $(".navbar-collapse").collapse('hide');
});

// Entry point to application
waitForTemplates(function(){
  user = new User();
  Grapnel.listen(routes);
  scan();
});
