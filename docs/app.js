let assets = [];

let visibleCount = 10;

let currentTab = "all";


let settings =
JSON.parse(localStorage.getItem("VAL_settings"))
||
{
    gif: true,
    png: true,
    jpg: true,
    webp: true,
    mp4: true
};



const search = document.getElementById("search");
const results = document.getElementById("results");

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");

const gifToggle = document.getElementById("gifToggle");
const pngToggle = document.getElementById("pngToggle");
const jpgToggle = document.getElementById("jpgToggle");
const webpToggle = document.getElementById("webpToggle");
const mp4Toggle = document.getElementById("mp4Toggle");

const loadMore = document.getElementById("loadMore");



function saveSettings(){

    settings = {

        gif: gifToggle.checked,
        png: pngToggle.checked,
        jpg: jpgToggle.checked,
        webp: webpToggle.checked,
        mp4: mp4Toggle.checked

    };


    localStorage.setItem(
        "VAL_settings",
        JSON.stringify(settings)
    );


    displayResults(assets);

}



function loadSettings(){

    gifToggle.checked = settings.gif;

    pngToggle.checked = settings.png;

    jpgToggle.checked = settings.jpg;

    webpToggle.checked = settings.webp;

    mp4Toggle.checked = settings.mp4;

}




document
.querySelectorAll("#settingsPanel input")
.forEach(input => {

    input.addEventListener(
        "change",
        saveSettings
    );

});




settingsButton.onclick = function(e){

    e.stopPropagation();


    if(settingsPanel.style.display === "block"){

        settingsPanel.style.display = "none";

    }

    else {

        settingsPanel.style.display = "block";

    }

};





document.addEventListener(
"click",
function(e){


    if(

        !settingsPanel.contains(e.target)

        &&

        e.target !== settingsButton

    ){

        settingsPanel.style.display = "none";

    }


});






fetch("search.json?v=3")


.then(response => response.json())


.then(data => {


    assets = data;


    displayResults(assets);


})


.catch(error => {


    console.error(error);


    results.innerHTML =
    "Failed loading database";


});






search.addEventListener(
"input",
function(){

    visibleCount = 10;

    displayResults(assets);

});







document
.querySelectorAll(".tab")
.forEach(button => {


    button.onclick = function(){


        document
        .querySelectorAll(".tab")
        .forEach(x =>
            x.classList.remove("active")
        );


        this.classList.add("active");


        currentTab =
        this.dataset.tab;


        visibleCount = 10;


        displayResults(assets);


    };


});






loadMore.onclick = function(){


    visibleCount += 10;


    displayResults(assets);


};







function getExt(url){


    return url
    .split(".")
    .pop()
    .split("?")[0]
    .toLowerCase();


}







function copyText(text, button){


    navigator.clipboard.writeText(text);


    button.innerText =
    "Copied";


    setTimeout(
        () => {

            button.innerText =
            "Copy Raw Asset Link";

        },
        1500
    );


}







function previewEnabled(ext){


    if(ext === "gif")
        return settings.gif;


    if(ext === "png")
        return settings.png;


    if(ext === "jpg" || ext === "jpeg")
        return settings.jpg;


    if(ext === "webp")
        return settings.webp;


    if(ext === "mp4")
        return settings.mp4;


    return false;


}








function displayResults(data){


    let query =
    search.value
    .toLowerCase()
    .trim();




    let filtered =
    data.filter(item => {


        return (

            item.name
            .toLowerCase()
            .includes(query)

            ||

            item.category
            .toLowerCase()
            .includes(query)

        );


    });






    if(currentTab === "complete"){


        filtered =
        filtered.filter(
            x => x.status === "Complete"
        );


    }



    if(currentTab === "development"){


        filtered =
        filtered.filter(
            x => x.status === "In Development"
        );


    }



    if(currentTab === "notstarted"){


        filtered =
        filtered.filter(
            x => x.status === "Not Started"
        );


    }





    let total =
    filtered.length;



    filtered =
    filtered.slice(
        0,
        visibleCount
    );





    results.innerHTML = "";





    filtered.forEach(item => {



        let html = `

        <div class="card">

        <h2>${item.name}</h2>


        <p>
        Category: ${item.category}
        </p>


        <p>
        Status: ${item.status}
        </p>

        `;





        if(item.assets && item.assets.length){



            let sorted =
            [...item.assets]
            .sort((a,b)=>{


                let order = [

                    "gif",
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "mp4"

                ];


                return (

                    order.indexOf(getExt(a))

                    -

                    order.indexOf(getExt(b))

                );


            });





            sorted.forEach(url => {


                let ext =
                getExt(url);





                html += `

                <div class="asset">


                <h3>
                ${ext.toUpperCase()} Preview
                </h3>

                `;






                if(previewEnabled(ext)){



                    if(
                    ext === "mp4"
                    ){

                        html += `

                        <video
                        class="preview"
                        controls>

                        <source src="${url}">

                        </video>

                        `;


                    }

                    else {


                        html += `

                        <img
                        class="preview"
                        src="${url}">

                        `;


                    }


                }




                html += `


                <button
                class="copy"
                onclick='copyText(${JSON.stringify(url)},this)'>

                Copy Raw Asset Link

                </button>


                </div>


                `;



            });



        }


        else {


            html += `

            <p>
            No assets available yet.
            </p>

            `;


        }





        html += `

        </div>

        `;



        results.innerHTML += html;



    });





    if(total > visibleCount){


        loadMore.style.display = "block";


    }

    else {


        loadMore.style.display = "none";


    }



}







loadSettings();