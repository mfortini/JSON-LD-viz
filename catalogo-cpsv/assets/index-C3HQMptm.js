(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const a of n.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=i(o);fetch(o.href,n)}})();const S=new Map;var G={set(t,e,i){S.has(t)||S.set(t,new Map);const s=S.get(t);if(!s.has(e)&&s.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s.keys())[0]}.`);return}s.set(e,i)},get(t,e){return S.has(t)&&S.get(t).get(e)||null},remove(t,e){if(!S.has(t))return;const i=S.get(t);i.delete(e),i.size===0&&S.delete(t)}};const Ye=1e3,ie="transitionend",Je=t=>t==null?`${t}`:Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase(),Ze=t=>{let e=t.getAttribute("data-bs-target");if(!e||e==="#"){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&i!=="#"?i.trim():null}return e},Xe=t=>{const e=Ze(t);return e&&document.querySelector(e)?e:null},Qe=t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const s=Number.parseFloat(e),o=Number.parseFloat(i);return!s&&!o?0:(e=e.split(",")[0],i=i.split(",")[0],(Number.parseFloat(e)+Number.parseFloat(i))*Ye)},et=t=>{t.dispatchEvent(new Event(ie))},O=t=>!t||typeof t!="object"?!1:typeof t.nodeType<"u",$e=t=>O(t)?t:typeof t=="string"&&t.length>0?document.querySelector(t):null,tt=t=>{if(!O(t)||t.getClientRects().length===0)return!1;const e=getComputedStyle(t).getPropertyValue("visibility")==="visible",i=t.closest("details:not([open])");if(!i)return e;if(i!==t){const s=t.closest("summary");if(s&&s.parentNode!==i||s===null)return!1}return e},it=t=>!t||t.nodeType!==Node.ELEMENT_NODE||t.classList.contains("disabled")?!0:typeof t.disabled<"u"?t.disabled:t.hasAttribute("disabled")&&t.getAttribute("disabled")!=="false",_e=t=>{typeof t=="function"&&t()},st=(t,e,i=!0)=>{if(!i){_e(t);return}const o=Qe(e)+5;let n=!1;const a=({target:r})=>{r===e&&(n=!0,e.removeEventListener(ie,a),_e(t))};e.addEventListener(ie,a),setTimeout(()=>{n||et(e)},o)},ot=/[^.]*(?=\..*)\.|.*/,nt=/\..*/,rt=/::\d+$/,Y={};let Ie=1;const Ne={mouseenter:"mouseover",mouseleave:"mouseout"},at=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function Pe(t,e){return e&&`${e}::${Ie++}`||t.uidEvent||Ie++}function ke(t){const e=Pe(t);return t.uidEvent=e,Y[e]=Y[e]||{},Y[e]}function lt(t,e){return function i(s){return ce(s,{delegateTarget:t}),i.oneOff&&A.off(t,s.type,e),e.apply(t,[s])}}function ct(t,e,i){return function s(o){const n=t.querySelectorAll(e);for(let{target:a}=o;a&&a!==this;a=a.parentNode)for(const r of n)if(r===a)return ce(o,{delegateTarget:a}),s.oneOff&&A.off(t,o.type,e,i),i.apply(a,[o])}}function Me(t,e,i=null){return Object.values(t).find(s=>s.callable===e&&s.delegationSelector===i)}function je(t,e,i){const s=typeof e=="string",o=s?i:e||i;let n=ut(t);return at.has(n)||(n=t),[s,o,n]}function ze(t,e,i,s,o){if(typeof e!="string"||!t)return;let[n,a,r]=je(e,i,s);e in Ne&&(a=(I=>function(E){if(!E.relatedTarget||E.relatedTarget!==E.delegateTarget&&!E.delegateTarget.contains(E.relatedTarget))return I.call(this,E)})(a));const l=ke(t),d=l[r]||(l[r]={}),p=Me(d,a,n?i:null);if(p){p.oneOff=p.oneOff&&o;return}const h=Pe(a,e.replace(ot,"")),c=n?ct(t,i,a):lt(t,a);c.delegationSelector=n?i:null,c.callable=a,c.oneOff=o,c.uidEvent=h,d[h]=c,t.addEventListener(r,c,n)}function se(t,e,i,s,o){const n=Me(e[i],s,o);n&&(t.removeEventListener(i,n,!!o),delete e[i][n.uidEvent])}function dt(t,e,i,s){const o=e[i]||{};for(const n of Object.keys(o))if(n.includes(s)){const a=o[n];se(t,e,i,a.callable,a.delegationSelector)}}function ut(t){return t=t.replace(nt,""),Ne[t]||t}const A={on(t,e,i,s){ze(t,e,i,s,!1)},one(t,e,i,s){ze(t,e,i,s,!0)},off(t,e,i,s){if(typeof e!="string"||!t)return;const[o,n,a]=je(e,i,s),r=a!==e,l=ke(t),d=l[a]||{},p=e.startsWith(".");if(typeof n<"u"){if(!Object.keys(d).length)return;se(t,l,a,n,o?i:null);return}if(p)for(const h of Object.keys(l))dt(t,l,h,e.slice(1));for(const h of Object.keys(d)){const c=h.replace(rt,"");if(!r||e.includes(c)){const f=d[h];se(t,l,a,f.callable,f.delegationSelector)}}},trigger(t,e,i){if(typeof e!="string"||!t)return null;let s=!0,o=new Event(e,{bubbles:s,cancelable:!0});return o=ce(o,i),t.dispatchEvent(o),o}};function ce(t,e){for(const[i,s]of Object.entries(e||{}))try{t[i]=s}catch{Object.defineProperty(t,i,{configurable:!0,get(){return s}})}return t}function Ae(t){if(t==="true")return!0;if(t==="false")return!1;if(t===Number(t).toString())return Number(t);if(t===""||t==="null")return null;if(typeof t!="string")return t;try{return JSON.parse(decodeURIComponent(t))}catch{return t}}function J(t){return t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}const oe={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${J(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${J(e)}`)},getDataAttributes(t){if(!t)return{};const e={},i=Object.keys(t.dataset).filter(s=>s.startsWith("bs")&&!s.startsWith("bsConfig"));for(const s of i){let o=s.replace(/^bs/,"");o=o.charAt(0).toLowerCase()+o.slice(1,o.length),e[o]=Ae(t.dataset[s])}return e},getDataAttribute(t,e){return Ae(t.getAttribute(`data-bs-${J(e)}`))}};class pt{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(e){return e=this._mergeConfigObj(e),e=this._configAfterMerge(e),this._typeCheckConfig(e),e}_configAfterMerge(e){return e}_mergeConfigObj(e,i){const s=O(i)?oe.getDataAttribute(i,"config"):{};return{...this.constructor.Default,...typeof s=="object"?s:{},...O(i)?oe.getDataAttributes(i):{},...typeof e=="object"?e:{}}}_typeCheckConfig(e,i=this.constructor.DefaultType){for(const s of Object.keys(i)){const o=i[s],n=e[s],a=O(n)?"element":Je(n);if(!new RegExp(o).test(a))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${s}" provided type "${a}" but expected type "${o}".`)}}}const ft="5.2.3";class ht extends pt{constructor(e,i){super(),e=$e(e),e&&(this._element=e,this._config=this._getConfig(i),G.set(this._element,this.constructor.DATA_KEY,this))}dispose(){G.remove(this._element,this.constructor.DATA_KEY),A.off(this._element,this.constructor.EVENT_KEY);for(const e of Object.getOwnPropertyNames(this))this[e]=null}_queueCallback(e,i,s=!0){st(e,i,s)}_getConfig(e){return e=this._mergeConfigObj(e,this._element),e=this._configAfterMerge(e),this._typeCheckConfig(e),e}static getInstance(e){return G.get($e(e),this.DATA_KEY)}static getOrCreateInstance(e,i={}){return this.getInstance(e)||new this(e,typeof i=="object"?i:null)}static get VERSION(){return ft}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(e){return`${e}${this.EVENT_KEY}`}}const B={find(t,e=document.documentElement){return[].concat(...Element.prototype.querySelectorAll.call(e,t))},findOne(t,e=document.documentElement){return Element.prototype.querySelector.call(e,t)},children(t,e){return[].concat(...t.children).filter(i=>i.matches(e))},parents(t,e){const i=[];let s=t.parentNode.closest(e);for(;s;)i.push(s),s=s.parentNode.closest(e);return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(i=>`${i}:not([tabindex^="-"])`).join(",");return this.find(e,t).filter(i=>!it(i)&&tt(i))}},gt="(max-width: 991px)",xe=()=>{if(typeof window<"u")return window.matchMedia(gt).matches},v=[];for(let t=0;t<256;++t)v.push((t+256).toString(16).slice(1));function mt(t,e=0){return(v[t[e+0]]+v[t[e+1]]+v[t[e+2]]+v[t[e+3]]+"-"+v[t[e+4]]+v[t[e+5]]+"-"+v[t[e+6]]+v[t[e+7]]+"-"+v[t[e+8]]+v[t[e+9]]+"-"+v[t[e+10]]+v[t[e+11]]+v[t[e+12]]+v[t[e+13]]+v[t[e+14]]+v[t[e+15]]).toLowerCase()}const vt=new Uint8Array(16);function bt(){return crypto.getRandomValues(vt)}function yt(t,e,i){return crypto.randomUUID?crypto.randomUUID():Et(t)}function Et(t,e,i){var o;t=t||{};const s=t.random??((o=t.rng)==null?void 0:o.call(t))??bt();if(s.length<16)throw new Error("Random bytes length must be >= 16");return s[6]=s[6]&15|64,s[8]=s[8]&63|128,mt(s)}let Z=!1,N=[];class wt{constructor(e,i){this.id=e,this._callback=i}dispose(){Ct(this.id)}_execute(e){this._callback(e)}}const Ct=t=>{N=N.filter(e=>e.id!==t)},De=t=>{if(!(typeof document>"u")){if(N.length||typeof window<"u"&&typeof document<"u"&&document.addEventListener("scroll",e=>{Z||(window.requestAnimationFrame(()=>{N.forEach(i=>i.cb._execute(e)),Z=!1}),Z=!0)}),typeof t=="function"){const e=new wt(yt(),t);return N.push({id:e.id,cb:e}),e}return console.error("[onDocumentScroll] the provided data has to be of type function"),null}},St="sticky",$t="bs.sticky",de=`.${$t}`,Te=`resize${de}`,_t=`on${de}`,It=`off${de}`,zt="bs-it-sticky-wrapper",Le="bs-is-sticky",Oe="bs-is-fixed",At="data-bs-target-mobile",qe='[data-bs-toggle="sticky"]',xt={positionType:"sticky",stickyClassName:"",stackable:!1,paddingTop:0};class M extends ht{constructor(e,i){super(e),this._config=this._getConfig(i),this._isSticky=!1,this._wrapper=null,this._stickyTarget=B.findOne(Xe(this._element),this._element)||this._element,this._stickyTargetMobile=B.findOne(this._element.getAttribute(At),this._element)||this._stickyTarget,this._stickyLimit=0,this._stickyLimitMobile=0,this._setLimit(),this._scrollCb=null,this._isMobile=xe(),this._prevTop=0,this._onScroll(),this._bindEvents()}dispose(){typeof window<"u"&&typeof document<"u"&&(A.off(window,Te),this._scrollCb.dispose(),super.dispose())}static get NAME(){return St}_getConfig(e){return e={...xt,...oe.getDataAttributes(this._element),...typeof e=="object"?e:{}},e}_bindEvents(){typeof window<"u"&&typeof document<"u"&&(A.on(window,Te,()=>this._onResize()),this._scrollCb=De(()=>this._onScroll()))}_onResize(){this._isMobile=xe(),this._setLimit()}_onScroll(){this._checkSticky()}_setLimit(){this._stickyLimit=this._cumulativeOffset(this._stickyTarget).top,this._stickyLimitMobile=this._cumulativeOffset(this._stickyTargetMobile).top}_getLimit(){let e=this._isMobile?this._stickyLimitMobile:this._stickyLimit;return this._config.stackable&&this._getStickySimblings().forEach((i,s)=>{const o=i.getBoundingClientRect();e-=o.height+(s===0?parseFloat(i.style.top):0)}),e>0?e:0}_cumulativeOffset(e){let i=0,s=0;do i+=e.offsetTop||0,s+=e.offsetLeft||0,e=e.offsetParent;while(e);return{top:i,left:s}}_isTypeSticky(){return this._config.positionType==="sticky"}_checkSticky(){this._isSticky||this._setLimit();const e=this._getLimit();typeof window<"u"&&window.pageYOffset>e?this._setSticky():this._unsetSticky()}_setSticky(){if(!this._isSticky){this._isSticky=!0;let e=Le;this._isTypeSticky()||(e=Oe,this._wrapper=this._createWrapper()),this._element.classList.add(e),this._config.stickyClassName&&this._element.classList.add(this._config.stickyClassName),this._prevTop=this._element.style.top,this._element.style.top=this._getPositionTop()+"px",A.trigger(this._element,_t)}}_unsetSticky(){if(this._isSticky){let e=Le;this._isTypeSticky()||(e=Oe,this._destroyWrapper()),this._element.classList.remove(e),this._config.stickyClassName&&this._element.classList.remove(this._config.stickyClassName),this._element.style.top=this._prevTop,this._isSticky=!1,A.trigger(this._element,It)}}_createWrapper(){if(typeof document>"u")return;const e=document.createElement("div");return e.classList.add(zt),e.style.width="100%",e.style.height=this._element.getBoundingClientRect().height+"px",e.style.overflow="hidden",this._element.parentNode.insertBefore(e,this._element),e.appendChild(this._element),e}_destroyWrapper(){this._wrapper&&(this._wrapper.parentNode.insertBefore(this._element,this._wrapper),this._wrapper.remove())}_getStickySimblings(){return B.find(qe).filter(i=>{const s=M.getInstance(i);return!!(s&&s._isSticky&&i!==this._element)})}_getPositionTop(){let e=0;return this._config.stackable?(this._getStickySimblings().forEach((i,s)=>{const o=i.getBoundingClientRect();e+=o.height+(s===0?parseFloat(i.style.top):0)}),e):e+this._config.paddingTop}}typeof window<"u"&&typeof document<"u"&&De(()=>{B.find(qe).map(e=>{M.getOrCreateInstance(e)})});const Tt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},ue=[{id:"ACI",name:"ACI - Automobile Club d'Italia",url:"./enti/ACI.jsonld"},{id:"AdE",name:"Agenzia delle Entrate",url:"./enti/AdE.jsonld"},{id:"ANPR",name:"ANPR - Anagrafe Nazionale della Popolazione Residente",url:"./enti/ANPR.jsonld"},{id:"GSE",name:"GSE - Gestore Servizi Energetici",url:"./enti/GSE.jsonld"},{id:"INAIL",name:"INAIL - Istituto Nazionale per l'Assicurazione contro gli Infortuni sul Lavoro",url:"./enti/INAIL.jsonld"},{id:"INPS",name:"INPS - Istituto Nazionale Previdenza Sociale",url:"./enti/INPS.jsonld"},{id:"IPZS",name:"Istituto Poligrafico e Zecca dello Stato",url:"./enti/IPZS.jsonld"},{id:"MLPS",name:"Ministero del Lavoro e delle Politiche Sociali",url:"./enti/MLPS.jsonld"},{id:"MIM",name:"Ministero dell'Istruzione e del Merito",url:"./enti/MIM.jsonld"},{id:"MIT",name:"Motorizzazione Civile - Portale dell'Automobilista",url:"./enti/MIT.jsonld"}],Lt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"};function m(t){if(t==null)return null;if(typeof t=="string")return t.trim()||null;if(Array.isArray(t)){for(const e of t){const i=m(e);if(i)return i}return null}if(typeof t=="object"){if(typeof t["@value"]=="string")return t["@value"].trim()||null;if(typeof t.value=="string")return t.value.trim()||null}return null}function pe(t){return t==null?[]:Array.isArray(t)?t:[t]}function Ot(t){return t==null?null:typeof t=="string"?t:typeof t=="object"&&t["@id"]?String(t["@id"]):null}function P(t,e){const i=t==null?void 0:t["@type"];return pe(i).map(String).some(o=>o===e||o.endsWith(e)||o.includes(e))}function V(t,e=180){if(!t)return"";const i=t.replace(/\s+/g," ").trim();return i.length<=e?i:`${i.slice(0,e-1).trim()}…`}function u(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Nt=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,Pt=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function $(t){if(!t)return null;let e=String(t);return e=e.replace(/<script[\s\S]*?<\/script>/gi," "),e=e.replace(/<style[\s\S]*?<\/style>/gi," "),e=e.replace(/<[^>]+>/g," "),e=e.replace(/&nbsp;/gi," "),e=e.replace(/&amp;/gi,"&"),e=e.replace(Nt," "),e=e.replace(/\r\n/g,`
`),e=e.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),e||null}function kt(t){const e=$(t);if(!e)return[];if(e.includes(`

`)){const r=[];for(const l of e.split(`

`)){const d=l.trim();if(d)if(qt(d))r.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=r[r.length-1];p&&p.heading&&!p.text?p.text=d:r.push({heading:null,text:d})}}return r.filter(l=>l.heading||l.text)}const i=[...e.matchAll(Pt)];if(!i.length)return[{heading:null,text:e}];const s=i.map(r=>({index:r.index,title:r[1].replace(/\s+/g," ").trim()})).filter(r=>r.title.length>=10&&r.title.split(/\s+/).length>=2);if(!s.length)return[{heading:null,text:e}];const o=[];for(const r of s){const l=o[o.length-1];l&&r.index<l.index+l.title.length||o.push(r)}const n=[],a=o[0];if(a.index>0){const r=e.slice(0,a.index).trim();r&&n.push({heading:null,text:r})}for(let r=0;r<o.length;r++){const l=o[r].index+o[r].title.length,d=r+1<o.length?o[r+1].index:e.length,p=e.slice(l,d).trim();n.push({heading:o[r].title,text:p})}return n.filter(r=>r.heading||r.text)}const Mt=/<(p|ul|ol|li|strong|b|em|i|a|br)\b/i,jt=new Set(["p","ul","ol","li","strong","b","em","i","a","br"]);function Dt(t){if(!t||!Mt.test(t)||typeof DOMParser>"u")return null;const i=new DOMParser().parseFromString(`<div id="rich-root">${t}</div>`,"text/html").getElementById("rich-root");return i&&L(i).innerHTML.trim()||null}function L(t){const e=t.ownerDocument,i=e.createElement("div");for(const s of[...t.childNodes]){if(s.nodeType===Node.TEXT_NODE){i.appendChild(e.createTextNode(s.textContent));continue}if(s.nodeType!==Node.ELEMENT_NODE)continue;const o=s.tagName.toLowerCase();if(!jt.has(o)){const r=L(s);for(;r.firstChild;)i.appendChild(r.firstChild);continue}if(o==="a"){const r=s.getAttribute("href")||"";if(!/^https?:\/\//i.test(r)){const p=L(s);for(;p.firstChild;)i.appendChild(p.firstChild);continue}const l=e.createElement("a");l.setAttribute("href",r),l.setAttribute("rel","noopener noreferrer");const d=L(s);for(;d.firstChild;)l.appendChild(d.firstChild);l.textContent.trim()&&i.appendChild(l);continue}const n=e.createElement(o),a=L(s);for(;a.firstChild;)n.appendChild(a.firstChild);(o==="br"||n.textContent.trim())&&i.appendChild(n)}return i}function ne(t){const e=Dt(t);if(e)return e;const i=kt(t);return i.length?i.map(s=>{const o=[];return s.heading&&o.push(`<h3 class="h5 mt-3 mb-2">${u(Ut(s.heading))}</h3>`),s.text&&o.push(`<p class="mb-2">${u(s.text)}</p>`),o.join("")}).join(""):""}function qt(t){const e=t.replace(/\s+/g," ").trim();return e.length<5||e.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(e)||e!==e.toLocaleUpperCase("it")||e.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(e)}function Ut(t){return t.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,s,o)=>s+o.toLocaleUpperCase("it"))}const Ue="./cpsv_full.jsonld";function re(t=window.location.hash){const e=(t||"").replace(/^#/,"");let i=null,s="/";if(e.startsWith("catalog=")){const d=e.indexOf("&"),p=d===-1?e.slice(8):e.slice(8,d);i=decodeURIComponent(p),s=d===-1?"/":e.slice(d+1)||"/"}else e&&(s=e.startsWith("/")?e:`/${e}`);const{path:o,query:n}=Bt(s),a=o.startsWith("/")?o:`/${o}`;let r="list",l=null;if(a==="/cpsv")r="cpsv";else if(a==="/jsonld")r="jsonld";else{const d=a.match(/^\/servizio\/(.+)$/);d&&(r="detail",l=decodeURIComponent(d[1]))}return{catalog:i,path:a,view:r,serviceId:l,filters:Vt(n)}}function y({catalog:t,path:e="/",filters:i}={}){const s=e.startsWith("/")?e:`/${e}`,o=Ft(i);return t?`#catalog=${encodeURIComponent(t)}&${s}${o}`:`#${s}${o}`}function Rt(t,{replace:e=!1}={}){const i=y(t);Ht(re(window.location.hash||"#"),re(i))||(e?history.replaceState(null,"",i):history.pushState(null,"",i))}function Ht(t,e){return t.catalog===e.catalog&&t.path===e.path&&t.view===e.view&&t.serviceId===e.serviceId&&t.filters.q===e.filters.q&&t.filters.org===e.filters.org&&t.filters.lifeEvent===e.filters.lifeEvent&&t.filters.theme===e.filters.theme&&t.filters.page===e.filters.page}function Bt(t){const e=t.indexOf("?");return e===-1?{path:t||"/",query:""}:{path:t.slice(0,e)||"/",query:t.slice(e+1)}}function Vt(t){const e=new URLSearchParams(t||""),i=Number(e.get("p")||"1"),s=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:e.get("q")||"",org:e.get("ente")||"",lifeEvent:e.get("evento")||"",theme:e.get("tema")||"",page:s}}function Ft(t){if(!t)return"";const e=new URLSearchParams;t.q&&e.set("q",String(t.q)),t.org&&e.set("ente",String(t.org)),t.lifeEvent&&e.set("evento",String(t.lifeEvent)),t.theme&&e.set("tema",String(t.theme));const i=Number(t.page||1);Number.isFinite(i)&&i>1&&e.set("p",String(Math.floor(i)));const s=e.toString();return s?`?${s}`:""}function Re(t){return!t||!String(t).trim()?Ue:String(t).trim()}async function Wt(t){const e=Re(t);let i;try{i=await fetch(e,{credentials:"same-origin"})}catch(o){const n=new Error(`Impossibile scaricare il catalogo (${e}). Verifica URL, CORS o rete.`);throw n.cause=o,n.code="NETWORK",n}if(!i.ok){const o=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${e}`);throw o.code="HTTP",o}let s;try{s=await i.json()}catch(o){const n=new Error(`Il file non è un JSON valido: ${e}`);throw n.cause=o,n.code="JSON",n}if(!s||typeof s!="object"||!Array.isArray(s["@graph"])){const o=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw o.code="SHAPE",o}return{doc:s,url:e}}function C(t){return pe(t).map(Ot).filter(Boolean)}function R(t,e){const i=[];for(const s of t){const o=e.get(s);if(!o)continue;const n=$(m(o["dct:title"])||m(o["skos:prefLabel"])),a=m(o["dct:description"])||m(o["rdfs:comment"]),l=$(a)||n;l&&i.push({id:s,title:n,text:l,html:a})}return i}function Kt(t,e){var r;let i=null;const s=t["foaf:page"];if(typeof s=="string"&&s.startsWith("http")?i=s:(r=s==null?void 0:s["@id"])!=null&&r.startsWith("http")&&(i=s["@id"]),!i)for(const l of C(t["cpsv:hasWebSiteChannel"])){const d=e.get(l),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof t["@id"]=="string"&&t["@id"].startsWith("http")&&(i=t["@id"].split("#")[0]);const o=[],n=new Set,a=l=>{if(!l||!l.startsWith("http"))return;const d=l.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||n.has(d)||(n.add(d),o.push(l))};for(const l of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of C(t[l])){const p=e.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&a(d);continue}const h=p["foaf:page"];typeof h=="string"?a(h):h!=null&&h["@id"]&&a(h["@id"])}return{sheetUrl:i,applicationUrls:o}}function Gt(t,e){const i=t["@graph"]||[],s=new Map;for(const c of i)c&&c["@id"]&&s.set(String(c["@id"]),c);const o=new Map;for(const c of i)c&&(P(c,"PublicOrganisation")||P(c,"cv:PublicOrganisation"))&&o.set(c["@id"],{id:c["@id"],title:m(c["dct:title"])||c["@id"],homepage:typeof c["foaf:homepage"]=="string"?c["foaf:homepage"]:null});const n=[];for(const c of i){if(!c||!P(c,"PublicService"))continue;const I=C(c["cv:hasCompetentAuthority"]||c["cpsv:producedBy"])[0]||null,E=I?o.get(I):null,he=C(c["cpsv:isPartOfEvent"]),ge=C(c["cpsv:hasTheme"]),Be=C(c["cpsv:hasInput"]),me=R(Be,s),Ve=C(c["cpsv:hasProcessingTime"]),K=R(Ve,s),ve=m(c["aci:processingTime"]);ve&&K.push({id:`${c["@id"]}#aci-time`,text:ve});const Fe=C(c["cpsv:hasOutput"]),be=R(Fe,s),ye=C(c["cv:addressee"]),D=R(ye,s);if(!D.length)for(const w of ye){const x=s.get(w),Se=m(x==null?void 0:x["dct:title"])||m(x==null?void 0:x["skos:prefLabel"]);Se?D.push({id:w,text:Se}):w.includes("#addressee-")&&D.push({id:w,text:decodeURIComponent(w.split("#addressee-").pop())})}const Ee=$(m(c["aci:costDescription"])||m(c["cpsv:hasCost"])),{sheetUrl:q,applicationUrls:U}=Kt(c,s),We=[q,...U].filter(Boolean),Ke=$(m(c["dct:title"])||m(c["cpsv:name"]))||"Servizio",we=m(c["dct:description"]),Ce=$(we),Ge=$(m(c["dct:abstract"]))||Ce;n.push({id:c["@id"],title:Ke,description:Ce,descriptionHtml:we,abstract:Ge,orgId:I,orgTitle:(E==null?void 0:E.title)||null,lifeEventIds:he,themeIds:ge,lifeEventLabels:he.map(w=>e.lifeEvents[w]||w.split("/").pop()),themeLabels:ge.map(w=>e.themes[w]||`Tema ${w.split("/").pop()}`),addressees:D,inputs:me,outputs:be,processingTimes:K,cost:Ee,sheetUrl:q,applicationUrls:U,onlineUrls:We,hasOnlineChannel:U.length>0,pageUrl:q||c["@id"],flags:{hasInput:me.length>0,hasOutput:be.length>0,hasTime:K.length>0,hasCost:!!Ee,hasOnline:U.length>0,hasSheet:!!q}})}n.sort((c,f)=>c.title.localeCompare(f.title,"it"));const a=[...o.values()].sort((c,f)=>c.title.localeCompare(f.title,"it")),r=new Map,l=new Map;for(const c of n){for(const f of c.lifeEventIds)r.set(f,(r.get(f)||0)+1);for(const f of c.themeIds)l.set(f,(l.get(f)||0)+1)}const d=[...r.entries()].map(([c,f])=>({id:c,label:e.lifeEvents[c]||c.split("/").pop(),count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),p=[...l.entries()].map(([c,f])=>({id:c,label:e.themes[c]||`Tema ${c.split("/").pop()}`,count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),h=pe(t["cpsv-portalone:sourceCatalogs"]).map(c=>({id:c==null?void 0:c["@id"],title:m(c==null?void 0:c["dct:title"])||(c==null?void 0:c["@id"])}));return{services:n,orgsById:o,nodesById:s,facets:{orgs:a,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:t["dct:modified"]||null,sources:h,count:n.length}}}function Yt(t){const e=Array.isArray(t==null?void 0:t["@graph"])?t["@graph"]:[],i=new Map;for(const n of e)n!=null&&n["@id"]&&i.set(String(n["@id"]),n);const s=n=>{const a=[],r=l=>{if(!(!l||typeof l!="object")){if(Array.isArray(l)){l.forEach(r);return}typeof l["@id"]=="string"&&a.push(l["@id"]);for(const[d,p]of Object.entries(l))d==="@id"||d==="@context"||r(p)}};for(const[l,d]of Object.entries(n))l==="@id"||l==="@context"||r(d);return a},o=[];for(const n of e){if(!n||!P(n,"PublicService"))continue;const a=[],r=new Set,l=[n];for(;l.length;){const p=l.pop(),h=p!=null&&p["@id"]?String(p["@id"]):null;if(!(h&&r.has(h))){h&&r.add(h),a.push(p);for(const c of s(p)){if(r.has(c))continue;const f=i.get(c);!f||f!==n&&P(f,"PublicService")||l.push(f)}}}const d=$(m(n["dct:title"])||m(n["cpsv:name"]))||n["@id"]||"Servizio";o.push({id:n["@id"]||d,title:d,json:JSON.stringify({"@context":t["@context"],"@graph":a},null,2)})}return o.sort((n,a)=>n.title.localeCompare(a.title,"it")),o}function Jt(t,e){const i=(e.q||"").trim().toLocaleLowerCase("it");return t.filter(s=>!(e.org&&s.orgId!==e.org||e.lifeEvent&&!s.lifeEventIds.includes(e.lifeEvent)||e.theme&&!s.themeIds.includes(e.theme)||e.onlineOnly&&!s.flags.hasOnline||i&&!`${s.title} ${s.abstract||""} ${s.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const ae=24,X="Catalogo dei servizi della PA",Zt="Trova e consulta i servizi digitali della Pubblica Amministrazione";function Xt({catalogUrl:t,meta:e,error:i,detail:s=null,filters:o=null,view:n="list"}){const a=u(y({catalog:F(t),path:"/",filters:o})),r=u(y({catalog:F(t),path:"/cpsv",filters:o})),l=e?`${e.count} serviz${e.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky" data-bs-toggle="sticky" data-bs-position-type="fixed" data-bs-target="#sticky-trigger" data-bs-sticky-class-name="is-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${a}" aria-label="${u(X)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${u(X)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${u(Zt)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${s?Qt(s,{homeHref:a}):""}
  <div id="sticky-trigger" class="sticky-trigger" aria-hidden="true"></div>
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${u(i)}</p>
        </div>`:""}
  ${ii(t,n,s)}
  ${n==="list"&&!s?`<p class="text-secondary mb-2">${u(l)}</p>
         <p class="mb-4"><a href="${r}">Cos’è CPSV</a></p>`:""}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${u(X)}</h2>
      <p class="mb-2">
        <a href="${r}"${n==="cpsv"?' aria-current="page"':""}>Cos’è CPSV</a>
      </p>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function Qt(t,{homeHref:e}){var n;const i=t.sheetUrl||t.pageUrl,s=i?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${u(i)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai al servizio
        ${ei()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',o=((n=t.lifeEventLabels)==null?void 0:n.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${t.lifeEventLabels.map(a=>`<span class="service-header-pill" role="listitem">${u(a)}</span>`).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${e}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${u(V(t.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${u(t.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${u(t.title)}</h1>
        ${o}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${s}
      </div>
    </div>
  </div>
</div>`}function ei(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function F(t){return!t||t==="./cpsv_full.jsonld"?null:t}function ti(t){return ue.find(e=>e.url===t)||null}function ii(t,e,i){if(e!=="list"||i)return"";const s=ti(t);if(!s)return"";const o=u(y({path:"/"}));return`
<div class="alert alert-info" role="status">
  <p class="mb-0">
    Stai consultando il CPSV di <strong>${u(s.name)}</strong>.
    <a href="${o}">Torna al catalogo completo</a>.
  </p>
</div>`}function si(t){if(!t)return"Ente";const e=String(t).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!e)return V(t,36);const i=e[1];return/agenzia delle entrate/i.test(t)?"Agenzia delle Entrate":/motorizzazione/i.test(t)?"Motorizzazione":/anpr/i.test(t)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function Q({id:t,name:e,label:i,optionsHtml:s,value:o}){return`
<div class="mb-3">
  <label class="form-label" for="${u(t)}">${u(i)}</label>
  <select class="form-select" id="${u(t)}" name="${u(e)}">
    ${s}
  </select>
</div>`}function oi({index:t,filterState:e}){const{facets:i}=t,s=['<option value="">Tutti gli enti</option>',...i.orgs.map(a=>`<option value="${u(a.id)}" ${e.org===a.id?"selected":""}>${u(a.title)}</option>`)].join(""),o=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(a=>`<option value="${u(a.id)}" ${e.lifeEvent===a.id?"selected":""}>${u(a.label)}</option>`)].join(""),n=['<option value="">Tutti i temi</option>',...i.themes.map(a=>`<option value="${u(a.id)}" ${e.theme===a.id?"selected":""}>${u(a.label)}</option>`)].join("");return`
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
        ${Q({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:o,value:e.lifeEvent})}
        ${Q({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:n,value:e.theme})}
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
`}function ni(t,{catalogUrl:e,page:i,filterState:s={}}){const o=F(e),n=(i-1)*ae,a=t.slice(n,n+ae);return a.length?a.map(r=>{const l=y({catalog:o,path:`/servizio/${encodeURIComponent(r.id)}`,filters:{...s,page:i}}),d=si(r.orgTitle),p=r.lifeEventIds[0]||"",h=r.lifeEventLabels[0]?V(r.lifeEventLabels[0],40):null,c=s.org&&s.org===r.orgId,f=s.lifeEvent&&s.lifeEvent===p,I=r.orgId?`<button
            type="button"
            class="chip chip-simple ${c?"chip-filter-active":""}"
            data-filter-org="${u(r.orgId)}"
            aria-pressed="${c?"true":"false"}"
            title="Filtra per ${u(d)}"
          ><span class="chip-label">${u(d)}</span></button>`:"",E=p?`<button
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
          ${I}
          ${E}
        </div>
        <h3 class="card-title h5">
          <a href="${u(l)}">${u(r.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${u(V(r.abstract||"Descrizione non disponibile per questo servizio.",180))}
        </p>
        <div class="mt-auto">
          <a class="btn btn-outline-primary btn-sm" href="${u(l)}">
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
</div>`}function ri(t,e,{catalogUrl:i,filterState:s={}}={}){const o=Math.max(1,Math.ceil(t/ae));if(o<=1)return"";const n=F(i),a=[];for(let r=1;r<=o;r++){const l=y({catalog:n,path:"/",filters:{...s,page:r}});a.push(`<li class="page-item ${r===e?"active":""}">
        <a class="page-link" href="${u(l)}" data-page="${r}" ${r===e?'aria-current="page"':""}>${r}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${a.join("")}</ul>`}function ai(t){const e=[];return t.addressees.length&&e.push(T("A chi è rivolto",H(t.addressees))),t.inputs.length&&e.push(T("Cosa serve",H(t.inputs))),t.processingTimes.length&&e.push(T("Tempi",H(t.processingTimes))),t.cost&&e.push(T("Costi",ne(t.cost))),t.outputs.length&&e.push(T("Cosa si ottiene",H(t.outputs))),`
${t.description?`<div class="font-serif service-description">${ne(t.descriptionHtml||t.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${e.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function T(t,e){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${u(t)}</h2>
  ${e}
</section>`}function H(t){return t.map(e=>`<div class="mb-3 service-block-text">${ne(e.html||e.text)}</div>`).join("")}const li=`{
  "@context": {
    "cpsv": "https://w3id.org/italia/onto/CPSV/",
    "cov": "https://w3id.org/italia/onto/COV/",
    "l0": "https://w3id.org/italia/onto/l0/",
    "dct": "http://purl.org/dc/terms/",
    "foaf": "http://xmlns.com/foaf/0.1/",
    "ex": "https://comune.vallefiume.example/",
    "srv": "https://comune.vallefiume.example/servizi/certificato-di-residenza#",
    "life": "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/",
    "theme": "https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/",
    "dct:title": { "@container": "@language" },
    "dct:description": { "@container": "@language" },
    "cov:hasPublicOrganization": { "@type": "@id" },
    "cpsv:hasInput": { "@type": "@id" },
    "cpsv:hasOutput": { "@type": "@id" },
    "cpsv:hasProcessingTime": { "@type": "@id" },
    "cpsv:hasWebSiteChannel": { "@type": "@id" },
    "cpsv:isPartOfEvent": { "@type": "@id" },
    "cpsv:hasTheme": { "@type": "@id" },
    "foaf:page": { "@type": "@id" }
  },
  "@graph": [
    {
      "@id": "ex:servizi/certificato-di-residenza",
      "@type": "cpsv:PublicService",
      "dct:title": { "it": "Certificato di residenza" },
      "dct:description": { "it": "Attesta l’indirizzo di residenza anagrafica di una persona iscritta nel comune." },
      "cov:hasPublicOrganization": "ex:ente",
      "cpsv:hasInput": "srv:documento",
      "cpsv:hasOutput": "srv:certificato",
      "cpsv:hasProcessingTime": "srv:tempo",
      "cpsv:hasWebSiteChannel": "srv:canale",
      "cpsv:isPartOfEvent": "life:9",
      "cpsv:hasTheme": "theme:9"
    },
    {
      "@id": "ex:ente",
      "@type": "cov:PublicOrganization",
      "dct:title": { "it": "Comune di Vallefiume" }
    },
    {
      "@id": "srv:cittadino",
      "@type": "l0:Agent",
      "dct:title": { "it": "Cittadino" }
    },
    {
      "@id": "srv:documento",
      "@type": "cpsv:Input",
      "dct:description": { "it": "Documento di identità" }
    },
    {
      "@id": "srv:certificato",
      "@type": "cpsv:Output",
      "dct:description": { "it": "Certificato di residenza" }
    },
    {
      "@id": "srv:tempo",
      "@type": "cpsv:ServiceProcessingTime",
      "dct:description": { "it": "Entro 2 giorni lavorativi" }
    },
    {
      "@id": "srv:canale",
      "@type": "cpsv:WebSiteChannel",
      "dct:title": { "it": "Sportello online del comune" },
      "foaf:page": "ex:anagrafe/certificato-residenza"
    }
  ]
}`;function ci({homeHref:t,catalogUrl:e}){const i=u(t);return`
<article class="cpsv-page">
  <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${i}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
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
    ${fi()}
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
      <li>Un servizio è erogato da un ente: <code>cov:hasPublicOrganization</code> verso <code>cov:PublicOrganization</code>.</li>
      <li>Si rivolge a qualcuno: la classe italiana è <code>l0:Agent</code>.</li>
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
    <p>
      I prefissi del contesto accorciano gli indirizzi.
      <code>cpsv</code>, <code>cov</code> e <code>l0</code> sono le ontologie pubblicate su
      <a href="https://schema.gov.it/lodview/onto/CPSV" rel="noopener noreferrer">schema.gov.it</a>:
      il servizio, l’organizzazione pubblica e l’agente.
      <code>ex</code> è il comune inventato, <code>srv</code> sono i pezzi di questo servizio,
      <code>life</code> e <code>theme</code> sono i vocabolari già usati dal catalogo.
      I legami puntano a un identificativo, quindi si scrivono <code>ex:ente</code>
      e non l’indirizzo per intero. I testi in italiano stanno come <code>{ "it": "…" }</code>.
      <code>m8g</code> non compare: è solo il codice con cui l’Unione europea pubblica
      lo stesso tipo di ente (<code>http://data.europa.eu/m8g/</code>). I file di questo
      catalogo usano ancora quel nome europeo, <code>cv:hasCompetentAuthority</code>.
      Il cittadino è un <code>l0:Agent</code> nello stesso grafo: su schema.gov.it non c’è
      una proprietà unica «destinatario», quindi il nodo c’è e non è appeso al servizio
      con il nome europeo <code>cv:addressee</code>.
    </p>
    <pre class="cpsv-code"><code>${u(li)}</code></pre>
    <p>
      Nell’elenco, il filtro Ente segue l’ente competente, Momento della vita segue l’evento
      e Argomento segue il tema. Sono le stesse frecce del grafo, applicate alle schede vere.
    </p>
    <p><a href="${i}">Vai al catalogo</a></p>
  </section>
  ${di()}
</article>`}function di(){return`
<section class="mt-5" aria-labelledby="cpsv-enti">
  <div class="cpsv-prose">
    <h2 class="h3" id="cpsv-enti">I cataloghi degli enti</h2>
    <p>
      Il catalogo completo unisce i CPSV di questi enti.
      Aprine uno per leggere il JSON-LD di ogni servizio.
    </p>
  </div>
  <ul class="cpsv-sources">
    ${[{name:"Catalogo completo",href:y({path:"/jsonld"}),action:"Vedi il JSON-LD"},...ue.map(e=>({name:e.name,href:y({catalog:e.url,path:"/jsonld"}),action:"Vedi il JSON-LD"}))].map(e=>`
    <li>
      <a class="cpsv-source" href="${u(e.href)}">
        <span class="cpsv-source-name">${u(e.name)}</span>
        <span class="cpsv-source-action">${u(e.action)}</span>
      </a>
    </li>`).join("")}
  </ul>
</section>`}function ui({title:t,cpsvHref:e,servicesHref:i,fileUrl:s}){return`
<article class="cpsv-json-page">
  <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${u(e)}">Cos’è CPSV</a><span class="separator" aria-hidden="true">/</span></li>
      <li class="breadcrumb-item active" aria-current="page">${u(t)}</li>
    </ol>
  </nav>
  <h1 class="h2 mb-3">${u(t)}</h1>
  <p class="cpsv-json-actions mb-3">
    <a href="${u(i)}">Vedi i servizi</a>
    <a href="${u(s)}" download>Scarica il file intero</a>
  </p>
  <div id="cpsv-json-services">
    <p>Caricamento del JSON-LD…</p>
  </div>
</article>`}function pi(t){return t.length?`
<p class="text-secondary mb-3">${t.length} serviz${t.length===1?"io":"i"}. Ogni blocco è il JSON-LD di un servizio, con i nodi a cui è collegato.</p>
${t.map(e=>`
<details class="cpsv-service-json">
  <summary>${u(e.title)}</summary>
  <pre class="cpsv-code"><code>${u(e.json)}</code></pre>
</details>`).join("")}`:'<p class="alert alert-info">In questo catalogo non ci sono servizi.</p>'}function fi(){const t=(i,s,o,n,a,r,l=!1)=>{const d=l?"#fff":"#17324d",p=l?"#d6e8fa":"#5c6f82";return`
      <rect x="${i}" y="${s}" width="${o}" height="${n}" rx="8" fill="${l?"#0066cc":"#fff"}" stroke="#0066cc" stroke-width="2"/>
      <text x="${i+o/2}" y="${s+30}" text-anchor="middle" font-size="16" font-weight="700" fill="${d}">${u(a)}</text>
      <text x="${i+o/2}" y="${s+52}" text-anchor="middle" font-size="13" fill="${p}">${u(r)}</text>`},e=(i,s,o)=>{const n=Math.max(...o.map(d=>d.length))*6.6+12,a=o.length*16+8,r=i-n/2,l=s-14;return`
      <rect x="${r}" y="${l}" width="${n}" height="${a}" fill="#fff"/>
      ${o.map((d,p)=>`<text x="${i}" y="${s+p*16}" text-anchor="middle" font-size="12" fill="#17324d">${u(d)}</text>`).join("")}`};return`
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
  ${e(330,148,["cov:hasPublicOrganization"])}
  ${e(790,148,["destinatario"])}
  ${e(348,272,["cpsv:hasInput"])}
  ${e(752,272,["cpsv:hasOutput"])}
  ${e(250,455,["cpsv:isPartOfEvent"])}
  ${e(550,400,["cpsv:hasWebSiteChannel","cpsv:hasOtherElectronicChannel"])}
  ${e(820,455,["cpsv:hasTheme"])}
  ${t(430,250,240,80,"Servizio pubblico","cpsv:PublicService",!0)}
  ${t(40,24,280,72,"Ente","cov:PublicOrganization")}
  ${t(780,24,280,72,"Destinatario","l0:Agent")}
  ${t(16,254,250,72,"Che cosa serve","cpsv:Input")}
  ${t(834,254,250,72,"Che cosa si ottiene","cpsv:Output")}
  ${t(40,530,280,72,"Momento della vita","evento di vita")}
  <rect x="410" y="500" width="280" height="96" rx="8" fill="#fff" stroke="#0066cc" stroke-width="2"/>
  <text x="550" y="530" text-anchor="middle" font-size="16" font-weight="700" fill="#17324d">Canali</text>
  <text x="550" y="552" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:WebSiteChannel</text>
  <text x="550" y="572" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:OtherElectronicChannel</text>
  ${t(780,530,280,72,"Tema","classificazione")}
</svg>`}const hi={lifeEvents:Tt,themes:Lt},ee=document.getElementById("app");function z(t){var s;const e=ee.querySelector("header[data-bs-toggle='sticky']");e&&((s=M.getInstance(e))==null||s.dispose()),ee.innerHTML=Xt(t);const i=ee.querySelector("header[data-bs-toggle='sticky']");i&&M.getOrCreateInstance(i)}let b=null,g={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},_=1,te=0;function k(t){return!t||t===Ue?null:t}async function gi(t){const e=Re(t);if(b&&b.docUrl===e)return b;const i=++te;z({catalogUrl:e,meta:null,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:o,url:n}=await Wt(e);return i!==te||(b={docUrl:n,index:Gt(o,hi)}),b}catch(o){if(i!==te)return null;b=null,z({catalogUrl:e,meta:null,error:o.message||String(o)});const n=document.getElementById("view-root");return n&&(n.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${y({catalog:k(e),path:"/",filters:fe()})}">Torna al catalogo</a></p>
        </div>`),null}}function fe(){return{q:g.q,org:g.org,lifeEvent:g.lifeEvent,theme:g.theme,page:_}}function mi(t){g={q:(t==null?void 0:t.q)||"",org:(t==null?void 0:t.org)||"",lifeEvent:(t==null?void 0:t.lifeEvent)||"",theme:(t==null?void 0:t.theme)||"",onlineOnly:!1},_=(t==null?void 0:t.page)>1?t.page:1}function W({replace:t}){b&&Rt({catalog:k(b.docUrl),path:"/",filters:fe()},{replace:t})}function le(){const t=document.getElementById("filter-q"),e=document.getElementById("filter-org"),i=document.getElementById("filter-le"),s=document.getElementById("filter-theme"),o=document.getElementById("filter-online");t&&(t.value=g.q||""),e&&(e.value=g.org||""),i&&(i.value=g.lifeEvent||""),s&&(s.value=g.theme||""),o&&(o.checked=!1)}function vi(){var s,o;const t=document.getElementById("filters-form");if(!t)return;const e=({replace:n})=>{var a,r,l,d;g={q:((a=document.getElementById("filter-q"))==null?void 0:a.value)||"",org:((r=document.getElementById("filter-org"))==null?void 0:r.value)||"",lifeEvent:((l=document.getElementById("filter-le"))==null?void 0:l.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},_=1,W({replace:n}),j()};t.addEventListener("change",n=>{var a;((a=n.target)==null?void 0:a.id)!=="filter-q"&&e({replace:!1})}),t.addEventListener("submit",n=>{n.preventDefault(),e({replace:!1})});let i;(s=document.getElementById("filter-q"))==null||s.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>e({replace:!0}),200)}),(o=document.getElementById("filters-reset"))==null||o.addEventListener("click",()=>{g={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},_=1,le(),W({replace:!1}),j()})}function bi(t){t&&(t.querySelectorAll("[data-filter-org]").forEach(e=>{e.addEventListener("click",i=>{var o;i.preventDefault(),i.stopPropagation();const s=e.getAttribute("data-filter-org")||"";g.org=g.org===s?"":s,_=1,le(),W({replace:!1}),j(),(o=document.getElementById("results-count"))==null||o.scrollIntoView({behavior:"smooth",block:"start"})})}),t.querySelectorAll("[data-filter-life-event]").forEach(e=>{e.addEventListener("click",i=>{var o;i.preventDefault(),i.stopPropagation();const s=e.getAttribute("data-filter-life-event")||"";g.lifeEvent=g.lifeEvent===s?"":s,_=1,le(),W({replace:!1}),j(),(o=document.getElementById("results-count"))==null||o.scrollIntoView({behavior:"smooth",block:"start"})})}))}function j(){if(!b)return;const t=Jt(b.index.services,g),e=document.getElementById("results-count"),i=document.getElementById("results-grid"),s=document.getElementById("pager");e&&(e.textContent=t.length===1?"1 servizio trovato":`${t.length} servizi trovati`),i&&(i.innerHTML=ni(t,{catalogUrl:b.docUrl,page:_,filterState:g}),bi(i)),s&&(s.innerHTML=ri(t.length,_,{catalogUrl:b.docUrl,filterState:g}))}async function He(){const t=re(),e=(b==null?void 0:b.docUrl)||null;mi(t.filters);const i=await gi(t.catalog);if(!i)return;const s=fe();if(t.view==="cpsv"){z({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"cpsv"});const n=document.getElementById("view-root");n&&(n.innerHTML=ci({homeHref:y({catalog:k(i.docUrl),path:"/",filters:s}),catalogUrl:i.docUrl})),window.scrollTo(0,0);return}if(t.view==="jsonld"){const n=ue.find(r=>r.url===i.docUrl);z({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"jsonld"});const a=document.getElementById("view-root");if(a){a.innerHTML=ui({title:n?n.name:"Catalogo completo",cpsvHref:y({path:"/cpsv"}),servicesHref:y({catalog:k(i.docUrl),path:"/"}),fileUrl:i.docUrl});const r=document.getElementById("cpsv-json-services");try{const l=await fetch(i.docUrl,{credentials:"same-origin"});if(!l.ok)throw new Error(`HTTP ${l.status}`);const d=await l.json();r!=null&&r.isConnected&&(r.innerHTML=pi(Yt(d)))}catch(l){if(r!=null&&r.isConnected){r.replaceChildren();const d=document.createElement("p");d.className="alert alert-warning",d.textContent=`Non è stato possibile leggere il JSON-LD (${l.message||l}).`,r.append(d)}}}window.scrollTo(0,0);return}if(t.view==="detail"){const n=i.index.services.find(r=>r.id===t.serviceId);if(!n){z({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s});const r=document.getElementById("view-root");r&&(r.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${y({catalog:k(i.docUrl),path:"/",filters:s})}">Torna all’elenco</a>
          </div>`);return}z({catalogUrl:i.docUrl,meta:i.index.meta,error:null,detail:n,filters:s});const a=document.getElementById("view-root");a&&(a.innerHTML=ai(n)),window.scrollTo(0,0);return}z({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"list"});const o=document.getElementById("view-root");o&&(o.innerHTML=oi({index:i.index,filterState:g,catalogUrl:i.docUrl}),vi(),j(),e&&e!==i.docUrl&&window.scrollTo(0,0))}window.addEventListener("hashchange",()=>{He()});He();
