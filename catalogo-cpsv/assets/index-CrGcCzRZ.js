(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}})();const C=new Map;var K={set(t,e,i){C.has(t)||C.set(t,new Map);const s=C.get(t);if(!s.has(e)&&s.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s.keys())[0]}.`);return}s.set(e,i)},get(t,e){return C.has(t)&&C.get(t).get(e)||null},remove(t,e){if(!C.has(t))return;const i=C.get(t);i.delete(e),i.size===0&&C.delete(t)}};const Ye=1e3,ie="transitionend",Ge=t=>t==null?`${t}`:Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase(),Ze=t=>{let e=t.getAttribute("data-bs-target");if(!e||e==="#"){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&i!=="#"?i.trim():null}return e},Je=t=>{const e=Ze(t);return e&&document.querySelector(e)?e:null},Xe=t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const s=Number.parseFloat(e),n=Number.parseFloat(i);return!s&&!n?0:(e=e.split(",")[0],i=i.split(",")[0],(Number.parseFloat(e)+Number.parseFloat(i))*Ye)},Qe=t=>{t.dispatchEvent(new Event(ie))},O=t=>!t||typeof t!="object"?!1:typeof t.nodeType<"u",_e=t=>O(t)?t:typeof t=="string"&&t.length>0?document.querySelector(t):null,et=t=>{if(!O(t)||t.getClientRects().length===0)return!1;const e=getComputedStyle(t).getPropertyValue("visibility")==="visible",i=t.closest("details:not([open])");if(!i)return e;if(i!==t){const s=t.closest("summary");if(s&&s.parentNode!==i||s===null)return!1}return e},tt=t=>!t||t.nodeType!==Node.ELEMENT_NODE||t.classList.contains("disabled")?!0:typeof t.disabled<"u"?t.disabled:t.hasAttribute("disabled")&&t.getAttribute("disabled")!=="false",$e=t=>{typeof t=="function"&&t()},it=(t,e,i=!0)=>{if(!i){$e(t);return}const n=Xe(e)+5;let o=!1;const r=({target:a})=>{a===e&&(o=!0,e.removeEventListener(ie,r),$e(t))};e.addEventListener(ie,r),setTimeout(()=>{o||Qe(e)},n)},st=/[^.]*(?=\..*)\.|.*/,nt=/\..*/,ot=/::\d+$/,Y={};let Se=1;const Oe={mouseenter:"mouseover",mouseleave:"mouseout"},rt=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function ke(t,e){return e&&`${e}::${Se++}`||t.uidEvent||Se++}function Ne(t){const e=ke(t);return t.uidEvent=e,Y[e]=Y[e]||{},Y[e]}function at(t,e){return function i(s){return ce(s,{delegateTarget:t}),i.oneOff&&x.off(t,s.type,e),e.apply(t,[s])}}function lt(t,e,i){return function s(n){const o=t.querySelectorAll(e);for(let{target:r}=n;r&&r!==this;r=r.parentNode)for(const a of o)if(a===r)return ce(n,{delegateTarget:r}),s.oneOff&&x.off(t,n.type,e,i),i.apply(r,[n])}}function Pe(t,e,i=null){return Object.values(t).find(s=>s.callable===e&&s.delegationSelector===i)}function Me(t,e,i){const s=typeof e=="string",n=s?i:e||i;let o=dt(t);return rt.has(o)||(o=t),[s,n,o]}function xe(t,e,i,s,n){if(typeof e!="string"||!t)return;let[o,r,a]=Me(e,i,s);e in Oe&&(r=(S=>function(y){if(!y.relatedTarget||y.relatedTarget!==y.delegateTarget&&!y.delegateTarget.contains(y.relatedTarget))return S.call(this,y)})(r));const c=Ne(t),d=c[a]||(c[a]={}),p=Pe(d,r,o?i:null);if(p){p.oneOff=p.oneOff&&n;return}const h=ke(r,e.replace(st,"")),l=o?lt(t,i,r):at(t,r);l.delegationSelector=o?i:null,l.callable=r,l.oneOff=n,l.uidEvent=h,d[h]=l,t.addEventListener(a,l,o)}function se(t,e,i,s,n){const o=Pe(e[i],s,n);o&&(t.removeEventListener(i,o,!!n),delete e[i][o.uidEvent])}function ct(t,e,i,s){const n=e[i]||{};for(const o of Object.keys(n))if(o.includes(s)){const r=n[o];se(t,e,i,r.callable,r.delegationSelector)}}function dt(t){return t=t.replace(nt,""),Oe[t]||t}const x={on(t,e,i,s){xe(t,e,i,s,!1)},one(t,e,i,s){xe(t,e,i,s,!0)},off(t,e,i,s){if(typeof e!="string"||!t)return;const[n,o,r]=Me(e,i,s),a=r!==e,c=Ne(t),d=c[r]||{},p=e.startsWith(".");if(typeof o<"u"){if(!Object.keys(d).length)return;se(t,c,r,o,n?i:null);return}if(p)for(const h of Object.keys(c))ct(t,c,h,e.slice(1));for(const h of Object.keys(d)){const l=h.replace(ot,"");if(!a||e.includes(l)){const f=d[h];se(t,c,r,f.callable,f.delegationSelector)}}},trigger(t,e,i){if(typeof e!="string"||!t)return null;let s=!0,n=new Event(e,{bubbles:s,cancelable:!0});return n=ce(n,i),t.dispatchEvent(n),n}};function ce(t,e){for(const[i,s]of Object.entries(e||{}))try{t[i]=s}catch{Object.defineProperty(t,i,{configurable:!0,get(){return s}})}return t}function ze(t){if(t==="true")return!0;if(t==="false")return!1;if(t===Number(t).toString())return Number(t);if(t===""||t==="null")return null;if(typeof t!="string")return t;try{return JSON.parse(decodeURIComponent(t))}catch{return t}}function G(t){return t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}const ne={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${G(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${G(e)}`)},getDataAttributes(t){if(!t)return{};const e={},i=Object.keys(t.dataset).filter(s=>s.startsWith("bs")&&!s.startsWith("bsConfig"));for(const s of i){let n=s.replace(/^bs/,"");n=n.charAt(0).toLowerCase()+n.slice(1,n.length),e[n]=ze(t.dataset[s])}return e},getDataAttribute(t,e){return ze(t.getAttribute(`data-bs-${G(e)}`))}};class ut{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(e){return e=this._mergeConfigObj(e),e=this._configAfterMerge(e),this._typeCheckConfig(e),e}_configAfterMerge(e){return e}_mergeConfigObj(e,i){const s=O(i)?ne.getDataAttribute(i,"config"):{};return{...this.constructor.Default,...typeof s=="object"?s:{},...O(i)?ne.getDataAttributes(i):{},...typeof e=="object"?e:{}}}_typeCheckConfig(e,i=this.constructor.DefaultType){for(const s of Object.keys(i)){const n=i[s],o=e[s],r=O(o)?"element":Ge(o);if(!new RegExp(n).test(r))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${s}" provided type "${r}" but expected type "${n}".`)}}}const pt="5.2.3";class ft extends ut{constructor(e,i){super(),e=_e(e),e&&(this._element=e,this._config=this._getConfig(i),K.set(this._element,this.constructor.DATA_KEY,this))}dispose(){K.remove(this._element,this.constructor.DATA_KEY),x.off(this._element,this.constructor.EVENT_KEY);for(const e of Object.getOwnPropertyNames(this))this[e]=null}_queueCallback(e,i,s=!0){it(e,i,s)}_getConfig(e){return e=this._mergeConfigObj(e,this._element),e=this._configAfterMerge(e),this._typeCheckConfig(e),e}static getInstance(e){return K.get(_e(e),this.DATA_KEY)}static getOrCreateInstance(e,i={}){return this.getInstance(e)||new this(e,typeof i=="object"?i:null)}static get VERSION(){return pt}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(e){return`${e}${this.EVENT_KEY}`}}const j={find(t,e=document.documentElement){return[].concat(...Element.prototype.querySelectorAll.call(e,t))},findOne(t,e=document.documentElement){return Element.prototype.querySelector.call(e,t)},children(t,e){return[].concat(...t.children).filter(i=>i.matches(e))},parents(t,e){const i=[];let s=t.parentNode.closest(e);for(;s;)i.push(s),s=s.parentNode.closest(e);return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(i=>`${i}:not([tabindex^="-"])`).join(",");return this.find(e,t).filter(i=>!tt(i)&&et(i))}},ht="(max-width: 991px)",Ae=()=>{if(typeof window<"u")return window.matchMedia(ht).matches},g=[];for(let t=0;t<256;++t)g.push((t+256).toString(16).slice(1));function mt(t,e=0){return(g[t[e+0]]+g[t[e+1]]+g[t[e+2]]+g[t[e+3]]+"-"+g[t[e+4]]+g[t[e+5]]+"-"+g[t[e+6]]+g[t[e+7]]+"-"+g[t[e+8]]+g[t[e+9]]+"-"+g[t[e+10]]+g[t[e+11]]+g[t[e+12]]+g[t[e+13]]+g[t[e+14]]+g[t[e+15]]).toLowerCase()}const gt=new Uint8Array(16);function vt(){return crypto.getRandomValues(gt)}function bt(t,e,i){return crypto.randomUUID?crypto.randomUUID():yt(t)}function yt(t,e,i){var n;t=t||{};const s=t.random??((n=t.rng)==null?void 0:n.call(t))??vt();if(s.length<16)throw new Error("Random bytes length must be >= 16");return s[6]=s[6]&15|64,s[8]=s[8]&63|128,mt(s)}let Z=!1,k=[];class Et{constructor(e,i){this.id=e,this._callback=i}dispose(){wt(this.id)}_execute(e){this._callback(e)}}const wt=t=>{k=k.filter(e=>e.id!==t)},De=t=>{if(!(typeof document>"u")){if(k.length||typeof window<"u"&&typeof document<"u"&&document.addEventListener("scroll",e=>{Z||(window.requestAnimationFrame(()=>{k.forEach(i=>i.cb._execute(e)),Z=!1}),Z=!0)}),typeof t=="function"){const e=new Et(bt(),t);return k.push({id:e.id,cb:e}),e}return console.error("[onDocumentScroll] the provided data has to be of type function"),null}},Ct="sticky",_t="bs.sticky",de=`.${_t}`,Te=`resize${de}`,$t=`on${de}`,St=`off${de}`,xt="bs-it-sticky-wrapper",Ie="bs-is-sticky",Le="bs-is-fixed",zt="data-bs-target-mobile",qe='[data-bs-toggle="sticky"]',At={positionType:"sticky",stickyClassName:"",stackable:!1,paddingTop:0};class N extends ft{constructor(e,i){super(e),this._config=this._getConfig(i),this._isSticky=!1,this._wrapper=null,this._stickyTarget=j.findOne(Je(this._element),this._element)||this._element,this._stickyTargetMobile=j.findOne(this._element.getAttribute(zt),this._element)||this._stickyTarget,this._stickyLimit=0,this._stickyLimitMobile=0,this._setLimit(),this._scrollCb=null,this._isMobile=Ae(),this._prevTop=0,this._onScroll(),this._bindEvents()}dispose(){typeof window<"u"&&typeof document<"u"&&(x.off(window,Te),this._scrollCb.dispose(),super.dispose())}static get NAME(){return Ct}_getConfig(e){return e={...At,...ne.getDataAttributes(this._element),...typeof e=="object"?e:{}},e}_bindEvents(){typeof window<"u"&&typeof document<"u"&&(x.on(window,Te,()=>this._onResize()),this._scrollCb=De(()=>this._onScroll()))}_onResize(){this._isMobile=Ae(),this._setLimit()}_onScroll(){this._checkSticky()}_setLimit(){this._stickyLimit=this._cumulativeOffset(this._stickyTarget).top,this._stickyLimitMobile=this._cumulativeOffset(this._stickyTargetMobile).top}_getLimit(){let e=this._isMobile?this._stickyLimitMobile:this._stickyLimit;return this._config.stackable&&this._getStickySimblings().forEach((i,s)=>{const n=i.getBoundingClientRect();e-=n.height+(s===0?parseFloat(i.style.top):0)}),e>0?e:0}_cumulativeOffset(e){let i=0,s=0;do i+=e.offsetTop||0,s+=e.offsetLeft||0,e=e.offsetParent;while(e);return{top:i,left:s}}_isTypeSticky(){return this._config.positionType==="sticky"}_checkSticky(){this._isSticky||this._setLimit();const e=this._getLimit();typeof window<"u"&&window.pageYOffset>e?this._setSticky():this._unsetSticky()}_setSticky(){if(!this._isSticky){this._isSticky=!0;let e=Ie;this._isTypeSticky()||(e=Le,this._wrapper=this._createWrapper()),this._element.classList.add(e),this._config.stickyClassName&&this._element.classList.add(this._config.stickyClassName),this._prevTop=this._element.style.top,this._element.style.top=this._getPositionTop()+"px",x.trigger(this._element,$t)}}_unsetSticky(){if(this._isSticky){let e=Ie;this._isTypeSticky()||(e=Le,this._destroyWrapper()),this._element.classList.remove(e),this._config.stickyClassName&&this._element.classList.remove(this._config.stickyClassName),this._element.style.top=this._prevTop,this._isSticky=!1,x.trigger(this._element,St)}}_createWrapper(){if(typeof document>"u")return;const e=document.createElement("div");return e.classList.add(xt),e.style.width="100%",e.style.height=this._element.getBoundingClientRect().height+"px",e.style.overflow="hidden",this._element.parentNode.insertBefore(e,this._element),e.appendChild(this._element),e}_destroyWrapper(){this._wrapper&&(this._wrapper.parentNode.insertBefore(this._element,this._wrapper),this._wrapper.remove())}_getStickySimblings(){return j.find(qe).filter(i=>{const s=N.getInstance(i);return!!(s&&s._isSticky&&i!==this._element)})}_getPositionTop(){let e=0;return this._config.stackable?(this._getStickySimblings().forEach((i,s)=>{const n=i.getBoundingClientRect();e+=n.height+(s===0?parseFloat(i.style.top):0)}),e):e+this._config.paddingTop}}typeof window<"u"&&typeof document<"u"&&De(()=>{j.find(qe).map(e=>{N.getOrCreateInstance(e)})});const Tt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},It={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"};function v(t){if(t==null)return null;if(typeof t=="string")return t.trim()||null;if(Array.isArray(t)){for(const e of t){const i=v(e);if(i)return i}return null}if(typeof t=="object"){if(typeof t["@value"]=="string")return t["@value"].trim()||null;if(typeof t.value=="string")return t.value.trim()||null}return null}function ue(t){return t==null?[]:Array.isArray(t)?t:[t]}function Lt(t){return t==null?null:typeof t=="string"?t:typeof t=="object"&&t["@id"]?String(t["@id"]):null}function J(t,e){const i=t==null?void 0:t["@type"];return ue(i).map(String).some(n=>n===e||n.endsWith(e)||n.includes(e))}function B(t,e=180){if(!t)return"";const i=t.replace(/\s+/g," ").trim();return i.length<=e?i:`${i.slice(0,e-1).trim()}…`}function u(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Ot=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,kt=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function z(t){if(!t)return null;let e=String(t);return e=e.replace(/<script[\s\S]*?<\/script>/gi," "),e=e.replace(/<style[\s\S]*?<\/style>/gi," "),e=e.replace(/<[^>]+>/g," "),e=e.replace(/&nbsp;/gi," "),e=e.replace(/&amp;/gi,"&"),e=e.replace(Ot," "),e=e.replace(/\r\n/g,`
`),e=e.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),e||null}function Nt(t){const e=z(t);if(!e)return[];if(e.includes(`

`)){const a=[];for(const c of e.split(`

`)){const d=c.trim();if(d)if(qt(d))a.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=a[a.length-1];p&&p.heading&&!p.text?p.text=d:a.push({heading:null,text:d})}}return a.filter(c=>c.heading||c.text)}const i=[...e.matchAll(kt)];if(!i.length)return[{heading:null,text:e}];const s=i.map(a=>({index:a.index,title:a[1].replace(/\s+/g," ").trim()})).filter(a=>a.title.length>=10&&a.title.split(/\s+/).length>=2);if(!s.length)return[{heading:null,text:e}];const n=[];for(const a of s){const c=n[n.length-1];c&&a.index<c.index+c.title.length||n.push(a)}const o=[],r=n[0];if(r.index>0){const a=e.slice(0,r.index).trim();a&&o.push({heading:null,text:a})}for(let a=0;a<n.length;a++){const c=n[a].index+n[a].title.length,d=a+1<n.length?n[a+1].index:e.length,p=e.slice(c,d).trim();o.push({heading:n[a].title,text:p})}return o.filter(a=>a.heading||a.text)}const Pt=/<(p|ul|ol|li|strong|b|em|i|a|br)\b/i,Mt=new Set(["p","ul","ol","li","strong","b","em","i","a","br"]);function Dt(t){if(!t||!Pt.test(t)||typeof DOMParser>"u")return null;const i=new DOMParser().parseFromString(`<div id="rich-root">${t}</div>`,"text/html").getElementById("rich-root");return i&&L(i).innerHTML.trim()||null}function L(t){const e=t.ownerDocument,i=e.createElement("div");for(const s of[...t.childNodes]){if(s.nodeType===Node.TEXT_NODE){i.appendChild(e.createTextNode(s.textContent));continue}if(s.nodeType!==Node.ELEMENT_NODE)continue;const n=s.tagName.toLowerCase();if(!Mt.has(n)){const a=L(s);for(;a.firstChild;)i.appendChild(a.firstChild);continue}if(n==="a"){const a=s.getAttribute("href")||"";if(!/^https?:\/\//i.test(a)){const p=L(s);for(;p.firstChild;)i.appendChild(p.firstChild);continue}const c=e.createElement("a");c.setAttribute("href",a),c.setAttribute("rel","noopener noreferrer");const d=L(s);for(;d.firstChild;)c.appendChild(d.firstChild);c.textContent.trim()&&i.appendChild(c);continue}const o=e.createElement(n),r=L(s);for(;r.firstChild;)o.appendChild(r.firstChild);(n==="br"||o.textContent.trim())&&i.appendChild(o)}return i}function oe(t){const e=Dt(t);if(e)return e;const i=Nt(t);return i.length?i.map(s=>{const n=[];return s.heading&&n.push(`<h3 class="h5 mt-3 mb-2">${u(Rt(s.heading))}</h3>`),s.text&&n.push(`<p class="mb-2">${u(s.text)}</p>`),n.join("")}).join(""):""}function qt(t){const e=t.replace(/\s+/g," ").trim();return e.length<5||e.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(e)||e!==e.toLocaleUpperCase("it")||e.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(e)}function Rt(t){return t.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,s,n)=>s+n.toLocaleUpperCase("it"))}const Re="./cpsv_full.jsonld";function re(t=window.location.hash){const e=(t||"").replace(/^#/,"");let i=null,s="/";if(e.startsWith("catalog=")){const d=e.indexOf("&"),p=d===-1?e.slice(8):e.slice(8,d);i=decodeURIComponent(p),s=d===-1?"/":e.slice(d+1)||"/"}else e&&(s=e.startsWith("/")?e:`/${e}`);const{path:n,query:o}=Bt(s),r=n.startsWith("/")?n:`/${n}`;let a="list",c=null;if(r==="/cpsv")a="cpsv";else{const d=r.match(/^\/servizio\/(.+)$/);d&&(a="detail",c=decodeURIComponent(d[1]))}return{catalog:i,path:r,view:a,serviceId:c,filters:Ht(o)}}function _({catalog:t,path:e="/",filters:i}={}){const s=e.startsWith("/")?e:`/${e}`,n=Vt(i);return t?`#catalog=${encodeURIComponent(t)}&${s}${n}`:`#${s}${n}`}function Ut(t,{replace:e=!1}={}){const i=_(t);jt(re(window.location.hash||"#"),re(i))||(e?history.replaceState(null,"",i):history.pushState(null,"",i))}function jt(t,e){return t.catalog===e.catalog&&t.path===e.path&&t.view===e.view&&t.serviceId===e.serviceId&&t.filters.q===e.filters.q&&t.filters.org===e.filters.org&&t.filters.lifeEvent===e.filters.lifeEvent&&t.filters.theme===e.filters.theme&&t.filters.page===e.filters.page}function Bt(t){const e=t.indexOf("?");return e===-1?{path:t||"/",query:""}:{path:t.slice(0,e)||"/",query:t.slice(e+1)}}function Ht(t){const e=new URLSearchParams(t||""),i=Number(e.get("p")||"1"),s=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:e.get("q")||"",org:e.get("ente")||"",lifeEvent:e.get("evento")||"",theme:e.get("tema")||"",page:s}}function Vt(t){if(!t)return"";const e=new URLSearchParams;t.q&&e.set("q",String(t.q)),t.org&&e.set("ente",String(t.org)),t.lifeEvent&&e.set("evento",String(t.lifeEvent)),t.theme&&e.set("tema",String(t.theme));const i=Number(t.page||1);Number.isFinite(i)&&i>1&&e.set("p",String(Math.floor(i)));const s=e.toString();return s?`?${s}`:""}function Ue(t){return!t||!String(t).trim()?Re:String(t).trim()}async function Ft(t){const e=Ue(t);let i;try{i=await fetch(e,{credentials:"same-origin"})}catch(n){const o=new Error(`Impossibile scaricare il catalogo (${e}). Verifica URL, CORS o rete.`);throw o.cause=n,o.code="NETWORK",o}if(!i.ok){const n=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${e}`);throw n.code="HTTP",n}let s;try{s=await i.json()}catch(n){const o=new Error(`Il file non è un JSON valido: ${e}`);throw o.cause=n,o.code="JSON",o}if(!s||typeof s!="object"||!Array.isArray(s["@graph"])){const n=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw n.code="SHAPE",n}return{doc:s,url:e}}function w(t){return ue(t).map(Lt).filter(Boolean)}function R(t,e){const i=[];for(const s of t){const n=e.get(s);if(!n)continue;const o=z(v(n["dct:title"])||v(n["skos:prefLabel"])),r=v(n["dct:description"])||v(n["rdfs:comment"]),c=z(r)||o;c&&i.push({id:s,title:o,text:c,html:r})}return i}function Wt(t,e){var a;let i=null;const s=t["foaf:page"];if(typeof s=="string"&&s.startsWith("http")?i=s:(a=s==null?void 0:s["@id"])!=null&&a.startsWith("http")&&(i=s["@id"]),!i)for(const c of w(t["cpsv:hasWebSiteChannel"])){const d=e.get(c),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof t["@id"]=="string"&&t["@id"].startsWith("http")&&(i=t["@id"].split("#")[0]);const n=[],o=new Set,r=c=>{if(!c||!c.startsWith("http"))return;const d=c.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||o.has(d)||(o.add(d),n.push(c))};for(const c of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of w(t[c])){const p=e.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&r(d);continue}const h=p["foaf:page"];typeof h=="string"?r(h):h!=null&&h["@id"]&&r(h["@id"])}return{sheetUrl:i,applicationUrls:n}}function Kt(t,e){const i=t["@graph"]||[],s=new Map;for(const l of i)l&&l["@id"]&&s.set(String(l["@id"]),l);const n=new Map;for(const l of i)l&&(J(l,"PublicOrganisation")||J(l,"cv:PublicOrganisation"))&&n.set(l["@id"],{id:l["@id"],title:v(l["dct:title"])||l["@id"],homepage:typeof l["foaf:homepage"]=="string"?l["foaf:homepage"]:null});const o=[];for(const l of i){if(!l||!J(l,"PublicService"))continue;const S=w(l["cv:hasCompetentAuthority"]||l["cpsv:producedBy"])[0]||null,y=S?n.get(S):null,fe=w(l["cpsv:isPartOfEvent"]),he=w(l["cpsv:hasTheme"]),Be=w(l["cpsv:hasInput"]),me=R(Be,s),He=w(l["cpsv:hasProcessingTime"]),W=R(He,s),ge=v(l["aci:processingTime"]);ge&&W.push({id:`${l["@id"]}#aci-time`,text:ge});const Ve=w(l["cpsv:hasOutput"]),ve=R(Ve,s),be=w(l["cv:addressee"]),M=R(be,s);if(!M.length)for(const E of be){const A=s.get(E),Ce=v(A==null?void 0:A["dct:title"])||v(A==null?void 0:A["skos:prefLabel"]);Ce?M.push({id:E,text:Ce}):E.includes("#addressee-")&&M.push({id:E,text:decodeURIComponent(E.split("#addressee-").pop())})}const ye=z(v(l["aci:costDescription"])||v(l["cpsv:hasCost"])),{sheetUrl:D,applicationUrls:q}=Wt(l,s),Fe=[D,...q].filter(Boolean),We=z(v(l["dct:title"])||v(l["cpsv:name"]))||"Servizio",Ee=v(l["dct:description"]),we=z(Ee),Ke=z(v(l["dct:abstract"]))||we;o.push({id:l["@id"],title:We,description:we,descriptionHtml:Ee,abstract:Ke,orgId:S,orgTitle:(y==null?void 0:y.title)||null,lifeEventIds:fe,themeIds:he,lifeEventLabels:fe.map(E=>e.lifeEvents[E]||E.split("/").pop()),themeLabels:he.map(E=>e.themes[E]||`Tema ${E.split("/").pop()}`),addressees:M,inputs:me,outputs:ve,processingTimes:W,cost:ye,sheetUrl:D,applicationUrls:q,onlineUrls:Fe,hasOnlineChannel:q.length>0,pageUrl:D||l["@id"],flags:{hasInput:me.length>0,hasOutput:ve.length>0,hasTime:W.length>0,hasCost:!!ye,hasOnline:q.length>0,hasSheet:!!D}})}o.sort((l,f)=>l.title.localeCompare(f.title,"it"));const r=[...n.values()].sort((l,f)=>l.title.localeCompare(f.title,"it")),a=new Map,c=new Map;for(const l of o){for(const f of l.lifeEventIds)a.set(f,(a.get(f)||0)+1);for(const f of l.themeIds)c.set(f,(c.get(f)||0)+1)}const d=[...a.entries()].map(([l,f])=>({id:l,label:e.lifeEvents[l]||l.split("/").pop(),count:f})).sort((l,f)=>l.label.localeCompare(f.label,"it")),p=[...c.entries()].map(([l,f])=>({id:l,label:e.themes[l]||`Tema ${l.split("/").pop()}`,count:f})).sort((l,f)=>l.label.localeCompare(f.label,"it")),h=ue(t["cpsv-portalone:sourceCatalogs"]).map(l=>({id:l==null?void 0:l["@id"],title:v(l==null?void 0:l["dct:title"])||(l==null?void 0:l["@id"])}));return{services:o,orgsById:n,nodesById:s,facets:{orgs:r,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:t["dct:modified"]||null,sources:h,count:o.length}}}function Yt(t,e){const i=(e.q||"").trim().toLocaleLowerCase("it");return t.filter(s=>!(e.org&&s.orgId!==e.org||e.lifeEvent&&!s.lifeEventIds.includes(e.lifeEvent)||e.theme&&!s.themeIds.includes(e.theme)||e.onlineOnly&&!s.flags.hasOnline||i&&!`${s.title} ${s.abstract||""} ${s.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const ae=24,X="Catalogo dei servizi della PA",Gt="Trova e consulta i servizi digitali della Pubblica Amministrazione";function Zt({catalogUrl:t,meta:e,error:i,detail:s=null,filters:n=null,view:o="list"}){const r=u(_({catalog:H(t),path:"/",filters:n})),a=u(_({catalog:H(t),path:"/cpsv",filters:n})),c=e?`${e.count} serviz${e.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky" data-bs-toggle="sticky" data-bs-position-type="fixed" data-bs-target="#sticky-trigger" data-bs-sticky-class-name="is-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${r}" aria-label="${u(X)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${u(X)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${u(Gt)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${s?Jt(s,{homeHref:r}):""}
  <div id="sticky-trigger" class="sticky-trigger" aria-hidden="true"></div>
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${u(i)}</p>
        </div>`:""}
  ${o==="list"&&!s?`<p class="text-secondary mb-2">${u(c)}</p>
         <p class="mb-4"><a href="${a}">Cos’è CPSV</a></p>`:""}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${u(X)}</h2>
      <p class="mb-2">
        <a href="${a}"${o==="cpsv"?' aria-current="page"':""}>Cos’è CPSV</a>
      </p>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function Jt(t,{homeHref:e}){var o;const i=t.sheetUrl||t.pageUrl,s=i?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${u(i)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai al servizio
        ${Xt()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',n=((o=t.lifeEventLabels)==null?void 0:o.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${t.lifeEventLabels.map(r=>`<span class="service-header-pill" role="listitem">${u(r)}</span>`).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${e}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${u(B(t.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${u(t.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${u(t.title)}</h1>
        ${n}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${s}
      </div>
    </div>
  </div>
</div>`}function Xt(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function H(t){return!t||t==="./cpsv_full.jsonld"?null:t}function Qt(t){if(!t)return"Ente";const e=String(t).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!e)return B(t,36);const i=e[1];return/agenzia delle entrate/i.test(t)?"Agenzia delle Entrate":/motorizzazione/i.test(t)?"Motorizzazione":/anpr/i.test(t)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function Q({id:t,name:e,label:i,optionsHtml:s,value:n}){return`
<div class="mb-3">
  <label class="form-label" for="${u(t)}">${u(i)}</label>
  <select class="form-select" id="${u(t)}" name="${u(e)}">
    ${s}
  </select>
</div>`}function ei({index:t,filterState:e}){const{facets:i}=t,s=['<option value="">Tutti gli enti</option>',...i.orgs.map(r=>`<option value="${u(r.id)}" ${e.org===r.id?"selected":""}>${u(r.title)}</option>`)].join(""),n=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(r=>`<option value="${u(r.id)}" ${e.lifeEvent===r.id?"selected":""}>${u(r.label)}</option>`)].join(""),o=['<option value="">Tutti i temi</option>',...i.themes.map(r=>`<option value="${u(r.id)}" ${e.theme===r.id?"selected":""}>${u(r.label)}</option>`)].join("");return`
<div class="row">
  <aside class="col-lg-4 col-xl-3 mb-4" aria-labelledby="filters-title">
    <div class="border rounded p-3 bg-white shadow-sm">
      <h2 class="h5" id="filters-title">Filtra i servizi</h2>
      <form id="filters-form" class="mt-3">
        <div class="mb-3">
          <label class="form-label" for="filter-q">Cerca</label>
          <input
            type="search"
            class="form-control"
            id="filter-q"
            name="q"
            value="${u(e.q||"")}"
            placeholder="Es. bollo, pensione, residenza"
            autocomplete="off"
          />
        </div>
        ${Q({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:s,value:e.org})}
        ${Q({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:n,value:e.lifeEvent})}
        ${Q({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:o,value:e.theme})}
        <button type="button" class="btn btn-outline-primary btn-sm" id="filters-reset">
          Azzera filtri
        </button>
      </form>
    </div>
  </aside>

  <section class="col-lg-8 col-xl-9" aria-live="polite">
    <p class="mb-3 fw-semibold" id="results-count"></p>
    <div class="row g-4" id="results-grid"></div>
    <nav class="mt-4" aria-label="Paginazione dei risultati" id="pager"></nav>
  </section>
</div>
`}function ti(t,{catalogUrl:e,page:i,filterState:s={}}){const n=H(e),o=(i-1)*ae,r=t.slice(o,o+ae);return r.length?r.map(a=>{const c=_({catalog:n,path:`/servizio/${encodeURIComponent(a.id)}`,filters:{...s,page:i}}),d=Qt(a.orgTitle),p=a.lifeEventIds[0]||"",h=a.lifeEventLabels[0]?B(a.lifeEventLabels[0],40):null,l=s.org&&s.org===a.orgId,f=s.lifeEvent&&s.lifeEvent===p,S=a.orgId?`<button
            type="button"
            class="chip chip-simple ${l?"chip-filter-active":""}"
            data-filter-org="${u(a.orgId)}"
            aria-pressed="${l?"true":"false"}"
            title="Filtra per ${u(d)}"
          ><span class="chip-label">${u(d)}</span></button>`:"",y=p?`<button
            type="button"
            class="chip chip-simple ${f?"chip-filter-active":""}"
            data-filter-life-event="${u(p)}"
            aria-pressed="${f?"true":"false"}"
            title="Filtra per questo momento della vita"
          ><span class="chip-label">${u(h)}</span></button>`:"";return`
<div class="col-md-6">
  <div class="card-wrapper card-space h-100">
    <div class="card card-bg no-after h-100 border">
      <div class="card-body d-flex flex-column">
        <div class="chip-list mb-3" role="group" aria-label="Filtri rapidi">
          ${S}
          ${y}
        </div>
        <h3 class="card-title h5">
          <a href="${u(c)}">${u(a.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${u(B(a.abstract||"Descrizione non disponibile per questo servizio.",180))}
        </p>
        <div class="mt-auto">
          <a class="btn btn-outline-primary btn-sm" href="${u(c)}">
            Vai alla scheda
          </a>
        </div>
      </div>
    </div>
  </div>
</div>`}).join(""):`
<div class="col-12">
  <div class="alert alert-info" role="status">
    Nessun servizio corrisponde ai filtri scelti. Prova ad allargare la ricerca.
  </div>
</div>`}function ii(t,e,{catalogUrl:i,filterState:s={}}={}){const n=Math.max(1,Math.ceil(t/ae));if(n<=1)return"";const o=H(i),r=[];for(let a=1;a<=n;a++){const c=_({catalog:o,path:"/",filters:{...s,page:a}});r.push(`<li class="page-item ${a===e?"active":""}">
        <a class="page-link" href="${u(c)}" data-page="${a}" ${a===e?'aria-current="page"':""}>${a}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${r.join("")}</ul>`}function si(t){const e=[];return t.addressees.length&&e.push(I("A chi è rivolto",U(t.addressees))),t.inputs.length&&e.push(I("Cosa serve",U(t.inputs))),t.processingTimes.length&&e.push(I("Tempi",U(t.processingTimes))),t.cost&&e.push(I("Costi",oe(t.cost))),t.outputs.length&&e.push(I("Cosa si ottiene",U(t.outputs))),`
${t.description?`<div class="font-serif service-description">${oe(t.descriptionHtml||t.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${e.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function I(t,e){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${u(t)}</h2>
  ${e}
</section>`}function U(t){return t.map(e=>`<div class="mb-3 service-block-text">${oe(e.html||e.text)}</div>`).join("")}const ni=`{
  "@context": {
    "cpsv": "https://w3id.org/italia/onto/CPSV#",
    "cv": "http://data.europa.eu/m8g/",
    "dct": "http://purl.org/dc/terms/",
    "foaf": "http://xmlns.com/foaf/0.1/"
  },
  "@graph": [
    {
      "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza",
      "@type": "cpsv:PublicService",
      "dct:title": {
        "@language": "it",
        "@value": "Certificato di residenza"
      },
      "dct:description": {
        "@language": "it",
        "@value": "Attesta l’indirizzo di residenza anagrafica di una persona iscritta nel comune."
      },
      "cv:hasCompetentAuthority": {
        "@id": "https://comune.vallefiume.example/ente"
      },
      "cv:addressee": {
        "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#cittadino"
      },
      "cpsv:hasInput": {
        "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#documento"
      },
      "cpsv:hasOutput": {
        "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#certificato"
      },
      "cpsv:hasProcessingTime": {
        "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#tempo"
      },
      "cpsv:hasWebSiteChannel": {
        "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#canale"
      },
      "cpsv:isPartOfEvent": {
        "@id": "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9"
      },
      "cpsv:hasTheme": {
        "@id": "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9"
      }
    },
    {
      "@id": "https://comune.vallefiume.example/ente",
      "@type": "cv:PublicOrganisation",
      "dct:title": { "@language": "it", "@value": "Comune di Vallefiume" }
    },
    {
      "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#cittadino",
      "@type": "cv:Agent",
      "dct:title": { "@language": "it", "@value": "Cittadino" }
    },
    {
      "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#documento",
      "@type": "cpsv:Input",
      "dct:description": { "@language": "it", "@value": "Documento di identità" }
    },
    {
      "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#certificato",
      "@type": "cpsv:Output",
      "dct:description": { "@language": "it", "@value": "Certificato di residenza" }
    },
    {
      "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#tempo",
      "@type": "cpsv:ServiceProcessingTime",
      "dct:description": { "@language": "it", "@value": "Entro 2 giorni lavorativi" }
    },
    {
      "@id": "https://comune.vallefiume.example/servizi/certificato-di-residenza#canale",
      "@type": "cpsv:WebSiteChannel",
      "dct:title": { "@language": "it", "@value": "Sportello online del comune" },
      "foaf:page": "https://comune.vallefiume.example/anagrafe/certificato-residenza"
    }
  ]
}`;function oi({homeHref:t}){const e=u(t);return`
<article class="cpsv-page">
  <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${e}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
      <li class="breadcrumb-item active" aria-current="page">Cos’è CPSV</li>
    </ol>
  </nav>

  <h1 class="mb-4">Cos’è CPSV</h1>

  <section class="cpsv-prose mb-5" aria-labelledby="cpsv-semantica">
    <h2 class="h3" id="cpsv-semantica">Cos’è la semantica</h2>
    <p>
      La semantica è il significato dei dati, non la forma con cui compaiono sulla pagina.
      La frase «il certificato costa 16 euro e arriva in due giorni» è un paragrafo:
      una persona la capisce, un programma no, se non gliela si rispiega ogni volta.
    </p>
    <p>
      Se quello stesso fatto è marcato come costo e come tempo di un servizio,
      il dato può essere letto da questo catalogo, da un altro sito o da un assistente,
      senza reinterpretare il testo.
    </p>
  </section>

  <section class="cpsv-prose mb-4" aria-labelledby="cpsv-vocabolario">
    <h2 class="h3" id="cpsv-vocabolario">Cos’è CPSV</h2>
    <p>
      CPSV-AP_IT, Core Public Service Vocabulary nel profilo italiano, è il vocabolario
      condiviso per descrivere un servizio pubblico. Ogni servizio ha gli stessi pezzi:
      chi lo eroga, a chi è rivolto, che cosa serve per chiederlo, che cosa si ottiene,
      in quanto tempo, da quale canale, in quale momento della vita e sotto quale tema.
    </p>
    <p>
      Questo catalogo legge proprio quelle relazioni. Il disegno qui sotto è il modello,
      non l’insieme delle schede pubblicate.
    </p>
  </section>

  <figure class="cpsv-graph mb-3">
    ${ri()}
    <figcaption class="cpsv-prose mt-3">
      Titolo, descrizione e pagina (<code>dct:title</code>, <code>dct:description</code>,
      <code>foaf:page</code>) sono informazioni scritte sui nodi, non classi a sé.
      I due canali online stanno nello stesso riquadro: la scheda sul sito dell’ente
      e, quando c’è, l’accesso all’applicazione.
    </figcaption>
  </figure>

  <section class="cpsv-prose mb-5" aria-labelledby="cpsv-legami">
    <h2 class="h4" id="cpsv-legami">Gli stessi legami, in testo</h2>
    <ul>
      <li>Un servizio è erogato da un ente: <code>cv:hasCompetentAuthority</code> verso <code>cv:PublicOrganisation</code>.</li>
      <li>Si rivolge a qualcuno: <code>cv:addressee</code> verso <code>cv:Agent</code>.</li>
      <li>Per chiederlo serve qualcosa: <code>cpsv:hasInput</code> verso <code>cpsv:Input</code>.</li>
      <li>Produce un risultato: <code>cpsv:hasOutput</code> verso <code>cpsv:Output</code>.</li>
      <li>Si apre da una pagina: <code>cpsv:hasWebSiteChannel</code> verso <code>cpsv:WebSiteChannel</code>.</li>
      <li>O da un altro accesso online: <code>cpsv:hasOtherElectronicChannel</code> verso <code>cpsv:OtherElectronicChannel</code>.</li>
      <li>Rientra in un momento della vita: <code>cpsv:isPartOfEvent</code>.</li>
      <li>Rientra in un tema: <code>cpsv:hasTheme</code>.</li>
    </ul>
  </section>

  <section class="cpsv-prose" aria-labelledby="cpsv-caso">
    <h2 class="h3" id="cpsv-caso">Un caso d’uso</h2>
    <p>
      Giulia si trasferisce e le serve il certificato di residenza.
      Il comune, se descrive il servizio con CPSV, non scrive solo un testo:
      compila gli stessi nodi del grafo. Il servizio qui sotto è inventato,
      del Comune di Vallefiume, e non compare nell’elenco.
    </p>
    <div class="alert alert-info" role="note">
      <p class="mb-0">Esempio inventato. Non è una scheda di questo catalogo.</p>
    </div>
    <dl class="cpsv-instance">
      <div>
        <dt>Servizio pubblico</dt>
        <dd>Certificato di residenza</dd>
      </div>
      <div>
        <dt>Ente</dt>
        <dd>Comune di Vallefiume</dd>
      </div>
      <div>
        <dt>Destinatario</dt>
        <dd>Cittadino</dd>
      </div>
      <div>
        <dt>Che cosa serve</dt>
        <dd>Documento di identità</dd>
      </div>
      <div>
        <dt>Che cosa si ottiene</dt>
        <dd>Certificato di residenza</dd>
      </div>
      <div>
        <dt>Tempo</dt>
        <dd>Entro 2 giorni lavorativi</dd>
      </div>
      <div>
        <dt>Canale</dt>
        <dd>Sportello online del comune</dd>
      </div>
      <div>
        <dt>Momento della vita</dt>
        <dd>Cambio di residenza o domicilio</dd>
      </div>
      <div>
        <dt>Tema</dt>
        <dd>Anagrafe e residenza</dd>
      </div>
    </dl>
    <p>
      Il tempo è collegato al servizio con <code>cpsv:hasProcessingTime</code>:
      nel disegno non è una classe a sé, come non lo sono titolo e descrizione.
      Momento della vita e tema usano i vocabolari già usati da questo sito.
      Il servizio, l’ente e il canale sono invece inventati:
      gli indirizzi stanno su <code>comune.vallefiume.example</code>.
    </p>
    <h3 class="h4">Lo stesso caso in JSON-LD</h3>
    <pre class="cpsv-code"><code>${u(ni)}</code></pre>
    <p>
      Nell’elenco, il filtro Ente segue l’ente competente, Momento della vita segue l’evento
      e Argomento segue il tema. Sono le stesse frecce del grafo, applicate alle schede vere.
    </p>
    <p><a href="${e}">Vai al catalogo</a></p>
  </section>
</article>`}function ri(){const t=(i,s,n,o,r,a,c=!1)=>{const d=c?"#fff":"#17324d",p=c?"#d6e8fa":"#5c6f82";return`
      <rect x="${i}" y="${s}" width="${n}" height="${o}" rx="8" fill="${c?"#0066cc":"#fff"}" stroke="#0066cc" stroke-width="2"/>
      <text x="${i+n/2}" y="${s+30}" text-anchor="middle" font-size="16" font-weight="700" fill="${d}">${u(r)}</text>
      <text x="${i+n/2}" y="${s+52}" text-anchor="middle" font-size="13" fill="${p}">${u(a)}</text>`},e=(i,s,n)=>{const o=Math.max(...n.map(d=>d.length))*6.6+12,r=n.length*16+8,a=i-o/2,c=s-14;return`
      <rect x="${a}" y="${c}" width="${o}" height="${r}" fill="#fff"/>
      ${n.map((d,p)=>`<text x="${i}" y="${s+p*16}" text-anchor="middle" font-size="12" fill="#17324d">${u(d)}</text>`).join("")}`};return`
<svg class="cpsv-graph-svg" viewBox="0 0 1100 700" role="img" aria-labelledby="cpsv-graph-title">
  <title id="cpsv-graph-title">Grafo delle classi CPSV-AP_IT usate dal catalogo</title>
  <g stroke="#5c6f82" stroke-width="1.5" fill="none">
    <line x1="180" y1="96" x2="470" y2="250"/>
    <line x1="920" y1="96" x2="630" y2="250"/>
    <line x1="266" y1="290" x2="430" y2="290"/>
    <line x1="670" y1="290" x2="834" y2="290"/>
    <line x1="500" y1="330" x2="180" y2="530"/>
    <line x1="550" y1="330" x2="550" y2="500"/>
    <line x1="600" y1="330" x2="920" y2="530"/>
  </g>
  ${e(330,148,["cv:hasCompetentAuthority"])}
  ${e(790,148,["cv:addressee"])}
  ${e(348,272,["cpsv:hasInput"])}
  ${e(752,272,["cpsv:hasOutput"])}
  ${e(250,455,["cpsv:isPartOfEvent"])}
  ${e(550,400,["cpsv:hasWebSiteChannel","cpsv:hasOtherElectronicChannel"])}
  ${e(820,455,["cpsv:hasTheme"])}
  ${t(430,250,240,80,"Servizio pubblico","cpsv:PublicService",!0)}
  ${t(40,24,280,72,"Ente","cv:PublicOrganisation")}
  ${t(780,24,280,72,"Destinatario","cv:Agent")}
  ${t(16,254,250,72,"Che cosa serve","cpsv:Input")}
  ${t(834,254,250,72,"Che cosa si ottiene","cpsv:Output")}
  ${t(40,530,280,72,"Momento della vita","evento di vita")}
  <rect x="410" y="500" width="280" height="96" rx="8" fill="#fff" stroke="#0066cc" stroke-width="2"/>
  <text x="550" y="530" text-anchor="middle" font-size="16" font-weight="700" fill="#17324d">Canali</text>
  <text x="550" y="552" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:WebSiteChannel</text>
  <text x="550" y="572" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:OtherElectronicChannel</text>
  ${t(780,530,280,72,"Tema","classificazione")}
</svg>`}const ai={lifeEvents:Tt,themes:It},ee=document.getElementById("app");function T(t){var s;const e=ee.querySelector("header[data-bs-toggle='sticky']");e&&((s=N.getInstance(e))==null||s.dispose()),ee.innerHTML=Zt(t);const i=ee.querySelector("header[data-bs-toggle='sticky']");i&&N.getOrCreateInstance(i)}let b=null,m={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},$=1,te=0;function V(t){return!t||t===Re?null:t}async function li(t){const e=Ue(t);if(b&&b.docUrl===e)return b;const i=++te;T({catalogUrl:e,meta:null,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:n,url:o}=await Ft(e);return i!==te||(b={docUrl:o,index:Kt(n,ai)}),b}catch(n){if(i!==te)return null;b=null,T({catalogUrl:e,meta:null,error:n.message||String(n)});const o=document.getElementById("view-root");return o&&(o.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${_({catalog:V(e),path:"/",filters:pe()})}">Torna al catalogo</a></p>
        </div>`),null}}function pe(){return{q:m.q,org:m.org,lifeEvent:m.lifeEvent,theme:m.theme,page:$}}function ci(t){m={q:(t==null?void 0:t.q)||"",org:(t==null?void 0:t.org)||"",lifeEvent:(t==null?void 0:t.lifeEvent)||"",theme:(t==null?void 0:t.theme)||"",onlineOnly:!1},$=(t==null?void 0:t.page)>1?t.page:1}function F({replace:t}){b&&Ut({catalog:V(b.docUrl),path:"/",filters:pe()},{replace:t})}function le(){const t=document.getElementById("filter-q"),e=document.getElementById("filter-org"),i=document.getElementById("filter-le"),s=document.getElementById("filter-theme"),n=document.getElementById("filter-online");t&&(t.value=m.q||""),e&&(e.value=m.org||""),i&&(i.value=m.lifeEvent||""),s&&(s.value=m.theme||""),n&&(n.checked=!1)}function di(){var s,n;const t=document.getElementById("filters-form");if(!t)return;const e=({replace:o})=>{var r,a,c,d;m={q:((r=document.getElementById("filter-q"))==null?void 0:r.value)||"",org:((a=document.getElementById("filter-org"))==null?void 0:a.value)||"",lifeEvent:((c=document.getElementById("filter-le"))==null?void 0:c.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},$=1,F({replace:o}),P()};t.addEventListener("change",o=>{var r;((r=o.target)==null?void 0:r.id)!=="filter-q"&&e({replace:!1})}),t.addEventListener("submit",o=>{o.preventDefault(),e({replace:!1})});let i;(s=document.getElementById("filter-q"))==null||s.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>e({replace:!0}),200)}),(n=document.getElementById("filters-reset"))==null||n.addEventListener("click",()=>{m={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},$=1,le(),F({replace:!1}),P()})}function ui(t){t&&(t.querySelectorAll("[data-filter-org]").forEach(e=>{e.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const s=e.getAttribute("data-filter-org")||"";m.org=m.org===s?"":s,$=1,le(),F({replace:!1}),P(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}),t.querySelectorAll("[data-filter-life-event]").forEach(e=>{e.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const s=e.getAttribute("data-filter-life-event")||"";m.lifeEvent=m.lifeEvent===s?"":s,$=1,le(),F({replace:!1}),P(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}))}function P(){if(!b)return;const t=Yt(b.index.services,m),e=document.getElementById("results-count"),i=document.getElementById("results-grid"),s=document.getElementById("pager");e&&(e.textContent=t.length===1?"1 servizio trovato":`${t.length} servizi trovati`),i&&(i.innerHTML=ti(t,{catalogUrl:b.docUrl,page:$,filterState:m}),ui(i)),s&&(s.innerHTML=ii(t.length,$,{catalogUrl:b.docUrl,filterState:m}))}async function je(){const t=re();ci(t.filters);const e=await li(t.catalog);if(!e)return;const i=pe();if(t.view==="cpsv"){T({catalogUrl:e.docUrl,meta:e.index.meta,error:null,filters:i,view:"cpsv"});const n=document.getElementById("view-root");n&&(n.innerHTML=oi({homeHref:_({catalog:V(e.docUrl),path:"/",filters:i})})),window.scrollTo(0,0);return}if(t.view==="detail"){const n=e.index.services.find(r=>r.id===t.serviceId);if(!n){T({catalogUrl:e.docUrl,meta:e.index.meta,error:null,filters:i});const r=document.getElementById("view-root");r&&(r.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${_({catalog:V(e.docUrl),path:"/",filters:i})}">Torna all’elenco</a>
          </div>`);return}T({catalogUrl:e.docUrl,meta:e.index.meta,error:null,detail:n,filters:i});const o=document.getElementById("view-root");o&&(o.innerHTML=si(n)),window.scrollTo(0,0);return}T({catalogUrl:e.docUrl,meta:e.index.meta,error:null,filters:i,view:"list"});const s=document.getElementById("view-root");s&&(s.innerHTML=ei({index:e.index,filterState:m,catalogUrl:e.docUrl}),di(),P())}window.addEventListener("hashchange",()=>{je()});je();
