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
function render(template, context, selector, partials){
  var rendered = Mustache.render(templates[template], context, partials);
  $(selector).html(rendered);
}

// Fetch all the templates ready for rendering
var loaded_count = 0;
$.each(templates, function(index, template_name){
  $.get('templates/' + template_name + '.mustache', function(template) {;
    templates[template_name] = template;
    Mustache.parse(template);
    loaded_count = loaded_count + 1;
  });
});

function waitForTemplates(callback) {
  if(loaded_count < templates.length) {
    setTimeout(waitForTemplates, 50, callback);
    return;
  }
  // Carry on with page rendering
  callback();
}

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
