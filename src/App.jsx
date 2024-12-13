import React, { useState, useRef } from "react";
import "./App.css";

function App() {
  const [tool, setTool] = useState("pen");
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [paths, setPaths] = useState([]); 
  const [currentPath, setCurrentPath] = useState([]); 

  const handleMouseDown = (e) => {
    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === "pen") {
      setCurrentPath([{ x, y }]);
      setIsDrawing(true);
    } else if (tool === "eraser") {
      setIsDrawing(true);
      eraseLine(x, y);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDrawing) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    if (tool === "pen") {
      setCurrentPath((prevPath) => [...prevPath, { x, y }]);
      redrawCanvas([...paths, [...currentPath, { x, y }]]);
    } else if (tool === "eraser") {
      eraseLine(x, y);
    }
  };

  const handleMouseUp = () => {
    if (tool === "pen" && isDrawing) {
      setPaths((prevPaths) => [...prevPaths, currentPath]);
      setCurrentPath([]);
    }
    setIsDrawing(false); 
  };

  const eraseLine = (x, y) => {
    const updatedPaths = paths.filter((path) => {
  
      const isOverlapping = path.some((point) => {
        const dx = point.x - x;
        const dy = point.y - y;
        return Math.sqrt(dx * dx + dy * dy) < 10; 
      });
      return !isOverlapping; 
    });

    setPaths(updatedPaths);
    redrawCanvas(updatedPaths);
  };

  const redrawCanvas = (pathsToDraw) => {
    if (!canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    pathsToDraw.forEach((path) => {
      if (path.length > 0) {
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);

        path.forEach((point) => {
          ctx.lineTo(point.x, point.y);
        });

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.stroke();
        ctx.closePath();
      }
    });
  };

  const handleToolChange = (selectedTool) => {
    setTool(selectedTool);
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="mb-4">
        <button
          onClick={() => handleToolChange("pen")}
          className={`px-4 py-2 rounded-l-md ${
            tool === "pen" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          🖊️ Pen
        </button>
        <button
          onClick={() => handleToolChange("eraser")}
          className={`px-4 py-2 rounded-r-md ${
            tool === "eraser" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          🧹 Eraser
        </button>
      </div>

      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border border-gray-300"
        width={800}
        height={600}
      ></canvas>
    </div>
  );
}

export default App;
