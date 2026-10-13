(() => {
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const money=n=>'₹'+n.toLocaleString('en-IN');
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
const save=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v))}catch{}};
let cart=read('saibaba-cart',null), wishes=read('saibaba-wishes',[]);
const PREVIEW_KEY='saibaba-demo-started-at', PREVIEW_LIMIT_MS=10*60*1000, CALL_NUMBER='+917863000435', CALL_DISPLAY='+91 7863000435', WHATSAPP_NUMBER='917984344301', WHATSAPP_DISPLAY='+91 7984344301';
function initPreviewGate(){
 if(new URLSearchParams(location.search).has('demo-reset'))localStorage.removeItem(PREVIEW_KEY);
 let started=Number(localStorage.getItem(PREVIEW_KEY));
 if(!started||Number.isNaN(started)||started>Date.now()){started=Date.now();localStorage.setItem(PREVIEW_KEY,String(started))}
 const badge=document.createElement('div');
 badge.className='preview-timer';
 badge.setAttribute('role','timer');
 badge.setAttribute('aria-live','polite');
 document.body.append(badge);
 const lock=()=>{
  if(document.querySelector('.preview-lock'))return;
  document.body.classList.add('preview-expired');
  const overlay=document.createElement('section');
  overlay.className='preview-lock';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.innerHTML=`<div class="preview-lock-card"><span class="material-symbols-outlined preview-lock-icon" aria-hidden="true">lock_clock</span><p class="preview-lock-kicker">Client preview expired</p><h2>Demo access time is over</h2><p>This website preview was available for 10 minutes. For full access, more pages, pricing changes, or a live walkthrough, please contact Saibaba Electronics.</p><div class="preview-lock-actions"><a href="tel:${CALL_NUMBER}"><span class="material-symbols-outlined" aria-hidden="true">call</span> Call ${CALL_DISPLAY}</a><a href="https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%20want%20full%20website%20access%20after%20the%2010-minute%20preview" target="_blank" rel="noopener"><span class="material-symbols-outlined" aria-hidden="true">chat</span> WhatsApp ${WHATSAPP_DISPLAY}</a></div></div>`;
  document.body.append(overlay);
 };
 const tick=()=>{
  const remaining=Math.max(0,PREVIEW_LIMIT_MS-(Date.now()-started));
  const minutes=String(Math.floor(remaining/60000)).padStart(2,'0');
  const seconds=String(Math.floor((remaining%60000)/1000)).padStart(2,'0');
  badge.textContent=remaining?'Preview ends in '+minutes+':'+seconds:'Preview expired';
  if(!remaining)lock();
 };
 tick();
 setInterval(tick,1000);
}
initPreviewGate();
function toast(text){$('.demo-toast')?.remove();const el=document.createElement('div');el.className='demo-toast';el.setAttribute('role','status');el.textContent=text;document.body.append(el);setTimeout(()=>el.remove(),3000)}
function modal(title,text){const d=document.createElement('dialog');const h=document.createElement('h2');h.textContent=title;const p=document.createElement('p');p.textContent=text;const b=document.createElement('button');b.textContent='Close';b.onclick=()=>d.close();d.append(h,p,b);d.onclose=()=>d.remove();document.body.append(d);d.showModal()}
function badge(){const b=$('[data-path="shopping-cart"] span:last-child');if(b)b.textContent=cart?cart.reduce((s,p)=>s+p.qty,0):2;const w=$('[data-path="wishlist"] span:last-child');if(w)w.textContent=wishes.length}
function product(card){const title=$('h3',card)?.textContent.trim()||'Featured product';const price=Number(($('.text-label-price',card)?.textContent||'0').replace(/[^\d]/g,''));return {title,price,img:$('img',card)?.getAttribute('src')||'',qty:1}}
function productUrl(title){const words=title.toLowerCase();const items=window.SAIBABA_PRODUCTS||[];const exact=items.find(p=>p.title===title);const match=exact||items.map(p=>({p,score:p.title.toLowerCase().split(/\W+/).filter(w=>w.length>2&&words.includes(w)).length})).sort((a,b)=>b.score-a.score)[0]?.p;return match?'product.html?id='+match.id:'catalog.html'}
function linkProduct(card){const title=$('h3',card);if(!title)return;const url=productUrl(title.textContent.trim());const a=document.createElement('a');a.href=url;a.className='product-link';a.textContent=title.textContent.trim();title.replaceChildren(a);const img=$('img',card);if(img&&!img.closest('a')){const imageLink=document.createElement('a');imageLink.href=url;imageLink.className='block w-full h-full';img.before(imageLink);imageLink.append(img)}}
const categoryNow=new URLSearchParams(location.search).get('category')||'';
$$('header nav [data-path]').forEach(a=>{a.classList.remove('bg-primary-container','text-on-primary','nav-selected','font-semibold');a.removeAttribute('aria-current');if(a.dataset.path===(categoryNow||'product-catalog')&&(document.body.dataset.page==='catalog.html')){a.classList.add('nav-selected');a.setAttribute('aria-current','page')}});
function add(p){cart=cart||[];const existing=cart.find(x=>x.title===p.title);if(existing)existing.qty++;else cart.push(p);save('saibaba-cart',cart);badge();toast(p.title+' added to cart')}
$$('article, #featured-catalog .group').filter(card=>$('h3',card)&&$('.text-label-price',card)).forEach(card=>{const p=product(card);$$('button',card).forEach(b=>{if(/Add to Cart/i.test(b.textContent))b.onclick=()=>add(p);if(/Wishlist/i.test(b.title+' '+b.getAttribute('aria-label'))){b.onclick=()=>{wishes=wishes.includes(p.title)?wishes.filter(x=>x!==p.title):[...wishes,p.title];save('saibaba-wishes',wishes);b.style.color=wishes.includes(p.title)?'#ba1a1a':'';badge();toast(wishes.includes(p.title)?'Saved to wishlist':'Removed from wishlist')}}});linkProduct(card)});
const search=$('header input[placeholder*="Search"]');if(search){const run=()=>location.href='catalog.html?q='+encodeURIComponent(search.value.trim());search.onkeydown=e=>{if(e.key==='Enter')run()};const b=search.parentElement.querySelector('button');if(b)b.onclick=run}
$$('a[href^="#"]').forEach(a=>{const key=a.getAttribute('href').slice(1);if(['smartphones','smart-tvs','refrigerators','washing-machines','air-conditioners','laptops','kitchen-appliances','audio-and-sound','accessories'].includes(key))a.href='catalog.html?category='+key;if(/View Complete Catalog/.test(a.textContent))a.href='catalog.html'});
const grid=$('#productGrid');if(grid){
 const cards=$$('article',grid),params=new URLSearchParams(location.search);let q=params.get('q')||'',category=params.get('category')||'';
 $$('.compare-checkbox').forEach(cb=>cb.checked=false);
 const selectedLink=$('header nav [data-path="'+(category||'product-catalog')+'"]');const heading=$('main h1');if(heading&&selectedLink)heading.textContent=selectedLink.textContent.trim();
 const names={'smartphones':'iphone|galaxy|phone','smart-tvs':'tv|television','refrigerators':'refrigerator','washing-machines':'washing','air-conditioners':'inverter ac|daikin','laptops':'hp|laptop','kitchen-appliances':'refrigerator','audio-and-sound':'audio|sound'};
 const sidebar=$('main aside');const groups=sidebar?$$('h3',sidebar).map(h=>({title:h.textContent.trim(),inputs:$$('input[type="checkbox"]',h.parentElement)})):[];
 const range=$('input[type="range"]');groups.forEach(g=>g.inputs.forEach(i=>i.checked=false));if(range)range.value=range.max;
 const status=document.createElement('p');status.className='p-4 text-secondary font-semibold';grid.before(status);
 function filter(){let count=0;cards.forEach(card=>{const p=product(card),txt=card.textContent.toLowerCase();let visible=txt.includes(q.toLowerCase())&&(!names[category]||new RegExp(names[category],'i').test(p.title))&&(!params.has('wishlist')||wishes.includes(p.title));if(range)visible=visible&&p.price<=Number(range.value);groups.forEach(g=>{const selected=g.inputs.filter(i=>i.checked);if(selected.length){const labels=selected.map(i=>i.closest('label')?.textContent.trim().toLowerCase()||'');if(g.title==='Brand')visible=visible&&labels.some(l=>txt.includes(l));if(g.title==='Categories')visible=visible&&labels.some(l=>{const match=Object.entries(names).find(([key])=>key.replaceAll('-',' ')===l);return match?new RegExp(match[1],'i').test(p.title):txt.includes(l)})}});card.hidden=!visible;if(visible)count++});status.textContent=count?`${count} products${q?' matching “'+q+'”':''}`:'No products match. Clear filters or search another product.'}
 groups.forEach(g=>g.inputs.forEach(i=>i.addEventListener('change',filter)));range?.addEventListener('input',filter);filter();
 const countObserver=new MutationObserver(()=>{const count=cards.filter(c=>!c.hidden).length;const subtitle=heading?.nextElementSibling;if(subtitle)subtitle.textContent=`Showing ${count} sample ${category?category.replaceAll('-',' '):'products'} available in this client preview.`});countObserver.observe(status,{childList:true});const subtitle=heading?.nextElementSibling;if(subtitle)subtitle.textContent=`Showing ${cards.filter(c=>!c.hidden).length} sample products in this client preview.`;
 $$('#catalogSort option').forEach((o,i)=>o.value=String(i));$('#catalogSort')?.addEventListener('change',e=>{const value=e.target.selectedOptions[0].textContent.toLowerCase();const sorted=[...cards].sort((a,b)=>value.includes('low')?product(a).price-product(b).price:value.includes('high')?product(b).price-product(a).price:0);sorted.forEach(c=>grid.append(c))});
 $$('button').filter(b=>/Clear All|Reset/i.test(b.textContent)&&b.id!=='clearCompareBtn').forEach(b=>b.onclick=()=>{groups.forEach(g=>g.inputs.forEach(i=>i.checked=false));if(range)range.value=range.max;q='';category='';params.delete('wishlist');filter()});
 const slots=$('#compareSlots');function compare(){const checked=$$('.compare-checkbox:checked');if(checked.length>4){checked.at(-1).checked=false;toast('Compare up to four products');return compare()}if(slots){slots.replaceChildren();checked.forEach(cb=>{const el=document.createElement('span');el.className='px-3 py-2 bg-surface-container rounded-lg text-body-sm';el.textContent=cb.dataset.title;slots.append(el)})}$('#compareCountBadge').textContent=checked.length+'/4';$('#compareDrawer').classList.toggle('translate-y-full',!checked.length)}$$('.compare-checkbox').forEach(cb=>cb.addEventListener('change',compare));$('#clearCompareBtn')?.addEventListener('click',compare);compare();$$('button').find(b=>/Compare Specifications/.test(b.textContent))?.addEventListener('click',()=>{const products=$$('.compare-checkbox:checked').map(cb=>product(cb.closest('article')));modal('Product comparison',products.map(p=>p.title+' — '+money(p.price)).join('\n\n'))});
}
if(document.body.dataset.page==='cart.html'){
 const first=$('#cartItem1'),second=$('#cartItem2');if(cart===null){cart=[{title:'Samsung 55-inch Crystal 4K UHD Smart TV',price:42990,img:$('img',first)?.src,qty:1},{title:'Apple iPhone 15 (128GB, Blue)',price:65999,img:$('img',second)?.src,qty:1}];save('saibaba-cart',cart)}
 const host=document.createElement('div');first.before(host);first.remove();second.remove();let coupon=2000;
 function render(){host.replaceChildren();cart.forEach((p,index)=>{const row=document.createElement('div');row.className='py-4 flex gap-4 border-b border-outline-variant/30';const img=document.createElement('img');img.src=p.img;img.alt=p.title;img.className='w-20 h-24 object-contain rounded-lg';const info=document.createElement('div');info.className='flex-1';const h=document.createElement('h3');h.textContent=p.title;h.className='font-bold';const price=document.createElement('p');price.textContent=money(p.price*p.qty);price.className='text-secondary font-bold py-2';info.append(h,price);[-1,1,0].forEach(delta=>{const b=document.createElement('button');b.className='px-3 py-1 bg-surface-container rounded mr-2';b.textContent=delta===-1?'−':delta===1?'+':'Remove';b.setAttribute('aria-label',delta===0?'Remove '+p.title:(delta===1?'Increase ':'Decrease ')+p.title);b.onclick=()=>{if(delta===0)cart.splice(index,1);else p.qty=Math.max(1,Math.min(5,p.qty+delta));save('saibaba-cart',cart);render()};if(delta===1){const qty=document.createElement('span');qty.textContent=p.qty;qty.className='mr-2';info.append(qty)}info.append(b)});row.append(img,info);host.append(row)});if(!cart.length){const p=document.createElement('p');p.textContent='Your cart is empty. Browse the catalog to add products.';host.append(p)}const total=cart.reduce((s,p)=>s+p.qty*p.price,0);$('#cartCountBadge').textContent=cart.reduce((s,p)=>s+p.qty,0)+' Items';$('#summaryMrp').textContent=money(total);$('#summaryDiscount').textContent='₹0';$('#summaryCoupon').textContent='− '+money(Math.min(total,coupon));$('#finalAmountDisplay').textContent=money(Math.max(0,total-coupon));badge()}
 window.removeCoupon=()=>{coupon=0;render()};window.clearCartAlert=()=>{cart=[];save('saibaba-cart',cart);render()};window.handleCheckoutPayment=()=>{if(!cart.length)return toast('Add a product before checkout');modal('Demo order complete','Your '+money(Math.max(0,cart.reduce((s,p)=>s+p.price*p.qty,0)-coupon))+' demo order is ready for presentation. No payment was collected and no real order was sent.')};render();
}
$$('a[href="#"]').forEach(a=>{const text=a.textContent.trim();const categories=[['Smartphones','smartphones'],['Smart 4K TVs','smart-tvs'],['Refrigerators','refrigerators'],['Washing Machines','washing-machines'],['Air Conditioners','air-conditioners'],['Laptops & Mac','laptops'],['Small Kitchen','kitchen-appliances'],['Audio & Sound','audio-and-sound']];const match=categories.find(([label])=>text.includes(label));if(match){a.href='catalog.html?category='+match[1];return}if(/View Complete Catalog/.test(text)){a.href='catalog.html';return}a.addEventListener('click',e=>{e.preventDefault();modal(text||a.getAttribute('aria-label')||'Client preview','This screen is a template demonstration. This feature can be connected when the full website is developed.')})});
if(document.body.dataset.page==='admin.html'){$$('input[placeholder*="Search"]').forEach(input=>input.oninput=()=>$$('tbody tr').forEach(row=>row.hidden=!row.textContent.toLowerCase().includes(input.value.toLowerCase())));$$('button').forEach(b=>b.addEventListener('click',()=>modal(b.textContent.trim()||b.title||'Admin action','Demo action preview. Changes shown in this template do not update a real store.')))}
badge();
})();
