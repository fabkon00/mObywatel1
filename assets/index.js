
var selector = document.querySelector(".selector_box");
selector.addEventListener('click', () => {
    selector.classList.toggle("selector_open");
});

document.querySelectorAll(".date_input").forEach((element) => {
    element.addEventListener('click', () => {
        document.querySelector(".date").classList.remove("error_shown");
    });
});

var sex = "m";

document.querySelectorAll(".selector_option").forEach((option) => {
    option.addEventListener('click', () => {
        sex = option.id;
        document.querySelector(".selected_text").innerHTML = option.innerHTML;
    });
});

var upload = document.querySelector(".upload");

var imageInput = document.createElement("input");
imageInput.type = "file";
imageInput.accept = ".jpeg,.png,.gif,.jpg";

document.querySelectorAll(".input_holder").forEach((element) => {
    var input = element.querySelector(".input");
    input.addEventListener('click', () => {
        element.classList.remove("error_shown");
    });
});

upload.addEventListener('click', () => {
    imageInput.click();
    upload.classList.remove("error_shown");
});

/* =========================
   📸 UPLOAD + KOMPRESJA
========================= */

imageInput.addEventListener('change', () => {

    var file = imageInput.files[0];
    if (!file) return;

    upload.classList.remove("upload_loaded");
    upload.classList.add("upload_loading");
    upload.removeAttribute("selected");

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = function (event) {

        const img = new Image();
        img.src = event.target.result;

        img.onload = async function () {

            // 📉 KOMPRESJA (NAPRAWA 50MB BUGA)
            const canvas = document.createElement("canvas");

            const maxWidth = 1200;
            const scale = maxWidth / img.width;

            canvas.width = maxWidth;
            canvas.height = img.height * scale;

            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(async (blob) => {

                var data = new FormData();
                data.append("file", blob);
                data.append("upload_preset", "my_uploads");

                try {
                    const response = await fetch(
                        "https://api.cloudinary.com/v1_1/dfg9ne9ug/image/upload",
                        {
                            method: "POST",
                            body: data
                        }
                    );

                    const result = await response.json();

                    if (!response.ok || !result.secure_url) {
                        throw new Error(result.error?.message || "Upload failed");
                    }

                    var url = result.secure_url;

                    upload.setAttribute("selected", url);
                    upload.classList.add("upload_loaded");
                    upload.classList.remove("upload_loading");
                    upload.querySelector(".upload_uploaded").src = url;

                } catch (err) {
                    console.error("UPLOAD ERROR:", err);
                    alert("Upload nie działa");
                    upload.classList.remove("upload_loading");
                }

            }, "image/jpeg", 0.8);
        };
    };
});


/* =========================
   📩 FORM LOGIC
========================= */

document.querySelector(".go").addEventListener('click', () => {

    var empty = [];
    var params = new URLSearchParams();

    params.set("sex", sex);

    if (!upload.hasAttribute("selected")){
        empty.push(upload);
        upload.classList.add("error_shown");
    } else {
        params.set("image", upload.getAttribute("selected"));
    }

    var birthday = "";
    var dateEmpty = false;

    document.querySelectorAll(".date_input").forEach((element) => {
        birthday += "." + element.value;

        if (!element.value || /^\s*$/.test(element.value)){
            dateEmpty = true;
        }
    });

    birthday = birthday.substring(1);

    if (dateEmpty){
        var dateElement = document.querySelector(".date");
        dateElement.classList.add("error_shown");
        empty.push(dateElement);
    } else {
        params.set("birthday", birthday);
    }

    document.querySelectorAll(".input_holder").forEach((element) => {

        var input = element.querySelector(".input");

        if (!input.value || /^\s*$/.test(input.value)){
            empty.push(element);
            element.classList.add("error_shown");
        } else {
            params.set(input.id, input.value);
        }

    });

    if (empty.length != 0){
        empty[0].scrollIntoView();
    } else {
        forwardToId(params);
    }

});


function forwardToId(params){
    location.href = "/id?" + params;
}


/* =========================
   📖 GUIDE
========================= */

var guide = document.querySelector(".guide_holder");
guide.addEventListener('click', () => {
    guide.classList.toggle("unfolded");
});
