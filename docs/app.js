let assets=[];


let settings = JSON.parse(
localStorage.getItem("VAL_settings")
)
||
{
gif:true,
png:true,
jpg:true,
webp:true,
mp4:true
};



function loadSettings(){

gifToggle.checked=settings.gif;
pngToggle.checked=settings.png;
jpgToggle.checked=settings.jpg;
webpToggle.checked=settings.webp;
mp4Toggle.checked=settings.mp4;

}



function saveSettings(){

settings={

gif:gifToggle.checked,
png:pngToggle.checked,
jpg:jpgToggle.checked,
webp:webpToggle.checked,
mp4:mp4Toggle.checked

};


localStorage.setItem(
"VAL_settings",
JSON.stringify(settings)
);


displayResults(assets);

}



document
.querySelectorAll("#settingsPanel input")
.forEach(x=>{

x.addEventListener(
"change",
saveSettings
);

});



settingsButton.onclick=function(){

let panel=document.getElementById(
"settingsPanel"
);


panel.style.display =
panel.style.display==="block"
?
"none"
:
"block";

};




fetch("search.json")

.then(r=>r.json())

.then(data=>{

assets=data;

displayResults(data);

})

.catch(()=>{

results.innerHTML="Failed loading database";

});




search.addEventListener(
"input",
function(){

let q=this.value.toLowerCase();


let filtered=assets.filter(item=>

item.name.toLowerCase().includes(q)

||

item.category.toLowerCase().includes(q)

||

item.status.toLowerCase().includes(q)

);


displayResults(filtered);

});




function copyText(text,button){

navigator.clipboard.writeText(text);

button.innerText="Copied";

setTimeout(()=>{

button.innerText="Copy Raw Asset Link";

},1500);

}





function allowedPreview(ext){

if(ext==="gif") return settings.gif;

if(ext==="png") return settings.png;

if(ext==="jpg" || ext==="jpeg") return settings.jpg;

if(ext==="webp") return settings.webp;

if(ext==="mp4") return settings.mp4;

return false;

}




function displayResults(data){


let box=document.getElementById("results");

box.innerHTML="";


data.forEach(item=>{


let html=`


<div class="card">


<h2>${item.name}</h2>


<p>
Category: ${item.category}
</p>


<p class="${item.status==="Complete"?"complete":"dev"}">

Status: ${item.status}

</p>


`;



if(item.status==="Complete"){


item.assets.forEach(url=>{


let ext=url.split(".").pop().toLowerCase();


html+=`

<div class="asset">


<h3>${ext.toUpperCase()}</h3>

`;



if(allowedPreview(ext)){


if(
ext==="gif" ||
ext==="png" ||
ext==="jpg" ||
ext==="jpeg" ||
ext==="webp"
){

html+=`

<img class="preview" src="${url}" loading="lazy">

`;

}


if(ext==="mp4"){

html+=`

<video class="preview" controls>

<source src="${url}">

</video>

`;

}


}



html+=`

<button class="copy" onclick='copyText(${JSON.stringify(url)},this)'>

Copy Raw Asset Link

</button>


</div>

`;

});


}

else{


html+=`

<p>
No assets available yet.
</p>

`;

}



html+=`

</div>

`;


box.innerHTML+=html;


});


}




loadSettings();