import React from 'react';
import Svg, { Circle, Line, Text, G, Path, Rect, Polygon } from 'react-native-svg';

export const CompassDial = ({ size }) => {
  const center = size / 2;
  const radius = center * 0.90;
  const tickOuter = radius;
  const tickMid = radius * 0.93;
  const tickInner = radius * 0.88;
  
  // N, E, S, W configurations
  const letters = [
    { label: 'N', angle: 0 },
    { label: 'E', angle: 90 },
    { label: 'S', angle: 180 },
    { label: 'W', angle: 270 },
  ];

  const ticks = [];
  for (let i = 0; i < 360; i += 2) {
    if (i % 90 === 0) continue; // skip where main letters are

    const isMajor = i % 10 === 0;
    const isMedium = i % 30 === 0;
    
    ticks.push(
      <G key={i} rotation={i} origin={`${center}, ${center}`}>
        <Line 
          x1={center} y1={center - tickOuter} 
          x2={center} y2={center - (isMajor ? tickInner : tickMid)} 
          stroke={isMedium ? "#FFD700" : "#769C89"} 
          strokeWidth={isMajor ? 2 : 1} 
          opacity={isMajor ? 1 : 0.6}
        />
      </G>
    );
  }

  return (
    <Svg width={size} height={size}>
      {/* Outer elegant rings */}
      <Circle cx={center} cy={center} r={radius} stroke="#FFD700" strokeWidth="2" fill="none" opacity="0.9" />
      <Circle cx={center} cy={center} r={radius + 6} stroke="#FFD700" strokeWidth="0.5" fill="none" opacity="0.4" />
      <Circle cx={center} cy={center} r={radius * 0.75} stroke="#FFD700" strokeWidth="1" fill="none" opacity="0.3" strokeDasharray="4,6" />
      
      {/* Degree Ticks */}
      {ticks}
      
      {/* Letters with distinct circle background on edges */}
      {letters.map((item, index) => (
        <G key={index} rotation={item.angle} origin={`${center}, ${center}`}>
          {/* Inner circle for letter */}
          <Circle cx={center} cy={center - radius} r={center * 0.16} fill="#051811" stroke="#FFD700" strokeWidth="2" />
          {/* Outer ring accent */}
          <Circle cx={center} cy={center - radius} r={center * 0.19} fill="none" stroke="#A9DFBF" strokeWidth="0.5" opacity="0.5" />
          
          <Text 
            x={center} 
            y={center - radius + (center * 0.05)} 
            fill={item.label === 'N' ? '#FF6B6B' : '#FFD700'} 
            fontSize={center * 0.14} 
            fontWeight="bold" 
            textAnchor="middle"
          >
            {item.label}
          </Text>
        </G>
      ))}

      {/* Decorative center geometric star */}
      <G opacity="0.4">
        <Path d={`M ${center} ${center - radius * 0.45} L ${center + radius * 0.12} ${center - radius * 0.12} L ${center + radius * 0.45} ${center} L ${center + radius * 0.12} ${center + radius * 0.12} L ${center} ${center + radius * 0.45} L ${center - radius * 0.12} ${center + radius * 0.12} L ${center - radius * 0.45} ${center} L ${center - radius * 0.12} ${center - radius * 0.12} Z`} fill="none" stroke="#FFD700" strokeWidth="1.5" />
        <Circle cx={center} cy={center} r={radius * 0.25} stroke="#A9DFBF" strokeWidth="1" fill="none" strokeDasharray="2,4" />
      </G>
    </Svg>
  );
};

export const KaabaIndicator = ({ size }) => {
  const center = size / 2;
  const kaabaWidth = 48;
  const kaabaHeight = 52;
  
  // Coordinates for 3D Kaaba relative to center
  const kx = center - (kaabaWidth / 2);
  const ky = center + 10; 
  
  const roofHeight = 12;
  const sideWidth = 14;

  return (
    <Svg width={size} height={size}>
      {/* Graceful Arrow pointing up to Qibla */}
      {/* Outer glow ring around arrow */}
      <Circle cx={center} cy={center * 0.35} r={32} fill="radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)" />
      
      {/* Arrow Head */}
      <Path 
        d={`M ${center} ${center * 0.05} L ${center + 16} ${center * 0.3} L ${center + 5} ${center * 0.3} L ${center + 5} ${ky - 5} L ${center - 5} ${ky - 5} L ${center - 5} ${center * 0.3} L ${center - 16} ${center * 0.3} Z`}
        fill="#FFD700"
      />
      <Path 
        d={`M ${center} ${center * 0.05} L ${center + 16} ${center * 0.3} L ${center + 5} ${center * 0.3} L ${center + 5} ${ky - 5} L ${center - 5} ${ky - 5} L ${center - 5} ${center * 0.3} L ${center - 16} ${center * 0.3} Z`}
        fill="none" stroke="#FFF" strokeWidth="1" opacity="0.4"
      />

      {/* Vector 3D Kaaba Drawing */}
      <G>
        {/* Front Wall */}
        <Rect x={kx} y={ky} width={kaabaWidth} height={kaabaHeight} fill="#0d0d0d" />
        
        {/* Gold Band (Kiswah details) */}
        <Rect x={kx} y={ky + 12} width={kaabaWidth} height={5} fill="#D4AF37" />
        <Rect x={kx} y={ky + 18} width={kaabaWidth} height={1.5} fill="#0d0d0d" />
        
        {/* Door details */}
        <Rect x={kx + kaabaWidth/2 + 2} y={ky + 30} width={12} height={22} fill="#D4AF37" />
        <Rect x={kx + kaabaWidth/2 + 3} y={ky + 32} width={10} height={20} fill="#1a1a1a" />

        {/* Top Roof (Perspective) */}
        <Polygon points={`${kx},${ky} ${kx + sideWidth},${ky - roofHeight} ${kx + kaabaWidth + sideWidth},${ky - roofHeight} ${kx + kaabaWidth},${ky}`} fill="#262626" />
        
        {/* Right Side Wall (Perspective) */}
        <Polygon points={`${kx + kaabaWidth},${ky} ${kx + kaabaWidth + sideWidth},${ky - roofHeight} ${kx + kaabaWidth + sideWidth},${ky + kaabaHeight - roofHeight} ${kx + kaabaWidth},${ky + kaabaHeight}`} fill="#1a1a1a" />
        
        {/* Side Wall Gold Band */}
        <Polygon points={`${kx + kaabaWidth},${ky + 12} ${kx + kaabaWidth + sideWidth},${ky - roofHeight + 12} ${kx + kaabaWidth + sideWidth},${ky - roofHeight + 17} ${kx + kaabaWidth},${ky + 17}`} fill="#B8960C" />
      </G>
    </Svg>
  );
};
