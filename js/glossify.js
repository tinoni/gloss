/**
 * User: mfernandes http://openxrest.com/gloss/
 * Date: 22/11/13
 * Time: 14:42
 * minify with http://refresh-sf.com/yui/
 */


var magic_gloss = {

  supports_canvas: function () {
    return !!document.createElement('canvas').getContext;
  },

  supports_ToDataURL: function () {
    if(!this.supports_canvas()) return false;

    var canvas = document.createElement("canvas");
    var data = canvas.toDataURL("image/png");
    return (data.indexOf("data:image/png") == 0);
  },


  hex2rgb:  function (hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : {
      r: 0,
      g: 0,
      b: 0
    };
  },


  rgb_str:  function(rgb_obj, alpha) {
    return 'rgba(' + rgb_obj.r + ',' + rgb_obj.g + ',' + rgb_obj.b + ',' + alpha + ')';
  },



  main: function (src_img, color, alpha_factor) {
    if (!$(src_img).is('img')) return;  //if not image then move on

    alpha_factor = alpha_factor || 1;

    var color_rgb = this.hex2rgb(color);

    //var canvas = document.getElementById("b");
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");

    var w = src_img.width;
    var h = src_img.height;
    var d = Math.min(w, h);

    canvas.width = d;
    canvas.height = d+d/3;



    //define the clipping path
    context.save();
    context.beginPath();
    context.arc(d/2, d/2, d/2, 0, Math.PI * 2, false);
    context.clip();
    //draw image
    try {
      context.drawImage(src_img, 0, 0, w, h);
    }
    catch (err) {
      return; //some problem with this image: nothing to do
    }
    context.restore();  //end clipping path




    //radial gradient (inner glow)
    context.save();
    var gradient_innerglow = context.createRadialGradient(d/3, d/1.2, 0, d/2, d/2, d/2);
    gradient_innerglow.addColorStop(0.0, 'rgba(255,255,255,0)');
    gradient_innerglow.addColorStop(1.0, this.rgb_str(color_rgb, 0.9*alpha_factor));   //with transparency
    //draw
    context.fillStyle = gradient_innerglow;
    context.beginPath();
    context.arc(d/2, d/2, d/2, 0, Math.PI * 2, false);
    context.fill();
    context.restore();


    //top glow
    //linear gradient
    var gradient_linear = context.createLinearGradient(d/2, 0, d/2, d/2);
    gradient_linear.addColorStop(0.0, this.rgb_str({r:255,g:255,b:255}, 1*alpha_factor));
    gradient_linear.addColorStop(1.0, this.rgb_str({r:255,g:255,b:255}, 0.11*alpha_factor));
    //draw
    context.save();
    // scale context horizontally
    context.scale(1.25, 1);
    // draw circle which will be stretched into an oval
    context.beginPath();
    context.arc(d/2.5, d/3.5, d/4, 0, 2 * Math.PI, false);
    // restore to original state
    context.restore();
    // apply styling
    context.fillStyle = gradient_linear;
    context.fill();



    //shinning
    var x = d/3;
    var y = d/1.2;
    var r = d/7;
    context.save();
    var gradient_innerglow = context.createRadialGradient(x, y, 0, x, y, r);
    gradient_innerglow.addColorStop(0.0, 'rgba(255,255,255,1)');
    gradient_innerglow.addColorStop(1.0, 'rgba(255,255,255,0)');   //with transparency
    //draw
    context.fillStyle = gradient_innerglow;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.fill();
    context.restore();



    //shadow
    var elypse = function(that, cx, cy, rx, ry) {
      context.save();
      context.globalCompositeOperation = "destination-over";
      context.beginPath();
      context.fillStyle = '#fff';

      context.translate(cx-rx, cy-ry);
      context.scale(rx, ry);
      context.arc(1, 1, 1, 0, 2 * Math.PI, false);

      context.shadowColor = that.rgb_str(color_rgb, 0.5*alpha_factor);
      context.shadowBlur = 3*d/14;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 1.5*d/14;
      context.fill();
      context.restore();

    };
    elypse(this, d/2, d/1.35, d/2.7, d/4);  //shadow



    //copy canvas back to original img
    src_img.please_glow = false;  //do not fire load event again
    src_img.src = canvas.toDataURL("image/png");
    //correct width and height
    src_img.width = canvas.width;
    src_img.height = canvas.height;

    //cleanup
    canvas = null;

  }    //end main

}; //end magic_gloss namespace



$(function() {
  //main
  if (!magic_gloss.supports_ToDataURL()) {
    return; //quit if ToDataURL not supported by this browser
  }

  $("img[data-gloss]").each(function(i, obj) {
    $(obj).load(function() {
      if (this.please_glow != false) {
        var c = $(obj).attr("data-glosscolor");
        var a = $(obj).attr("data-glossalpha");
        magic_gloss.main(obj, c, a);
      }
    }).each(function() {
      if(obj.complete) $(obj).load();
    });
  });


});  //end magic_gloss






//jquery plugin
(function($){
  $.fn.glossify = function(options) {

    var that = this; //a reference to ourselves

    var settings = {
      color: "#000000",
      alpha: 1
    };
    settings = $.extend(settings, options || {});


    //main
    //magic_gloss.main(this[0], settings.color, settings.alpha);

    this.each(function(i, obj) {
      magic_gloss.main(obj, settings.color, settings.alpha);
    });


    return this;

  };
})(jQuery);