"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Html, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { X, Map as MapIcon, ChevronRight } from "lucide-react";

interface Node {
    nodeId: string;
    label: string;
    panoramaUrl: string;
    connections: string[];
    x: number;
    y: number;
}

function Scene({ node, onNavigate }: { node: Node, onNavigate: (id: string) => void }) {
    const texture = useLoader(THREE.TextureLoader, node.panoramaUrl);

    return (
        <group>
            {/* Panorame Sphere */}
            <mesh scale={[-1, 1, 1]}>
                <sphereGeometry args={[500, 60, 40]} />
                <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
            </mesh>

            {/* Hotspots for connections */}
            {node.connections.map((targetId, index) => {
                // Calculate angle based on index for demo, or we could have specific coords in JSON
                const angle = (index / node.connections.length) * Math.PI * 2;
                const radius = 400;
                const x = Math.cos(angle) * radius;
                const z = Math.sin(angle) * radius;

                return (
                    <Html position={[x, -20, z]} key={targetId}>
                        <button
                            onClick={() => onNavigate(targetId)}
                            className="group flex flex-col items-center transition-all hover:scale-110"
                        >
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full border border-white/50 text-white shadow-2xl group-hover:bg-orange-500 group-hover:border-orange-400 transition-colors">
                                <ChevronRight size={24} className="animate-pulse" />
                            </div>
                            <span className="mt-2 bg-black/50 px-3 py-1 text-[10px] uppercase font-black tracking-widest text-white backdrop-blur-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                Vers {targetId}
                            </span>
                        </button>
                    </Html>
                );
            })}
        </group>
    );
}

export default function VirtualTourViewer({ nodes: inputNodes, onClose }: { nodes: Node[] | string; onClose: () => void }) {
    const [nodes, setNodes] = useState<Node[]>([]);
    const [currentNodeId, setCurrentNodeId] = useState<string>("");
    const [showMinimap, setShowMinimap] = useState(true);

    useEffect(() => {
        try {
            const parsed = typeof inputNodes === "string" ? JSON.parse(inputNodes) : inputNodes;
            const validNodes = Array.isArray(parsed) ? parsed : [];
            setNodes(validNodes);
            if (validNodes.length > 0) {
                setCurrentNodeId(validNodes[0].nodeId);
            }
        } catch (e) {
            console.error("Invalid nodes format", e);
        }
    }, [inputNodes]);

    const currentNode = nodes.find(n => n.nodeId === currentNodeId);

    if (!currentNode) return (
        <div className="fixed inset-0 z-[600] bg-black flex items-center justify-center">
            <div className="text-white text-center">
                <p className="text-2xl ">Initialisation de la scène 3D...</p>
                <button onClick={onClose} className="mt-4 border border-white px-8 py-2 text-[10px] font-black uppercase tracking-widest">Retour</button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[600] bg-black">
            {/* UI Layer */}
            <div className="absolute inset-0 z-[610] pointer-events-none">
                {/* Header content */}
                <div className="p-8 flex justify-between items-start pointer-events-auto">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/50">Visite Virtuelle KSM</p>
                        <h2 className="text-2xl  font-black text-white">{currentNode.label}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white text-black p-4 rounded-full transition-all hover:bg-orange-500 hover:text-white hover:rotate-90 premium-shadow"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Minimap (Bottom Left) */}
                {showMinimap && (
                    <div className="absolute bottom-8 left-8 p-6 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl pointer-events-auto pointer-events-auto shadow-2xl transition-all hover:bg-black/60">
                        <div className="flex items-center gap-3 mb-4 border-b border-white/10 pb-2">
                            <MapIcon size={14} className="text-orange-500" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white">Plan des pièces</p>
                        </div>
                        <div className="relative" style={{ width: 150, height: 150 }}>
                            {nodes.map(n => (
                                <div
                                    key={n.nodeId}
                                    onClick={() => setCurrentNodeId(n.nodeId)}
                                    className={`absolute w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer transition-all border-2 ${n.nodeId === currentNodeId
                                            ? "bg-orange-500 border-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.5)] scale-110 z-10"
                                            : "bg-white/10 border-white/20 hover:bg-white/20"
                                        }`}
                                    style={{
                                        left: `calc(50% + ${n.x}px - 20px)`,
                                        top: `calc(50% + ${n.y}px - 20px)`
                                    }}
                                    title={n.label}
                                >
                                    <span className="text-[8px] font-black text-white uppercase">{n.label[0]}</span>
                                </div>
                            ))}
                            {/* Simple connection lines could be added here */}
                        </div>
                    </div>
                )}
            </div>

            {/* 3D Canvas */}
            <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
                <Suspense fallback={null}>
                    <Scene node={currentNode} onNavigate={setCurrentNodeId} />
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        rotateSpeed={-0.5} // Invert for more natural feel
                    />
                </Suspense>
            </Canvas>

            {/* Navigation helper */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[610] text-center pointer-events-none">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/30 animate-pulse">
                    Maintenez et glissez pour explorer • Cliquez sur les flèches pour changer de pièce
                </p>
            </div>
        </div>
    );
}
