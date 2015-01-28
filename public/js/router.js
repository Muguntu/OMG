// ------
// ROUTER
// ------

// Once a response from the API has been received show its scores so the user can decide whether
// to eat it or not.
var showProduct = function(product){
  if(product.ProductId == 'NotFound'){
    $('.scanner_log').html("Grrr! I can't eat this barcode :(");
  }else{
    // Convert the API hash for the scores to the format used locally
    var scores = {};
    _.each(product.Scores, function(score){
      scores[score.SPType.toLowerCase()] = score.SPScore;
    });
    // Merge the old and new together
    _.extend(product, scores);

    // Save the scan to be used on other pages
    user.state.current_scan = product;
    user.save();

    $('.scanner_log').html('');

    render('scanned', user.state.current_scan, '.modal-body', { powers: templates['powers'] });
  }
}

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
    $('.scanner_log').html('Yum Yum eating barcode...');
    $.get(
      'http://omgweb.herokuapp.com/omg_search/' + req.params.id,
      showProduct
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
    user.eatLastScan();
  },

  // Clear the user's super powers
  '/reset' : function(req, e){
    user.reset();
    $('#myModal').modal('hide');
  },

  // 404
  '/*' : function(req, e){
    if(!e.parent()){
      console.log("404 Oops! Something was wrong!")
    }
  }
}
