import { useEffect, useRef } from 'react';
import { mountNeonCloud } from './neonCloud';

export default function NeonCloudCanvas({ className = '' }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return undefined;
    const unmount = mountNeonCloud(canvasRef.current, { neonColor: '#2FC2E8' });
    return unmount;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
}
