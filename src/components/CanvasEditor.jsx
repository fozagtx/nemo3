import React, { useRef, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from 'react-konva';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 900;

const sampleImageUrl = 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80';

const CanvasEditor = () => {
  const [elements, setElements] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const stageRef = useRef();

  // Add a sample image
  const handleAddImage = () => {
    setElements((els) => [
      ...els,
      {
        id: `img-${Date.now()}`,
        type: 'image',
        x: 100,
        y: 100,
        src: sampleImageUrl,
        width: 200,
        height: 300,
      },
    ]);
  };

  // Add a sample text
  const handleAddText = () => {
    setElements((els) => [
      ...els,
      {
        id: `txt-${Date.now()}`,
        type: 'text',
        x: 200,
        y: 400,
        text: 'Your viral hook here!',
        fontSize: 36,
        fill: 'white',
        draggable: true,
      },
    ]);
  };

  // Drag logic
  const handleDragMove = (id, e) => {
    const { x, y } = e.target.position();
    setElements((els) =>
      els.map((el) => (el.id === id ? { ...el, x, y } : el))
    );
  };

  // Render images and text
  return (
    <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-950 relative">
      <div className="mb-4 flex gap-2">
        <button onClick={handleAddImage} className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition">Add Image</button>
        <button onClick={handleAddText} className="bg-yellow-400 text-black px-4 py-2 rounded font-bold hover:bg-yellow-500 transition">Add Text</button>
      </div>
      <Stage
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        ref={stageRef}
        className="bg-zinc-900 rounded-lg shadow-lg"
        style={{ border: '2px solid #27272a' }}
      >
        <Layer>
          {elements.map((el) => {
            if (el.type === 'image') {
              return (
                <URLImage
                  key={el.id}
                  imageProps={el}
                  isSelected={selectedId === el.id}
                  onSelect={() => setSelectedId(el.id)}
                  onDragMove={(e) => handleDragMove(el.id, e)}
                />
              );
            }
            if (el.type === 'text') {
              return (
                <KonvaText
                  key={el.id}
                  x={el.x}
                  y={el.y}
                  text={el.text}
                  fontSize={el.fontSize}
                  fill={el.fill}
                  draggable
                  onClick={() => setSelectedId(el.id)}
                  onTap={() => setSelectedId(el.id)}
                  onDragMove={(e) => handleDragMove(el.id, e)}
                />
              );
            }
            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
};

// Helper component to load images from URL
const URLImage = ({ imageProps, isSelected, onSelect, onDragMove }) => {
  const [img, setImg] = useState(null);
  React.useEffect(() => {
    const image = new window.Image();
    image.crossOrigin = 'Anonymous';
    image.src = imageProps.src;
    image.onload = () => setImg(image);
  }, [imageProps.src]);
  return (
    <KonvaImage
      image={img}
      x={imageProps.x}
      y={imageProps.y}
      width={imageProps.width}
      height={imageProps.height}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragMove={onDragMove}
      stroke={isSelected ? 'yellow' : undefined}
      strokeWidth={isSelected ? 4 : 0}
    />
  );
};

export default CanvasEditor;
