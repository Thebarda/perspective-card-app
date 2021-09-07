import * as React from 'react';
import { isNil } from 'ramda';
import hugoImage from './hugo.png';

const defaultScale = 1;
const hoverScale = defaultScale * 2;

interface RotationCoords {
  rotateX: number,
  rotateY: number,
  rotateZ: number,
  degree: number,
  brightness: number
}

const defaultRotationCoords = {
  rotateX: 0, rotateY: 0, rotateZ: 0, degree: 0, brightness: 1,
};
const App = (): JSX.Element => {
  const [isMouseHover, setIsMouseHover] = React.useState(false);
  const [rotationCoords, setRotationCoords] = React.useState<RotationCoords>(defaultRotationCoords);
  const imgRef = React.useRef<HTMLImageElement | null>(null);

  const mouseEnter = () => setIsMouseHover(true);

  const mouseLeave = () => {
    setIsMouseHover(false);
    setRotationCoords(defaultRotationCoords);
  };

  const getBoundingRect = (event: React.MouseEvent) => {
    const rect = imgRef?.current?.getBoundingClientRect() || null;

    if (isNil(rect)) {
      return null;
    }

    const x = event.pageX - rect.left;
    const y = event.pageY - rect.top;

    return {
      x,
      y,
      width: rect?.width,
      height: rect?.height,
    };
  };

  const getElementPositionCenter = (axis: number) => axis / 2;

  const mouseMove = (event: React.MouseEvent): void => {
    const bounding = getBoundingRect(event);

    if (isNil(bounding)) {
      return;
    }

    const elementXCenter = getElementPositionCenter(bounding.width);
    const elementYCenter = getElementPositionCenter(bounding.height);

    const maxHypothenuse = Math.hypot(elementXCenter, elementYCenter);
    const cursorHypothenuse = Math.hypot(
      bounding?.x - elementXCenter, bounding?.y - elementYCenter,
    );

    const ratio = cursorHypothenuse / maxHypothenuse;

    setRotationCoords({
      rotateX: (elementYCenter - bounding.y) / cursorHypothenuse,
      rotateY: -(elementXCenter - bounding.x) / cursorHypothenuse,
      rotateZ: 0,
      degree: 50 * ratio,
      brightness: 1.5 - (bounding.y / bounding.height) - (bounding.x / bounding.width / 2),
    });
  };

  const scale = isMouseHover ? hoverScale : defaultScale;

  const imageStyle = {
    transform: `scale(${scale}, ${scale}) perspective(1900px) rotate3d(${rotationCoords.rotateX}, ${rotationCoords.rotateY}, ${rotationCoords.rotateZ}, ${rotationCoords.degree}deg)`,
    transition: `transform ${isMouseHover ? '0.1' : '0.3'}s ease-out`,
    filter: `brightness(${rotationCoords.brightness}) drop-shadow(4px 4px 10px black)`,
    transformStyle: isMouseHover ? 'preserve-3d' : undefined,
    perspectiveOrigin: isMouseHover ? '50% 50%' : undefined,
    transformOrigin: isMouseHover ? '50% 50%' : undefined,
  } as React.CSSProperties;

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 220px)',
      columnGap: '24px',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#bcbcbc',
    }}
    >
      <img src={hugoImage} alt="Logo steam" />
      <img ref={imgRef} src={hugoImage} alt="Logo steam" style={imageStyle} onMouseEnter={mouseEnter} onMouseLeave={mouseLeave} onMouseMove={mouseMove} />
      <img src={hugoImage} alt="Logo steam" />
    </div>
  );
};

export default App;
