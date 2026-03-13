import { useState } from "react";
import "../styles/Dashboard.css";

import Inicio      from "./Inicio";
import Proyectos   from "./Proyectos";
import Escenas     from "./Escenas";
import Personajes  from "./Personajes";
import Comentarios from "./Comentarios";
import Versiones   from "./Versiones";
import Editor      from "./Editor";

const NAV = [
  { icon: "🏠", label: "Inicio"      },
  { icon: "📁", label: "Proyectos"   },
  { icon: "🎭", label: "Escenas"     },
  { icon: "💬", label: "Comentarios" },
  { icon: "👤", label: "Personajes"  },
  { icon: "📋", label: "Versiones"   },
];

const INITIAL_COLLABS = [
  { id:1, i:"SJ", name:"Santiago Jiménez", role:"Director",  g:true  },
  { id:2, i:"LP", name:"Lisa Pérez",        role:"Guionista", g:false },
  { id:3, i:"AR", name:"Andrés Rojas",      role:"Guionista", g:false },
];

const activity = [
  { i:"LP", name:"Lisa Pérez",       t:"5 min",  txt:"Modificó el diálogo de la segunda escena." },
  { i:"AR", name:"Andrés Rojas",     t:"30 min", txt:"Añadió el personaje Tomás a la lista."      },
  { i:"SJ", name:"Santiago Jiménez", t:"1 hora", txt:"Propuso cambio de final en El Caso Miró."   },
];

export default function Dashboard({ onLogout }) {
  const [nav,      setNav]      = useState("Inicio");
  const [edKey,    setEdKey]    = useState(0);
  const [edData,   setEdData]   = useState(null);
  const [collabs,  setCollabs]  = useState(INITIAL_COLLABS);
  const [invModal, setInvModal] = useState(false);
  const [invEmail, setInvEmail] = useState("");
  const [invRole,  setInvRole]  = useState("Guionista");
  const [invFlash, setInvFlash] = useState(false);
  const [invErr,   setInvErr]   = useState("");

  const openEditor  = (title, template) => { setEdKey(k => k+1); setEdData({ title: title||"Sin título", template: template||null }); };
  const closeEditor = () => setEdData(null);
  const isEditor    = edData !== null;

  const renderView = () => {
    switch (nav) {
      case "Proyectos":   return <Proyectos   onEdit={openEditor} />;
      case "Escenas":     return <Escenas />;
      case "Personajes":  return <Personajes />;
      case "Comentarios": return <Comentarios />;
      case "Versiones":   return <Versiones />;
      default:            return <Inicio onEdit={openEditor} />;
    }
  };

  const sendInvite = () => {
    if (!invEmail.trim() || !/\S+@\S+\.\S+/.test(invEmail)) {
      setInvErr("Ingresa un correo válido."); return;
    }
    const initials = invEmail.slice(0,2).toUpperCase();
    setCollabs(prev => [...prev, { id: Date.now(), i: initials, name: invEmail, role: invRole, g: false }]);
    setInvFlash(true); setInvEmail(""); setInvErr("");
    setTimeout(() => { setInvFlash(false); setInvModal(false); }, 1500);
  };

  const removeCollab = id => setCollabs(prev => prev.filter(c => c.id !== id));

  return (
    <div className="shell" style={{ gridTemplateColumns: isEditor ? "var(--sidebar-w) 1fr" : "var(--sidebar-w) 1fr 300px", height:"100vh" }}>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="topbar-brand">
          <div className="brand-icon">F</div>
          <span className="brand-name">FILMSCRIPT</span>
        </div>
        <div className="topbar-mid">
          {isEditor ? <strong>EDITOR DE GUION</strong> : <>BIENVENIDO,&nbsp;<strong>SANTIAGO.</strong></>}
        </div>
        <div className="topbar-actions">
          {isEditor && <button className="t-icon" onClick={closeEditor} style={{fontWeight:700}}>✕</button>}
          <div className="t-icon">🔔</div>
          <div className="t-icon">🔍</div>
          <div className="avatar">SJ</div>
        </div>
      </header>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-section">
          {NAV.map(item => (
            <button key={item.label}
              className={`nav-btn ${!isEditor && nav===item.label ? "active" : ""}`}
              onClick={() => { setNav(item.label); closeEditor(); }}>
              <span className="ni">{item.icon}</span>{item.label}
            </button>
          ))}
        </div>
        <div className="sidebar-gap" />
        <div className="sidebar-foot">
          <button className="nav-btn"><span className="ni">⚙️</span> Configuración</button>
          <button className="nav-btn" onClick={onLogout}><span className="ni">⏻</span> Salir</button>
        </div>
      </aside>

      {/* MAIN */}
      {isEditor ? (
        <main style={{overflow:"hidden",display:"flex",flexDirection:"column",background:"var(--ed-bg)",minHeight:0,height:"100%"}}>
          <Editor key={edKey} initTitle={edData.title} initTemplate={edData.template} onBack={closeEditor} />
        </main>
      ) : (
        <main className="main">{renderView()}</main>
      )}

      {/* RIGHT PANEL */}
      {!isEditor && (
        <aside className="rpanel">
          <div className="rp-sec">
            <div className="rp-head">
              <div className="rp-ttl">Equipo de <span>La Última Ciudad</span></div>
              <button className="rp-act">⚙ ▾</button>
            </div>
            <div className="sc-add">
              <button className="btn-sc">＋ Nueva escena ▾</button>
              <button className="sc-lnk">Ver todas</button>
            </div>
            {collabs.map(c => (
              <div className="cl-row" key={c.id}>
                <div className="cl-av">{c.i}</div>
                <div className="cl-info">
                  <div className={`cl-name ${c.g?"g":""}`}>{c.name}</div>
                  <div className="cl-role">{c.role}</div>
                </div>
                {!c.g && (
                  <span style={{color:"var(--muted)",cursor:"pointer",fontSize:"16px"}} onClick={() => removeCollab(c.id)} title="Quitar">✕</span>
                )}
              </div>
            ))}
            <button className="btn-inv" onClick={() => { setInvModal(true); setInvEmail(""); setInvErr(""); }}>
              ☰ Invitar colaborador
            </button>
          </div>
          <div className="rp-sec">
            <div className="rp-head">
              <div className="rp-ttl">Actividad reciente</div>
              <button className="rp-act">⊞</button>
            </div>
            {activity.map(a => (
              <div className="ac-item" key={a.name}>
                <div className="ac-av">{a.i}</div>
                <div className="ac-body">
                  <div className="ac-head"><span className="ac-name">{a.name}</span><span className="ac-time">{a.t}</span></div>
                  <div className="ac-text">{a.txt}</div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      )}

      {/* INVITE MODAL */}
      {invModal && (
        <div className="inv-overlay" onClick={e => e.target===e.currentTarget && setInvModal(false)}>
          <div className="inv-modal">
            <button className="inv-close" onClick={() => setInvModal(false)}>✕</button>
            <div className="inv-title">Invitar colaborador</div>
            <div className="inv-sub">El colaborador recibirá un correo con acceso al proyecto.</div>

            <div style={{marginBottom:12}}>
              <div style={{fontSize:"11px",color:"var(--muted2)",marginBottom:5}}>Correo electrónico</div>
              <input className="inv-input" type="email" placeholder="colaborador@correo.com"
                value={invEmail} onChange={e => { setInvEmail(e.target.value); setInvErr(""); }}
                onKeyDown={e => e.key==="Enter" && sendInvite()} autoFocus />
              {invErr && <div style={{fontSize:"11px",color:"var(--red)",marginTop:4}}>⚠ {invErr}</div>}
            </div>

            <div style={{marginBottom:20}}>
              <div style={{fontSize:"11px",color:"var(--muted2)",marginBottom:5}}>Rol</div>
              <select className="inv-sel" value={invRole} onChange={e => setInvRole(e.target.value)}>
                <option>Guionista</option>
                <option>Director</option>
                <option>Editor</option>
                <option>Lector</option>
              </select>
            </div>

            <button className="btn-gold" style={{width:"100%",justifyContent:"center"}} onClick={sendInvite}>
              {invFlash ? "✓ Invitación enviada" : "📨 Enviar invitación"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}