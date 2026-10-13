/* LCpro T · Clarity 1.6 presentation-only interactions.
   No access to experimental data or scientific calculations. */
(function(){'use strict';
  const key='lcprot_visual_motion_v16';
  const button=()=>document.getElementById('visualMotionToggle');
  let enabled=true;
  try {enabled=localStorage.getItem(key)!=='off';}catch(_){enabled=true;}
  function drawToggle(){
    document.documentElement.classList.toggle('motion-off',!enabled);
    const b=button();if(!b)return;
    b.setAttribute('aria-pressed',String(enabled));
    b.title=enabled?'Disattiva le animazioni (mantiene i colori)':'Attiva le animazioni discrete';
    b.innerHTML='<span class="motion-glyph" aria-hidden="true">'+(enabled?'◉':'◌')+'</span> Animazioni '+(enabled?'on':'off');
  }
  function ready(){
    drawToggle();
    button()?.addEventListener('click',()=>{
      enabled=!enabled;
      try{localStorage.setItem(key,enabled?'on':'off');}catch(_){}
      drawToggle();
    });
    const notice=document.getElementById('researchNotice');
    if(notice){
      let prior=notice.textContent;
      const obs=new MutationObserver(()=>{
        const message=notice.textContent;
        if(message===prior)return;
        prior=message;
        // A brief appearance only *after* the original application posts feedback.
        notice.classList.remove('visual-feedback');
        void notice.offsetWidth;
        notice.classList.add('visual-feedback');
      });
      obs.observe(notice,{childList:true,characterData:true,subtree:true});
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ready,{once:true});
  else ready();
})();
