const GIVE=["環保新丁","清屋初哥","雜物克星","斷捨離達人","好心街坊","惜物莊主","及時雨","散財童子","社區大慈善家"];
const TAKE=["入屋街坊","尋寶初哥","眼明手快","環保達人","守時大師","感恩常客","惜物收藏家","社區親善大使","完美守護者"];
const GEXP=[0,50,150,300,500,800,1200,1800,2600];
const TEXP=[0,10,40,100,220,480,1000,2000,4000];
let trust=Number(localStorage.getItem("fa_trust")||100);
let shield=localStorage.getItem("fa_shield")!=="0";
let claimsToday=Number(localStorage.getItem("fa_claims")||0);
function gives(){return items.filter(it=>it.user==="你"&&it.status==="done").length}
function takes(){return items.filter(it=>it.taker==="你"&&it.status==="done").length}
function lvFrom(exp,table){let lv=1; table.forEach((n,i)=>{if(exp>=n) lv=i+1}); return lv}
function giveLv(){return lvFrom(gives()*50,GEXP)}
function takeLv(){let lv=lvFrom(takes()*10,TEXP); if(giveLv()<2) lv=Math.min(lv,3); if(gives()<15) lv=Math.min(lv,6); return lv}
function paintRanks(){
 const g=giveLv(), t=takeLv();
 const card=document.getElementById("rankCard")||document.createElement("div");
 card.id="rankCard"; card.className="rank-card";
 card.innerHTML=`<b>Redbull</b><div class="badges"><span>📦 Lv.${g} ${GIVE[g-1]}</span><span>🙋‍♂️ Lv.${t} ${TAKE[t-1]}</span></div><div class="sub">誠信度 ${trust}% · 好評 準時到漏、超有禮貌</div><div class="sub">送 ${gives()} · 領 ${takes()} · 新丁免死金牌${shield?"仍在":"已用"}</div>`;
 const host=document.querySelector("#me .profile"); if(host&&!card.parentElement) host.prepend(card);
 const title=document.getElementById("trialLeft"); if(title) title.textContent=`誠信度 ${trust}%`;
 document.getElementById("stGive").textContent=gives(); document.getElementById("stGet").textContent=takes();
}
function canClaim(){
 if(trust<50) return "誠信度低於 50%，只可以送出";
 if(trust<70) return "誠信度低於 70%，領取凍結 7 日";
 if(takeLv()===1&&gives()===0&&claimsToday>=2) return "新丁未送出前，每日最多領 2 件";
 if(cur&&cur.high&&(takeLv()<4||giveLv()<3||trust<98)) return "高價物要領取 Lv.4、贈送 Lv.3、誠信度 98%";
 return "";
}
const _lockRank=lock;
lock=function(){const why=canClaim(); if(why){toast(why); return;} claimsToday++; localStorage.setItem("fa_claims",claimsToday); _lockRank();};
const _fin=finishIfBoth;
finishIfBoth=function(note){_fin(note); if(cur&&cur.status==="done"){trust=Math.min(100,trust+2); localStorage.setItem("fa_trust",trust); paintRanks();}};
function noShow(role){if(shield){shield=false; localStorage.setItem("fa_shield","0"); toast("新手免死金牌：今次只警告"); return;} trust=Math.max(0,trust-(role==="take"?20:15)); localStorage.setItem("fa_trust",trust); toast(role==="take"?"領取者放飛機，誠信度 -20":"贈送者放飛機，誠信度 -15"); paintRanks();}
function tag(name){if(!cur) return; cur.tags=cur.tags||[]; if(!cur.tags.includes(name)) cur.tags.push(name); save(); toast("已評："+name);}
const _openRank=openItem;
openItem=function(id){_openRank(id); if(!cur) return; const box=document.getElementById("detailSheet"); if(box&&!box.querySelector(".gate")){const g=document.createElement("div"); g.className="gate sub"; g.textContent=cur.high?"高價閘：領取 Lv.4 且 贈送 Lv.3 且 誠信度 98%":"普通物品，新丁每日最多領 2 件"; box.appendChild(g);}};
function armPost(){const form=document.querySelector("#post .form"); if(!form||document.getElementById("pHigh")) return; const lab=document.createElement("label"); lab.innerHTML='<input type="checkbox" id="pHigh" /> 高價物：只限領取 Lv.4、贈送 Lv.3、誠信度 98%'; form.insertBefore(lab, form.querySelector(".err"));}
const _go=goPost; goPost=function(){_go(); setTimeout(armPost,30)};
const _subRank=submitPost;
submitPost=function(){const high=document.getElementById("pHigh")&&document.getElementById("pHigh").checked; _subRank(); const mine=items.find(it=>it.user==="你"); if(mine&&high){mine.high=true; save();}};
const _meRank=me; me=function(){_meRank(); paintRanks();};
const st=document.createElement("style"); st.textContent=".rank-card{background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px;margin-bottom:10px}.badges{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}.badges span{background:#eef8f2;border-radius:999px;padding:4px 8px;font-size:12px;font-weight:700}"; document.head.appendChild(st);
paintRanks();
