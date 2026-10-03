const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const L={cs:{more:'Více',back:'Zpět na přehled'},en:{more:'More',back:'Back to overview'}};
const tagOf=i=>typeof i.open==='boolean'?`<span class="tag ${i.open?'on':''}"><span class="cs">${i.open?'Otevřeno':'Uzavřeno'}</span><span class="en">${i.open?'Open':'Closed'}</span></span>`:'';
const paras=t=>String(t||'').split(/\n\n+/).map(x=>`<p>${esc(x)}</p>`).join('');
document.querySelectorAll('[data-list]').forEach(box=>{
  const k=box.dataset.list,items=DATA[k]||[];
  if(!items.length)return;
  box.querySelectorAll('.empty').forEach(e=>e.remove());
  box.insertAdjacentHTML('beforeend',items.map(i=>{
    const u=`#/${k}/${esc(i.slug)}`;
    const lang=l=>`<div class="${l}"><h3><a href="${u}">${esc(i[l].t)}</a>${tagOf(i)}</h3><p>${esc(i[l].d)}</p><a href="${u}">${L[l].more}</a></div>`;
    return `<article class="row"><div class="when">${esc(i.date)}<br>${esc(i.place)}</div><div>${lang('cs')}${lang('en')}</div></article>`;
  }).join(''));
});
const home=document.getElementById('home'),det=document.getElementById('detail');
function route(){
  const m=location.hash.match(/^#\/(opportunities|projects|reports)\/([\w-]+)$/);
  const it=m&&(DATA[m[1]]||[]).find(i=>i.slug===m[2]);
  if(it){
    const lang=l=>`<div class="${l}"><a class="back" href="#${m[1]}">${L[l].back}</a><h2>${esc(it[l].t)}${tagOf(it)}</h2><p class="dm">${esc(it.date)}, ${esc(it.place)}</p>${paras(it[l].body||it[l].d)}${(it.photos||[]).map(x=>`<img class="ph" src="${esc(x)}" alt="" loading="lazy">`).join('')}${it.report?`<a class="btn" href="${esc(it.report)}">${l==='cs'?'Stáhnout report (PDF)':'Download report (PDF)'}</a>`:''}${it.link?`<a class="btn" href="${esc(it.link)}">${esc(it[l].a||L[l].more)}</a>`:''}</div>`;
    det.querySelector('.body').innerHTML=lang('cs')+lang('en');
    home.hidden=true;det.hidden=false;scrollTo(0,0);return;
  }
  det.hidden=true;home.hidden=false;
  const h=location.hash;
  if(/^#[\w-]+$/.test(h)){const el=document.querySelector(h);if(el)el.scrollIntoView();}else scrollTo(0,0);
}
addEventListener('hashchange',route);route();
const root=document.documentElement;
try{const v=localStorage.getItem('lang');if(v==='en'||v==='cs')root.lang=v;}catch(e){}
document.getElementById('lang').addEventListener('click',()=>{
  root.lang=root.lang==='cs'?'en':'cs';
  try{localStorage.setItem('lang',root.lang);}catch(e){}
});