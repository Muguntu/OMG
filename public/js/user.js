// Model for a user. Persisted with HTML5 localStorage
function User() {
  self = this;

  // The number of points needed to reach a new level
  self.levelThreshold = 7;

  self.defaults = {
    eyes: { integer: 0 },
    heart: { integer: 0 },
    brain: { integer: 0 },
    height: { integer: 0 },
    immunity: { integer: 0 },
    teeth: { integer: 0 },
    strength: { integer: 0 },
    fatness: { integer: 0 },
    skin: { integer: 0 },
    face: { integer: 0 }
  }

  self.state = {};
  self.state.powers = self.defaults;

  // List of powers
  self.powers = _.map(self.state.powers, function(value, key){
    return key;
  });

  // Initialise
  self.initialise = function(){
    _.each(self.powers, function(power){
      var value = self.state.powers[power];
      // Score needs to be a string because Mustache treats 0 as falsey
      self.state.powers[power]['score'] = value.integer.toString();
      // You go up a power level for every self.levelThreshold points
      var level = Math.floor(value.integer / self.levelThreshold)
      if(level < 0){ level = 0 };
      self.state.powers[power]['level'] = level;
    });
  }

  self.reset = function(){
    self.state.powers = self.defaults;
    self.save();
  }

  // List of levels for interpolating with class names
  self.levels = function(){
    return _.object(_.map(self.powers, function(power){
      var level = self.state.powers[power].level.toString();
      if(level == 0){ level = ''}
      return [power + '_level', level];
    }));
  };

  // List of scores for providing to template context
  self.scores = function(){
    return _.object(_.map(self.powers, function(power){
      return [power, self.state.powers[power].score];
    }));
  };

  self.load = function(){
    data = localStorage.getItem('user')
    if(typeof data == 'string' || data instanceof String){
      self.state = JSON.parse(data);
    }
    self.initialise();
    // Always render the character
    render('character', self.levels(), '.monster-01');
    // Always render the power summary in the footer
    render('powers', self.scores(), '.powers-home');
  }

  self.save = function(){
    localStorage.setItem('user', JSON.stringify(self.state));
    self.load();
  }

  self.eatLastScan = function(){
    self.load();
    _.each(self.powers, function(power){
      // Only try to update the user's super power if the scan effected that power
      if(self.state.current_scan.hasOwnProperty(power)){
        value = self.state.current_scan[power];
        self.state.powers[power].integer = self.state.powers[power].integer + parseInt(value);
      }
    })
    self.state.current_scan = {};
    self.save();
  }

  // If there's an error loading an old version of the user state
  try {
    self.load();
  }
  catch(err) {
    self.reset();
  }
};
