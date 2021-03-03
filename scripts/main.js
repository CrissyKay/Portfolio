(function ($) {
  "use strict";

  $("body").imagesLoaded({ background: ".item, .slide" }, function () {
    $("body").removeClass("preload");

    $(".anchor").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      var href = $(this).attr("href");
      $("html,body").animate({
        scrollTop: $(href).offset().top + "px",
      });
    });

    $(window).on("scroll", function () {
      window.requestAnimationFrame(parallax);
    });

    var parallaxSpeed = 0.15;

    function parallax() {
      $(".parallax").each(function () {
        var el = $(this);
        var yOffset = $(window).scrollTop(),
          parallaxOffset = yOffset * parallaxSpeed,
          parallaxOffset = +parallaxOffset.toFixed(2);
        if (el.hasClass("fs")) {
          el.css(
            "transform",
            "translate3d(-50%,-" + (50 - parallaxOffset * 0.15) + "%,0)"
          );
        } else {
          el.css("transform", "translate3d(0," + parallaxOffset + "px,0)");
        }
      });
    }

    $(window).bind("pageshow", function (event) {
      if (event.originalEvent.persisted) {
        window.location.reload();
      }
    });

    var startTimeline = new TimelineMax(),
      nav = $(".main-nav li"),
      logo = $(".brand img");
    startTimeline.staggerFrom(
      nav,
      0.8,
      {
        opacity: 0,
        scale: 0,
        y: 20,
        rotationX: 100,
        transformOrigin: "0% 50% -50",
        ease: Power2.easeOut,
      },
      0.05,
      "+=0"
    );
    startTimeline.from(logo, 0.6, {
      opacity: 0,
      scale: 0,
      ease: Power2.easeOut,
    });

    var controller = new ScrollMagic.Controller({
      globalSceneOptions: {
        triggerHook: "onEnter",
      },
    });

    $(".fadein").each(function () {
      var curItem = this;

      var curTween = new TimelineMax().from(
        curItem,
        2.5,
        { opacity: 0, ease: Power2.easeOut },
        0.15
      );

      var scene = new ScrollMagic.Scene({ triggerElement: curItem })
        .setTween(curTween)
        .addTo(controller);
    });

    var fsContainer = $(".fs-portfolio");
    var fsInterval;

    $("body").on("click", "a[class!=anchor]", function (e) {
      var href = $(this).attr("href");
      startTimeline.reverse(0).timeScale(2);

      if (fsContainer.length) {
        clearInterval(fsInterval);
        TweenMax.to(".fs-portfolio", 1, { opacity: 0 }, 0.5);
      }

      var rolloutTween = new TimelineMax().to(
        ".item, .fadein",
        0.5,
        { opacity: 0, ease: Power2.easeOut, onComplete: nextPage },
        0.5
      );

      function nextPage() {
        window.location = href;
      }
      e.preventDefault();
    });

    if (fsContainer.length) {
      TweenMax.from(".fs-portfolio", 1, { opacity: 0 }, 2);
      var curTitle = $(".fs-images li:first-child h1");
      animateFsTitle(curTitle);

      function fsSlide(curItem) {
        if (curItem) {
          curItem.addClass("active");
          curItem.siblings().removeClass("active");
        } else if (
          $("body").find(".fs-navigation li.active").next("li").length
        ) {
          $("body")
            .find(".fs-navigation li.active")
            .removeClass("active")
            .next("li")
            .addClass("active");
        } else {
          $("body").find(".fs-navigation li.active").removeClass("active");
          $("body").find(".fs-navigation li:first-child").addClass("active");
        }
        var newIndex = $(".fs-navigation li.active").index();
        var newImage = $(".fs-images li:eq(" + newIndex + ")");
        curTitle = newImage.find("h1");
        newImage.siblings().stop().fadeOut(900).removeClass("active");
        newImage.stop().fadeIn(900).css("display", "flex").addClass("active");
        animateFsTitle(curTitle);
      }

      fsInterval = setInterval(function () {
        fsSlide(false);
      }, 3000);

      function animateFsTitle(curTitle) {
        var fsTitle = new TimelineMax(),
          fsTitleSplit = new SplitText(curTitle, { type: "words,chars" }),
          chars = fsTitleSplit.chars;

        TweenLite.set(curTitle, { perspective: 400 });
        fsTitle.staggerFrom(
          chars,
          0.8,
          {
            opacity: 0,
            scale: 0,
            y: 80,
            rotationX: 180,
            transformOrigin: "0% 50% -50",
            ease: Power2.easeOut,
          },
          0.05,
          "+=0"
        );
      }

      $(".fs-navigation li").hover(
        function () {
          fsSlide($(this));
          clearInterval(fsInterval);
        },
        function () {
          fsInterval = setInterval(function () {
            fsSlide(false);
          }, 3000);
        }
      );
    }

    var titleClass = ".animated-text";

    function animateTitle() {
      if ($(titleClass).length) {
        var theTitleTL = new TimelineMax(),
          theTitleSplit = new SplitText(titleClass, { type: "words,chars" }),
          chars = theTitleSplit.chars; //an array of all the divs that wrap each character

        TweenLite.set(titleClass, { perspective: 400 });
        theTitleTL.staggerFrom(
          chars,
          0.4,
          {
            opacity: 0,
            y: 30,
            transformOrigin: "0% 50% -50",
            ease: Power2.easeOut,
          },
          0.01,
          "+=0"
        );
      }
    }

    animateTitle(titleClass);

    // Set sticky element after load - or it will break
    if ($(window).width() > 992 && $("#sticky").length) {
      new ScrollMagic.Scene({
        duration: $("#sticky-holder").height() - $("#sticky").height(), // the scene should last for a scroll distance of 100px
        offset: $("#sticky").offset().top, // start this scene after scrolling for 50px
      })
        .setPin("#sticky") // pins the element for the the scene's duration
        .addTo(controller); // assign the scene to the controller
    }

    $(".grid-images").isotope({
      columnWidth: ".item-sizer",
      percentPosition: true,
    });
    $(".grid-images").isotope("layout");
  });

  ("use strict");

  $("#form").submit(function (e) {
    e.preventDefault();
    var $form = $(this);
    var required = $form.find("[required]");
    var serializedData = $form.serialize();
    var url = $("#form").attr("action");
    $form.find("#send, .form-control").prop("disabled", true);
    $.post(url, serializedData, function (response) {
      if (response == "sent") {
        console.log("Sent");
        $("#send").text("Thank you!");
      } else {
        console.log("Error: Something went wrong!");
      }
    });
  });
})(jQuery);
