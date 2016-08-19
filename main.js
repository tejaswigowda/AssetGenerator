
        var data77;
        var MAX_WIDTH = 100;
        var MAX_HEIGHT = 100;


        // Function
        var imageUploaded = function() {
            //Checks if file is an image.
            var file = $('#uploadImage').get(0); // shortcut for js - document.getElementById("uploadImage").get(0);
            if (file.files[0].type.split("/")[0].toLowerCase() != "image") {
                alert("Incorrect file type -- Please ensure you are uploading an image file.");
                return;
            }
            $("#ipWrapper, #dimensionDiv, #colorDiv").slideDown();
            // Uploads image and sets it to the appropriate width and height.
            // Uses dimensions from selectChanged function.
            if (file.files && file.files[0] && file.files[0].type.split("/")[0].toLowerCase() === "image") {
                var FR = new FileReader();

                FR.onload = function(e) {
                    var data = e.target.result;
                    var canvas = document.createElement("canvas");
                    var img = document.createElement("img");

                    img.onload = function() {

                        // Uploaded image dimensions
                        var width = img.width;
                        var height = img.height;

                        // Canvas dimensions
                        var canvasW = MAX_WIDTH;
                        var canvasH = MAX_HEIGHT;

                        // Resize image dimensions
                        var desiredW;
                        var desiredH;


                        // testing for landscape or portrait image dimensions
                        if (img.width > img.height) { // image is landscape
                            // Testing if image width is larger than canvas width then shrinks img to fit
                            if (img.width > MAX_WIDTH) {
                                canvasW = MAX_WIDTH;

                                desiredW = canvasW;
                                desiredH = (img.height * desiredW) / img.width
                            } else {
                                desiredW = img.width;
                                desiredH = img.height;
                            }
                        } else {
                            // Testing if image height is larger than canvas height. Then shrinks to fit
                            if (img.height > MAX_HEIGHT) { // image is portrait
                                canvasH = MAX_HEIGHT;

                                desiredH = canvasH;
                                desiredW = (img.width * desiredH) / img.height;
                            } else {
                                desiredW = img.width;
                                desiredH = img.height;
                            }
                        }



                        // ----- Canvas Options ///
                        canvas.width = canvasW;
                        canvas.height = canvasH;

                        data77 = img;
                        console.log(canvasW, canvasH)
                        console.log(width, height)
                        console.log(desiredW, desiredH)

                        var ctx = canvas.getContext("2d");


                        // Logic for background color fill
                        var x = document.getElementById("gradCheck").checked;
                        var colorPickedPrimary = $("#color_picker").spectrum("get").toHexString();
                        var colorPickedSecondary = $("#color_picker1").spectrum("get").toHexString();

                        if (x == true){
                            $("#gradType").show();
                            $('#gradWrapper').show();

                            if (parseInt($('#gradType').val()) == 0) {
                                var gradient = ctx.createRadialGradient(100,100,5,100,100,200);
                                gradient.addColorStop(.0,colorPickedPrimary);
                                gradient.addColorStop(1,colorPickedSecondary);
                                ctx.fillStyle = gradient;
                                ctx.fillRect(10,10,canvasW,canvasH);

                            }else if (parseInt($('#gradType').val()) == 1){
                                var gradient = ctx.createLinearGradient(0,0,0,canvasH);
                                gradient.addColorStop(.0,colorPickedPrimary);
                                gradient.addColorStop(1,colorPickedSecondary);
                                ctx.fillStyle = gradient;
                                ctx.fillRect(0,0,canvasW,canvasH);

                            }else if (parseInt($('#gradType').val()) == 2){
                                var gradient = ctx.createLinearGradient(0,0,canvasH,0);
                                gradient.addColorStop(.0,colorPickedPrimary);
                                gradient.addColorStop(1,colorPickedSecondary);
                                ctx.fillStyle = gradient;
                                ctx.fillRect(0,0,canvasW,canvasH);

                            }else if (parseInt($('#gradType').val()) == 3){
                              ctx.fillStyle = colorPickedPrimary;
                              ctx.fillRect(0, 0, canvasW, canvasH);
                            }
                        }else{
                            $("#gradType").hide();
                            $('#gradWrapper').hide();
                            ctx.fillStyle = colorPickedPrimary;
                            ctx.fillRect(0, 0, canvasW, canvasH);
                        }


                        // Place image
                        ctx.drawImage(img, (canvasW - desiredW) / 2, (canvasH - desiredH) / 2, desiredW, desiredH);

                        // Zooming
                        var zoom = document.getElementById("zoom").value;
                        var zp = parseFloat(zoom) / 100;
                        desiredW = desiredW * zp;
                        desiredH = desiredH * zp;

                        var base64St = canvas.toDataURL("image/png");
                        document.getElementById("imagePreview").src = base64St;
                        document.getElementById("uploadWrapperBG").style.backgroundImage = "url(" + img.currentSrc + ")";
                        document.getElementById("imagePreview").style.height = MAX_HEIGHT + "px";
                        document.getElementById("imagePreview").style.width = MAX_WIDTH + "px";
                    }
                    img.src = data;
                };

                FR.readAsDataURL(file.files[0]);
            }
        }



        /* Function, gets value and sets dimensions */
        function selectChanged() {
            if ($("#theSelect").val() == 'custom') {
                $("#customWrapper").show();
                imageUploaded();
            } else {
              $("#customWrapper").hide();
                var dimensions = $("#theSelect").val().split("x");
                MAX_WIDTH = parseFloat(dimensions[0]);
                MAX_HEIGHT = parseFloat(dimensions[1]);
                imageUploaded();

            }
        }


        // .....
        function customButtonClicked() {
            $("#customWrapper").show();
            var custom_width = $("#custom_width").val();
            var custom_height = $("#custom_height").val();

            MAX_WIDTH = custom_width;
            MAX_HEIGHT = custom_height;
            imageUploaded();
        }

        function gradChanged() {
          //var value;


        }

        function gradButtonClicked() {
            imageUploaded();

        }

        // // Gadient checkbox
        // function gradCheck(){
        //   //alert ("Hello World!");
        //   // var x = document.getElementById("gradCheck").checked;
        //   // if (x == true){
        //   //     $("#gradType").show();
        //   //     $('#gradWrapper').show();
        //   //
        //   //
        //   // }else{
        //   //     $("#gradType").hide();
        //   //     $('#gradWrapper').hide();
        //   //
        //   // }
        //
        // }



        function start() {

            var button = document.getElementById("gradCheck").addEventListener("click", imageUploaded);

            document.getElementById("theSelect").value = "320x320"

            $("#color_picker").spectrum({
                change: function(color) {
                imageUploaded();
                },
                showAlpha: false,
                cancelText: "test"
            })
            $("#color_picker1").spectrum({
                change: function(color) {
                imageUploaded();
                },
                showAlpha: false,
                cancelText: "test"
            })
            VMasker(document.querySelector(".inp100")).maskNumber();
            VMasker(document.querySelector(".inp1000")).maskAlphaNum();

        }
