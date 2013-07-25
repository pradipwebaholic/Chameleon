(function ($) {
    $.fn.colorpicker = function (options) {
        $.fn.colorpicker.defaults = {
            mirror: true,
            nthLayer: 1,
            auto: false,
            target: "a"
        };
        options = $.extend($.fn.colorpicker.defaults, options);

        return this.each(

           function () {
                var _this = $(this);
                // If auto is set 
                options.auto ? setInterval(run, 500) : run();

                //Main running function

                function run() {
                    _color = color(_this);
                   if (_color == "transparent") {
                        _color = "rgb(0,0,0,0)";
                    }
                  if (options.mirror == true) {
                        _color = _color
  					.split("(")[1]
						.split(')')[0]
						.split(',');
                        _color = "rgb(" +
						 (225 - parseInt(_color[0]))
						 + "," + (225 - parseInt(_color[1]))
						 + "," + (225 - parseInt(_color[2])) + 
						 ")";
						}
                    _this
                       .find(options.target)
					   .css({color: _color});
                    _this
                        .filter(options.target)
                        .css({color: _color});
                }

                //Global color function

                function color(elemt) {
                    target = elemt;
                    _left = parseInt(target.position().left)
					 + (target.outerWidth() / 2);
                    _top = parseInt(target.position().top) 
					+ (target.outerHeight() / 2);
                    _new = backgroundElement(target);

                    if (_new.prop("tagName") == "IMG") {
                        return getColorAtPossition(_new, _left, _top);
                    } else {
                        return getBackgroundColor(_new, _left, _top);
                    }
                }

                //getBackgroundColor of element

                function getBackgroundColor(ele, x, y) {
                    bgimage = ele.css("background-image");
                    if (bgimage != "none") {
                        bgimage = bgimage.split("/");
                        bgimage = bgimage[bgimage.length - 2] 
						+ "/" + bgimage[bgimage.length - 1]
						.split("\"")[0];
                        $("body")
                            .append("<img id='bg' style='display:none' src='" 
							+ bgimage + "'/>");

                        return getColorAtPossition($("#bg"), x, y);
                    } else {
                        return ele.css("background-color");
                    }

                }
               // Get Color @ X Y position of an Image
                function getColorAtPossition(imag, X, Y) {

                    $("body")
                        .append('<canvas id="myCanvas" width="' 
						+ imag.outerWidth() + '" height="' 
						+ imag.outerHeight() 
						+ '" style="border:1px solid #d3d3d3; display:none"; ></canvas>');

                    var data1;
                    var img = new Image();
                    var context = document.getElementById('myCanvas')
					.getContext('2d');
                    img.src = imag.attr("src");
                    context.drawImage(img, 0, 0, imag.width(), imag.height());
                    data1 = context
					.getImageData(X, Y, 10, 10).data;
                    $("#myCanvas,#bg")
					.remove();
                    return "rgb(" + data1[0] +
					 "," + data1[1] + "," 
					 + data1[2] + ")";
                }

                //Getting element behind one element


                function backgroundElement(overlay) {
					_this = overlay;
					x = _this.offset().left;
					y = _this.offset().top;
					ele = GetAllElementsAt(x, y);
					ele = ele[ele.size() - (options.nthLayer + 1)];
					return ele;
					}
               // Global Function to get emements behind
                function GetAllElementsAt(x, y) {
                    var $elements = $("body *").map(function () {
					var $this = $(this);
					var offset = $this.offset();
					var l = offset.left;
					var t = offset.top;
					var h = $this.height();
					var w = $this.width();

					var maxx = l + w;
					var maxy = t + h;

					return (y <= maxy && y >= t) && (x <= maxx && x >= l) ? $this : null;
                    });

                    return $elements;
                }

            }

        );




    };




})(jQuery);
