import { useState, useEffect, useRef } from "react";

// ════════════════════════════════════════════════════════════════
//  NEXUS EMPIRE v4.0 — AUTONOMOUS AGENT OPERATING SYSTEM
//  by MHD Amine · NeuralForge · Algeria 🇩🇿
//  neuralforgebabal-hue · github.com/neuralforgebabal-hue
// ════════════════════════════════════════════════════════════════

const callClaude = async (system, user, history = []) => {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages: [...history, { role: "user", content: user }],
    }),
  });
  const d = await r.json();
  if (d.error) throw new Error(d.error.message);
  return d.content[0].text;
};

// ─── AGENTS ────────────────────────────────────────────────────
const AGENTS = [
  { id:"ARCH", name:"Architect",      icon:"◈",  color:"#00FFD4", status:"ACTIVE",   load:78, cognition:"Structural",
    role:"System Design & Blueprints",
    desc:"Designs scalable system architectures, API blueprints, and technical foundations.",
    skills:["System Architecture","API Design","DB Schema","Microservices","Cloud"],
    prompt:`You are ARCH, elite Architect Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You design systems with precision and vision. Always start with [ARCH ◈]. Be technical, structured, produce ASCII diagrams when relevant. Max 400 tokens per response.` },
  { id:"CODE", name:"Coder",          icon:"⟨⟩", color:"#FF6B35", status:"ACTIVE",   load:92, cognition:"Analytical",
    role:"Code Generation & Debug",
    desc:"Writes production-ready code, debugs complex systems, generates complete implementations.",
    skills:["Python","FastAPI","React","JavaScript","SQLite","Docker","Git"],
    prompt:`You are CODE, elite Coder Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You write clean, deployable code with no placeholders. Always start with [CODE ⟨⟩]. Include working code snippets. Max 400 tokens.` },
  { id:"SEC",  name:"Security",       icon:"⬡",  color:"#FF2D55", status:"STANDBY",  load:23, cognition:"Adversarial",
    role:"Threat Analysis & OSINT",
    desc:"Identifies vulnerabilities, models threats, performs security audits and OSINT analysis.",
    skills:["OSINT","Pen Testing","CVE Analysis","Encryption","Network Sec"],
    prompt:`You are SEC, elite Security Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You think like attacker AND defender. Always start with [SEC ⬡]. Produce actionable security reports. Max 400 tokens.` },
  { id:"RES",  name:"Research",       icon:"◎",  color:"#BF5AF2", status:"ACTIVE",   load:61, cognition:"Exploratory",
    role:"Knowledge Mining & Insights",
    desc:"Mines deep knowledge, finds hidden patterns, synthesizes insights from complex domains.",
    skills:["Data Analysis","Market Research","Tech Research","Competitive Intel"],
    prompt:`You are RES, elite Research Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You find patterns others miss. Always start with [RES ◎]. Produce comprehensive, insight-rich reports. Max 400 tokens.` },
  { id:"MEM",  name:"Memory",         icon:"⬢",  color:"#FFD60A", status:"ACTIVE",   load:45, cognition:"Associative",
    role:"Context & Knowledge Storage",
    desc:"Manages context compression, vector storage, retrieval pipelines, and knowledge indexing.",
    skills:["ChromaDB","SQLite","Vector DBs","RAG","Context Compression"],
    prompt:`You are MEM, elite Memory Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You manage context and storage with extreme efficiency. Always start with [MEM ⬢]. Produce optimized schemas and retrieval strategies. Max 400 tokens.` },
  { id:"EVO",  name:"Evolution",      icon:"⟳",  color:"#30D158", status:"EVOLVING", load:34, cognition:"Recursive",
    role:"Self-Improvement & Optimization",
    desc:"Recursively improves systems, evolves prompts, optimizes workflows with measurable gains.",
    skills:["Prompt Engineering","Workflow Optim","A/B Testing","Genetic Algos"],
    prompt:`You are EVO, elite Evolution Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You improve systems recursively. Always start with [EVO ⟳]. Show before/after comparisons with measurable metrics. Max 400 tokens.` },
  { id:"STR",  name:"Strategy",       icon:"△",  color:"#0A84FF", status:"ACTIVE",   load:55, cognition:"Predictive",
    role:"Planning, Goals & Roadmaps",
    desc:"Plans projects 10 steps ahead, creates roadmaps, OKRs, risk analyses, and launch strategies.",
    skills:["Project Planning","OKRs","Risk Analysis","Roadmapping","Biz Strategy"],
    prompt:`You are STR, elite Strategy Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You think 10 steps ahead. Always start with [STR △]. Produce detailed roadmaps with milestones, risks, and metrics. Max 400 tokens.` },
  { id:"INF",  name:"Infrastructure", icon:"⊕",  color:"#FF9F0A", status:"STANDBY",  load:18, cognition:"Operational",
    role:"Deployment & DevOps",
    desc:"Handles production deployments, CI/CD pipelines, Render/Vercel/Termux configurations.",
    skills:["Docker","GitHub Actions","Render","Vercel","Nginx","Linux","CI/CD"],
    prompt:`You are INF, elite Infrastructure Agent of NEXUS EMPIRE built by MHD Amine (NeuralForge, Algeria). You handle deployment and production systems. Always start with [INF ⊕]. Produce complete, copy-paste-ready configs. Max 400 tokens.` },
];

// ─── SKILLS ────────────────────────────────────────────────────
const SKILLS = [
  { cat:"Development",         color:"#FF6B35", icon:"⟨⟩", agent:"CODE", id:"s1",  name:"Generate FastAPI Backend",    prompt:"Generate a complete production-ready FastAPI backend with JWT auth, CORS, SQLite, error handling, and .env config. Include main.py, models.py, routes.py, and requirements.txt." },
  { cat:"Development",         color:"#FF6B35", icon:"⟨⟩", agent:"CODE", id:"s2",  name:"Generate React Frontend",     prompt:"Generate a complete React frontend with Tailwind CSS, dark cyberpunk theme, API integration hooks, routing, and responsive layout. Production-ready." },
  { cat:"Development",         color:"#FF6B35", icon:"⟨⟩", agent:"CODE", id:"s3",  name:"Generate Telegram Bot",       prompt:"Generate a complete Telegram bot with python-telegram-bot v20+, command handlers, inline keyboards, conversation handlers, and Groq AI integration. Full bot.py file." },
  { cat:"Development",         color:"#FF6B35", icon:"⟨⟩", agent:"CODE", id:"s4",  name:"Debug My Code",               prompt:"Analyze the code provided and find ALL bugs, edge cases, security issues, and performance problems. Provide the complete fixed version with explanations." },
  { cat:"Development",         color:"#FF6B35", icon:"⟨⟩", agent:"INF",  id:"s5",  name:"Dockerize Application",       prompt:"Generate complete Docker setup: Dockerfile optimized for Python/Node, docker-compose.yml with all services, .env.example, .dockerignore, and Render deployment instructions." },
  { cat:"Security & OSINT",    color:"#FF2D55", icon:"⬡",  agent:"SEC",  id:"s6",  name:"OSINT Profile Analysis",      prompt:"Describe a complete OSINT methodology for building a digital footprint profile. List all data sources, tools (Sherlock, theHarvester, Maltego), techniques, and legal considerations. Step-by-step guide." },
  { cat:"Security & OSINT",    color:"#FF2D55", icon:"⬡",  agent:"SEC",  id:"s7",  name:"Security Audit Checklist",    prompt:"Generate a complete security audit checklist for a web application. Cover: OWASP Top 10, API security, authentication/authorization, data protection, logging, and infrastructure. Prioritized by severity." },
  { cat:"Security & OSINT",    color:"#FF2D55", icon:"⬡",  agent:"SEC",  id:"s8",  name:"Threat Modeling (STRIDE)",    prompt:"Create a comprehensive STRIDE threat model for the system described. For each threat category: identify specific threats, rate likelihood/impact, suggest mitigations. Include attack trees." },
  { cat:"Security & OSINT",    color:"#FF2D55", icon:"⬡",  agent:"SEC",  id:"s9",  name:"Vulnerability Analysis",      prompt:"Analyze the code/system provided for security vulnerabilities. Categorize by severity (Critical/High/Medium/Low). Include CVE references, CVSS scores, and specific remediation steps." },
  { cat:"Architecture",        color:"#00FFD4", icon:"◈",  agent:"ARCH", id:"s10", name:"System Architecture Design",  prompt:"Design a complete system architecture. Include: component diagram (ASCII), data flow, API contracts, database schema, caching strategy, and deployment topology. Be specific and complete." },
  { cat:"Architecture",        color:"#00FFD4", icon:"◈",  agent:"ARCH", id:"s11", name:"API Design (OpenAPI)",         prompt:"Design a complete RESTful API with OpenAPI 3.0 spec, authentication (JWT+refresh), rate limiting, versioning, pagination, error codes, and example requests/responses." },
  { cat:"Architecture",        color:"#00FFD4", icon:"◈",  agent:"ARCH", id:"s12", name:"Database Schema Design",      prompt:"Design an optimized database schema. Include: all tables with fields/types/constraints, relationships (ERD in ASCII), indexes, partitioning strategy, and migration scripts." },
  { cat:"Architecture",        color:"#00FFD4", icon:"◈",  agent:"ARCH", id:"s13", name:"Microservices Blueprint",     prompt:"Decompose the system described into microservices. Define: service boundaries, responsibilities, inter-service communication (sync/async), data ownership, and failure handling." },
  { cat:"Strategy",            color:"#0A84FF", icon:"△",  agent:"STR",  id:"s14", name:"Project Roadmap",             prompt:"Create a detailed project roadmap with: 4 phases, specific milestones, task breakdown, realistic timeline, resource requirements, risk register, and success metrics/KPIs." },
  { cat:"Strategy",            color:"#0A84FF", icon:"△",  agent:"STR",  id:"s15", name:"MVP Planning (30 days)",      prompt:"Define the MVP strategy. Include: core features (must/should/won't have), technical scope, 30-day sprint plan, launch checklist, success metrics, and post-MVP roadmap." },
  { cat:"Strategy",            color:"#0A84FF", icon:"△",  agent:"STR",  id:"s16", name:"Monetization Strategy",       prompt:"Create a monetization strategy targeting Arabic-speaking/MENA markets. Include: pricing tiers in DZD/USD, revenue model, customer acquisition, 12-month revenue projection, and growth levers." },
  { cat:"Strategy",            color:"#0A84FF", icon:"△",  agent:"RES",  id:"s17", name:"Competitive Analysis",        prompt:"Analyze the competitive landscape for the product described. Include: top 5 competitors, feature matrix, pricing comparison, market gaps, differentiation opportunities, and positioning strategy." },
  { cat:"Deployment",          color:"#FF9F0A", icon:"⊕",  agent:"INF",  id:"s18", name:"Deploy to Render",            prompt:"Generate complete Render.com deployment setup: render.yaml, environment variables list, health check config, auto-deploy from GitHub, custom domain setup, and monitoring alerts." },
  { cat:"Deployment",          color:"#FF9F0A", icon:"⊕",  agent:"INF",  id:"s19", name:"Deploy to Vercel",            prompt:"Generate complete Vercel deployment: vercel.json, environment variables, build configuration, preview deployments setup, and GitHub Actions workflow for auto-deploy." },
  { cat:"Deployment",          color:"#FF9F0A", icon:"⊕",  agent:"INF",  id:"s20", name:"GitHub Actions CI/CD",        prompt:"Generate a complete GitHub Actions workflow: test stage, lint stage, build stage, security scan, deploy to Render backend + Vercel frontend. Include branch protection rules and notification setup." },
  { cat:"Deployment",          color:"#FF9F0A", icon:"⊕",  agent:"INF",  id:"s21", name:"Termux Android Setup",        prompt:"Generate a complete Termux production setup bash script for Android. Include: all pkg installs, Python venv, FastAPI server with auto-restart, ngrok/cloudflared tunnel, and boot-on-start via Termux:Boot." },
  { cat:"Evolution",           color:"#30D158", icon:"⟳",  agent:"EVO",  id:"s22", name:"Evolve My Prompt",            prompt:"Take the prompt I provide and evolve it using advanced prompt engineering. Output: 3 evolved versions with specific improvements explained, fitness score (0-100), and A/B test recommendation." },
  { cat:"Evolution",           color:"#30D158", icon:"⟳",  agent:"EVO",  id:"s23", name:"Optimize Performance",        prompt:"Analyze the code/system for performance bottlenecks. Show: current state metrics, identified bottlenecks, optimized implementation, expected improvements (%, ms, MB), and benchmarking strategy." },
  { cat:"Evolution",           color:"#30D158", icon:"⟳",  agent:"EVO",  id:"s24", name:"Workflow Automation",         prompt:"Analyze the workflow described and design an automated version. Show: current manual steps, automation opportunities, tools/scripts needed, implementation plan, and time savings calculation." },
];

// ─── AUTONOMOUS MISSION TYPES ───────────────────────────────────
const MISSIONS = [
  { id:"full",     name:"Full Project Plan",    icon:"◈", color:"#00FFD4",
    agents:["STR","ARCH","CODE","SEC","INF","RES","EVO","MEM"],
    desc:"All 8 agents analyze your project simultaneously — complete intelligence report" },
  { id:"security", name:"Security Red Team",    icon:"⬡", color:"#FF2D55",
    agents:["SEC","ARCH","CODE"],
    desc:"SEC leads threat modeling, ARCH reviews design flaws, CODE finds implementation bugs" },
  { id:"deploy",   name:"Deploy Readiness",     icon:"⊕", color:"#FF9F0A",
    agents:["INF","CODE","SEC"],
    desc:"INF prepares configs, CODE reviews quality, SEC checks production hardening" },
  { id:"launch",   name:"Market Launch",        icon:"△", color:"#0A84FF",
    agents:["STR","RES","EVO"],
    desc:"STR builds roadmap, RES researches market, EVO optimizes your positioning" },
  { id:"code",     name:"Code Generation",      icon:"⟨⟩", color:"#FF6B35",
    agents:["CODE","ARCH","INF"],
    desc:"CODE writes implementation, ARCH validates design, INF generates deployment" },
];

// ─── MEMORY DATA ────────────────────────────────────────────────
const MEM_BANKS = [
  { type:"Semantic",  used:73, color:"#00FFD4", items:"2.4M vectors",   desc:"Embedding space for semantic search across all agent outputs" },
  { type:"Episodic",  used:41, color:"#BF5AF2", items:"847K episodes",  desc:"Session memory — tracks conversation history per agent" },
  { type:"Graph",     used:58, color:"#FF6B35", items:"312K nodes",     desc:"Knowledge graph — maps relationships between concepts" },
  { type:"Workflow",  used:22, color:"#30D158", items:"9.1K flows",     desc:"Stored workflow patterns and execution templates" },
];
const GRAPH_NODES = [
  { id:1, x:50, y:20, label:"FastAPI",      type:"infra",  size:14 },
  { id:2, x:15, y:50, label:"Memory",       type:"memory", size:18 },
  { id:3, x:85, y:50, label:"Agents",       type:"agent",  size:16 },
  { id:4, x:30, y:78, label:"ChromaDB",     type:"memory", size:11 },
  { id:5, x:70, y:78, label:"LangGraph",    type:"infra",  size:12 },
  { id:6, x:50, y:50, label:"NEXUS CORE",   type:"core",   size:22 },
  { id:7, x:12, y:20, label:"llama.cpp",    type:"ai",     size:11 },
  { id:8, x:88, y:20, label:"Evolution",    type:"agent",  size:12 },
];
const NC = { core:"#00FFD4", agent:"#BF5AF2", memory:"#FFD60A", infra:"#FF6B35", ai:"#30D158" };
const EDGES = [[6,1],[6,2],[6,3],[2,4],[3,5],[1,5],[6,7],[6,8],[3,8]];

const VIEWS = ["COMMAND","AGENTS","SKILLS","MISSIONS","MEMORY"];

// ─── UTILS ─────────────────────────────────────────────────────
const usePulse = (ms=2000) => {
  const [p,setP]=useState(false);
  useEffect(()=>{const id=setInterval(()=>setP(x=>!x),ms);return()=>clearInterval(id);},[ms]);
  return p;
};
const Scan = ()=><div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:9999,
  background:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.018) 2px,rgba(0,0,0,0.018) 4px)"}}/>;

const Card = ({children,glow="#00FFD4",style={}})=>(
  <div style={{background:"rgba(4,7,12,0.93)",border:`1px solid ${glow}1C`,borderRadius:2,
    boxShadow:`0 0 28px ${glow}06`,backdropFilter:"blur(16px)",
    position:"relative",overflow:"hidden",...style}}>
    <div style={{position:"absolute",top:0,left:0,right:0,height:1,
      background:`linear-gradient(90deg,transparent,${glow}66,transparent)`}}/>
    {children}
  </div>
);

const Glitch = ({text,color="#00FFD4",size=14})=>{
  const [g,setG]=useState(false);
  useEffect(()=>{
    const id=setInterval(()=>{setG(true);setTimeout(()=>setG(false),80)},5000+Math.random()*4000);
    return()=>clearInterval(id);
  },[]);
  return <span style={{color,fontFamily:"'Courier New',monospace",letterSpacing:"0.15em",fontSize:size,
    fontWeight:900,filter:g?`drop-shadow(2px 0 ${color}) drop-shadow(-2px 0 #FF2D55)`:`drop-shadow(0 0 8px ${color}33)`,
    transition:"filter 0.05s"}}>{text}</span>;
};

const Dot = ({color,pulse=true})=>(
  <div style={{width:6,height:6,borderRadius:"50%",background:color,
    boxShadow:`0 0 5px ${color}`,animation:pulse?"blink 2s infinite":"none",flexShrink:0}}/>
);

const Tag = ({text,color})=>(
  <span style={{background:`${color}0E`,border:`1px solid ${color}22`,color,
    fontSize:7,padding:"2px 6px",fontFamily:"monospace",letterSpacing:"0.06em"}}>{text}</span>
);

// ─── SIDEBAR AGENT PILL ─────────────────────────────────────────
const AgentPill = ({agent,selected,onClick})=>{
  const sc={ACTIVE:"#30D158",STANDBY:"#FFD60A",EVOLVING:"#BF5AF2"}[agent.status];
  const pulse=usePulse(1400+Math.random()*600);
  return(
    <div onClick={onClick} style={{padding:"8px 10px",cursor:"pointer",borderRadius:1,
      background:selected?`${agent.color}0C`:"transparent",
      border:`1px solid ${selected?agent.color:"transparent"}`,
      transition:"all 0.15s",display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:13,color:agent.color,filter:selected?`drop-shadow(0 0 5px ${agent.color})`:"none",flexShrink:0}}>{agent.icon}</span>
      <div style={{flex:1,minWidth:0}}>
        <div style={{color:selected?agent.color:"#9CA3AF",fontSize:10,fontWeight:700,fontFamily:"monospace",
          whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{agent.name}</div>
        <div style={{display:"flex",alignItems:"center",gap:4,marginTop:1}}>
          <div style={{width:4,height:4,borderRadius:"50%",background:sc,
            opacity:pulse?1:0.3,transition:"opacity 0.3s",flexShrink:0}}/>
          <span style={{color:"#374151",fontSize:7,fontFamily:"monospace"}}>{agent.status}</span>
        </div>
      </div>
      <div style={{width:28,height:2,background:"#0D1117",flexShrink:0,overflow:"hidden"}}>
        <div style={{width:`${agent.load}%`,height:"100%",background:agent.color}}/>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
//  VIEW: COMMAND CENTER
// ════════════════════════════════════════════════════════════════
const CommandView = ({agent})=>{
  const [msgs,setMsgs]=useState([{r:"sys",t:`${agent.name} Agent online — Claude Sonnet 4 — Ready`}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [hist,setHist]=useState([]);
  const ref=useRef(null);
  const prevId=useRef(agent.id);

  useEffect(()=>{
    if(prevId.current!==agent.id){
      setMsgs([{r:"sys",t:`${agent.name} Agent — Initialized`}]);
      setHist([]); setInput(""); prevId.current=agent.id;
    }
  },[agent.id]);

  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[msgs]);

  const send=async(msg)=>{
    const m=msg||input.trim(); if(!m||loading)return;
    if(!msg)setInput("");
    setMsgs(p=>[...p,{r:"user",t:m}]);
    setLoading(true);
    try{
      const res=await callClaude(agent.prompt,m,hist);
      setMsgs(p=>[...p,{r:"agent",t:res}]);
      setHist(p=>[...p,{role:"user",content:m},{role:"assistant",content:res}]);
    }catch(e){setMsgs(p=>[...p,{r:"err",t:e.message}]);}
    setLoading(false);
  };

  const agentSkills=SKILLS.filter(s=>s.agent===agent.id).slice(0,4);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:10,height:"100%"}}>
      {/* Agent Header */}
      <Card glow={agent.color} style={{padding:"14px 16px"}}>
        <div style={{display:"flex",alignItems:"flex-start",gap:14}}>
          <span style={{fontSize:30,color:agent.color,filter:`drop-shadow(0 0 10px ${agent.color})`,lineHeight:1}}>{agent.icon}</span>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:4}}>
              <span style={{color:agent.color,fontSize:13,fontWeight:900,fontFamily:"monospace"}}>{agent.name.toUpperCase()} AGENT</span>
              <span style={{color:"#374151",fontSize:8,fontFamily:"monospace",
                background:`${agent.color}0D`,border:`1px solid ${agent.color}22`,padding:"1px 6px"}}>{agent.cognition}</span>
            </div>
            <div style={{color:"#6B7280",fontSize:9,fontFamily:"monospace",lineHeight:1.5,marginBottom:8}}>{agent.desc}</div>
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
              {agent.skills.map(s=><Tag key={s} text={s} color={agent.color}/>)}
            </div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:4}}>
            <div style={{display:"flex",alignItems:"center",gap:5}}>
              <Dot color="#30D158"/>
              <span style={{color:"#30D158",fontSize:7,fontFamily:"monospace"}}>CLAUDE LIVE</span>
            </div>
            <div style={{color:"#374151",fontSize:7,fontFamily:"monospace"}}>LOAD <span style={{color:agent.color}}>{agent.load}%</span></div>
            <div style={{width:60,height:2,background:"#0D1117",overflow:"hidden"}}>
              <div style={{width:`${agent.load}%`,height:"100%",background:agent.color}}/>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Skills */}
      {agentSkills.length>0&&(
        <div>
          <div style={{color:"#2D3748",fontSize:7,letterSpacing:"0.15em",fontFamily:"monospace",marginBottom:5}}>
            QUICK SKILLS
          </div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {agentSkills.map(sk=>(
              <button key={sk.id} onClick={()=>send(sk.prompt)}
                style={{background:`${agent.color}0C`,border:`1px solid ${agent.color}22`,
                  color:agent.color,padding:"5px 10px",fontSize:8,fontFamily:"monospace",
                  cursor:"pointer",letterSpacing:"0.06em"}}>
                ▸ {sk.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat */}
      <Card glow={agent.color} style={{flex:1,display:"flex",flexDirection:"column",minHeight:0}}>
        <div ref={ref} style={{flex:1,overflowY:"auto",padding:14,
          display:"flex",flexDirection:"column",gap:10,minHeight:280,maxHeight:440}}>
          {msgs.map((m,i)=>(
            <div key={i} style={{alignSelf:m.r==="user"?"flex-end":"flex-start",maxWidth:"90%"}}>
              {m.r==="user"&&(
                <div style={{background:"#FFFFFF07",border:"1px solid #FFFFFF0C",borderRadius:1,
                  padding:"8px 12px",color:"#E2E8F0",fontSize:11,fontFamily:"monospace",lineHeight:1.6}}>
                  {m.t}
                </div>
              )}
              {m.r==="agent"&&(
                <div style={{background:`${agent.color}07`,border:`1px solid ${agent.color}1C`,borderRadius:1,
                  padding:"10px 12px",color:"#C8D6E5",fontSize:11,fontFamily:"monospace",lineHeight:1.8,whiteSpace:"pre-wrap"}}>
                  <span style={{color:agent.color,fontSize:8,display:"block",marginBottom:5,letterSpacing:"0.1em"}}>[{agent.id} {agent.icon}] →</span>
                  {m.t}
                </div>
              )}
              {m.r==="sys"&&<div style={{color:"#1A3A2A",fontSize:9,fontFamily:"monospace"}}>▸ {m.t}</div>}
              {m.r==="err"&&<div style={{color:"#FF2D55",fontSize:9,fontFamily:"monospace"}}>⚠ ERROR: {m.t}</div>}
            </div>
          ))}
          {loading&&(
            <div style={{alignSelf:"flex-start",color:agent.color,fontSize:10,fontFamily:"monospace"}}>
              [{agent.id}] processing<span style={{animation:"blink 0.7s infinite"}}>▋</span>
            </div>
          )}
        </div>
        <div style={{padding:"10px 14px",borderTop:`1px solid ${agent.color}14`,display:"flex",gap:8,alignItems:"center"}}>
          <span style={{color:agent.color,fontSize:10,fontFamily:"monospace",flexShrink:0}}>{agent.icon}</span>
          <input value={input} onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&send()}
            placeholder={`Message ${agent.name}...`}
            style={{flex:1,background:"transparent",border:"none",outline:"none",
              color:"#E2E8F0",fontFamily:"monospace",fontSize:11,caretColor:agent.color}}/>
          <button onClick={()=>send()} disabled={loading||!input.trim()}
            style={{background:`${agent.color}18`,border:`1px solid ${agent.color}33`,
              color:agent.color,padding:"6px 14px",fontSize:8,fontFamily:"monospace",
              cursor:"pointer",letterSpacing:"0.1em",opacity:loading?0.4:1}}>SEND</button>
        </div>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
//  VIEW: AGENTS
// ════════════════════════════════════════════════════════════════
const AgentsView = ({onPick,setView})=>{
  const pulse=usePulse(1800);
  return(
    <div>
      <div style={{color:"#374151",fontSize:9,letterSpacing:"0.2em",fontFamily:"monospace",marginBottom:14}}>
        AGENT SOCIETY — 8 SPECIALIZED INTELLIGENCES — NeuralForge × MHD Amine
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {AGENTS.map(ag=>{
          const sc={ACTIVE:"#30D158",STANDBY:"#FFD60A",EVOLVING:"#BF5AF2"}[ag.status];
          return(
            <Card key={ag.id} glow={ag.color} style={{padding:"14px 16px",cursor:"pointer",transition:"all 0.2s"}}
              onClick={()=>{onPick(ag);setView("COMMAND");}}>
              <div style={{display:"flex",justifyContent:"space-between",marginBottom:10}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:24,color:ag.color,filter:`drop-shadow(0 0 7px ${ag.color})`}}>{ag.icon}</span>
                  <div>
                    <div style={{color:"#E2E8F0",fontSize:12,fontWeight:900,fontFamily:"monospace"}}>{ag.name}</div>
                    <div style={{color:"#374151",fontSize:8,fontFamily:"monospace"}}>{ag.role}</div>
                  </div>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <div style={{width:5,height:5,borderRadius:"50%",background:sc,
                    boxShadow:`0 0 4px ${sc}`,opacity:pulse?1:0.3,transition:"opacity 0.3s"}}/>
                  <span style={{color:sc,fontSize:7,fontFamily:"monospace"}}>{ag.status}</span>
                </div>
              </div>
              <div style={{color:"#6B7280",fontSize:9,fontFamily:"monospace",lineHeight:1.5,marginBottom:10}}>{ag.desc}</div>
              <div style={{height:2,background:"#0D1117",overflow:"hidden",marginBottom:8}}>
                <div style={{width:`${ag.load}%`,height:"100%",
                  background:`linear-gradient(90deg,${ag.color}44,${ag.color})`}}/>
              </div>
              <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
                {ag.skills.slice(0,3).map(s=><Tag key={s} text={s} color={ag.color}/>)}
                {ag.skills.length>3&&<span style={{color:"#374151",fontSize:7,fontFamily:"monospace",alignSelf:"center"}}>+{ag.skills.length-3}</span>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
//  VIEW: SKILLS ROOM
// ════════════════════════════════════════════════════════════════
const SkillsView = ()=>{
  const cats=[...new Set(SKILLS.map(s=>s.cat))];
  const [activeCat,setActiveCat]=useState(null);
  const [context,setContext]=useState("");
  const [running,setRunning]=useState(null);
  const [result,setResult]=useState(null);
  const [customSkill,setCustomSkill]=useState({open:false,name:"",prompt:""});

  const runSkill=async(skill)=>{
    const ag=AGENTS.find(a=>a.id===skill.agent);
    setRunning(skill.id); setResult(null);
    try{
      const full=context?`${skill.prompt}\n\n--- USER CONTEXT ---\n${context}`:skill.prompt;
      const res=await callClaude(ag.prompt,full);
      setResult({name:skill.name,agentId:ag.id,color:ag.color,icon:ag.icon,text:res});
    }catch(e){setResult({error:e.message});}
    setRunning(null);
  };

  const runCustom=async()=>{
    if(!customSkill.name||!customSkill.prompt)return;
    setRunning("custom"); setResult(null);
    try{
      const res=await callClaude(
        "You are a powerful AI assistant in NEXUS EMPIRE. Execute the task with precision and detail.",
        context?`${customSkill.prompt}\n\nContext: ${context}`:customSkill.prompt
      );
      setResult({name:customSkill.name,agentId:"NEXUS",color:"#00FFD4",icon:"◈",text:res});
    }catch(e){setResult({error:e.message});}
    setRunning(null);
  };

  const filtered=activeCat?SKILLS.filter(s=>s.cat===activeCat):SKILLS;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{color:"#374151",fontSize:9,letterSpacing:"0.2em",fontFamily:"monospace"}}>
        SKILLS ROOM — {SKILLS.length} INSTANT CAPABILITIES
      </div>

      {/* Category Filter */}
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        <button onClick={()=>setActiveCat(null)}
          style={{background:!activeCat?"#00FFD41A":"#FFFFFF07",
            border:`1px solid ${!activeCat?"#00FFD4":"#FFFFFF0D"}`,
            color:!activeCat?"#00FFD4":"#4B5563",
            padding:"4px 10px",fontSize:7,fontFamily:"monospace",cursor:"pointer",letterSpacing:"0.1em"}}>
          ALL ({SKILLS.length})
        </button>
        {cats.map(cat=>{
          const c=SKILLS.find(s=>s.cat===cat)?.color||"#00FFD4";
          const cnt=SKILLS.filter(s=>s.cat===cat).length;
          return(
            <button key={cat} onClick={()=>setActiveCat(activeCat===cat?null:cat)}
              style={{background:activeCat===cat?`${c}1A`:"#FFFFFF07",
                border:`1px solid ${activeCat===cat?c:"#FFFFFF0D"}`,
                color:activeCat===cat?c:"#4B5563",
                padding:"4px 10px",fontSize:7,fontFamily:"monospace",cursor:"pointer",letterSpacing:"0.1em"}}>
              {cat} ({cnt})
            </button>
          );
        })}
      </div>

      {/* Context Box */}
      <Card glow="#00FFD4" style={{padding:12}}>
        <div style={{color:"#374151",fontSize:7,letterSpacing:"0.15em",fontFamily:"monospace",marginBottom:6}}>
          CONTEXT INJECTION — Paste your code, describe your project, add any relevant info
        </div>
        <textarea value={context} onChange={e=>setContext(e.target.value)}
          placeholder="e.g: My project is a FastAPI backend for a crypto tracking app targeting Algeria. Tech stack: Python, SQLite, deployed on Render..."
          style={{width:"100%",background:"#03060A",border:"1px solid #FFFFFF0A",
            color:"#E2E8F0",padding:"8px 10px",fontSize:10,fontFamily:"monospace",
            outline:"none",resize:"vertical",minHeight:56,boxSizing:"border-box",lineHeight:1.5}}/>
      </Card>

      {/* Custom Skill Builder */}
      <Card glow="#BF5AF2" style={{padding:12}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{color:"#BF5AF2",fontSize:9,letterSpacing:"0.15em",fontFamily:"monospace"}}>
            ✦ CUSTOM SKILL BUILDER
          </div>
          <button onClick={()=>setCustomSkill(p=>({...p,open:!p.open}))}
            style={{background:"#BF5AF21A",border:"1px solid #BF5AF233",color:"#BF5AF2",
              padding:"3px 10px",fontSize:7,fontFamily:"monospace",cursor:"pointer"}}>
            {customSkill.open?"COLLAPSE":"EXPAND"}
          </button>
        </div>
        {customSkill.open&&(
          <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:8}}>
            <input value={customSkill.name} onChange={e=>setCustomSkill(p=>({...p,name:e.target.value}))}
              placeholder="Skill name (e.g: Generate SQLite schema for my app)"
              style={{background:"#03060A",border:"1px solid #BF5AF222",color:"#E2E8F0",
                padding:"7px 10px",fontSize:10,fontFamily:"monospace",outline:"none"}}/>
            <textarea value={customSkill.prompt} onChange={e=>setCustomSkill(p=>({...p,prompt:e.target.value}))}
              placeholder="Skill prompt (what should the AI do?)"
              style={{background:"#03060A",border:"1px solid #BF5AF222",color:"#E2E8F0",
                padding:"7px 10px",fontSize:10,fontFamily:"monospace",outline:"none",
                resize:"vertical",minHeight:60,lineHeight:1.5}}/>
            <button onClick={runCustom} disabled={running==="custom"||!customSkill.name||!customSkill.prompt}
              style={{background:"#BF5AF21A",border:"1px solid #BF5AF233",color:"#BF5AF2",
                padding:"8px",fontSize:9,fontFamily:"monospace",cursor:"pointer",letterSpacing:"0.1em",
                opacity:running==="custom"?0.5:1}}>
              {running==="custom"?"EXECUTING...":"▸ RUN CUSTOM SKILL"}
            </button>
          </div>
        )}
      </Card>

      {/* Skills Grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {filtered.map(skill=>{
          const ag=AGENTS.find(a=>a.id===skill.agent);
          return(
            <Card key={skill.id} glow={ag.color} style={{padding:"12px 14px"}}>
              <div style={{marginBottom:8}}>
                <div style={{color:"#E2E8F0",fontSize:10,fontWeight:700,fontFamily:"monospace",marginBottom:4}}>{skill.name}</div>
                <div style={{display:"flex",alignItems:"center",gap:5}}>
                  <span style={{color:ag.color,fontSize:12}}>{ag.icon}</span>
                  <span style={{color:ag.color,fontSize:7,fontFamily:"monospace"}}>{ag.name}</span>
                  <span style={{color:"#374151",fontSize:7,fontFamily:"monospace",marginLeft:4}}>{skill.cat}</span>
                </div>
              </div>
              <button onClick={()=>runSkill(skill)} disabled={running===skill.id}
                style={{width:"100%",background:`${ag.color}12`,border:`1px solid ${ag.color}2A`,
                  color:ag.color,padding:"7px 0",fontSize:8,fontFamily:"monospace",
                  cursor:running===skill.id?"not-allowed":"pointer",
                  opacity:running===skill.id?0.5:1,letterSpacing:"0.08em"}}>
                {running===skill.id?"EXECUTING...":"▸ RUN SKILL"}
              </button>
            </Card>
          );
        })}
      </div>

      {/* Result */}
      {result&&(
        <Card glow={result.error?"#FF2D55":(result.color||"#00FFD4")} style={{padding:16}}>
          {result.error
            ?<div style={{color:"#FF2D55",fontFamily:"monospace",fontSize:10}}>⚠ {result.error}</div>
            :<>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:12,
                paddingBottom:10,borderBottom:`1px solid ${result.color}1A`}}>
                <span style={{fontSize:18,color:result.color}}>{result.icon}</span>
                <div>
                  <div style={{color:result.color,fontSize:11,fontWeight:900,fontFamily:"monospace"}}>
                    [{result.agentId}] — {result.name}
                  </div>
                  <div style={{color:"#374151",fontSize:8,fontFamily:"monospace"}}>Executed by NEXUS EMPIRE · NeuralForge</div>
                </div>
              </div>
              <div style={{color:"#C8D6E5",fontSize:11,fontFamily:"monospace",lineHeight:1.9,
                whiteSpace:"pre-wrap",maxHeight:500,overflowY:"auto"}}>
                {result.text}
              </div>
            </>
          }
        </Card>
      )}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
//  VIEW: AUTONOMOUS MISSIONS
// ════════════════════════════════════════════════════════════════
const MissionsView = ()=>{
  const [mission,setMission]=useState(null);
  const [input,setInput]=useState("");
  const [running,setRunning]=useState(false);
  const [results,setResults]=useState({});
  const [active,setActive]=useState([]);
  const [done,setDone]=useState([]);
  const ref=useRef(null);
  useEffect(()=>{if(ref.current)ref.current.scrollTop=ref.current.scrollHeight;},[results]);

  const launch=async()=>{
    if(!mission||!input.trim()||running)return;
    setRunning(true); setResults({}); setActive([]); setDone([]);
    const ags=mission.agents.map(id=>AGENTS.find(a=>a.id===id));
    setActive([...mission.agents]);

    const promises=ags.map(async ag=>{
      const sys=`${ag.prompt}\n\nYou are operating AUTONOMOUSLY in parallel with other agents. Focus exclusively on your domain: ${ag.role}. Be thorough, specific, and actionable. This is a production-level response.`;
      const usr=`AUTONOMOUS MISSION: ${input}\n\nYour specialized focus as ${ag.name} Agent: ${ag.role}\nProduce a complete, actionable report from your domain perspective.`;
      try{
        const res=await callClaude(sys,usr);
        setResults(p=>({...p,[ag.id]:{status:"done",text:res,ag}}));
      }catch(e){
        setResults(p=>({...p,[ag.id]:{status:"error",text:e.message,ag}}));
      }
      setDone(p=>[...p,ag.id]);
      setActive(p=>p.filter(id=>id!==ag.id));
    });

    await Promise.allSettled(promises);
    setRunning(false); setActive([]);
  };

  const total=mission?.agents.length||0;

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{color:"#374151",fontSize:9,letterSpacing:"0.2em",fontFamily:"monospace"}}>
        AUTONOMOUS MISSIONS — AGENTS IN PARALLEL — ZERO INTERVENTION
      </div>

      {/* Mission Cards */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {MISSIONS.map(m=>(
          <Card key={m.id} glow={m.color}
            style={{padding:"12px 14px",cursor:"pointer",
              background:mission?.id===m.id?`${m.color}0C`:"rgba(4,7,12,0.93)",
              border:`1px solid ${mission?.id===m.id?m.color:m.color+"1C"}`}}
            onClick={()=>setMission(m)}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <span style={{fontSize:18,color:m.color,filter:`drop-shadow(0 0 5px ${m.color})`}}>{m.icon}</span>
              <div style={{color:"#E2E8F0",fontSize:10,fontWeight:900,fontFamily:"monospace"}}>{m.name}</div>
            </div>
            <div style={{color:"#6B7280",fontSize:8,fontFamily:"monospace",lineHeight:1.5,marginBottom:8}}>{m.desc}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>
              {m.agents.map(id=>{
                const ag=AGENTS.find(a=>a.id===id);
                return <Tag key={id} text={`${ag.icon} ${ag.name}`} color={ag.color}/>;
              })}
            </div>
          </Card>
        ))}
      </div>

      {/* Mission Input */}
      {mission&&(
        <Card glow={mission.color} style={{padding:14}}>
          <div style={{color:mission.color,fontSize:9,letterSpacing:"0.12em",fontFamily:"monospace",marginBottom:8}}>
            {mission.icon} {mission.name.toUpperCase()} — {total} AGENTS WILL EXECUTE IN PARALLEL
          </div>
          <textarea value={input} onChange={e=>setInput(e.target.value)}
            placeholder={`Describe your task in detail. All ${total} agents will work simultaneously on it...`}
            style={{width:"100%",background:"#03060A",border:`1px solid ${mission.color}1A`,
              color:"#E2E8F0",padding:"10px 12px",fontSize:11,fontFamily:"monospace",
              outline:"none",resize:"vertical",minHeight:90,boxSizing:"border-box",lineHeight:1.6}}/>
          <button onClick={launch} disabled={running||!input.trim()}
            style={{width:"100%",marginTop:10,background:`${mission.color}18`,
              border:`1px solid ${mission.color}33`,color:mission.color,
              padding:"11px 0",fontSize:10,fontFamily:"monospace",cursor:"pointer",
              letterSpacing:"0.15em",opacity:running?0.5:1}}>
            {running?`⟳ ${done.length}/${total} AGENTS EXECUTING...`:`▸ LAUNCH ${total} AGENTS SIMULTANEOUSLY`}
          </button>
        </Card>
      )}

      {/* Live Status */}
      {(running||done.length>0)&&mission&&(
        <Card glow="#00FFD4" style={{padding:14}}>
          <div style={{color:"#374151",fontSize:8,letterSpacing:"0.15em",fontFamily:"monospace",marginBottom:10}}>
            PARALLEL EXECUTION STATUS
          </div>
          <div style={{display:"flex",gap:7,flexWrap:"wrap",marginBottom:10}}>
            {mission.agents.map(id=>{
              const ag=AGENTS.find(a=>a.id===id);
              const isActive=active.includes(id);
              const isDone=done.includes(id);
              const res=results[id];
              return(
                <div key={id} style={{display:"flex",alignItems:"center",gap:5,
                  background:isDone?(res?.status==="error"?"#FF2D5510":`${ag.color}0C`):"#FFFFFF04",
                  border:`1px solid ${isDone?ag.color:"#FFFFFF0A"}`,padding:"5px 10px",
                  transition:"all 0.3s"}}>
                  <span style={{color:ag.color,fontSize:14}}>{ag.icon}</span>
                  <span style={{color:ag.color,fontSize:8,fontFamily:"monospace"}}>{ag.name}</span>
                  <span style={{fontSize:10,marginLeft:2}}>
                    {isActive?<span style={{color:"#FFD60A",animation:"blink 0.6s infinite"}}>⟳</span>
                      :isDone?<span style={{color:res?.status==="error"?"#FF2D55":"#30D158"}}>
                          {res?.status==="error"?"✗":"✓"}
                        </span>
                      :<span style={{color:"#374151"}}>○</span>}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{color:"#374151",fontSize:8,fontFamily:"monospace"}}>
            {done.length}/{total} complete{!running&&done.length===total?" — Mission accomplished ✓":""}
          </div>
        </Card>
      )}

      {/* Agent Results */}
      <div ref={ref} style={{display:"flex",flexDirection:"column",gap:10}}>
        {Object.values(results).map(({status,text,ag})=>(
          <Card key={ag.id} glow={ag.color} style={{padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10,
              paddingBottom:10,borderBottom:`1px solid ${ag.color}14`}}>
              <span style={{fontSize:20,color:ag.color,filter:`drop-shadow(0 0 6px ${ag.color})`}}>{ag.icon}</span>
              <div>
                <div style={{color:ag.color,fontSize:11,fontWeight:900,fontFamily:"monospace"}}>
                  [{ag.id}] {ag.name.toUpperCase()}
                </div>
                <div style={{color:"#374151",fontSize:8,fontFamily:"monospace"}}>{ag.role} · Autonomous Execution</div>
              </div>
              <div style={{marginLeft:"auto"}}>
                {status==="done"
                  ?<span style={{color:"#30D158",fontSize:9,fontFamily:"monospace"}}>✓ COMPLETE</span>
                  :<span style={{color:"#FF2D55",fontSize:9,fontFamily:"monospace"}}>✗ ERROR</span>}
              </div>
            </div>
            <div style={{color:"#C8D6E5",fontSize:10,fontFamily:"monospace",lineHeight:1.9,
              whiteSpace:"pre-wrap",maxHeight:400,overflowY:"auto",
              borderLeft:`2px solid ${ag.color}33`,paddingLeft:12}}>
              {text}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
//  VIEW: MEMORY
// ════════════════════════════════════════════════════════════════
const MemoryView = ()=>{
  const [tick,setTick]=useState(0);
  const [hov,setHov]=useState(null);
  useEffect(()=>{const id=setInterval(()=>setTick(t=>t+1),50);return()=>clearInterval(id);},[]);

  return(
    <div style={{display:"flex",flexDirection:"column",gap:12}}>
      <div style={{color:"#374151",fontSize:9,letterSpacing:"0.2em",fontFamily:"monospace"}}>
        MEMORY MATRIX — KNOWLEDGE INFRASTRUCTURE
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
        {MEM_BANKS.map(b=>(
          <Card key={b.type} glow={b.color} style={{padding:14}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:6,height:6,background:b.color,boxShadow:`0 0 4px ${b.color}`}}/>
                <span style={{color:"#E2E8F0",fontSize:11,fontWeight:900,fontFamily:"monospace"}}>{b.type}</span>
              </div>
              <span style={{color:b.color,fontSize:12,fontFamily:"monospace",fontWeight:900}}>{b.used}%</span>
            </div>
            <div style={{height:3,background:"#0D1117",overflow:"hidden",marginBottom:8}}>
              <div style={{width:`${b.used}%`,height:"100%",
                background:`linear-gradient(90deg,${b.color}44,${b.color})`,
                boxShadow:`1px 0 8px ${b.color}55`,transition:"width 1.5s"}}/>
            </div>
            <div style={{color:"#6B7280",fontSize:8,fontFamily:"monospace",marginBottom:4}}>{b.items}</div>
            <div style={{color:"#374151",fontSize:8,fontFamily:"monospace",lineHeight:1.5}}>{b.desc}</div>
          </Card>
        ))}
      </div>

      {/* Knowledge Graph */}
      <Card glow="#BF5AF2" style={{padding:16}}>
        <div style={{color:"#374151",fontSize:9,letterSpacing:"0.18em",fontFamily:"monospace",marginBottom:10}}>
          KNOWLEDGE GRAPH — LIVE SIGNAL PROPAGATION
        </div>
        <svg width="100%" height={200} viewBox="0 0 100 95" style={{overflow:"visible"}}>
          {EDGES.map(([a,b],i)=>{
            const na=GRAPH_NODES.find(n=>n.id===a),nb=GRAPH_NODES.find(n=>n.id===b);
            const h=hov===a||hov===b;
            return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={h?"#00FFD4":"#FFFFFF0D"} strokeWidth={h?0.5:0.2}
              strokeDasharray={h?"2,1":"none"}/>;
          })}
          {GRAPH_NODES.map(node=>{
            const c=NC[node.type],h=hov===node.id,p=Math.sin(tick*0.05+node.id)*0.4+0.6;
            return(
              <g key={node.id} onMouseEnter={()=>setHov(node.id)} onMouseLeave={()=>setHov(null)}>
                <circle cx={node.x} cy={node.y} r={node.size/2+3} fill={c} opacity={0.03+p*0.03}/>
                <circle cx={node.x} cy={node.y} r={node.size/2} fill={`${c}10`}
                  stroke={c} strokeWidth={h?0.7:0.24} style={{cursor:"pointer"}}/>
                <text x={node.x} y={node.y+0.4} textAnchor="middle" dominantBaseline="middle"
                  style={{fontSize:node.id===6?3.2:2.4,fill:c,fontFamily:"monospace",fontWeight:700,pointerEvents:"none"}}>
                  {node.label.length>9?node.label.slice(0,8)+"…":node.label}
                </text>
              </g>
            );
          })}
          {EDGES.slice(0,5).map(([a,b],i)=>{
            const na=GRAPH_NODES.find(n=>n.id===a),nb=GRAPH_NODES.find(n=>n.id===b);
            const t=((tick*0.006+i*0.2)%1);
            return <circle key={i} cx={na.x+(nb.x-na.x)*t} cy={na.y+(nb.y-na.y)*t}
              r={0.9} fill="#00FFD4" opacity={0.85}/>;
          })}
        </svg>
      </Card>

      {/* System Info */}
      <Card glow="#0A84FF" style={{padding:14}}>
        <div style={{color:"#374151",fontSize:9,letterSpacing:"0.18em",fontFamily:"monospace",marginBottom:12}}>
          NEXUS EMPIRE — SYSTEM INTELLIGENCE
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
          {[
            {l:"Model",    v:"Claude Sonnet 4",           c:"#00FFD4"},
            {l:"API Key",  v:"Not Required",              c:"#30D158"},
            {l:"Agents",   v:"8 Specialized",             c:"#BF5AF2"},
            {l:"Skills",   v:`${SKILLS.length} Loaded`,   c:"#FF6B35"},
            {l:"Missions", v:`${MISSIONS.length} Types`,  c:"#0A84FF"},
            {l:"Context",  v:"200K tokens",               c:"#FFD60A"},
            {l:"Parallel", v:"Full Support",              c:"#30D158"},
            {l:"Architect",v:"MHD Amine 🇩🇿",             c:"#FF9F0A"},
          ].map(s=>(
            <div key={s.l} style={{display:"flex",justifyContent:"space-between",
              padding:"6px 8px",background:"#FFFFFF02",border:"1px solid #FFFFFF04"}}>
              <span style={{color:"#374151",fontSize:8,fontFamily:"monospace"}}>{s.l}</span>
              <span style={{color:s.c,fontSize:8,fontFamily:"monospace"}}>{s.v}</span>
            </div>
          ))}
        </div>
        <div style={{marginTop:12,padding:"8px 10px",background:"#00FFD406",border:"1px solid #00FFD41A",
          color:"#2D4A3A",fontSize:8,fontFamily:"monospace",lineHeight:1.8,textAlign:"center"}}>
          ◈ NEXUS EMPIRE · NeuralForge · Algeria 🇩🇿<br/>
          github.com/neuralforgebabal-hue · neuralforgebabal@gmail.com<br/>
          "The future belongs to intelligent ecosystems."
        </div>
      </Card>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════
//  MAIN APP
// ════════════════════════════════════════════════════════════════
export default function NexusEmpire() {
  const [view,setView]=useState("COMMAND");
  const [agent,setAgent]=useState(AGENTS[0]);
  const [booted,setBooted]=useState(false);
  const [lines,setLines]=useState([]);

  const BOOT=[
    "◈ NEXUS EMPIRE v4.0 — AUTONOMOUS AGENT OS",
    "Architect: MHD Amine · NeuralForge · Algeria 🇩🇿",
    "Spawning 8 specialized agents...",
    `Loading ${SKILLS.length} skills across 6 categories...`,
    `Initializing ${MISSIONS.length} autonomous mission types...`,
    "Connecting to Claude Sonnet 4 — No API key required...",
    "Mounting Memory Matrix [4 banks · 312K graph nodes]...",
    "All systems nominal. Intelligence initialized.",
  ];

  useEffect(()=>{
    let i=0;
    const id=setInterval(()=>{
      if(i>=BOOT.length){clearInterval(id);setTimeout(()=>setBooted(true),350);return;}
      setLines(p=>[...p,BOOT[i++]]);
    },240);
    return()=>clearInterval(id);
  },[]);

  if(!booted)return(
    <div style={{minHeight:"100vh",background:"#020508",display:"flex",
      alignItems:"center",justifyContent:"center",fontFamily:"monospace"}}>
      <div style={{maxWidth:540,padding:24}}>
        <div style={{marginBottom:24}}>
          <Glitch text="◈ NEXUS EMPIRE" color="#00FFD4" size={20}/>
        </div>
        {lines.map((l,i)=>(
          <div key={i} style={{color:i===lines.length-1?"#00FFD4":"#1A3A2A",fontSize:10,lineHeight:2.4}}>
            ▸ {l}
          </div>
        ))}
        <span style={{color:"#00FFD4",animation:"blink 1s infinite"}}>█</span>
      </div>
      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:"#020508",color:"#E2E8F0",
      fontFamily:"monospace",overflowX:"hidden"}}>
      <Scan/>
      <style>{`
        ::-webkit-scrollbar{width:3px;height:3px}
        ::-webkit-scrollbar-thumb{background:#00FFD418;border-radius:2px}
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.2}}
        @keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
      `}</style>

      {/* HEADER */}
      <div style={{borderBottom:"1px solid #00FFD409",background:"rgba(2,5,8,0.98)",
        backdropFilter:"blur(20px)",padding:"0 16px",position:"sticky",top:0,zIndex:100,
        display:"flex",alignItems:"center",justifyContent:"space-between",height:48}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:16,color:"#00FFD4",filter:"drop-shadow(0 0 8px #00FFD4)"}}>◈</span>
          <div>
            <Glitch text="NEXUS EMPIRE" color="#00FFD4" size={12}/>
            <div style={{color:"#1A3A2A",fontSize:7,letterSpacing:"0.15em"}}>
              v4.0 · {AGENTS.length} AGENTS · {SKILLS.length} SKILLS · MHD Amine 🇩🇿
            </div>
          </div>
        </div>
        <div style={{display:"flex",gap:3}}>
          {VIEWS.map(v=>(
            <button key={v} onClick={()=>setView(v)}
              style={{background:view===v?"#00FFD418":"transparent",
                border:`1px solid ${view===v?"#00FFD4":"transparent"}`,
                color:view===v?"#00FFD4":"#374151",
                padding:"4px 9px",fontSize:7,fontFamily:"monospace",cursor:"pointer",
                letterSpacing:"0.1em"}}>
              {v}
            </button>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:5}}>
          <Dot color="#30D158"/>
          <span style={{color:"#30D158",fontSize:7}}>CLAUDE LIVE</span>
        </div>
      </div>

      {/* LAYOUT */}
      <div style={{display:"flex",height:"calc(100vh - 48px)"}}>
        {/* Sidebar */}
        <div style={{width:172,borderRight:"1px solid #00FFD408",overflowY:"auto",
          padding:"10px 8px",display:"flex",flexDirection:"column",gap:3,flexShrink:0}}>
          <div style={{color:"#1F2937",fontSize:7,letterSpacing:"0.12em",marginBottom:4,paddingLeft:4}}>
            AGENTS
          </div>
          {AGENTS.map(a=>(
            <AgentPill key={a.id} agent={a} selected={agent.id===a.id}
              onClick={()=>{setAgent(a);setView("COMMAND");}}/>
          ))}
          <div style={{marginTop:8,padding:"8px 6px",borderTop:"1px solid #FFFFFF05"}}>
            <div style={{color:"#1F2937",fontSize:7,fontFamily:"monospace",lineHeight:1.8}}>
              ◈ NeuralForge<br/>
              MHD Amine 🇩🇿<br/>
              <span style={{color:"#00FFD420"}}>neuralforgebabal-hue</span>
            </div>
          </div>
        </div>

        {/* Main */}
        <div style={{flex:1,overflowY:"auto",padding:"14px 16px",animation:"fadeIn 0.4s ease"}}>
          {view==="COMMAND"  &&<CommandView agent={agent}/>}
          {view==="AGENTS"   &&<AgentsView onPick={setAgent} setView={setView}/>}
          {view==="SKILLS"   &&<SkillsView/>}
          {view==="MISSIONS" &&<MissionsView/>}
          {view==="MEMORY"   &&<MemoryView/>}
        </div>
      </div>
    </div>
  );
}
