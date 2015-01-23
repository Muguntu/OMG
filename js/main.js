// --------------
// INITIALISATION
// --------------

var user;
var scanned_scores;

// Use HTML5 local storage to persist user data between sessions
function User() {
  self = this;

  this.state = {
    powers: {
      // Defaults
      eyes: { integer: 1 },
      heart: { integer: 1 },
      brain: { integer: 1 },
      height: { integer: 1 },
      immunity: { integer: 1 },
      teeth: { integer: 1 },
      strength: { integer: 1 },
      fatness: { integer: 1 }
    }
  }

  // List of powers
  this.powers = _.map(this.state.powers, function(value, key){
    return key;
  });

  // Initialise
  this.initialise = function(){
    _.each(this.state.powers, function(value, power){
      // Score needs to be a string because Mustache treats 0 as falsey
      self.state.powers[power]['score'] = value.integer.toString();
      // You go up a power level for every 7 points
      self.state.powers[power]['level'] = Math.floor(value.integer / 7) + 1;
    });
  }

  this.reset = function(){
    _.each(this.state.powers, function(value, power){
      self.state.powers[power].integer = 1;
    });
    self.save();
  }

  // List of levels for interpolating with class names
  this.levels = function(){
    return _.object(_.map(this.powers, function(power){
      return [power + '_level', self.state.powers[power].level.toString()];
    }));
  };

  // List of scores for providing to template context
  this.scores = function(){
    return _.object(_.map(this.powers, function(power){
      return [power, self.state.powers[power].score];
    }));
  };

  this.load = function(){
    data = localStorage.getItem('user')
    if(typeof data == 'string' || data instanceof String){
      this.state = JSON.parse(data);
    }
    this.initialise();
    // Always render the character
    render('character', this.levels(), '.monster-01');
    // Always render the power summary in the footer
    render('powers', this.scores(), '.powers-home');
  }

  this.save = function(){
    localStorage.setItem('user', JSON.stringify(this.state));
    this.load();
  }

  this.load();
};

// ---------
// TEMPLATES
// ---------
var templates = [
  'character',
  'powers',
  'scanned',
  'scanning'
]

// Generic function to render a template in the DOM
function render(template, context, selector, partials){
  var rendered = Mustache.render(templates[template], context, partials);
  $(selector).html(rendered);
}

// Fetch all the templates ready for rendering
var loaded_count = 0;
$.each(templates, function(index, template_name){
  $.get('/templates/' + template_name + '.mustache', function(template) {;
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

// ------
// ROUTER
// ------
var router = new Grapnel();

var routes = {
  '/' : function(req, e){
    $('#myModal').modal('hide');
  },
  '/barcode/:id' : function(req, e){
    var scanned_scores = {};
    $('#myModal').modal('show');
    $('.modal-body').html('Looking up product...');
    // $.get(
    //   "http://localhost:9292/omg_search/5000347033889",
    //   function(response) {
    //     console.log(response);
    //     if(response == 'notfound'){
    //       $('.scanner_log').html("Couldn't find anything matching that barcode");
    //     }else{
    //       json = JSON.parse(response);
    //       console.log(json);
    //       render('scanned', scanned_scores, '.modal-body');
    //     }
    //   }
    // ).done(function() {
    //   // alert( "second success" );
    // })
    // .fail(function(e, o, m) {
    //   console.log(m);
    // });
    max = 5;
    min = -5;
    user.state.scanned_scores = {
      eyes: Math.floor(Math.random() * (max - min) + min),
      heart: Math.floor(Math.random() * (max - min) + min),
      brain: Math.floor(Math.random() * (max - min) + min),
      height: Math.floor(Math.random() * (max - min) + min),
      immunity: Math.floor(Math.random() * (max - min) + min),
      teeth: Math.floor(Math.random() * (max - min) + min),
      strength: Math.floor(Math.random() * (max - min) + min),
      fatness: Math.floor(Math.random() * (max - min) + min)
    }
    user.save();
    render('scanned', user.state.scanned_scores, '.modal-body', { powers: templates['powers'] });
  },
  '/evolve' : function(req, e){
    $('#myModal').modal('hide');
    user.load();
    _.each(user.powers, function(power){
      value = user.state.scanned_scores[power];
      user.state.powers[power].integer = user.state.powers[power].integer + value;
      user.save();
    })
    user.state.scanned_scores = {};
    user.save();
  },
  '/reset' : function(req, e){
    user.reset();
    $('#myModal').modal('hide');
  },
  '/*' : function(req, e){
    if(!e.parent()){
      console.log("404 route not found")
    }
  }
}

waitForTemplates(function(){
  user = new User();
  Grapnel.listen(routes);
  scan();
});
