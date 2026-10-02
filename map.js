const CENTERS={
"中西區":[22.282,114.155],"灣仔區":[22.277,114.172],"東區":[22.284,114.224],"南區":[22.246,114.160],
"油尖旺區":[22.311,114.170],"深水埗區":[22.330,114.162],"九龍城區":[22.328,114.192],"黃大仙區":[22.342,114.196],"觀塘區":[22.313,114.225],
"葵青區":[22.354,114.126],"荃灣區":[22.371,114.114],"屯門區":[22.391,113.977],"元朗區":[22.445,114.022],"北區":[22.494,114.138],"大埔區":[22.451,114.164],"沙田區":[22.382,114.188],"西貢區":[22.381,114.270],"離島區":[22.289,113.941]
};
const COORDS={11:[22.289,113.941],12:[22.282,113.934],13:[22.298,113.948],14:[22.377,114.195],15:[22.286,114.149],16:[22.298,114.172],17:[22.348,114.107],18:[22.315,114.264]};
let fmap=null, marks=[];
function ensureCoords(){
 items.forEach(it=>{const c=COORDS[it.id]; if(c){it.lat=c[0];it.lng=c[1]} else if(!it.lat){const b=CENTERS[it.dist]||[22.319,114.169]; it.lat=b[0]+(Math.random()-.5)*0.02; it.lng=b[1]+(Math.random()-.5)*0.02;}});
}
function mapPins(){
 const box=document.getElementById("mapbox"); if(!box||!window.L) return;
 ensureCoords();
 const center=CENTERS[picked]||[22.319,114.169];
 if(!fmap){
  fmap=L.map(box,{zoomControl:false,attributionControl:true}).setView(center,13);
  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",{maxZoom:19,attribution:"© OSM © CARTO"}).addTo(fmap);
 }
 marks.forEach(m=>m.remove()); marks=[];
 const list=items.filter(it=>it.status!=="done"&&(picked==="全部"||it.dist===picked)&&it.lat);
 list.forEach(it=>{
  const m=L.circleMarker([it.lat,it.lng],{radius:8,color:"#1f7a4d",fillColor:"#1f7a4d",fillOpacity:.9,weight:2}).addTo(fmap);
  m.bindTooltip(it.title+" · "+(it.km||""),{direction:"top"});
  m.on("click",()=>openItem(it.id));
  marks.push(m);
 });
 if(list.length) fmap.fitBounds(list.map(it=>[it.lat,it.lng]),{padding:[24,24],maxZoom:14});
 else fmap.setView(center, picked==="全部"?11:13);
 setTimeout(()=>fmap.invalidateSize(),60);
}
function locateMe(){
 if(!navigator.geolocation){toast("呢部機尋唔到位置");return}
 navigator.geolocation.getCurrentPosition(pos=>{
  if(!fmap) mapPins();
  const ll=[pos.coords.latitude,pos.coords.longitude];
  L.circleMarker(ll,{radius:6,color:"#0071e3",fillColor:"#0071e3",fillOpacity:1}).addTo(fmap);
  fmap.setView(ll,15); toast("已對位置");
 },()=>toast("未批准位置，仍對住選定區"));
}
