// --------------
// INITIALISATION
// --------------

var user;
var scanned_scores;

function User() {
  self = this;

  this.defaults = {
    eyes: { integer: 1 },
    heart: { integer: 1 },
    brain: { integer: 1 },
    height: { integer: 1 },
    immunity: { integer: 1 },
    teeth: { integer: 1 },
    strength: { integer: 1 },
    fatness: { integer: 1 },
    skin: { integer: 1 },
    face: { integer: 1 }
  }

  this.state = {};
  this.state.powers = this.defaults;

  // List of powers
  this.powers = _.map(this.state.powers, function(value, key){
    return key;
  });

  // Initialise
  this.initialise = function(){
    _.each(this.powers, function(power){
      var value = self.state.powers[power];
      // Score needs to be a string because Mustache treats 0 as falsey
      self.state.powers[power]['score'] = value.integer.toString();
      // You go up a power level for every 7 points
      self.state.powers[power]['level'] = Math.floor(value.integer / 7) + 1;
    });
  }

  this.reset = function(){
    this.state.powers = this.defaults;
    this.save();
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

  // If there's an error loading an old version of the user state
  try {
    this.load();
  }
  catch(err) {
    this.reset();
  }
};

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

// ------
// ROUTER
// ------
var router = new Grapnel();

router.bind('navigate', function(event){
  $('.scanner_log').html('');
});

var routes = {
  '/' : function(req, e){
    $('#myModal').modal('hide');
  },

  '/settings' : function(req, e){
    $('#myModal').modal('show');
    render('settings', {}, '.modal-body');
  },

  '/about' : function(req, e){
    $('#myModal').modal('show');
    render('about', {}, '.modal-body');
  },

  '/feedback' : function(req, e){
    $('#myModal').modal('show');
    render('feedback', {}, '.modal-body');
  },

  '/barcode/:id' : function(req, e){
    var scanned_scores = {};
    $('#myModal').modal('show');
    $('.scanner_log').html('Yum Yum eating bardode...');
    $.get(
      'http://omgweb.herokuapp.com/omg_search/' + req.params.id,
      function(response) {
        console.log(response);
        if(response.ProductId == 'NotFound'){
          $('.scanner_log').html("Grrr! I can´t eat this barcode :(");
        }else{
          // Convert the API hash for the scores to the format used locally
          var scores = {};
          _.each(response.Scores, function(score){
            scores[score.SPType.toLowerCase()] = score.SPScore;
          });
          // Merge the old and new together
          _.extend(response, scores);

          // Save the scan to be used on other pages
          user.state.current_scan = response;
          user.save();

          $('.scanner_log').html('');

          render('scanned', user.state.current_scan, '.modal-body', { powers: templates['powers'] });
        }
      }
    ).done(function(d) {
      console.log('OMG API: done', d)
    })
    .fail(function(e, o, m) {
      console.log('OMG API: fail', m);
    });
  },

  // What to do when the user decides they want to eat the nutrition from the scan
  '/evolve' : function(req, e){
    $('#myModal').modal('hide');
    user.load();
    _.each(user.powers, function(power){
      // Only try to update the user's super power if the scan effected that power
      if(user.state.current_scan.hasOwnProperty(power)){
        value = user.state.current_scan[power];
        user.state.powers[power].integer = user.state.powers[power].integer + parseInt(value);
      }
    })
    user.state.current_scan = {};
    user.save();
  },

  // Clear the user's super powers
  '/reset' : function(req, e){
    user.reset();
    $('#myModal').modal('hide');
  },

  // 404
  '/*' : function(req, e){
    if(!e.parent()){
      console.log("404 Opps! Something was wrong!")
    }
  }
}

waitForTemplates(function(){
  user = new User();
  Grapnel.listen(routes);
  scan();
});
