(() => {
    // The width and height of the captured photo. We will set the
    // width to the value defined here, but the height will be
    // calculated based on the aspect ratio of the input stream.
  
    var width = 320;    // We will scale the photo width to this
    var height = 0;     // This will be computed based on the input stream
  
    // |streaming| indicates whether or not we're currently streaming
    // video from the camera. Obviously, we start at false.
  
    var streaming = false;
  
    // The various HTML elements we need to configure or control. These
    // will be set by the startup() function.
  
    var video = null;
    var canvas = null;
    var photo = null;
    var startbutton = null;
    var submitbutton = null;
  
    function startup() {
      video = document.getElementById('video');
      canvas = document.getElementById('canvas');
      photo = document.getElementById('photo');
      startbutton = document.getElementById('startbutton');
      submitbutton = document.getElementById('submitbutton');
  
      navigator.mediaDevices.getUserMedia({video: true, audio: false})
      .then(function(stream) {
        video.srcObject = stream;
        video.play();
      })
      .catch(function(err) {
        console.log("An error occurred: " + err);
      });
  
      video.addEventListener('canplay', function(ev){
        if (!streaming) {
          height = video.videoHeight / (video.videoWidth/width);
        
          // Firefox currently has a bug where the height can't be read from
          // the video, so we will make assumptions if this happens.
        
          if (isNaN(height)) {
            height = width / (4/3);
          }
        
          video.setAttribute('width', width);
          video.setAttribute('height', height);
          canvas.setAttribute('width', width);
          canvas.setAttribute('height', height);
          streaming = true;
        }
      }, false);
  
      startbutton.addEventListener('click', function(ev){
        takePicture();
        ev.preventDefault();
      }, false);

      submitbutton.addEventListener('click', function(ev){
        sendPicture();
        ev.preventDefault();
      }, false);
      
      clearphoto();
    }
  
    // Fill the photo with an indication that none has been
    // captured.
  
    function clearphoto() {
      var context = canvas.getContext('2d');
      context.fillStyle = "#AAA";
      context.fillRect(0, 0, canvas.width, canvas.height);
  
      var data = canvas.toDataURL('image/jpeg');
      photo.setAttribute('src', data);
    }
    
    // Capture a photo by fetching the current contents of the video
    // and drawing it into a canvas, then converting that to a PNG
    // format data URL. By drawing it on an offscreen canvas and then
    // drawing that to the screen, we can change its size and/or apply
    // other changes before drawing it.
  
    function takePicture() {
      var context = canvas.getContext('2d');
      if (width && height) {
        canvas.width = width;
        canvas.height = height;
        context.drawImage(video, 0, 0, width, height);
        photo.setAttribute('src', canvas.toDataURL('image/jpeg'));
      } else {
        clearphoto();
      }
    }

    function sendPicture() {
      var data = canvas.toDataURL('image/jpeg');

      var formData = new FormData();
      formData.append('webimg', data);
      formData.append('csrfmiddlewaretoken', $('input[name=csrfmiddlewaretoken]').val());
  
      // Send the captured image data to the Django backend
      $.ajax({
          type: 'POST',
          url: '/souci/capture/',
          data: formData,
          contentType: false,
          processData: false,
          success: function(response) {
              if (response.redirect_url) {
                window.location.href = response.redirect_url;
              } else {
                console.log(response);
              }
          },
          error: function(xhr, status, error) {
              console.error(xhr, status, error);
          }
      });
    }
  
  
    // Set up our event listener to run the startup process
    // once loading is complete.
    window.addEventListener('load', startup, false);
})();