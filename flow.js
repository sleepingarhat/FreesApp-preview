let here=null;
const EXTRA=[
 {id:21,title:"書桌燈",cond:"9成新",cat:"家品",dist:"離島區",meet:"東涌站",user:"Yan",desc:"東涌站大堂。",lat:22.291,lng:113.938},
 {id:22,title:"嬰兒衣一箱",cond:"8成新",cat:"衣物",dist:"離島區",meet:"逸東",user:"阿芳",desc:"0-2歲。",lat:22.278,lng:113.932},
 {id:23,title:"飯盒",cond:"全新",cat:"廚具",dist:"荃灣區",meet:"荃灣站",user:"阿明",desc:"未用過。",lat:22.373,lng:114.112},
 {id:24,title:"小風扇",cond:"7成新",cat:"電子",dist:"屯門區",meet:"屯門站",user:"Chris",desc:"可用。",lat:22.395,lng:113.973},
 {id:25,title:"兒童書",cond:"9成新",cat:"書本",dist:"元朗區",meet:"天水圍",user:"阿詩",desc:"一箱。",lat:22.450,lng:114.002},
 {id:26,title:"蒼栽",cond:"8成新",cat:"家品",dist:"北區",meet:"上水",user:"Ken",desc:"要自己拿。",lat:22.501,lng:114.128},
 {id:27,title:"餐具一套",cond:"8成新",cat:"廚具",dist:"大埔區",meet:"大埔站",user:"May",desc:"四人用。",lat:22.450,lng:114.169},
 {id:28,title:"樂譜架",cond:"7成新",cat:"其他",dist:"觀塘區",meet:"觀塘站",user:"Sam",desc:"有少少花。",lat:22.312,lng:114.226},
 {id:29,title:"小沙發",cond:"9成新",cat:"家品",dist:"南區",meet:"海洋公園",user:"阿琳",desc:"雙人。",lat:22.246,lng:114.168},
 {id:30,title:"蓝牙喇叭",cond:"8成新",cat:"電子",dist:"深水埗區",meet:"深水埗站",user:"Tom",desc:"可用。",lat:22.331,lng:114.162}
];
function bootExtra(){
 EXTRA.forEach(x=>{if(!items.some(it=>it.id===x.id)) items.push(Object.assign({photos:[P[0],P[1],P[2]],status:"open",when:"今日",km:"附近",msgs:[]},x));});
 save();
}
function km(a,b){const R=6371,d1=(b.lat-a.lat)*Math.PI/180,d2=(b.lng-a.lng)*Math.PI/180,s=Math.sin(d1/2)**2+Math.cos(a.lat*Math.PI/180)*Math.cos(b.lat*Math.PI/180)*Math.sin(d2/2)**2;return R*2*Math.atan2(Math.sqrt(s),Math.sqrt(1-s));}
function applyKm(){if(!here) return; items.forEach(it=>{if(it.lat) it.km=km(here,it).toFixed(1)+"km";}); save();}
function goPost(){show("post");}
function needPay(){return false;}
const _show=show;
show=function(id){_show(id); if(id==="chats") renderChats(); if(id==="home"&&alerts) pingNearby();};
function pingNearby(){const n=items.filter(it=>it.status==="open"&&(picked==="全部"||it.dist===picked)).length; if(n) toast(picked+" 有 "+n+" 件待領");}
function renderChats(){
 const list=items.filter(it=>it.status==="locked"||it.status==="done"||(it.msgs&&it.msgs.length));
 document.getElementById("chatList").innerHTML=list.length?list.map(it=>`<div class="row" onclick="openChat(${it.id})"><div class="ava">${it.user.slice(0,1)}</div><div><b>${it.title}</b><div class="sub">${ST[it.status]} · ${it.user}</div></div></div>`).join(""):"<p class='sub' style='padding:16px'>認領之後先開對話。訂時間同地點。</p>";
}
function openChat(id){
 cur=items.find(x=>x.id===id); if(!cur) return;
 if(!cur.msgs) cur.msgs=[];
 document.querySelector("#chat .top b").textContent=cur.title;
 document.querySelector("#chat .sub").textContent=ST[cur.status]+" · "+(cur.meet||"面交");
 const box=document.getElementById("thread");
 box.innerHTML=cur.msgs.map(m=>`<div class="bubble ${m.who==='you'?'me':m.who==='sys'?'sys':'them'}">${m.text}</div>`).join("")||"<div class='bubble sys'>講交收時間同地點。</div>";
 box.scrollTop=box.scrollHeight;
 let bar=document.getElementById("dealBar");
 if(!bar){bar=document.createElement("div"); bar.id="dealBar"; bar.className="deal-bar"; document.getElementById("chat").insertBefore(bar, document.querySelector("#chat .composer"));}
 const giver=cur.user==="你";
 bar.innerHTML=cur.status!=="locked"?`<span class="sub">${ST[cur.status]||""}</span>`:`<button onclick="myOk()">我確認完成</button><button class="ghost" onclick="otherOk()">模擬對方確認</button>${giver?'<button class="warn" onclick="cancel()">取消鎖定</button>':''}`;
 show("chat");
}
function sendMsg(){
 const inp=document.getElementById("msg"); const t=(inp.value||"").trim(); if(!t||!cur) return;
 cur.msgs=cur.msgs||[]; cur.msgs.push({who:"you",text:t}); inp.value=""; save(); openChat(cur.id);
}
function lock(){
 cur.status="locked"; cur.taker="你"; cur.giverOk=false; cur.takerOk=false;
 cur.msgs=[{who:"sys",text:"已鎖定待交收。雙方確認先算完成。發佈者可取消。"}];
 save(); toast("已鎖定，開對話"); openChat(cur.id);
}
function myOk(){if(!cur||cur.status!=="locked") return; if(cur.user==="你") cur.giverOk=true; else cur.takerOk=true; finishIfBoth("你已確認");}
function otherOk(){if(!cur||cur.status!=="locked") return; if(cur.user==="你") cur.takerOk=true; else cur.giverOk=true; finishIfBoth("對方已確認");}
function finishIfBoth(note){
 cur.msgs.push({who:"sys",text:note});
 if(cur.giverOk&&cur.takerOk){cur.status="done"; cur.msgs.push({who:"sys",text:"雙方已確認，已完成交收。"}); toast("已完成交收");}
 else toast("等另一方確認");
 save(); openChat(cur.id);
}
function cancel(){if(!cur||cur.user!=="你"){toast("只有發佈者可取消"); return;} cur.status="open"; cur.giverOk=false; cur.takerOk=false; cur.msgs.push({who:"sys",text:"發佈者已取消，回復待認領。"}); save(); toast("已回復待認領"); openItem(cur.id);}
const _open=openItem;
openItem=function(id){
 _open(id);
 if(!cur) return;
 const giver=cur.user==="你";
 const cta=document.getElementById("detailCta");
 if(cur.status==="open") cta.innerHTML=`<button class="btn btn-primary" onclick="lock()">確認交收（鎖定）</button>`;
 if(cur.status==="locked") cta.innerHTML=`<div class="btn-row"><button class="btn btn-primary" onclick="openChat(${cur.id})">開對話</button>${giver?'<button class="btn btn-warn" onclick="cancel()">取消鎖定</button>':''}</div>`;
};
const _me=me;
me=function(){_me(); const g=items.filter(it=>it.user==="你"&&it.status==="done").length; const t=items.filter(it=>it.taker==="你"&&it.status==="done").length; document.getElementById("stGive").textContent=g; document.getElementById("stGet").textContent=t; document.getElementById("meGiveBadge").textContent=g; document.getElementById("trialLeft").textContent="帳號同付款未接";};
const _sub=submitPost;
submitPost=function(){
 const before=items.length; _sub();
 const mine=items[0];
 if(items.length>before&&mine&&mine.user==="你"){
  const c=(typeof CENTERS!=="undefined"&&CENTERS[mine.dist])||[22.289,113.941];
  mine.lat=c[0]; mine.lng=c[1]; mine.km=here?km(here,mine).toFixed(1)+"km":"附近"; save();
  if(alerts) toast("已發佈，附近會提醒");
 }
};
bootExtra();
