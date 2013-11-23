/**
 * User: mfernandes
 * Date: 22/11/13
 * Time: 14:42
 * To change this template use File | Settings | File Templates.
 */



$(function() {





  var magic_glow = function () {
    //var canvas = document.getElementById("b");
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");

    var src_img = document.getElementById("src-img");

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
    context.drawImage(src_img, 0, 0, d, d);
    context.restore();  //end clipping path




    //radial gradient (inner glow)
    context.save();
    var gradient_innerglow = context.createRadialGradient(d/3, d/1.2, 0, d/2, d/2, d/2);
    gradient_innerglow.addColorStop(0.0, 'rgba(255,255,255,0)');
    gradient_innerglow.addColorStop(1.0, 'rgba(0,0,255,0.9)');   //with transparency
    //draw
    context.fillStyle = gradient_innerglow;
    context.beginPath();
    context.arc(d/2, d/2, d/2, 0, Math.PI * 2, false);
    context.fill();
    context.restore();


    //top glow
    //linear gradient
    var gradient_linear = context.createLinearGradient(d/2, 0, d/2, d/2);
    gradient_linear.addColorStop(0.0, 'rgba(255,255,255,1)');
    gradient_linear.addColorStop(1.0, 'rgba(255,255,255,0.1)');
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




    var elypse = function(cx, cy, rx, ry) {
      context.save();
      context.globalCompositeOperation = "destination-over";
      context.beginPath();
      context.fillStyle = '#fff';

      context.translate(cx-rx, cy-ry);
      context.scale(rx, ry);
      context.arc(1, 1, 1, 0, 2 * Math.PI, false);

      context.shadowColor = 'rgba(0,0,255,0.5)';
      context.shadowBlur = 3*d/14;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 1.5*d/14;
      context.fill();
      context.restore();

    };
    elypse(d/2, d/1.3, d/2.7, d/4);  //shadow



    //copy canvas to original img
    var img = document.getElementById("src-img");
    img.please_glow = false;
    img.src = canvas.toDataURL("image/png");



  }    //end magic_glow



  //main
  $("#src-img").load(function() {
    if (this.please_glow != false)
      magic_glow();
  }).each(function() {
    if(this.complete) $(this).load();
  });

});