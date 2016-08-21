$(document).ready(function() {

    lightGallery(document.getElementById('gallery'), {
        width: '80%',
        download: false,
    });

    var $imgs = $('#gallery a');
    var $search = $('input');
    var cache = [];
    $imgs.each(function() {
        //console.log(this);
        cache.push({
            element: this,
            text: $(this).find("p").html().trim().toLowerCase()
        });
    });


    function filter() {
        //get the search query
        var query = this.value.trim().toLowerCase();
        // console.log(query);

        //for each entry in cache variable
        cache.forEach(function(img) {
            var index = 0; //set index to zero
            var filteredImg;

            // if there is some query text
            if (query) {
                // find if text is in there
                index = img.text.indexOf(query);
            }
            //console.log(index);
            // show or hide.....if -1 show none, otherwise set a blank string
            //  img.element.style.display = index === -1 ? 'none' : '';
             img.element.style.animation = index === -1 ? 'mymove' : '';

            // filteredImg.animate({opacity: '0'}, 'fast');
            console.log(img.element.animation);

        });

    };

    //keyup event to run filter function
    $search.on('keyup', filter);
});
