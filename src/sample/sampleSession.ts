import type { ConversationDetail, ConversationMeta } from '../types/antigravity';

export const SAMPLE_CONVERSATIONS: ConversationMeta[] = [
  {
    id: 'demo-1-webgl-shader',
    title: 'Nebula 3D Particle Visualizer',
    preview: 'Optimizing WebGL fragment shaders and GPU compute buffers for 100,000 galaxy particles',
    userName: 'Marcus Vance',
    stepCount: 24,
    isArchived: false,
    isPinned: true,
    isRunning: true,
    lastModifiedTime: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
    relativeTimeStr: '14m',
    workspaceUri: '~/projects/nebula-webgl',
    artifactsCount: 2,
  },
  {
    id: 'demo-2-crypto-arbitrage',
    title: 'High-Frequency Crypto Orderbook Bot',
    preview: 'Building lock-free L2 orderbook processor in Rust with low-latency WebSocket feeds',
    userName: 'Elena Rostova',
    stepCount: 18,
    isArchived: false,
    isPinned: true,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 42 * 60 * 1000).toISOString(),
    relativeTimeStr: '42m',
    workspaceUri: '~/src/quant-trading-core',
    artifactsCount: 1,
  },
  {
    id: 'demo-3-pgvector',
    title: 'Neural Semantic Search with PGVector',
    preview: 'Implementing HNSW indexing, hybrid BM25 re-ranking, and embedding caching in PostgreSQL',
    userName: 'Devon Cross',
    stepCount: 32,
    isArchived: false,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    relativeTimeStr: '2h',
    workspaceUri: '~/apps/vector-search-engine',
    artifactsCount: 3,
  },
  {
    id: 'demo-4-flutter-habits',
    title: 'Offline-First Habit Tracker with Isar',
    preview: 'Designing reactive local persistence and Riverpod state management in Flutter',
    userName: 'Sophia Miller',
    stepCount: 15,
    isArchived: false,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
    relativeTimeStr: '5h',
    workspaceUri: '~/mobile/zenith-habits',
    artifactsCount: 1,
  },
  {
    id: 'demo-archive-1-kafka',
    title: 'Kafka Event Streaming & Dead Letter Queue',
    preview: 'Partition key hashing strategy and poison pill recovery with KafkaJS and Schema Registry',
    userName: 'Marcus Vance',
    stepCount: 36,
    isArchived: true,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
    relativeTimeStr: '2d',
    artifactsCount: 2,
  },
  {
    id: 'demo-archive-2-k8s',
    title: 'Kubernetes Karpenter Autoscaler Tuning',
    preview: 'Evaluating Spot instance disruption handling vs standard cluster autoscaler on EKS',
    userName: 'Jordan Reed',
    stepCount: 28,
    isArchived: true,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 4 * 86400 * 1000).toISOString(),
    relativeTimeStr: '4d',
    artifactsCount: 1,
  },
  {
    id: 'demo-archive-3-tauri',
    title: 'OAuth2 PKCE Flow for Tauri Desktop App',
    preview: 'Implementing deep-link custom URL scheme handlers and secure token storage in OS keychain',
    userName: 'Alex Chen',
    stepCount: 14,
    isArchived: true,
    isPinned: false,
    isRunning: false,
    lastModifiedTime: new Date(Date.now() - 7 * 86400 * 1000).toISOString(),
    relativeTimeStr: '7d',
    artifactsCount: 1,
  },
];

export const SAMPLE_DETAIL_MAP: Record<string, ConversationDetail> = {
  'demo-1-webgl-shader': {
    meta: SAMPLE_CONVERSATIONS[0],
    artifacts: [
      {
        id: 'particle_pipeline.md',
        name: 'particle_pipeline.md',
        path: 'brain/demo-1-webgl-shader/particle_pipeline.md',
        content: `# Nebula WebGL Particle Pipeline Architecture

- **Buffer Layout**: \`Float32Array\` with 8-float strides (3x Position, 3x Velocity, 1x Lifetime, 1x ColorIdx)
- **Shader Strategy**: Custom \`RawShaderMaterial\` with additive alpha blending
- **Compute Simulation**: 100% GPU-driven Brownian turbulence in vertex shader.`,
        isUserFacing: true,
      },
      {
        id: 'benchmarks.md',
        name: 'benchmarks.md',
        path: 'brain/demo-1-webgl-shader/benchmarks.md',
        content: `# Performance Benchmark Results

| Configuration | Particle Count | Average FPS | Draw Calls |
| :--- | :--- | :--- | :--- |
| PointsMaterial (CPU Loop) | 25,000 | 28 FPS | 1 |
| Instanced RawShader (GPU) | 100,000 | 60 FPS | 1 |
| Dual Attractor Compute | 250,000 | 58 FPS | 2 |`,
        isUserFacing: true,
      }
    ],
    steps: [
      {
        stepIndex: 0,
        source: 'USER_EXPLICIT',
        type: 'USER_INPUT',
        status: 'DONE',
        userName: 'Marcus Vance',
        createdAt: '2026-10-26T15:10:00Z',
        cleanUserPrompt: 'I am building a 3D space nebula particle simulator in Three.js and WebGL. When rendering 100k particles with bloom, the frame rate drops to 24fps on integrated GPUs. How can we optimize this with custom instanced vertex shaders and GPU point cloud buffers?',
        content: 'I am building a 3D space nebula particle simulator in Three.js and WebGL. When rendering 100k particles with bloom, the frame rate drops to 24fps on integrated GPUs. How can we optimize this with custom instanced vertex shaders and GPU point cloud buffers?',
      },
      {
        stepIndex: 1,
        source: 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: 'DONE',
        createdAt: '2026-10-26T15:10:03Z',
        thinking: `Analyzing WebGL performance bottlenecks for 100k particle systems:
1. Traditional CPU position updates bottleneck JavaScript main thread and necessitate uploading huge arrays to VRAM every frame.
2. Replace PointsMaterial with custom RawShaderMaterial + InstancedBufferGeometry.
3. Compute particle simulation entirely in the vertex shader using analytical 3D curl noise math.
4. Check package dependencies for glslify or three-stdlib.`,
        toolCalls: [
          {
            name: 'run_command',
            toolSummary: 'Inspect WebGL build dependencies',
            args: { CommandLine: 'npm list three @react-three/fiber' },
            output: `+-- @react-three/fiber@8.17.10\n+-- three@0.170.0`,
            status: 'DONE',
          }
        ],
        content: `Here is the architectural optimization strategy to achieve a locked **60 FPS with 100,000+ particles**:

### ⚡ 1. The Core Bottleneck: CPU-to-GPU Uploads
Updating 100,000 particle coordinates on the CPU requires transferring **1.2 MB per frame (72 MB/s)** over the PCIe bus. Moving the physics math into the **Vertex Shader** eliminates this transfer completely.

### 📐 2. Instanced Stride Buffer Specification
We initialize static attributes once on startup and feed elapsed time via a single \`uniform float uTime\`:

\`\`\`typescript
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(PARTICLE_COUNT * 3);
const randomness = new Float32Array(PARTICLE_COUNT * 3);

for (let i = 0; i < PARTICLE_COUNT; i++) {
  // Spherical fibonacci distribution around nebula core
  const theta = Math.acos(2 * Math.random() - 1);
  const phi = Math.sqrt(Math.PI * PARTICLE_COUNT) * theta;
  positions[i * 3 + 0] = Math.sin(theta) * Math.cos(phi) * 12.0;
  positions[i * 3 + 1] = Math.sin(theta) * Math.sin(phi) * 12.0;
  positions[i * 3 + 2] = Math.cos(theta) * 12.0;
}

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomness, 3));
\`\`\`

With this setup, all position calculations execute directly inside parallel GPU stream processors!`,
      },
      {
        stepIndex: 2,
        source: 'USER_EXPLICIT',
        type: 'USER_INPUT',
        status: 'DONE',
        userName: 'Marcus Vance',
        createdAt: '2026-10-26T15:12:30Z',
        cleanUserPrompt: 'Can we add an interactive gravity attractor that smoothly pulls particles towards cursor velocity?',
        content: 'Can we add an interactive gravity attractor that smoothly pulls particles towards cursor velocity?',
      },
      {
        stepIndex: 3,
        source: 'MODEL',
        type: 'PLANNER_RESPONSE',
        status: 'DONE',
        createdAt: '2026-10-26T15:12:34Z',
        thinking: `Adding an interactive cursor attractor:
1. Pass pointer 3D unprojected ray coordinates as 'uniform vec3 uAttractorPos'.
2. Pass pointer velocity magnitude as 'uniform float uAttractorStrength'.
3. In vertex shader, compute distance vector from particle position to uAttractorPos.
4. Apply inverse-square gravity dampening with a softening radius (epsilon) to avoid singularities.`,
        toolCalls: [
          {
            name: 'write_file',
            toolSummary: 'Create GLSL particle vertex shader with dynamic attractor',
            args: { Path: 'src/shaders/nebulaParticle.vert' },
            output: 'Created file successfully.',
            status: 'DONE',
          }
        ],
        content: `I've implemented the **GLSL gravity attractor** in the vertex shader:

\`\`\`glsl
uniform float uTime;
uniform vec3 uAttractorPos;
uniform float uAttractorStrength;

attribute vec3 aRandom;

varying vec3 vColor;
varying float vAlpha;

void main() {
  vec3 pos = position;
  
  // Calculate vector towards cursor attractor
  vec3 toAttractor = uAttractorPos - pos;
  float dist = length(toAttractor);
  vec3 dir = normalize(toAttractor);
  
  // Inverse-square gravity with softening parameter epsilon = 0.5
  float force = uAttractorStrength / (dist * dist + 0.5);
  pos += dir * min(force, 3.5) * sin(uTime * 2.0 + aRandom.x);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = (18.0 * aRandom.z) / -mvPosition.z;
  gl_Position = projectionMatrix * mvPosition;

  vAlpha = smoothstep(20.0, 5.0, dist);
  vColor = mix(vec3(0.2, 0.6, 1.0), vec3(0.9, 0.3, 0.8), aRandom.y);
}
\`\`\`

The particles will now dynamically vortex and accelerate toward your cursor!`,
      }
    ]
  }
};
