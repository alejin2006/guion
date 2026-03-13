import { useState, useRef, useEffect } from "react";
import "../styles/Editor.css";

const STARTERS = {
  blank: [
    { type: "scene",  val: "INT. LOCACIÓN — DÍA" },
    { type: "action", val: "Describe la acción de esta escena. ¿Qué vemos? ¿Qué ocurre en el espacio?" },
    { type: "char",   val: "PERSONAJE" },
    { type: "dialog", val: "El primer diálogo de tu guion." },
  ],
  "Piloto de Serie": [
    { type: "scene",  val: "INT. SALA DE ESPERA — DÍA" },
    { type: "action", val: "El piloto arranca aquí. La primera imagen que el espectador verá." },
    { type: "char",   val: "PERSONAJE" },
    { type: "dialog", val: "El primer diálogo del piloto." },
  ],
  "Corto / Cortometraje": [
    { type: "scene",  val: "EXT. CALLE PRINCIPAL — NOCHE" },
    { type: "action", val: "Una historia breve que comienza con una imagen poderosa." },
    { type: "char",   val: "PROTAGONISTA" },
    { type: "dialog", val: "Una sola frase que lo define todo." },
  ],
  "Película Largometraje": [
    { type: "scene",  val: "INT. HABITACIÓN — AMANECER" },
    { type: "action", val: "FUNDIDO DESDE NEGRO. El mundo del protagonista antes de que todo cambie." },
    { type: "char",   val: "VOZ EN OFF" },
    { type: "paren",  val: "(nostálgico)" },
    { type: "dialog", val: "Dicen que hay momentos que lo cambian todo." },
  ],
  "Publicidad": [
    { type: "scene",  val: "EXT. CIUDAD — DÍA" },
    { type: "action", val: "Plano abierto. La marca aparece integrada en la vida cotidiana." },
    { type: "char",   val: "LOCUTOR" },
    { type: "dialog", val: "El mensaje principal del producto." },
  ],
};

const LABELS       = { scene: "escena", action: "acción", char: "personaje", dialog: "diálogo", paren: "(nota)", trans: "transición" };
const PLACEHOLDERS = { scene: "ENCABEZADO DE ESCENA", action: "Descripción de acción...", char: "PERSONAJE", dialog: "Diálogo...", paren: "(acotación)", trans: "CORTE A:" };

function ScriptBlock({ type, val, onChange }) {
  const ta = useRef(null);
  useEffect(() => {
    if (ta.current) {
      ta.current.style.height = "auto";
      ta.current.style.height = ta.current.scrollHeight + "px";
    }
  }, [val]);
  return (
    <div className={`sblk sblk-${type}`}>
      <span className="sblk-lbl">{LABELS[type]}</span>
      <textarea
        ref={ta}
        rows={1}
        value={val}
        placeholder={PLACEHOLDERS[type]}
        onChange={e => onChange(e.target.value)}
      />
    </div>
  );
}

export default function Editor({ initTitle, initTemplate, onBack }) {
  const key     = initTemplate || "blank";
  const initial = (STARTERS[key] || STARTERS.blank).map((b, i) => ({ id: i, type: b.type, val: b.val }));

  const [title,  setTitle]  = useState(initTitle || "Sin título");
  const [blocks, setBlocks] = useState(initial);
  const [nextId, setNextId] = useState(initial.length);
  const [saved,  setSaved]  = useState(false);

  const updateVal  = (id, val) => setBlocks(prev => prev.map(b => b.id === id ? { ...b, val } : b));
  const addBlock   = (type)   => { setBlocks(prev => [...prev, { id: nextId, type, val: "" }]); setNextId(n => n + 1); };
  const handleSave = ()       => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const sceneBlocks = blocks.filter(b => b.type === "scene");
  const wordCount   = blocks.reduce((a, b) => a + b.val.trim().split(/\s+/).filter(Boolean).length, 0);

  return (
    <div className="editor-shell">

      {/* LEFT — scene list */}
      <div className="ed-left">
        <div className="ed-left-top">
          <span className="ed-left-lbl">Escenas</span>
          <button className="ed-plus" onClick={() => addBlock("scene")}>+</button>
        </div>
        <div className="ed-sc-list">
          {sceneBlocks.length === 0 && (
            <p style={{ padding: "14px 10px", fontSize: "11px", color: "var(--muted)", textAlign: "center", lineHeight: 1.5 }}>
              Sin escenas aún.<br />Pulsa + para agregar.
            </p>
          )}
          {sceneBlocks.map((s, i) => (
            <div key={s.id} className="ed-sc-item on">
              <div className="ed-sc-n">ESC {String(i + 1).padStart(2, "0")}</div>
              <div className="ed-sc-t">{s.val || "Sin título"}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CENTER — writing */}
      <div className="ed-center">
        <div className="ed-toolbar">
          <button className="ed-tb-btn" onClick={() => addBlock("scene")}>🎬 Escena</button>
          <div className="ed-tb-sep" />
          <button className="ed-tb-btn" onClick={() => addBlock("action")}>📝 Acción</button>
          <button className="ed-tb-btn" onClick={() => addBlock("char")}>👤 Personaje</button>
          <button className="ed-tb-btn" onClick={() => addBlock("dialog")}>💬 Diálogo</button>
          <button className="ed-tb-btn" onClick={() => addBlock("paren")}>() Paréntesis</button>
          <button className="ed-tb-btn" onClick={() => addBlock("trans")}>⏭ Transición</button>
          <div className="ed-tb-sep" />
          <button className="ed-tb-save" onClick={handleSave}>{saved ? "✓ Guardado" : "💾 Guardar"}</button>
        </div>

        <div className="ed-title-bar">
          <input className="ed-title-inp" value={title} onChange={e => setTitle(e.target.value)} placeholder="Título del guion..." />
        </div>
        <div className="ed-crumb">
          <button onClick={onBack}>← Volver</button>
          <span className="sep">/</span>
          <span className="cur">{title}</span>
          {initTemplate && <><span className="sep">·</span><span style={{ color: "var(--muted)" }}>{initTemplate}</span></>}
        </div>

        <div className="ed-body">
          {blocks.map(b => (
            <ScriptBlock key={b.id} type={b.type} val={b.val} onChange={val => updateVal(b.id, val)} />
          ))}
          <div style={{ marginTop: 28, display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["scene", "action", "char", "dialog", "paren", "trans"].map(t => (
              <button key={t} onClick={() => addBlock(t)}
                style={{ padding: "4px 11px", border: "1px dashed rgba(255,255,255,0.1)", borderRadius: "6px", background: "none", color: "var(--muted)", fontSize: "11px", cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "var(--muted)"; }}>
                + {LABELS[t]}
              </button>
            ))}
          </div>
        </div>

        <div className="ed-status">
          <div className="ed-status-dot" />
          <span>{wordCount} palabras</span>
          <span>·</span><span>{blocks.length} bloques</span>
          <span>·</span><span>{sceneBlocks.length} escenas</span>
          <span>·</span><span>~{Math.ceil(wordCount / 200) || 0} pág.</span>
        </div>
      </div>

      {/* RIGHT — properties */}
      <div className="ed-right">
        <div className="ed-r-sec">
          <button className="ed-back-btn" onClick={onBack}>← Volver al inicio</button>
          <button className="ed-save-big" onClick={handleSave}>{saved ? "✓ Guardado" : "💾 Guardar guion"}</button>
        </div>
        <div className="ed-r-sec">
          <div className="ed-r-ttl">Propiedades</div>
          <div style={{ fontSize: "11px", color: "var(--muted2)", marginBottom: 5 }}>Título</div>
          <input className="ed-inp" value={title} onChange={e => setTitle(e.target.value)} />
          <div style={{ fontSize: "11px", color: "var(--muted2)", marginBottom: 5 }}>Tipo</div>
          <select className="ed-sel" defaultValue={initTemplate || "Largometraje"}>
            <option>Largometraje</option><option>Cortometraje</option>
            <option>Piloto de Serie</option><option>Publicidad</option><option>Otro</option>
          </select>
          <div style={{ fontSize: "11px", color: "var(--muted2)", marginBottom: 5 }}>Estado</div>
          <select className="ed-sel">
            <option>Borrador</option><option>En curso</option><option>Finalizado</option>
          </select>
        </div>
        <div className="ed-r-sec">
          <div className="ed-r-ttl">Estadísticas</div>
          {[["Palabras", wordCount], ["Escenas", sceneBlocks.length], ["Bloques", blocks.length], ["~Páginas", Math.ceil(wordCount / 250) || 0]].map(([l, v]) => (
            <div className="ed-r-row" key={l}>
              <span className="ed-r-lbl">{l}</span>
              <span className="ed-r-val">{v}</span>
            </div>
          ))}
        </div>
        <div className="ed-r-sec">
          <div className="ed-r-ttl">Insertar bloque</div>
          <div className="fmt-grid">
            {[["🎬","scene","Escena"],["📝","action","Acción"],["👤","char","Personaje"],["💬","dialog","Diálogo"],["()","paren","Paréntesis"],["⏭","trans","Transición"]].map(([ic,tp,lb]) => (
              <button key={tp} className="fmt-btn" onClick={() => addBlock(tp)}>{ic} {lb}</button>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}