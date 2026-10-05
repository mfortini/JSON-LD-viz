(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))s(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const a of o.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&s(a)}).observe(document,{childList:!0,subtree:!0});function i(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function s(n){if(n.ep)return;n.ep=!0;const o=i(n);fetch(n.href,o)}})();const I=new Map;var Q={set(t,e,i){I.has(t)||I.set(t,new Map);const s=I.get(t);if(!s.has(e)&&s.size!==0){console.error(`Bootstrap doesn't allow more than one instance per element. Bound instance: ${Array.from(s.keys())[0]}.`);return}s.set(e,i)},get(t,e){return I.has(t)&&I.get(t).get(e)||null},remove(t,e){if(!I.has(t))return;const i=I.get(t);i.delete(e),i.size===0&&I.delete(t)}};const et=1e3,re="transitionend",tt=t=>t==null?`${t}`:Object.prototype.toString.call(t).match(/\s([a-z]+)/i)[1].toLowerCase(),it=t=>{let e=t.getAttribute("data-bs-target");if(!e||e==="#"){let i=t.getAttribute("href");if(!i||!i.includes("#")&&!i.startsWith("."))return null;i.includes("#")&&!i.startsWith("#")&&(i=`#${i.split("#")[1]}`),e=i&&i!=="#"?i.trim():null}return e},st=t=>{const e=it(t);return e&&document.querySelector(e)?e:null},nt=t=>{if(!t)return 0;let{transitionDuration:e,transitionDelay:i}=window.getComputedStyle(t);const s=Number.parseFloat(e),n=Number.parseFloat(i);return!s&&!n?0:(e=e.split(",")[0],i=i.split(",")[0],(Number.parseFloat(e)+Number.parseFloat(i))*et)},ot=t=>{t.dispatchEvent(new Event(re))},P=t=>!t||typeof t!="object"?!1:typeof t.nodeType<"u",Se=t=>P(t)?t:typeof t=="string"&&t.length>0?document.querySelector(t):null,rt=t=>{if(!P(t)||t.getClientRects().length===0)return!1;const e=getComputedStyle(t).getPropertyValue("visibility")==="visible",i=t.closest("details:not([open])");if(!i)return e;if(i!==t){const s=t.closest("summary");if(s&&s.parentNode!==i||s===null)return!1}return e},at=t=>!t||t.nodeType!==Node.ELEMENT_NODE||t.classList.contains("disabled")?!0:typeof t.disabled<"u"?t.disabled:t.hasAttribute("disabled")&&t.getAttribute("disabled")!=="false",Ie=t=>{typeof t=="function"&&t()},lt=(t,e,i=!0)=>{if(!i){Ie(t);return}const n=nt(e)+5;let o=!1;const a=({target:r})=>{r===e&&(o=!0,e.removeEventListener(re,a),Ie(t))};e.addEventListener(re,a),setTimeout(()=>{o||ot(e)},n)},ct=/[^.]*(?=\..*)\.|.*/,dt=/\..*/,ut=/::\d+$/,ee={};let ze=1;const Ne={mouseenter:"mouseover",mouseleave:"mouseout"},pt=new Set(["click","dblclick","mouseup","mousedown","contextmenu","mousewheel","DOMMouseScroll","mouseover","mouseout","mousemove","selectstart","selectend","keydown","keypress","keyup","orientationchange","touchstart","touchmove","touchend","touchcancel","pointerdown","pointermove","pointerup","pointerleave","pointercancel","gesturestart","gesturechange","gestureend","focus","blur","change","reset","select","submit","focusin","focusout","load","unload","beforeunload","resize","move","DOMContentLoaded","readystatechange","error","abort","scroll"]);function Pe(t,e){return e&&`${e}::${ze++}`||t.uidEvent||ze++}function ke(t){const e=Pe(t);return t.uidEvent=e,ee[e]=ee[e]||{},ee[e]}function ft(t,e){return function i(s){return pe(s,{delegateTarget:t}),i.oneOff&&x.off(t,s.type,e),e.apply(t,[s])}}function ht(t,e,i){return function s(n){const o=t.querySelectorAll(e);for(let{target:a}=n;a&&a!==this;a=a.parentNode)for(const r of o)if(r===a)return pe(n,{delegateTarget:a}),s.oneOff&&x.off(t,n.type,e,i),i.apply(a,[n])}}function De(t,e,i=null){return Object.values(t).find(s=>s.callable===e&&s.delegationSelector===i)}function Me(t,e,i){const s=typeof e=="string",n=s?i:e||i;let o=vt(t);return pt.has(o)||(o=t),[s,n,o]}function _e(t,e,i,s,n){if(typeof e!="string"||!t)return;let[o,a,r]=Me(e,i,s);e in Ne&&(a=(C=>function(b){if(!b.relatedTarget||b.relatedTarget!==b.delegateTarget&&!b.delegateTarget.contains(b.relatedTarget))return C.call(this,b)})(a));const l=ke(t),d=l[r]||(l[r]={}),p=De(d,a,o?i:null);if(p){p.oneOff=p.oneOff&&n;return}const h=Pe(a,e.replace(ct,"")),c=o?ht(t,i,a):ft(t,a);c.delegationSelector=o?i:null,c.callable=a,c.oneOff=n,c.uidEvent=h,d[h]=c,t.addEventListener(r,c,o)}function ae(t,e,i,s,n){const o=De(e[i],s,n);o&&(t.removeEventListener(i,o,!!n),delete e[i][o.uidEvent])}function gt(t,e,i,s){const n=e[i]||{};for(const o of Object.keys(n))if(o.includes(s)){const a=n[o];ae(t,e,i,a.callable,a.delegationSelector)}}function vt(t){return t=t.replace(dt,""),Ne[t]||t}const x={on(t,e,i,s){_e(t,e,i,s,!1)},one(t,e,i,s){_e(t,e,i,s,!0)},off(t,e,i,s){if(typeof e!="string"||!t)return;const[n,o,a]=Me(e,i,s),r=a!==e,l=ke(t),d=l[a]||{},p=e.startsWith(".");if(typeof o<"u"){if(!Object.keys(d).length)return;ae(t,l,a,o,n?i:null);return}if(p)for(const h of Object.keys(l))gt(t,l,h,e.slice(1));for(const h of Object.keys(d)){const c=h.replace(ut,"");if(!r||e.includes(c)){const f=d[h];ae(t,l,a,f.callable,f.delegationSelector)}}},trigger(t,e,i){if(typeof e!="string"||!t)return null;let s=!0,n=new Event(e,{bubbles:s,cancelable:!0});return n=pe(n,i),t.dispatchEvent(n),n}};function pe(t,e){for(const[i,s]of Object.entries(e||{}))try{t[i]=s}catch{Object.defineProperty(t,i,{configurable:!0,get(){return s}})}return t}function Ae(t){if(t==="true")return!0;if(t==="false")return!1;if(t===Number(t).toString())return Number(t);if(t===""||t==="null")return null;if(typeof t!="string")return t;try{return JSON.parse(decodeURIComponent(t))}catch{return t}}function te(t){return t.replace(/[A-Z]/g,e=>`-${e.toLowerCase()}`)}const le={setDataAttribute(t,e,i){t.setAttribute(`data-bs-${te(e)}`,i)},removeDataAttribute(t,e){t.removeAttribute(`data-bs-${te(e)}`)},getDataAttributes(t){if(!t)return{};const e={},i=Object.keys(t.dataset).filter(s=>s.startsWith("bs")&&!s.startsWith("bsConfig"));for(const s of i){let n=s.replace(/^bs/,"");n=n.charAt(0).toLowerCase()+n.slice(1,n.length),e[n]=Ae(t.dataset[s])}return e},getDataAttribute(t,e){return Ae(t.getAttribute(`data-bs-${te(e)}`))}};class mt{static get Default(){return{}}static get DefaultType(){return{}}static get NAME(){throw new Error('You have to implement the static method "NAME", for each component!')}_getConfig(e){return e=this._mergeConfigObj(e),e=this._configAfterMerge(e),this._typeCheckConfig(e),e}_configAfterMerge(e){return e}_mergeConfigObj(e,i){const s=P(i)?le.getDataAttribute(i,"config"):{};return{...this.constructor.Default,...typeof s=="object"?s:{},...P(i)?le.getDataAttributes(i):{},...typeof e=="object"?e:{}}}_typeCheckConfig(e,i=this.constructor.DefaultType){for(const s of Object.keys(i)){const n=i[s],o=e[s],a=P(o)?"element":tt(o);if(!new RegExp(n).test(a))throw new TypeError(`${this.constructor.NAME.toUpperCase()}: Option "${s}" provided type "${a}" but expected type "${n}".`)}}}const bt="5.2.3";class yt extends mt{constructor(e,i){super(),e=Se(e),e&&(this._element=e,this._config=this._getConfig(i),Q.set(this._element,this.constructor.DATA_KEY,this))}dispose(){Q.remove(this._element,this.constructor.DATA_KEY),x.off(this._element,this.constructor.EVENT_KEY);for(const e of Object.getOwnPropertyNames(this))this[e]=null}_queueCallback(e,i,s=!0){lt(e,i,s)}_getConfig(e){return e=this._mergeConfigObj(e,this._element),e=this._configAfterMerge(e),this._typeCheckConfig(e),e}static getInstance(e){return Q.get(Se(e),this.DATA_KEY)}static getOrCreateInstance(e,i={}){return this.getInstance(e)||new this(e,typeof i=="object"?i:null)}static get VERSION(){return bt}static get DATA_KEY(){return`bs.${this.NAME}`}static get EVENT_KEY(){return`.${this.DATA_KEY}`}static eventName(e){return`${e}${this.EVENT_KEY}`}}const F={find(t,e=document.documentElement){return[].concat(...Element.prototype.querySelectorAll.call(e,t))},findOne(t,e=document.documentElement){return Element.prototype.querySelector.call(e,t)},children(t,e){return[].concat(...t.children).filter(i=>i.matches(e))},parents(t,e){const i=[];let s=t.parentNode.closest(e);for(;s;)i.push(s),s=s.parentNode.closest(e);return i},prev(t,e){let i=t.previousElementSibling;for(;i;){if(i.matches(e))return[i];i=i.previousElementSibling}return[]},next(t,e){let i=t.nextElementSibling;for(;i;){if(i.matches(e))return[i];i=i.nextElementSibling}return[]},focusableChildren(t){const e=["a","button","input","textarea","select","details","[tabindex]",'[contenteditable="true"]'].map(i=>`${i}:not([tabindex^="-"])`).join(",");return this.find(e,t).filter(i=>!at(i)&&rt(i))}},wt="(max-width: 991px)",xe=()=>{if(typeof window<"u")return window.matchMedia(wt).matches},y=[];for(let t=0;t<256;++t)y.push((t+256).toString(16).slice(1));function Et(t,e=0){return(y[t[e+0]]+y[t[e+1]]+y[t[e+2]]+y[t[e+3]]+"-"+y[t[e+4]]+y[t[e+5]]+"-"+y[t[e+6]]+y[t[e+7]]+"-"+y[t[e+8]]+y[t[e+9]]+"-"+y[t[e+10]]+y[t[e+11]]+y[t[e+12]]+y[t[e+13]]+y[t[e+14]]+y[t[e+15]]).toLowerCase()}const Ct=new Uint8Array(16);function $t(){return crypto.getRandomValues(Ct)}function St(t,e,i){return crypto.randomUUID?crypto.randomUUID():It(t)}function It(t,e,i){var n;t=t||{};const s=t.random??((n=t.rng)==null?void 0:n.call(t))??$t();if(s.length<16)throw new Error("Random bytes length must be >= 16");return s[6]=s[6]&15|64,s[8]=s[8]&63|128,Et(s)}let ie=!1,k=[];class zt{constructor(e,i){this.id=e,this._callback=i}dispose(){_t(this.id)}_execute(e){this._callback(e)}}const _t=t=>{k=k.filter(e=>e.id!==t)},je=t=>{if(!(typeof document>"u")){if(k.length||typeof window<"u"&&typeof document<"u"&&document.addEventListener("scroll",e=>{ie||(window.requestAnimationFrame(()=>{k.forEach(i=>i.cb._execute(e)),ie=!1}),ie=!0)}),typeof t=="function"){const e=new zt(St(),t);return k.push({id:e.id,cb:e}),e}return console.error("[onDocumentScroll] the provided data has to be of type function"),null}},At="sticky",xt="bs.sticky",fe=`.${xt}`,Le=`resize${fe}`,Lt=`on${fe}`,Tt=`off${fe}`,Ot="bs-it-sticky-wrapper",Te="bs-is-sticky",Oe="bs-is-fixed",Nt="data-bs-target-mobile",qe='[data-bs-toggle="sticky"]',Pt={positionType:"sticky",stickyClassName:"",stackable:!1,paddingTop:0};class j extends yt{constructor(e,i){super(e),this._config=this._getConfig(i),this._isSticky=!1,this._wrapper=null,this._stickyTarget=F.findOne(st(this._element),this._element)||this._element,this._stickyTargetMobile=F.findOne(this._element.getAttribute(Nt),this._element)||this._stickyTarget,this._stickyLimit=0,this._stickyLimitMobile=0,this._setLimit(),this._scrollCb=null,this._isMobile=xe(),this._prevTop=0,this._onScroll(),this._bindEvents()}dispose(){typeof window<"u"&&typeof document<"u"&&(x.off(window,Le),this._scrollCb.dispose(),super.dispose())}static get NAME(){return At}_getConfig(e){return e={...Pt,...le.getDataAttributes(this._element),...typeof e=="object"?e:{}},e}_bindEvents(){typeof window<"u"&&typeof document<"u"&&(x.on(window,Le,()=>this._onResize()),this._scrollCb=je(()=>this._onScroll()))}_onResize(){this._isMobile=xe(),this._setLimit()}_onScroll(){this._checkSticky()}_setLimit(){this._stickyLimit=this._cumulativeOffset(this._stickyTarget).top,this._stickyLimitMobile=this._cumulativeOffset(this._stickyTargetMobile).top}_getLimit(){let e=this._isMobile?this._stickyLimitMobile:this._stickyLimit;return this._config.stackable&&this._getStickySimblings().forEach((i,s)=>{const n=i.getBoundingClientRect();e-=n.height+(s===0?parseFloat(i.style.top):0)}),e>0?e:0}_cumulativeOffset(e){let i=0,s=0;do i+=e.offsetTop||0,s+=e.offsetLeft||0,e=e.offsetParent;while(e);return{top:i,left:s}}_isTypeSticky(){return this._config.positionType==="sticky"}_checkSticky(){this._isSticky||this._setLimit();const e=this._getLimit();typeof window<"u"&&window.pageYOffset>e?this._setSticky():this._unsetSticky()}_setSticky(){if(!this._isSticky){this._isSticky=!0;let e=Te;this._isTypeSticky()||(e=Oe,this._wrapper=this._createWrapper()),this._element.classList.add(e),this._config.stickyClassName&&this._element.classList.add(this._config.stickyClassName),this._prevTop=this._element.style.top,this._element.style.top=this._getPositionTop()+"px",x.trigger(this._element,Lt)}}_unsetSticky(){if(this._isSticky){let e=Te;this._isTypeSticky()||(e=Oe,this._destroyWrapper()),this._element.classList.remove(e),this._config.stickyClassName&&this._element.classList.remove(this._config.stickyClassName),this._element.style.top=this._prevTop,this._isSticky=!1,x.trigger(this._element,Tt)}}_createWrapper(){if(typeof document>"u")return;const e=document.createElement("div");return e.classList.add(Ot),e.style.width="100%",e.style.height=this._element.getBoundingClientRect().height+"px",e.style.overflow="hidden",this._element.parentNode.insertBefore(e,this._element),e.appendChild(this._element),e}_destroyWrapper(){this._wrapper&&(this._wrapper.parentNode.insertBefore(this._element,this._wrapper),this._wrapper.remove())}_getStickySimblings(){return F.find(qe).filter(i=>{const s=j.getInstance(i);return!!(s&&s._isSticky&&i!==this._element)})}_getPositionTop(){let e=0;return this._config.stackable?(this._getStickySimblings().forEach((i,s)=>{const n=i.getBoundingClientRect();e+=n.height+(s===0?parseFloat(i.style.top):0)}),e):e+this._config.paddingTop}}typeof window<"u"&&typeof document<"u"&&je(()=>{F.find(qe).map(e=>{j.getOrCreateInstance(e)})});const kt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/1":"Iscrizione scuola/università e/o richiesta borsa di studio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/2":"Invalidità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/3":"Ricerca di lavoro, avvio nuovo lavoro, disoccupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/4":"Pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/5":"Richiesta o rinnovo patente","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/6":"Registrazione/possesso veicolo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/7":"Accesso al trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/8":"Compravendita/affitto casa/edifici/terreni, costruzione o ristrutturazione casa/edificio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/9":"Cambio di residenza/domicilio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/10":"Espatrio per lavoro, studio, pensionamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/11":"Richiesta passaporto, visto e assistenza viaggi internazionali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/12":"Nascita di un bambino, richiesta adozioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/13":"Matrimonio e/o cambio stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/14":"Morte ed eredità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/15":"Prenotazione e disdetta visite/esami","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/16":"Denuncia crimini","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/17":"Dichiarazione dei redditi, versamento e riscossione tributi/imposte e contributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/18":"Accesso luoghi della cultura","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/life-business-event/life-event/19":"Possesso, cura, smarrimento animale da compagnia"},he=[{id:"ACI",name:"ACI - Automobile Club d'Italia",url:"./enti/ACI.jsonld"},{id:"AdE",name:"Agenzia delle Entrate",url:"./enti/AdE.jsonld"},{id:"ANPR",name:"ANPR - Anagrafe Nazionale della Popolazione Residente",url:"./enti/ANPR.jsonld"},{id:"GSE",name:"GSE - Gestore Servizi Energetici",url:"./enti/GSE.jsonld"},{id:"INAIL",name:"INAIL - Istituto Nazionale per l'Assicurazione contro gli Infortuni sul Lavoro",url:"./enti/INAIL.jsonld"},{id:"INPS",name:"INPS - Istituto Nazionale Previdenza Sociale",url:"./enti/INPS.jsonld"},{id:"IPZS",name:"Istituto Poligrafico e Zecca dello Stato",url:"./enti/IPZS.jsonld"},{id:"MLPS",name:"Ministero del Lavoro e delle Politiche Sociali",url:"./enti/MLPS.jsonld"},{id:"MIM",name:"Ministero dell'Istruzione e del Merito",url:"./enti/MIM.jsonld"},{id:"MIT",name:"Motorizzazione Civile - Portale dell'Automobilista",url:"./enti/MIT.jsonld"}],Dt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/1":"Istruzione e formazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/2":"Salute","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/3":"Lavoro e occupazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/4":"Previdenza e assistenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/5":"Mobilità e trasporti","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/6":"Veicoli e motorizzazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/7":"Trasporto pubblico","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/8":"Casa e territorio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/9":"Anagrafe e residenza","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/10":"Estero e mobilità internazionale","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/11":"Documenti di viaggio","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/12":"Famiglia e nascite","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/13":"Stato civile","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/14":"Successioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/15":"Sanità e prestazioni","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/16":"Sicurezza e denunce","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/17":"Fisco e tributi","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/18":"Cultura e turismo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/19":"Animali","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/public-services-subject-matters/20":"Altro"},Mt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/IDDEC":"Attestazione di identità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/REQ":"Istanza/richiesta","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/ADMINDOC":"Documentazione amministrativa","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CERT":"Certificazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/PAYMENTDEC":"Attestazione di pagamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/AUTHACT":"Atto autorizzativo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CODE":"Codice","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/OTHDOC":"Altra documentazione"},jt={"https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CERT":"Certificazione","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/AUTHACT":"Atto autorizzativo","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/ADMINDOC":"Documentazione amministrativa","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/PAYMENTDEC":"Attestazione di pagamento","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/CODE":"Codice","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/IDDEC":"Attestazione di identità","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/REQ":"Istanza/richiesta","https://w3id.org/italia/controlled-vocabulary/classifications-for-public-services/service-input-output/OTHDOC":"Altra documentazione"},qt={"https://w3id.org/italia/onto/CPV/taxCode":"Codice fiscale"};function g(t){if(t==null)return null;if(typeof t=="string")return t.trim()||null;if(Array.isArray(t)){for(const e of t){const i=g(e);if(i)return i}return null}if(typeof t=="object"){if(typeof t["@value"]=="string")return t["@value"].trim()||null;if(typeof t.value=="string")return t.value.trim()||null}return null}function ge(t){return t==null?[]:Array.isArray(t)?t:[t]}function Ut(t){return t==null?null:typeof t=="string"?t:typeof t=="object"&&t["@id"]?String(t["@id"]):null}function D(t,e){const i=t==null?void 0:t["@type"];return ge(i).map(String).some(n=>n===e||n.endsWith(e)||n.includes(e))}function K(t,e=180){if(!t)return"";const i=t.replace(/\s+/g," ").trim();return i.length<=e?i:`${i.slice(0,e-1).trim()}…`}function u(t){return String(t).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}const Rt=/\s*(?:leggi\s+(?:di\s+pi[uù]|meno)|mostra\s+(?:di\s+pi[uù]|meno)|read\s+more|show\s+more|nascondi)\s*/gi,Ht=/((?:[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,}(?:\s+|,\s*))+[A-ZÀÈÉÌÒÙ][A-ZÀÈÉÌÒÙ0-9'’\-\/]{1,})/g;function $(t){if(!t)return null;let e=String(t);return e=e.replace(/<script[\s\S]*?<\/script>/gi," "),e=e.replace(/<style[\s\S]*?<\/style>/gi," "),e=e.replace(/<[^>]+>/g," "),e=e.replace(/&nbsp;/gi," "),e=e.replace(/&amp;/gi,"&"),e=e.replace(Rt," "),e=e.replace(/\r\n/g,`
`),e=e.split(/\n{2,}/).map(i=>i.replace(/[^\S\n]+/g," ").replace(/\n/g," ").trim()).filter(Boolean).join(`

`),e||null}function Bt(t){const e=$(t);if(!e)return[];if(e.includes(`

`)){const r=[];for(const l of e.split(`

`)){const d=l.trim();if(d)if(Kt(d))r.push({heading:d.replace(/\s+/g," ").trim(),text:""});else{const p=r[r.length-1];p&&p.heading&&!p.text?p.text=d:r.push({heading:null,text:d})}}return r.filter(l=>l.heading||l.text)}const i=[...e.matchAll(Ht)];if(!i.length)return[{heading:null,text:e}];const s=i.map(r=>({index:r.index,title:r[1].replace(/\s+/g," ").trim()})).filter(r=>r.title.length>=10&&r.title.split(/\s+/).length>=2);if(!s.length)return[{heading:null,text:e}];const n=[];for(const r of s){const l=n[n.length-1];l&&r.index<l.index+l.title.length||n.push(r)}const o=[],a=n[0];if(a.index>0){const r=e.slice(0,a.index).trim();r&&o.push({heading:null,text:r})}for(let r=0;r<n.length;r++){const l=n[r].index+n[r].title.length,d=r+1<n.length?n[r+1].index:e.length,p=e.slice(l,d).trim();o.push({heading:n[r].title,text:p})}return o.filter(r=>r.heading||r.text)}const Vt=/<(p|ul|ol|li|strong|b|em|i|a|br)\b/i,Ft=new Set(["p","ul","ol","li","strong","b","em","i","a","br"]);function Wt(t){if(!t||!Vt.test(t)||typeof DOMParser>"u")return null;const i=new DOMParser().parseFromString(`<div id="rich-root">${t}</div>`,"text/html").getElementById("rich-root");return i&&N(i).innerHTML.trim()||null}function N(t){const e=t.ownerDocument,i=e.createElement("div");for(const s of[...t.childNodes]){if(s.nodeType===Node.TEXT_NODE){i.appendChild(e.createTextNode(s.textContent));continue}if(s.nodeType!==Node.ELEMENT_NODE)continue;const n=s.tagName.toLowerCase();if(!Ft.has(n)){const r=N(s);for(;r.firstChild;)i.appendChild(r.firstChild);continue}if(n==="a"){const r=s.getAttribute("href")||"";if(!/^https?:\/\//i.test(r)){const p=N(s);for(;p.firstChild;)i.appendChild(p.firstChild);continue}const l=e.createElement("a");l.setAttribute("href",r),l.setAttribute("rel","noopener noreferrer");const d=N(s);for(;d.firstChild;)l.appendChild(d.firstChild);l.textContent.trim()&&i.appendChild(l);continue}const o=e.createElement(n),a=N(s);for(;a.firstChild;)o.appendChild(a.firstChild);(n==="br"||o.textContent.trim())&&i.appendChild(o)}return i}function G(t){const e=Wt(t);if(e)return e;const i=Bt(t);return i.length?i.map(s=>{const n=[];return s.heading&&n.push(`<h3 class="h5 mt-3 mb-2">${u(Gt(s.heading))}</h3>`),s.text&&n.push(`<p class="mb-2">${u(s.text)}</p>`),n.join("")}).join(""):""}function Kt(t){const e=t.replace(/\s+/g," ").trim();return e.length<5||e.length>80||!/[A-ZÀÈÉÌÒÙ]/.test(e)||e!==e.toLocaleUpperCase("it")||e.split(/\s+/).length>8?!1:/^[A-ZÀÈÉÌÒÙ0-9][A-ZÀÈÉÌÒÙ0-9'’\-\/\s,;:]+$/.test(e)}function Gt(t){return t.toLocaleLowerCase("it").replace(/(^|[\s,/])(\S)/g,(i,s,n)=>s+n.toLocaleUpperCase("it"))}const Ue="./cpsv_full.jsonld";function ce(t=window.location.hash){const e=(t||"").replace(/^#/,"");let i=null,s="/";if(e.startsWith("catalog=")){const d=e.indexOf("&"),p=d===-1?e.slice(8):e.slice(8,d);i=decodeURIComponent(p),s=d===-1?"/":e.slice(d+1)||"/"}else e&&(s=e.startsWith("/")?e:`/${e}`);const{path:n,query:o}=Zt(s),a=n.startsWith("/")?n:`/${n}`;let r="list",l=null;if(a==="/cpsv")r="cpsv";else if(a==="/jsonld")r="jsonld";else{const d=a.match(/^\/servizio\/(.+)$/);d&&(r="detail",l=decodeURIComponent(d[1]))}return{catalog:i,path:a,view:r,serviceId:l,filters:Xt(o)}}function w({catalog:t,path:e="/",filters:i}={}){const s=e.startsWith("/")?e:`/${e}`,n=Qt(i);return t?`#catalog=${encodeURIComponent(t)}&${s}${n}`:`#${s}${n}`}function Yt(t,{replace:e=!1}={}){const i=w(t);Jt(ce(window.location.hash||"#"),ce(i))||(e?history.replaceState(null,"",i):history.pushState(null,"",i))}function Jt(t,e){return t.catalog===e.catalog&&t.path===e.path&&t.view===e.view&&t.serviceId===e.serviceId&&t.filters.q===e.filters.q&&t.filters.org===e.filters.org&&t.filters.lifeEvent===e.filters.lifeEvent&&t.filters.theme===e.filters.theme&&t.filters.page===e.filters.page}function Zt(t){const e=t.indexOf("?");return e===-1?{path:t||"/",query:""}:{path:t.slice(0,e)||"/",query:t.slice(e+1)}}function Xt(t){const e=new URLSearchParams(t||""),i=Number(e.get("p")||"1"),s=Number.isFinite(i)&&i>1?Math.floor(i):1;return{q:e.get("q")||"",org:e.get("ente")||"",lifeEvent:e.get("evento")||"",theme:e.get("tema")||"",page:s}}function Qt(t){if(!t)return"";const e=new URLSearchParams;t.q&&e.set("q",String(t.q)),t.org&&e.set("ente",String(t.org)),t.lifeEvent&&e.set("evento",String(t.lifeEvent)),t.theme&&e.set("tema",String(t.theme));const i=Number(t.page||1);Number.isFinite(i)&&i>1&&e.set("p",String(Math.floor(i)));const s=e.toString();return s?`?${s}`:""}function Re(t){return!t||!String(t).trim()?Ue:String(t).trim()}async function ei(t){const e=Re(t);let i;try{i=await fetch(e,{credentials:"same-origin"})}catch(n){const o=new Error(`Impossibile scaricare il catalogo (${e}). Verifica URL, CORS o rete.`);throw o.cause=n,o.code="NETWORK",o}if(!i.ok){const n=new Error(`Catalogo non disponibile (HTTP ${i.status}): ${e}`);throw n.code="HTTP",n}let s;try{s=await i.json()}catch(n){const o=new Error(`Il file non è un JSON valido: ${e}`);throw o.cause=n,o.code="JSON",o}if(!s||typeof s!="object"||!Array.isArray(s["@graph"])){const n=new Error("JSON-LD senza @graph: file non utilizzabile come catalogo CPSV.");throw n.code="SHAPE",n}return{doc:s,url:e}}function S(t){return ge(t).map(Ut).filter(Boolean)}function B(t,e){var s,n,o,a;const i=[];for(const r of t){const l=e.get(r);if(!l)continue;const d=$(g(l["dct:title"])||g(l["skos:prefLabel"])),p=g(l["dct:description"])||g(l["rdfs:comment"]),c=$(p)||d||"",f=typeof l["dct:type"]=="string"&&l["dct:type"]||((s=l["dct:type"])==null?void 0:s["@id"])||null,C=f?((n=ni())==null?void 0:n[f])||String(f).split(/[#/]/).pop():null,b=typeof l["cv:supportsConcept"]=="string"&&l["cv:supportsConcept"]||((o=l["cv:supportsConcept"])==null?void 0:o["@id"])||null,O=b?((a=ri())==null?void 0:a[b])||String(b).split(/[#/]/).pop():null,_=ti(l["cv:value"]);(c||C||O||_)&&i.push({id:r,title:d,text:c,html:p||"",typeId:f,typeLabel:C,conceptId:b,conceptLabel:O,duration:_,durationLabel:_?ii(_):null})}return i}function ti(t){return t==null?null:typeof t=="string"?t:typeof t=="object"&&t["@value"]!=null?String(t["@value"]):null}function ii(t){const e=String(t||"").trim().toUpperCase();if(!e)return null;if(e==="PT0S"||e==="P0D"||e==="PT0H")return"Immediato";const i=e.match(/^P(\d+)W$/);if(i){const a=Number(i[1]);return a===1?"1 settimana":`${a} settimane`}const s=e.match(/^P(\d+)M$/);if(s){const a=Number(s[1]);return a===1?"1 mese":`${a} mesi`}const n=e.match(/^P(\d+)D$/);if(n){const a=Number(n[1]);return a===1?"1 giorno":`${a} giorni`}const o=e.match(/^PT(\d+)H$/);if(o){const a=Number(o[1]);return a===1?"1 ora":`${a} ore`}return e}function He(t){if(t==null||t==="")return null;if(typeof t=="number")return t;if(typeof t=="string"){const e=Number(t.replace(",","."));return Number.isNaN(e)?null:e}return typeof t=="object"&&t["@value"]!=null?He(t["@value"]):null}let Be=null;function si(t){Be=t}function ni(){return Be||{}}let Ve=null;function oi(t){Ve=t}function ri(){return Ve||{}}function ai(t,e){const i=$(g(t["aci:costDescription"])),s=t["cpsv:hasCost"];if(s==null&&!i)return null;const n=typeof s=="string"&&s.startsWith("http")?s:(s==null?void 0:s["@id"])||null,o=n?e.get(n):null;if(o){const r=$(g(o["dct:description"])||g(o["dct:title"])),l=He(o["cv:value"]),d=typeof o["cv:currency"]=="string"&&o["cv:currency"]||g(o["cv:currency"])||(l!=null?"EUR":null);return l==null&&!r&&!i?null:{text:r||i||"",amount:l,currency:d,structured:l!=null}}const a=i||$(g(s))||"";return a?{text:a,amount:null,currency:null,structured:!1}:null}function li(t,e){var r;let i=null;const s=t["foaf:page"];if(typeof s=="string"&&s.startsWith("http")?i=s:(r=s==null?void 0:s["@id"])!=null&&r.startsWith("http")&&(i=s["@id"]),!i)for(const l of S(t["cpsv:hasWebSiteChannel"])){const d=e.get(l),p=d==null?void 0:d["foaf:page"];if(typeof p=="string"&&p.startsWith("http")){i=p;break}}!i&&typeof t["@id"]=="string"&&t["@id"].startsWith("http")&&(i=t["@id"].split("#")[0]);const n=[],o=new Set,a=l=>{if(!l||!l.startsWith("http"))return;const d=l.split("#")[0];i&&d.replace(/\/$/,"")===i.replace(/\/$/,"")||o.has(d)||(o.add(d),n.push(l))};for(const l of["cpsv:hasOtherElectronicChannel","cpsv:hasChannel"])for(const d of S(t[l])){const p=e.get(d);if(!p){d.startsWith("http")&&!d.includes("#")&&a(d);continue}const h=p["foaf:page"];typeof h=="string"?a(h):h!=null&&h["@id"]&&a(h["@id"])}return{sheetUrl:i,applicationUrls:n}}function ci(t,e){const i=t["@graph"]||[],s=new Map;for(const c of i)c&&c["@id"]&&s.set(String(c["@id"]),c);const n=new Map;for(const c of i)c&&(D(c,"PublicOrganisation")||D(c,"cv:PublicOrganisation"))&&n.set(c["@id"],{id:c["@id"],title:g(c["dct:title"])||c["@id"],homepage:typeof c["foaf:homepage"]=="string"?c["foaf:homepage"]:null});const o=[];for(const c of i){if(!c||!D(c,"PublicService"))continue;const C=S(c["cv:hasCompetentAuthority"]||c["cpsv:producedBy"])[0]||null,b=C?n.get(C):null,O=S(c["cpsv:isPartOfEvent"]),_=S(c["cpsv:hasTheme"]),Ge=S(c["cpsv:hasInput"]),me=B(Ge,s),Ye=S(c["cpsv:hasProcessingTime"]),Z=B(Ye,s),X=g(c["aci:processingTime"]);X&&Z.push({id:`${c["@id"]}#aci-time`,text:X,html:X,typeId:null,typeLabel:null,duration:null,durationLabel:null});const Je=S(c["cpsv:hasOutput"]),be=B(Je,s),ye=S(c["cv:addressee"]),U=B(ye,s);if(!U.length)for(const E of ye){const L=s.get(E),$e=g(L==null?void 0:L["dct:title"])||g(L==null?void 0:L["skos:prefLabel"]);$e?U.push({id:E,text:$e}):E.includes("#addressee-")&&U.push({id:E,text:decodeURIComponent(E.split("#addressee-").pop())})}const we=ai(c,s),{sheetUrl:R,applicationUrls:H}=li(c,s),Ze=[R,...H].filter(Boolean),Xe=$(g(c["dct:title"])||g(c["cpsv:name"]))||"Servizio",Ee=g(c["dct:description"]),Ce=$(Ee),Qe=$(g(c["dct:abstract"]))||Ce;o.push({id:c["@id"],title:Xe,description:Ce,descriptionHtml:Ee,abstract:Qe,orgId:C,orgTitle:(b==null?void 0:b.title)||null,lifeEventIds:O,themeIds:_,lifeEventLabels:O.map(E=>e.lifeEvents[E]||E.split("/").pop()),themeLabels:_.map(E=>e.themes[E]||`Tema ${E.split("/").pop()}`),addressees:U,inputs:me,outputs:be,processingTimes:Z,cost:we,sheetUrl:R,applicationUrls:H,onlineUrls:Ze,hasOnlineChannel:H.length>0,pageUrl:R||c["@id"],flags:{hasInput:me.length>0,hasOutput:be.length>0,hasTime:Z.length>0,hasCost:!!we,hasOnline:H.length>0,hasSheet:!!R}})}o.sort((c,f)=>c.title.localeCompare(f.title,"it"));const a=[...n.values()].sort((c,f)=>c.title.localeCompare(f.title,"it")),r=new Map,l=new Map;for(const c of o){for(const f of c.lifeEventIds)r.set(f,(r.get(f)||0)+1);for(const f of c.themeIds)l.set(f,(l.get(f)||0)+1)}const d=[...r.entries()].map(([c,f])=>({id:c,label:e.lifeEvents[c]||c.split("/").pop(),count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),p=[...l.entries()].map(([c,f])=>({id:c,label:e.themes[c]||`Tema ${c.split("/").pop()}`,count:f})).sort((c,f)=>c.label.localeCompare(f.label,"it")),h=ge(t["cpsv-portalone:sourceCatalogs"]).map(c=>({id:c==null?void 0:c["@id"],title:g(c==null?void 0:c["dct:title"])||(c==null?void 0:c["@id"])}));return{services:o,orgsById:n,nodesById:s,facets:{orgs:a,lifeEvents:d,themes:p},meta:{title:"Catalogo dei servizi della PA",modified:t["dct:modified"]||null,sources:h,count:o.length}}}function Fe(t){const e=Array.isArray(t==null?void 0:t["@graph"])?t["@graph"]:[],i=new Map;for(const o of e)o!=null&&o["@id"]&&i.set(String(o["@id"]),o);const s=o=>{const a=[],r=l=>{if(!(!l||typeof l!="object")){if(Array.isArray(l)){l.forEach(r);return}typeof l["@id"]=="string"&&a.push(l["@id"]);for(const[d,p]of Object.entries(l))d==="@id"||d==="@context"||r(p)}};for(const[l,d]of Object.entries(o))l==="@id"||l==="@context"||r(d);return a},n=[];for(const o of e){if(!o||!D(o,"PublicService"))continue;const a=[],r=new Set,l=[o];for(;l.length;){const p=l.pop(),h=p!=null&&p["@id"]?String(p["@id"]):null;if(!(h&&r.has(h))){h&&r.add(h),a.push(p);for(const c of s(p)){if(r.has(c))continue;const f=i.get(c);!f||f!==o&&D(f,"PublicService")||l.push(f)}}}const d=$(g(o["dct:title"])||g(o["cpsv:name"]))||o["@id"]||"Servizio";n.push({id:o["@id"]||d,title:d,json:JSON.stringify({"@context":t["@context"],"@graph":a},null,2)})}return n.sort((o,a)=>o.title.localeCompare(a.title,"it")),n}function di(t,e){const i=(e.q||"").trim().toLocaleLowerCase("it");return t.filter(s=>!(e.org&&s.orgId!==e.org||e.lifeEvent&&!s.lifeEventIds.includes(e.lifeEvent)||e.theme&&!s.themeIds.includes(e.theme)||e.onlineOnly&&!s.flags.hasOnline||i&&!`${s.title} ${s.abstract||""} ${s.orgTitle||""}`.toLocaleLowerCase("it").includes(i)))}const de=24,se="Catalogo dei servizi della PA",ui="Trova e consulta i servizi digitali della Pubblica Amministrazione";function pi({catalogUrl:t,meta:e,error:i,detail:s=null,filters:n=null,view:o="list"}){const a=u(w({catalog:Y(t),path:"/",filters:n})),r=u(w({catalog:Y(t),path:"/cpsv",filters:n})),l=e?`${e.count} serviz${e.count===1?"io":"i"} disponibili`:"Caricamento…";return`
<a class="visually-hidden-focusable" href="#main">Vai al contenuto</a>
<header class="it-header-wrapper it-header-sticky" data-bs-toggle="sticky" data-bs-position-type="fixed" data-bs-target="#sticky-trigger" data-bs-sticky-class-name="is-sticky">
  <div class="it-nav-wrapper">
    <div class="it-header-center-wrapper">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <div class="it-header-center-content-wrapper">
              <div class="it-brand-wrapper">
                <a href="${a}" aria-label="${u(se)} — torna all’elenco">
                  <div class="it-brand-text">
                    <div class="it-brand-title">${u(se)}</div>
                    <div class="it-brand-tagline d-none d-md-block">${u(ui)}</div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  ${s?fi(s,{homeHref:a,catalogUrl:t}):""}
  <div id="sticky-trigger" class="sticky-trigger" aria-hidden="true"></div>
</header>

<main id="main" class="container my-4 mb-5">
  ${i?`<div class="alert alert-danger" role="alert">
          <h2 class="alert-heading h5">Non è stato possibile caricare il catalogo</h2>
          <p class="mb-0">${u(i)}</p>
        </div>`:""}
  ${mi(t,o,s)}
  ${o==="list"&&!s?`<p class="text-secondary mb-2">${u(l)}</p>
         <p class="mb-4"><a href="${r}">Cos’è CPSV</a></p>`:""}
  <div id="view-root"></div>
</main>

<footer class="it-footer">
  <div class="it-footer-main">
    <div class="container py-4">
      <h2 class="h5 mb-2">${u(se)}</h2>
      <p class="mb-2">
        <a href="${r}"${o==="cpsv"?' aria-current="page"':""}>Cos’è CPSV</a>
      </p>
      <p class="mb-0">
        Le informazioni mostrate derivano dalle schede pubbliche degli enti erogatori.
        Se un dettaglio (tempi, costi, documenti) non compare, non è disponibile nella fonte.
      </p>
    </div>
  </div>
</footer>
`}function fi(t,{homeHref:e,catalogUrl:i=null}){var l;const s=t.sheetUrl||t.pageUrl,n=s?`<a
        class="btn btn-light btn-lg service-sheet-cta"
        href="${u(s)}"
        rel="noopener noreferrer"
        target="_blank"
      >
        Vai al servizio
        ${gi()}
        <span class="visually-hidden">(si apre in un altro sito)</span>
      </a>`:'<p class="small mb-0 service-header-muted">Scheda ufficiale non indicata nel catalogo.</p>',o=hi(i,t.id),a=`
    <div class="d-flex flex-column gap-2 align-items-lg-end">
      ${n}
      <div class="d-flex flex-wrap gap-2 justify-content-lg-end">
        <a class="btn btn-outline-light btn-sm" href="${u(o)}">Modifica in editor</a>
        <button type="button" class="btn btn-outline-light btn-sm" data-download-scheda="${u(t.id)}">
          Scarica scheda JSON-LD
        </button>
      </div>
    </div>`,r=((l=t.lifeEventIds)==null?void 0:l.length)>0?`<div class="service-header-pills mt-3" role="list" aria-label="Momenti della vita">
          ${t.lifeEventIds.map((d,p)=>{var c;const h=((c=t.lifeEventLabels)==null?void 0:c[p])||d;return`<a class="service-header-pill" role="listitem" href="${u(d)}" target="_blank" rel="noopener noreferrer">${u(h)}<span class="visually-hidden"> (scheda vocabolario)</span></a>`}).join("")}
        </div>`:"";return`
<div class="service-header">
  <div class="container py-4">
    <nav class="breadcrumb-container mb-3" aria-label="Sei qui">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a href="${e}">Catalogo</a><span class="separator" aria-hidden="true">/</span></li>
        <li class="breadcrumb-item active" aria-current="page">${u(K(t.title,64))}</li>
      </ol>
    </nav>
    <div class="row align-items-start g-3">
      <div class="col-lg-8">
        <p class="service-header-org mb-1">${u(t.orgTitle||"Ente erogatore")}</p>
        <h1 class="service-header-title mb-0">${u(t.title)}</h1>
        ${r}
      </div>
      <div class="col-lg-4 d-flex justify-content-lg-end align-items-start">
        ${a}
      </div>
    </div>
  </div>
</div>`}function hi(t,e){const i=new URL("../scheda-cpsv.html",window.location.href);if(t){const s=new URL(t,window.location.href).href;i.searchParams.set("catalog",s)}return e&&i.searchParams.set("service",e),i.href}function gi(){return`<svg class="icon icon-sm" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="currentColor" d="M21 3v6h-1V4.7l-7.6 7.7-.8-.8L19.3 4H15V3h6zm-4 16.5c0 .3-.2.5-.5.5h-12c-.3 0-.5-.2-.5-.5v-12c0-.3.2-.5.5-.5H12V6H4.5C3.7 6 3 6.7 3 7.5v12c0 .8.7 1.5 1.5 1.5h12c.8 0 1.5-.7 1.5-1.5V12h-1v7.5z"/>
  </svg>`}function Y(t){return!t||t==="./cpsv_full.jsonld"?null:t}function vi(t){return he.find(e=>e.url===t)||null}function mi(t,e,i){if(e!=="list"||i)return"";const s=vi(t);if(!s)return"";const n=u(w({path:"/"}));return`
<div class="alert alert-info" role="status">
  <p class="mb-0">
    Stai consultando il CPSV di <strong>${u(s.name)}</strong>.
    <a href="${n}">Torna al catalogo completo</a>.
  </p>
</div>`}function bi(t){if(!t)return"Ente";const e=String(t).match(/\b(ACI|INPS|AdE|INAIL|ANPR|MIT|Agenzia delle Entrate|Motorizzazione)\b/i);if(!e)return K(t,36);const i=e[1];return/agenzia delle entrate/i.test(t)?"Agenzia delle Entrate":/motorizzazione/i.test(t)?"Motorizzazione":/anpr/i.test(t)?"ANPR":(i.toUpperCase()===i||i.length<=5,i)}function ne({id:t,name:e,label:i,optionsHtml:s,value:n}){return`
<div class="mb-3">
  <label class="form-label" for="${u(t)}">${u(i)}</label>
  <select class="form-select" id="${u(t)}" name="${u(e)}">
    ${s}
  </select>
</div>`}function yi({index:t,filterState:e}){const{facets:i}=t,s=['<option value="">Tutti gli enti</option>',...i.orgs.map(r=>`<option value="${u(r.id)}" ${e.org===r.id?"selected":""}>${u(r.title)}</option>`)].join(""),n=['<option value="">Tutte le fasi</option>',...i.lifeEvents.map(r=>`<option value="${u(r.id)}" ${e.lifeEvent===r.id?"selected":""}>${u(r.label)}</option>`)].join(""),o=['<option value="">Tutti i temi</option>',...i.themes.map(r=>`<option value="${u(r.id)}" ${e.theme===r.id?"selected":""}>${u(r.label)}</option>`)].join("");return`
${i.lifeEvents.length?`
<section class="mb-4" aria-labelledby="life-events-entry-title">
  <h2 class="h5" id="life-events-entry-title">Parti da un momento della vita</h2>
  <p class="text-secondary small mb-3">
    Scegli l’evento che ti riguarda per vedere i servizi collegati (come nei cataloghi one-stop-shop europei).
  </p>
  <div class="chip-list life-events-entry" role="group" aria-label="Momenti della vita">
    ${i.lifeEvents.map(r=>{const l=e.lifeEvent===r.id,d=r.label.length>48?`${r.label.slice(0,45).trim()}…`:r.label;return`<button
            type="button"
            class="chip chip-simple ${l?"chip-filter-active":""}"
            data-filter-life-event="${u(r.id)}"
            aria-pressed="${l?"true":"false"}"
            title="${u(r.label)}"
          ><span class="chip-label">${u(d)}</span></button>`}).join("")}
  </div>
</section>`:""}
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
        ${ne({id:"filter-org",name:"org",label:"Ente erogatore",optionsHtml:s,value:e.org})}
        ${ne({id:"filter-le",name:"lifeEvent",label:"Momento della vita",optionsHtml:n,value:e.lifeEvent})}
        ${ne({id:"filter-theme",name:"theme",label:"Argomento",optionsHtml:o,value:e.theme})}
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
`}function wi(t,{catalogUrl:e,page:i,filterState:s={}}){const n=Y(e),o=(i-1)*de,a=t.slice(o,o+de);return a.length?a.map(r=>{const l=w({catalog:n,path:`/servizio/${encodeURIComponent(r.id)}`,filters:{...s,page:i}}),d=bi(r.orgTitle),p=r.lifeEventIds[0]||"",h=r.lifeEventLabels[0]?K(r.lifeEventLabels[0],40):null,c=s.org&&s.org===r.orgId,f=s.lifeEvent&&s.lifeEvent===p,C=r.orgId?`<button
            type="button"
            class="chip chip-simple ${c?"chip-filter-active":""}"
            data-filter-org="${u(r.orgId)}"
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
          <a href="${u(l)}">${u(r.title)}</a>
        </h3>
        <p class="card-text mb-4">
          ${u(K(r.abstract||"Descrizione non disponibile per questo servizio.",180))}
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
</div>`}function Ei(t,e,{catalogUrl:i,filterState:s={}}={}){const n=Math.max(1,Math.ceil(t/de));if(n<=1)return"";const o=Y(i),a=[];for(let r=1;r<=n;r++){const l=w({catalog:o,path:"/",filters:{...s,page:r}});a.push(`<li class="page-item ${r===e?"active":""}">
        <a class="page-link" href="${u(l)}" data-page="${r}" ${r===e?'aria-current="page"':""}>${r}</a>
      </li>`)}return`<ul class="pagination justify-content-center">${a.join("")}</ul>`}function Ci(t){var i;const e=[];if(t.addressees.length&&e.push(T("A chi è rivolto",V(t.addressees))),t.inputs.length&&e.push(T("Cosa serve",V(t.inputs))),t.processingTimes.length&&e.push(T("Tempi",V(t.processingTimes))),t.cost&&e.push(T("Costi",$i(t.cost))),t.outputs.length&&e.push(T("Cosa si ottiene",V(t.outputs))),(i=t.themeIds)!=null&&i.length){const s=`<ul class="list-unstyled mb-0">${t.themeIds.map((n,o)=>{var r;const a=((r=t.themeLabels)==null?void 0:r[o])||n;return`<li class="mb-2"><a href="${u(n)}" target="_blank" rel="noopener noreferrer">${u(a)}<span class="visually-hidden"> (scheda vocabolario)</span></a></li>`}).join("")}</ul>`;e.push(T("Temi",s))}return`
${t.description?`<div class="font-serif service-description">${G(t.descriptionHtml||t.description)}</div>`:'<p class="text-secondary">Descrizione non disponibile per questo servizio.</p>'}
<div class="mt-4">
  ${e.join("")||'<p class="text-secondary">Non ci sono altri dettagli disponibili nella scheda pubblica.</p>'}
</div>
`}function T(t,e){return`
<section class="mb-4 pb-3 border-bottom">
  <h2 class="h4">${u(t)}</h2>
  ${e}
</section>`}function V(t){return t.map(e=>{const i=[];return e.conceptId&&e.conceptLabel?i.push(`<p class="mb-1"><strong>Concetto:</strong> <a href="${u(e.conceptId)}" target="_blank" rel="noopener noreferrer">${u(e.conceptLabel)}<span class="visually-hidden"> (schema.gov.it)</span></a></p>`):e.conceptLabel&&i.push(`<p class="mb-1"><strong>Concetto:</strong> ${u(e.conceptLabel)}</p>`),e.typeId&&e.typeLabel?i.push(`<p class="mb-1"><strong>Tipo:</strong> <a href="${u(e.typeId)}" target="_blank" rel="noopener noreferrer">${u(e.typeLabel)}<span class="visually-hidden"> (scheda vocabolario)</span></a></p>`):e.typeLabel&&i.push(`<p class="mb-1"><strong>Tipo:</strong> ${u(e.typeLabel)}</p>`),e.durationLabel&&i.push(`<p class="mb-1"><strong>Durata:</strong> ${u(e.durationLabel)}</p>`),e.text||e.html?i.push(`<div class="service-block-text">${G(e.html||e.text)}</div>`):i.length||i.push('<p class="text-secondary mb-0">Dettaglio non testuale.</p>'),`<div class="mb-3">${i.join("")}</div>`}).join("")}function $i(t){if(!t)return"";if(typeof t=="string")return G(t);const e=[];if(t.amount!=null){const i=t.amount===0?`Gratuito${t.currency?` (${u(t.currency)})`:""}`:`${u(String(t.amount))} ${u(t.currency||"EUR")}`.trim();e.push(`<p class="mb-1"><strong>Importo:</strong> ${i}</p>`)}return t.text&&e.push(`<div class="service-block-text">${G(t.text)}</div>`),e.join("")||'<p class="text-secondary mb-0">Costo indicato senza dettaglio testuale.</p>'}const Si=`{
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
}`;function Ii({homeHref:t,catalogUrl:e}){const i=u(t);return`
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
    ${xi()}
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
    <pre class="cpsv-code"><code>${u(Si)}</code></pre>
    <p>
      Nell’elenco, il filtro Ente segue l’ente competente, Momento della vita segue l’evento
      e Argomento segue il tema. Sono le stesse frecce del grafo, applicate alle schede vere.
    </p>
    <p><a href="${i}">Vai al catalogo</a></p>
  </section>
  ${zi()}
</article>`}function zi(){return`
<section class="mt-5" aria-labelledby="cpsv-enti">
  <div class="cpsv-prose">
    <h2 class="h3" id="cpsv-enti">I cataloghi degli enti</h2>
    <p>
      Il catalogo completo unisce i CPSV di questi enti.
      Aprine uno per leggere il JSON-LD di ogni servizio.
    </p>
  </div>
  <ul class="cpsv-sources">
    ${[{name:"Catalogo completo",href:w({path:"/jsonld"}),action:"Vedi il JSON-LD"},...he.map(e=>({name:e.name,href:w({catalog:e.url,path:"/jsonld"}),action:"Vedi il JSON-LD"}))].map(e=>`
    <li>
      <a class="cpsv-source" href="${u(e.href)}">
        <span class="cpsv-source-name">${u(e.name)}</span>
        <span class="cpsv-source-action">${u(e.action)}</span>
      </a>
    </li>`).join("")}
  </ul>
</section>`}function _i({title:t,cpsvHref:e,servicesHref:i,fileUrl:s}){return`
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
</article>`}function Ai(t){return t.length?`
<p class="text-secondary mb-3">${t.length} serviz${t.length===1?"io":"i"}. Ogni blocco è il JSON-LD di un servizio, con i nodi a cui è collegato.</p>
${t.map(e=>`
<details class="cpsv-service-json">
  <summary>
    <span class="cpsv-service-title">${u(e.title)}</span>
    <a class="cpsv-playground" href="https://json-ld.org/playground/" target="_blank" rel="noopener noreferrer">Apri nel JSON-LD Playground</a>
  </summary>
  <pre class="cpsv-code"><code>${u(e.json)}</code></pre>
</details>`).join("")}`:'<p class="alert alert-info">In questo catalogo non ci sono servizi.</p>'}function xi(){const t=(i,s,n,o,a,r,l=!1)=>{const d=l?"#fff":"#17324d",p=l?"#d6e8fa":"#5c6f82";return`
      <rect x="${i}" y="${s}" width="${n}" height="${o}" rx="8" fill="${l?"#0066cc":"#fff"}" stroke="#0066cc" stroke-width="2"/>
      <text x="${i+n/2}" y="${s+30}" text-anchor="middle" font-size="16" font-weight="700" fill="${d}">${u(a)}</text>
      <text x="${i+n/2}" y="${s+52}" text-anchor="middle" font-size="13" fill="${p}">${u(r)}</text>`},e=(i,s,n)=>{const o=Math.max(...n.map(d=>d.length))*6.6+12,a=n.length*16+8,r=i-o/2,l=s-14;return`
      <rect x="${r}" y="${l}" width="${o}" height="${a}" fill="#fff"/>
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
</svg>`}si({...Mt,...jt});oi(qt);const Li={lifeEvents:kt,themes:Dt},W=document.getElementById("app");function A(t){var s;const e=W.querySelector("header[data-bs-toggle='sticky']");e&&((s=j.getInstance(e))==null||s.dispose()),W.innerHTML=pi(t);const i=W.querySelector("header[data-bs-toggle='sticky']");i&&j.getOrCreateInstance(i),Ti()}function Ti(){const t=W.querySelector("[data-download-scheda]");!t||!(v!=null&&v.doc)||t.addEventListener("click",()=>{const e=t.getAttribute("data-download-scheda"),s=Fe(v.doc).find(l=>l.id===e);if(!s){window.alert("Impossibile estrarre la scheda JSON-LD di questo servizio.");return}const n=new Blob([s.json],{type:"application/ld+json"}),o=URL.createObjectURL(n),a=document.createElement("a");a.href=o;const r=String(s.title||"scheda").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,60);a.download=`scheda-${r||"cpsv"}.jsonld`,a.click(),URL.revokeObjectURL(o)})}let v=null,m={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},z=1,oe=0;function M(t){return!t||t===Ue?null:t}async function Oi(t){const e=Re(t);if(v&&v.docUrl===e)return v;const i=++oe;A({catalogUrl:e,meta:null,error:null});const s=document.getElementById("view-root");s&&(s.innerHTML='<p class="text-muted" role="status">Caricamento catalogo…</p>');try{const{doc:n,url:o}=await ei(e);return i!==oe||(v={docUrl:o,doc:n,index:ci(n,Li)}),v}catch(n){if(i!==oe)return null;v=null,A({catalogUrl:e,meta:null,error:n.message||String(n)});const o=document.getElementById("view-root");return o&&(o.innerHTML=`
        <div class="alert alert-warning" role="alert">
          <h2 class="h5">Catalogo non disponibile</h2>
          <p>Riprova tra poco oppure torna all’elenco principale.</p>
          <p class="mb-0"><a class="btn btn-primary btn-sm" href="${w({catalog:M(e),path:"/",filters:ve()})}">Torna al catalogo</a></p>
        </div>`),null}}function ve(){return{q:m.q,org:m.org,lifeEvent:m.lifeEvent,theme:m.theme,page:z}}function Ni(t){m={q:(t==null?void 0:t.q)||"",org:(t==null?void 0:t.org)||"",lifeEvent:(t==null?void 0:t.lifeEvent)||"",theme:(t==null?void 0:t.theme)||"",onlineOnly:!1},z=(t==null?void 0:t.page)>1?t.page:1}function J({replace:t}){v&&Yt({catalog:M(v.docUrl),path:"/",filters:ve()},{replace:t})}function ue(){const t=document.getElementById("filter-q"),e=document.getElementById("filter-org"),i=document.getElementById("filter-le"),s=document.getElementById("filter-theme"),n=document.getElementById("filter-online");t&&(t.value=m.q||""),e&&(e.value=m.org||""),i&&(i.value=m.lifeEvent||""),s&&(s.value=m.theme||""),n&&(n.checked=!1)}function Pi(){var s,n;const t=document.getElementById("filters-form");if(!t)return;const e=({replace:o})=>{var a,r,l,d;m={q:((a=document.getElementById("filter-q"))==null?void 0:a.value)||"",org:((r=document.getElementById("filter-org"))==null?void 0:r.value)||"",lifeEvent:((l=document.getElementById("filter-le"))==null?void 0:l.value)||"",theme:((d=document.getElementById("filter-theme"))==null?void 0:d.value)||"",onlineOnly:!1},z=1,J({replace:o}),q()};t.addEventListener("change",o=>{var a;((a=o.target)==null?void 0:a.id)!=="filter-q"&&e({replace:!1})}),t.addEventListener("submit",o=>{o.preventDefault(),e({replace:!1})});let i;(s=document.getElementById("filter-q"))==null||s.addEventListener("input",()=>{clearTimeout(i),i=setTimeout(()=>e({replace:!0}),200)}),(n=document.getElementById("filters-reset"))==null||n.addEventListener("click",()=>{m={q:"",org:"",lifeEvent:"",theme:"",onlineOnly:!1},z=1,ue(),J({replace:!1}),q()})}function We(t){t&&(t.querySelectorAll("[data-filter-org]").forEach(e=>{e.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const s=e.getAttribute("data-filter-org")||"";m.org=m.org===s?"":s,z=1,ue(),J({replace:!1}),q(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}),t.querySelectorAll("[data-filter-life-event]").forEach(e=>{e.addEventListener("click",i=>{var n;i.preventDefault(),i.stopPropagation();const s=e.getAttribute("data-filter-life-event")||"";m.lifeEvent=m.lifeEvent===s?"":s,z=1,ue(),J({replace:!1}),q(),(n=document.getElementById("results-count"))==null||n.scrollIntoView({behavior:"smooth",block:"start"})})}))}function q(){if(!v)return;const t=di(v.index.services,m),e=document.getElementById("results-count"),i=document.getElementById("results-grid"),s=document.getElementById("pager");e&&(e.textContent=t.length===1?"1 servizio trovato":`${t.length} servizi trovati`),i&&(i.innerHTML=wi(t,{catalogUrl:v.docUrl,page:z,filterState:m}),We(i)),s&&(s.innerHTML=Ei(t.length,z,{catalogUrl:v.docUrl,filterState:m}))}function ki(t){t.querySelectorAll(".cpsv-playground").forEach(e=>{e.addEventListener("click",i=>{var o,a;i.preventDefault(),i.stopPropagation();const s=(a=(o=e.closest("details"))==null?void 0:o.querySelector("code"))==null?void 0:a.textContent;if(!s)return;const n=new URLSearchParams;n.set("json-ld",s),n.set("startTab","tab-expanded"),window.open(`https://json-ld.org/playground/#${n.toString()}`,"_blank","noopener,noreferrer")})})}async function Ke(){const t=ce(),e=(v==null?void 0:v.docUrl)||null;Ni(t.filters);const i=await Oi(t.catalog);if(!i)return;const s=ve();if(t.view==="cpsv"){A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"cpsv"});const o=document.getElementById("view-root");o&&(o.innerHTML=Ii({homeHref:w({catalog:M(i.docUrl),path:"/",filters:s}),catalogUrl:i.docUrl})),window.scrollTo(0,0);return}if(t.view==="jsonld"){const o=he.find(r=>r.url===i.docUrl);A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"jsonld"});const a=document.getElementById("view-root");if(a){a.innerHTML=_i({title:o?o.name:"Catalogo completo",cpsvHref:w({path:"/cpsv"}),servicesHref:w({catalog:M(i.docUrl),path:"/"}),fileUrl:i.docUrl});const r=document.getElementById("cpsv-json-services");try{const l=await fetch(i.docUrl,{credentials:"same-origin"});if(!l.ok)throw new Error(`HTTP ${l.status}`);const d=await l.json();r!=null&&r.isConnected&&(r.innerHTML=Ai(Fe(d)),ki(r))}catch(l){if(r!=null&&r.isConnected){r.replaceChildren();const d=document.createElement("p");d.className="alert alert-warning",d.textContent=`Non è stato possibile leggere il JSON-LD (${l.message||l}).`,r.append(d)}}}window.scrollTo(0,0);return}if(t.view==="detail"){const o=i.index.services.find(r=>r.id===t.serviceId);if(!o){A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s});const r=document.getElementById("view-root");r&&(r.innerHTML=`
          <div class="alert alert-warning" role="alert">
            Servizio non trovato in questo catalogo.
            <a href="${w({catalog:M(i.docUrl),path:"/",filters:s})}">Torna all’elenco</a>
          </div>`);return}A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,detail:o,filters:s});const a=document.getElementById("view-root");a&&(a.innerHTML=Ci(o)),window.scrollTo(0,0);return}A({catalogUrl:i.docUrl,meta:i.index.meta,error:null,filters:s,view:"list"});const n=document.getElementById("view-root");n&&(n.innerHTML=yi({index:i.index,filterState:m,catalogUrl:i.docUrl}),Pi(),We(n.querySelector(".life-events-entry")),q(),e&&e!==i.docUrl&&window.scrollTo(0,0))}window.addEventListener("hashchange",()=>{Ke()});Ke();
