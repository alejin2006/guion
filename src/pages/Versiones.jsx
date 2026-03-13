import { useState } from "react";
import "../styles/Versiones.css";

const INITIAL = [
  { id:1, name:"v3.2 — Revisión final",   date:"Hoy, 10:22",    author:"Santiago Jiménez", cur:true,  ch:"Ajuste de diálogos en acto II. Nuevo final para El Caso Miró." },
  { id:2, name:"v3.1 — Segundo borrador", date:"Ayer, 18:45",   author:"Lisa Pérez",       cur:false, ch:"Incorporación de personaje Tomás. Reescritura de escenas 6 y 7." },
  { id:3, name:"v3.0 — Primer borrador",  date:"20 abr, 14:10", author:"Santiago Jiménez", cur:false, ch:"Estructura completa del acto I y II." },
  { id:4, name:"v2.5 — Borrador inicial", date:"18 abr, 09:30", author:"Andrés Rojas",     cur:false, ch:"Creación del proyecto. Sinopsis y personajes principales." },
];

export default function Versiones() {
  const [versions, setVersions] = useState(INITIAL);
  const [confirm,  setConfirm]  = useState(null); // { type:"restore"|"delete", id }
  const [flash,    setFlash]    = useState(false);

  const restore = id => {
    setVersions(prev => prev.map(v => ({ ...v, cur: v.id === id })));
    setConfirm(null);
  };

  const remove = id => {
    setVersions(prev => prev.filter(v => v.id !== id));
    setConfirm(null);
  };

  const saveNew = () => {
    const next = `v${(versions.length + 1)}.0 — Nueva versión`;
    setVersions(prev => [
      { id: Date.now(), name: next, date: "Ahora", author: "Tú", cur: false, ch: "Versión guardada manualmente." },
      ...prev
    ]);
    setFlash(true); setTimeout(() => setFlash(false), 2000);
  };

  return (
    <>
      <div className="page-h">Versiones</div>
      <div className="page-sub">Historial de cambios de tus guiones.</div>

      <div style={{display:"flex",justifyContent:"flex-end",marginBottom:18}}>
        <button className="btn-gold sm" onClick={saveNew}>{flash ? "✓ Guardada" : "＋ Guardar versión"}</button>
      </div>

      <div className="vr-list">
        {versions.map((v, i) => (
          <div className="vr-item" key={v.id}>
            <div className="vr-line" />
            <div className={`vr-dot ${v.cur?"cur":""}`}>{v.cur ? "★" : i + 1}</div>
            <div className="vr-body">
              <div className="vr-head">
                <span className="vr-name">{v.name}</span>
                <span className={`vr-tag ${v.cur?"vr-cur":"vr-old"}`}>{v.cur?"Actual":"Anterior"}</span>
              </div>
              <div className="vr-meta">{v.date} · {v.author}</div>
              <div className="vr-changes">{v.ch}</div>
              <div className="vr-acts">
                {!v.cur && <button className="btn-outline" onClick={() => setConfirm({type:"restore",id:v.id})}>↩ Restaurar</button>}
                <button className="btn-outline">👁 Ver</button>
                {!v.cur && <button className="btn-red" onClick={() => setConfirm({type:"delete",id:v.id})}>🗑 Eliminar</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Confirm modal */}
      {confirm && (
        <div className="vr-modal-overlay" onClick={e => e.target===e.currentTarget && setConfirm(null)}>
          <div className="vr-modal">
            <div className="vr-modal-icon">{confirm.type==="restore"?"↩":"🗑"}</div>
            <div className="vr-modal-title">
              {confirm.type==="restore" ? "¿Restaurar esta versión?" : "¿Eliminar esta versión?"}
            </div>
            <div className="vr-modal-sub">
              {confirm.type==="restore"
                ? "Esta versión se marcará como la actual. Los cambios no se perderán."
                : "Esta acción no se puede deshacer."}
            </div>
            <div className="vr-modal-acts">
              {confirm.type==="restore"
                ? <button className="btn-gold sm" onClick={() => restore(confirm.id)}>Sí, restaurar</button>
                : <button className="btn-red"     onClick={() => remove(confirm.id)}>Sí, eliminar</button>
              }
              <button className="btn-outline" onClick={() => setConfirm(null)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}