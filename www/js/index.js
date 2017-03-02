var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
  },

  // deviceready Event Handler
  //
  // Bind any cordova events here. Common events are:
  // 'pause', 'resume', etc.
  onDeviceReady: function () {
    this.receivedEvent('deviceready');
  },

  // Update DOM on a Received Event
  receivedEvent: function (id) {
    this.loadPhotos();
  },

  requestAuthorization: function () {

    var self = this;

    cordova.plugins.photoLibrary.requestAuthorization(
      function () {
        // Retry
        self.loadPhotos();
      },
      function (err) {
        console.log('Error in requestAuthorization: ' + err);

        // TODO: explain to user why you need the permission, and continue when he agrees

        // Ask user again
        self.requestAuthorization();

      }, {
        read: true,
        write: false
      }
    );

  },

  loadPhotos: function () {

    var self = this;

    cordova.plugins.photoLibrary.getLibrary(
      function (chunk) {
        var isLastChunk = chunk.isLastChunk;
        var library = chunk.library;

        if (isLastChunk) {
          // Here we have the library as array

          self.initializePhotoSwipe(library);

        }

      },
      function (err) {
        if (err.startsWith('Permission')) {

          console.log('Please provide the permission');

          // TODO: explain to user why you need the permission, and continue when he agrees

          self.requestAuthorization();

        } else { // Real error
          console.log('Error in getLibrary: ' + err);
        }
      }, {
        //chunkTimeSec: 0.3,
      }
    );

  },

  initializePhotoSwipe(library) {

    var pswpElement = document.querySelectorAll('.pswp')[0];

    var items = library.map(function(libraryItem) {
      return {
        src: libraryItem.photoURL,
        w: libraryItem.width,
        h: libraryItem.height,
        title: libraryItem.fileName,
      };
    });

    // define options (if needed)
    var options = {
      // optionName: 'option value'
      // for example:
      index: 0, // start at first slide
      tapToClose: false,
      clickToCloseNonZoomable: false,
      pinchToClose: false,
      closeOnVerticalDrag: false,
      closeOnScroll: false,
    };

    // Initializes and opens PhotoSwipe
    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();

  },

};

app.initialize();
