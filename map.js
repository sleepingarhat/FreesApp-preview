const CENTERS={
"中西區":[22.282,114.155],"灣仔區":[22.277,114.172],"東區":[22.284,114.224],"南區":[22.246,114.160],
"油尖旺區":[22.311,114.170],"深水埗區":[22.330,114.162],"九龍城區":[22.328,114.192],"黃大仙區":[22.342,114.196],"觀塘區":[22.313,114.225],
"葵青區":[22.354,114.126],"荃灣區":[22.371,114.114],"屯門區":[22.391,113.977],"元朗區":[22.445,114.022],"北區":[22.494,114.138],"大埔區":[22.451,114.164],"沙田區":[22.382,114.188],"西貢區":[22.381,114.270],"離島區":[22.289,113.941]
};
const COORDS={11:[22.289,113.941],12:[22.282,113.934],13:[22.298,113.948],14:[22.377,114.195],15:[22.286,114.149],16:[22.298,114.172],17:[22.348,114.107],18:[22.315,114.264]};
function ensureCoords(){items.forEach(it=>{const c=COORDS[it.id]; if(c){it.lat=c[0];it.lng=c[1];}})}
function mapPins(){
 const box=document.getElementById("mapbox"); if(!box) return;
 ensureCoords();
 const c=CENTERS[picked]||[22.289,113.941];
 const d=picked==="全部"?0.35:0.04;
 const bbox=[c[1]-d,c[0]-d*0.7,c[1]+d,c[0]+d*0.7].map(n=>n.toFixed(4)).join(",");
 const src="https://www.openstreetmap.org/export/embed.html?bbox="+bbox+"&layer=mapnik&marker="+c[0]+","+c[1];
 const list=items.filter(it=>it.status!=="done"&&(picked==="全部"||it.dist===picked));
 box.innerHTML='<iframe title="香港地圖" src="'+src+'" loading="lazy"></iframe><div class="mapkeys">'+list.map(it=>'<button type="button" onclick="openItem('+it.id+')">'+it.title+' · '+(it.km||"")+'</button>').join("")+'</div>';
}
function locateMe(){toast("預覽對住東涌。真定位下一步先開"); if(typeof picked!=="undefined"){picked="離島區"; feed();}}
