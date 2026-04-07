'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useUniverseStore, selectFilteredGraphData } from '@/lib/store/universeStore';
import { findConnectedNodes } from '@/lib/utils/graphBuilder';

const NODE_RADIUS = 18; // Büyütüldü
const DAMPING = 0.92; // Suyun içinde gibi yavaşlama
const DRAG_FORCE = 0.4;

interface NodePosition {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
}

interface AnimatedParticle {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
}

export function ForceGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const graphData = useUniverseStore((s) => s.graphData);
  const filters = useUniverseStore((s) => s.filters);
  const selectedNode = useUniverseStore((s) => s.selectedNode);
  const selectNode = useUniverseStore((s) => s.selectNode);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const nodePositionsRef = useRef<Map<string, NodePosition>>(new Map());
  const particlesRef = useRef<AnimatedParticle[]>([]);
  const animationTimeRef = useRef(0);

  // Get filtered data
  const filteredData = useMemo(() => {
    const state = useUniverseStore.getState();
    return selectFilteredGraphData(state);
  }, [graphData, filters]);

  // Initialize node positions in circle
  useEffect(() => {
    if (!filteredData || filteredData.nodes.length === 0) return;

    const positions = nodePositionsRef.current;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.5;

    filteredData.nodes.forEach((node, i) => {
      if (!positions.has(node.id)) {
        const angle = (i / filteredData.nodes.length) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        positions.set(node.id, {
          x,
          y,
          targetX: x,
          targetY: y,
          vx: 0,
          vy: 0,
        });
      }
    });
  }, [filteredData]);

  // Main animation loop
  useEffect(() => {
    if (!canvasRef.current || !filteredData || filteredData.nodes.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const positions = nodePositionsRef.current;
    const particles = particlesRef.current;

    // Update canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    const getConnectedIds = (nodeId: string | null) => {
      if (!nodeId) return new Set<string>();
      const linked = findConnectedNodes(nodeId, filteredData.links);
      return new Set([nodeId, ...linked]);
    };

    const connectedIds = getConnectedIds(selectedNode?.id || hoveredNodeId);

    // Render frame
    const render = (time: number) => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update positions - nodes spring back to target
      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;

        // Spring force back to target
        const dx = pos.targetX - pos.x;
        const dy = pos.targetY - pos.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0.1) {
          const spring = 0.08;
          pos.vx += dx * spring;
          pos.vy += dy * spring;
        }

        // Damping (water resistance)
        pos.vx *= DAMPING;
        pos.vy *= DAMPING;

        // Update position
        pos.x += pos.vx;
        pos.y += pos.vy;

        // Boundary soft damping
        const margin = 100;
        if (pos.x < margin) {
          pos.x = margin;
          pos.vx = 0;
        }
        if (pos.x > canvas.width - margin) {
          pos.x = canvas.width - margin;
          pos.vx = 0;
        }
        if (pos.y < margin) {
          pos.y = margin;
          pos.vy = 0;
        }
        if (pos.y > canvas.height - margin) {
          pos.y = canvas.height - margin;
          pos.vy = 0;
        }
      });

      // Update particles for pulse animation
      particles.forEach((p, idx) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          particles.splice(idx, 1);
          return;
        }
      });

      // Add new particles periodically
      if (Math.floor(time / 300) > animationTimeRef.current) {
        animationTimeRef.current = Math.floor(time / 300);
        filteredData.links.forEach((link) => {
          if (Math.random() < 0.7) {
            particles.push({
              sourceId: String(link.source),
              targetId: String(link.target),
              progress: 0,
              speed: 0.012 + Math.random() * 0.008,
            });
          }
        });
      }

      // Draw links with particles
      ctx.globalAlpha = 1;
      filteredData.links.forEach((link) => {
        const p1 = positions.get(String(link.source));
        const p2 = positions.get(String(link.target));
        if (!p1 || !p2) return;

        const isConnected =
          connectedIds.has(String(link.source)) &&
          connectedIds.has(String(link.target));

        // Draw base line
        ctx.strokeStyle = isConnected
          ? link.type === 'technology'
            ? 'rgba(6, 182, 212, 0.3)'
            : 'rgba(168, 85, 247, 0.3)'
          : 'rgba(100, 120, 150, 0.1)';
        ctx.lineWidth = isConnected ? 2 : 0.8;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw animated particles on links
      particles.forEach((p) => {
        const p1 = positions.get(p.sourceId);
        const p2 = positions.get(p.targetId);
        if (!p1 || !p2) return;

        const x = p1.x + (p2.x - p1.x) * p.progress;
        const y = p1.y + (p2.y - p1.y) * p.progress;

        const link = filteredData.links.find(
          (l) =>
            (String(l.source) === p.sourceId && String(l.target) === p.targetId) ||
            (String(l.source) === p.targetId && String(l.target) === p.sourceId)
        );

        const color =
          link?.type === 'technology'
            ? 'rgba(6, 182, 212,'
            : 'rgba(168, 85, 247,';

        const alpha = Math.sin(p.progress * Math.PI) * 0.8;
        const size = 3 + Math.sin(p.progress * Math.PI) * 2;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = color + alpha + ')';
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw nodes
      ctx.globalAlpha = 1;
      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;
        const scaledRadius = NODE_RADIUS * zoom;

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, scaledRadius, 0, Math.PI * 2);
        ctx.fill();

        // Glow on selected
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, scaledRadius + 8, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Highlight on hover
        if (hoveredNodeId === node.id) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, scaledRadius + 5, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label below node
        ctx.fillStyle = '#e2e8f0';
        ctx.font = `bold ${Math.max(10, 12 * zoom)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name, pos.x, pos.y + scaledRadius + 10);
      });
    };

    // Animation loop
    const animate = (time: number) => {
      render(time);
      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (draggedNodeId) {
        const pos = positions.get(draggedNodeId)!;
        pos.x = x;
        pos.y = y;
        // Apply small velocity for smooth damping after release
        pos.vx = (x - pos.targetX) * DRAG_FORCE;
        pos.vy = (y - pos.targetY) * DRAG_FORCE;
      } else {
        // Hover detection
        let hovered: string | null = null;
        filteredData.nodes.forEach((node) => {
          const pos = positions.get(node.id)!;
          const dx = x - pos.x;
          const dy = y - pos.y;
          const scaledRadius = NODE_RADIUS * zoom;
          if (Math.sqrt(dx * dx + dy * dy) < scaledRadius + 12) {
            hovered = node.id;
          }
        });

        setHoveredNodeId(hovered);
        canvas.style.cursor = hovered || draggedNodeId ? 'grab' : 'default';
      }
    };

    // Mouse down - start dragging
    const handleMouseDown = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;
        const dx = x - pos.x;
        const dy = y - pos.y;
        const scaledRadius = NODE_RADIUS * zoom;
        if (Math.sqrt(dx * dx + dy * dy) < scaledRadius + 10) {
          setDraggedNodeId(node.id);
          canvas.style.cursor = 'grabbing';
          pos.vx = 0;
          pos.vy = 0;
        }
      });
    };

    // Mouse up - stop dragging, let physics take over
    const handleMouseUp = () => {
      setDraggedNodeId(null);
      canvas.style.cursor = 'default';
    };

    // Click handler - select node
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;
        const dx = x - pos.x;
        const dy = y - pos.y;
        const scaledRadius = NODE_RADIUS * zoom;
        if (Math.sqrt(dx * dx + dy * dy) < scaledRadius + 10) {
          selectNode(selectedNode?.id === node.id ? null : node);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);
    canvas.addEventListener('click', handleClick);

    // Wheel zoom handler
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      setZoom((prev) => {
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const newZoom = Math.max(0.5, Math.min(3, prev * delta));
        return newZoom;
      });
    };

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('wheel', handleWheel);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [filteredData, hoveredNodeId, draggedNodeId, selectedNode, selectNode, zoom]);

  if (!filteredData || filteredData.nodes.length === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-950">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-700 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-300 text-sm">Loading Project Universe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-slate-900 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
      />

      {/* Info overlay */}
      <div className="absolute top-6 left-6 text-xs text-slate-300 bg-slate-800/80 px-4 py-3 rounded border border-slate-700 pointer-events-none backdrop-blur-sm">
        <p className="font-semibold text-cyan-400 mb-2">Project Universe</p>
        <p className="text-xs mb-2">{filteredData.nodes.length} projects • {filteredData.links.length} connections</p>
        <p className="text-slate-400 text-xs">Drag nodes • Click to select • Scroll to zoom</p>
        <p className="text-slate-500 text-xs mt-1">Zoom: {zoom.toFixed(1)}x</p>
      </div>
    </div>
  );
}
