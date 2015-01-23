(function($) {

  var router = new Grapnel();

  var routes = {
    '/' : function(req, e){
      console.log("//////")
    },
    '/thing' : function(req, e){
      console.log("/thing")
    },
    '/alert' : function(req, e){
      console.log("/alert")
    },
    '/*' : function(req, e){
      if(!e.parent()){
        console.log("404 route not found")
      }
    }
  }

  Grapnel.listen(routes);
})(jQuery);
