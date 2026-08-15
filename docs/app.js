let assets=[];

let visibleCount=10;

let currentTab="all";


let settings=
JSON.parse(localStorage.getItem("VAL_settings"))
||
{
gif:true,
png:true,
jpg:true,
webp:true,
mp4:true
};



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



function loadSettings(){

gifToggle.checked=settings.gif;

pngToggle.checked=settings.png;

jpgToggle.checked=settings.jpg;

webpToggle.checked=settings.webp;

mp4Toggle.checked=settings.mp4;

}



document
.querySelectorAll("#settingsPanel input")
.forEach(x=>x.addEventListener("change",saveSettings));



settingsButton.onclick=function(e){

e.stopPropagation();

settingsPanel.style.display=
settingsPanel.style.display==="block"
?
"none"
:
"block";

};



document.addEventListener("click",function(e){

if(
!settingsPanel.contains(e.target)
&&
e.target!==settingsButton
){

settingsPanel.style.display="none";

}

});




fetch("search.json")

.then(r=>r.json())

.then(data=>{

assets=data;

displayResults(data);

});




search.addEventListener("input",function(){

displayResults(assets);

});





document.querySelectorAll(".tab")
.forEach(button=>{


button.onclick=function(){


document.querySelectorAll(".tab")
.forEach(x=>x.classList.remove("active"));


this.classList.add("active");


currentTab=this.dataset.tab;


visibleCount=10;


displayResults(assets);


};


});





loadMore.onclick=function(){

visibleCount+=10;

displayResults(assets);

};





function getExt(url){

return url.split(".").pop().toLowerCase();

}




function copyText(text,btn){

navigator.clipboard.writeText(text);

btn.innerText="Copied";

setTimeout(()=>btn.innerText="Copy Raw Asset Link",1500);

}





function displayResults(data){


let query=search.value.toLowerCase();



let filtered=data.filter(item=>

item.name.toLowerCase().includes(query)

||
item.category.toLowerCase().includes(query)

);



if(currentTab==="complete")

filtered=filtered.filter(x=>x.status==="Complete");


if(currentTab==="development")

filtered=filtered.filter(x=>x.status==="In Development");


if(currentTab==="notstarted")

filtered=filtered.filter(x=>x.status==="Not Started");



filtered=filtered.slice(0,visibleCount);



results.innerHTML="";



filtered.forEach(item=>{


let html=`

<div class="card">

<h2>${item.name}</h2>

<p>${item.category}</p>

<p class="${item.status.toLowerCase().replaceAll(" ","")}">
Status: ${item.status}
</p>

`;



if(item.assets){


let sorted=[...item.assets].sort((a,b)=>{


let order=["gif","png","jpg","jpeg","webp","mp4"];

return order.indexOf(getExt(a))
-
order.indexOf(getExt(b));


});



sorted.forEach(url=>{


let ext=getExt(url);


html+=`

<div class="asset">

<h3>${ext.toUpperCase()} Preview</h3>

`;



if(
(ext==="gif"&&settings.gif)
||
(ext==="png"&&settings.png)
||
((ext==="jpg"||ext==="jpeg")&&settings.jpg)
||
(ext==="webp"&&settings.webp)
){


html+=`

<img class="preview" src="${url}">

`;

}



html+=`

<button class="copy"
onclick='copyText(${JSON.stringify(url)},this)'>

Copy Raw Asset Link

</button>

</div>

`;

});


}


html+="</div>";


results.innerHTML+=html;


});


}



loadSettings();(

(a,b)=>{


let extA=getExtension(a);

let extB=getExtension(b);



return priority.indexOf(extA)
-
priority.indexOf(extB);


}

);






sortedAssets.forEach(url=>{


let ext=getExtension(url);



html+=`


<div class="asset">


<h3>
${ext.toUpperCase()} Preview
</h3>


`;



if(allowedPreview(ext)){



if(

ext==="gif"

||

ext==="png"

||

ext==="jpg"

||

ext==="jpeg"

||

ext==="webp"

){


html+=`

<img

class="preview"

src="${url}"

loading="lazy"

>

`;

}




if(ext==="mp4"){


html+=`

<video

class="preview"

controls>


<source src="${url}">


</video>

`;

}


}



html+=`

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