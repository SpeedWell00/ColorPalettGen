import React from 'react';

export default function ColorStrip({ colors }) {
  return (
    <div className="color-strip">
      {colors.map((color, index) => (
        <div className="color-cell" key={`${color}-${index}`}>
          <div className="swatch" style={{ backgroundColor: color }} />
          <span>{color}</span>
        </div>
      ))}
    </div>
  );
}
