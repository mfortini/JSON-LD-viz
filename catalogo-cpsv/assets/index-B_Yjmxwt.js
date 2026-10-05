(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))s(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const r of n.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&s(r)}).observe(document,{childList:!0,subtree:!0});function i(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(o){if(o.ep)return;o.ep=!0;const n=i(o);fetch(o.href,n)}})();const I=new Map;var Q={set(e,t,i){I.has(e)||I.set(e,new Map);const s=I.get(e);if(!s.has(t)&&s.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s.keys())[0]}.`);return}s.set(t,i)},get(e,t){return I.has(e)&&I.get(e).get(t)||null},remove(e,t){if(!I.has(e))return;const i=I.get(e);i.delete(t),i.size===0&&I.delete(e)}};const Qe=1e3,re="transitionend",et=e=>e==null?`${e}`:Object.prototype.toString.call(e).match(/\s([a-z]+)/i)[1].toLowerCase(),tt=e=>{let t=e.getAttribute("data-bs-target");if(!t||t==="#"){let i=e.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),t=i&&i!=="#"?i.trim():null}return t},it=e=>{const t=tt(e);return t&&document.querySelector(t)?t:null},st=e=>{if(!e)return 0;let{transitionDuration:t,transitionDelay:i}=window.getComputedStyle(e);const s=Number.parseFloat(t),o=Number.parseFloat(i);return!s&&!o?0:(t=t.split(",")[0],i=i.split(",")[0],(Number.parseFloat(t)+Number.parseFloat(i))*Qe)},ot=e=>{e.dispatchEvent(new Event(re))},P=e=>!e||typeof e!="object"?!1:typeof e.nodeType<"u",Se=e=>P(e)?e:typeof e=="string"&&e.length>0?document.querySelector(e):null,nt=e=>{if(!P(e)||e.getClientRects().length===0)return!1;const t=getComputedStyle(e).getPropertyValue("visibility")==="visible",i=e.closest("details:not([open])");if(!i)return t;if(i!==e){const s=e.closest("summary");if(s&&s.parentNode!==i||s===null)return!1}return t},rt=e=>!e||e.nodeType!==Node.ELEMENT_NODE||e.classList.contains("disabled")?!0:typeof e.disabled<"u"?e.disabled:e.hasAttribute("disabled")&&e.getAttribute("disabled")!=="false",Ie=e=>{typeof e=="function"&&e()},at=(e,t,i=!0)=>{if(!i){Ie(e);return}const o=st(t)+5;let n=!1;const r=({target:a})=>{a===t&&(n=!0,t.removeEventListener(re,r),Ie(e))};t.addEventListener(re,r),setTimeout(()=>{n||ot(t)},o)},lt=/[^.]*(?=\..*)\.|.*/,ct=/\..*/,dt=/::\d+$/,ee={};let _e=1;const Ne={mouseenter:"mouseover",mouseleave:"mouseout"},ut=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function Pe(e,t){return t&&`${t}::${_e++}`||e.uidEvent||_e++}function ke(e){const t=Pe(e);return e.uidEvent=t,ee[t]=ee[t]||{},ee[t]}function pt(e,t){return function i(s){return pe(s,{delegateTarget:e}),i.oneOff&&x.off(e,s.type,t),t.apply(e,[s])}}function ft(e,t,i){return function s(o){const n=e.querySelectorAll(t);for(let{target:r}=o;r&&r!==this;r=r.parentNode)for(const a of n)if(a===r)return pe(o,{delegateTarget:r}),s.oneOff&&x.off(e,o.type,t,i),i.apply(r,[o])}}function De(e,t,i=null){return Object.values(e).find(s=>s.callable===t&&s.delegationSelector===i)}function Me(e,t,i){const s=typeof t=="string",o=s?i:t||i;let n=gt(e);return ut.has(n)||(n=e),[s,o,n]}function ze(e,t,i,s,o){if(typeof t!="string"||!e)return;let[n,r,a]=Me(t,i,s);t in Ne&&(r=(C=>function(b){if(!b.relatedTarget||b.relatedTarget!==b.delegateTarget&&!b.delegateTarget.contains(b.relatedTarget))return C.call(this,b)})(r));const l=ke(e),d=l[a]||(l[a]={}),p=De(d,r,n?i:null);if(p){p.oneOff=p.oneOff&&o;return}const h=Pe(r,t.replace(lt,"")),c=n?ft(e,i,r):pt(e,r);c.delegationSelector=n?i:null,c.callable=r,c.oneOff=o,c.uidEvent=h,d[h]=c,e.addEventListener(a,c,n)}function ae(e,t,i,s,o){const n=De(t[i],s,o);n&&(e.removeEventListener(i,n,!!o),delete t[i][n.uidEvent])}function ht(e,t,i,s){const o=t[i]||{};for(const n of Object.keys(o))if(n.includes(s)){const r=o[n];ae(e,t,i,r.callable,r.delegationSelector)}}function gt(e){return e=e.replace(ct,""),Ne[e]||e}const x={on(e,t,i,s){ze(e,t,i,s,!1)},one(e,t,i,s){ze(e,t,i,s,!0)},off(e,t,i,s){if(typeof t!="string"||!e)return;const[o,n,r]=Me(t,i,s),a=r!==t,l=ke(e),d=l[r]||{},p=t.startsWith(".");if(typeof n<"u"){if(!Object.keys(d).length)return;ae(e,l,r,n,o?i:null);return}if(p)for(const h of Object.keys(l))ht(e,l,h,t.slice(1));for(const h of Object.keys(d)){const c=h.replace(dt,"");if(!a||t.includes(c)){const f=d[h];ae(e,l,r,f.callable,f.delegationSelector)}}},trigger(e,t,i){if(typeof t!="string"||!e)return null;let s=!0,o=new Event(t,{bubbles:s,cancelable:!0});return o=pe(o,i),e.dispatchEvent(o),o}};function pe(e,t){for(const[i,s]of Object.entries(t||{}))try{e[i]=s}catch{Object.defineProperty(e,i,{configurable:!0,get(){return s}})}return e}function Ae(e){if(e==="true")return!0;if(e==="false")return!1;if(e===Number(e).toString())return Number(e);if(e===""||e==="null")return null;if(typeof e!="string")return e;try{return JSON.parse(decodeURIComponent(e))}catch{return e}}function te(e){return e.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`)}const le={setDataAttribute(e,t,i){e.setAttribute(`data-bs-${te(t)}`,i)},removeDataAttribute(e,t){e.removeAttribute(`data-bs-${te(t)}`)},getDataAttributes(e){if(!e)return{};const t={},i=Object.keys(e.dataset).filter(s=>s.startsWith("bs")&&!s.startsWith("bsConfig"));for(const s of i){let o=s.replace(/^bs/,"");o=o.charAt(0).toLowerCase()+o.slice(1,o.length),t[o]=Ae(e.dataset[s])}return t},getDataAttribute(e,t){return Ae(e.getAttribute(`data-bs-${te(t)}`))}};class vt{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(t){return t=this._mergeConfigObj(t),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}_configAfterMerge(t){return t}_mergeConfigObj(t,i){const s=P(i)?le.getDataAttribute(i,"config"):{};return{...this.constructor.Default,...typeof s=="object"?s:{},...P(i)?le.getDataAttributes(i):{},...typeof t=="object"?t:{}}}_typeCheckConfig(t,i=this.constructor.DefaultType){for(const s of Object.keys(i)){const o=i[s],n=t[s],r=P(n)?"element":et(n);if(!new RegExp(o).test(r))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${s}" provided type "${r}" but expected type "${o}".`)}}}const mt="5.2.3";class bt extends vt{constructor(t,i){super(),t=Se(t),t&&(this._element=t,this._config=this._getConfig(i),Q.set(this._element,this.constructor.DATA_KEY,this))}dispose(){Q.remove(this._element,this.constructor.DATA_KEY),x.off(this._element,this.constructor.EVENT_KEY);for(const t of Object.getOwnPropertyNames(this))this[t]=null}_queueCallback(t,i,s=!0){at(t,i,s)}_getConfig(t){return t=this._mergeConfigObj(t,this._element),t=this._configAfterMerge(t),this._typeCheckConfig(t),t}static getInstance(t){return Q.get(Se(t),this.DATA_KEY)}static getOrCreateInstance(t,i={}){return this.getInstance(t)||new this(t,typeof i=="object"?i:null)}static get VERSION(){return mt}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(t){return`${t}${this.EVENT_KEY}`}}const F={find(e,t=document.documentElement){return[].concat(...Element.prototype.querySelectorAll.call(t,e))},findOne(e,t=document.documentElement){return Element.prototype.querySelector.call(t,e)},children(e,t){return[].concat(...e.children).filter(i=>i.matches(t))},parents(e,t){const i=[];let s=e.parentNode.closest(t);for(;s;)i.push(s),s=s.parentNode.closest(t);return i},prev(e,t){let i=e.previousElementSibling;for(;i;){if(i.matches(t))return[i];i=i.previousElementSibling}return[]},next(e,t){let i=e.nextElementSibling;for(;i;){if(i.matches(t))return[i];i=i.nextElementSibling}return[]},focusableChildren(e){const t=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(i=>`${i}:not([tabindex^="-"])`).join(",");return this.find(t,e).filter(i=>!rt(i)&&nt(i))}},yt="(max-width: 991px)",xe=()=>{if(typeof window<"u")return window.matchMedia(yt).matches},y=[];for(let e=0;e<256;++e)y.push((e+256).toString(16).slice(1));function wt(e,t=0){return(y[e[t+0]]+y[e[t+1]]+y[e[t+2]]+y[e[t+3]]+"-"+y[e[t+4]]+y[e[t+5]]+"-"+y[e[t+6]]+y[e[t+7]]+"-"+y[e[t+8]]+y[e[t+9]]+"-"+y[e[t+10]]+y[e[t+11]]+y[e[t+12]]+y[e[t+13]]+y[e[t+14]]+y[e[t+15]]).toLowerCase()}const Et=new Uint8Array(16);function Ct(){return crypto.getRandomValues(Et)}function $t(e,t,i){return crypto.randomUUID?crypto.randomUUID():St(e)}function St(e,t,i){var o;e=e||{};const s=e.random??((o=e.rng)==null?void 0:o.call(e))??Ct();if(s.length<16)throw new Error("Random bytes length must be >= 16");return s[6]=s[6]&15|64,s[8]=s[8]&63|128,wt(s)}let ie=!1,k=[];class It{constructor(t,i){this.id=t,this._callback=i}dispose(){_t(this.id)}_execute(t){this._callback(t)}}const _t=e=>{k=k.filter(t=>t.id!==e)},je=e=>{if(!(typeof document>"u")){if(k.length||typeof window<"u"&&typeof document<"u"&&document.addEventListener("scroll",t=>{ie||(window.requestAnimationFrame(()=>{k.forEach(i=>i.cb._execute(t)),ie=!1}),ie=!0)}),typeof e=="function"){const t=new It($t(),e);return k.push({id:t.id,cb:t}),t}return console.error("[onDocumentScroll] the provided data has to be of type function"),null}},zt="sticky",At="bs.sticky",fe=`.${At}`,Le=`resize${fe}`,xt=`on${fe}`,Lt=`off${fe}`,Tt="bs-it-sticky-wrapper",Te="bs-is-sticky",Oe="bs-is-fixed",Ot="data-bs-target-mobile",Ue='[data-bs-toggle="sticky"]',Nt={positionType:"sticky",stickyClassName:"",stackable:!1,paddingTop:0};class j extends bt{constructor(t,i){super(t),this._config=this._getConfig(i),this._isSticky=!1,this._wrapper=null,this._stickyTarget=F.findOne(it(this._element),this._element)||this._element,this._stickyTargetMobile=F.findOne(this._element.getAttribute(Ot),this._element)||this._stickyTarget,this._stickyLimit=0,this._stickyLimitMobile=0,this._setLimit(),this._scrollCb=null,this._isMobile=xe(),this._prevTop=0,this._onScroll(),this._bindEvents()}dispose(){typeof window<"u"&&typeof document<"u"&&(x.off(window,Le),this._scrollCb.dispose(),super.dispose())}static get NAME(){return zt}_getConfig(t){return t={...Nt,...le.getDataAttributes(this._element),...typeof t=="object"?t:{}},t}_bindEvents(){typeof window<"u"&&typeof document<"u"&&(x.on(window,Le,()=>this._onResize()),this._scrollCb=je(()=>this._onScroll()))}_onResize(){this._isMobile=xe(),this._setLimit()}_onScroll(){this._checkSticky()}_setLimit(){this._stickyLimit=this._cumulativeOffset(this._stickyTarget).top,this._stickyLimitMobile=this._cumulativeOffset(this._stickyTargetMobile).top}_getLimit(){let t=this._isMobile?this._stickyLimitMobile:this._stickyLimit;return this._config.stackable&&this._getStickySimblings().forEach((i,s)=>{const o=i.getBoundingClientRect();t-=o.height+(s===0?parseFloat(i.style.top):0)}),t>0?t:0}_cumulativeOffset(t){let i=0,s=0;do i+=t.offsetTop||0,s+=t.offsetLeft||0,t=t.offsetParent;while(t);return{top:i,left:s}}_isTypeSticky(){return this._config.positionType==="sticky"}_checkSticky(){this._isSticky||this._setLimit();const t=this._getLimit();typeof window<"u"&&window.pageYOffset>t?this._setSticky():this._unsetSticky()}_setSticky(){if(!this._isSticky){this._isSticky=!0;let t=Te;this._isTypeSticky()||(t=Oe,this._wrapper=this._createWrapper()),this._element.classList.add(t),this._config.stickyClassName&&this._element.classList.add(this._config.stickyClassName),this._prevTop=this._element.style.top,this._element.style.top=this._getPositionTop()+"px",x.trigger(this._element,xt)}}_unsetSticky(){if(this._isSticky){let t=Te;this._isTypeSticky()||(t=Oe,this._destroyWrapper()),this._element.classList.remove(t),this._config.stickyClassName&&this._element.classList.remove(this._config.stickyClassName),this._element.style.top=this._prevTop,this._isSticky=!1,x.trigger(this._element,Lt)}}_createWrapper(){if(typeof document>"u")return;const t=document.createElement("div");return t.classList.add(Tt),t.style.width="100%",t.style.height=this._element.getBoundingClientRect().height+"px",t.style.overflow="hidden",this._element.parentNode.insertBefore(t,this._element),t.appendChild(this._element),t}_destroyWrapper(){this._wrapper&&(this._wrapper.parentNode.insertBefore(this._element,this._wrapper),this._wrapper.remove())}_getStickySimblings(){return F.find(Ue).filter(i=>{const s=j.getInstance(i);return!!(s&&s._isSticky&&i!==this._element)})}_getPositionTop(){let t=0;return this._config.stackable?(this._getStickySimblings().forEach((i,s)=>{const o=i.getBoundingClientRect();t+=o.height+(s===0?parseFloat(i.style.top):0)}),t):t+this._config.paddingTop}}typeof window<"u"&&typeof document<"u"&&je(()=>{F.find(Ue).map(t=>{j.getOrCreateInstance(t)})});const Pt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},he=[{id:"ACI",name:"ACI - Automobile Club d'Italia",url:"./enti/ACI.jsonld"},{id:"AdE",name:"Agenzia delle Entrate",url:"./enti/AdE.jsonld"},{id:"ANPR",name:"ANPR - Anagrafe Nazionale della Popolazione Residente",url:"./enti/ANPR.jsonld"},{id:"GSE",name:"GSE - Gestore Servizi Energetici",url:"./enti/GSE.jsonld"},{id:"INAIL",name:"INAIL - Istituto Nazionale per l'Assicurazione contro gli Infortuni sul Lavoro",url:"./enti/INAIL.jsonld"},{id:"INPS",name:"INPS - Istituto Nazionale Previdenza Sociale",url:"./enti/INPS.jsonld"},{id:"IPZS",name:"Istituto Poligrafico e Zecca dello Stato",url:"./enti/IPZS.jsonld"},{id:"MLPS",name:"Ministero del Lavoro e delle Politiche Sociali",url:"./enti/MLPS.jsonld"},{id:"MIM",name:"Ministero dell'Istruzione e del Merito",url:"./enti/MIM.jsonld"},{id:"MIT",name:"Motorizzazione Civile - Portale dell'Automobilista",url:"./enti/MIT.jsonld"}],kt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"},Dt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/IDDEC":"Attestazione di identità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/REQ":"Istanza/richiesta","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/ADMINDOC":"Documentazione amministrativa","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CERT":"Certificazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/PAYMENTDEC":"Attestazione di pagamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/AUTHACT":"Atto autorizzativo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CODE":"Codice","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/OTHDOC":"Altra documentazione"},Mt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CERT":"Certificazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/AUTHACT":"Atto autorizzativo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/ADMINDOC":"Documentazione amministrativa","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/PAYMENTDEC":"Attestazione di pagamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CODE":"Codice","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/IDDEC":"Attestazione di identità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/REQ":"Istanza/richiesta","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/OTHDOC":"Altra documentazione"},jt={"https://w3id.org/italia/onto/CPV/taxCode":"Codice fiscale"};function g(e){if(e==null)return null;if(typeof e=="string")return e.trim()||null;if(Array.isArray(e)){for(const t of e){const i=g(t);if(i)return i}return null}if(typeof e=="object"){if(typeof e["@value"]=="string")return e["@value"].trim()||null;if(typeof e.value=="string")return e.value.trim()||null}return null}function ge(e){return e==null?[]:Array.isArray(e)?e:[e]}function Ut(e){return e==null?null:typeof e=="string"?e:typeof e=="object"&&e["@id"]?String(e["@id"]):null}function D(e,t){const i=e==null?void 0:e["@type"];return ge(i).map(String).some(o=>o===t||o.endsWith(t)||o.includes(t))}function K(e,t=180){if(!e)return"";const i=e.replace(/\s+/g," ").trim();return i.length<=t?i:`${i.slice(0,t-1).trim()}…`}function u(e){return String(e).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const qt=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,Rt=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function $(e){if(!e)return null;let t=String(e);return t=t.replace(/<script[\s\S]*?<\/script>/gi," "),t=t.replace(/<style[\s\S]*?<\/style>/gi," "),t=t.replace(/<[^>]+>/g," "),t=t.replace(/&nbsp;/gi," "),t=t.replace(/&amp;/gi,"&"),t=t.replace(qt," "),t=t.replace(/\r\n/g,`
`),t=t.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),t||null}function Ht(e){const t=$(e);if(!t)return[];if(t.includes(`

`)){const a=[];for(const l of t.split(`

`)){const d=l.trim();if(d)if(Wt(d))a.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=a[a.length-1];p&&p.heading&&!p.text?p.text=d:a.push({heading:null,text:d})}}return a.filter(l=>l.heading||l.text)}const i=[...t.matchAll(Rt)];if(!i.length)return[{heading:null,text:t}];const s=i.map(a=>({index:a.index,title:a[1].replace(/\s+/g," ").trim()})).filter(a=>a.title.length>=10&&a.title.split(/\s+/).length>=2);if(!s.length)return[{heading:null,text:t}];const o=[];for(const a of s){const l=o[o.length-1];l&&a.index<l.index+l.title.length||o.push(a)}const n=[],r=o[0];if(r.index>0){const a=t.slice(0,r.index).trim();a&&n.push({heading:null,text:a})}for(let a=0;a<o.length;a++){const l=o[a].index+o[a].title.length,d=a+1<o.length?o[a+1].index:t.length,p=t.slice(l,d).trim();n.push({heading:o[a].title,text:p})}return n.filter(a=>a.heading||a.text)}const Bt=/<(p|ul|ol|li|strong|b|em|i|a|br)\b/i,Vt=new Set(["p","ul","ol","li","strong","b","em","i","a","br"]);function Ft(e){if(!e||!Bt.test(e)||typeof DOMParser>"u")return null;const i=new DOMParser().parseFromString(`<div id="rich-root">${e}</div>`,"text/html").getElementById("rich-root");return i&&N(i).innerHTML.trim()||null}function N(e){const t=e.ownerDocument,i=t.createElement("div");for(const s of[...e.childNodes]){if(s.nodeType===Node.TEXT_NODE){i.appendChild(t.createTextNode(s.textContent));continue}if(s.nodeType!==Node.ELEMENT_NODE)continue;const o=s.tagName.toLowerCase();if(!Vt.has(o)){const a=N(s);for(;a.firstChild;)i.appendChild(a.firstChild);continue}if(o==="a"){const a=s.getAttribute("href")||"";if(!/^https?:\/\//i.test(a)){const p=N(s);for(;p.firstChild;)i.appendChild(p.firstChild);continue}const l=t.createElement("a");l.setAttribute("href",a),l.setAttribute("rel","noopener noreferrer");const d=N(s);for(;d.firstChild;)l.appendChild(d.firstChild);l.textContent.trim()&&i.appendChild(l);continue}const n=t.createElement(o),r=N(s);for(;r.firstChild;)n.appendChild(r.firstChild);(o==="br"||n.textContent.trim())&&i.appendChild(n)}return i}function G(e){const t=Ft(e);if(t)return t;const i=Ht(e);return i.length?i.map(s=>{const o=[];return s.heading&&o.push(`<h3 class="h5 mt-3 mb-2">${u(Kt(s.heading))}</h3>`),s.text&&o.push(`<p class="mb-2">${u(s.text)}</p>`),o.join("")}).join(""):""}function Wt(e){const t=e.replace(/\s+/g," ").trim();return t.length<5||t.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(t)||t!==t.toLocaleUpperCase("it")||t.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(t)}function Kt(e){return e.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,s,o)=>s+o.toLocaleUpperCase("it"))}const qe="./cpsv_full.jsonld";function ce(e=window.location.hash){const t=(e||"").replace(/^#/,"");let i=null,s="/";if(t.startsWith("catalog=")){const d=t.indexOf("&"),p=d===-1?t.slice(8):t.slice(8,d);i=decodeURIComponent(p),s=d===-1?"/":t.slice(d+1)||"/"}else t&&(s=t.startsWith("/")?t:`/${t}`);const{path:o,query:n}=Jt(s),r=o.startsWith("/")?o:`/${o}`;let a="list",l=null;if(r==="/cpsv")a="cpsv";else if(r==="/jsonld")a="jsonld";else{const d=r.match(/^\/servizio\/(.+)$/);d&&(a="detail",l=decodeURIComponent(d[1]))}return{catalog:i,path:r,view:a,serviceId:l,filters:Zt(n)}}function w({catalog:e,path:t="/",filters:i}={}){const s=t.startsWith("/")?t:`/${t}`,o=Xt(i);return e?`#catalog=${encodeURIComponent(e)}&${s}${o}`:`#${s}${o}`}function Gt(e,{replace:t=!1}={}){const i=w(e);Yt(ce(window.location.hash||"#"),ce(i))||(t?history.replaceState(null,"",i):history.pushState(null,"",i))}function Yt(e,t){return e.catalog===t.catalog&&e.path===t.path&&e.view===t.view&&e.serviceId===t.serviceId&&e.filters.q===t.filters.q&&e.filters.org===t.filters.org&&e.filters.lifeEvent===t.filters.lifeEvent&&e.filters.theme===t.filters.theme&&e.filters.page===t.filters.page}function Jt(e){const t=e.indexOf("?");return t===-1?{path:e||"/",query:""}:{path:e.slice(0,t)||"/",query:e.slice(t+1)}}function Zt(e){const t=new URLSearchParams(e||""),i=Number(t.get("p")||"1"),s=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:t.get("q")||"",org:t.get("ente")||"",lifeEvent:t.get("evento")||"",theme:t.get("tema")||"",page:s}}function Xt(e){if(!e)return"";const t=new URLSearchParams;e.q&&t.set("q",String(e.q)),e.org&&t.set("ente",String(e.org)),e.lifeEvent&&t.set("evento",String(e.lifeEvent)),e.theme&&t.set("tema",String(e.theme));const i=Number(e.page||1);Number.isFinite(i)&&i>1&&t.set("p",String(Math.floor(i)));const s=t.toString();return s?`?${s}`:""}function Re(e){return!e||!String(e).trim()?qe:String(e).trim()}async function Qt(e){const t=Re(e);let i;try{i=await fetch(t,{credentials:"same-origin"})}catch(o){const n=new Error(`Impossibile scaricare il catalogo (${t}). Verifica URL, CORS o rete.`);throw n.cause=o,n.code="NETWORK",n}if(!i.ok){const o=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${t}`);throw o.code="HTTP",o}let s;try{s=await i.json()}catch(o){const n=new Error(`Il file non è un JSON valido: ${t}`);throw n.cause=o,n.code="JSON",n}if(!s||typeof s!="object"||!Array.isArray(s["@graph"])){const o=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw o.code="SHAPE",o}return{doc:s,url:t}}function S(e){return ge(e).map(Ut).filter(Boolean)}function B(e,t){var s,o,n,r;const i=[];for(const a of e){const l=t.get(a);if(!l)continue;const d=$(g(l["dct:title"])||g(l["skos:prefLabel"])),p=g(l["dct:description"])||g(l["rdfs:comment"]),c=$(p)||d||"",f=typeof l["dct:type"]=="string"&&l["dct:type"]||((s=l["dct:type"])==null?void 0:s["@id"])||null,C=f?((o=si())==null?void 0:o[f])||String(f).split(/[#/]/).pop():null,b=typeof l["cv:supportsConcept"]=="string"&&l["cv:supportsConcept"]||((n=l["cv:supportsConcept"])==null?void 0:n["@id"])||null,O=b?((r=ni())==null?void 0:r[b])||String(b).split(/[#/]/).pop():null,z=ei(l["cv:value"]);(c||C||O||z)&&i.push({id:a,title:d,text:c,html:p||"",typeId:f,typeLabel:C,conceptId:b,conceptLabel:O,duration:z,durationLabel:z?ti(z):null})}return i}function ei(e){return e==null?null:typeof e=="string"?e:typeof e=="object"&&e["@value"]!=null?String(e["@value"]):null}function ti(e){const t=String(e||"").trim().toUpperCase();if(!t)return null;if(t==="PT0S"||t==="P0D"||t==="PT0H")return"Immediato";const i=t.match(/^P(\d+)W$/);if(i){const r=Number(i[1]);return r===1?"1 settimana":`${r} settimane`}const s=t.match(/^P(\d+)M$/);if(s){const r=Number(s[1]);return r===1?"1 mese":`${r} mesi`}const o=t.match(/^P(\d+)D$/);if(o){const r=Number(o[1]);return r===1?"1 giorno":`${r} giorni`}const n=t.match(/^PT(\d+)H$/);if(n){const r=Number(n[1]);return r===1?"1 ora":`${r} ore`}return t}function He(e){if(e==null||e==="")return null;if(typeof e=="number")return e;if(typeof e=="string"){const t=Number(e.replace(",","."));return Number.isNaN(t)?null:t}return typeof e=="object"&&e["@value"]!=null?He(e["@value"]):null}let Be=null;function ii(e){Be=e}function si(){return Be||{}}let Ve=null;function oi(e){Ve=e}function ni(){return Ve||{}}function ri(e,t){const i=$(g(e["aci:costDescription"])),s=e["cpsv:hasCost"];if(s==null&&!i)return null;const o=typeof s=="string"&&s.startsWith("http")?s:(s==null?void 0:s["@id"])||null,n=o?t.get(o):null;if(n){const a=$(g(n["dct:description"])||g(n["dct:title"])),l=He(n["cv:value"]),d=typeof n["cv:currency"]=="string"&&n["cv:currency"]||g(n["cv:currency"])||(l!=null?"EUR":null);return l==null&&!a&&!i?null:{text:a||i||"",amount:l,currency:d,structured:l!=null}}const r=i||$(g(s))||"";return r?{text:r,amount:null,currency:null,structured:!1}:null}function ai(e,t){var a;let i=null;const s=e["foaf:page"];if(typeof s=="string"&&s.startsWith("http")?i=s:(a=s==null?void 0:s["@id"])!=null&&a.startsWith("http")&&(i=s["@id"]),!i)for(const l of S(e["cpsv:hasWebSiteChannel"])){const d=t.get(l),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof e["@id"]=="string"&&e["@id"].startsWith("http")&&(i=e["@id"].split("#")[0]);const o=[],n=new Set,r=l=>{if(!l||!l.startsWith("http"))return;const d=l.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||n.has(d)||(n.add(d),o.push(l))};for(const l of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of S(e[l])){const p=t.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&r(d);continue}const h=p["foaf:page"];typeof h=="string"?r(h):h!=null&&h["@id"]&&r(h["@id"])}return{sheetUrl:i,applicationUrls:o}}function li(e,t){const i=e["@graph"]||[],s=new Map;for(const c of i)c&&c["@id"]&&s.set(String(c["@id"]),c);const o=new Map;for(const c of i)c&&(D(c,"PublicOrganisation")||D(c,"cv:PublicOrganisation"))&&o.set(c["@id"],{id:c["@id"],title:g(c["dct:title"])||c["@id"],homepage:typeof c["foaf:homepage"]=="string"?c["foaf:homepage"]:null});const n=[];for(const c of i){if(!c||!D(c,"PublicService"))continue;const C=S(c["cv:hasCompetentAuthority"]||c["cpsv:producedBy"])[0]||null,b=C?o.get(C):null,O=S(c["cpsv:isPartOfEvent"]),z=S(c["cpsv:hasTheme"]),Ke=S(c["cpsv:hasInput"]),me=B(Ke,s),Ge=S(c["cpsv:hasProcessingTime"]),Z=B(Ge,s),X=g(c["aci:processingTime"]);X&&Z.push({id:`${c["@id"]}#aci-time`,text:X,html:X,typeId:null,typeLabel:null,duration:null,durationLabel:null});const Ye=S(c["cpsv:hasOutput"]),be=B(Ye,s),ye=S(c["cv:addressee"]),q=B(ye,s);if(!q.length)for(const E of ye){const L=s.get(E),$e=g(L==null?void 0:L["dct:title"])||g(L==null?void 0:L["skos:prefLabel"]);$e?q.push({id:E,text:$e}):E.includes("#addressee-")&&q.push({id:E,text:decodeURIComponent(E.split("#addressee-").pop())})}const we=ri(c,s),{sheetUrl:R,applicationUrls:H}=ai(c,s),Je=[R,...H].filter(Boolean),Ze=$(g(c["dct:title"])||g(c["cpsv:name"]))||"Servizio",Ee=g(c["dct:description"]),Ce=$(Ee),Xe=$(g(c["dct:abstract"]))||Ce;n.push({id:c["@id"],title:Ze,description:Ce,descriptionHtml:Ee,abstract:Xe,orgId:C,orgTitle:(b==null?void 0:b.title)||null,lifeEventIds:O,themeIds:z,lifeEventLabels:O.map(E=>t.lifeEvents[E]||E.split("/").pop()),themeLabels:z.map(E=>t.themes[E]||`Tema ${E.split("/").pop()}`),addressees:q,inputs:me,outputs:be,processingTimes:Z,cost:we,sheetUrl:R,applicationUrls:H,onlineUrls:Je,hasOnlineChannel:H.length>0,pageUrl:R||c["@id"],flags:{hasInput:me.length>0,hasOutput:be.length>0,hasTime:Z.length>0,hasCost:!!we,hasOnline:H.length>0,hasSheet:!!R}})}n.sort((c,f)=>c.title.localeCompare(f.title,"it"));const r=[...o.values()].sort((c,f)=>c.title.localeCompare(f.title,"it")),a=new Map,l=new Map;for(const c of n){for(const f of c.lifeEventIds)a.set(f,(a.get(f)||0)+1);for(const f of c.themeIds)l.set(f,(l.get(f)||0)+1)}const d=[...a.entries()].map(([c,f])=>({id:c,label:t.lifeEvents[c]||c.split("/").pop(),count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),p=[...l.entries()].map(([c,f])=>({id:c,label:t.themes[c]||`Tema ${c.split("/").pop()}`,count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),h=ge(e["cpsv-portalone:sourceCatalogs"]).map(c=>({id:c==null?void 0:c["@id"],title:g(c==null?void 0:c["dct:title"])||(c==null?void 0:c["@id"])}));return{services:n,orgsById:o,nodesById:s,facets:{orgs:r,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:e["dct:modified"]||null,sources:h,count:n.length}}}function Fe(e){const t=Array.isArray(e==null?void 0:e["@graph"])?e["@graph"]:[],i=new Map;for(const n of t)n!=null&&n["@id"]&&i.set(String(n["@id"]),n);const s=n=>{const r=[],a=l=>{if(!(!l||typeof l!="object")){if(Array.isArray(l)){l.forEach(a);return}typeof l["@id"]=="string"&&r.push(l["@id"]);for(const[d,p]of Object.entries(l))d==="@id"||d==="@context"||a(p)}};for(const[l,d]of Object.entries(n))l==="@id"||l==="@context"||a(d);return r},o=[];for(const n of t){if(!n||!D(n,"PublicService"))continue;const r=[],a=new Set,l=[n];for(;l.length;){const p=l.pop(),h=p!=null&&p["@id"]?String(p["@id"]):null;if(!(h&&a.has(h))){h&&a.add(h),r.push(p);for(const c of s(p)){if(a.has(c))continue;const f=i.get(c);!f||f!==n&&D(f,"PublicService")||l.push(f)}}}const d=$(g(n["dct:title"])||g(n["cpsv:name"]))||n["@id"]||"Servizio";o.push({id:n["@id"]||d,title:d,json:JSON.stringify({"@context":e["@context"],"@graph":r},null,2)})}return o.sort((n,r)=>n.title.localeCompare(r.title,"it")),o}function ci(e,t){const i=(t.q||"").trim().toLocaleLowerCase("it");return e.filter(s=>!(t.org&&s.orgId!==t.org||t.lifeEvent&&!s.lifeEventIds.includes(t.lifeEvent)||t.theme&&!s.themeIds.includes(t.theme)||t.onlineOnly&&!s.flags.hasOnline||i&&!`${s.title} ${s.abstract||""} ${s.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const de=24,se="Catalogo dei servizi della PA",di="Trova e consulta i servizi digitali della Pubblica Amministrazione";function ui({catalogUrl:e,meta:t,error:i,detail:s=null,filters:o=null,view:n="list"}){const r=u(w({catalog:Y(e),path:"/",filters:o})),a=u(w({catalog:Y(e),path:"/cpsv",filters:o})),l=t?`${t.count} serviz${t.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky" data-bs-toggle="sticky" data-bs-position-type="fixed" data-bs-target="#sticky-trigger" data-bs-sticky-class-name="is-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${r}" aria-label="${u(se)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${u(se)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${u(di)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${s?pi(s,{homeHref:r,catalogUrl:e}):""}
  <div id="sticky-trigger" class="sticky-trigger" aria-hidden="true"></div>
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${u(i)}</p>
        </div>`:""}
  ${vi(e,n,s)}
  ${n==="list"&&!s?`<p class="text-secondary mb-2">${u(l)}</p>
         <p class="mb-4"><a href="${a}">Cos’è CPSV</a></p>`:""}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${u(se)}</h2>
      <p class="mb-2">
        <a href="${a}"${n==="cpsv"?' aria-current="page"':""}>Cos’è CPSV</a>
      </p>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function pi(e,{homeHref:t,catalogUrl:i=null}){var l;const s=e.sheetUrl||e.pageUrl,o=s?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${u(s)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai al servizio
        ${hi()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',n=fi(i,e.id),r=`
    <div class="d-flex flex-column gap-2 align-items-lg-end">
      ${o}
      <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
        <a class="btn btn-outline-light btn-sm" href="${u(n)}">Modifica in editor</a>
        <button type="button" class="btn btn-outline-light btn-sm" data-download-scheda="${u(e.id)}">
          Scarica scheda JSON-LD
        </button>
      </div>
    </div>`,a=((l=e.lifeEventIds)==null?void 0:l.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${e.lifeEventIds.map((d,p)=>{var c;const h=((c=e.lifeEventLabels)==null?void 0:c[p])||d;return`<a class="service-header-pill" role="listitem" href="${u(d)}" target="_blank" rel="noopener noreferrer">${u(h)}<span class="visually-hidden"> (scheda vocabolario)</span></a>`}).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${t}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${u(K(e.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${u(e.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${u(e.title)}</h1>
        ${a}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${r}
      </div>
    </div>
  </div>
</div>`}function fi(e,t){const i=new URL("../scheda-cpsv.html",window.location.href);if(e){const s=new URL(e,window.location.href).href;i.searchParams.set("catalog",s)}return t&&i.searchParams.set("service",t),i.href}function hi(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function Y(e){return!e||e==="./cpsv_full.jsonld"?null:e}function gi(e){return he.find(t=>t.url===e)||null}function vi(e,t,i){if(t!=="list"||i)return"";const s=gi(e);if(!s)return"";const o=u(w({path:"/"}));return`
<div class="alert alert-info" role="status">
  <p class="mb-0">
    Stai consultando il CPSV di <strong>${u(s.name)}</strong>.
    <a href="${o}">Torna al catalogo completo</a>.
  </p>
</div>`}function mi(e){if(!e)return"Ente";const t=String(e).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!t)return K(e,36);const i=t[1];return/agenzia delle entrate/i.test(e)?"Agenzia delle Entrate":/motorizzazione/i.test(e)?"Motorizzazione":/anpr/i.test(e)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function oe({id:e,name:t,label:i,optionsHtml:s,value:o}){return`
<div class="mb-3">
  <label class="form-label" for="${u(e)}">${u(i)}</label>
  <select class="form-select" id="${u(e)}" name="${u(t)}">
    ${s}
  </select>
</div>`}function bi({index:e,filterState:t}){const{facets:i}=e,s=['<option value="">Tutti gli enti</option>',...i.orgs.map(r=>`<option value="${u(r.id)}" ${t.org===r.id?"selected":""}>${u(r.title)}</option>`)].join(""),o=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(r=>`<option value="${u(r.id)}" ${t.lifeEvent===r.id?"selected":""}>${u(r.label)}</option>`)].join(""),n=['<option value="">Tutti i temi</option>',...i.themes.map(r=>`<option value="${u(r.id)}" ${t.theme===r.id?"selected":""}>${u(r.label)}</option>`)].join("");return`
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
            value="${u(t.q||"")}"
            placeholder="Es. bollo, pensione, residenza"
            autocomplete="off"
          />
        </div>
        ${oe({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:s,value:t.org})}
        ${oe({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:o,value:t.lifeEvent})}
        ${oe({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:n,value:t.theme})}
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
`}function yi(e,{catalogUrl:t,page:i,filterState:s={}}){const o=Y(t),n=(i-1)*de,r=e.slice(n,n+de);return r.length?r.map(a=>{const l=w({catalog:o,path:`/servizio/${encodeURIComponent(a.id)}`,filters:{...s,page:i}}),d=mi(a.orgTitle),p=a.lifeEventIds[0]||"",h=a.lifeEventLabels[0]?K(a.lifeEventLabels[0],40):null,c=s.org&&s.org===a.orgId,f=s.lifeEvent&&s.lifeEvent===p,C=a.orgId?`<button
            type="button"
            class="chip chip-simple ${c?"chip-filter-active":""}"
            data-filter-org="${u(a.orgId)}"
            aria-pressed="${c?"true":"false"}"
            title="Filtra per ${u(d)}"
          ><span class="chip-label">${u(d)}</span></button>`:"",b=p?`<button
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
          ${C}
          ${b}
        </div>
        <h3 class="card-title h5">
          <a href="${u(l)}">${u(a.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${u(K(a.abstract||"Descrizione non disponibile per questo servizio.",180))}
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
</div>`}function wi(e,t,{catalogUrl:i,filterState:s={}}={}){const o=Math.max(1,Math.ceil(e/de));if(o<=1)return"";const n=Y(i),r=[];for(let a=1;a<=o;a++){const l=w({catalog:n,path:"/",filters:{...s,page:a}});r.push(`<li class="page-item ${a===t?"active":""}">
        <a class="page-link" href="${u(l)}" data-page="${a}" ${a===t?'aria-current="page"':""}>${a}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${r.join("")}</ul>`}function Ei(e){var i;const t=[];if(e.addressees.length&&t.push(T("A chi è rivolto",V(e.addressees))),e.inputs.length&&t.push(T("Cosa serve",V(e.inputs))),e.processingTimes.length&&t.push(T("Tempi",V(e.processingTimes))),e.cost&&t.push(T("Costi",Ci(e.cost))),e.outputs.length&&t.push(T("Cosa si ottiene",V(e.outputs))),(i=e.themeIds)!=null&&i.length){const s=`<ul class="list-unstyled mb-0">${e.themeIds.map((o,n)=>{var a;const r=((a=e.themeLabels)==null?void 0:a[n])||o;return`<li class="mb-2"><a href="${u(o)}" target="_blank" rel="noopener noreferrer">${u(r)}<span class="visually-hidden"> (scheda vocabolario)</span></a></li>`}).join("")}</ul>`;t.push(T("Temi",s))}return`
${e.description?`<div class="font-serif service-description">${G(e.descriptionHtml||e.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${t.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function T(e,t){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${u(e)}</h2>
  ${t}
</section>`}function V(e){return e.map(t=>{const i=[];return t.conceptId&&t.conceptLabel?i.push(`<p class="mb-1"><strong>Concetto:</strong> <a href="${u(t.conceptId)}" target="_blank" rel="noopener noreferrer">${u(t.conceptLabel)}<span class="visually-hidden"> (schema.gov.it)</span></a></p>`):t.conceptLabel&&i.push(`<p class="mb-1"><strong>Concetto:</strong> ${u(t.conceptLabel)}</p>`),t.typeId&&t.typeLabel?i.push(`<p class="mb-1"><strong>Tipo:</strong> <a href="${u(t.typeId)}" target="_blank" rel="noopener noreferrer">${u(t.typeLabel)}<span class="visually-hidden"> (scheda vocabolario)</span></a></p>`):t.typeLabel&&i.push(`<p class="mb-1"><strong>Tipo:</strong> ${u(t.typeLabel)}</p>`),t.durationLabel&&i.push(`<p class="mb-1"><strong>Durata:</strong> ${u(t.durationLabel)}</p>`),t.text||t.html?i.push(`<div class="service-block-text">${G(t.html||t.text)}</div>`):i.length||i.push('<p class="text-secondary mb-0">Dettaglio non testuale.</p>'),`<div class="mb-3">${i.join("")}</div>`}).join("")}function Ci(e){if(!e)return"";if(typeof e=="string")return G(e);const t=[];if(e.amount!=null){const i=e.amount===0?`Gratuito${e.currency?` (${u(e.currency)})`:""}`:`${u(String(e.amount))} ${u(e.currency||"EUR")}`.trim();t.push(`<p class="mb-1"><strong>Importo:</strong> ${i}</p>`)}return e.text&&t.push(`<div class="service-block-text">${G(e.text)}</div>`),t.join("")||'<p class="text-secondary mb-0">Costo indicato senza dettaglio testuale.</p>'}const $i=`{
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
}`;function Si({homeHref:e,catalogUrl:t}){const i=u(e);return`
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
    ${Ai()}
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
    <pre class="cpsv-code"><code>${u($i)}</code></pre>
    <p>
      Nell’elenco, il filtro Ente segue l’ente competente, Momento della vita segue l’evento
      e Argomento segue il tema. Sono le stesse frecce del grafo, applicate alle schede vere.
    </p>
    <p><a href="${i}">Vai al catalogo</a></p>
  </section>
  ${Ii()}
</article>`}function Ii(){return`
<section class="mt-5" aria-labelledby="cpsv-enti">
  <div class="cpsv-prose">
    <h2 class="h3" id="cpsv-enti">I cataloghi degli enti</h2>
    <p>
      Il catalogo completo unisce i CPSV di questi enti.
      Aprine uno per leggere il JSON-LD di ogni servizio.
    </p>
  </div>
  <ul class="cpsv-sources">
    ${[{name:"Catalogo completo",href:w({path:"/jsonld"}),action:"Vedi il JSON-LD"},...he.map(t=>({name:t.name,href:w({catalog:t.url,path:"/jsonld"}),action:"Vedi il JSON-LD"}))].map(t=>`
    <li>
      <a class="cpsv-source" href="${u(t.href)}">
        <span class="cpsv-source-name">${u(t.name)}</span>
        <span class="cpsv-source-action">${u(t.action)}</span>
      </a>
    </li>`).join("")}
  </ul>
</section>`}function _i({title:e,cpsvHref:t,servicesHref:i,fileUrl:s}){return`
<article class="cpsv-json-page">
  <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
    <ol class="breadcrumb">
      <li class="breadcrumb-item"><a href="${u(t)}">Cos’è CPSV</a><span class="separator" aria-hidden="true">/</span></li>
      <li class="breadcrumb-item active" aria-current="page">${u(e)}</li>
    </ol>
  </nav>
  <h1 class="h2 mb-3">${u(e)}</h1>
  <p class="cpsv-json-actions mb-3">
    <a href="${u(i)}">Vedi i servizi</a>
    <a href="${u(s)}" download>Scarica il file intero</a>
  </p>
  <div id="cpsv-json-services">
    <p>Caricamento del JSON-LD…</p>
  </div>
</article>`}function zi(e){return e.length?`
<p class="text-secondary mb-3">${e.length} serviz${e.length===1?"io":"i"}. Ogni blocco è il JSON-LD di un servizio, con i nodi a cui è collegato.</p>
${e.map(t=>`
<details class="cpsv-service-json">
  <summary>
    <span class="cpsv-service-title">${u(t.title)}</span>
    <a class="cpsv-playground" href="https://json-ld.org/playground/" target="_blank" rel="noopener noreferrer">Apri nel JSON-LD Playground</a>
  </summary>
  <pre class="cpsv-code"><code>${u(t.json)}</code></pre>
</details>`).join("")}`:'<p class="alert alert-info">In questo catalogo non ci sono servizi.</p>'}function Ai(){const e=(i,s,o,n,r,a,l=!1)=>{const d=l?"#fff":"#17324d",p=l?"#d6e8fa":"#5c6f82";return`
      <rect x="${i}" y="${s}" width="${o}" height="${n}" rx="8" fill="${l?"#0066cc":"#fff"}" stroke="#0066cc" stroke-width="2"/>
      <text x="${i+o/2}" y="${s+30}" text-anchor="middle" font-size="16" font-weight="700" fill="${d}">${u(r)}</text>
      <text x="${i+o/2}" y="${s+52}" text-anchor="middle" font-size="13" fill="${p}">${u(a)}</text>`},t=(i,s,o)=>{const n=Math.max(...o.map(d=>d.length))*6.6+12,r=o.length*16+8,a=i-n/2,l=s-14;return`
      <rect x="${a}" y="${l}" width="${n}" height="${r}" fill="#fff"/>
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
  ${t(330,148,["cov:hasPublicOrganization"])}
  ${t(790,148,["destinatario"])}
  ${t(348,272,["cpsv:hasInput"])}
  ${t(752,272,["cpsv:hasOutput"])}
  ${t(250,455,["cpsv:isPartOfEvent"])}
  ${t(550,400,["cpsv:hasWebSiteChannel","cpsv:hasOtherElectronicChannel"])}
  ${t(820,455,["cpsv:hasTheme"])}
  ${e(430,250,240,80,"Servizio pubblico","cpsv:PublicService",!0)}
  ${e(40,24,280,72,"Ente","cov:PublicOrganization")}
  ${e(780,24,280,72,"Destinatario","l0:Agent")}
  ${e(16,254,250,72,"Che cosa serve","cpsv:Input")}
  ${e(834,254,250,72,"Che cosa si ottiene","cpsv:Output")}
  ${e(40,530,280,72,"Momento della vita","evento di vita")}
  <rect x="410" y="500" width="280" height="96" rx="8" fill="#fff" stroke="#0066cc" stroke-width="2"/>
  <text x="550" y="530" text-anchor="middle" font-size="16" font-weight="700" fill="#17324d">Canali</text>
  <text x="550" y="552" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:WebSiteChannel</text>
  <text x="550" y="572" text-anchor="middle" font-size="13" fill="#5c6f82">cpsv:OtherElectronicChannel</text>
  ${e(780,530,280,72,"Tema","classificazione")}
</svg>`}ii({...Dt,...Mt});oi(jt);const xi={lifeEvents:Pt,themes:kt},W=document.getElementById("app");function A(e){var s;const t=W.querySelector("header[data-bs-toggle='sticky']");t&&((s=j.getInstance(t))==null||s.dispose()),W.innerHTML=ui(e);const i=W.querySelector("header[data-bs-toggle='sticky']");i&&j.getOrCreateInstance(i),Li()}function Li(){const e=W.querySelector("[data-download-scheda]");!e||!(v!=null&&v.doc)||e.addEventListener("click",()=>{const t=e.getAttribute("data-download-scheda"),s=Fe(v.doc).find(l=>l.id===t);if(!s){window.alert("Impossibile estrarre la scheda JSON-LD di questo servizio.");return}const o=new Blob([s.json],{type:"application/ld+json"}),n=URL.createObjectURL(o),r=document.createElement("a");r.href=n;const a=String(s.title||"scheda").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);r.download=`scheda-${a||"cpsv"}.jsonld`,r.click(),URL.revokeObjectURL(n)})}let v=null,m={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},_=1,ne=0;function M(e){return!e||e===qe?null:e}async function Ti(e){const t=Re(e);if(v&&v.docUrl===t)return v;const i=++ne;A({catalogUrl:t,meta:null,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:o,url:n}=await Qt(t);return i!==ne||(v={docUrl:n,doc:o,index:li(o,xi)}),v}catch(o){if(i!==ne)return null;v=null,A({catalogUrl:t,meta:null,error:o.message||String(o)});const n=document.getElementById("view-root");return n&&(n.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${w({catalog:M(t),path:"/",filters:ve()})}">Torna al catalogo</a></p>
        </div>`),null}}function ve(){return{q:m.q,org:m.org,lifeEvent:m.lifeEvent,theme:m.theme,page:_}}function Oi(e){m={q:(e==null?void 0:e.q)||"",org:(e==null?void 0:e.org)||"",lifeEvent:(e==null?void 0:e.lifeEvent)||"",theme:(e==null?void 0:e.theme)||"",onlineOnly:!1},_=(e==null?void 0:e.page)>1?e.page:1}function J({replace:e}){v&&Gt({catalog:M(v.docUrl),path:"/",filters:ve()},{replace:e})}function ue(){const e=document.getElementById("filter-q"),t=document.getElementById("filter-org"),i=document.getElementById("filter-le"),s=document.getElementById("filter-theme"),o=document.getElementById("filter-online");e&&(e.value=m.q||""),t&&(t.value=m.org||""),i&&(i.value=m.lifeEvent||""),s&&(s.value=m.theme||""),o&&(o.checked=!1)}function Ni(){var s,o;const e=document.getElementById("filters-form");if(!e)return;const t=({replace:n})=>{var r,a,l,d;m={q:((r=document.getElementById("filter-q"))==null?void 0:r.value)||"",org:((a=document.getElementById("filter-org"))==null?void 0:a.value)||"",lifeEvent:((l=document.getElementById("filter-le"))==null?void 0:l.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},_=1,J({replace:n}),U()};e.addEventListener("change",n=>{var r;((r=n.target)==null?void 0:r.id)!=="filter-q"&&t({replace:!1})}),e.addEventListener("submit",n=>{n.preventDefault(),t({replace:!1})});let i;(s=document.getElementById("filter-q"))==null||s.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>t({replace:!0}),200)}),(o=document.getElementById("filters-reset"))==null||o.addEventListener("click",()=>{m={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},_=1,ue(),J({replace:!1}),U()})}function Pi(e){e&&(e.querySelectorAll("[data-filter-org]").forEach(t=>{t.addEventListener("click",i=>{var o;i.preventDefault(),i.stopPropagation();const s=t.getAttribute("data-filter-org")||"";m.org=m.org===s?"":s,_=1,ue(),J({replace:!1}),U(),(o=document.getElementById("results-count"))==null||o.scrollIntoView({behavior:"smooth",block:"start"})})}),e.querySelectorAll("[data-filter-life-event]").forEach(t=>{t.addEventListener("click",i=>{var o;i.preventDefault(),i.stopPropagation();const s=t.getAttribute("data-filter-life-event")||"";m.lifeEvent=m.lifeEvent===s?"":s,_=1,ue(),J({replace:!1}),U(),(o=document.getElementById("results-count"))==null||o.scrollIntoView({behavior:"smooth",block:"start"})})}))}function U(){if(!v)return;const e=ci(v.index.services,m),t=document.getElementById("results-count"),i=document.getElementById("results-grid"),s=document.getElementById("pager");t&&(t.textContent=e.length===1?"1 servizio trovato":`${e.length} servizi trovati`),i&&(i.innerHTML=yi(e,{catalogUrl:v.docUrl,page:_,filterState:m}),Pi(i)),s&&(s.innerHTML=wi(e.length,_,{catalogUrl:v.docUrl,filterState:m}))}function ki(e){e.querySelectorAll(".cpsv-playground").forEach(t=>{t.addEventListener("click",i=>{var n,r;i.preventDefault(),i.stopPropagation();const s=(r=(n=t.closest("details"))==null?void 0:n.querySelector("code"))==null?void 0:r.textContent;if(!s)return;const o=new URLSearchParams;o.set("json-ld",s),o.set("startTab","tab-expanded"),window.open(`https://json-ld.org/playground/#${o.toString()}`,"_blank","noopener,noreferrer")})})}async function We(){const e=ce(),t=(v==null?void 0:v.docUrl)||null;Oi(e.filters);const i=await Ti(e.catalog);if(!i)return;const s=ve();if(e.view==="cpsv"){A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"cpsv"});const n=document.getElementById("view-root");n&&(n.innerHTML=Si({homeHref:w({catalog:M(i.docUrl),path:"/",filters:s}),catalogUrl:i.docUrl})),window.scrollTo(0,0);return}if(e.view==="jsonld"){const n=he.find(a=>a.url===i.docUrl);A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"jsonld"});const r=document.getElementById("view-root");if(r){r.innerHTML=_i({title:n?n.name:"Catalogo completo",cpsvHref:w({path:"/cpsv"}),servicesHref:w({catalog:M(i.docUrl),path:"/"}),fileUrl:i.docUrl});const a=document.getElementById("cpsv-json-services");try{const l=await fetch(i.docUrl,{credentials:"same-origin"});if(!l.ok)throw new Error(`HTTP ${l.status}`);const d=await l.json();a!=null&&a.isConnected&&(a.innerHTML=zi(Fe(d)),ki(a))}catch(l){if(a!=null&&a.isConnected){a.replaceChildren();const d=document.createElement("p");d.className="alert alert-warning",d.textContent=`Non è stato possibile leggere il JSON-LD (${l.message||l}).`,a.append(d)}}}window.scrollTo(0,0);return}if(e.view==="detail"){const n=i.index.services.find(a=>a.id===e.serviceId);if(!n){A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s});const a=document.getElementById("view-root");a&&(a.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${w({catalog:M(i.docUrl),path:"/",filters:s})}">Torna all’elenco</a>
          </div>`);return}A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,detail:n,filters:s});const r=document.getElementById("view-root");r&&(r.innerHTML=Ei(n)),window.scrollTo(0,0);return}A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"list"});const o=document.getElementById("view-root");o&&(o.innerHTML=bi({index:i.index,filterState:m,catalogUrl:i.docUrl}),Ni(),U(),t&&t!==i.docUrl&&window.scrollTo(0,0))}window.addEventListener("hashchange",()=>{We()});We();
