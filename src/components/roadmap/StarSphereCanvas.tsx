import React, { useEffect, useRef, useState } from 'react';
import type { Milestone, Skill } from '../../types/roadmap';
import { RotateCcw, Play, Pause, Eye } from 'lucide-react';

export interface StarNodeData {
  id: string;
  skill: Skill;
  categoryName: string;
  milestoneTitle: string;
  milestoneId: string;
  x0: number;
  y0: number;
  z0: number;
  // Computed 3D & 2D coordinates
  x: number;
  y: number;
  z: number;
  screenX: number;
  screenY: number;
  scale: number;
  color: string;
  completedCount: number;
  totalCount: number;
  isMastered: boolean;
  isMatchedSearch: boolean;
  isCategoryHighlighted: boolean;
}

interface StarSphereCanvasProps {
  milestones: Milestone[];
  searchQuery: string;
  selectedCategoryName: string;
  isAutoRotate: boolean;
  onToggleAutoRotate: () => void;
  onStarDoubleClick: (data: { skill: Skill; categoryName: string; milestoneTitle: string }) => void;
}

export const StarSphereCanvas: React.FC<StarSphereCanvasProps> = ({
  milestones,
  searchQuery,
  selectedCategoryName,
  isAutoRotate,
  onToggleAutoRotate,
  onStarDoubleClick,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Rotation angles & drag ref
  const rotationRef = useRef({ rotX: 0.2, rotY: 0.5, velX: 0, velY: 0 });
  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastClickTimeRef = useRef<number>(0);
  const clickStartPosRef = useRef({ x: 0, y: 0 });

  // State for hovered star and star list
  const [hoveredStar, setHoveredStar] = useState<StarNodeData | null>(null);
  const [starList, setStarList] = useState<StarNodeData[]>([]);

  // Gather all skills & generate 3D Sphere positions
  useEffect(() => {
    const rawSkills: Array<{
      skill: Skill;
      categoryName: string;
      milestoneTitle: string;
      milestoneId: string;
    }> = [];

    milestones.forEach((ms) => {
      ms.categories.forEach((cat) => {
        cat.skills.forEach((sk) => {
          rawSkills.push({
            skill: sk,
            categoryName: cat.name,
            milestoneTitle: ms.title,
            milestoneId: ms.id,
          });
        });
      });
    });

    const total = rawSkills.length;
    if (total === 0) {
      setStarList([]);
      return;
    }

    const isSearchActive = searchQuery.trim().length > 0;
    const isCategoryFilterActive = selectedCategoryName !== 'all';

    const nodes: StarNodeData[] = rawSkills.map((item, i) => {
      // Global Sphere Fibonacci mapping
      const phi = Math.acos(1 - 2 * (i + 0.5) / total);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;

      const x0 = Math.sin(phi) * Math.cos(theta);
      const y0 = Math.sin(phi) * Math.sin(theta);
      const z0 = Math.cos(phi);

      const completedCount = item.skill.subTopics.filter((st) => st.isCompleted).length;
      const totalCount = item.skill.subTopics.length;
      const isMastered = totalCount > 0 && completedCount === totalCount;

      let color = '#38bdf8'; // Sky cyan default
      if (isMastered) color = '#34d399'; // Emerald completed
      else if (completedCount > 0) color = '#60a5fa'; // Blue in progress
      else color = '#a78bfa'; // Purple pending

      const matchesSearch = isSearchActive &&
        (item.skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
         item.skill.subTopics.some((st) => st.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
         item.categoryName.toLowerCase().includes(searchQuery.toLowerCase()));

      const isCatHighlight = isCategoryFilterActive && item.categoryName === selectedCategoryName;

      return {
        id: item.skill.id,
        skill: item.skill,
        categoryName: item.categoryName,
        milestoneTitle: item.milestoneTitle,
        milestoneId: item.milestoneId,
        x0,
        y0,
        z0,
        x: 0,
        y: 0,
        z: 0,
        screenX: 0,
        screenY: 0,
        scale: 1,
        color,
        completedCount,
        totalCount,
        isMastered,
        isMatchedSearch: matchesSearch,
        isCategoryHighlighted: isCatHighlight,
      };
    });

    setStarList(nodes);
  }, [milestones, searchQuery, selectedCategoryName]);

  // Reset View
  const handleResetView = () => {
    rotationRef.current = { rotX: 0.2, rotY: 0.5, velX: 0, velY: 0 };
  };

  // Main Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;

    const render = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }

      const centerX = width / 2;
      const centerY = height / 2;
      const sphereRadius = Math.min(width, height) * 0.32;
      const focalLength = 500;

      // Update rotation
      if (isDraggingRef.current) {
        // Controlled by drag
      } else {
        if (isAutoRotate) {
          rotationRef.current.rotY += 0.0022;
        }
        rotationRef.current.rotX += rotationRef.current.velX;
        rotationRef.current.rotY += rotationRef.current.velY;
        rotationRef.current.velX *= 0.92;
        rotationRef.current.velY *= 0.92;
      }

      const { rotX, rotY } = rotationRef.current;
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);

      // Solid Pure Black Space Background
      ctx.fillStyle = '#05070f';
      ctx.fillRect(0, 0, width, height);

      const time = Date.now() * 0.002;

      // Calculate 3D transformations for all skill stars on the single 3D sphere
      const transformedStars: StarNodeData[] = starList.map((node) => {
        const x1 = node.x0 * cosY + node.z0 * sinY;
        const y1 = node.y0;
        const z1 = -node.x0 * sinY + node.z0 * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const scale = focalLength / (focalLength - z2 * sphereRadius);
        const screenX = centerX + x2 * sphereRadius * scale;
        const screenY = centerY + y2 * sphereRadius * scale;

        return {
          ...node,
          x: x2,
          y: y2,
          z: z2,
          screenX,
          screenY,
          scale,
        };
      });

      // Sort by depth Z (far to near)
      transformedStars.sort((a, b) => a.z - b.z);

      const isSearchActive = searchQuery.trim().length > 0;
      const isCatFilterActive = selectedCategoryName !== 'all';

      // Draw Constellation Lines between connected stars in the same category
      ctx.lineWidth = 1;
      const categoriesMap = new Map<string, StarNodeData[]>();
      transformedStars.forEach((s) => {
        if (!categoriesMap.has(s.categoryName)) {
          categoriesMap.set(s.categoryName, []);
        }
        categoriesMap.get(s.categoryName)!.push(s);
      });

      categoriesMap.forEach((catStars, catName) => {
        if (catStars.length > 1) {
          const isCatSelected = isCatFilterActive && catName === selectedCategoryName;
          ctx.beginPath();
          for (let i = 0; i < catStars.length - 1; i++) {
            const starA = catStars[i];
            const starB = catStars[i + 1];
            
            let alpha = Math.max(0.04, (starA.z + 1.2) * 0.12) * Math.max(0.04, (starB.z + 1.2) * 0.12);
            if (isCatSelected) {
              // Highlight constellation lines for selected industry category
              alpha = Math.min(0.9, alpha * 4.5);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1.8;
            } else if (isCatFilterActive) {
              alpha *= 0.2;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1;
            }

            ctx.moveTo(starA.screenX, starA.screenY);
            ctx.lineTo(starB.screenX, starB.screenY);
          }
          ctx.stroke();
        }
      });

      // Render Star Nodes
      transformedStars.forEach((star) => {
        const isHovered = hoveredStar?.id === star.id;
        const isMatched = star.isMatchedSearch;
        const isCatHighlighted = star.isCategoryHighlighted;
        const isFocusActive = isSearchActive || isCatFilterActive;
        const isHighlighted = isMatched || isCatHighlighted || isHovered;

        const depthAlpha = Math.min(1, Math.max(0.2, (star.z + 1.3) / 2.3));

        // Dim non-highlighted stars when a search or category filter is active
        let starAlpha = isHovered ? 1 : depthAlpha;
        if (isFocusActive && !isHighlighted) {
          starAlpha *= 0.16; // Softly dim other stars on the sphere
        }

        // Star dot sizes: Highlighted stars glow larger
        let starRadius = (isHovered ? 5.2 : isHighlighted ? 4.2 : 2.2) * Math.max(0.6, star.scale);

        ctx.save();
        ctx.globalAlpha = starAlpha;

        // 1. Draw Star Glow Aura (Radial Gradient)
        const auraRadius = starRadius * (isHovered ? 6.5 : isHighlighted ? 5.0 : 2.5);
        const auraGradient = ctx.createRadialGradient(
          star.screenX,
          star.screenY,
          0.5,
          star.screenX,
          star.screenY,
          auraRadius
        );

        const starColor = isMatched ? '#f59e0b' : isCatHighlighted ? '#38bdf8' : star.color;
        auraGradient.addColorStop(0, starColor);
        auraGradient.addColorStop(0.35, starColor + (isHighlighted ? 'dd' : '40'));
        auraGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(star.screenX, star.screenY, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // 2. Draw Pulsing Halo Ring for Highlighted Star Dots
        if (isHighlighted || star.isMastered) {
          ctx.beginPath();
          const ringRadius = starRadius * (isHovered ? 2.6 : 2.0) + Math.sin(time * 3) * 1.5;
          ctx.arc(star.screenX, star.screenY, Math.max(3, ringRadius), 0, Math.PI * 2);
          ctx.strokeStyle = isMatched ? '#f59e0b' : star.isMastered ? '#34d399' : '#38bdf8';
          ctx.lineWidth = isHovered || isHighlighted ? 1.5 : 0.8;
          ctx.setLineDash(isHovered ? [3, 3] : []);
          ctx.stroke();
        }

        // 3. Draw 4-Point Light Spark Flare when Highlighted
        if (isHovered || isHighlighted) {
          ctx.strokeStyle = isMatched ? '#fde047' : '#ffffff';
          ctx.lineWidth = 1.2;
          const flareLen = starRadius * (isHovered ? 3.8 : 2.6);

          ctx.beginPath();
          ctx.moveTo(star.screenX - flareLen, star.screenY);
          ctx.lineTo(star.screenX + flareLen, star.screenY);
          ctx.moveTo(star.screenX, star.screenY - flareLen);
          ctx.lineTo(star.screenX, star.screenY + flareLen);
          ctx.stroke();
        }

        // 4. Draw Core Star Center (Crisp Dot Point)
        ctx.fillStyle = isHovered || isCatHighlighted ? '#ffffff' : starColor;
        ctx.beginPath();
        ctx.arc(star.screenX, star.screenY, Math.max(1.2, starRadius * 0.75), 0, Math.PI * 2);
        ctx.fill();

        // 5. Draw Floating Skill Name Tag (for Hovered or Category Highlighted Stars)
        if (isHovered || isCatHighlighted || (isMatched && star.z > -0.2)) {
          ctx.font = isHovered || isCatHighlighted ? 'bold 12px Inter, sans-serif' : '10px Inter, sans-serif';
          ctx.fillStyle = isMatched ? '#fde047' : isCatHighlighted ? '#7dd3fc' : '#ffffff';
          ctx.textAlign = 'center';
          ctx.shadowColor = 'rgba(0,0,0,0.9)';
          ctx.shadowBlur = 6;

          const textY = star.screenY - starRadius - 10;
          ctx.fillText(star.skill.name, star.screenX, textY);

          if (isHovered) {
            ctx.font = '10px Inter, sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.fillText(
              `✨ ${star.completedCount}/${star.totalCount} bài tập`,
              star.screenX,
              textY - 14
            );
          }
        }

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [starList, hoveredStar, isAutoRotate, searchQuery, selectedCategoryName]);

  // Mouse Interaction: Hover & Hit Testing
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    if (isDraggingRef.current) {
      const deltaX = mouseX - lastMousePos.current.x;
      const deltaY = mouseY - lastMousePos.current.y;

      rotationRef.current.rotY += deltaX * 0.006;
      rotationRef.current.rotX += deltaY * 0.006;
      rotationRef.current.velY = deltaX * 0.006;
      rotationRef.current.velX = deltaY * 0.006;

      lastMousePos.current = { x: mouseX, y: mouseY };
      return;
    }

    lastMousePos.current = { x: mouseX, y: mouseY };

    // Find nearest star in front for hover highlight
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const sphereRadius = Math.min(width, height) * 0.32;
    const focalLength = 500;

    const { rotX, rotY } = rotationRef.current;
    const cosX = Math.cos(rotX);
    const sinX = Math.sin(rotX);
    const cosY = Math.cos(rotY);
    const sinY = Math.sin(rotY);

    let closestStar: StarNodeData | null = null;
    let minDistance = Infinity;

    starList.forEach((node) => {
      const x1 = node.x0 * cosY + node.z0 * sinY;
      const y1 = node.y0;
      const z1 = -node.x0 * sinY + node.z0 * cosY;

      const x2 = x1;
      const y2 = y1 * cosX - z1 * sinX;
      const z2 = y1 * sinX + z1 * cosX;

      const scale = focalLength / (focalLength - z2 * sphereRadius);
      const screenX = centerX + x2 * sphereRadius * scale;
      const screenY = centerY + y2 * sphereRadius * scale;

      const dist = Math.hypot(screenX - mouseX, screenY - mouseY);
      const hitThreshold = Math.max(20, 26 * scale);

      if (dist < hitThreshold && z2 > -0.6) {
        const adjustedDist = dist - z2 * 20;
        if (adjustedDist < minDistance) {
          minDistance = adjustedDist;
          closestStar = { ...node, screenX, screenY, scale, x: x2, y: y2, z: z2 };
        }
      }
    });

    setHoveredStar(closestStar);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      lastMousePos.current = { x, y };
      clickStartPosRef.current = { x, y };
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const distMoved = Math.hypot(clickX - clickStartPosRef.current.x, clickY - clickStartPosRef.current.y);
    if (distMoved > 6) return;

    const now = Date.now();
    const timeDiff = now - lastClickTimeRef.current;
    lastClickTimeRef.current = now;

    if (timeDiff < 300 && hoveredStar) {
      onStarDoubleClick({
        skill: hoveredStar.skill,
        categoryName: hoveredStar.categoryName,
        milestoneTitle: hoveredStar.milestoneTitle,
      });
    }
  };

  const handleCanvasDoubleClick = () => {
    if (hoveredStar) {
      onStarDoubleClick({
        skill: hoveredStar.skill,
        categoryName: hoveredStar.categoryName,
        milestoneTitle: hoveredStar.milestoneTitle,
      });
    }
  };

  return (
    <div className="star-sphere-container" ref={containerRef}>
      {/* 3D Canvas Viewport */}
      <canvas
        ref={canvasRef}
        className={`star-canvas ${hoveredStar ? 'cursor-pointer' : 'cursor-grab'}`}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleCanvasClick}
        onDoubleClick={handleCanvasDoubleClick}
      />

      {/* Minimal Floating HUD Controls */}
      <div className="sphere-hud-controls">
        <button
          className="hud-btn"
          onClick={handleResetView}
          title="Đặt lại góc nhìn 3D"
        >
          <RotateCcw size={15} />
          <span>Đặt lại góc nhìn</span>
        </button>

        <button
          className={`hud-btn ${isAutoRotate ? 'active' : ''}`}
          onClick={onToggleAutoRotate}
          title={isAutoRotate ? 'Tạm dừng xoay tự động' : 'Bật xoay tự động 3D'}
        >
          {isAutoRotate ? <Pause size={15} /> : <Play size={15} />}
          <span>{isAutoRotate ? 'Đang xoay' : 'Tạm dừng'}</span>
        </button>
      </div>

      {/* Hover Tooltip Overlay Card */}
      {hoveredStar && (
        <div className="star-hover-card-overlay glass-panel">
          <div className="star-hover-card-header">
            <span className="star-hover-icon">✨</span>
            <div>
              <h4 className="star-hover-title">{hoveredStar.skill.name}</h4>
              <p className="star-hover-sub">{hoveredStar.milestoneTitle} • {hoveredStar.categoryName}</p>
            </div>
          </div>
          <div className="star-hover-card-body">
            <div className="star-hover-stat">
              <span>Đã làm: <strong>{hoveredStar.completedCount}/{hoveredStar.totalCount} bài</strong></span>
              <span className="star-hover-pct">{hoveredStar.skill.levelPercentage}% Thành Thạo</span>
            </div>
            <button
              className="star-hover-action-btn"
              onClick={() => onStarDoubleClick({
                skill: hoveredStar.skill,
                categoryName: hoveredStar.categoryName,
                milestoneTitle: hoveredStar.milestoneTitle,
              })}
            >
              <Eye size={15} />
              <span>Đúp chuột để xem bài tập</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
