const D={"香港島":["中西區","灣仔區","東區","南區"],"九龍":["油尖旺區","深水埗區","九龍城區","黃大仙區","觀塘區"],"新界":["葵青區","荃灣區","屯門區","元朗區","北區","大埔區","沙田區","西貢區","離島區"]};
const EN={"中西區":"Central and Western","灣仔區":"Wan Chai","東區":"Eastern","南區":"Southern","油尖旺區":"Yau Tsim Mong","深水埗區":"Sham Shui Po","九龍城區":"Kowloon City","黃大仙區":"Wong Tai Sin","觀塘區":"Kwun Tong","葵青區":"Kwai Tsing","荃灣區":"Tsuen Wan","屯門區":"Tuen Mun","元朗區":"Yuen Long","北區":"North","大埔區":"Tai Po","沙田區":"Sha Tin","西貢區":"Sai Kung","離島區":"Islands"};
const HINT={"香港島":"中環、上環、半山 → 中西區","九龍":"旺角、尖沙咀、油麻地 → 油尖旺區","新界":"東涌／大嶼山／長洲 → 離島區 · 將軍澳 → 西貢區 · 天水圍 → 元朗區 · 青衣 → 葵青區"};
const P=["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80","https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80"];
const ST={open:"待認領",locked:"鎖定待交收",done:"已完成交收"};
let items=[{id:1,title:"實木餐椅兩張",cond:"8成新",dist:"沙田區",user:"阿琳",desc:"沙田圍站交收。",photos:P,status:"open"},{id:7,title:"IKEA 層架",cond:"8成新",dist:"離島區",user:"你",desc:"東涌交收。",photos:P,status:"open"}];
let cur=null, picked="全部";
function clay(id,fill,d){
  return '<svg class="clay" viewBox="0 0 32 32" aria-hidden="true"><defs><linearGradient id="'+id+'" x1="6" y1="2" x2="26" y2="30"><stop offset="0" stop-color="'+fill[0]+'"/><stop offset="1" stop-color="'+fill[1]+'"/></linearGradient></defs><path fill="url(#'+id+')" d="'+d+'"/></svg>';
}
const ICO={
  home: clay('gH',['#86e0ab','#1a6b43'],'M6 14.2L16 6l10 8.2V26a2 2 0 0 1-2 2H19v-8h-6v8H8a2 2 0 0 1-2-2z'),
  pulse: clay('gP',['#8fe3c0','#1f7a52'],'M4 16h4l3-8 4 16 3-8h10v3H20l-3 8-4-16-3 8H4z'),
  chat: clay('gC',['#9be4c4','#1a6b43'],'M6 7.5A5.5 5.5 0 0 1 11.5 2h9A5.5 5.5 0 0 1 26 7.5v8A5.5 5.5 0 0 1 20.5 21H13l-7 5V7.5z'),
  me: clay('gM',['#b7ebcf','#1f6b45'],'M16 4.5a5 5 0 1 1 0 10 5 5 0 0 1 0-10zM7.5 27c1.6-5 4.3-7.5 8.5-7.5s6.9 2.5 8.5 7.5z'),
  plus: clay('gX',['#fff8ee','#f0e2cc'],'M14 7h4v18h-4zM7 14h18v4H7z'),
  heart: clay('gR',['#ff9aa0','#c4454a'],'M16 27S6 20.2 6 13.2A5.4 5.4 0 0 1 16 10a5.4 5.4 0 0 1 10 3.2C26 20.2 16 27 16 27z')
};
function paintIcons(){
  document.querySelectorAll(".tab").forEach(t=>{
    const n=t.getAttribute("data-tab")||t.textContent.replace(/\s+/g,"").trim();
    t.setAttribute("data-tab",n);
    const map={"發現":ICO.home,"動態":ICO.pulse,"對話":ICO.chat,"個人":ICO.me};
    if(map[n]) t.innerHTML=map[n]+'<span>'+n+'</span>';
  });
  document.querySelectorAll(".sell-fab").forEach(b=>{b.innerHTML=ICO.plus;});
  const fav=document.querySelector(".ghost-ico"); if(fav) fav.innerHTML=ICO.heart;
}
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));document.getElementById(id).classList.add("on");paintIcons();if(id==="home")feed();if(id==="me")me();if(id==="chats")document.getElementById("chatList").innerHTML="<p class='sub' style='padding:16px'>示範對話請先開物品。</p>";if(id==="post")document.getElementById("pErr").textContent="示範版：先在發現牆試流程。"}
function startTrial(){show("home");toast("已開始 7 日免費")}
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.style.display="block";el.classList.add("show");setTimeout(()=>{el.style.display="none";el.classList.remove("show")},1600)}
function feed(){
  const loc=document.querySelector(".loc");
  if(loc) loc.innerHTML=(picked==="全部"?"十八區":picked)+' ▾<small>香港 · 附近免費物品</small>';
  const bar=document.getElementById("filterBar");
  if(bar) bar.innerHTML=`<button class='chip on'>可認領</button><button class='chip' onclick="openSheet()">${picked==="全部"?"十八區":picked}</button>`;
  const list=items.filter(it=>picked==="全部"||it.dist===picked);
  document.getElementById("feed").innerHTML=list.map(it=>`<article class="card" onclick="openItem(${it.id})"><div class="ph" style="background-image:url('${it.photos[0]}')"><span class="badge">${it.cond}</span><button class="heart" onclick="event.stopPropagation();toast('已收藏')">${ICO.heart}</button></div><div class="meta"><div class="free">免費</div><h3>${it.title}</h3><div class="seller">${it.user} · ${it.dist}</div></div></article>`).join("")||"<p class='sub'>呢區暫時無物品。</p>";
}
function openItem(id){cur=items.find(x=>x.id===id);document.getElementById("gallery").style.backgroundImage=`url('${cur.photos[0]}')`;document.getElementById("detailSheet").innerHTML=`<h2>${cur.title}</h2><div class="tagrow"><span class="tag ${cur.status}">${ST[cur.status]}</span><span class="tag">${cur.cond}</span><span class="tag alt">${cur.dist}</span></div><div class="desc">${cur.desc}</div><div class="status-box"><b>${ST[cur.status]}</b><div class="sub">雙方確認先鎖定；鎖定後發佈者可取消。</div></div>`;const giver=cur.user==="你";document.getElementById("detailCta").innerHTML=cur.status==="done"?"<button class='btn btn-ghost' onclick=\"show('home')\">返發現</button>":cur.status==="locked"?`<div class="btn-row"><button class="btn btn-primary" onclick="done()">確認完成交收</button>${giver?"<button class='btn btn-warn' onclick='cancel()'>取消鎖定</button>":""}</div>`:`<button class="btn btn-primary" onclick="lock()">確認交收（鎖定）</button>`;show("detail")}
function lock(){cur.status="locked";toast("已鎖定待交收");openItem(cur.id)}
function done(){cur.status="done";toast("已完成交收");openItem(cur.id)}
function cancel(){cur.status="open";toast("已回復待認領");openItem(cur.id)}
function me(){document.getElementById("trialLeft").textContent="試用進行中";document.getElementById("stGive").textContent="2";document.getElementById("meGiveBadge").textContent="2"}
function openSheet(){let html="<div class='grab'></div><div class='sheet-head'><b>香港十八區</b><span class='sub'>官方地方行政區（區議會條例）</span></div><button class='dist-all' onclick=\"picked='全部';closeSheet();feed();toast('已選全部十八區')\">全部十八區</button>";for(const [g,list] of Object.entries(D)){html+=`<div class='dist-reg'>${g}<small>${HINT[g]}</small></div><div class='dist-grid'>`+list.map(d=>`<button class='dist-tile' onclick=\"picked='${d}';closeSheet();feed();toast('已選 ${d}')\"><b>${d}</b><span>${EN[d]}</span></button>`).join("")+"</div>"}document.getElementById("modalBody").innerHTML=html;document.getElementById("modal").classList.add("on")}
function closeSheet(){document.getElementById("modal").classList.remove("on")}
function submitPost(){toast("示範請先用發現牆")}
function sendMsg(){toast("示範對話")}
paintIcons();feed();
