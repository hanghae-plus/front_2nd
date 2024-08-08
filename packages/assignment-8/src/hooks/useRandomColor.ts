import { useState, useEffect } from 'react';

const generateRandomColor = () => {
  // RGB 값을 생성
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // RGBA 문자열 반환 (알파값 0.1 적용)
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

export const useRandomColors = (repeatIds: (string | null)[]) => {
  const [colorMap, setColorMap] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newColorMap: { [key: string]: string } = {};
    repeatIds.forEach((id) => {
      if (id == null) return;
      if (!colorMap[id]) {
        newColorMap[id] = generateRandomColor();
      } else {
        newColorMap[id] = colorMap[id];
      }
    });
    setColorMap(newColorMap);
  }, [repeatIds]);

  return colorMap;
};
