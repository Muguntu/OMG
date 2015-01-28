// ------
// ROUTER
// ------

// Once a response from the API has been received show its scores so the user can decide whether
// to eat it or not.
var showProduct = function(product){
  if(product.ProductId == 'NotFound'){
    $('.scanner_log').html("Grrr! I can't eat this barcode :(");
    new Audio('sounds/fail.wav').play();
  }else{

    $('.scanner_log').html('');

    // Convert the API hash for the scores to the format used locally
    var scores = {};
    _.each(product.Scores, function(score){
      scores[score.SPType.toLowerCase()] = score.SPScore;
    });

    // Save the scan to be used on other pages
    product['powers'] = scores;
    user.state.current_scan = product;
    user.save();

    // Make sure any missing powers are set to null, because underscore templates are fussy
    nulled_powers = _.object(_.map(user.powers, function(power){ return [power, null]}));
    _.defaults(scores, nulled_powers);

    var context = {
      scan: product,
      powers: templates['powers'](scores)
    }

    render('scanned', context, '.modal-body');

    new Audio('sounds/Magic_Wand.mp3').play();
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
    // Example barcodes to ease development. Can be used in development and live site.
    // #/barcode/5000347033889
    // #/barcode/5000119485960
    // #/barcode/5010102105416
    // #/barcode/5010102115958
    // #/barcode/03223789
    // #/barcode/5900951020940
    // #/barcode/8000500167687
    // #/barcode/5060139431019
    // #/barcode/0000003249468
    // #/barcode/0000050358809
    // #/barcode/5010029013047
    // #/barcode/5000127153950
    // #/barcode/5050179863727
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
  '/eat' : function(req, e){
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
      console.log("404 Oops! Something was wrong!");
    }
  }
}
