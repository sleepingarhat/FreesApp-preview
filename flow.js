let here=null, favs=[]; try{favs=JSON.parse(localStorage.getItem("fa_fav")||"[]")}catch(e){favs=[]}
const AREAS={
"中西區":["堅尼地城","石塘咀","西營盤","上環","中環","金鐘","半山區","山頂"],
"灣仔區":["灣仔","銅鑼灣","跑馬地","大坑","掃桿埔","渣甸山"],
"東區":["天后","寶馬山","北角","鱆魚涌","西灣河","筱箕灣","柴灣","小西灣"],
"南區":["薄扶林","香港仔","鴨腽洲","黃竹坑","壽臣山","淺水灣","春礎角","赤柱","大潭","石澳"],
"油尖旺區":["尖沙咀","油麻地","西九龍填海區","京士柏","旺角","大角咀"],
"深水埗區":["美孚","荔枝角","長沙灣","深水埗","石硤尾","又一村","大窩坪","昂船洲"],
"九龍城區":["紅礎","土瓜灣","馬頭角","馬頭圍","啟德","九龍城","何文田","九龍塘","筆架山"],
"黃大仙區":["新蒲崗","黃大仙","東頭","橫頭礎","樂富","鑽石山","慈雲山","牛池灣"],
"觀塘區":["坪石","九龍灣","牛頭角","佐敦谷","觀塘","秀茂坪","藍田","油塘","鯉魚門"],
"葵青區":["葵涌","青衣"],
"荃灣區":["荃灣","梨木樹","汀九","深井","青龍頭","馬灣","欣澳"],
"屯門區":["大欖涌","掃管笏","屯門","藍地"],
"元朗區":["洪水橋","廈村","流浮山","天水圍","元朗","新田","落馬洲","錦田","石崗","八鄉"],
"北區":["粉嶺","聯和墟","上水","石湖墟","沙頭角","鹿頸","烏蛟騰"],
"大埔區":["大埔墟","大埔","大埔滓","大尾篤","船灣","樟木頭","企嶺下"],
"沙田區":["大圍","沙田","火炭","馬料水","烏溪沙","馬鞍山"],
"西貢區":["清水灣","西貢","大網仔","將軍澳","坑口","調景嶺","馬游塘"],
"離島區":["東涌","大嶼山","長洲","坪洲","南丫島"]
};
const EXTRA=[
 {id:21,title:"書桌燈",cond:"9成新",cat:"家品",dist:"離島區",area:"東涌",meet:"東涌站",user:"Yan",desc:"東涌站大堂。",lat:22.291,lng:113.938},
 {id:22,title:"嬰兒衣一箱",cond:"8成新",cat:"衣物",dist:"離島區",area:"逸東",meet:"逸東",user:"阿芳",desc:"0-2歲。",lat:22.278,lng:113.932},
 {id:23,title:"飯盒",cond:"全新",cat:"廚具",dist:"荃灣區",area:"荃灣",meet:"荃灣站",user:"阿明",desc:"未用過。",lat:22.373,lng:114.112},
 {id:30,title:"蓝牙喇叭",cond:"8成新",cat:"電子",dist:"深水埗區",area:"深水埗",meet:"深水埗站",user:"Tom",desc:"可用。",lat:22.331,lng:114.162}
];
function bootExtra(){EXTRA.forEach(x=>{if(!items.some(it=>it.id===x.id)) items.push(Object.assign({photos:[P[0],P[1],P[2]],status:"open",when:"今日",km:"附近",msgs:[]},x));}); save();}
function km(a,b){const R=6371,d1=(b.lat-a.lat)*Math.PI/180,d2=(b.lng-a.lng)*Math.PI/180,s=Math.sin(d1/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(d2/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));}
function applyKm(){if(!here) return; items.forEach(it=>{if(it.lat) it.km=km(here,it).toFixed(1)+"km";}); save();}
function goPost(){show("post");}
function needPay(){return false;}
function levelOf(){const n=items.filter(it=>(it.user==="你"||it.taker==="你")&&it.status==="done").length; if(n>=10) return {n,name:"特別",cls:"lv5"}; if(n>=6) return {n,name:"金",cls:"lv4"}; if(n>=3) return {n,name:"銀",cls:"lv3"}; if(n>=1) return {n,name:"銅",cls:"lv2"}; return {n,name:"新人",cls:"lv1"};}
function paintLevel(){const lv=levelOf(); document.querySelectorAll(".ava").forEach(el=>{if(el.textContent.trim().startsWith("R")||el.id==="meAva"){el.classList.add(lv.cls); el.dataset.lv=lv.name;}});} 
const _show=show;
show=function(id){_show(id); if(id==="chats") renderChats(); if(id==="home"&&alerts) pingNearby(); if(id==="me") paintFavs(); paintLevel();};
function pingNearby(){const n=items.filter(it=>it.status==="open"&&(picked==="全部"||it.dist===picked)).length; if(n) toast(picked+" 有 "+n+" 件待領");}
function renderChats(){const list=items.filter(it=>it.status==="locked"||it.status==="done"||(it.msgs&&it.msgs.length)); document.getElementById("chatList").innerHTML=list.length?list.map(it=>`<div class="row" onclick="openChat(${it.id})"><div class="ava">${it.user.slice(0,1)}</div><div><b>${it.title}</b><div class="sub">${ST[it.status]} · ${it.user}</div></div></div>`).join(""):"<p class='sub' style='padding:16px'>認領之後先開對話。</p>";}
function openChat(id){cur=items.find(x=>x.id===id); if(!cur) return; if(!cur.msgs) cur.msgs=[]; document.querySelector("#chat .top b").textContent=cur.title; document.querySelector("#chat .sub").textContent=ST[cur.status]; const box=document.getElementById("thread"); box.innerHTML=cur.msgs.map(m=>`<div class="bubble ${m.who==='you'?'me':m.who==='sys'?'sys':'them'}">${m.text}</div>`).join("")||"<div class='bubble sys'>講交收時間同地點。</div>"; let bar=document.getElementById("dealBar"); if(!bar){bar=document.createElement("div"); bar.id="dealBar"; bar.className="deal-bar"; document.getElementById("chat").insertBefore(bar, document.querySelector("#chat .composer"));} const giver=cur.user==="你"; bar.innerHTML=cur.status!=="locked"?`<span class="sub">${ST[cur.status]||""}</span>`:`<button onclick="myOk()">我確認完成</button><button class="ghost" onclick="otherOk()">模擬對方確認</button>${giver?'<button class="warn" onclick="cancel()">取消鎖定</button>':''}`; show("chat");}
function sendMsg(){const inp=document.getElementById("msg"); const t=(inp.value||"").trim(); if(!t||!cur) return; cur.msgs=cur.msgs||[]; cur.msgs.push({who:"you",text:t}); inp.value=""; save(); openChat(cur.id);}
function lock(){cur.status="locked"; cur.taker="你"; cur.giverOk=false; cur.takerOk=false; cur.msgs=[{who:"sys",text:"已鎖定待交收。雙方確認先算完成。"}]; save(); toast("已鎖定，開對話"); openChat(cur.id);}
function myOk(){if(!cur||cur.status!=="locked") return; if(cur.user==="你") cur.giverOk=true; else cur.takerOk=true; finishIfBoth("你已確認");}
function otherOk(){if(!cur||cur.status!=="locked") return; if(cur.user==="你") cur.takerOk=true; else cur.giverOk=true; finishIfBoth("對方已確認");}
function finishIfBoth(note){cur.msgs.push({who:"sys",text:note}); if(cur.giverOk&&cur.takerOk){cur.status="done"; cur.msgs.push({who:"sys",text:"雙方已確認，已完成交收。"}); toast("已完成，等級升級");} else toast("等另一方確認"); save(); openChat(cur.id); paintLevel();}
function cancel(){if(!cur||cur.user!=="你"){toast("只有發佈者可取消"); return;} cur.status="open"; cur.giverOk=false; cur.takerOk=false; save(); toast("已回復待認領"); openItem(cur.id);}
function toggleFav(id,ev){if(ev) ev.stopPropagation(); favs=favs.includes(id)?favs.filter(x=>x!==id):favs.concat(id); localStorage.setItem("fa_fav",JSON.stringify(favs)); toast(favs.includes(id)?"已收藏":"已取消收藏"); if(document.getElementById("me").classList.contains("on")) paintFavs();}
function paintFavs(){let box=document.getElementById("favList"); if(!box){box=document.createElement("div"); box.id="favList"; const host=document.getElementById("myListings"); if(host) host.before(box);} const list=items.filter(it=>favs.includes(it.id)); box.innerHTML="<b style='display:block;margin:12px 0 6px'>已收藏</b>"+(list.length?list.map(it=>`<div class="row" onclick="openItem(${it.id})"><div class="ava">藏</div><div><b>${it.title}</b><div class="sub">${it.dist} · ${it.area||""}</div></div></div>`).join(""):"<p class='sub'>未有收藏。在物品卡撲心。</p>"); const lv=levelOf(); const badge=document.getElementById("meGiveBadge"); if(badge){badge.textContent=lv.n; badge.parentElement.className="ava "+lv.cls; badge.parentElement.title=lv.name+" Lv";} const t=document.getElementById("trialLeft"); if(t) t.textContent=lv.name+" · 完成 "+lv.n+" 次";}
const _feed=feed;
feed=function(){_feed(); document.querySelectorAll(".heart").forEach((b,i)=>{const card=b.closest(".card");});};
const _open=openItem;
openItem=function(id){_open(id); if(!cur) return; const giver=cur.user==="你"; const cta=document.getElementById("detailCta"); if(cur.status==="open") cta.innerHTML=`<button class="btn btn-primary" onclick="lock()">確認交收（鎖定）</button>`; if(cur.status==="locked") cta.innerHTML=`<div class="btn-row"><button class="btn btn-primary" onclick="openChat(${cur.id})">開對話</button>${giver?'<button class="btn btn-warn" onclick="cancel()">取消鎖定</button>':''}</div>`; const heart=document.querySelector("#detail .heart");};
const _sub=submitPost;
submitPost=function(){const title=(document.getElementById("pTitle").value||"").trim(); const pics=draft.photos.filter(Boolean); if(pics.length<3||!title||!draft.dist){_sub(); return;} _sub(); const mine=items.find(it=>it.user==="你"&&it.title===title); if(mine){const c=(CENTERS[mine.dist])||[22.289,113.941]; mine.lat=mine.lat||c[0]; mine.lng=mine.lng||c[1]; mine.area=mine.area||draft.area||""; picked=mine.dist; save(); toast("已放上"+mine.dist+(mine.area?" · "+mine.area:"")); feed();}};
draft.area="東涌";
const _sheet=openSheet;
openSheet=function(mode){_sheet(mode); const body=document.getElementById("modalBody"); if(!body||mode==="post") return; const note=document.createElement("div"); note.className="sub"; note.style.padding="8px 4px"; note.textContent="分區按差飦物業估價署《香港物業報告》附錄。攞區之後可再選地點。"; body.appendChild(note);};
const _pick=pickDist;
pickDist=function(d){if(sheetMode==="post"){draft.dist=d; draft.area=(AREAS[d]||[])[0]||""; document.getElementById("pDistrictBtn").textContent=d+" · "+draft.area; closeSheet(); toast("交收："+d); return;} picked=d; closeSheet(); const areas=AREAS[d]; if(areas){const html="<div class='grab'></div><div class='sheet-head'><b>"+d+"</b><span class='sub'>地點</span></div>"+areas.map(a=>`<button class='dist-tile' onclick="pickArea('${a}')"><b>${a}</b></button>`).join(""); document.getElementById("modalBody").innerHTML=html; document.getElementById("modal").classList.add("on");} feed();};
function pickArea(a){draft.area=a; if(sheetMode==="post"){document.getElementById("pDistrictBtn").textContent=draft.dist+" · "+a;} else {items.forEach(()=>{}); toast(picked+" · "+a);} closeSheet(); feed();}
function saveFav(){localStorage.setItem("fa_fav",JSON.stringify(favs));}
document.addEventListener("click",e=>{const h=e.target.closest&&e.target.closest(".heart"); if(!h) return; e.stopPropagation(); const card=h.closest(".card"); const title=card&&card.querySelector("h3")&&card.querySelector("h3").textContent; const it=items.find(x=>x.title===title); if(it) toggleFav(it.id);});
bootExtra();
const st=document.createElement("style"); st.textContent=".lv2{box-shadow:0 0 0 3px #c4844a}.lv3{box-shadow:0 0 0 3px #c9cdd4;animation:pulse 1.6s ease infinite}.lv4{box-shadow:0 0 0 3px #e2b657;animation:blink 1s steps(2) infinite}.lv5{background:linear-gradient(140deg,#1f7a4d,#e2b657);color:#fff;animation:spin 3s linear infinite}.pop{border:0;background:#fff;padding:0;text-align:left;width:150px}.pop img{width:150px;height:96px;object-fit:cover;border-radius:10px}.pop b{display:block;margin-top:6px}.pop span{color:#6e6e73;font-size:11px}@keyframes blink{50%{opacity:.45}}@keyframes pulse{50%{transform:scale(1.06)}}@keyframes spin{to{filter:hue-rotate(40deg)}}"; document.head.appendChild(st);
