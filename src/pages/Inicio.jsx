import "../styles/Inicio.css";

const projects = [
  { name: "Sin Identidad",    meta: "Largometraje · 2 actos · 14 escenas", date: "21 abr", status: "active" },
  { name: "La Última Ciudad", meta: "Serie · 7 episodios · 3 notas",       date: "21 abr", status: "draft"  },
  { name: "El Caso Miró",     meta: "Cortometraje · 18 escenas",           date: "20 abr", status: "done"   },
  { name: "Volver al Sur",    meta: "Piloto de serie · en desarrollo",     date: "18 abr", status: "draft"  },
];
const SL = { active: "En curso", draft: "Borrador", done: "Finalizado" };
const SC = { active: "b-active",  draft: "b-draft",  done: "b-done"    };

const templates = [
  { icon: "🎬", name: "Piloto de Serie"       },
  { icon: "🎥", name: "Corto / Cortometraje"  },
  { icon: "🎞️", name: "Película Largometraje" },
  { icon: "📢", name: "Publicidad"            },
];

export default function Inicio({ onEdit }) {
  return (
    <>
      <div className="dash-hero">
        <div className="hero-text">
          <h1>Crea sin <em>límites.</em></h1>
          <p>Organiza tus proyectos y escribe tus guiones como nunca antes.</p>
        </div>
        <button className="btn-gold" onClick={() => onEdit("Sin título", null)}>
          <span>＋</span> Crear nuevo guión
        </button>
      </div>

      <div className="sec-head">
        <span className="sec-title">Proyectos recientes</span>
        <button className="sec-link">Ver todos ↗</button>
      </div>
      <div className="proj-list">
        {projects.slice(0, 3).map(p => (
          <div className="proj-row" key={p.name} onClick={() => onEdit(p.name, null)}>
            <div className="proj-ico">📁</div>
            <div className="proj-inf">
              <div className="proj-name">{p.name}</div>
              <div className="proj-meta">{p.meta}</div>
            </div>
            <div className="proj-right">
              <span className="proj-date">{p.date}</span>
              <span className={`badge ${SC[p.status]}`}>{SL[p.status]}</span>
              <div className="proj-menu">⋮</div>
            </div>
          </div>
        ))}
      </div>

      <div className="sec-head" style={{ marginTop: 26 }}>
        <span className="sec-title">Plantillas rápidas</span>
      </div>
      <div className="tpl-grid">
        {templates.map(t => (
          <div className="tpl-card" key={t.name} onClick={() => onEdit(t.name, t.name)}>
            <div className="tpl-ico">{t.icon}</div>
            <div className="tpl-name">{t.name}</div>
          </div>
        ))}
      </div>

      <div className="df">
        <span>📁 {projects.length} proyectos · Última modificación: 2h ago</span>
        <span>👥 3 colaboradores</span>
      </div>
    </>
  );
}