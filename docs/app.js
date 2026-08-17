let assets = [];
let popularity = {};

let visibleCount = 10;
let currentTab = "all";

let settings =
JSON.parse(
    localStorage.getItem("VAL_settings")
)
||
{
    gif:true,
    png:true,
    jpg:true,
    jpeg:true,
    webp:true,
    mp4:true
};


const search = document.getElementById("search");
const results = document.getElementById("results");
const loadMore = document.getElementById("loadMore");

const settingsButton = document.getElementById("settingsButton");
const settingsPanel = document.getElementById("settingsPanel");


const toggles = {

    gif: document.getElementById("gifToggle"),
    png: document.getElementById("pngToggle"),
    jpg: document.getElementById("jpgToggle"),
    jpeg: document.getElementById("jpegToggle"),
    webp: document.getElementById("webpToggle"),
    mp4: document.getElementById("mp4Toggle")

};



function saveSettings(){

    settings = {

        gif: toggles.gif.checked,
        png: toggles.png.checked,
        jpg: toggles.jpg.checked,
        jpeg: toggles.jpeg.checked,
        webp: toggles.webp.checked,
        mp4: toggles.mp4.checked

    };


    localStorage.setItem(
        "VAL_settings",
        JSON.stringify(settings)
    );


    displayResults(assets);

}




function loadSettings(){

    Object.keys(toggles)
    .forEach(type=>{

        if(toggles[type]){

            toggles[type].checked =
            settings[type];

        }

    });

}





Object.values(toggles)
.forEach(toggle=>{

    if(toggle){

        toggle.addEventListener(
            "change",
            saveSettings
        );

    }

});





settingsButton.addEventListener(
"click",
function(e){

    e.stopPropagation();


    settingsPanel.style.display =

    settingsPanel.style.display === "block"

    ?

    "none"

    :

    "block";


});





document.addEventListener(
"click",
function(e){

    if(

        !settingsPanel.contains(e.target)

        &&

        e.target !== settingsButton

    ){

        settingsPanel.style.display="none";

    }


});






fetch("search.json?v=7")
.then(response => response.json())
.then(data => {

    assets = data;

    displayResults(assets);

})
.catch(error => {

    console.error(error);

    results.innerHTML = `
        <p>
        Failed loading database
        </p>
    `;

});

.then(data=>{


    assets = data[0];

    popularity = data[1];


    displayResults(assets);


})

.catch(error=>{


    console.error(error);


    results.innerHTML =

    `
    <p>
    Failed loading database
    </p>
    `;


});





search.addEventListener(
"input",
()=>{

    visibleCount = 10;

    displayResults(assets);

});document
.querySelectorAll(".tab")
.forEach(button=>{

    button.addEventListener(
    "click",
    function(){


        document
        .querySelectorAll(".tab")
        .forEach(tab=>{

            tab.classList.remove("active");

        });



        this.classList.add("active");


        currentTab =
        this.dataset.tab;


        visibleCount = 10;


        displayResults(assets);


    });

});






loadMore.addEventListener(
"click",
()=>{

    visibleCount += 10;

    displayResults(assets);

});







function getExt(url){

    return url
    .split("?")[0]
    .split(".")
    .pop()
    .toLowerCase();

}






function copyText(text,button){

    navigator.clipboard.writeText(text);


    button.innerText="Copied";


    setTimeout(()=>{

        button.innerText =
        "Copy Raw Asset Link";

    },1500);


}







function previewEnabled(ext){

    return settings[ext] === true;

}






function getStatusPriority(status){

    if(status === "Complete")
        return 0;

    return 1;

}






function getPopularity(name,category){


    if(

        popularity[category]

        &&

        popularity[category][name]

    ){

        return popularity[category][name];

    }


    return 9999;


}







function displayResults(data){


    let query =
    search.value
    .toLowerCase()
    .trim();




    let filtered =
    data.filter(item=>{


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
            x=>x.status==="Complete"
        );


    }


    else if(currentTab === "notstarted"){


        filtered =
        filtered.filter(
            x=>x.status==="Not Started"
        );


    }


    else if(

        [

            "Streaming Platforms",
            "TV Collections",
            "Studios",
            "Franchises",
            "Networks"

        ]

        .includes(currentTab)

    ){


        filtered =
        filtered.filter(
            x=>x.category===currentTab
        );


    }







    filtered.sort(
    (a,b)=>{


        let status =

        getStatusPriority(a.status)

        -

        getStatusPriority(b.status);



        if(status !== 0){

            return status;

        }




        return (

            getPopularity(
                a.name,
                a.category
            )

            -

            getPopularity(
                b.name,
                b.category
            )

        );


    });






    let total =
    filtered.length;



    filtered =
    filtered.slice(
        0,
        visibleCount
    );





    results.innerHTML = "";





    filtered.forEach(item=>{


        let html =

        `

        <div class="card">


        <h2>
        ${item.name}
        </h2>


        <p>
        Category: ${item.category}
        </p>


        <p>
        Status: ${item.status}
        </p>


        `;



        if(

            item.assets

            &&

            item.assets.length

        ){


            let sorted =
            [...item.assets];



            let order = [

                "gif",
                "png",
                "jpg",
                "jpeg",
                "webp",
                "mp4"

            ];



            sorted.sort(
            (a,b)=>{


                return (

                    order.indexOf(getExt(a))

                    -

                    order.indexOf(getExt(b))

                );


            });


            sorted.forEach(url=>{


                let ext =
                getExt(url);


                html +=

                `

                <div class="asset">


                <h3>
                ${ext.toUpperCase()} Preview
                </h3>

                `;



                if(previewEnabled(ext)){


                    if(ext === "mp4"){


                        html +=

                        `

                        <video
                        class="preview"
                        controls
                        loading="lazy">

                        <source src="${url}">

                        </video>

                        `;


                    }

                    else{


                        html +=

                        `

                        <img
                        class="preview"
                        loading="lazy"
                        src="${url}">

                        `;


                    }


                }                html +=

                `

                <button
                class="copy"
                onclick='copyText(${JSON.stringify(url)},this)'>

                Copy Raw Asset Link

                </button>


                </div>

                `;


            });


        }

        else{


            html +=

            `

            <p>
            No assets available yet.
            </p>

            `;


        }





        html +=

        `

        </div>

        `;



        results.innerHTML += html;



    });






    if(total > visibleCount){


        loadMore.style.display="block";


    }

    else{


        loadMore.style.display="none";


    }



}






loadSettings();


// GUIDE & TROUBLESHOOTING PANELS

const guideButton =
document.getElementById("guideButton");

const guidePanel =
document.getElementById("guidePanel");

const closeGuide =
document.getElementById("closeGuide");


const troubleshootButton =
document.getElementById("troubleshootButton");

const troubleshootPanel =
document.getElementById("troubleshootPanel");

const closeTroubleshoot =
document.getElementById("closeTroubleshoot");



function openPanel(panel){

    if(!panel) return;


    if(guidePanel && guidePanel !== panel){

        guidePanel.classList.remove("active");

    }


    if(troubleshootPanel && troubleshootPanel !== panel){

        troubleshootPanel.classList.remove("active");

    }


    panel.classList.add("active");

    document.body.style.overflow="hidden";

}



function closePanel(panel){

    if(!panel) return;

    panel.classList.remove("active");

    document.body.style.overflow="";

}



if(guideButton && guidePanel){

    guideButton.addEventListener(
        "click",
        (e)=>{

            e.preventDefault();

            openPanel(guidePanel);

        }
    );

}



if(closeGuide && guidePanel){

    closeGuide.addEventListener(
        "click",
        ()=>{

            closePanel(guidePanel);

        }
    );

}



if(troubleshootButton && troubleshootPanel){

    troubleshootButton.addEventListener(
        "click",
        (e)=>{

            e.preventDefault();

            openPanel(troubleshootPanel);

        }
    );

}



if(closeTroubleshoot && troubleshootPanel){

    closeTroubleshoot.addEventListener(
        "click",
        ()=>{

            closePanel(troubleshootPanel);

        }
    );

}



if(guidePanel){

    guidePanel.addEventListener(
        "click",
        (e)=>{

            if(e.target === guidePanel){

                closePanel(guidePanel);

            }

        }
    );

}



if(troubleshootPanel){

    troubleshootPanel.addEventListener(
        "click",
        (e)=>{

            if(e.target === troubleshootPanel){

                closePanel(troubleshootPanel);

            }

        }
    );

}
