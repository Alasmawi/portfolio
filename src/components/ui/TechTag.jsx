import {
  siEspressif,
  siFastapi,
  siGnubash,
  siGo,
  siJavascript,
  siMinio,
  siNestjs,
  siNginx,
  siOllama,
  siOpencv,
  siPostgresql,
  siPrisma,
  siPython,
  siReact,
  siRust,
  siSqlite,
  siUltralytics,
} from 'simple-icons';

// A technology, shown by its own mark with the name beside it. The marks come
// from simple-icons, which carries each project's official glyph and brand
// colour.
//
// Not everything has one. simple-icons dropped the AWS and Microsoft marks at
// those companies' request, and topics like "Networking" were never brands, so
// those render as the name alone. To give one a mark, put the vendor's own
// file in public/logos/ and add it to LOCAL below.
const ICONS = {
  Rust: siRust,
  React: siReact,
  SQLite: siSqlite,
  Go: siGo,
  Python: siPython,
  PostgreSQL: siPostgresql,
  NestJS: siNestjs,
  JavaScript: siJavascript,
  FastAPI: siFastapi,
  nginx: siNginx,
  Prisma: siPrisma,
  OpenCV: siOpencv,
  Ollama: siOllama,
  MinIO: siMinio,
  ESP32: siEspressif,
  Shell: siGnubash,
  YOLOv8: siUltralytics,
};

// name → path under public/, for marks simple-icons does not carry.
const LOCAL = {};

const INK = '#fbeef0';

// A brand colour is only used where it can be seen. Rust's is black and
// SQLite's a near-black teal; on this ground those are holes, so anything
// darker than the threshold is drawn in the page's own ink instead.
function visible(hex) {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b >= 0.13 ? `#${hex}` : INK;
}

export default function TechTag({ name, className = '' }) {
  const icon = ICONS[name];
  const local = LOCAL[name];
  return (
    <span className={`tech-tag ${className}`}>
      {icon && (
        <svg width={13} height={13} viewBox="0 0 24 24" fill={visible(icon.hex)} className="shrink-0" aria-hidden="true">
          <path d={icon.path} />
        </svg>
      )}
      {!icon && local && (
        <img src={`${import.meta.env.BASE_URL}${local}`} alt="" width={14} height={14} className="h-3.5 w-3.5 shrink-0 object-contain" />
      )}
      {name}
    </span>
  );
}
