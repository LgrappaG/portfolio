'use client';

import React, { useEffect, useRef, useMemo, useState } from 'react';
import { useUniverseStore, selectFilteredGraphData } from '@/lib/store/universeStore';
import { findConnectedNodes } from '@/lib/utils/graphBuilder';

const NODE_RADIUS = 8;
const CHARGE_STRENGTH = -150;
const LINK_DISTANCE = 60;
const FRICTION = 0.95;
const SIMULATION_STEPS = 100;

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function ForceGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const graphData = useUniverseStore((s) => s.graphData);
  const filters = useUniverseStore((s) => s.filters);
  const selectedNode = useUniverseStore((s) => s.selectedNode);
  const selectNode = useUniverseStore((s) => s.selectNode);

  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const nodePositionsRef = useRef<Map<string, NodePosition>>(new Map());
  const isSimulatingRef = useRef(true);

  // Get filtered data
  const filteredData = useMemo(() => {
    const state = useUniverseStore.getState();
    return selectFilteredGraphData(state);
  }, [graphData, filters]);

  // Initialize node positions
  useEffect(() => {
    if (!filteredData || filteredData.nodes.length === 0) return;

    const positions = nodePositionsRef.current;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.6;

    filteredData.nodes.forEach((node, i) => {
      if (!positions.has(node.id)) {
        const angle = (i / filteredData.nodes.length) * Math.PI * 2;
        positions.set(node.id, {
          x: centerX + Math.cos(angle) * radius,
          y: centerY + Math.sin(angle) * radius,
          vx: 0,
          vy: 0,
        });
      }
    });
  }, [filteredData]);

  // Force simulation + rendering
  useEffect(() => {
    if (!canvasRef.current || !filteredData || filteredData.nodes.length === 0) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d')!;
    const positions = nodePositionsRef.current;

    // Update canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    updateSize();
    window.addEventListener('resize', updateSize);

    // Get connected nodes for current hovered/selected node
    const getConnectedIds = (nodeId: string | null) => {
      if (!nodeId) return new Set<string>();
      const linked = findConnectedNodes(nodeId, filteredData.links);
      return new Set([nodeId, ...linked]);
    };

    const connectedIds = getConnectedIds(selectedNode?.id || hoveredNodeId);

    // Force simulation step
    const simulationStep = () => {
      const nodes = filteredData.nodes;
      const links = filteredData.links;

      // Apply repulsive forces (charge)
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const p1 = positions.get(n1.id)!;
          const p2 = positions.get(n2.id)!;

          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          let dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
          const force = CHARGE_STRENGTH / (dist * dist);

          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;

          p1.vx -= fx;
          p1.vy -= fy;
          p2.vx += fx;
          p2.vy += fy;
        }
      }

      // Apply attractive forces (links)
      links.forEach((link) => {
        const n1 = filteredData.nodes.find((n) => n.id === link.source)!;
        const n2 = filteredData.nodes.find((n) => n.id === link.target)!;
        const p1 = positions.get(n1.id)!;
        const p2 = positions.get(n2.id)!;

        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        let dist = Math.sqrt(dx * dx + dy * dy) || 0.1;
        const force = (dist - LINK_DISTANCE) * 0.1;

        const fx = (dx / dist) * force;
        const fy = (dy / dist) * force;

        p1.vx += fx;
        p1.vy += fy;
        p2.vx -= fx;
        p2.vy -= fy;
      });

      // Update positions and apply friction
      nodes.forEach((node) => {
        const pos = positions.get(node.id)!;
        pos.vx *= FRICTION;
        pos.vy *= FRICTION;

        // Boundary damping
        const margin = 50;
        if (pos.x < margin || pos.x > canvas.width - margin) pos.vx *= -0.5;
        if (pos.y < margin || pos.y > canvas.height - margin) pos.vy *= -0.5;

        pos.x = Math.max(margin, Math.min(canvas.width - margin, pos.x + pos.vx));
        pos.y = Math.max(margin, Math.min(canvas.height - margin, pos.y + pos.vy));
      });
    };

    // Render frame
    const render = () => {
      // Clear canvas
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw links
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.2)';
      ctx.lineWidth = 1.5;
      filteredData.links.forEach((link) => {
        const p1 = positions.get(String(link.source));
        const p2 = positions.get(String(link.target));
        if (!p1 || !p2) return;

        // Highlight links if connected to hovered/selected
        if (connectedIds.has(String(link.source)) && connectedIds.has(String(link.target))) {
          ctx.strokeStyle = link.type === 'technology'
            ? 'rgba(6, 182, 212, 0.6)'
            : 'rgba(168, 85, 247, 0.6)';
          ctx.lineWidth = 2;
        } else {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
          ctx.lineWidth = 1;
        }

        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw nodes
      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, NODE_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // Glow on selected
        if (selectedNode?.id === node.id) {
          ctx.strokeStyle = 'rgba(6, 182, 212, 0.8)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, NODE_RADIUS + 6, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Highlight on hover
        if (hoveredNodeId === node.id) {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, NODE_RADIUS + 4, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Label below node
        ctx.fillStyle = '#e2e8f0';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(node.name, pos.x, pos.y + NODE_RADIUS + 8);
      });
    };

    // Animation loop
    let stepCount = 0;
    const animate = () => {
      // Run multiple simulation steps per frame for stability
      for (let i = 0; i < SIMULATION_STEPS; i++) {
        simulationStep();
      }
      render();
      stepCount++;

      if (stepCount > 300) {
        isSimulatingRef.current = false;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      let hovered: string | null = null;
      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS + 10) {
          hovered = node.id;
        }
      });

      setHoveredNodeId(hovered);
      canvas.style.cursor = hovered ? 'pointer' : 'default';
    };

    // Click handler
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      filteredData.nodes.forEach((node) => {
        const pos = positions.get(node.id)!;
        const dx = x - pos.x;
        const dy = y - pos.y;
        if (Math.sqrt(dx * dx + dy * dy) < NODE_RADIUS + 10) {
          selectNode(selectedNode?.id === node.id ? null : node);
        }
      });
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('resize', updateSize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [filteredData, hoveredNodeId, selectedNode, selectNode]);

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
        <p>{filteredData.nodes.length} projects • {filteredData.links.length} connections</p>
        <p className="text-slate-400 text-xs mt-2">Click to select • Scroll to filter</p>
      </div>
    </div>
  );
}
