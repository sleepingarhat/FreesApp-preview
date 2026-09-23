const D={"香港島":["中西區","灣仔區","東區","南區"],"九龍":["油尖旺區","深水埗區","九龍城區","黃大仙區","觀塘區"],"新界":["葵青區","荃灣區","屯門區","元朗區","北區","大埔區","沙田區","西貢區","離島區"]};
const EN={"中西區":"Central and Western","灣仔區":"Wan Chai","東區":"Eastern","南區":"Southern","油尖旺區":"Yau Tsim Mong","深水埗區":"Sham Shui Po","九龍城區":"Kowloon City","黃大仙區":"Wong Tai Sin","觀塘區":"Kwun Tong","葵青區":"Kwai Tsing","荃灣區":"Tsuen Wan","屯門區":"Tuen Mun","元朗區":"Yuen Long","北區":"North","大埔區":"Tai Po","沙田區":"Sha Tin","西貢區":"Sai Kung","離島區":"Islands"};
const HINT={"香港島":"中環、上環、半山 → 中西區","九龍":"旺角、尖沙嘱、油麻地 → 油尖旺區","新界":"東涌／大嶼山／長洲 → 離島區 · 將軍澳 → 西貢區 · 天水圍 → 元朗區 · 青衣 → 葵青區"};
const P=["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80","https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80"];
const ST={open:"待認領",locked:"鎖定待交收",done:"已完成交收"};
let items=[{id:1,title:"實木餐椅兩張",cond:"8成新",dist:"沙田區",user:"阿琳",desc:"沙田圍站交收。",photos:P,status:"open"},{id:7,title:"IKEA 層架",cond:"8成新",dist:"離島區",user:"你",desc:"東涌交收。",photos:P,status:"open"}];
let cur=null, picked="全部";
function svg(inner){return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">'+inner+'</svg>'}
const ICO={
  home: svg('<path d="M3 10.5 12 3l9 7.5V20a1.5 1.5 0 0 1-1.5 1.5H14v-6H10v6H4.5A1.5 1.5 0 0 1 3 20z"/>'),
  pulse: svg('<path d="M4 12h3l2.2-6 3.6 12 2.2-6H20"/>'),
  chat: svg('<path d="M21 12a8 8 0 0 1-8 8H8l-5 3V12a8 8 0 1 1 18 0z"/>'),
  me: svg('<circle cx="12" cy="8" r="3.2"/><path d="M5 20c1.4-3.6 3.6-5.2 7-5.2s5.6 1.6 7 5.2"/>'),
  plus: svg('<path d="M12 5v14M5 12h14"/>'),
  heart: svg('<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2 4 4 0 0 1 7 2c0 5.6-7 10-7 10z"/>'),
  pin: svg('<path d="M12 21s7-5.2 7-11a7 7 0 1 0-14 0c0 5.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.2"/>'),
  search: svg('<circle cx="11" cy="11" r="6.5"/><path d="m16 16 4.2 4.2"/>')
};
function paintIcons(){
  document.querySelectorAll(".tab").forEach(t=>{
    const n=(t.dataset.tab||t.textContent).replace(/\s+/g,"").trim();
    t.dataset.tab=n;
    const map={"發現":ICO.home,"動態":ICO.pulse,"對話":ICO.chat,"個人":ICO.me};
    if(map[n]) t.innerHTML='<span class="ic">'+map[n]+'</span>'+n;
  });
  document.querySelectorAll(".sell-fab").forEach(b=>{b.innerHTML=ICO.plus;});
  const fav=document.querySelector(".ghost-ico"); if(fav) fav.innerHTML=ICO.heart;
}
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));document.getElementById(id).classList.add("on");paintIcons();if(id==="home")feed();if(id==="me")me();if(id==="chats")document.getElementById("chatList").innerHTML="<p class='sub' style='padding:16px'>示範對話請先開物品。</p>";if(id==="post")document.getElementById("pErr").textContent="示範版：先在發現牆試流程。"}
function startTrial(){show("home");toast("已開始 7 日免費")}
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.style.display="block";el.classList.add("show");setTimeout(()=>{el.style.display="none";el.classList.remove("show")},1600)}
function feed(){
  const loc=document.querySelector(".loc");
  if(loc) loc.innerHTML=(picked==="全部"?"十八區":"")+(picked!=="全部"?picked:"")+' ▾<small>香港 · 附近免費物品</small>';
  if(picked==="全部"&&loc) loc.innerHTML='十八區 ▾<small>香港 · 附近免費物品</small>';
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
