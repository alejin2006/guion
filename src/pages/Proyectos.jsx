import { useState } from "react";

const projects = [
  { name: "Sin Identidad",    meta: "Largometraje · 2 actos · 14 escenas", date: "21 abr", status: "active" },
  { name: "La Última Ciudad", meta: "Serie · 7 episodios · 3 notas",       date: "21 abr", status: "draft"  },
  { name: "El Caso Miró",     meta: "Cortometraje · 18 escenas",           date: "20 abr", status: "done"   },
  { name: "Volver al Sur",    meta: "Piloto de serie · en desarrollo",     date: "18 abr", status: "draft"  },
];
const SL = { active: "En curso", draft: "Borrador", done: "Finalizado" };
const SC = { active: "b-active",  draft: "b-draft",  done: "b-done"    };

export default function Proyectos({ onEdit }) {
  const [filter, setFilter] = useState("Todos");
  const opts = ["Todos", "En curso", "Borrador", "Finalizado"];
  const list = filter === "Todos" ? projects : projects.filter(p => SL[p.status] === filter);

  return (
    <>
      <div className="page-h">Proyectos</div>
      <div className="page-sub">Todos tus guiones en un solo lugar.</div>

      <div className="fbar">
        {opts.map(o => (
          <button key={o} className={`fbtn ${filter === o ? "on" : ""}`} onClick={() => setFilter(o)}>{o}</button>
        ))}
        <div style={{ marginLeft: "auto" }}>
          <button className="btn-gold sm" onClick={() => onEdit("Sin título", null)}>＋ Nuevo proyecto</button>
        </div>
      </div>

      <div className="proj-list">
        {list.map(p => (
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
    </>
  );
}