(function ($) {
  "use strict";

  var $lightboxContainer = $(
    '<div id="lightbox"><div class="controls"><div class="galleryPrev"><img src="/img/ui/arrow-back-outline.svg" alt="icon" class="icon"/></div><div class="galleryNext"><img src="/img/ui/arrow-forward-outline.svg" alt="icon" class="icon"/></div><div class="galleryClose"><img src="/img/ui/close-outline.svg" alt="icon" class="icon"/></div></div>'
  );

  if ($(".lightbox").length) $("body").append($lightboxContainer);
  var $gallery = [],
    $galleryCaption = [],
    $galleryIndex = 0;

  function isYoutube(url) {
    var p = /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    return url.match(p) ? RegExp.$1 : false;
  }

  function isVimeo(url) {
    var p = /player\.vimeo\.com\/video\/([0-9]*)/;
    return url.match(p) ? RegExp.$1 : false;
  }

  $(".lightbox").each(function () {
    var href = $(this).attr("href");
    var caption = $(this).attr("data-caption");
    $gallery.push(href);
    $galleryCaption.push(caption);
    $(this).attr("data-index", $galleryIndex);
    $galleryIndex++;
    $(this).on("click", function (e) {
      e.stopImmediatePropagation();
      loadLightbox($(this).attr("data-index"), href, caption);
      e.preventDefault();
    });
  });

  $("body").on("click", ".galleryClose", function (e) {
    $lightboxContainer.fadeOut(500, function () {
      $(this).find(".lightbox-item").remove();
    });
  });

  $("html").on("click", "body", function (e) {
    $lightboxContainer.fadeOut(500, function () {
      $(this).find(".lightbox-item").remove();
    });
  });

  $("html").on("click", ".galleryNext, .galleryPrev", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    var curIndex = parseInt($(".lightbox-item").attr("data-index"));
    var newIndex;
    if ($(this).hasClass("galleryNext")) newIndex = curIndex + 1;
    else newIndex = curIndex - 1;
    if ($gallery.length == newIndex) newIndex = 0;
    if (newIndex == -1) newIndex = $gallery.length - 1;
    $("#lightbox [data-index]").css({
      opacity: 0,
      transform: "scale(.95)",
      transition: "opacity .3s, transform .3s",
    });
    setTimeout(function () {
      $("#lightbox [data-index]").attr("data-index", newIndex);
      loadLightbox(newIndex, $gallery[newIndex], $galleryCaption[newIndex]);
    }, 200);
  });

  function loadLightbox(index, href, caption) {
    var $index = index,
      $lightboxItem,
      $lightboxCaption = $('<div class="caption">' + caption + "</div>");
    $lightboxContainer.find(".lightbox-item").remove();
    $lightboxContainer.find(".caption").fadeOut(200, function () {
      $(this).remove();
    });
    if (href.indexOf(".mp4") > -1) {
      $lightboxItem = $(
        '<video class="lightbox-item" autoplay loop data-index="' +
          $index +
          '"><source src="' +
          href +
          '" type="video/mp4"></video>'
      );
      $lightboxContainer.append($lightboxItem).fadeIn();
      setTimeout(function () {
        $(".lightbox-item").css({
          opacity: 1,
          transform: "scale(1)",
        });
      }, 500);
    }
    if (isYoutube(href) || isVimeo(href)) {
      $lightboxItem = $(
        '<iframe class="lightbox-item" src="' +
          href +
          '" frameborder="0" allowfullscreen data-index="' +
          $index +
          '"/></iframe>'
      );
      $lightboxContainer.append($lightboxItem).fadeIn();
      setTimeout(function () {
        $(".lightbox-item").css({
          opacity: 1,
          transform: "scale(1)",
        });
      }, 500);
    } else {
      $lightboxItem = $(
        '<img class="lightbox-item" src="' +
          href +
          '" data-index="' +
          $index +
          '"/>'
      );
      $lightboxItem = $lightboxItem.on("load", function () {
        $lightboxContainer.append($(this)).fadeIn();
        setTimeout(function () {
          $lightboxItem.css({
            opacity: 1,
            transform: "scale(1)",
          });
        }, 500);
      });
    }
    if (caption) {
      $lightboxContainer.append($lightboxCaption);
      $lightboxCaption.delay(200).fadeIn();
    }
  }
})(jQuery);
