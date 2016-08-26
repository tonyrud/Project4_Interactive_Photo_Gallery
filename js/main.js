$(document).ready(function() {

    /*****************
    Variables
    ******************/
    var $gallery = $('#gallery')
    var $galleryImgs = $('#gallery a')
    var $search = $('input');
    var $overlay = $("<div id='overlay'></div>");
    var $image = $("<img>");
    var $captionHeader = $("<h1></h1>");
    var $caption = $("<p></p>");
    var imageCache = [] //image cache
    var currentLocation = 0 //current image
    var $prevPhoto = $('<div id="prevPhoto"><</div>');
    var $nextPhoto = $('<div id="nextPhoto">></div>');
    var animDuration = 400;

    /*****************
    Create lightbox elements
    ******************/
    $overlay.append($prevPhoto);
    $overlay.append($image);

    //add buttons

    $overlay.append($nextPhoto);


    // Add caption
    $overlay.append($captionHeader);
    $overlay.append($caption);
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
                itemURL: $(this).attr("href"),
                itemHeader: $(this).attr('title'),
                itemCaption: $(this).attr('data-caption')
            };
            currentLocation = 0;
            imageCache.push(imageObject);
        });

        // console.log('image cache is ' + imageCache.length);
    };

    function fadeImgs() {
        if (currentLocation < imageCache.length) {
            //fade out captions
            $captionHeader.fadeOut(animDuration);
            $caption.fadeOut(animDuration);
            //fade out image, set new image when complete
            $image.fadeOut(animDuration, function() {

                $image.attr("src", imageCache[currentLocation].itemURL);
                $captionHeader.text(imageCache[currentLocation].itemHeader);
                $caption.text(imageCache[currentLocation].itemCaption);

            });
            //fade in current image
            $captionHeader.fadeIn(animDuration);
            $caption.fadeIn(animDuration)
            $image.fadeIn(animDuration);
        }
    }

    function btnDisplay(event) {
        // $nextPhoto.hide();
        // $prevPhoto.hide();
        if (currentLocation === 0) {
            $prevPhoto.fadeOut(400);
            $nextPhoto.fadeIn(400);
        } else if (currentLocation === (imageCache.length - 1)) {
            $nextPhoto.fadeOut(400);
            $prevPhoto.fadeIn(400);
        } else {
            $prevPhoto.fadeIn(400);
            $nextPhoto.fadeIn(400);
        }

    }

    /**********************
    Events
    **********************/

    // click event for thumbnails
    $galleryImgs.on('click', function(event) {

        populateArray();

        currentLocation = $(this).index();
        var imageSelected = $(this).attr("href");
        $image.attr("src", imageSelected);
        console.log("currentLocation variable is " + currentLocation);
        event.preventDefault();

        var captionText = $(this).attr('data-caption');
        var captionHeader = $(this).attr('title');
        $captionHeader.text(captionHeader);
        $caption.text(captionText);

        $overlay.show().animate({
            opacity: '1'
        }, 'fast');
        //show buttons
        btnDisplay();

        //hide arrows of only one image
        if (imageCache.length === 1) {
            console.log('cache is 1');
            $nextPhoto.hide();
            $prevPhoto.hide();
        }

    });

    $('#nextPhoto').on('click', function(event) {
        currentLocation++;
        console.log('current location is ' + currentLocation);
        fadeImgs();
        btnDisplay();
    });

    $('#prevPhoto').on('click', function(event) {
        currentLocation--;
        console.log('current location is ' + currentLocation);
        fadeImgs();
        btnDisplay();
    });

    //hide gallery
    $image.on('click', function(event) {

        $overlay.animate({
            opacity: '0'
        }, 'fast', function() {
            $overlay.hide();
        })
        $prevPhoto.fadeOut(animDuration);
        $nextPhoto.fadeOut(animDuration);

    });

    /*****************
        Filtering
    ******************/

    //keyup event to run filter function
    $search.on('keyup', function() {
        //store the search input
        var search = $(this).val().toLowerCase();

        $gallery.children('a').each(function(index, item) {
            // console.log(index);
            //filter based on image caption
            if ($(item).filter('[data-caption *= ' + search + ']').length > 0 || search.length < 1) {
                $(item).show().addClass('active');
            } else {
                $(item).hide().removeClass('active');

            }
            //var itemsFiltered = ($( this ).attr('class'));
            // console.log(itemsFiltered);

        });
        //create array from items that are visible
        populateArray();
    });


});
