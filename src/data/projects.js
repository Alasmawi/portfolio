// Pulled from github.com/Alasmawi and hand-curated — real repos, not placeholders.
// Add a project by appending one object; the ProjectBrowser reads this list directly.
import k9SensorNode from '../assets/k9/sensor-node.webp';
import k9Collar from '../assets/k9/collar.webp';
import k9FoodScale from '../assets/k9/food-scale.webp';
import k9Pi5Gateway from '../assets/k9/pi5-gateway.webp';
import k9ReolinkCam from '../assets/k9/reolink-cam.webp';
import k9ArchitectureDiagram from '../assets/k9/architecture-diagram.webp';

export const LANGUAGE_COLORS = {
  Go: '#2FC2E8',
  Rust: '#DE7B4A',
  JavaScript: '#E8C547',
  Python: '#7BA05B',
  Shell: '#89A85B',
};

export const PROJECTS = [
  {
    id: 'k9-pavlov',
    pillars: ['cloud', 'ai'],
    name: 'K9 Pavlov System',
    tagline: 'senior project · flagship',
    language: null,
    flagship: true,
    private: true,
    description:
      'An end-to-end IoT + cloud platform for police K9 monitoring: real-time health and environmental sensors, AI-powered anomaly detection via Amazon Bedrock, a centralized dashboard, and kennel/handler management — built during the AWS Cloud Innovation Center internship for the Bahrain Ministry of Interior.',
    tags: ['AWS IoT Core', 'Amazon Bedrock', 'Lambda', 'DynamoDB', 'ESP32', 'React'],
    githubUrl: null,
    liveUrl: 'https://pavlov-k9.com/',
    gif: null,
    items: [
      {
        type: 'diagram',
        src: k9ArchitectureDiagram,
        tag: 'architecture',
        alt: 'Animated data-flow diagram: sensor to AWS IoT Core to Lambda and Bedrock to dashboard',
      },
      {
        type: 'image',
        src: k9SensorNode,
        tag: 'node-a',
        alt: 'Node-A kennel environmental sensor unit, ESP32-S3-based, rendered device',
      },
      {
        type: 'image',
        src: k9Collar,
        tag: 'smart-collar',
        alt: 'Smart K9 collar with a live heart-rate and temperature display',
      },
      {
        type: 'image',
        src: k9FoodScale,
        tag: 'food-scale',
        alt: '3D-printed smart food scale enclosure with an OLED display',
      },
      {
        type: 'image',
        src: k9Pi5Gateway,
        tag: 'pi5-gateway',
        alt: 'Raspberry Pi 5 kennel gateway running AWS IoT Greengrass',
      },
      {
        type: 'image',
        src: k9ReolinkCam,
        tag: 'reolink-cam',
        alt: 'Reolink IP camera, the primary detection source',
      },
    ],
  },
  {
    id: 'guidely',
    pillars: ['ai', 'fullstack'],
    name: 'guidely',
    tagline: 'answers with their sources attached',
    language: 'Python',
    description:
      'An internal knowledge assistant that answers plain-language questions using only your own documents — and shows its work, citing every passage it used with filename, section, similarity score, and snippet. Documents are parsed, heading-aware chunked, embedded into FAISS, and answered by a local Ollama model or OpenAI.',
    tags: ['Python', 'FastAPI', 'RAG', 'FAISS', 'Ollama', 'React'],
    githubUrl: 'https://github.com/Alasmawi/guidely',
    liveUrl: null,
    video: '/video/guidely.mp4',
  },
  {
    id: 'detecto',
    pillars: ['ai', 'fullstack'],
    name: 'detecto',
    tagline: 'how many people are in this frame?',
    language: 'Python',
    description:
      'Real-time person detection and counting for monitored spaces. YOLOv8 behind a FastAPI service returns a count, bounding boxes, and per-detection confidences for an uploaded frame or a live webcam stream — then keeps every result queryable, with occupancy statistics, charts, zone alerts, and CSV/Excel export.',
    tags: ['Python', 'FastAPI', 'YOLOv8', 'OpenCV', 'React', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/detecto',
    liveUrl: null,
    video: '/video/detecto.mp4',
  },
  {
    id: 'brain-book',
    pillars: ['fullstack'],
    name: 'Brain-Book',
    tagline: 'full-stack social network',
    language: 'Go',
    flagship: true,
    description:
      'A full-stack social network with real-time messaging over WebSockets, groups, notifications, media sharing, authentication, and granular privacy controls.',
    tags: ['Go', 'WebSockets', 'REST APIs', 'Auth', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/Brain-Book',
    liveUrl: null,
    video: '/video/brain-book.mp4',
  },
  {
    id: 'localhost',
    pillars: ['cs'],
    name: 'localhost',
    tagline: 'HTTP/1.1 server from scratch',
    language: 'Rust',
    description:
      'An educational single-threaded HTTP/1.1 server for Linux, built directly on epoll with no web framework — parses requests, handles keep-alive, and serves responses by hand.',
    tags: ['Rust', 'HTTP/1.1', 'epoll', 'Systems Programming'],
    githubUrl: 'https://github.com/Alasmawi/localhost',
    liveUrl: null,
    video: '/video/localhost.mp4',
  },
  {
    id: '0-shell',
    pillars: ['cs'],
    name: '0-shell',
    tagline: 'a shell, no external binaries',
    language: 'Rust',
    description:
      'A minimalist Unix-like shell implemented entirely in Rust, with every builtin (cd, ls, cat, cp, mv...) implemented from scratch — no shelling out to external commands.',
    tags: ['Rust', 'Shell', 'Systems Programming'],
    githubUrl: 'https://github.com/Alasmawi/0-shell',
    liveUrl: null,
    video: '/video/0-shell.mp4',
  },
  {
    id: 'rt',
    pillars: ['cs'],
    name: 'rt',
    tagline: 'ray tracer from first principles',
    language: 'Rust',
    description:
      'A dependency-free Whitted-style ray tracer in Rust that renders spheres, cubes, planes, and cylinders — with shadows, reflection, and lighting — to PPM images.',
    tags: ['Rust', 'Ray Tracing', 'Computer Graphics'],
    githubUrl: 'https://github.com/Alasmawi/rt',
    liveUrl: null,
    video: '/video/rt.mp4',
  },
  {
    id: 'smart-road',
    pillars: ['cs'],
    name: 'smart-road',
    tagline: 'intersections without traffic lights',
    language: 'Rust',
    description:
      'A Rust + SDL2 simulation of autonomous vehicles crossing a four-way intersection using reservation-based scheduling instead of traffic lights — tuned to avoid collisions under load.',
    tags: ['Rust', 'SDL2', 'Simulation', 'Scheduling'],
    githubUrl: 'https://github.com/Alasmawi/smart-road',
    liveUrl: null,
    video: '/video/smart-road.mp4',
  },
  {
    id: 'multiplayer-fps',
    pillars: ['fullstack', 'cs'],
    name: 'multiplayer-fps',
    tagline: 'networked first-person shooter',
    language: 'Rust',
    description:
      'A multiplayer first-person shooter with an authoritative server driving client-side prediction and state reconciliation over the network.',
    tags: ['Rust', 'Multiplayer', 'Game Dev', 'Networking'],
    githubUrl: 'https://github.com/Alasmawi/multiplayer-fps',
    liveUrl: null,
    video: '/video/multiplayer-fps.mp4',
  },
  {
    id: 'bomberman-dom',
    pillars: ['fullstack'],
    name: 'bomberman-dom',
    tagline: 'real-time multiplayer, no game engine',
    language: 'JavaScript',
    description:
      'Real-time multiplayer Bomberman built with a WebSocket-authoritative server and a DOM renderer running on a hand-built mini-framework client — no canvas, no game engine.',
    tags: ['JavaScript', 'WebSockets', 'Game Dev'],
    githubUrl: 'https://github.com/Alasmawi/bomberman-dom',
    liveUrl: null,
    video: '/video/bomberman-dom.mp4',
  },
  {
    id: 'mini-framework',
    pillars: ['fullstack', 'cs'],
    name: 'mini-framework',
    tagline: '"Domino" — a JS framework, from scratch',
    language: 'JavaScript',
    description:
      'Domino: a dependency-free JavaScript mini-framework with a virtual DOM, delegated event system, hash-based router, and observable store — shipped with a TodoMVC reference app.',
    tags: ['JavaScript', 'Virtual DOM', 'Framework Design'],
    githubUrl: 'https://github.com/Alasmawi/mini-framework',
    liveUrl: null,
    video: '/video/mini-framework.mp4',
  },
  {
    id: 'real-time-forum',
    pillars: ['fullstack'],
    name: 'real-time-forum',
    tagline: 'forum with live private chat',
    language: 'Go',
    description:
      'A single-page forum backed by Go and SQLite: threaded posts and categories, plus private real-time messaging over WebSockets with online/offline presence.',
    tags: ['Go', 'WebSockets', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/real-time-forum',
    liveUrl: null,
    video: '/video/real-time-forum.mp4',
  },
  {
    id: 'net-cat',
    pillars: ['cs'],
    name: 'Net-Cat',
    tagline: 'TCP chat server, netcat-style',
    language: 'Go',
    description:
      'A TCP chat server in Go in the spirit of classic Unix netcat/talk — multiple concurrent client connections, named clients, and broadcast messaging over raw sockets.',
    tags: ['Go', 'TCP', 'Networking'],
    githubUrl: 'https://github.com/Alasmawi/Net-Cat',
    liveUrl: null,
    video: '/video/net-cat.mp4',
  },
  {
    id: 'groupie-tracker',
    pillars: ['fullstack'],
    name: 'groupie-tracker',
    tagline: 'REST API, visualized',
    language: 'Go',
    description:
      'A Go web app that consumes the Groupie Trackers REST API to let you browse bands, members, tour dates, and concert locations through a server-rendered UI.',
    tags: ['Go', 'REST APIs', 'Frontend'],
    githubUrl: 'https://github.com/Alasmawi/groupie-tracker',
    liveUrl: null,
    video: '/video/groupie-tracker.mp4',
  },
];
