import { useState } from "react";
import "../styles/Comentarios.css";

const INITIAL = [
  { id:1, initials:"LP", name:"Lisa Pérez",       time:"5 min",   project:"La Última Ciudad", text:"El diálogo de la escena 3 suena forzado. ¿Podemos revisarlo?",   resolved:false, replies:[] },
  { id:2, initials:"AR", name:"Andrés Rojas",     time:"30 min",  project:"Sin Identidad",    text:"Añadí un nuevo personaje llamado Tomás en la escena 7.",           resolved:false, replies:[] },
  { id:3, initials:"SJ", name:"Santiago Jiménez", time:"1 hora",  project:"El Caso Miró",     text:"Deberíamos cambiar el final. El giro actual no sorprende.",        resolved:false, replies:[] },
  { id:4, initials:"LP", name:"Lisa Pérez",       time:"3 horas", project:"Sin Identidad",    text:"Las páginas 12-15 del acto I están brillantes.",                  resolved:false, replies:[] },
];

export default function Comentarios() {
  const [comments,    setComments]    = useState(INITIAL);
  const [filter,      setFilter]      = useState("Todos");
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyText,   setReplyText]   = useState("");
  const [newText,     setNewText]     = useState("");
  const [flash,       setFlash]       = useState(false);

  const projects = ["Todos", ...new Set(comments.map(c => c.project))];

  const filtered = filter === "Resueltos"
    ? comments.filter(c => c.resolved)
    : filter === "Todos" ? comments : comments.filter(c => c.project === filter);

  const resolve = id =>
    setComments(prev => prev.map(c => c.id === id ? { ...c, resolved: !c.resolved } : c));

  const submitReply = id => {
    if (!replyText.trim()) return;
    setComments(prev => prev.map(c => c.id === id
      ? { ...c, replies: [...c.replies, { text: replyText.trim(), name: "Tú", time: "Ahora" }] }
      : c));
    setReplyText(""); setReplyTarget(null);
  };

  const addComment = () => {
    if (!newText.trim()) return;
    setComments(prev => [{
      id: Date.now(), initials: "TU", name: "Tú", time: "Ahora",
      project: filter === "Todos" || filter === "Resueltos" ? "Sin Identidad" : filter,
      text: newText.trim(), resolved: false, replies: []
    }, ...prev]);
    setNewText(""); setFlash(true); setTimeout(() => setFlash(false), 2000);
  };

  return (
    <>
      <div className="page-h">Comentarios</div>
      <div className="page-sub">Conversaciones y notas del equipo sobre tus guiones.</div>

      <div className="cm-new">
        <textarea className="cm-new-input" placeholder="Escribe un comentario nuevo..." value={newText} onChange={e => setNewText(e.target.value)} rows={2} />
        <button className="btn-gold sm" onClick={addComment}>{flash ? "✓ Agregado" : "＋ Comentar"}</button>
      </div>

      <div className="fbar" style={{marginTop:16}}>
        {[...projects, "Resueltos"].map(p => (
          <button key={p} className={`fbtn ${filter===p?"on":""}`} onClick={() => setFilter(p)}>{p === "Resueltos" ? "✓ Resueltos" : p}</button>
        ))}
      </div>

      <div className="cm-list">
        {filtered.map(c => (
          <div className={`cm-card ${c.resolved?"cm-resolved":""}`} key={c.id}>
            <div className="cm-head">
              <div className="cm-av">{c.initials}</div>
              <div><div className="cm-author">{c.name}</div><div className="cm-time">{c.time}</div></div>
              <span className="cm-proj">{c.project}</span>
              {c.resolved && <span className="cm-resolved-badge">✓ Resuelto</span>}
            </div>
            <div className="cm-text">{c.text}</div>
            {c.replies.length > 0 && (
              <div className="cm-replies">
                {c.replies.map((r,i) => (
                  <div className="cm-reply" key={i}>
                    <span className="cm-reply-name">{r.name}</span>
                    <span className="cm-reply-time"> · {r.time}</span>
                    <div className="cm-reply-text">{r.text}</div>
                  </div>
                ))}
              </div>
            )}
            {replyTarget === c.id && (
              <div className="cm-reply-box">
                <input className="cm-reply-input" placeholder="Escribe una respuesta..." value={replyText}
                  onChange={e => setReplyText(e.target.value)} onKeyDown={e => e.key==="Enter" && submitReply(c.id)} autoFocus />
                <button className="cm-reply-send" onClick={() => submitReply(c.id)}>Enviar</button>
                <button className="cm-reply-cancel" onClick={() => setReplyTarget(null)}>✕</button>
              </div>
            )}
            <div className="cm-foot">
              <button className="cm-act" onClick={() => { setReplyTarget(replyTarget===c.id?null:c.id); setReplyText(""); }}>
                💬 {replyTarget===c.id?"Cancelar":"Responder"}
              </button>
              <button className="cm-act" onClick={() => resolve(c.id)}>{c.resolved?"↩ Reabrir":"✓ Resolver"}</button>
              <button className="cm-act">🔖 Guardar</button>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{textAlign:"center",padding:"40px 0",color:"var(--muted)",fontSize:"13px"}}>
            No hay comentarios aquí todavía.
          </div>
        )}
      </div>
    </>
  );
}