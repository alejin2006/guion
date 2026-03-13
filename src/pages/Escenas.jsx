import { useState } from "react";
import "../styles/Escenas.css";

const PROJECTS = ["Sin Identidad", "La Última Ciudad", "El Caso Miró", "Volver al Sur"];
const TIPOS    = ["INT", "EXT", "INT/EXT"];
const MOMENTOS = ["Día", "Noche", "Amanecer", "Atardecer", "Continuo"];

const INITIAL = [
  { id:1, title:"El encuentro",       project:"Sin Identidad",    type:"INT", lugar:"Oficina",   momento:"Noche",    pags:3 },
  { id:2, title:"La huida",           project:"Sin Identidad",    type:"EXT", lugar:"Callejón",  momento:"Noche",    pags:2 },
  { id:3, title:"Revelación",         project:"La Última Ciudad", type:"INT", lugar:"Hospital",  momento:"Día",      pags:5 },
  { id:4, title:"El final del mundo", project:"La Última Ciudad", type:"EXT", lugar:"Azotea",    momento:"Amanecer", pags:4 },
  { id:5, title:"La verdad",          project:"El Caso Miró",     type:"INT", lugar:"Sala",      momento:"Tarde",    pags:3 },
];

const EMPTY = { title:"", project:"Sin Identidad", type:"INT", lugar:"", momento:"Día", pags:1 };

export default function Escenas() {
  const [scenes,  setScenes]  = useState(INITIAL);
  const [filter,  setFilter]  = useState("Todos");
  const [modal,   setModal]   = useState(false);
  const [form,    setForm]    = useState(EMPTY);
  const [errors,  setErrors]  = useState({});
  const [editId,  setEditId]  = useState(null);
  const [confirm, setConfirm] = useState(null);

  const projs = ["Todos", ...new Set(scenes.map(s => s.project))];
  const list  = filter === "Todos" ? scenes : scenes.filter(s => s.project === filter);

  const set = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors(e => ({ ...e, [k]: "" })); };

  const openNew = () => {
    setForm({ ...EMPTY, project: filter === "Todos" ? "Sin Identidad" : filter });
    setEditId(null);
    setErrors({});
    setModal(true);
  };

  const openEdit = (s, e) => {
    e.stopPropagation();
    setForm({ title: s.title, project: s.project, type: s.type, lugar: s.lugar, momento: s.momento, pags: s.pags });
    setEditId(s.id);
    setErrors({});
    setModal(true);
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "El título es obligatorio.";
    if (!form.lugar.trim()) e.lugar = "La locación es obligatoria.";
    return e;
  };

  const save = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    if (editId) {
      setScenes(prev => prev.map(s => s.id === editId ? { ...s, ...form, pags: Number(form.pags) || 1 } : s));
    } else {
      setScenes(prev => [...prev, { ...form, id: Date.now(), pags: Number(form.pags) || 1 }]);
    }
    setModal(false);
  };

  const remove = (id) => {
    setScenes(prev => prev.filter(s => s.id !== id));
    setConfirm(null);
  };

  return (
    <>
      <div className="page-h">Escenas</div>
      <div className="page-sub">Administra y organiza todas las escenas de tus proyectos.</div>

      <div className="fbar">
        {projs.map(p => (
          <button key={p} className={`fbtn ${filter === p ? "on" : ""}`} onClick={() => setFilter(p)}>{p}</button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <button className="btn-gold sm" onClick={openNew}>＋ Nueva escena</button>
        </div>
      </div>

      <table className="stbl">
        <thead>
          <tr>
            <th>#</th>
            <th>Título</th>
            <th>Proyecto</th>
            <th>Tipo</th>
            <th>Locación</th>
            <th>Págs.</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: "center", padding: "32px", color: "var(--muted)", fontSize: "13px" }}>
                No hay escenas aquí todavía.
              </td>
            </tr>
          )}
          {list.map((s, i) => (
            <tr key={s.id}>
              <td><span className="sc-num">{String(i + 1).padStart(2, "0")}</span></td>
              <td style={{ fontWeight: 500, color: "var(--text)" }}>{s.title}</td>
              <td style={{ color: "var(--muted2)", fontSize: "12px" }}>{s.project}</td>
              <td><span className="sc-type">{s.type}</span></td>
              <td style={{ color: "var(--muted2)", fontSize: "12px" }}>{s.lugar} — {s.momento}</td>
              <td style={{ color: "var(--muted2)", fontSize: "12px" }}>{s.pags}p.</td>
              <td>
                <div style={{ display: "flex", gap: 6 }}>
                  <button className="sc-row-btn" onClick={e => openEdit(s, e)}>✏</button>
                  <button className="sc-row-btn sc-row-del" onClick={e => { e.stopPropagation(); setConfirm(s.id); }}>🗑</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ── MODAL NUEVA / EDITAR ESCENA ── */}
      {modal && (
        <div className="sc-modal-overlay" onClick={e => e.target === e.currentTarget && setModal(false)}>
          <div className="sc-modal">
            <button className="sc-modal-close" onClick={() => setModal(false)}>✕</button>
            <div className="sc-modal-title">{editId ? "Editar escena" : "Nueva escena"}</div>

            <div className="sc-form-row">
              <label>Título</label>
              <input className={`sc-form-input ${errors.title ? "sc-input-err" : ""}`}
                placeholder="Ej: El encuentro" value={form.title} onChange={e => set("title", e.target.value)} />
              {errors.title && <div className="sc-field-err">⚠ {errors.title}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="sc-form-row">
                <label>Tipo</label>
                <select className="sc-form-sel" value={form.type} onChange={e => set("type", e.target.value)}>
                  {TIPOS.map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div className="sc-form-row">
                <label>Momento</label>
                <select className="sc-form-sel" value={form.momento} onChange={e => set("momento", e.target.value)}>
                  {MOMENTOS.map(m => <option key={m}>{m}</option>)}
                </select>
              </div>
            </div>

            <div className="sc-form-row">
              <label>Locación</label>
              <input className={`sc-form-input ${errors.lugar ? "sc-input-err" : ""}`}
                placeholder="Ej: Oficina principal" value={form.lugar} onChange={e => set("lugar", e.target.value)} />
              {errors.lugar && <div className="sc-field-err">⚠ {errors.lugar}</div>}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div className="sc-form-row">
                <label>Proyecto</label>
                <select className="sc-form-sel" value={form.project} onChange={e => set("project", e.target.value)}>
                  {PROJECTS.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="sc-form-row">
                <label>Páginas</label>
                <input className="sc-form-input" type="number" min={1} max={99}
                  value={form.pags} onChange={e => set("pags", e.target.value)} />
              </div>
            </div>

            <div className="sc-modal-acts">
              <button className="btn-gold sm" onClick={save}>💾 {editId ? "Guardar cambios" : "Crear escena"}</button>
              <button className="btn-outline" onClick={() => setModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* ── CONFIRM DELETE ── */}
      {confirm && (
        <div className="sc-modal-overlay" onClick={e => e.target === e.currentTarget && setConfirm(null)}>
          <div className="sc-modal" style={{ maxWidth: 340, textAlign: "center" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🗑</div>
            <div className="sc-modal-title">¿Eliminar escena?</div>
            <div style={{ fontSize: "13px", color: "var(--muted2)", marginBottom: 22 }}>Esta acción no se puede deshacer.</div>
            <div className="sc-modal-acts" style={{ justifyContent: "center" }}>
              <button className="btn-red" onClick={() => remove(confirm)}>Sí, eliminar</button>
              <button className="btn-outline" onClick={() => setConfirm(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}