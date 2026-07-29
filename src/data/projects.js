// Pulled from github.com/Alasmawi and hand-curated — real repos, not placeholders.
// Add a project by appending one object; the ProjectBrowser reads this list directly.
import k9SensorNode from '../assets/k9/sensor-node.webp';
import k9Camera from '../assets/k9/camera.webp';
import k9FoodScale from '../assets/k9/smart-food-scale.webp';
import k9Collar from '../assets/k9/collar.webp';

export const LANGUAGE_COLORS = {
  Go: '#4FA3C4',
  Rust: '#DE7B4A',
  JavaScript: '#E8C547',
  Shell: '#89A85B',
};

export const PROJECTS = [
  {
    id: 'k9-pavlov',
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
    showArchitecture: true,
    images: [
      {
        src: k9SensorNode,
        tag: 'node-a',
        alt: 'K-9 Unit sensor enclosure with a live OLED telemetry display',
      },
      {
        src: k9Camera,
        tag: 'esp32-cam',
        alt: 'ESP32 bullet camera mounted on a tripod',
      },
      {
        src: k9FoodScale,
        tag: 'food-cart',
        alt: '3D-printed smart food scale enclosure with an OLED display',
      },
      {
        src: k9Collar,
        tag: 'collar · polar-h10',
        alt: 'K9 collar with a live heart-rate and temperature display',
      },
    ],
  },
  {
    id: 'brain-book',
    name: 'Brain-Book',
    tagline: 'full-stack social network',
    language: 'Go',
    flagship: true,
    description:
      'A full-stack social network with real-time messaging over WebSockets, groups, notifications, media sharing, authentication, and granular privacy controls.',
    tags: ['Go', 'WebSockets', 'REST APIs', 'Auth', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/Brain-Book',
    liveUrl: null,
    gif: '/gifs/brain-book.gif',
  },
  {
    id: 'localhost',
    name: 'localhost',
    tagline: 'HTTP/1.1 server from scratch',
    language: 'Rust',
    description:
      'An educational single-threaded HTTP/1.1 server for Linux, built directly on epoll with no web framework — parses requests, handles keep-alive, and serves responses by hand.',
    tags: ['Rust', 'HTTP/1.1', 'epoll', 'Systems Programming'],
    githubUrl: 'https://github.com/Alasmawi/localhost',
    liveUrl: null,
    gif: '/gifs/localhost.gif',
  },
  {
    id: '0-shell',
    name: '0-shell',
    tagline: 'a shell, no external binaries',
    language: 'Rust',
    description:
      'A minimalist Unix-like shell implemented entirely in Rust, with every builtin (cd, ls, cat, cp, mv...) implemented from scratch — no shelling out to external commands.',
    tags: ['Rust', 'Shell', 'Systems Programming'],
    githubUrl: 'https://github.com/Alasmawi/0-shell',
    liveUrl: null,
    gif: '/gifs/0-shell.gif',
  },
  {
    id: 'rt',
    name: 'rt',
    tagline: 'ray tracer from first principles',
    language: 'Rust',
    description:
      'A dependency-free Whitted-style ray tracer in Rust that renders spheres, cubes, planes, and cylinders — with shadows, reflection, and lighting — to PPM images.',
    tags: ['Rust', 'Ray Tracing', 'Computer Graphics'],
    githubUrl: 'https://github.com/Alasmawi/rt',
    liveUrl: null,
    gif: '/gifs/rt.gif',
  },
  {
    id: 'smart-road',
    name: 'smart-road',
    tagline: 'intersections without traffic lights',
    language: 'Rust',
    description:
      'A Rust + SDL2 simulation of autonomous vehicles crossing a four-way intersection using reservation-based scheduling instead of traffic lights — tuned to avoid collisions under load.',
    tags: ['Rust', 'SDL2', 'Simulation', 'Scheduling'],
    githubUrl: 'https://github.com/Alasmawi/smart-road',
    liveUrl: null,
    gif: '/gifs/smart-road.gif',
  },
  {
    id: 'multiplayer-fps',
    name: 'multiplayer-fps',
    tagline: 'networked first-person shooter',
    language: 'Rust',
    description:
      'A multiplayer first-person shooter with an authoritative server driving client-side prediction and state reconciliation over the network.',
    tags: ['Rust', 'Multiplayer', 'Game Dev', 'Networking'],
    githubUrl: 'https://github.com/Alasmawi/multiplayer-fps',
    liveUrl: null,
    gif: '/gifs/multiplayer-fps.gif',
  },
  {
    id: 'bomberman-dom',
    name: 'bomberman-dom',
    tagline: 'real-time multiplayer, no game engine',
    language: 'JavaScript',
    description:
      'Real-time multiplayer Bomberman built with a WebSocket-authoritative server and a DOM renderer running on a hand-built mini-framework client — no canvas, no game engine.',
    tags: ['JavaScript', 'WebSockets', 'Game Dev'],
    githubUrl: 'https://github.com/Alasmawi/bomberman-dom',
    liveUrl: null,
    gif: '/gifs/bomberman-dom.gif',
  },
  {
    id: 'mini-framework',
    name: 'mini-framework',
    tagline: '"Domino" — a JS framework, from scratch',
    language: 'JavaScript',
    description:
      'Domino: a dependency-free JavaScript mini-framework with a virtual DOM, delegated event system, hash-based router, and observable store — shipped with a TodoMVC reference app.',
    tags: ['JavaScript', 'Virtual DOM', 'Framework Design'],
    githubUrl: 'https://github.com/Alasmawi/mini-framework',
    liveUrl: null,
    gif: '/gifs/mini-framework.gif',
  },
  {
    id: 'real-time-forum',
    name: 'real-time-forum',
    tagline: 'forum with live private chat',
    language: 'Go',
    description:
      'A single-page forum backed by Go and SQLite: threaded posts and categories, plus private real-time messaging over WebSockets with online/offline presence.',
    tags: ['Go', 'WebSockets', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/real-time-forum',
    liveUrl: null,
    gif: '/gifs/real-time-forum.gif',
  },
  {
    id: 'net-cat',
    name: 'Net-Cat',
    tagline: 'TCP chat server, netcat-style',
    language: 'Go',
    description:
      'A TCP chat server in Go in the spirit of classic Unix netcat/talk — multiple concurrent client connections, named clients, and broadcast messaging over raw sockets.',
    tags: ['Go', 'TCP', 'Networking'],
    githubUrl: 'https://github.com/Alasmawi/Net-Cat',
    liveUrl: null,
    gif: '/gifs/net-cat.gif',
  },
  {
    id: 'groupie-tracker',
    name: 'groupie-tracker',
    tagline: 'REST API, visualized',
    language: 'Go',
    description:
      'A Go web app that consumes the Groupie Trackers REST API to let you browse bands, members, tour dates, and concert locations through a server-rendered UI.',
    tags: ['Go', 'REST APIs', 'Frontend'],
    githubUrl: 'https://github.com/Alasmawi/groupie-tracker',
    liveUrl: null,
    gif: '/gifs/groupie-tracker.gif',
  },
];
