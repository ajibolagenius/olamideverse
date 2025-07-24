'use client';

import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Circle, Rect, Text, Group } from 'react-konva';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  InformationCircleIcon, 
  PlayIcon, 
  PhotoIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

interface Hotspot {
  id: string;
  x: number;
  y: number;
  type: 'info' | 'audio' | 'image' | 'video';
  title: string;
  content: string;
  mediaUrl?: string;
  audioUrl?: string;
}

interface InteractiveHotspotProps {
  backgroundImage: string;
  hotspots: Hotspot[];
  width?: number;
  height?: number;
  className?: string;
}

export default function InteractiveHotspot({
  backgroundImage,
  hotspots,
  width = 800,
  height = 600,
  className = ''
}: InteractiveHotspotProps) {
  const stageRef = useRef<any>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [stageSize, setStageSize] = useState({ width, height });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hoveredHotspot, setHoveredHotspot] = useState<string | null>(null);

  useEffect(() => {
    const updateSize = () => {
      const container = stageRef.current?.container();
      if (container) {
        const containerWidth = container.offsetWidth;
        const aspectRatio = height / width;
        const newHeight = containerWidth * aspectRatio;
        setStageSize({ width: containerWidth, height: newHeight });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [width, height]);

  const getHotspotColor = (type: string) => {
    switch (type) {
      case 'info': return '#3B82F6';
      case 'audio': return '#10B981';
      case 'image': return '#F59E0B';
      case 'video': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getHotspotIcon = (type: string) => {
    switch (type) {
      case 'info': return InformationCircleIcon;
      case 'audio': return PlayIcon;
      case 'image': return PhotoIcon;
      case 'video': return PlayIcon;
      default: return InformationCircleIcon;
    }
  };

  const scaleX = stageSize.width / width;
  const scaleY = stageSize.height / height;

  return (
    <div className={`relative ${className}`}>
      {/* Konva Stage */}
      <div className="relative overflow-hidden rounded-lg">
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          className="cursor-pointer"
        >
          <Layer>
            {/* Background Image */}
            {imageLoaded && (
              <Rect
                width={stageSize.width}
                height={stageSize.height}
                fillPatternImage={imageLoaded ? undefined : undefined}
                fill="#f3f4f6"
              />
            )}

            {/* Hotspots */}
            {hotspots.map((hotspot) => (
              <Group key={hotspot.id}>
                {/* Hotspot Circle */}
                <Circle
                  x={hotspot.x * scaleX}
                  y={hotspot.y * scaleY}
                  radius={hoveredHotspot === hotspot.id ? 20 : 15}
                  fill={getHotspotColor(hotspot.type)}
                  opacity={hoveredHotspot === hotspot.id ? 0.9 : 0.8}
                  stroke="white"
                  strokeWidth={3}
                  shadowColor="black"
                  shadowBlur={10}
                  shadowOpacity={0.3}
                  onClick={() => setSelectedHotspot(hotspot)}
                  onTap={() => setSelectedHotspot(hotspot)}
                  onMouseEnter={() => setHoveredHotspot(hotspot.id)}
                  onMouseLeave={() => setHoveredHotspot(null)}
                />

                {/* Pulse Animation */}
                <Circle
                  x={hotspot.x * scaleX}
                  y={hotspot.y * scaleY}
                  radius={25}
                  fill={getHotspotColor(hotspot.type)}
                  opacity={0.3}
                  scaleX={hoveredHotspot === hotspot.id ? 1.2 : 1}
                  scaleY={hoveredHotspot === hotspot.id ? 1.2 : 1}
                />

                {/* Hotspot Label */}
                {hoveredHotspot === hotspot.id && (
                  <Group>
                    <Rect
                      x={hotspot.x * scaleX - 50}
                      y={hotspot.y * scaleY - 40}
                      width={100}
                      height={25}
                      fill="rgba(0,0,0,0.8)"
                      cornerRadius={4}
                    />
                    <Text
                      x={hotspot.x * scaleX - 45}
                      y={hotspot.y * scaleY - 35}
                      text={hotspot.title}
                      fontSize={12}
                      fill="white"
                      width={90}
                      align="center"
                    />
                  </Group>
                )}
              </Group>
            ))}
          </Layer>
        </Stage>

        {/* Background Image (HTML) */}
        <img
          src={backgroundImage}
          alt="Interactive background"
          className="absolute inset-0 w-full h-full object-cover -z-10"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Loading state */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
            <div className="text-gray-500">Loading interactive content...</div>
          </div>
        )}
      </div>

      {/* Hotspot Details Modal */}
      <AnimatePresence>
        {selectedHotspot && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={() => setSelectedHotspot(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white dark:bg-secondary-800 rounded-lg shadow-xl max-w-md w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: getHotspotColor(selectedHotspot.type) }}
                  >
                    {(() => {
                      const Icon = getHotspotIcon(selectedHotspot.type);
                      return <Icon className="w-4 h-4 text-white" />;
                    })()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedHotspot.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {selectedHotspot.content}
                </p>

                {/* Media Content */}
                {selectedHotspot.mediaUrl && (
                  <div className="mb-4">
                    {selectedHotspot.type === 'image' && (
                      <img
                        src={selectedHotspot.mediaUrl}
                        alt={selectedHotspot.title}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                    {selectedHotspot.type === 'video' && (
                      <video
                        src={selectedHotspot.mediaUrl}
                        controls
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    )}
                  </div>
                )}

                {/* Audio Content */}
                {selectedHotspot.audioUrl && (
                  <div className="mb-4">
                    <audio
                      src={selectedHotspot.audioUrl}
                      controls
                      className="w-full"
                    />
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => setSelectedHotspot(null)}
                  className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Instructions */}
      <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
        Click on the interactive hotspots to explore additional content
      </div>
    </div>
  );
}
