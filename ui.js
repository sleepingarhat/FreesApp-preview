const KEYS=["iphone","ipad","sony","playstation","ps5","switch","dyson","lv","chanel","gucci","coach","名牌","手袋","奶粉","尿片","禮券","門票","相機"];
const QUOTES=["今日執左屋未？唔好塞爆堆填區啊。","排隊要有品，放飛機唔藥醫！","買果陣以為自己會用，放左兩年其實你同佢完全唔熟。"];
function tip(){let bar=document.getElementById("asheTip"); const home=document.getElementById("home"); if(!home) return; if(!bar){bar=document.createElement("button"); bar.id="asheTip"; bar.className="ashe"; home.insertBefore(bar, home.querySelector(".mapbox"));} bar.textContent="阿捨："+QUOTES[new Date().getDate()%QUOTES.length];}
function watchTitle(){const inp=document.getElementById("pTitle"); if(!inp||inp.dataset.watch) return; inp.dataset.watch="1"; inp.addEventListener("input",()=>{const hit=KEYS.some(k=>inp.value.toLowerCase().includes(k)); let box=document.getElementById("highHint"); if(!box){box=document.createElement("p"); box.id="highHint"; box.className="err"; inp.after(box);} if(hit){box.textContent="偵測到可能係高價值好物，已自動開雙重閘口，防炒賣。"; const h=document.getElementById("pHigh"); if(h) h.checked=true;} else box.textContent="";});}
const _goUi=goPost; goPost=function(){_goUi(); setTimeout(watchTitle,40);};
const _lockUi=lock;
lock=function(){const why=canClaim(); if(why){toast("等陣先！呢件好物你暫時排唔到住。"+why); return;} _lockUi();};
function bookMeet(){if(!cur) return; const st=prompt("港鐵站，例如東涌","東涌"); if(!st) return; const spot=prompt("具體位置","客務中心閘外")||"客務中心"; cur.meet=st+" · "+spot; cur.code=String(100+Math.floor(Math.random()*900)); cur.msgs.push({who:"sys",text:"街坊約定："+cur.meet+"。一撜石便成金，放飛機扣 20%。打卡碼 "+cur.code}); save(); openChat(cur.id);}
function checkIn(){if(!cur||!cur.code){toast("先約定交收"); return;} toast("對住站名牆，手勢比 "+cur.code); cur.msgs.push({who:"sys",text:"已打卡。驗證碼 "+cur.code}); save(); openChat(cur.id);}
function rateTags(){if(!cur) return; const tags=["準時到漏","超級有禮貌","清脆利落","完美配合"]; const pick=tags[Math.floor(Math.random()*tags.length)]; cur.tags=cur.tags||[]; cur.tags.push(pick); save(); toast("搞搞震，已評："+pick);}
const _chat=openChat;
openChat=function(id){_chat(id); let tools=document.getElementById("chatTools"); if(!tools){tools=document.createElement("div"); tools.id="chatTools"; tools.className="deal-bar"; const c=document.getElementById("chat"); c.insertBefore(tools, c.querySelector(".composer"));} tools.innerHTML='<button onclick="bookMeet()">約定交收</button><button onclick="checkIn()">到站打卡</button><button class="ghost" onclick="rateTags()">評下街坊</button>';};
const _feedUi=feed;
feed=function(){_feedUi(); tip(); document.querySelectorAll(".card").forEach(card=>{const h=card.querySelector("h3"); if(!h) return; const it=items.find(x=>x.title===h.textContent); if(it&&it.high&&!card.querySelector(".gem")){const b=document.createElement("span"); b.className="gem"; b.textContent="極品"; card.querySelector(".ph").appendChild(b);}});};
const st=document.createElement("style"); st.textContent=".ashe{margin:8px 16px 0;border:0;background:#004d26;color:#fff;border-radius:14px;padding:10px 12px;text-align:left;font:inherit;font-size:13px}.gem{position:absolute;top:8px;left:8px;background:#e2b657;color:#1d1d1f;border-radius:999px;padding:2px 6px;font-size:11px;font-weight:800}"; document.head.appendChild(st);
tip();
