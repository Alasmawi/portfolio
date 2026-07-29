import sensorNode from '../../assets/k9/sensor-node.webp';
import camera from '../../assets/k9/camera.webp';
import foodScale from '../../assets/k9/smart-food-scale.webp';
import collar from '../../assets/k9/collar.webp';

const HARDWARE = [
  {
    src: sensorNode,
    tag: 'node-a',
    alt: 'K-9 Unit sensor enclosure with a live OLED telemetry display',
  },
  {
    src: camera,
    tag: 'esp32-cam',
    alt: 'ESP32 bullet camera mounted on a tripod',
  },
  {
    src: foodScale,
    tag: 'food-cart',
    alt: '3D-printed smart food scale enclosure with an OLED display',
  },
  {
    src: collar,
    tag: 'collar · polar-h10',
    alt: 'K9 collar with a live heart-rate and temperature display',
  },
];

export default function K9Hardware() {
  return (
    <div>
      <p className="mb-3 font-mono text-xs uppercase tracking-wider text-text-dim">
        // hardware
      </p>
      <div className="ml-auto grid max-w-sm grid-cols-2 gap-3 sm:max-w-md">
        {HARDWARE.map((item) => (
          <div
            key={item.tag}
            className="group relative overflow-hidden border border-base-border bg-base-surface/40"
          >
            <img
              src={item.src}
              alt={item.alt}
              loading="lazy"
              className="aspect-[391/317] w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
            <span className="absolute bottom-1.5 left-1.5 rounded border border-base-border/80 bg-base-bg/80 px-1.5 py-0.5 font-mono text-[9px] text-text-dim backdrop-blur-sm">
              {item.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
