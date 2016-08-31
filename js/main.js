$(document).ready(function() {

    /*****************
    Variables
    ******************/
    var $gallery = $('#gallery');
    var $galleryImgs = $('#gallery a');
    var $search = $('input');
    var $overlay = $("<div id='overlay'></div>");
    var $imageContainer = $("<div id='imageContainer'></div>");
    var $image = $("<img>");
    var $video = $('<div class="video"><iframe style="width:100%;height:100%;margin:auto;" frameborder="0" allowfullscreen></iframe></div>');
    var $captionHeader = $("<h1></h1>");
    var $caption = $("<p></p>");
    var imageCache = []; //image cache
    var currentLocation = 0; //current image
    var $prevPhoto = $('<div id="prevPhoto"><i class="fa fa-angle-left"></i></div>');
    var $nextPhoto = $('<div id="nextPhoto"><i class="fa fa-angle-right"></i></div>');
    var imgAnimDuration = 400;
    var buttonAnimDuration = 200;

    /*****************
    Create lightbox elements
    ******************/
    //add button
    $imageContainer.append($prevPhoto);
    //add image and vid containers
    $imageContainer.append($image);
    $imageContainer.append($video);
    //add button
    $imageContainer.append($nextPhoto);
    // Add captions
    $imageContainer.append($captionHeader);
    $imageContainer.append($caption);
    // add to overlay
    $overlay.append($imageContainer)
    $("body").append($overlay);

    /*****************
    Functions
    ******************/

    //populate cache with items
    function populateArray(item) {
        //clear cache
        imageCache = [];
        //build imageCache, only fill with items that have class="active"
        $('.active').each(function() {
            var imageObject = {
                itemLocation: $(this),
                itemURL: $(this).attr("href"),
                itemHeader: $(this).attr('title'),
                itemCaption: $(this).attr('data-caption')
            };
            imageCache.push(imageObject);
        });
    };



    // animate images

    function fadeImgs() {
        if (currentLocation < imageCache.length) {
            //fade out captions
            $captionHeader.fadeOut(imgAnimDuration);
            $caption.fadeOut(imgAnimDuration);
            $image.fadeOut(imgAnimDuration);
            $video.fadeOut(imgAnimDuration);
            var isVideo = $galleryImgs.attr("data-type");
            console.log(isVideo);
            //fade out image/video, set new image when complete
            $image.fadeOut(imgAnimDuration, function() {
              if (currentLocation >= 12 || $galleryImgs.attr("data-type") === 'video') {
                $video.find('iframe').attr("src", imageCache[currentLocation].itemURL);

                $video.fadeIn(imgAnimDuration);
              } else {
                $image.attr("src", imageCache[currentLocation].itemURL);
                $video.find('iframe').attr("src", "");
                $image.fadeIn(imgAnimDuration);
              }
                $captionHeader.text(imageCache[currentLocation].itemHeader);
                $caption.text(imageCache[currentLocation].itemCaption);
            });
            //fade in current image and captions
            $captionHeader.fadeIn(imgAnimDuration);
            $caption.fadeIn(imgAnimDuration);
        }
    }


    //hide and display buttons
    function btnDisplay(event) {
        //turn off previousbtn if end is reached
        if (currentLocation === 0) {
            $prevPhoto.animate({
                opacity: '0'
            }, 0).show();
            $nextPhoto.animate({
                opacity: '1'
            }, imgAnimDuration).show();
            // createImage();
        } else if (currentLocation >= 12) {
          $prevPhoto.animate({
              opacity: '1'
          }, imgAnimDuration).show();
          $nextPhoto.animate({
              opacity: '1'
          }, imgAnimDuration).show();
          $image.hide();
        } else {
            $prevPhoto.animate({
                opacity: '1'
            }, imgAnimDuration).show();
            $nextPhoto.animate({
                opacity: '1'
            }, imgAnimDuration).show();
        }
        //turn off nextbtn if end is reached
        if (currentLocation === (imageCache.length - 1)) {
            $nextPhoto.animate({
                opacity: '0'
            }, 0).show();
            $prevPhoto.animate({
                opacity: '1'
            }, imgAnimDuration).show();
        }
    }

    function createImage(e) {
      console.log('create image ran');
      //get source if event is passed
      if (e) {
        $image.attr("src", e);
      }
      $video.find('iframe').attr("src", "");
      $video.hide();
      $image.show();

    };

    function createVideo(e) {
      console.log('create video ran');
      //get source if event is passed
      if (e) {
        $video.find('iframe').attr("src", e);
      }

      $image.hide();
      $video.show();
    };

    /**********************
    Click based events
    **********************/

    // click event for thumbnails
    $galleryImgs.on("click", function(event) {
        event.preventDefault();
        var imageSelected = $(this).attr("href");
        //get location of item clicked
        currentLocation = $('.active').index($(this));

        //variable for if statement, check if a video is selected
        var selectedType = $(this).attr("data-type");

        if (selectedType === 'video') {
            createVideo(imageSelected);
        } else {
            createImage(imageSelected);
        }

        totalActive = $('.active').length;

        //create array from filtered items
        populateArray();

        console.log("currentLocation variable is " + currentLocation + ". Active amount is " + totalActive);

        var captionText = $(this).attr('data-caption');
        var captionHeader = $(this).attr('title');
        $captionHeader.text(captionHeader);
        $caption.text(captionText);

        $overlay.show().animate({
            opacity: '1'
        }, imgAnimDuration);

        //show buttons
        btnDisplay(this);

        //hide arrows if only one image
        if (imageCache.length === 1) {
            console.log('cache is 1');
            $nextPhoto.hide();
            $prevPhoto.hide();
        }

    });

    // click event for arrows
    $('#nextPhoto').on("click", function(event) {
        //remove bubbling
        event.stopPropagation();
        currentLocation++;
        console.log('current location is ' + currentLocation);
        fadeImgs();
        btnDisplay(this);
    });

    $('#prevPhoto').on("click", function(event) {
        //remove bubbling
        event.stopPropagation();
        currentLocation--;
        console.log('current location is ' + currentLocation);
        fadeImgs();
        btnDisplay(this);
    });


    //hide gallery
    $overlay.on('click', function(event) {

        $overlay.animate({
            opacity: '0'
        }, 'fast', function() {
            $overlay.hide();
        })
        $prevPhoto.fadeOut(imgAnimDuration);
        $nextPhoto.fadeOut(imgAnimDuration);
        $video.find('iframe').attr("src", "");
        // reset cache array
        imageCache = [];

    });

    /*****************
    Key based events
    ******************/

    //keyup event to run filter function
    $search.on('keyup', function() {
        //store the search input
        var search = $(this).val().toLowerCase();

        // for each gallery item, get the items to filter
        $gallery.children('a').each(function(index, item) {

            //filter based on image caption
            if ($(item).filter('[data-caption *= ' + search + ']').length > 0 || search.length < 1) {
                $(item).show().addClass('active');
            } else {
                $(item).hide().removeClass('active');
            }
        });
        //create array from items that are visible
        populateArray();
    });


    // key down functions
    $(document).keydown(function(event) {

        if ((currentLocation !== (imageCache.length - 1)) && (event.which === 39)) {
            $nextPhoto.click();
        } else if ((currentLocation > 0) && (event.which === 37)) {
            $prevPhoto.click();
        } else if (event.which == 27) {
            $image.click();
        }
    });
});
