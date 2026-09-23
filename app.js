const D={"港島":["中西區","灣仔區","東區","南區"],"九龍":["油尖旺區","深水埗區","九龍城區","黃大仙區","觀塘區"],"新界":["葺青區","荃灣區","屯門區","元朗區","北區","大埔區","沙田區","西貢區","離島區"]};
const P=["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=80","https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80","https://images.unsplash.com/photo-1503602642458-232111445657?w=800&q=80"];
const ST={open:"待認領",locked:"鎖定待交收",done:"已完成交收"};
let items=[{id:1,title:"實木餐椅兩張",cond:"8成新",dist:"沙田區",user:"阿琳",desc:"沙田圍站交收。",photos:P,status:"open",claimant:null,lockGiver:0,lockTaker:0,doneGiver:0,doneTaker:0},{id:7,title:"IKEA 層架（你送出）",cond:"8成新",dist:"沙田區",user:"你",desc:"你係發佈者，可取消鎖定。",photos:P,status:"open",claimant:null,lockGiver:0,lockTaker:0,doneGiver:0,doneTaker:0}];
let cur=null;
function show(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("on"));document.getElementById(id).classList.add("on");if(id==="home")feed();if(id==="me")me();if(id==="chats")document.getElementById("chatList").innerHTML="<p class='sub' style='padding:16px'>示範對話請先開物品。</p>";if(id==="post")document.getElementById("pErr").textContent="示範版：先在發現牆試流程。"}
function startTrial(){show("home");toast("已開始 7 日免費")}
function toast(t){const el=document.getElementById("toast");el.textContent=t;el.style.display="block";el.classList.add("show");setTimeout(()=>{el.style.display="none";el.classList.remove("show")},1600)}
function feed(){const bar=document.getElementById("filterBar");if(bar)bar.innerHTML="<button class='chip on'>可認領</button><button class='chip'>十八區</button>";document.getElementById("feed").innerHTML=items.map(it=>`<article class="card" onclick="openItem(${it.id})"><div class="ph" style="background-image:url('${it.photos[0]}')"><span class="badge">${it.cond} · ${ST[it.status]}</span></div><div class="meta"><h3>${it.title}</h3><div class="sub">${it.dist} · ${ST[it.status]}</div></div></article>`).join("")}
function openItem(id){cur=items.find(x=>x.id===id);document.getElementById("gallery").style.backgroundImage=`url('${cur.photos[0]}')`;document.getElementById("detailSheet").innerHTML=`<h2>${cur.title}</h2><div class="tagrow"><span class="tag ${cur.status}">${ST[cur.status]}</span><span class="tag">${cur.cond}</span><span class="tag alt">${cur.dist}</span></div><div class="desc">${cur.desc}</div><div class="status-box"><b>${ST[cur.status]}</b><div class="sub">雙方確認先鎖定；鎖定後發佈者可取消。</div></div>`;const giver=cur.user==="你";document.getElementById("detailCta").innerHTML=cur.status==="done"?"<button class='btn btn-ghost' onclick=\"show('home')\">返發現</button>":cur.status==="locked"?`<div class="btn-row"><button class="btn btn-primary" onclick="done()">確認完成交收</button>${giver?"<button class='btn btn-warn' onclick='cancel()'>取消鎖定</button>":""}</div>`:`<button class="btn btn-primary" onclick="lock()">確認交收（鎖定）</button>`;show("detail")}
function lock(){cur.status="locked";toast("已鎖定待交收");openItem(cur.id)}
function done(){cur.status="done";toast("已完成交收");openItem(cur.id)}
function cancel(){cur.status="open";toast("已回復待認領");openItem(cur.id)}
function me(){document.getElementById("trialLeft").textContent="試用進行中";document.getElementById("stGive").textContent=String(items.filter(i=>i.user==="你"&&i.status==="done").length+2);document.getElementById("meGiveBadge").textContent=document.getElementById("stGive").textContent}
function openSheet(){document.getElementById("modalBody").innerHTML="<div class='grab'></div><b>選擇地區</b>"+Object.values(D).flat().map(x=>`<button class='pick' onclick=\"toast('已選 ${x}');closeSheet()\">${x}</button>`).join("");document.getElementById("modal").classList.add("on")}
function closeSheet(){document.getElementById("modal").classList.remove("on")}
function submitPost(){toast("示範請先用發現牆")}
function sendMsg(){toast("示範對話")}
feed();
