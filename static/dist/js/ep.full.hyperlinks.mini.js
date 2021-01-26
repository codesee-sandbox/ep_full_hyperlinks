exports.moduleList=(()=>{const t=require("ep_etherpad-lite/static/js/pad_utils").randomString,e=require("ep_etherpad-lite/static/js/underscore"),n=(i=function(t,n){let i={};return e.each(n,n=>{i=e.extend(s(t,n),i)}),i},s=function(t,n){const i={};return e.each(t,(t,e)=>{t.linkId===n&&(i[e]=t)}),i},o=function(t,n){const i=function(t){const n={};return e.each(t,(t,e)=>{const i=t.data.originalLinkId;n[i]=e}),n}(t);return e.each(i,(t,e)=>{$(n).find("."+e).removeClass(e).addClass(t)}),d(n)},l=function(t,n){const i={},s=r(t);return e.each(s,t=>{const e=a(),s=n[t];s.data.originalLinkId=t,i[e]=s}),i},a=function(){return"fakelink-"+t(16)},r=function(t){const n=$(t).find("span"),i=[];return e.each(n,t=>{const e=$(t).attr("class"),n=/(?:^| )(lc-[A-Za-z0-9]*)/.exec(e),s=!!n&&n[1];s&&i.push(s)}),e.uniq(i)},c=function(t){const e=t.cloneContents(),n=document.createElement("div");return $(n).html(e)},d=function(t){return $(t).html()},p=function(t){const e=d(t);return x(e)===$(t).text()},u=function(t,e,n){const i=h(t,n),s=f(i,e);return $.parseHTML(`<div>${s}</div>`)},f=function(t,e){const n=e.commonAncestorContainer.parentNode,i=g(n);return i&&(t=k(i)+t+m(i)),t},h=function(t,e){return`<span class="link ${e}">${t.slice(0,-1)}</span><span class="link ${e}">${t.slice(-1)}</span>`},k=function(t){let e="";return t.forEach(t=>{e+=`<${t}>`}),e},m=function(t){let e="";return(t=t.reverse()).forEach(t=>{e+=`</${t}>`}),e},g=function(t){const e=[];let n;if($(t)[0].hasOwnProperty("localName"))for(;"span"!==$(t)[0].localName;){const i=$(t).prop("outerHTML"),s=/<(b|i|u|s)>/.exec(i);n=s?s[1]:"",e.push(n),t=$(t).parent()}return e},y=function(t){const n={},i=clientVars.padId,s=pad.plugins.ep_full_hyperlinks.mapOriginalLinksId,o=pad.plugins.ep_full_hyperlinks.mapFakeLinks;e.each(t,(t,e)=>{v(t,e);const i=X.generateLinkId();o[e]=i;const l=t.data.originalLinkId;s[l]=i,n[i]=t}),pad.plugins.ep_full_hyperlinks.saveLinkWithoutSelection(i,n)},_=function(t){const n={},i=clientVars.padId,s=pad.plugins.ep_full_hyperlinks.mapOriginalLinksId;e.each(t,(t,e)=>{const i=t.linkId;t.linkId=s[i],n[e]=t}),pad.plugins.ep_full_hyperlinks.saveLinkReplies(i,n)},v=function(t,e){const n={};return n.padId=clientVars.padId,n.link=t.data,n.link.linkId=e,n},x=function(t){const e=document.createElement("div");return e.innerHTML=t,0===e.childNodes.length?"":e.childNodes[0].nodeValue},w=function(t,e,n,i){let s=!1;for(let o=t;o<=e&&!s;o++){const l=L(o,n,t),a=b(o,n,e);I(o,l,a,i)&&(s=!0)}return s},L=function(t,e,n){return t!==n?0:e.selStart[1]},b=function(t,e,n){let i;return i=t!==n?C(t,e):e.selEnd[1]-1,i},I=function(t,n,i,s){let o=!1;for(let l=n;l<=i&&!o;l++)void 0!==e.object(s.getAttributesOnPosition(t,l)).link&&(o=!0);return o},T=function(t,e){return t!==e},C=function(t,e){const n=t+1,i=e.lines.offsetOfIndex(t);return e.lines.offsetOfIndex(n)-i-1},{addTextOnClipboard:function(t,e,n,s,a,d){let f,h;if(e.callWithAce(t=>{f=t.ace_getLinkIdOnFirstPositionSelected(),h=t.ace_hasLinkOnSelection()}),h){let e;const h=n.contents()[0].getSelection().getRangeAt(0),k=c(h);let m=k;if(p(k)){const t=k[0].textContent;m=u(t,h,f)}const g=r(m);e=l(m,a);const y=o(e,m);e=JSON.stringify(e);let _=i(d,g);_=JSON.stringify(_),t.originalEvent.clipboardData.setData("text/objectReply",_),t.originalEvent.clipboardData.setData("text/objectLink",e),t.originalEvent.clipboardData.setData("text/html",y),t.preventDefault(),s&&n.contents()[0].execCommand("delete")}},saveLinksAndReplies:function(t){let e=t.originalEvent.clipboardData.getData("text/objectLink"),n=t.originalEvent.clipboardData.getData("text/objectReply");e&&n&&(e=JSON.parse(e),n=JSON.parse(n),y(e),_(n))},getLinkIdOnFirstPositionSelected:function(){const t=this.documentAttributeManager,n=this.rep;return e.object(t.getAttributesOnPosition(n.selStart[0],n.selStart[1])).link},hasLinkOnSelection:function(){let t;const e=this.documentAttributeManager,n=this.rep,i=n.selStart[0],s=n.selStart[1],o=n.selEnd[1],l=n.selEnd[0];return t=T(i,l)?w(i,l,n,e):I(i,s,o,e),t}});var i,s,o,l,a,r,c,d,p,u,f,h,k,m,g,y,_,v,x,w,L,b,I,T,C;const S=(()=>{let t;const e=function(){return t=t||$('iframe[name="ace_outer"]').contents(),t},n=()=>e().find("#links");var i=function(i,s,o,l,a){const r=n(),c=r.find("#"+i);var d=$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');if(r.is(":visible")){if(r.find(".sidebar-link").each((function(){d.contents().find("head .link-style").remove(),$(this).attr("data-linkid")!=i&&$(this).hasClass("hyperlink-display")&&($(this).removeClass("hyperlink-display"),t.find("#edit-form-"+$(this).attr("data-linkid")).hide(),t.find("#show-form-"+$(this).attr("data-linkid")).show(),$(this).css({top:c.attr("data-basetop")+"px"}))})),!c.hasClass("hyperlink-display")){c.css({width:"324px"});if("true"==c.attr("data-loaded"))c.css({left:parseInt(o.position().left)+parseInt(c.css("width").split("px")[0])+"px"}),c.css({top:parseInt(c.css("top").split("px")[0])+35+"px"}),c.addClass("hyperlink-display");else{let t=c.attr("data-hyperlink");const e=c.find("#ep_hyperlink_title");e.text(t);const n=c.find("#ep_hyperlink_img"),i=c.find("#ep_hyperlink_description");i.text("");const s=c.find("#card_loading_hyperlink");n.hide(),e.show(),s.show(),c.css({left:parseInt(o.position().left)+parseInt(c.css("width").split("px")[0])+"px"}),c.css({top:parseInt(c.css("top").split("px")[0])+35+"px"}),c.addClass("hyperlink-display"),/^http:\/\//.test(t)||/^https:\/\//.test(t)||(t="https://"+t);const r=function(o){if(e.attr("href",t),o.metadata.image&&o.metadata.title)n.attr("src",o.metadata.image),n.on("load",()=>{s.fadeOut(500,()=>{n.fadeIn(),e.text(o.metadata.title),i.text(o.metadata.url.replace(/^(?:https?:\/\/)?(?:www\.)?/i,"").split("/")[0]),c.attr({"data-loaded":!0})})});else{const e=new URL(t);t="https://"+e.hostname,!0!==o.last?l.emit("metaResolver",{padId:a,hyperlink:t,last:!0},r):(n.attr("src","../static/plugins/ep_full_hyperlinks/static/dist/img/nometa.png"),n.on("load",()=>{s.fadeOut(500,()=>{n.fadeIn(),i.text(t.replace(/^(?:https?:\/\/)?(?:www\.)?/i,"").split("/")[0]),c.attr({"data-loaded":!0})})}))}};l.emit("metaResolver",{padId:a,hyperlink:t,last:!1},r)}}(d=$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]')).contents().find("head").append(`<style class='link-style'>.${i}{ color: #a7680c !important }</style>`)}else{const n=c.clone(!0,!0);n.attr("style",""),n.find(".label-suggestion-checkbox").click((function(){$(this).siblings('input[type="checkbox"]').click()})),e().find(".link-modal-link").html("").append(n);const i=e().find('iframe[name="ace_inner"]'),l=e().find("#outerdocbody").outerWidth(!0),a=e().find(".link-modal").outerWidth(!0);var p=s.clientX;let r=$(s.target).offset().top;if(o)p+=i.offset().left,r+=parseInt(i.css("padding-top").split("px")[0]),r+=parseInt(t.find("#outerdocbody").css("padding-top").split("px")[0]);else p=$(s.target).offset().left-20;p+a>l&&(p=l-a-25);const d=o?o.outerHeight(!0):30;e().find(".link-modal").addClass("popup-show").css({left:p+"px",top:r+d+"px"})}};return{showLink:function(t,e){n().find("#"+t).show(),i(t,e)},hideLink:function(i,s){const o=n().find("#"+i);o.hasClass("hyperlink-display")&&(o.css({top:o.attr("data-basetop")+"px"}),o.removeClass("hyperlink-display"),o.css({width:"324px"}),t.find("#edit-form-"+i).hide(),t.find("#show-form-"+i).show());$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]').contents().find("head .link-style").remove(),e().find(".link-modal").removeClass("popup-show")},hideAllLinks:function(){const e=n(),i=$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]');e.find(".sidebar-link").each((function(){i.contents().find("head .link-style").remove(),$(this).hasClass("hyperlink-display")&&($(this).removeClass("hyperlink-display"),$(this).css({width:"324px"}),t.find("#edit-form-"+$(this).attr("data-linkid")).hide(),t.find("#show-form-"+$(this).attr("data-linkid")).show(),$(this).css({top:$(this).attr("data-basetop")+"px"}))}))},highlightLink:i,adjustTopOf:function(t,n){const i=e().find("#"+t);return i.css("top",n+"px"),i.attr("data-basetop",n),i},isOnTop:function(t,n){const i=n+"px";return e().find("#"+t).css("top")===i},shouldNotCloseLink:function(t){return!!($(t.target).closest(".link").length||$(t.target).closest(".link-modal").length||$(t.target).closest(".ep_hyperlink_docs_bubble_button_edit").length||$(t.target).closest(".ep_hyperlink_docs_bubble_button_delete").length||$(t.target).closest(".ep_hyperlink_docs_bubble_button_copy").length||$(t.target).closest(".full-display-link").length||$(t.target).closest(".link-title-wrapper").length||$(t.target).closest(".link-edit-form").length||$(t.target).closest(".link-text-text").length||$(t.target).closest(".link-text-hyperlink").length)}}})(),O=(N=function(){return clientVars.displayLinkAsIcon},M=function(){return A=A||$('iframe[name="ace_outer"]').contents()},D=function(){return E=E||M().find('iframe[name="ace_inner"]').contents()},P=function(t){const e=M().find("#linkIcons"),n="icon-at-"+t;let i=e.find("."+n);return 0===i.length&&(e.append(`<div class="link-icon-line ${n}"></div>`),i=e.find("."+n),i.css("top",t+"px")),i},R=function(t){return t.currentTarget.getAttribute("data-linkid")},j=function(t){D().find("head .link-style").remove()},V=function(t){t.toggleClass("active").toggleClass("inactive")},z=function(){M().find("#linkIcons").on("mouseover",".link-icon",t=>{j(),function(t){D().find("head").append(`<style class='link-style'>.${t}{ color: #a7680c !important }</style>`)}(R(t))}).on("mouseout",".link-icon",t=>{R(t),j()}).on("click",".link-icon.active",(function(t){V($(this));const e=R(t);S.hideLink(e,!0)})).on("click",".link-icon.inactive",(function(t){S.hideAllLinks();const e=M().find("#linkIcons").find(".link-icon.active");V(e),V($(this));const n=R(t);S.highlightLink(n,t)}))},F=function(t){if(H(t)||S.shouldNotCloseLink(t))return;const e=W();if(e){V($(e));const t=e.getAttribute("data-linkid");S.hideLink(t,!0)}},W=function(){return M().find("#linkIcons .link-icon.active").get(0)},{insertContainer:function(){N()&&(M().find("#sidediv").after('<div id="linkIcons"></div>'),M().find("#links").addClass("with-icons"),z(),$(document).on("touchstart click",t=>{F(t)}),M().find("html").on("touchstart click",t=>{F(t)}),D().find("html").on("touchstart click",t=>{F(t)}))},addIcon:function(t,e){if(!N())return;const n=D().find(".link."+t).get(0).offsetTop,i=P(n);$("#linkIconTemplate").tmpl(e).appendTo(i)},hideIcons:function(){N()&&M().find("#linkIcons").children().children().each((function(){$(this).hide()}))},adjustTopOf:function(t,e){if(!N())return;const n=M().find("#icon-"+t),i=P(e);return i!=n.parent()&&n.appendTo(i),n.show(),n},isLinkOpenedByClickOnIcon:function(){return!!N()&&0!==M().find("#linkIcons").find(".link-icon.active").length},linkHasReply:function(t){N()&&M().find("#linkIcons").find("#icon-"+t).addClass("with-reply")},shouldShow:function(t){let e=!1;return N()?t.hasClass("mouseover")&&(e=!0):e=!0,e},shouldNotCloseLink:H=function(t){return 0!==$(t.target).closest(".link-icon").length}});var A,E,N,M,D,P,R,j,V,z,F,W,H;const U={localize:function(t){html10n.translateElement(html10n.translations,t.get(0))}},J={localizenewLinkPopup:q=function(){const t=$("#newLink");0!==t.length&&U.localize(t)},insertNewLinkPopupIfDontExist:function(t,e){$("#newLink").remove();var n=$("#newLink");return t.linkId="",(n=$("#newLinkTemplate").tmpl(t)).appendTo($("#editorcontainerbox")),q(),$("#newLink").find(".suggestion-checkbox").change((function(){$("#newLink").find(".suggestion").toggle($(this).is(":checked"))})),n.find("#link-reset").on("click",()=>{K()}),$("#newLink").on("submit",t=>(t.preventDefault(),function(t){const e=$("#newLink"),n=function(t){const e=t.find("#hyperlink-text").val(),n=t.find("#hyperlink-text-hidden").val();let i=t.find("#hyperlink-url").val();const s=t.find(".from-value").text(),o=t.find(".to-value").val()||null,l={};return/^http:\/\//.test(i)||/^https:\/\//.test(i)||(i="https://"+i),l.text=e,l.oldText=n,l.hyperlink=i,o&&(l.changeFrom=s,l.changeTo=o),l}(e);return n.text.length>0||n.changeTo&&n.changeTo.length>0?(e.find(".link-content, .to-value").removeClass("error"),K(),t(n,0)):(0==n.text.length&&e.find(".link-content").addClass("error"),n.changeTo&&0==n.changeTo.length&&e.find(".to-value").addClass("error")),!1}(e))),n},showNewLinkPopup:function(){$("#newLink").css("left",$(".toolbar .addLink").offset().left),$("#newLink").find(".suggestion-checkbox").prop("checked",!1).trigger("change"),$("#newLink").find("textarea").val(""),$("#newLink").find(".link-content, .to-value").removeClass("error"),$("#newLink").addClass("popup-show"),pad.plugins.ep_full_hyperlinks.preLinkMarker.markSelectedText(),setTimeout(()=>{$("#newLink").find(".link-content").focus().select()},500)},hideNewLinkPopup:K=function(){$("#newLink").removeClass("popup-show"),$("#newLink").find(":focus").blur(),pad.plugins.ep_full_hyperlinks.preLinkMarker.unmarkSelectedText()}};var q,K;const Z=(()=>{const t="pre-selected-link";var e=function(t){this.ace=t;const e=this;this.highlightSelectedText()&&setTimeout(()=>{e.unmarkSelectedText()},0)};e.prototype.highlightSelectedText=function(){return clientVars.highlightSelectedText},e.prototype.markSelectedText=function(){this.highlightSelectedText()&&this.ace.callWithAce(n,"markPreSelectedTextToLink",!0)},e.prototype.unmarkSelectedText=function(){this.highlightSelectedText()&&this.ace.callWithAce(n,"unmarkPreSelectedTextToLink",!0)},e.prototype.performNonUnduableEvent=function(t,e,n){e.startNewEvent("nonundoable"),n(),e.startNewEvent(t)},e.prototype.handleMarkText=function(t){const e=t.editorInfo,n=t.rep,i=t.callstack;this.removeMarks(e,n,i),this.addMark(e,i)},e.prototype.handleUnmarkText=function(t){const e=t.editorInfo,n=t.rep,i=t.callstack;this.removeMarks(e,n,i)},e.prototype.addMark=function(e,n){const i=n.editEvent.eventType;this.performNonUnduableEvent(i,n,()=>{e.ace_setAttributeOnSelection(t,clientVars.userId)})},e.prototype.removeMarks=function(e,n,i){const s=i.editEvent.eventType,o=n.selStart,l=n.selEnd;this.performNonUnduableEvent(s,i,()=>{const n=$('iframe[name="ace_outer"]').contents().find('iframe[name="ace_inner"]'),i=e.ace_getRepFromSelector(".pre-selected-link",n);$.each(i,(n,i)=>{e.ace_performSelectionChange(i[0],i[1],!0),e.ace_setAttributeOnSelection(t,!1)}),e.ace_performSelectionChange(o,l,!0)})};var n=function(){};return{MARK_CLASS:t,init:function(t){return new e(t)}}})(),B=(()=>{var t="undefined"!=typeof html10n;l10nKeys={seconds:"ep_full_hyperlinks.time.seconds","1 minute ago":"ep_full_hyperlinks.time.one_minute",minutes:"ep_full_hyperlinks.time.minutes","1 hour ago":"ep_full_hyperlinks.time.one_hour",hours:"ep_full_hyperlinks.time.hours",yesterday:"ep_full_hyperlinks.time.one_day",days:"ep_full_hyperlinks.time.days","last week":"ep_full_hyperlinks.time.one_week",weeks:"ep_full_hyperlinks.time.weeks","last month":"ep_full_hyperlinks.time.one_month",months:"ep_full_hyperlinks.time.months","last year":"ep_full_hyperlinks.time.one_year",years:"ep_full_hyperlinks.time.years","last century":"ep_full_hyperlinks.time.one_century",centuries:"ep_full_hyperlinks.time.centuries"};var e=[[60,"seconds",1],[120,"1 minute ago","1 minute from now"],[3600,"minutes",60],[7200,"1 hour ago","1 hour from now"],[86400,"hours",3600],[172800,"yesterday","tomorrow"],[604800,"days",86400],[1209600,"last week","next week"],[2419200,"weeks",604800],[4838400,"last month","next month"],[29030400,"months",2419200],[58060800,"last year","next year"],[290304e4,"years",29030400],[580608e4,"last century","next century"],[580608e5,"centuries",290304e4]];return{prettyDate:function(n){let i=(new Date-new Date(n))/1e3,s="ago",o=1,l=".past";i<0&&(i=Math.abs(i),s="from now",l=".future",o=2);let a,r=0;for(;a=e[r++];)if(i<a[0]){const e=Math.floor(i/a[2]);var c;if(t){const t=l10nKeys[a[1]]+l;c=html10n.get(t,{count:e})}return void 0===c&&(c="string"==typeof a[2]?a[o]:`${e} ${a[1]} ${s}`),c}return n}}})(),X={collectContentPre:(t,e)=>{const n=/(?:^| )(lc-[A-Za-z0-9]*)/.exec(e.cls),i=/(?:^| )(fakelink-[A-Za-z0-9]*)/.exec(e.cls);if(n&&n[1]&&e.cc.doAttrib(e.state,"link::"+n[1]),i){const t=pad.plugins.ep_full_hyperlinks.getMapfakeLinks()[i[1]];e.cc.doAttrib(e.state,"link::"+t)}return[]},generateLinkId:function(){return"lc-"+t(16)}};return{events:n,linkBoxes:S,linkIcons:O,linkL10n:U,newLink:J,preLinkMark:Z,timeFormat:B,shared:X}})();
//# sourceMappingURL=ep.full.hyperlinks.mini.js.map
