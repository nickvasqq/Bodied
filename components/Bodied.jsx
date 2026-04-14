"use client";
import React from "react";
import { useState, useRef, useEffect } from "react";

var SCAN_LABELS=["Initializing...","Detecting physique...","Analyzing proportions...","Evaluating muscles...","Estimating composition...","Scoring...","Delivering verdict..."];
var PLAN_LABELS=["Analyzing results...","Building program...","Selecting exercises...","Optimizing volume...","Finalizing..."];
var MEAL_LABELS=["Calculating macros...","Building meals...","Planning the week...","Creating grocery list...","Finalizing..."];
var DAYS_LIST=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

function todayStr(){return new Date().toISOString().split("T")[0];}
function load(k,fb){if(typeof window==="undefined")return fb;try{var d=localStorage.getItem("bodied_"+k);return d?JSON.parse(d):fb;}catch(e){return fb;}}
function save(k,v){if(typeof window!=="undefined")localStorage.setItem("bodied_"+k,JSON.stringify(v));}

function Logo(props){var size=props.size||30;var onClick=props.onClick;return React.createElement("div",{onClick:onClick,style:{display:"flex",alignItems:"center",gap:9,cursor:onClick?"pointer":"default"}},React.createElement("div",{style:{width:size,height:size,borderRadius:7,background:"linear-gradient(135deg,#cdff32,#a8e600)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"var(--hd)",fontSize:size*.55,fontWeight:700,color:"#0b0b10",boxShadow:"0 0 18px rgba(205,255,50,.2)"}},"B"),React.createElement("span",{style:{fontFamily:"var(--hd)",fontSize:size*.62,fontWeight:700,letterSpacing:"-.03em"}},"BODIED"));}

function RatingBlocks(props){
  var rating=props.rating;
  if(!rating||isNaN(rating)||rating<0||rating>10)return null;
  var f=Math.floor(rating);var p=rating-f;var empty=10-Math.ceil(rating);
  var blocks=[];
  for(var i=0;i<f;i++){blocks.push(React.createElement("div",{key:"f"+i,style:{width:20,height:20,borderRadius:4,background:"linear-gradient(135deg,#cdff32,#a8e600)",boxShadow:"0 0 10px rgba(205,255,50,.35)"}}));}
  if(p>0){blocks.push(React.createElement("div",{key:"p",style:{width:20,height:20,borderRadius:4,background:"linear-gradient(90deg,#cdff32 "+p*100+"%,rgba(255,255,255,.05) "+p*100+"%)"}}));}
  for(var j=0;j<empty;j++){blocks.push(React.createElement("div",{key:"e"+j,style:{width:20,height:20,borderRadius:4,background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.03)"}}));}
  return React.createElement("div",{style:{display:"flex",gap:4}},blocks);
}

function ScoreBar(props){
  var label=props.label;var score=props.score;
  var isNull=score===null||score===undefined;
  var c=isNull?"rgba(255,255,255,.15)":score>=8?"#cdff32":score>=6?"#32d4ff":score>=4?"#ffa532":"#ff3266";
  return React.createElement("div",{style:{marginBottom:13}},
    React.createElement("div",{style:{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13}},
      React.createElement("span",{style:{color:"rgba(255,255,255,.5)"}},label),
      React.createElement("span",{style:{color:c,fontWeight:700}},isNull?"?":score+"/10")
    ),
    React.createElement("div",{style:{height:5,borderRadius:3,background:"rgba(255,255,255,.04)",overflow:"hidden"}},
      isNull?React.createElement("div",{style:{height:"100%",width:"100%",background:"repeating-linear-gradient(90deg,rgba(255,255,255,.03) 0px,rgba(255,255,255,.03) 8px,transparent 8px,transparent 16px)"}}):
      React.createElement("div",{style:{height:"100%",borderRadius:3,width:score*10+"%",background:c,transition:"width 1s"}})
    )
  );
}

export default function Bodied(){
  var _s=useState,_e=useEffect,_r=useRef;
  var _v=_s("landing"),view=_v[0],setView=_v[1];
  var _fi=_s(null),fI=_fi[0],setFI=_fi[1];var _fd=_s(null),fD=_fd[0],setFD=_fd[1];
  var _bi=_s(null),bI=_bi[0],setBI=_bi[1];var _bd=_s(null),bD=_bd[0],setBD=_bd[1];
  var _li=_s(null),lI=_li[0],setLI=_li[1];var _ld=_s(null),lD=_ld[0],setLD=_ld[1];
  var _res=_s(function(){return load("res",null);}),results=_res[0],setResults=_res[1];
  var _prog=_s(0),prog=_prog[0],setProg=_prog[1];
  var _gt=_s(null),genT=_gt[0],setGenT=_gt[1];
  var _tab=_s("scan"),tab=_tab[0],setTab=_tab[1];
  var _tsub=_s("plan"),tSub=_tsub[0],setTSub=_tsub[1];
  var _msub=_s("plan"),mSub=_msub[0],setMSub=_msub[1];
  var _tp=_s(function(){return load("tPlan",null);}),tPlan=_tp[0],setTPlan=_tp[1];
  var _mp=_s(function(){return load("mPlan",null);}),mPlan=_mp[0],setMPlan=_mp[1];
  var _em=_s(""),email=_em[0],setEmail=_em[1];
  var _es=_s(false),eSaved=_es[0],setESaved=_es[1];
  var _hf=_s(function(){return load("hFt","");}),heightFt=_hf[0],setHeightFt=_hf[1];
  var _hi=_s(function(){return load("hIn","0");}),heightIn=_hi[0],setHeightIn=_hi[1];
  var _wt=_s(function(){return load("wt","");}),weight=_wt[0],setWeight=_wt[1];
  var _gw=_s(function(){return load("gw","");}),goalWeight=_gw[0],setGoalWeight=_gw[1];
  var _sc=_s(function(){return load("scanCount",0);}),scanCount=_sc[0],setScanCount=_sc[1];
  var _pc=_s(""),promoCode=_pc[0],setPromoCode=_pc[1];
  var _pv=_s(null),promoValid=_pv[0],setPromoValid=_pv[1];
  var _pm=_s(""),promoMsg=_pm[0],setPromoMsg=_pm[1];
  var _ip=_s(function(){return load("isPaid",false);}),isPaid=_ip[0],setIsPaid=_ip[1];
  var _td=_s("5"),tDays=_td[0],setTDays=_td[1];
  var _te=_s("full gym"),tEquip=_te[0],setTEquip=_te[1];
  var _tx=_s("intermediate"),tExp=_tx[0],setTExp=_tx[1];
  var _md=_s("no restrictions"),mDiet=_md[0],setMDiet=_md[1];
  var _mb=_s("moderate"),mBudget=_mb[0],setMBudget=_mb[1];
  var _mc=_s("4"),mCount=_mc[0],setMCount=_mc[1];
  var _cp=_s("moderate"),carbPref=_cp[0],setCarbPref=_cp[1];
  var _pp=_s("high"),proPref=_pp[0],setProPref=_pp[1];
  var _wl=_s(function(){return load("wLog",{});}),wLog=_wl[0],setWLog=_wl[1];
  var _adi=_s(null),aDayI=_adi[0],setADayI=_adi[1];
  var _aei=_s(null),aExI=_aei[0],setAExI=_aei[1];
  var _sin=_s({w:"",r:""}),sIn=_sin[0],setSIn=_sin[1];
  var _fl=_s(function(){return load("fLog",{});}),fLog=_fl[0],setFLog=_fl[1];
  var _fs=_s(""),fSrch=_fs[0],setFSrch=_fs[1];
  var _fr=_s([]),fRes=_fr[0],setFRes=_fr[1];
  var _sf=_s(false),sF=_sf[0],setSF=_sf[1];
  var _sd=_s(todayStr()),selDate=_sd[0],setSelDate=_sd[1];
  var _qo=_s(false),qaOpen=_qo[0],setQaOpen=_qo[1];
  var _qa=_s({n:"",cal:"",p:"",c:"",f:""}),qa=_qa[0],setQa=_qa[1];
  var _mdi=_s(new Date().getDay()===0?6:new Date().getDay()-1),mDayIdx=_mdi[0],setMDayIdx=_mdi[1];
  var _se=_s(null),scanErr=_se[0],setScanErr=_se[1];

  _e(function(){if(results)save("res",results);},[results]);
  _e(function(){if(tPlan)save("tPlan",tPlan);},[tPlan]);
  _e(function(){if(mPlan)save("mPlan",mPlan);},[mPlan]);
  _e(function(){save("wLog",wLog);},[wLog]);
  _e(function(){save("fLog",fLog);},[fLog]);
  _e(function(){save("hFt",heightFt);},[heightFt]);
  _e(function(){save("hIn",heightIn);},[heightIn]);
  _e(function(){save("wt",weight);},[weight]);
  _e(function(){save("gw",goalWeight);},[goalWeight]);
  _e(function(){save("scanCount",scanCount);},[scanCount]);
  _e(function(){save("isPaid",isPaid);},[isPaid]);

  function handlePhoto(imgSetter,dataSetter){
    return function(e){
      var file=e.target.files&&e.target.files[0];if(!file)return;
      imgSetter(URL.createObjectURL(file));
      var reader=new FileReader();
      reader.onload=function(){dataSetter(reader.result.split(",")[1]);};
      reader.readAsDataURL(file);
    };
  }

  function startProg(){
    setProg(0);
    var iv=setInterval(function(){setProg(function(p){if(p>=92){clearInterval(iv);return 92;}return p+0.7;});},110);
    return iv;
  }

  function validatePromo(){
    if(!promoCode.trim()){setPromoValid(false);setPromoMsg("Enter a code");return;}
    fetch("/api/validate-promo",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:promoCode})})
    .then(function(r){return r.json();})
    .then(function(d){
      setPromoValid(d.valid);
      setPromoMsg(d.valid?d.description:d.message);
      if(d.fullAccess){setIsPaid(true);save("isPaid",true);}
    })
    .catch(function(){setPromoValid(false);setPromoMsg("Error checking code");});
  }

  function checkout(plan){
    fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({plan:plan,email:email,promoCode:promoCode})})
    .then(function(r){return r.json();})
    .then(function(d){
      if(d.free){setIsPaid(true);save("isPaid",true);alert("Promo code applied! You have full access.");return;}
      if(d.url)window.location.href=d.url;
      else alert("Add Stripe keys to enable checkout.");
    })
    .catch(function(){alert("Checkout not available yet.");});
  }

  var maxScans = isPaid ? 999 : (eSaved ? 10 : 5);

  function runScan(){
    if(!fD)return;
    if(scanCount >= maxScans){alert("You have used all " + maxScans + " free scans. " + (!eSaved ? "Add your email for 5 more, or " : "") + "Upgrade for unlimited scans.");return;}
    setView("scanning");setGenT("scan");
    var iv=startProg();
    fetch("/api/scan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({frontImage:fD,backImage:bD,legsImage:lD,heightFt:heightFt,heightIn:heightIn,weight:weight,goalWeight:goalWeight,isPaid:isPaid})})
    .then(function(r){return r.json();})
    .then(function(d){
      clearInterval(iv);setProg(100);
      if(d.error){console.log("API error:",d.error);}
      setTPlan(null);setMPlan(null);setFLog({});setWLog({});save("tPlan",null);save("mPlan",null);save("fLog",{});save("wLog",{});
      setScanCount(scanCount+1);
      setTimeout(function(){setResults(d);setView("results");setTab("scan");},400);
    })
    .catch(function(e){clearInterval(iv);console.error(e);setView("upload");});
  }

  function genTrain(){
    setView("scanning");setGenT("train");var iv=startProg();
    fetch("/api/train",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({results:results,preferences:{daysPerWeek:parseInt(tDays),equipment:tEquip,experience:tExp},isPaid:isPaid})})
    .then(function(r){return r.json();})
    .then(function(d){clearInterval(iv);setProg(100);if(d.error){alert("Error: "+d.error);setView("results");return;}setTimeout(function(){setTPlan(d);setView("results");setTab("train");setTSub("plan");},400);})
    .catch(function(e){clearInterval(iv);console.error(e);alert("Failed to generate. Try again.");setView("results");});
  }

  function genMeals(){
    setView("scanning");setGenT("meals");var iv=startProg();
    fetch("/api/meals",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({results:results,preferences:{diet:mDiet,budget:mBudget,mealsPerDay:parseInt(mCount),carbPref:carbPref,proteinPref:proPref},isPaid:isPaid})})
    .then(function(r){return r.json();})
    .then(function(d){clearInterval(iv);setProg(100);if(d.error){alert("Error: "+d.error);setView("results");return;}setTimeout(function(){setMPlan(d);setView("results");setTab("meals");setMSub("plan");},400);})
    .catch(function(e){clearInterval(iv);console.error(e);alert("Failed to generate. Try again.");setView("results");});
  }

  function searchFood(){
    if(!fSrch.trim())return;setSF(true);
    fetch("/api/food-search",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:fSrch})})
    .then(function(r){return r.json();})
    .then(function(d){setFRes(d.results||[]);})
    .catch(function(){setFRes([]);})
    .finally(function(){setSF(false);});
  }

  var _la=_s(null),logAnim=_la[0],setLogAnim=_la[1];
  function logSet(di,ei,w,r){var k=todayStr();var n=JSON.parse(JSON.stringify(wLog));if(!n[k])n[k]={days:{}};if(!n[k].days[di])n[k].days[di]={ex:{}};if(!n[k].days[di].ex[ei])n[k].days[di].ex[ei]={sets:[]};n[k].days[di].ex[ei].sets.push({w:parseFloat(w),r:parseInt(r)});setWLog(n);setSIn({w:"",r:""});setLogAnim(ei);setTimeout(function(){setLogAnim(null);},800);}
  var _fla=_s(false),foodLogAnim=_fla[0],setFoodLogAnim=_fla[1];
  function addFood(food,slot){var k=selDate;var n=JSON.parse(JSON.stringify(fLog));if(!n[k])n[k]={meals:[]};n[k].meals.push(Object.assign({},food,{slot:slot||"Snack"}));setFLog(n);setFoodLogAnim(true);setTimeout(function(){setFoodLogAnim(false);},600);}
  function rmFood(k,i){var n=JSON.parse(JSON.stringify(fLog));if(n[k]){n[k].meals.splice(i,1);setFLog(n);}}
  function addQF(){if(!qa.n||!qa.cal)return;addFood({name:qa.n,calories:parseInt(qa.cal),protein:parseFloat(qa.p)||0,carbs:parseFloat(qa.c)||0,fat:parseFloat(qa.f)||0,serving:"custom"},"Quick Add");setQa({n:"",cal:"",p:"",c:"",f:""});setQaOpen(false);}

  function dayMacros(k){var m=(fLog[k]&&fLog[k].meals)||[];return m.reduce(function(a,f){return{cal:a.cal+(f.calories||0),p:a.p+(f.protein||0),c:a.c+(f.carbs||0),f:a.f+(f.fat||0)};},{cal:0,p:0,c:0,f:0});}

  var mt=mPlan?{cal:mPlan.dailyCalories||2200,p:parseInt(mPlan.macros&&mPlan.macros.protein)||150,c:parseInt(mPlan.macros&&mPlan.macros.carbs)||200,f:parseInt(mPlan.macros&&mPlan.macros.fat)||60}:{cal:(results&&results.recommendedCalories)||2200,p:(results&&results.recommendedProtein)||150,c:200,f:60};
  var dm=dayMacros(selDate);

  function reset(){setView("landing");setFI(null);setFD(null);setBI(null);setBD(null);setLI(null);setLD(null);setTab("scan");setScanErr(null);}
  function fullReset(){reset();setResults(null);setTPlan(null);setMPlan(null);setWLog({});setFLog({});setScanCount(0);setIsPaid(false);save("res",null);save("tPlan",null);save("mPlan",null);save("wLog",{});save("fLog",{});save("scanCount",0);save("isPaid",false);}

  var vc=results&&results.verdict==="Bulk"?"#32d4ff":results&&results.verdict==="Cut"?"#ff3266":"#ffa532";
  var curWeekDay=mPlan&&mPlan.weeklyPlan&&mPlan.weeklyPlan[mDayIdx];

  // Shared styles
  var cardS=function(glow){return{padding:20,borderRadius:14,marginBottom:12,background:glow?"rgba(205,255,50,.03)":"rgba(255,255,255,.02)",border:glow?"1px solid rgba(205,255,50,.12)":"1px solid rgba(255,255,255,.04)"};};
  var lblS=function(color){return{fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",color:color||"rgba(255,255,255,.25)",marginBottom:8};};
  var selS={width:"100%",padding:"9px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)",color:"#fff",fontSize:12,outline:"none",fontFamily:"'Outfit',sans-serif"};
  var inpS={width:"100%",padding:"9px 10px",borderRadius:7,border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.04)",color:"#fff",fontSize:12,outline:"none",fontFamily:"'Outfit',sans-serif",boxSizing:"border-box"};
  var btnS=function(primary,small,full){return{padding:small?"7px 14px":primary?"14px 36px":"10px 20px",border:primary?"none":"1px solid rgba(255,255,255,.08)",borderRadius:small?7:10,background:primary?"linear-gradient(135deg,#cdff32,#b8e600)":"transparent",color:primary?"#0b0b10":"rgba(255,255,255,.5)",fontFamily:"'Space Grotesk',sans-serif",fontSize:small?11:primary?14:12,fontWeight:600,cursor:"pointer",boxShadow:primary?"0 0 30px rgba(205,255,50,.2)":"none",width:full?"100%":"auto"};};
  var subBtnS=function(active,color){return{padding:"7px 14px",borderRadius:7,border:"none",background:active?(color||"rgba(205,255,50,.1)"):"rgba(255,255,255,.03)",color:active?(color==="rgba(50,212,255,.1)"?"#32d4ff":"#cdff32"):"rgba(255,255,255,.25)",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'Space Grotesk',sans-serif"};};

  function PhotoSlot(ps){
    var ref=_r(null);
    return <div onClick={function(){ref.current&&ref.current.click();}} style={{flex:1,minWidth:90,height:140,borderRadius:10,border:ps.image?"2px solid rgba(205,255,50,.3)":"2px dashed rgba(255,255,255,.1)",background:ps.image?"url("+ps.image+") center/cover":"rgba(255,255,255,.02)",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",position:"relative",overflow:"hidden"}}>
      {!ps.image&&<><div style={{fontSize:24,marginBottom:4,opacity:.3}}>📷</div><div style={{fontSize:11,color:"rgba(255,255,255,.3)"}}>{ps.label}</div><div style={{fontSize:9,color:ps.req?"#cdff32":"rgba(255,255,255,.15)",marginTop:3}}>{ps.req?"Required":"Optional"}</div></>}
      {ps.image&&<div style={{position:"absolute",bottom:0,left:0,right:0,padding:"5px",background:"linear-gradient(transparent,rgba(0,0,0,.7))",fontSize:10,color:"rgba(255,255,255,.7)",textAlign:"center"}}>{ps.label} ✓</div>}
      <input ref={ref} type="file" accept="image/*" onChange={ps.onUpload} style={{display:"none"}}/>
    </div>;
  }

  function MacroRing(mr){
    var pct=Math.min((mr.cur/(mr.target||1))*100,100);
    return <div style={{textAlign:"center",flex:1}}>
      <div style={{position:"relative",width:64,height:64,margin:"0 auto 6px"}}>
        <svg width="64" height="64" style={{transform:"rotate(-90deg)"}}><circle cx="32" cy="32" r="27" fill="none" stroke="rgba(255,255,255,.04)" strokeWidth="5"/><circle cx="32" cy="32" r="27" fill="none" stroke={mr.color} strokeWidth="5" strokeLinecap="round" strokeDasharray={pct*1.696+" 169.6"}/></svg>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Space Grotesk',sans-serif",fontSize:14,fontWeight:700,color:mr.color}}>{Math.round(mr.cur)}</div>
      </div>
      <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>{mr.label}</div>
      <div style={{fontSize:9,color:"rgba(255,255,255,.15)"}}>/{mr.target}g</div>
    </div>;
  }

  return (
    <div style={{"--hd":"'Space Grotesk',sans-serif","--bd":"'Outfit',sans-serif",minHeight:"100vh",background:"#0b0b10",color:"#fff",fontFamily:"var(--bd)"}}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800&display=swap" rel="stylesheet"/>

      {/* NAV */}
      <nav style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"16px 20px",maxWidth:960,margin:"0 auto"}}>
        <Logo onClick={reset}/>
        <div style={{display:"flex",gap:6}}>
          {results&&view==="landing"&&<button style={btnS(false,true)} onClick={function(){setView("results");setTab("scan");}}>Dashboard</button>}
          {view==="results"&&<><button style={btnS(false,true)} onClick={function(){setView("upload");}}>New Scan</button><button style={Object.assign({},btnS(false,true),{color:"rgba(255,50,50,.4)",border:"1px solid rgba(255,50,50,.1)"})} onClick={fullReset}>Reset All</button></>}
        </div>
      </nav>

      {/* ===== LANDING ===== */}
      {view==="landing"&&<div style={{maxWidth:840,margin:"0 auto",padding:"0 20px"}}>
        <div style={{textAlign:"center",paddingTop:44,paddingBottom:40}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:6,padding:"4px 12px",borderRadius:100,background:"rgba(205,255,50,.06)",border:"1px solid rgba(205,255,50,.12)",fontSize:10,fontWeight:600,letterSpacing:".07em",textTransform:"uppercase",color:"#cdff32",marginBottom:24}}>
            <span style={{width:5,height:5,borderRadius:"50%",background:"#cdff32",boxShadow:"0 0 6px #cdff32"}}/>AI Physique Analysis
          </div>
          <h1 style={{fontFamily:"var(--hd)",fontSize:"clamp(48px,10vw,84px)",fontWeight:700,lineHeight:.92,margin:0,letterSpacing:"-.04em"}}>
            <span style={{display:"block"}}>Get</span>
            <span style={{background:"linear-gradient(135deg,#cdff32,#32d4ff)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Bodied.</span>
          </h1>
          <p style={{fontSize:15,color:"rgba(255,255,255,.35)",maxWidth:400,margin:"20px auto 32px",lineHeight:1.6}}>AI physique analysis, custom training, meal planning, workout tracking, and macro counting.</p>
          <button style={btnS(true)} onClick={function(){setView("upload");}}>Scan My Physique — Free</button>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))",gap:12,marginBottom:50}}>
          {[{id:"scan",n:"Scan",pr:"Free",per:"",feat:["Physique Rating /10","Bulk / Cut / Recomp","Strengths & Weak Points","Body Fat Estimate"],cta:"Get Scanned",hi:false},{id:"train",n:"Train",pr:"$9.99",per:"/mo",feat:["Custom Training Plan","Workout Tracker","Progress History","Exercise Logging"],cta:"Start Training",hi:false},{id:"transform",n:"Transform",pr:"$19.99",per:"/mo",feat:["7-Day Meal Plan","Macro Counter","Food Logger","Grocery Lists"],cta:"Go All In",hi:true}].map(function(t){return(
            <div key={t.id} onClick={function(){if(t.id==="scan")setView("upload");else checkout(t.id);}} style={{padding:24,borderRadius:14,display:"flex",flexDirection:"column",position:"relative",background:t.hi?"rgba(205,255,50,.03)":"rgba(255,255,255,.02)",border:t.hi?"1px solid rgba(205,255,50,.15)":"1px solid rgba(255,255,255,.04)",cursor:"pointer"}}>
              {t.hi&&<div style={{position:"absolute",top:-10,left:"50%",transform:"translateX(-50%)",background:"linear-gradient(135deg,#cdff32,#b8e600)",color:"#0b0b10",fontFamily:"var(--hd)",fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:".1em",padding:"3px 10px",borderRadius:100}}>Best Value</div>}
              <div style={{fontSize:10,fontWeight:600,textTransform:"uppercase",letterSpacing:".1em",color:"rgba(255,255,255,.2)",marginBottom:6}}>{t.n}</div>
              <div style={{fontFamily:"var(--hd)",fontSize:30,fontWeight:700,marginBottom:14}}>{t.pr}<span style={{fontSize:12,color:"rgba(255,255,255,.2)"}}>{t.per}</span></div>
              <div style={{flex:1,marginBottom:16}}>{t.feat.map(function(f,i){return <div key={i} style={{fontSize:12,color:"rgba(255,255,255,.4)",padding:"5px 0",borderBottom:"1px solid rgba(255,255,255,.03)",display:"flex",gap:6}}><span style={{color:"#cdff32",fontSize:9}}>+</span>{f}</div>;})}</div>
              <button style={t.hi?btnS(true,false,true):Object.assign({},btnS(false,false,true),{border:"1px solid rgba(205,255,50,.2)",background:"rgba(205,255,50,.06)",color:"#cdff32"})}>{t.cta}</button>
            </div>
          );})}
        </div>
      </div>}

      {/* ===== UPLOAD ===== */}
      {view==="upload"&&<div style={{maxWidth:480,margin:"0 auto",padding:"32px 20px"}}>
        <h2 style={{fontFamily:"var(--hd)",fontSize:22,fontWeight:700,marginBottom:6,textAlign:"center"}}>Upload Your Photos</h2>
        <p style={{fontSize:12,color:"rgba(255,255,255,.3)",textAlign:"center",marginBottom:20}}>Front required. Back + legs for complete analysis.</p>



        <div style={{display:"flex",gap:10,marginBottom:20}}>
          <PhotoSlot label="Front" image={fI} onUpload={handlePhoto(setFI,setFD)} req={true}/>
          <PhotoSlot label="Back" image={bI} onUpload={handlePhoto(setBI,setBD)}/>
          <PhotoSlot label="Legs" image={lI} onUpload={handlePhoto(setLI,setLD)}/>
        </div>

        {/* Height & Weight */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8,marginBottom:12}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4}}>Feet</div>
            <select value={heightFt} onChange={function(e){setHeightFt(e.target.value);}} style={selS}>
              <option value="" style={{background:"#1a1a24"}}>--</option>
              <option value="4" style={{background:"#1a1a24"}}>4 ft</option>
              <option value="5" style={{background:"#1a1a24"}}>5 ft</option>
              <option value="6" style={{background:"#1a1a24"}}>6 ft</option>
              <option value="7" style={{background:"#1a1a24"}}>7 ft</option>
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4}}>Inches</div>
            <select value={heightIn} onChange={function(e){setHeightIn(e.target.value);}} style={selS}>
              {[0,1,2,3,4,5,6,7,8,9,10,11].map(function(n){return <option key={n} value={String(n)} style={{background:"#1a1a24"}}>{n} in</option>;})}
            </select>
          </div>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4}}>Weight (lbs)</div>
            <input type="number" min="50" max="500" placeholder="Current" value={weight} onChange={function(e){setWeight(e.target.value.replace(/[^0-9]/g,""));}} style={inpS}/>
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:16}}>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4}}>Goal Weight (lbs)</div>
            <input type="number" min="80" max="400" placeholder="Optional" value={goalWeight} onChange={function(e){setGoalWeight(e.target.value.replace(/[^0-9]/g,""));}} style={inpS}/>
          </div>
          <div>
            <div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:4}}>Promo Code</div>
            <div style={{display:"flex",gap:4}}>
              <input placeholder="Optional" value={promoCode} onChange={function(e){setPromoCode(e.target.value);setPromoValid(null);setPromoMsg("");}} style={Object.assign({},inpS,{flex:1})}/>
              <button onClick={validatePromo} style={{padding:"9px 12px",borderRadius:7,border:"none",background:"rgba(205,255,50,.15)",color:"#cdff32",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"var(--hd)",whiteSpace:"nowrap"}}>Apply</button>
            </div>
            {promoMsg&&<div style={{fontSize:10,marginTop:4,color:promoValid?"#cdff32":"#ff3266"}}>{promoValid?"✓ ":"✗ "}{promoMsg}</div>}
          </div>
        </div>
        <div style={{textAlign:"center",marginBottom:12,fontSize:11,color:"rgba(255,255,255,.2)"}}>{scanCount}/{maxScans} scans used{!eSaved && scanCount >= 3 ? " - add email for 5 more" : ""}</div>

        {!eSaved&&<div style={{marginBottom:16,display:"flex",gap:8}}>
          <input placeholder="Email (optional)" value={email} onChange={function(e){setEmail(e.target.value);}} style={Object.assign({},inpS,{flex:1})}/>
          <button onClick={function(){if(email.includes("@"))setESaved(true);}} style={{padding:"9px 14px",borderRadius:7,border:"none",background:"rgba(205,255,50,.15)",color:"#cdff32",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"var(--hd)",whiteSpace:"nowrap"}}>Save</button>
        </div>}

        <div style={{display:"flex",gap:8,justifyContent:"center"}}>
          <button style={btnS(false)} onClick={reset}>Back</button>
          <button style={Object.assign({},btnS(true),{opacity:fD?1:.5,cursor:fD?"pointer":"not-allowed"})} disabled={!fD} onClick={runScan}>Analyze</button>
        </div>
      </div>}

      {/* ===== SCANNING ===== */}
      {view==="scanning"&&<div style={{maxWidth:480,margin:"0 auto",padding:"80px 24px",textAlign:"center"}}>
        <div style={{width:80,height:80,borderRadius:"50%",border:"3px solid rgba(255,255,255,.04)",borderTopColor:"#cdff32",margin:"0 auto 24px",animation:"bspin .8s linear infinite"}}/>
        <h2 style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:600,marginBottom:8}}>{genT==="scan"?"Scanning...":genT==="train"?"Building Plan...":"Building Meals..."}</h2>
        <p style={{color:"rgba(255,255,255,.3)",fontSize:12,marginBottom:24}}>{(genT==="scan"?SCAN_LABELS:genT==="train"?PLAN_LABELS:MEAL_LABELS)[Math.min(Math.floor(prog/14),6)]}</p>
        <div style={{height:4,borderRadius:2,background:"rgba(255,255,255,.04)",maxWidth:260,margin:"0 auto",overflow:"hidden"}}><div style={{height:"100%",borderRadius:2,background:"linear-gradient(90deg,#cdff32,#32d4ff)",width:prog+"%",transition:"width .2s"}}/></div>
      </div>}

      {/* ===== RESULTS ===== */}
      {view==="results"&&results&&<div style={{maxWidth:580,margin:"0 auto",padding:"12px 20px 80px"}}>

        {/* Main tabs */}
        <div style={{display:"flex",gap:4,padding:3,borderRadius:11,background:"rgba(255,255,255,.03)",marginBottom:16}}>
          {["scan","train","meals"].map(function(t){return <button key={t} onClick={function(){setTab(t);}} style={{flex:1,padding:"9px 0",borderRadius:9,border:"none",background:tab===t?"rgba(205,255,50,.08)":"transparent",color:tab===t?"#cdff32":"rgba(255,255,255,.3)",fontFamily:"var(--hd)",fontSize:11,fontWeight:600,cursor:"pointer"}}>{t==="scan"?"📊 Scan":t==="train"?"🏋️ Train":"🥗 Meals"}</button>;})}
        </div>

        {/* SCAN TAB */}
        {tab==="scan"&&<>
          <div style={cardS()}>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
              {fI&&<div style={{width:100,height:130,borderRadius:9,overflow:"hidden",flexShrink:0,border:"2px solid rgba(255,255,255,.05)"}}><img src={fI} alt="" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>}
              <div style={{flex:1,minWidth:150}}>
                <div style={lblS()}>Your Verdict</div>
                <div style={{fontFamily:"var(--hd)",fontSize:46,fontWeight:700,lineHeight:1,marginBottom:4,letterSpacing:"-.04em"}}>{results.rating}<span style={{fontSize:16,color:"rgba(255,255,255,.15)"}}>/10</span></div>
                <RatingBlocks rating={results.rating}/>
                <div style={{marginTop:10,display:"inline-block",padding:"4px 12px",borderRadius:6,fontFamily:"var(--hd)",fontSize:11,fontWeight:700,background:vc+"15",color:vc,border:"1px solid "+vc+"30"}}>{results.verdict&&results.verdict.toUpperCase()}</div>
              </div>
            </div>
          </div>

          <div style={cardS()}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div><div style={lblS()}>Est. Body Fat</div><div style={{fontFamily:"var(--hd)",fontSize:22,fontWeight:700}}>{results.bodyFatEstimate}</div></div>
              {results.recommendedCalories&&<div style={{textAlign:"right"}}><div style={{fontSize:10,color:"rgba(255,255,255,.2)"}}>Recommended</div><div style={{fontFamily:"var(--hd)",fontSize:16,fontWeight:700,color:"#cdff32"}}>{results.recommendedCalories} cal</div><div style={{fontSize:10,color:"rgba(255,255,255,.2)"}}>{results.recommendedProtein}g protein</div></div>}
            </div>
            <p style={{fontSize:13,color:"rgba(255,255,255,.4)",lineHeight:1.6,margin:0}}>{results.verdictReason}</p>
          </div>

          {results.bulkCalories&&<div style={cardS()}>
            <div style={lblS()}>Calorie Targets</div>
            <div style={{display:"flex",gap:8}}>
              <div style={{flex:1,padding:12,borderRadius:8,textAlign:"center",background:results.verdict==="Bulk"?"rgba(50,212,255,.1)":"rgba(255,255,255,.03)",border:results.verdict==="Bulk"?"1px solid rgba(50,212,255,.2)":"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginBottom:4}}>Bulk</div>
                <div style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:700,color:results.verdict==="Bulk"?"#32d4ff":"rgba(255,255,255,.4)"}}>{results.bulkCalories}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.15)"}}>+500 surplus</div>
              </div>
              <div style={{flex:1,padding:12,borderRadius:8,textAlign:"center",background:results.verdict==="Recomp"?"rgba(255,165,50,.1)":"rgba(255,255,255,.03)",border:results.verdict==="Recomp"?"1px solid rgba(255,165,50,.2)":"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginBottom:4}}>Maintain</div>
                <div style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:700,color:results.verdict==="Recomp"?"#ffa532":"rgba(255,255,255,.4)"}}>{results.maintenanceCalories}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.15)"}}>TDEE</div>
              </div>
              <div style={{flex:1,padding:12,borderRadius:8,textAlign:"center",background:results.verdict==="Cut"?"rgba(255,50,102,.1)":"rgba(255,255,255,.03)",border:results.verdict==="Cut"?"1px solid rgba(255,50,102,.2)":"1px solid rgba(255,255,255,.04)"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginBottom:4}}>Cut</div>
                <div style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:700,color:results.verdict==="Cut"?"#ff3266":"rgba(255,255,255,.4)"}}>{results.cutCalories}</div>
                <div style={{fontSize:9,color:"rgba(255,255,255,.15)"}}>-500 deficit</div>
              </div>
            </div>
          </div>}

          <div style={cardS()}><div style={lblS()}>Analysis</div><p style={{fontSize:13,color:"rgba(255,255,255,.45)",lineHeight:1.6,margin:0}}>{results.summary}</p></div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            <div style={cardS()}><div style={lblS("#cdff32")}>Strengths</div>{results.strengths&&results.strengths.map(function(s,i){return <div key={i} style={{fontSize:11,color:"rgba(255,255,255,.4)",padding:"3px 0",display:"flex",gap:5}}><span style={{color:"#cdff32",fontSize:9}}>+</span>{s}</div>;})}</div>
            <div style={cardS()}><div style={lblS("#ff3266")}>Needs Work</div>{results.weaknesses&&results.weaknesses.map(function(w,i){return <div key={i} style={{fontSize:11,color:"rgba(255,255,255,.4)",padding:"3px 0",display:"flex",gap:5}}><span style={{color:"#ff3266",fontSize:9}}>!</span>{w}</div>;})}</div>
          </div>

          <div style={cardS()}><div style={lblS()}>Muscle Breakdown</div>{results.bodyParts&&Object.entries(results.bodyParts).map(function(entry){return <ScoreBar key={entry[0]} label={entry[0][0].toUpperCase()+entry[0].slice(1)} score={entry[1]}/>;})}</div>

          <div style={Object.assign({},cardS(true),{textAlign:"center"})}>
            <div style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:700,marginBottom:8}}>Build your plan</div>
            <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap"}}>
              <button onClick={function(){setTab("train");setTSub("plan");}} style={Object.assign({},btnS(false,true),{background:"rgba(205,255,50,.1)",border:"1px solid rgba(205,255,50,.2)",color:"#cdff32"})}>Training Plan{!isPaid?" (Basic)":""}</button>
              <button onClick={function(){setTab("meals");setMSub("plan");}} style={Object.assign({},btnS(false,true),{background:"rgba(50,212,255,.1)",border:"1px solid rgba(50,212,255,.2)",color:"#32d4ff"})}>Meal Plan{!isPaid?" (Basic)":""}</button>
            </div>
            {!isPaid&&<div style={{marginTop:12,padding:"10px 16px",borderRadius:8,background:"rgba(205,255,50,.04)",border:"1px solid rgba(205,255,50,.08)"}}>
              <div style={{fontSize:11,color:"#cdff32",fontFamily:"var(--hd)",fontWeight:600,marginBottom:4}}>Want the full experience?</div>
              <div style={{fontSize:10,color:"rgba(255,255,255,.3)",lineHeight:1.5}}>Upgrade for deeper analysis, advanced training programs with periodization, complete 7-day meal plans, unlimited scans, and priority support.</div>
              <button onClick={function(){checkout("transform");}} style={Object.assign({},btnS(true,true),{marginTop:8})}>Upgrade - $19.99/mo</button>
            </div>}
          </div>
        </>}

        {/* TRAIN TAB */}
        {tab==="train"&&<>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[{id:"plan",l:"My Plan"},{id:"log",l:"Log"},{id:"hist",l:"History"}].map(function(t){return <button key={t.id} onClick={function(){setTSub(t.id);}} style={subBtnS(tSub===t.id)}>{t.l}</button>;})}
          </div>

          {tSub==="plan"&&<>
            {!tPlan?<div style={cardS(true)}>
              <div style={lblS("#cdff32")}>Build Your Program</div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Days/Week</div><select value={tDays} onChange={function(e){setTDays(e.target.value);}} style={selS}><option value="3" style={{background:"#1a1a24"}}>3</option><option value="4" style={{background:"#1a1a24"}}>4</option><option value="5" style={{background:"#1a1a24"}}>5</option><option value="6" style={{background:"#1a1a24"}}>6</option></select></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Equipment</div><select value={tEquip} onChange={function(e){setTEquip(e.target.value);}} style={selS}><option value="full gym" style={{background:"#1a1a24"}}>Full Gym</option><option value="dumbbells only" style={{background:"#1a1a24"}}>Dumbbells</option><option value="home gym basics" style={{background:"#1a1a24"}}>Home Gym</option><option value="bodyweight only" style={{background:"#1a1a24"}}>Bodyweight</option></select></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Experience</div><select value={tExp} onChange={function(e){setTExp(e.target.value);}} style={selS}><option value="beginner" style={{background:"#1a1a24"}}>Beginner</option><option value="intermediate" style={{background:"#1a1a24"}}>Intermediate</option><option value="advanced" style={{background:"#1a1a24"}}>Advanced</option></select></div>
              <button style={btnS(true,false,true)} onClick={genTrain}>Generate Plan</button>
            </div>:<>
              <div style={cardS(true)}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div><div style={lblS("#cdff32")}>Your Program</div><div style={{fontFamily:"var(--hd)",fontSize:20,fontWeight:700}}>{tPlan.programName||"Custom Program"}</div></div>
                  {tPlan.split&&<div style={{padding:"4px 10px",borderRadius:6,background:"rgba(205,255,50,.08)",border:"1px solid rgba(205,255,50,.15)",fontFamily:"var(--hd)",fontSize:11,fontWeight:600,color:"#cdff32"}}>{tPlan.split}</div>}
                </div>
                {tPlan.overview&&<p style={{fontSize:12,color:"rgba(255,255,255,.35)",lineHeight:1.5,marginTop:10,marginBottom:0}}>{tPlan.overview}</p>}
              </div>
              {(tPlan.days||[]).map(function(day,di){return <div key={di} style={cardS()}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                  <div style={{fontFamily:"var(--hd)",fontSize:14,fontWeight:700,color:"#cdff32"}}>{day.day||"Day "+(di+1)}</div>
                  <button style={btnS(false,true)} onClick={function(){setADayI(di);setTSub("log");}}>Start</button>
                </div>
                {day.warmup&&<div style={{fontSize:11,color:"rgba(255,255,255,.2)",marginBottom:8,fontStyle:"italic"}}>{day.warmup}</div>}
                {(day.exercises||[]).map(function(ex,ei){return <div key={ei} style={{display:"flex",justifyContent:"space-between",padding:"7px 0",borderBottom:ei<(day.exercises||[]).length-1?"1px solid rgba(255,255,255,.03)":"none"}}>
                  <div><div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{ex.name}</div>{ex.note&&<div style={{fontSize:10,color:"rgba(255,255,255,.2)",marginTop:1}}>{ex.note}</div>}</div>
                  <div style={{textAlign:"right"}}><div style={{fontFamily:"var(--hd)",fontSize:11,fontWeight:600,color:"rgba(255,255,255,.3)"}}>{ex.sets}x{ex.reps}</div>{ex.rest&&<div style={{fontSize:9,color:"rgba(255,255,255,.15)"}}>{ex.rest}</div>}</div>
                </div>;})}
              </div>;})}
              <button style={Object.assign({},btnS(false,false,true),{color:"rgba(255,255,255,.2)"})} onClick={function(){setTPlan(null);save("tPlan",null);}}>Regenerate</button>
              {!isPaid&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:8,background:"rgba(205,255,50,.04)",border:"1px solid rgba(205,255,50,.08)",textAlign:"center"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Free plan: basic exercises. Upgrade for advanced programming with periodization, tempo prescriptions, and RPE targets.</div>
                <button onClick={function(){checkout("train");}} style={Object.assign({},btnS(true,true),{marginTop:6})}>Upgrade - $9.99/mo</button>
              </div>}
            </>}
          </>}

          {tSub==="log"&&<>
            {tPlan&&aDayI!=null?<>
              <div style={cardS(true)}><div style={lblS("#cdff32")}>Active Workout</div><div style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:700}}>{tPlan.days&&tPlan.days[aDayI]&&tPlan.days[aDayI].day}</div></div>
              {(tPlan.days&&tPlan.days[aDayI]&&tPlan.days[aDayI].exercises||[]).map(function(ex,ei){
                var logged=wLog[todayStr()]&&wLog[todayStr()].days&&wLog[todayStr()].days[aDayI]&&wLog[todayStr()].days[aDayI].ex&&wLog[todayStr()].days[aDayI].ex[ei]?wLog[todayStr()].days[aDayI].ex[ei].sets:[];
                return <div key={ei} style={Object.assign({},cardS(),{border:aExI===ei?"1px solid rgba(205,255,50,.25)":"1px solid rgba(255,255,255,.04)"})}>
                  <div onClick={function(){setAExI(aExI===ei?null:ei);}} style={{cursor:"pointer",display:"flex",justifyContent:"space-between"}}>
                    <div><div style={{fontSize:13,fontWeight:500,color:"rgba(255,255,255,.65)"}}>{ex.name}</div><div style={{fontSize:11,color:"rgba(255,255,255,.2)"}}>{ex.sets}x{ex.reps}</div></div>
                    <div style={{fontFamily:"var(--hd)",fontSize:11,fontWeight:700,color:logged.length?"#cdff32":"rgba(255,255,255,.15)"}}>{logged.length} sets</div>
                  </div>
                  {logged.length>0&&<div style={{marginTop:8}}>{logged.map(function(s,si){return <div key={si} style={{display:"flex",justifyContent:"space-between",padding:"3px 0",fontSize:11,color:"rgba(255,255,255,.3)"}}><span>Set {si+1}</span><span style={{fontFamily:"var(--hd)"}}>{s.w}lbs x {s.r}</span></div>;})}</div>}
                  {aExI===ei&&<div style={{marginTop:10,display:"flex",gap:6,alignItems:"center"}}>
                    <input type="number" placeholder="lbs" value={sIn.w} onChange={function(e){setSIn(Object.assign({},sIn,{w:e.target.value}));}} style={Object.assign({},inpS,{width:70})}/>
                    <span style={{color:"rgba(255,255,255,.15)",fontSize:11}}>x</span>
                    <input type="number" placeholder="reps" value={sIn.r} onChange={function(e){setSIn(Object.assign({},sIn,{r:e.target.value}));}} style={Object.assign({},inpS,{width:70})}/>
                    <button style={Object.assign({},btnS(true,true),{opacity:sIn.w&&sIn.r?1:.5,transition:"all .3s",transform:logAnim===ei?"scale(1.2)":"scale(1)"})} disabled={!sIn.w||!sIn.r} onClick={function(){logSet(aDayI,ei,sIn.w,sIn.r);}}>{logAnim===ei?"\u2713 Logged":"Log"}</button>
                  </div>}
                </div>;
              })}
              <button style={btnS(true,false,true)} onClick={function(){setADayI(null);setTSub("hist");}}>Finish Workout</button>
            </>:<div style={Object.assign({},cardS(),{textAlign:"center",padding:36})}><p style={{color:"rgba(255,255,255,.25)",marginBottom:12}}>Select a workout from your plan.</p><button style={btnS(false)} onClick={function(){setTSub("plan");}}>Go to Plan</button></div>}
          </>}

          {tSub==="hist"&&<>
            {Object.keys(wLog).length===0?<div style={Object.assign({},cardS(),{textAlign:"center",padding:36})}><p style={{color:"rgba(255,255,255,.2)"}}>No workouts logged yet.</p></div>
            :Object.keys(wLog).sort().reverse().map(function(dk){return <div key={dk} style={cardS()}>
              <div style={lblS()}>{new Date(dk+"T12:00:00").toLocaleDateString("en-US",{weekday:"short",month:"short",day:"numeric"})}</div>
              {Object.keys(wLog[dk].days||{}).map(function(di){return <div key={di}>
                <div style={{fontFamily:"var(--hd)",fontSize:13,fontWeight:600,color:"#cdff32",marginBottom:6}}>{tPlan&&tPlan.days&&tPlan.days[di]?tPlan.days[di].day:"Day "+(parseInt(di)+1)}</div>
                {Object.keys((wLog[dk].days[di]||{}).ex||{}).map(function(ei){
                  var sets=wLog[dk].days[di].ex[ei].sets;
                  var best=sets.reduce(function(m,s){return s.w>m.w?s:m;},{w:0,r:0});
                  return <div key={ei} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.03)",fontSize:12}}>
                    <span style={{color:"rgba(255,255,255,.45)"}}>{tPlan&&tPlan.days&&tPlan.days[di]&&tPlan.days[di].exercises&&tPlan.days[di].exercises[ei]?tPlan.days[di].exercises[ei].name:"Exercise"}</span>
                    <span style={{color:"rgba(255,255,255,.25)",fontFamily:"var(--hd)"}}>{sets.length}s | {best.w}x{best.r}</span>
                  </div>;
                })}
              </div>;})}
            </div>;})}
          </>}
        </>}

        {/* MEALS TAB */}
        {tab==="meals"&&<>
          <div style={{display:"flex",gap:6,marginBottom:14}}>
            {[{id:"plan",l:"Plan"},{id:"log",l:"Food Log"},{id:"tracker",l:"Macros"}].map(function(t){return <button key={t.id} onClick={function(){setMSub(t.id);}} style={Object.assign({},subBtnS(mSub===t.id),{background:mSub===t.id?"rgba(50,212,255,.1)":"rgba(255,255,255,.03)",color:mSub===t.id?"#32d4ff":"rgba(255,255,255,.25)"})}>{t.l}</button>;})}
          </div>

          {mSub==="plan"&&<>
            {!mPlan?<div style={cardS(true)}>
              <div style={lblS("#32d4ff")}>Build Your Meal Plan</div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Diet</div><select value={mDiet} onChange={function(e){setMDiet(e.target.value);}} style={selS}>{["no restrictions","vegetarian","vegan","keto","halal","gluten free"].map(function(d){return <option key={d} value={d} style={{background:"#1a1a24"}}>{d[0].toUpperCase()+d.slice(1)}</option>;})}</select></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Carbs</div><select value={carbPref} onChange={function(e){setCarbPref(e.target.value);}} style={selS}><option value="low" style={{background:"#1a1a24"}}>Low Carb</option><option value="moderate" style={{background:"#1a1a24"}}>Moderate</option><option value="high" style={{background:"#1a1a24"}}>High Carb</option></select></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Protein</div><select value={proPref} onChange={function(e){setProPref(e.target.value);}} style={selS}><option value="standard" style={{background:"#1a1a24"}}>Standard</option><option value="high" style={{background:"#1a1a24"}}>High</option><option value="very high" style={{background:"#1a1a24"}}>Very High</option></select></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Budget</div><select value={mBudget} onChange={function(e){setMBudget(e.target.value);}} style={selS}><option value="tight" style={{background:"#1a1a24"}}>College Budget</option><option value="moderate" style={{background:"#1a1a24"}}>Moderate</option><option value="flexible" style={{background:"#1a1a24"}}>Flexible</option></select></div>
              <div style={{marginBottom:12}}><div style={{fontSize:11,color:"rgba(255,255,255,.3)",marginBottom:5}}>Meals/Day</div><select value={mCount} onChange={function(e){setMCount(e.target.value);}} style={selS}><option value="3" style={{background:"#1a1a24"}}>3</option><option value="4" style={{background:"#1a1a24"}}>4</option><option value="5" style={{background:"#1a1a24"}}>5</option></select></div>
              <button style={btnS(true,false,true)} onClick={genMeals}>Generate 7-Day Plan</button>
            </div>:<>
              <div style={cardS(true)}>
                <div style={{display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:8}}>
                  <div><div style={lblS("#32d4ff")}>Your Meal Plan</div><div style={{fontFamily:"var(--hd)",fontSize:20,fontWeight:700}}>{mPlan.planName}</div></div>
                  <div style={{padding:"4px 10px",borderRadius:6,background:"rgba(50,212,255,.08)",border:"1px solid rgba(50,212,255,.15)",fontFamily:"var(--hd)",fontSize:11,fontWeight:600,color:"#32d4ff"}}>{mPlan.dailyCalories} cal</div>
                </div>
                {mPlan.overview&&<p style={{fontSize:12,color:"rgba(255,255,255,.35)",lineHeight:1.5,marginTop:10,marginBottom:0}}>{mPlan.overview}</p>}
              </div>

              <div style={cardS()}><div style={lblS()}>Daily Macros</div>
                <div style={{display:"flex",gap:10}}>
                  {[{l:"Protein",v:mPlan.macros&&mPlan.macros.protein,c:"#cdff32"},{l:"Carbs",v:mPlan.macros&&mPlan.macros.carbs,c:"#32d4ff"},{l:"Fat",v:mPlan.macros&&mPlan.macros.fat,c:"#ffa532"}].map(function(m){return <div key={m.l} style={{flex:1,padding:12,borderRadius:8,textAlign:"center",background:m.c+"08",border:"1px solid "+m.c+"18"}}><div style={{fontFamily:"var(--hd)",fontSize:18,fontWeight:700,color:m.c}}>{m.v}</div><div style={{fontSize:10,color:"rgba(255,255,255,.25)",marginTop:2}}>{m.l}</div></div>;})}
                </div>
              </div>

              {/* Day tabs for weekly plan */}
              {mPlan.weeklyPlan&&<>
                <div style={{display:"flex",gap:4,marginBottom:12,overflowX:"auto",paddingBottom:4}}>
                  {mPlan.weeklyPlan.map(function(d,i){return <button key={i} onClick={function(){setMDayIdx(i);}} style={{padding:"6px 12px",borderRadius:7,border:"none",background:mDayIdx===i?"rgba(50,212,255,.12)":"rgba(255,255,255,.03)",color:mDayIdx===i?"#32d4ff":"rgba(255,255,255,.2)",fontSize:10,fontWeight:600,cursor:"pointer",fontFamily:"var(--hd)",whiteSpace:"nowrap"}}>{(d.dayName||DAYS_LIST[i]).slice(0,3)}</button>;})}
                </div>
                {curWeekDay&&(curWeekDay.meals||[]).map(function(meal,mi){return <div key={mi} style={cardS()}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                    <div style={{fontFamily:"var(--hd)",fontSize:13,fontWeight:700,color:"#32d4ff"}}>{meal.meal}</div>
                    {meal.mealCalories&&<span style={{fontSize:11,color:"rgba(255,255,255,.2)",fontFamily:"var(--hd)"}}>{meal.mealCalories} cal</span>}
                  </div>
                  {(meal.foods||[]).map(function(f,fi){return <div key={fi} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:fi<(meal.foods||[]).length-1?"1px solid rgba(255,255,255,.03)":"none"}}>
                    <div style={{flex:1}}><div style={{fontSize:12,color:"rgba(255,255,255,.55)"}}>{f.item}</div><div style={{fontSize:10,color:"rgba(255,255,255,.15)"}}>{f.amount}</div></div>
                    <div style={{display:"flex",gap:8,alignItems:"center",fontSize:10,flexShrink:0}}>
                      <span style={{color:"#cdff32"}}>{f.protein||0}p</span>
                      <span style={{color:"#32d4ff"}}>{f.carbs||0}c</span>
                      <span style={{color:"#ffa532"}}>{f.fat||0}f</span>
                      <span style={{color:"rgba(255,255,255,.3)",fontFamily:"var(--hd)",fontWeight:600}}>{f.calories}</span>
                      <button onClick={function(){addFood({name:f.item,calories:f.calories||0,protein:f.protein||0,carbs:f.carbs||0,fat:f.fat||0,serving:f.amount},meal.meal);}} style={{background:foodLogAnim?"rgba(205,255,50,.3)":"rgba(205,255,50,.1)",border:"none",color:"#cdff32",fontSize:9,padding:"3px 6px",borderRadius:4,cursor:"pointer",fontWeight:600,transition:"all .3s"}}>{foodLogAnim?"\u2713":"+Log"}</button>
                    </div>
                  </div>;})}
                </div>;})}
              </>}

              {/* Fallback for old format */}
              {!mPlan.weeklyPlan&&mPlan.meals&&mPlan.meals.map(function(meal,mi){return <div key={mi} style={cardS()}>
                <div style={{fontFamily:"var(--hd)",fontSize:13,fontWeight:700,color:"#32d4ff",marginBottom:8}}>{meal.meal}</div>
                {(meal.foods||[]).map(function(f,fi){return <div key={fi} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                  <div><div style={{fontSize:12,color:"rgba(255,255,255,.55)"}}>{f.item}</div><div style={{fontSize:10,color:"rgba(255,255,255,.15)"}}>{f.amount}</div></div>
                  <div style={{fontSize:10,display:"flex",gap:6,alignItems:"center"}}><span style={{color:"#cdff32"}}>{f.protein||0}p</span><span style={{color:"#32d4ff"}}>{f.carbs||0}c</span><span style={{color:"#ffa532"}}>{f.fat||0}f</span><span style={{color:"rgba(255,255,255,.3)",fontFamily:"var(--hd)"}}>{f.calories}</span></div>
                </div>;})}
              </div>;})}

              {mPlan.groceryList&&<div style={cardS()}>
                <div style={lblS()}>Grocery List</div>
                {mPlan.groceryList.map(function(g,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"4px 0",borderBottom:"1px solid rgba(255,255,255,.03)",fontSize:12}}>
                  <span style={{color:"rgba(255,255,255,.45)"}}>{typeof g==="string"?g:g.item}</span>
                  {g.estimatedCost&&<span style={{color:"#cdff32",fontFamily:"var(--hd)",fontSize:11}}>{g.estimatedCost}</span>}
                </div>;})}
                {mPlan.weeklyGroceryCost&&<div style={{marginTop:8,textAlign:"right",fontFamily:"var(--hd)",fontSize:14,fontWeight:700,color:"#cdff32"}}>{mPlan.weeklyGroceryCost}/week</div>}
              </div>}
              <button style={Object.assign({},btnS(false,false,true),{color:"rgba(255,255,255,.2)"})} onClick={function(){setMPlan(null);save("mPlan",null);}}>Regenerate Plan</button>
              {!isPaid&&<div style={{marginTop:10,padding:"10px 14px",borderRadius:8,background:"rgba(50,212,255,.04)",border:"1px solid rgba(50,212,255,.08)",textAlign:"center"}}>
                <div style={{fontSize:10,color:"rgba(255,255,255,.3)"}}>Free plan: 2-day rotation. Upgrade for 4-day meal variety, detailed grocery lists with prices, and prep instructions.</div>
                <button onClick={function(){checkout("transform");}} style={Object.assign({},btnS(true,true),{marginTop:6})}>Upgrade - $19.99/mo</button>
              </div>}
            </>}
          </>}

          {mSub==="log"&&<>
            <div style={cardS()}>
              <div style={lblS("#32d4ff")}>Search Foods</div>
              <div style={{display:"flex",gap:6,marginBottom:10}}>
                <input placeholder="chicken breast, rice..." value={fSrch} onChange={function(e){setFSrch(e.target.value);}} onKeyDown={function(e){if(e.key==="Enter")searchFood();}} style={Object.assign({},inpS,{flex:1})}/>
                <button style={Object.assign({},btnS(true,true),{opacity:sF||!fSrch.trim()?.5:1})} disabled={sF||!fSrch.trim()} onClick={searchFood}>{sF?"...":"Search"}</button>
              </div>
              {fRes.map(function(f,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                <div><div style={{fontSize:13,color:"rgba(255,255,255,.6)"}}>{f.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,.2)"}}>{f.serving} | {f.calories}cal | {f.protein}p {f.carbs}c {f.fat}f</div></div>
                <button style={btnS(false,true)} onClick={function(){addFood(f,"Search");setFRes([]);setFSrch("");}}>+Add</button>
              </div>;})}
            </div>

            <div style={cardS()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
                <div style={lblS("#ffa532")}>Quick Add</div>
                <button onClick={function(){setQaOpen(!qaOpen);}} style={{background:"none",border:"none",color:"#ffa532",fontSize:18,cursor:"pointer"}}>{qaOpen?"\u2212":"+"}</button>
              </div>
              {qaOpen&&<>
                <input placeholder="Food name" value={qa.n} onChange={function(e){setQa(Object.assign({},qa,{n:e.target.value}));}} style={Object.assign({},inpS,{marginBottom:6})}/>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:6}}>
                  <input type="number" placeholder="Calories" value={qa.cal} onChange={function(e){setQa(Object.assign({},qa,{cal:e.target.value}));}} style={inpS}/>
                  <input type="number" placeholder="Protein" value={qa.p} onChange={function(e){setQa(Object.assign({},qa,{p:e.target.value}));}} style={inpS}/>
                  <input type="number" placeholder="Carbs" value={qa.c} onChange={function(e){setQa(Object.assign({},qa,{c:e.target.value}));}} style={inpS}/>
                  <input type="number" placeholder="Fat" value={qa.f} onChange={function(e){setQa(Object.assign({},qa,{f:e.target.value}));}} style={inpS}/>
                </div>
                <button style={Object.assign({},btnS(false,true,true),{opacity:qa.n&&qa.cal?1:.5})} disabled={!qa.n||!qa.cal} onClick={addQF}>Add Food</button>
              </>}
            </div>

            <div style={cardS()}>
              <div style={lblS()}>Today's Log</div>
              {!((fLog[selDate]||{}).meals||[]).length?<p style={{fontSize:12,color:"rgba(255,255,255,.15)",textAlign:"center",padding:12}}>Nothing logged.</p>
              :((fLog[selDate]||{}).meals||[]).map(function(f,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                <div><div style={{fontSize:12,color:"rgba(255,255,255,.55)"}}>{f.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,.15)"}}>{f.protein||0}p {f.carbs||0}c {f.fat||0}f</div></div>
                <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,fontFamily:"var(--hd)",color:"rgba(255,255,255,.35)"}}>{f.calories}</span><button onClick={function(){rmFood(selDate,i);}} style={{background:"none",border:"none",color:"rgba(255,50,50,.3)",fontSize:14,cursor:"pointer"}}>{"\u00D7"}</button></div>
              </div>;})}
            </div>
          </>}

          {mSub==="tracker"&&<>
            <div style={cardS()}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
                <div style={lblS()}>Daily Progress</div>
                <input type="date" value={selDate} onChange={function(e){setSelDate(e.target.value);}} style={{background:"rgba(255,255,255,.04)",border:"1px solid rgba(255,255,255,.06)",borderRadius:7,padding:"5px 8px",color:"#fff",fontSize:11,fontFamily:"var(--bd)"}}/>
              </div>
              <div style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:12,color:"rgba(255,255,255,.4)"}}>Calories</span>
                  <span style={{fontFamily:"var(--hd)",fontSize:13,fontWeight:700}}><span style={{color:dm.cal>mt.cal?"#ff3266":"#cdff32"}}>{dm.cal}</span><span style={{color:"rgba(255,255,255,.15)"}}> / {mt.cal}</span></span>
                </div>
                <div style={{height:8,borderRadius:4,background:"rgba(255,255,255,.04)",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,width:Math.min((dm.cal/mt.cal)*100,100)+"%",background:dm.cal>mt.cal?"#ff3266":"linear-gradient(90deg,#cdff32,#a8e600)",transition:"width .5s"}}/></div>
                <div style={{fontSize:10,color:"rgba(255,255,255,.15)",marginTop:3}}>{Math.max(mt.cal-dm.cal,0)} remaining</div>
              </div>
              <div style={{display:"flex",gap:6,justifyContent:"center"}}>
                <MacroRing label="Protein" cur={dm.p} target={mt.p} color="#cdff32"/>
                <MacroRing label="Carbs" cur={dm.c} target={mt.c} color="#32d4ff"/>
                <MacroRing label="Fat" cur={dm.f} target={mt.f} color="#ffa532"/>
              </div>
            </div>

            <div style={cardS()}>
              <div style={lblS()}>Meals Logged</div>
              {!((fLog[selDate]||{}).meals||[]).length?<p style={{fontSize:12,color:"rgba(255,255,255,.15)",textAlign:"center",padding:12}}>Nothing logged.</p>
              :((fLog[selDate]||{}).meals||[]).map(function(f,i){return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"6px 0",borderBottom:"1px solid rgba(255,255,255,.03)"}}>
                <div><div style={{fontSize:12,color:"rgba(255,255,255,.5)"}}>{f.name}</div><div style={{fontSize:10,color:"rgba(255,255,255,.15)"}}>{f.slot}</div></div>
                <div style={{display:"flex",gap:10,alignItems:"center",fontSize:10}}>
                  <span style={{color:"#cdff32"}}>{f.protein||0}p</span>
                  <span style={{color:"#32d4ff"}}>{f.carbs||0}c</span>
                  <span style={{color:"#ffa532"}}>{f.fat||0}f</span>
                  <span style={{color:"rgba(255,255,255,.3)",fontFamily:"var(--hd)",fontWeight:600}}>{f.calories}</span>
                </div>
              </div>;})}
            </div>
            <button onClick={function(){setMSub("log");}} style={Object.assign({},btnS(false,false,true),{background:"rgba(50,212,255,.08)",border:"1px solid rgba(50,212,255,.12)",color:"#32d4ff"})}>+ Log Food</button>
          </>}
        </>}
      </div>}
    </div>
  );
}
