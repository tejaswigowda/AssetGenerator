var theImage;
var MAX_WIDTH = 320;
var MAX_HEIGHT = 320;



// Function
var imageUploaded = function() {
    //Checks if file is an image.
    var file = $('#uploadImage').get(0); // shortcut for js - document.getElementById("uploadImage").get(0);
    if (file.files[0].type.split("/")[0].toLowerCase() != "image") {
        alert("Incorrect file type -- Please ensure you are uploading an image file.");
        return;
    }
    $("#ipWrapper").css({
        "display": ""
    })
    $("#dimensionDiv, #colorDiv").css({
            "display": "block"
        })
        // Uploads image and sets it to the appropriate width and height.
        // Uses dimensions from selectChanged function.
    if (file.files && file.files[0] && file.files[0].type.split("/")[0].toLowerCase() === "image") {
        var FR = new FileReader();

        FR.onload = function(e) {
            var data = e.target.result;
            var img = document.createElement("img");

            img.onload = function() {

                theImage = img;
                renderImage();

            }
            img.src = data;
        };

        FR.readAsDataURL(file.files[0]);
    }
}

function renderImage() {
    var imageOffsetXpercent = parseFloat(document.getElementById("ioX").value)
    var imageOffsetYpercent = parseFloat(document.getElementById("ioY").value)
    var canvas = document.createElement("canvas");
    // Uploaded image dimensions
    var width = theImage.width;
    var height = theImage.height;

    // Canvas dimensions
    var canvasW = MAX_WIDTH;
    var canvasH = MAX_HEIGHT;

    // Resize image dimensions
    var desiredW;
    var desiredH;


    // testing for landscape or portrait image dimensions
    if (theImage.width > theImage.height) { // image is landscape
        // Testing if image width is larger than canvas width then shrinks theImage to fit
        if (theImage.width > MAX_WIDTH) {
            canvasW = MAX_WIDTH;

            desiredW = canvasW;
            desiredH = (theImage.height * desiredW) / theImage.width
        } else {
            desiredW = theImage.width;
            desiredH = theImage.height;
        }
    } else {
        // Testing if image height is larger than canvas height. Then shrinks to fit
        if (theImage.height > MAX_HEIGHT) { // image is portrait
            canvasH = MAX_HEIGHT;

            desiredH = canvasH;
            desiredW = (theImage.width * desiredH) / theImage.height;
        } else {
            desiredW = theImage.width;
            desiredH = theImage.height;
        }
    }



    // ----- Canvas Options ///
    canvas.width = canvasW;
    canvas.height = canvasH;


    var ctx = canvas.getContext("2d");


    // Logic for background color fill
    var x = document.getElementById("gradCheck").checked;
    var colorPickedPrimary = $("#color_picker").spectrum("get").toHexString();
    var colorPickedSecondary = $("#color_picker1").spectrum("get").toHexString();
    var offsetXp = parseFloat(document.getElementById("goX").value);
    var offsetYp = parseFloat(document.getElementById("goY").value);
    var goffX = canvasW * offsetXp / 100;
    var goffY = canvasH * offsetYp / 100;

    if (x == true) {
        $("#gradType").show();
        $('#gradWrapper').show();

        if (parseInt($('#gradType').val()) == 0) {
            var gradient = ctx.createRadialGradient(goffX, goffY, 5, 100, 100, canvasH);
            gradient.addColorStop(offsetXp / 100, colorPickedPrimary);
            gradient.addColorStop(offsetYp / 100, colorPickedSecondary);
            ctx.fillStyle = gradient;
            ctx.fillRect(10, 10, canvasW, canvasH);

        } else if (parseInt($('#gradType').val()) == 1) {
            var gradient = ctx.createLinearGradient(0, 0, 0, canvasH);
            gradient.addColorStop(offsetXp / 100, colorPickedPrimary);
            gradient.addColorStop(offsetYp / 100, colorPickedSecondary);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasW, canvasH);

        } else if (parseInt($('#gradType').val()) == 2) {
            var gradient = ctx.createLinearGradient(0, 0, canvasH, 0);
            gradient.addColorStop(offsetXp / 100, colorPickedPrimary);
            gradient.addColorStop(offsetYp / 100, colorPickedSecondary);
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvasW, canvasH);

        } else if (parseInt($('#gradType').val()) == 3) {
            ctx.fillStyle = colorPickedPrimary;
            ctx.fillRect(0, 0, canvasW, canvasH);
        }
    } else {
        $("#gradType").hide();
        $('#gradWrapper').hide();
        ctx.fillStyle = colorPickedPrimary;
        ctx.fillRect(0, 0, canvasW, canvasH);
    }


    // Zooming
    var zoom = document.getElementById("zoom").value;
    var zp = parseFloat(zoom) / 100;

    desiredW = desiredW * zp;
    desiredH = desiredH * zp;


    // Place image
    var posX = (canvasW - desiredW) * imageOffsetXpercent / 100;
    var posY = (canvasH - desiredH) * imageOffsetYpercent / 100;
    ctx.drawImage(theImage, posX, posY, desiredW, desiredH);


    var base64St = canvas.toDataURL("image/png");
    document.getElementById("imagePreview").src = base64St;
    document.getElementById("uploadWrapperBG").style.backgroundImage = "url(" + theImage.currentSrc + ")";
    document.getElementById("imagePreview").style.height = MAX_HEIGHT + "px";
    document.getElementById("imagePreview").style.width = MAX_WIDTH + "px";

}

/* Function, gets value and sets dimensions */
function selectChanged() {
    if ($("#theSelect").val() == 'custom') {
        $("#customWrapper").show();
        renderImage();
    } else {
        $("#customWrapper").hide();
        var dimensions = $("#theSelect").val().split("x");
        MAX_WIDTH = parseFloat(dimensions[0]);
        MAX_HEIGHT = parseFloat(dimensions[1]);
        renderImage();

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


function start() {
    $("#ipWrapper, #dimensionDiv, #colorDiv").css({
        display: "none"
    })


    var button = document.getElementById("gradCheck").addEventListener("click", imageUploaded);

    document.getElementById("theSelect").value = "320x320"

    $("#color_picker").spectrum({
        change: function(color) {
            imageUploaded();
        },
        move: function(color) {
            imageUploaded();
        },
        showAlpha: false,
        clickoutFiresChange: true,
        hideAfterPaletteSelect: true,
        cancelText: "",
        chooseText: ""
    })
    $("#color_picker1").spectrum({
        change: function(color) {
            imageUploaded();
        },
        move: function(color) {
            imageUploaded();
        },
        clickoutFiresChange: true,
        hideAfterPaletteSelect: true,
        cancelText: "",
        chooseText: ""
    })
    VMasker(document.querySelector(".inp100")).maskNumber();
    VMasker(document.querySelector(".inp1000")).maskAlphaNum();

}
