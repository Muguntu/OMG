var result, canvas, ctx;

JOB.Init();

JOB.SetImageCallback(function(result) {
  if(result.length > 0){
    router.navigate('/barcode/' + result[0].Value);
  }else{
    if(result.length === 0) {
      $('.scanner_log').html("Couldn't read the barcode :(");
      console.log("Decoding barcode failed.");
    }
  }
});

JOB.PostOrientation = true;

JOB.OrientationCallback = function(result) {
  console.log("Deciphering barcode...");
  canvas.width = result.width;
  canvas.height = result.height;
  var data = ctx.getImageData(0,0,canvas.width,canvas.height);
  for(var i = 0; i < data.data.length; i++) {
    data.data[i] = result.data[i];
  }
  ctx.putImageData(data,0,0);
};

JOB.SwitchLocalizationFeedback(true);

JOB.SetLocalizationCallback(function(result) {
  ctx.beginPath();
  ctx.lineWIdth = "2";
  ctx.strokeStyle="red";
  for(var i = 0; i < result.length; i++) {
    ctx.rect(result[i].x,result[i].y,result[i].width,result[i].height);
    ctx.stroke();
  }
});

function scan(){
  var takePicture = document.querySelector("#Take-Picture");
  var showPicture = document.createElement("img");
  // Triggered when an image is uploaded
  if(takePicture && showPicture) {
    takePicture.onchange = function (event) {
      render('scanning', {}, '.modal-body');
      result = document.querySelector(".scanner_log");
      canvas = document.getElementById("picture");
      ctx = canvas.getContext("2d");
      $('#myModal').modal('show');
      $('.scanner_log').text('Uploading...');
      var files = event.target.files;
      if (files && files.length > 0) {
        file = files[0];
        try {
          // First check if the image was uploaded as a file
          var URL = window.URL || window.webkitURL;
          showPicture.onload = function(event) {
            JOB.DecodeImage(showPicture);
            URL.revokeObjectURL(showPicture.src);
          };
          showPicture.src = URL.createObjectURL(file);
        }
        catch (e) {
          try {
            // Now check to see if image captured by the camera
            var fileReader = new FileReader();
            fileReader.onload = function (event) {
              showPicture.onload = function(event) {
                JOB.DecodeImage(showPicture);
              };
              showPicture.src = event.target.result;
            };
            fileReader.readAsDataURL(file);
          }
          catch (e) {
            console.log('Neither createObjectURL or FileReader are supported.');
          }
        }
      }
    };
  }
}
