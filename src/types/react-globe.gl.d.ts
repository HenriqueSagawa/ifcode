declare module 'react-globe.gl' {
  import { RefObject } from 'react';

  interface GlobeGLProps {
    globeImageUrl?: string;
    bumpImageUrl?: string;
    backgroundImageUrl?: string;
    pointsData?: Array<{
      lat: number;
      lng: number;
      size?: number;
      color?: string;
    }>;
    pointAltitude?: number;
    pointColor?: string | ((d: any) => string);
    pointRadius?: number | string | ((d: any) => number);
    pointLabel?: (d: any) => string;
    atmosphereColor?: string;
    atmosphereAltitude?: number;
    width?: number;
    height?: number;
  }

  interface GlobeGLInstance {
    controls: () => {
      autoRotate: boolean;
      autoRotateSpeed: number;
      enableZoom: boolean;
      enablePan: boolean;
      rotateSpeed: number;
      minPolarAngle: number;
      maxPolarAngle: number;
    };
  }

  const GlobeGL: React.ForwardRefExoticComponent<
    GlobeGLProps & React.RefAttributes<GlobeGLInstance>
  >;

  export default GlobeGL;
} 