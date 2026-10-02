const CENTERS={"中西區":[22.282,114.155],"灣仔區":[22.277,114.172],"東區":[22.284,114.224],"南區":[22.246,114.160],"油尖旺區":[22.311,114.170],"深水埗區":[22.330,114.162],"九龍城區":[22.328,114.192],"黃大仙區":[22.342,114.196],"觀塘區":[22.313,114.225],"葵青區":[22.354,114.126],"荃灣區":[22.371,114.114],"屯門區":[22.391,113.977],"元朗區":[22.445,114.022],"北區":[22.494,114.138],"大埔區":[22.451,114.164],"沙田區":[22.382,114.188],"西貢區":[22.381,114.270],"離島區":[22.289,113.941]};
const COORDS={11:[22.289,113.941],12:[22.282,113.934],13:[22.298,113.948],14:[22.377,114.195],15:[22.286,114.149],16:[22.298,114.172],17:[22.348,114.107],18:[22.315,114.264]};
let fmap=null, marks=[], meDot=null, asked=false;
function ensureCoords(){items.forEach(it=>{const c=COORDS[it.id]; if(c&&!it.lat){it.lat=c[0];it.lng=c[1];}})}
function fallbackFrame(){const box=document.getElementById("mapbox"); if(!box) return; const c=CENTERS[picked]||[22.289,113.941]; const d=0.04; const bbox=[c[1]-d,c[0]-d,c[1]+d,c[0]+d].join(","); box.innerHTML='<iframe title="香港地圖" src="https://www.openstreetmap.org/export/embed.html?bbox='+bbox+'&layer=mapnik&marker='+c[0]+','+c[1]+'"></iframe>';}
function mapPins(){
 const box=document.getElementById("mapbox"); if(!box) return;
 ensureCoords();
 if(!window.maplibregl){fallbackFrame(); return;}
 const c=CENTERS[picked]||[22.289,113.941];
 if(!fmap){
  box.innerHTML="";
  try{
   fmap=new maplibregl.Map({container:box,style:"https://tiles.openfreemap.org/styles/positron",center:[c[1],c[0]],zoom:13,attributionControl:true});
   fmap.addControl(new maplibregl.NavigationControl({showCompass:false}),"bottom-right");
   fmap.on("load",()=>{paintMarks(); if(!asked){asked=true; locateMe(true);}});
  }catch(e){fmap=null; fallbackFrame(); return;}
 } else {fmap.easeTo({center:[c[1],c[0]],zoom:picked==="全部"?11:13}); paintMarks();}
 setTimeout(()=>{if(fmap) fmap.resize();},80);
}
function paintMarks(){
 if(!fmap) return;
 marks.forEach(m=>m.remove()); marks=[];
 items.filter(it=>it.status!=="done"&&(picked==="全部"||it.dist===picked)&&it.lat).forEach(it=>{
  const el=document.createElement("button");
  el.className="ml-pin"; el.textContent=it.km||"免費";
  const pop=new maplibregl.Popup({offset:16,closeButton:true,maxWidth:"180px"}).setHTML(`<button class="pop" onclick="openItem(${it.id})"><img src="${it.photos[0]}" alt=""><b>${it.title}</b><span>${it.cond} · ${it.area||it.dist} · ${it.km||""}</span></button>`);
  const m=new maplibregl.Marker({element:el}).setLngLat([it.lng,it.lat]).setPopup(pop).addTo(fmap);
  el.onclick=(e)=>{e.stopPropagation(); m.togglePopup();};
  marks.push(m);
 });
}
function locateMe(silent){
 if(!navigator.geolocation){if(!silent) toast("呢部機尋唔到位置"); return;}
 navigator.geolocation.getCurrentPosition(pos=>{
  const ll=[pos.coords.longitude,pos.coords.latitude];
  here={lat:pos.coords.latitude,lng:pos.coords.longitude};
  if(window.applyKm) applyKm();
  if(!fmap){mapPins(); return;}
  if(meDot) meDot.remove();
  const el=document.createElement("div"); el.className="me-dot";
  meDot=new maplibregl.Marker({element:el}).setLngLat(ll).addTo(fmap);
  fmap.flyTo({center:ll,zoom:14});
  if(document.getElementById("home").classList.contains("on")) feed();
  if(!silent) toast("已對位置");
 },()=>{if(!silent) toast("未批准位置，仍對住東涌");},{enableHighAccuracy:true,timeout:8000});
}
