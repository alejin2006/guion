import { useState } from "react";
import "../styles/Personajes.css";

const INITIAL = [
  { id:1, emoji:"🕵️", name:"Elena Vargas",  role:"Protagonista", project:"Sin Identidad",    scenes:14, desc:"Detective de 34 años, meticulosa y determinada. Oculta un secreto del pasado." },
  { id:2, emoji:"🎭", name:"Marco Ruiz",    role:"Antagonista",  project:"Sin Identidad",    scenes:9,  desc:"Empresario corrupto. Carismático y manipulador." },
  { id:3, emoji:"👩‍⚕️", name:"Sofía Mendez", role:"Secundario",   project:"La Última Ciudad", scenes:6,  desc:"Médica de urgencias. Testigo clave del incidente." },
  { id:4, emoji:"👴", name:"Don Alberto",   role:"Secundario",   project:"El Caso Miró",     scenes:4,  desc:"Vecino de 70 años. Guarda silencio sobre lo que vio." },
  { id:5, emoji:"🧑‍💻", name:"Nico Torres",  role:"Protagonista", project:"La Última Ciudad", scenes:11, desc:"Hacker autodidacta. Irreverente pero con brújula moral." },
  { id:6, emoji:"👮", name:"Sgt. Herrera",  role:"Apoyo",        project:"Sin Identidad",    scenes:7,  desc:"Sargento veterano. Leal a Elena aunque no siempre de acuerdo." },
];

const ROLES    = ["Protagonista","Antagonista","Secundario","Apoyo","Extra"];
const PROJECTS = ["Sin Identidad","La Última Ciudad","El Caso Miró","Volver al Sur"];
const EMOJIS   = ["🕵️","🎭","👩‍⚕️","👴","🧑‍💻","👮","🦸","🧙","👤","🎪","🧑‍🎨","🎬"];

const EMPTY = { emoji:"👤", name:"", role:"Protagonista", project:"Sin Identidad", scenes:0, desc:"" };

export default function Personajes() {
  const [chars,  setChars]  = useState(INITIAL);
  const [filter, setFilter] = useState("Todos");
  const [modal,  setModal]  = useState(null); // null | { mode:"view"|"edit"|"new", char }
  const [form,   setForm]   = useState(EMPTY);

  const projs = ["Todos", ...new Set(chars.map(c => c.project))];
  const list  = filter === "Todos" ? chars : chars.filter(c => c.project === filter);

  const openView = c  => { setModal({ mode:"view", char:c }); };
  const openNew  = () => { setForm({...EMPTY}); setModal({ mode:"new" }); };
  const openEdit = c  => { setForm({...c});     setModal({ mode:"edit", char:c }); };
  const closeModal   = () => setModal(null);

  const save = () => {
    if (!form.name.trim()) return;
    if (modal.mode === "new") {
      setChars(prev => [...prev, { ...form, id: Date.now(), scenes: Number(form.scenes)||0 }]);
    } else {
      setChars(prev => prev.map(c => c.id === modal.char.id ? { ...c, ...form, scenes: Number(form.scenes)||0 } : c));
    }
    closeModal();
  };

  const remove = id => { setChars(prev => prev.filter(c => c.id !== id)); closeModal(); };

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <>
      <div className="page-h">Personajes</div>
      <div className="page-sub">Ficha de cada personaje de tus guiones.</div>

      <div className="fbar">
        {projs.map(p => (
          <button key={p} className={`fbtn ${filter===p?"on":""}`} onClick={() => setFilter(p)}>{p}</button>
        ))}
        <div style={{marginLeft:"auto"}}>
          <button className="btn-gold sm" onClick={openNew}>＋ Nuevo personaje</button>
        </div>
      </div>

      <div className="ch-grid">
        {list.map(c => (
          <div className="ch-card" key={c.id} onClick={() => openView(c)}>
            <div className="ch-av">{c.emoji}</div>
            <div className="ch-name">{c.name}</div>
            <div className="ch-role">{c.role}</div>
            <div className="ch-desc">{c.desc}</div>
            <div className="ch-meta">🎭 {c.scenes} escenas · 📁 {c.project}</div>
          </div>
        ))}
      </div>

      {/* MODAL */}
      {modal && (
        <div className="ch-modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="ch-modal">
            <button className="ch-modal-close" onClick={closeModal}>✕</button>

            {modal.mode === "view" ? (
              <>
                <div className="ch-modal-av">{modal.char.emoji}</div>
                <div className="ch-modal-name">{modal.char.name}</div>
                <div className="ch-modal-role">{modal.char.role}</div>
                <div className="ch-modal-desc">{modal.char.desc}</div>
                <div className="ch-modal-meta">🎭 {modal.char.scenes} escenas &nbsp;·&nbsp; 📁 {modal.char.project}</div>
                <div className="ch-modal-acts">
                  <button className="btn-gold sm" onClick={() => openEdit(modal.char)}>✏ Editar</button>
                  <button className="btn-red" onClick={() => remove(modal.char.id)}>🗑 Eliminar</button>
                </div>
              </>
            ) : (
              <>
                <div className="ch-modal-name" style={{marginBottom:16}}>{modal.mode==="new"?"Nuevo personaje":"Editar personaje"}</div>

                <div className="ch-form-row">
                  <div style={{fontSize:"11px",color:"var(--muted2)",marginBottom:5}}>Emoji</div>
                  <div className="ch-emoji-grid">
                    {EMOJIS.map(e => (
                      <button key={e} className={`ch-emoji-btn ${form.emoji===e?"on":""}`} onClick={() => set("emoji",e)}>{e}</button>
                    ))}
                  </div>
                </div>

                {[["Nombre","name","text","Nombre del personaje"],["Descripción","desc","text","Breve descripción..."]].map(([lbl,key,type,ph]) => (
                  <div className="ch-form-row" key={key}>
                    <div style={{fontSize:"11px",color:"var(--muted2)",marginBottom:5}}>{lbl}</div>
                    <input className="ch-form-input" type={type} placeholder={ph} value={form[key]} onChange={e => set(key,e.target.value)} />
                  </div>
                ))}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div className="ch-form-row">
                    <div style={{fontSize:"11px",color:"var(--muted2)",marginBottom:5}}>Rol</div>
                    <select className="ch-form-sel" value={form.role} onChange={e => set("role",e.target.value)}>
                      {ROLES.map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div className="ch-form-row">
                    <div style={{fontSize:"11px",color:"var(--muted2)",marginBottom:5}}>Proyecto</div>
                    <select className="ch-form-sel" value={form.project} onChange={e => set("project",e.target.value)}>
                      {PROJECTS.map(p => <option key={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="ch-modal-acts">
                  <button className="btn-gold sm" onClick={save}>💾 Guardar</button>
                  <button className="btn-outline" onClick={closeModal}>Cancelar</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}