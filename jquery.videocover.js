(function($) {

$.fn.videocover = function(args) {
    var $this = $(this);

    if (!$this.is('video')) {
        throw new Error('element must be a video');
    }

    var args = $.extend({
        width: parseInt($this.attr('width'), 10),
        height: parseInt($this.attr('height'), 10),
        minWidth: 0,
        viewportClass: 'video-viewport',
        resizeTimeout: 10,
    }, args);

    // create the viewport wrapper and wrap the <video> element
    var $viewport = $('<div class="' +args.viewportClass+ '">').css({
        height: '100%',
        width: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        zIndex: 1, // for accessing the video by click
    });
    $this.wrap($viewport);
    $viewport = $this.closest('.' + args.viewportClass);

    var resizeToCover = function() {
        // use largest scale factor - either horizontal or vertical
        var scale_h = $viewport.width()  / args.width;
        var scale_v = $viewport.height() / args.height;
        var scale   = Math.max(scale_h, scale_v);

        // don't allow scaled width to be less than the minimum width
        if (scale * args.width < args.minWidth) { scale = args.minWidth / args.width; }

        // some plugins replace the <video> element with an <embed> element
        var $video = $viewport.find('video, embed');

        // scale and center the video within the viewport
        $video.width(scale * args.width)
              .height(scale * args.height)
              .css({
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
              })
              ;
    };

    // trigger a resize whenever the window is resized,
    // but use a timeout so we don't trigger it constantly
    var resizeTimeout = null;
    $(window).resize(function() {
        if (resizeTimeout) { clearTimeout(resizeTimeout); }
        resizeTimeout = setTimeout(function() {
            resizeToCover();
        }, args.resizeTimeout);
    });

    // initial sizing
    resizeToCover();
};

})(jQuery);
