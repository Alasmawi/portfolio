// Pulled from github.com/Alasmawi and the two internships, hand-curated — real
// work, not placeholders. The CV's "Selected projects" is the featured set here,
// in the same words, so the two can't tell different stories.
//
// Add a project by appending one object; the ProjectBrowser reads this list
// directly. `featured` projects get the large cards at the top of the section
// with `summary` and `proof`; the rest sit in the compact grid, and every
// project opens the same dialog with `description`.
import k9SensorNode from '../assets/k9/sensor-node.webp';
import k9Collar from '../assets/k9/collar.webp';
import k9FoodScale from '../assets/k9/food-scale.webp';
import k9Pi5Gateway from '../assets/k9/pi5-gateway.webp';
import k9ReolinkCam from '../assets/k9/reolink-cam.webp';
import bayyanCover from '../assets/bayyan/cover.webp';

// Files in public/ are referenced by plain runtime strings, which Vite does not
// rewrite the way it rewrites imports and index.html — so `base` is applied by
// hand here. BASE_URL carries its own trailing slash.
const asset = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;

export const LANGUAGE_COLORS = {
  Go: '#2FC2E8',
  Rust: '#DE7B4A',
  JavaScript: '#E8C547',
  TypeScript: '#5B9BE6',
  Python: '#7BA05B',
  Shell: '#89A85B',
};

export const PROJECTS = [
  {
    id: 'k9-pavlov',
    pillars: ['cloud', 'ai', 'fullstack'],
    name: 'K9 Pavlov System',
    tagline: 'senior capstone · AWS CIC',
    context: 'Ministry of Interior Police K9 Unit',
    language: null,
    featured: true,
    private: true,
    summary:
      'One place to see each police dog’s health, the conditions in its kennel and who is assigned to it, replacing paper records and separate checks.',
    proof: ['ESP32 collar → IoT Core', 'Bedrock care guidance', 'Live demo to MoI'],
    description:
      'A monitoring platform for the Ministry of Interior Police K9 Unit: one place to see each dog’s health, the conditions in its kennel and who is assigned to it, replacing paper records and separate checks. A custom ESP32 collar, kennel sensors and a smart food scale report through a Raspberry Pi 5 gateway to AWS IoT Core over MQTT. Lambda applies the detection rules and writes to DynamoDB, Amazon Bedrock turns anything flagged into plain-language care guidance, and Cognito keeps handlers and kennel staff to their own views. It started as my senior capstone and I built it out during the AWS Cloud Innovation Center internship.',
    tags: ['AWS IoT Core', 'Lambda', 'DynamoDB', 'Amazon Bedrock', 'Cognito', 'API Gateway', 'ESP32', 'React'],
    // Drawn (ui/K9Architecture.jsx), not a picture. Sits behind its own tab
    // next to the hardware gallery rather than stacked above it.
    architecture: 'k9',
    githubUrl: null,
    liveUrl: 'https://pavlov-k9.com/',
    items: [
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
    id: 'bayyan',
    pillars: ['fullstack'],
    name: 'Bayyan',
    tagline: 'obligations registry · Shura Council',
    context: 'Bahrain Shura Council',
    language: 'TypeScript',
    featured: true,
    private: true,
    summary:
      'One register of the security department’s telecom, permit, contract and subscription obligations, flagging each renewal before it lapses.',
    proof: ['English + Arabic, RTL', 'Piloted across 4 teams', 'Linux · nginx · systemd'],
    description:
      'An internal web app that gives the Shura Council’s Networks & Information Security department one register of its telecom, permit, contract and subscription obligations. Each record’s billing cycle drives its renewal date, and records turn to warning and then critical as that date approaches, so nothing lapses unnoticed. It is fully bilingual with a right-to-left Arabic layout, keeps document attachments in MinIO, produces PDF and Excel reports through WeasyPrint and ExcelJS, and runs natively on Linux behind nginx and systemd. Piloted across Network Operations, Information Security, Infrastructure and the Service Desk.',
    tags: ['NestJS', 'Prisma', 'React', 'PostgreSQL', 'MinIO', 'nginx'],
    architecture: 'bayyan',
    githubUrl: null,
    liveUrl: null,
    poster: bayyanCover,
    // Screenshots go here once cleared for sharing — same shape as K9's items.
    // With any present, the dialog shows them in a tab beside the diagram.
    items: [],
  },
  {
    id: 'guidely',
    pillars: ['ai', 'fullstack'],
    name: 'Guidely',
    tagline: 'answers with their sources attached',
    context: 'Internal knowledge assistant',
    language: 'Python',
    featured: true,
    summary:
      'Answers questions about a team’s own documents in a sentence, and shows the exact passages each answer came from.',
    proof: ['94% retrieval hit rate', '264 automated tests', 'Runs fully local'],
    description:
      'Answers everyday questions about a team’s own documents, so someone gets the answer in a sentence instead of reading twelve pages of policy — and every answer shows the passages it was drawn from, with filename, section, similarity score and snippet, so the reader can check it. Documents are parsed, split along their headings, embedded and searched with FAISS, then answered either fully locally through sentence-transformers and Ollama or against the OpenAI API, so nothing has to leave the organization. It finds the right passage for 94% of the test questions, and 264 automated tests cover the system.',
    tags: ['Python', 'FastAPI', 'FAISS', 'sentence-transformers', 'Ollama', 'SQLite', 'React'],
    githubUrl: 'https://github.com/Alasmawi/guidely',
    liveUrl: null,
    video: asset('/video/guidely.mp4'),
    poster: asset('/video/posters/guidely.webp'),
  },
  {
    id: 'brain-book',
    pillars: ['fullstack'],
    name: 'Brain-Book',
    tagline: 'full-stack social network',
    context: 'Reboot01 · peer-audited',
    language: 'Go',
    featured: true,
    summary:
      'A social platform where people post, join groups, share photos and message each other instantly.',
    proof: ['React + Go + REST', 'WebSockets for live delivery', 'Defended in a live audit'],
    description:
      'A social platform where people post, join groups, share photos and message each other instantly. I built the React front end, the Go backend and the REST API between them, with WebSockets for live delivery and SQLite behind sign-in, notifications and privacy settings. Built and defended in a live audit at Reboot01, where the code is reviewed by peers before it passes.',
    tags: ['Go', 'React', 'WebSockets', 'REST APIs', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/Brain-Book',
    liveUrl: null,
    video: asset('/video/brain-book.mp4'),
    poster: asset('/video/posters/brain-book.webp'),
  },
  {
    id: 'detecto',
    pillars: ['ai', 'fullstack'],
    name: 'Detecto',
    tagline: 'how many people are in this frame?',
    context: 'Person detection and counting',
    language: 'Python',
    featured: true,
    summary:
      'Counts the people in an image, a video or a live webcam feed, and keeps every run for review.',
    proof: ['YOLOv8 behind FastAPI', 'Zone alerts', 'CSV + Excel export'],
    description:
      'Counts the people in an uploaded image or video, or in a live webcam feed. A YOLOv8 model behind a FastAPI service returns the count, the bounding boxes and a confidence for each detection, and every run is kept: occupancy statistics, charts, zone alerts, and CSV and Excel export, all reviewed from a React page.',
    tags: ['Python', 'FastAPI', 'YOLOv8', 'OpenCV', 'React', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/detecto',
    liveUrl: null,
    video: asset('/video/detecto.mp4'),
    poster: asset('/video/posters/detecto.webp'),
  },
  {
    id: 'localhost',
    pillars: ['cs'],
    name: 'localhost',
    tagline: 'HTTP/1.1 server from scratch',
    language: 'Rust',
    description:
      'An HTTP/1.1 server for Linux written directly on epoll, with no web framework: it parses requests, holds keep-alive connections and builds every response by hand.',
    tags: ['Rust', 'HTTP/1.1', 'epoll', 'Systems Programming'],
    githubUrl: 'https://github.com/Alasmawi/localhost',
    liveUrl: null,
    video: asset('/video/localhost.mp4'),
    poster: asset('/video/posters/localhost.webp'),
  },
  {
    id: '0-shell',
    pillars: ['cs'],
    name: '0-shell',
    tagline: 'a shell, no external binaries',
    language: 'Rust',
    description:
      'A Unix-style shell in Rust where every builtin — cd, ls, cat, cp, mv and the rest — is written from scratch instead of calling out to system binaries.',
    tags: ['Rust', 'Shell', 'Systems Programming'],
    githubUrl: 'https://github.com/Alasmawi/0-shell',
    liveUrl: null,
    video: asset('/video/0-shell.mp4'),
    poster: asset('/video/posters/0-shell.webp'),
  },
  {
    id: 'rt',
    pillars: ['cs'],
    name: 'rt',
    tagline: 'ray tracer from first principles',
    language: 'Rust',
    description:
      'A ray tracer in Rust with no dependencies. It renders spheres, cubes, planes and cylinders with shadows, reflection and lighting, and writes the result out as PPM images.',
    tags: ['Rust', 'Ray Tracing', 'Computer Graphics'],
    githubUrl: 'https://github.com/Alasmawi/rt',
    liveUrl: null,
    video: asset('/video/rt.mp4'),
    poster: asset('/video/posters/rt.webp'),
  },
  {
    id: 'smart-road',
    pillars: ['cs'],
    name: 'smart-road',
    tagline: 'intersections without traffic lights',
    language: 'Rust',
    description:
      'Autonomous cars crossing a four-way intersection with no traffic lights. Each car reserves its path through the junction ahead of time, and the scheduler keeps them from colliding under heavy traffic. Rust and SDL2.',
    tags: ['Rust', 'SDL2', 'Simulation', 'Scheduling'],
    githubUrl: 'https://github.com/Alasmawi/smart-road',
    liveUrl: null,
    video: asset('/video/smart-road.mp4'),
    poster: asset('/video/posters/smart-road.webp'),
  },
  {
    id: 'multiplayer-fps',
    pillars: ['cs', 'fullstack'],
    name: 'multiplayer-fps',
    tagline: 'networked first-person shooter',
    language: 'Rust',
    description:
      'A networked first-person shooter where an authoritative server owns the game state, and each client predicts its own movement and reconciles when the server’s answer arrives.',
    tags: ['Rust', 'Multiplayer', 'Game Dev', 'Networking'],
    githubUrl: 'https://github.com/Alasmawi/multiplayer-fps',
    liveUrl: null,
    video: asset('/video/multiplayer-fps.mp4'),
    poster: asset('/video/posters/multiplayer-fps.webp'),
  },
  {
    id: 'bomberman-dom',
    pillars: ['fullstack'],
    name: 'bomberman-dom',
    tagline: 'real-time multiplayer, no game engine',
    language: 'JavaScript',
    description:
      'Real-time multiplayer Bomberman with a WebSocket server as the single source of truth, drawn in the DOM on top of my own mini-framework — no canvas and no game engine.',
    tags: ['JavaScript', 'WebSockets', 'Game Dev'],
    githubUrl: 'https://github.com/Alasmawi/bomberman-dom',
    liveUrl: null,
    video: asset('/video/bomberman-dom.mp4'),
    poster: asset('/video/posters/bomberman-dom.webp'),
  },
  {
    id: 'mini-framework',
    pillars: ['fullstack', 'cs'],
    name: 'mini-framework',
    tagline: '"Domino" — a JS framework, from scratch',
    language: 'JavaScript',
    description:
      'Domino, a JavaScript framework with no dependencies: a virtual DOM, delegated events, a hash router and an observable store, shipped with a TodoMVC app built on it.',
    tags: ['JavaScript', 'Virtual DOM', 'Framework Design'],
    githubUrl: 'https://github.com/Alasmawi/mini-framework',
    liveUrl: null,
    video: asset('/video/mini-framework.mp4'),
    poster: asset('/video/posters/mini-framework.webp'),
  },
  {
    id: 'real-time-forum',
    pillars: ['fullstack'],
    name: 'real-time-forum',
    tagline: 'forum with live private chat',
    language: 'Go',
    description:
      'A single-page forum on Go and SQLite with threaded posts and categories, plus private messaging over WebSockets that shows who is online.',
    tags: ['Go', 'WebSockets', 'SQLite'],
    githubUrl: 'https://github.com/Alasmawi/real-time-forum',
    liveUrl: null,
    video: asset('/video/real-time-forum.mp4'),
    poster: asset('/video/posters/real-time-forum.webp'),
  },
  {
    id: 'net-cat',
    pillars: ['cs'],
    name: 'Net-Cat',
    tagline: 'TCP chat server, netcat-style',
    language: 'Go',
    description:
      'A TCP chat server in Go in the spirit of netcat: many clients at once, each with a name, and messages broadcast to the room over raw sockets.',
    tags: ['Go', 'TCP', 'Networking'],
    githubUrl: 'https://github.com/Alasmawi/Net-Cat',
    liveUrl: null,
    video: asset('/video/net-cat.mp4'),
    poster: asset('/video/posters/net-cat.webp'),
  },
  {
    id: 'groupie-tracker',
    pillars: ['fullstack'],
    name: 'groupie-tracker',
    tagline: 'REST API, visualized',
    language: 'Go',
    description:
      'A Go web app that reads the Groupie Trackers REST API and lets you browse bands, members, tour dates and concert locations through server-rendered pages.',
    tags: ['Go', 'REST APIs', 'Frontend'],
    githubUrl: 'https://github.com/Alasmawi/groupie-tracker',
    liveUrl: null,
    video: asset('/video/groupie-tracker.mp4'),
    poster: asset('/video/posters/groupie-tracker.webp'),
  },
];

export const FEATURED = PROJECTS.filter((p) => p.featured);
export const MORE = PROJECTS.filter((p) => !p.featured);
