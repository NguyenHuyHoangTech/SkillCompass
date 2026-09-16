import React, { useEffect, useRef, useState } from 'react';
import type { Milestone, Skill } from '../../types/roadmap';
import { RotateCcw, Play, Pause, Eye, ZoomIn, ZoomOut } from 'lucide-react';

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
  const zoomScaleRef = useRef<number>(1.0);
  const [zoomPercent, setZoomPercent] = useState<number>(100);

  const isDraggingRef = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const lastClickTimeRef = useRef<number>(0);
  const clickStartPosRef = useRef({ x: 0, y: 0 });

  // State for hovered star and star list
  const [hoveredStar, setHoveredStar] = useState<StarNodeData | null>(null);
  const [starList, setStarList] = useState<StarNodeData[]>([]);

  // 3D Nebula Procedural Clouds & Background Stardust Particles
  const backgroundStarsRef = useRef<Array<{ x0: number; y0: number; z0: number; size: number; alpha: number; pulseSpeed: number }>>([]);
  const nebulaCloudsRef = useRef<Array<{ x0: number; y0: number; z0: number; radius: number; colorHex: string; baseAlpha: number }>>([]);

  // Generate Procedural Nebula Dust & Background Stars on Mount
  useEffect(() => {
    if (backgroundStarsRef.current.length === 0) {
      const bgStars = [];
      for (let i = 0; i < 240; i++) {
        const u = Math.random();
        const theta = u * 2.0 * Math.PI;
        const r = (0.3 + Math.random() * 0.95);

        // Elliptical Galaxy Disk Mapping (Major Axis a=1.45, Minor Axis b=0.75, Height=0.35)
        bgStars.push({
          x0: r * Math.cos(theta) * 1.45,
          y0: (Math.random() - 0.5) * 0.35,
          z0: r * Math.sin(theta) * 0.75,
          size: Math.random() * 1.5 + 0.3,
          alpha: Math.random() * 0.6 + 0.3,
          pulseSpeed: Math.random() * 2 + 1,
        });
      }
      backgroundStarsRef.current = bgStars;
    }

    if (nebulaCloudsRef.current.length === 0) {
      const palette = [
        '#1d4ed8', // Deep Royal Blue
        '#1e40af', // Dark Sapphire Blue
        '#2563eb', // Ocean Blue
        '#0369a1', // Deep Sky Blue
        '#1e3a8a', // Midnight Navy Blue
        '#3b82f6', // Rich Cobalt Blue
      ];
      const clouds = [];
      for (let i = 0; i < 48; i++) {
        const theta = Math.random() * Math.PI * 2;
        const r = Math.random() * 0.92;

        // Elliptical Gas Cloud Halo
        clouds.push({
          x0: r * Math.cos(theta) * 1.4,
          y0: (Math.random() - 0.5) * 0.32,
          z0: r * Math.sin(theta) * 0.72,
          radius: Math.random() * 160 + 90,
          colorHex: palette[i % palette.length],
          baseAlpha: Math.random() * 0.18 + 0.1,
        });
      }
      nebulaCloudsRef.current = clouds;
    }
  }, []);

  const handleZoomIn = () => {
    const next = Math.min(3.5, zoomScaleRef.current + 0.25);
    zoomScaleRef.current = next;
    setZoomPercent(Math.round(next * 100));
  };

  const handleZoomOut = () => {
    const next = Math.max(0.35, zoomScaleRef.current - 0.25);
    zoomScaleRef.current = next;
    setZoomPercent(Math.round(next * 100));
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY < 0 ? 0.12 : -0.12;
    const next = Math.min(3.5, Math.max(0.35, zoomScaleRef.current + delta));
    zoomScaleRef.current = next;
    setZoomPercent(Math.round(next * 100));
  };

  // Gather all skills & generate 3D Elliptical Galaxy positions
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
      // 3D Elliptical Spiral Galaxy Distribution
      const norm = (i + 0.5) / total;
      const radius = Math.pow(norm, 0.65) * 1.15 + 0.1;
      const angle = i * 2.4; // Golden spiral angle

      // Elliptical Major Axis (a=1.4), Minor Axis (b=0.68), Height Thickness (c=0.25)
      const x0 = radius * Math.cos(angle) * 1.4;
      const y0 = Math.sin(i * 3.7) * 0.25 * (1.1 - norm * 0.4);
      const z0 = radius * Math.sin(angle) * 0.68;

      const completedCount = item.skill.subTopics.filter((st) => st.isCompleted).length;
      const totalCount = item.skill.subTopics.length;
      const isMastered = totalCount > 0 && completedCount === totalCount;

      let color = '#3b82f6'; // Deep cobalt blue default
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
    zoomScaleRef.current = 1.0;
    setZoomPercent(100);
  };

  // Main Render Loop (Nebula Engine 3D)
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
      const sphereRadius = Math.min(width, height) * 0.32 * zoomScaleRef.current;
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

      const time = Date.now() * 0.0015;

      // 1. Solid Deep Cosmic Void Space Background (Dark Navy Void)
      ctx.fillStyle = '#010614';
      ctx.fillRect(0, 0, width, height);

      // 2. Swirling Ambient Cosmic Center Glow (Rich Dark Royal Blue & Deep Sapphire)
      const ambientGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        Math.max(width, height) * 0.65
      );
      ambientGrad.addColorStop(0, 'rgba(29, 78, 216, 0.35)'); // Deep Royal Blue Center
      ambientGrad.addColorStop(0.35, 'rgba(30, 64, 175, 0.25)'); // Deep Sapphire Blue
      ambientGrad.addColorStop(0.7, 'rgba(15, 23, 42, 0.18)'); // Midnight Blue Outer
      ambientGrad.addColorStop(1, 'rgba(1, 6, 20, 0)');
      ctx.fillStyle = ambientGrad;
      ctx.fillRect(0, 0, width, height);

      // 3. Render 3D Swirling Cosmic Nebula Gas Clouds
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      nebulaCloudsRef.current.forEach((cloud, idx) => {
        const x1 = cloud.x0 * cosY + cloud.z0 * sinY;
        const y1 = cloud.y0;
        const z1 = -cloud.x0 * sinY + cloud.z0 * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const scale = focalLength / (focalLength - z2 * sphereRadius);
        const screenX = centerX + x2 * sphereRadius * scale;
        const screenY = centerY + y2 * sphereRadius * scale;

        const pulseRad = cloud.radius * scale * (1 + Math.sin(time * 0.7 + idx) * 0.1);
        const opacity = cloud.baseAlpha * Math.min(1.2, Math.max(0.1, (z2 + 1.2) / 2));

        const cloudGrad = ctx.createRadialGradient(
          screenX,
          screenY,
          0,
          screenX,
          screenY,
          Math.max(1, pulseRad)
        );

        // Convert Hex to RGBA
        const hex = cloud.colorHex;
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        cloudGrad.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`);
        cloudGrad.addColorStop(0.45, `rgba(${r}, ${g}, ${b}, ${opacity * 0.45})`);
        cloudGrad.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.fillStyle = cloudGrad;
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(1, pulseRad), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 4. Render Distant 3D Background Stardust Grid (Blue/Cyan Stars)
      ctx.save();
      backgroundStarsRef.current.forEach((bgStar, idx) => {
        const x1 = bgStar.x0 * cosY + bgStar.z0 * sinY;
        const y1 = bgStar.y0;
        const z1 = -bgStar.x0 * sinY + bgStar.z0 * cosY;

        const x2 = x1;
        const y2 = y1 * cosX - z1 * sinX;
        const z2 = y1 * sinX + z1 * cosX;

        const scale = focalLength / (focalLength - z2 * sphereRadius * 1.25);
        const screenX = centerX + x2 * sphereRadius * 1.25 * scale;
        const screenY = centerY + y2 * sphereRadius * 1.25 * scale;

        const twinkle = (Math.sin(time * bgStar.pulseSpeed + idx) + 1) * 0.5;
        const alpha = bgStar.alpha * (0.3 + twinkle * 0.7) * Math.max(0.1, (z2 + 1.4) / 2.4);

        ctx.fillStyle = idx % 5 === 0 ? '#38bdf8' : idx % 7 === 0 ? '#60a5fa' : '#ffffff';
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(screenX, screenY, Math.max(0.5, bgStar.size * scale), 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      // 4.5. Render 3D Glowing Elliptical Orbit Rings
      ctx.save();
      ctx.lineWidth = 1.2;
      const orbitSteps = 64;
      [0.55, 0.95, 1.35].forEach((rFactor) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.18 - rFactor * 0.04})`;
        ctx.setLineDash([4, 6]);
        for (let i = 0; i <= orbitSteps; i++) {
          const angle = (i / orbitSteps) * Math.PI * 2;
          const ox = Math.cos(angle) * 1.4 * rFactor;
          const oy = 0;
          const oz = Math.sin(angle) * 0.68 * rFactor;

          const x1 = ox * cosY + oz * sinY;
          const y1 = oy;
          const z1 = -ox * sinY + oz * cosY;

          const x2 = x1;
          const y2 = y1 * cosX - z1 * sinX;
          const z2 = y1 * sinX + z1 * cosX;

          const scale = focalLength / (focalLength - z2 * sphereRadius);
          const sx = centerX + x2 * sphereRadius * scale;
          const sy = centerY + y2 * sphereRadius * scale;

          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      });
      ctx.restore();

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

      // 5. Draw Constellation Lines between connected stars in the same category
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
            
            let alpha = Math.max(0.06, (starA.z + 1.2) * 0.14) * Math.max(0.06, (starB.z + 1.2) * 0.14);
            if (isCatSelected) {
              // Highlight constellation lines for selected industry category
              alpha = Math.min(0.95, alpha * 4.5);
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 2.0;
            } else if (isCatFilterActive) {
              alpha *= 0.2;
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 0.8;
            } else {
              ctx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
              ctx.lineWidth = 1.1;
            }

            ctx.moveTo(starA.screenX, starA.screenY);
            ctx.lineTo(starB.screenX, starB.screenY);
          }
          ctx.stroke();
        }
      });

      // 6. Render Skill Star Nodes & Radiant Glowing Auras
      transformedStars.forEach((star) => {
        const isHovered = hoveredStar?.id === star.id;
        const isMatched = star.isMatchedSearch;
        const isCatHighlighted = star.isCategoryHighlighted;
        const isFocusActive = isSearchActive || isCatFilterActive;
        const isHighlighted = isMatched || isCatHighlighted || isHovered;

        const depthAlpha = Math.min(1, Math.max(0.25, (star.z + 1.3) / 2.3));

        // Dim non-highlighted stars when a search or category filter is active
        let starAlpha = isHovered ? 1 : depthAlpha;
        if (isFocusActive && !isHighlighted) {
          starAlpha *= 0.16; // Softly dim other stars on the sphere
        }

        // Star dot sizes: Highlighted stars glow larger
        let starRadius = (isHovered ? 5.5 : isHighlighted ? 4.5 : 2.5) * Math.max(0.6, star.scale);

        ctx.save();
        ctx.globalAlpha = starAlpha;

        // Draw Star Glow Aura (Radial Gradient)
        const auraRadius = starRadius * (isHovered ? 7.0 : isHighlighted ? 5.5 : 3.0);
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
        auraGradient.addColorStop(0.35, starColor + (isHighlighted ? 'dd' : '55'));
        auraGradient.addColorStop(1, 'transparent');

        ctx.fillStyle = auraGradient;
        ctx.beginPath();
        ctx.arc(star.screenX, star.screenY, auraRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw Pulsing Halo Ring for Highlighted Star Dots
        if (isHighlighted || star.isMastered) {
          ctx.beginPath();
          const ringRadius = starRadius * (isHovered ? 2.6 : 2.0) + Math.sin(time * 3) * 1.5;
          ctx.arc(star.screenX, star.screenY, Math.max(3, ringRadius), 0, Math.PI * 2);
          ctx.strokeStyle = isMatched ? '#f59e0b' : star.isMastered ? '#34d399' : '#38bdf8';
          ctx.lineWidth = isHovered || isHighlighted ? 1.5 : 0.8;
          ctx.setLineDash(isHovered ? [3, 3] : []);
          ctx.stroke();
        }

        // Draw 4-Point Light Spark Flare when Highlighted
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

        // Draw Core Star Center (Crisp Dot Point)
        ctx.fillStyle = isHovered || isCatHighlighted ? '#ffffff' : starColor;
        ctx.beginPath();
        ctx.arc(star.screenX, star.screenY, Math.max(1.2, starRadius * 0.75), 0, Math.PI * 2);
        ctx.fill();

        // Draw Floating Skill Name Tag (for Hovered or Category Highlighted Stars)
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
              `✨ ${star.completedCount}/${star.totalCount} exercises`,
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
    <div className="star-sphere-container" ref={containerRef} onWheel={handleWheel}>
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
          onClick={handleZoomIn}
          title="Zoom In (+)"
        >
          <ZoomIn size={15} />
          <span>Zoom +</span>
        </button>

        <button
          className="hud-btn"
          onClick={handleZoomOut}
          title="Zoom Out (-)"
        >
          <ZoomOut size={15} />
          <span>Zoom -</span>
        </button>

        <span className="hud-zoom-badge" title="Current Zoom Scale">{zoomPercent}%</span>

        <button
          className="hud-btn"
          onClick={handleResetView}
          title="Reset 3D View"
        >
          <RotateCcw size={15} />
          <span>Reset View</span>
        </button>

        <button
          className={`hud-btn ${isAutoRotate ? 'active' : ''}`}
          onClick={onToggleAutoRotate}
          title={isAutoRotate ? 'Pause auto-rotate' : 'Enable 3D auto-rotate'}
        >
          {isAutoRotate ? <Pause size={15} /> : <Play size={15} />}
          <span>{isAutoRotate ? 'Rotating' : 'Paused'}</span>
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
              <span>Completed: <strong>{hoveredStar.completedCount}/{hoveredStar.totalCount} tasks</strong></span>
              <span className="star-hover-pct">{hoveredStar.skill.levelPercentage}% Mastery</span>
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
              <span>Double-click to view exercises</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
