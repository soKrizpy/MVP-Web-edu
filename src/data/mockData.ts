import { CourseModule, Tutor, LeaderboardUser, StudentAnalytics, PetStats, OneOnOneSession, PushNotification } from '../types';

export const INITIAL_PET: PetStats = {
  species: 'sparky',
  name: 'Voltrix',
  level: 3,
  exp: 280,
  expToNextLevel: 400,
  stage: 'novice',
  hunger: 75,
  happiness: 85,
  attack: 38,
  defense: 32,
  seasonalTheme: 'spring_sakura',
  battlesWon: 5,
  battlesLost: 1,
  snacks: {
    wisdomApples: 4,
    brainBerries: 6,
    codingCookies: 3,
  },
};

export const INITIAL_MODULES: CourseModule[] = [
  {
    id: 'mod-1',
    title: 'Modern TypeScript & Frontend Engineering',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Master core TypeScript patterns, React reactive state flows, and clean component architecture.',
    bannerColor: 'from-blue-600 to-indigo-700',
    progressPercent: 66,
    certificateEligible: true,
    certificateEarned: false,
    topics: [
      {
        id: 'top-1-1',
        moduleId: 'mod-1',
        title: 'Type Inference & Strict Interfaces',
        description: 'Understand how compiler inference works and construct unbreakable interfaces.',
        iconName: 'ShieldCheck',
        expReward: 120,
        estimatedMinutes: 8,
        isCompleted: true,
        isUnlocked: true,
        stars: 3,
        score: 100,
        quizzes: [
          {
            id: 'q-1-1-1',
            type: 'multiple_choice',
            question: 'Which TypeScript keyword is best suited for defining the shape of an object that can be extended via declaration merging?',
            options: ['type', 'interface', 'namespace', 'class'],
            correctAnswer: 'interface',
            explanation: 'Interfaces in TypeScript support declaration merging and are optimal for object contracts that might be extended.',
            hint: 'Think about open vs closed contracts.'
          },
          {
            id: 'q-1-1-2',
            type: 'bug_hunt',
            question: 'Find the compiler bug in this type assignment:',
            codeSnippet: 'let count: number = "42";',
            options: [
              'String assigned to number type',
              'Missing const keyword',
              'Semicolon syntax error',
              'count is a reserved global variable'
            ],
            correctAnswer: 'String assigned to number type',
            explanation: 'You cannot assign a string literal "42" to a variable declared with type number.',
          },
          {
            id: 'q-1-1-3',
            type: 'fill_blank',
            question: 'To allow a property to be optional on an interface, which symbol is placed immediately after the property name?',
            options: ['?', '!', '*', '#'],
            correctAnswer: '?',
            explanation: 'The question mark ? denotes an optional property in TypeScript interfaces.',
            hint: 'It asks a question about existence.'
          },
          {
            id: 'q-1-1-4',
            type: 'true_false',
            question: 'The `unknown` type is safer than the `any` type because it forces type checking before performing operations.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Unlike `any`, TypeScript prevents you from calling methods on an `unknown` value without type narrowing.',
          },
          {
            id: 'q-1-1-5',
            type: 'code_match',
            question: 'What is the utility type that constructs a type with all properties of T set to optional?',
            options: ['Partial<T>', 'Required<T>', 'Readonly<T>', 'Pick<T>'],
            correctAnswer: 'Partial<T>',
            explanation: '`Partial<T>` makes all fields in T optional.',
          }
        ]
      },
      {
        id: 'top-1-2',
        moduleId: 'mod-1',
        title: 'React 19 State & Memory Hooks',
        description: 'Harness useState, useMemo, and useCallback to eliminate redundant rendering loops.',
        iconName: 'Cpu',
        expReward: 150,
        estimatedMinutes: 10,
        isCompleted: true,
        isUnlocked: true,
        stars: 3,
        score: 95,
        quizzes: [
          {
            id: 'q-1-2-1',
            type: 'multiple_choice',
            question: 'When does a React component re-render when using `useState`?',
            options: [
              'Whenever the setter is called with a new distinct state value',
              'Every 500 milliseconds automatically',
              'Only when the browser window is resized',
              'Only on initial mount'
            ],
            correctAnswer: 'Whenever the setter is called with a new distinct state value',
            explanation: 'React compares state values using Object.is and triggers a re-render if the value has changed.',
          },
          {
            id: 'q-1-2-2',
            type: 'fill_blank',
            question: 'Which hook returns a memoized version of a callback that only changes if dependencies change?',
            options: ['useCallback', 'useMemo', 'useRef', 'useEffect'],
            correctAnswer: 'useCallback',
            explanation: 'useCallback preserves function reference stability between re-renders.',
          },
          {
            id: 'q-1-2-3',
            type: 'bug_hunt',
            question: 'Why does this code cause an infinite render loop?',
            codeSnippet: 'useEffect(() => {\n  setCount(count + 1);\n}, [count]);',
            options: [
              'Updating state inside an effect that lists that state as dependency causes re-triggering forever',
              'count is not declared with let',
              'useEffect requires an async keyword',
              'setCount is a deprecated method'
            ],
            correctAnswer: 'Updating state inside an effect that lists that state as dependency causes re-triggering forever',
            explanation: 'Updating count triggers the effect, which updates count again, forming an infinite loop.',
          },
          {
            id: 'q-1-2-4',
            type: 'true_false',
            question: 'Refs created with `useRef` cause the component to re-render whenever their `.current` value is mutated.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: 'Mutating `.current` does NOT trigger a re-render in React.',
          },
          {
            id: 'q-1-2-5',
            type: 'multiple_choice',
            question: 'What is the primary purpose of keys in React lists?',
            options: [
              'To help React identify which items have changed, been added, or been removed',
              'To sort elements alphabetically by default',
              'To encrypt data inside the DOM tree',
              'To register keyboard click event listeners'
            ],
            correctAnswer: 'To help React identify which items have changed, been added, or been removed',
            explanation: 'Keys give list items stable identities for reconciliation.',
          }
        ]
      },
      {
        id: 'top-1-3',
        moduleId: 'mod-1',
        title: 'Asynchronous Flows & Web Workers',
        description: 'Handle promises, parallel execution, and offload CPU-heavy tasks without blocking UI.',
        iconName: 'Zap',
        expReward: 180,
        estimatedMinutes: 12,
        isCompleted: false,
        isUnlocked: true,
        stars: 0,
        quizzes: [
          {
            id: 'q-1-3-1',
            type: 'multiple_choice',
            question: 'What happens when `Promise.all()` encounters a single rejected promise among many?',
            options: [
              'It immediately rejects with the reason of the first rejected promise',
              'It ignores the error and returns all resolved values',
              'It retries the rejected promise 3 times',
              'It waits for all others to finish before failing quietly'
            ],
            correctAnswer: 'It immediately rejects with the reason of the first rejected promise',
            explanation: 'Promise.all is fail-fast: if any promise rejects, the returned promise immediately rejects.',
          },
          {
            id: 'q-1-3-2',
            type: 'code_match',
            question: 'Which method returns a promise that resolves after ALL given promises have either settled with status or rejected?',
            options: ['Promise.allSettled()', 'Promise.race()', 'Promise.any()', 'Promise.resolve()'],
            correctAnswer: 'Promise.allSettled()',
            explanation: 'Promise.allSettled() waits for every promise to finish regardless of success or failure.',
          },
          {
            id: 'q-1-3-3',
            type: 'fill_blank',
            question: 'What JavaScript keyword pauses the execution of an async function until a Promise settles?',
            options: ['await', 'yield', 'pause', 'defer'],
            correctAnswer: 'await',
            explanation: 'The await keyword pauses async function execution until the promise settles.',
          },
          {
            id: 'q-1-3-4',
            type: 'true_false',
            question: 'Web Workers run scripts in background threads completely isolated from the main UI thread.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'Web Workers do not have access to the direct DOM and run on separate operating system threads.',
          },
          {
            id: 'q-1-3-5',
            type: 'bug_hunt',
            question: 'Identify the error in handling an async error in this code:',
            codeSnippet: 'async function fetchUser() {\n  const res = await fetch("/api/user");\n  return res.json();\n}',
            options: [
              'Missing try/catch block or HTTP status check (res.ok)',
              'async functions cannot return a Promise directly',
              'fetch is only available in Node.js',
              'res.json() is a synchronous string operation'
            ],
            correctAnswer: 'Missing try/catch block or HTTP status check (res.ok)',
            explanation: 'Fetch does not reject on 404/500 errors; you need to check res.ok or wrap in try/catch.',
          }
        ]
      }
    ],
    assessment: {
      id: 'assess-1',
      title: 'Frontend Engineering Capstone Assessment',
      description: 'Comprehensive 10-question timed exam testing TypeScript strictness, React state optimization, and async web performance. Score 80%+ to unlock your verified Certificate.',
      passingScore: 80,
      timeLimitMinutes: 15,
      isUnlocked: false,
      isPassed: false,
      questions: [
        {
          id: 'aq-1',
          type: 'multiple_choice',
          question: 'What is the return type of a TypeScript function that enters an infinite loop or throws an error?',
          options: ['never', 'void', 'undefined', 'null'],
          correctAnswer: 'never',
          explanation: 'Functions that never return a normal value have the `never` return type.',
        },
        {
          id: 'aq-2',
          type: 'multiple_choice',
          question: 'In React reconciliation, why should array indexes generally NOT be used as keys?',
          options: [
            'Reordering or inserting items causes key collisions and unexpected state corruption in child components',
            'React throws a runtime fatal crash if it sees numerical keys',
            'Indexes slow down HTTP request speeds',
            'Indexes are not valid JSON attributes'
          ],
          correctAnswer: 'Reordering or inserting items causes key collisions and unexpected state corruption in child components',
          explanation: 'Using index keys breaks element identity when list ordering changes.',
        },
        {
          id: 'aq-3',
          type: 'multiple_choice',
          question: 'What is the main benefit of TypeScript discriminated unions?',
          options: [
            'A common literal property allows TypeScript to narrow down the exact variant safely inside switch/if checks',
            'It automatically compresses CSS stylesheets',
            'It converts SQL databases into NoSQL collections',
            'It enables multi-threading in JavaScript engines'
          ],
          correctAnswer: 'A common literal property allows TypeScript to narrow down the exact variant safely inside switch/if checks',
          explanation: 'Discriminated unions provide complete type safety across polymorphic data.',
        },
        {
          id: 'aq-4',
          type: 'true_false',
          question: '`Object.freeze()` in JavaScript deeply freezes nested objects by default without recursion.',
          options: ['True', 'False'],
          correctAnswer: 'False',
          explanation: 'Object.freeze() is shallow only. Nested objects remain mutable unless deep-frozen.',
        },
        {
          id: 'aq-5',
          type: 'multiple_choice',
          question: 'Which HTTP status code signifies that a resource was successfully created on the server?',
          options: ['201 Created', '200 OK', '204 No Content', '304 Not Modified'],
          correctAnswer: '201 Created',
          explanation: 'HTTP 201 indicates a successful POST request creating a new entity.',
        }
      ]
    }
  },
  {
    id: 'mod-2',
    title: 'Full-Stack Node.js & Real-Time APIs',
    category: 'Backend & Systems',
    level: 'Intermediate',
    description: 'Build high-throughput Express services, WebSocket channels, and resilient distributed data flows.',
    bannerColor: 'from-emerald-600 to-teal-700',
    progressPercent: 0,
    certificateEligible: true,
    certificateEarned: false,
    topics: [
      {
        id: 'top-2-1',
        moduleId: 'mod-2',
        title: 'Event-Driven Architecture & Streams',
        description: 'Harness Node.js EventEmitter and Backpressure handling for gigabyte-scale data pipelines.',
        iconName: 'Server',
        expReward: 160,
        estimatedMinutes: 10,
        isCompleted: false,
        isUnlocked: false,
        stars: 0,
        quizzes: [
          {
            id: 'q-2-1-1',
            type: 'multiple_choice',
            question: 'What happens when a writable stream returns false from `.write(chunk)`?',
            options: [
              'The internal buffer is full and the producer should pause until the "drain" event fires',
              'The file on disk has been corrupted',
              'The stream has crashed and must be restarted',
              'The process exits with code 1'
            ],
            correctAnswer: 'The internal buffer is full and the producer should pause until the "drain" event fires',
            explanation: 'Returning false indicates backpressure is active.',
          },
          {
            id: 'q-2-1-2',
            type: 'fill_blank',
            question: 'What built-in Node.js module provides the EventEmitter class?',
            options: ['events', 'stream', 'http', 'util'],
            correctAnswer: 'events',
            explanation: 'EventEmitter is imported from the core "events" module.',
          },
          {
            id: 'q-2-1-3',
            type: 'true_false',
            question: 'Node.js is completely single-threaded and has zero background threads under any circumstance.',
            options: ['True', 'False'],
            correctAnswer: 'False',
            explanation: 'Node.js utilizes libuv threadpool (default 4 threads) for crypto, fs, and dns lookups.',
          },
          {
            id: 'q-2-1-4',
            type: 'bug_hunt',
            question: 'Spot the security vulnerability in this Express middleware:',
            codeSnippet: 'app.get("/file", (req, res) => {\n  res.sendFile("/uploads/" + req.query.filename);\n});',
            options: [
              'Directory Path Traversal vulnerability (e.g. filename=../../etc/passwd)',
              'Missing HTTP 404 response header',
              'res.sendFile only supports image formats',
              'Query parameter must be capitalized'
            ],
            correctAnswer: 'Directory Path Traversal vulnerability (e.g. filename=../../etc/passwd)',
            explanation: 'Unsanitized user input concatenated to file paths allows attackers to escape directory roots.',
          },
          {
            id: 'q-2-1-5',
            type: 'multiple_choice',
            question: 'Which method on process stops the Node process immediately with a given exit code?',
            options: ['process.exit(code)', 'process.terminate()', 'process.kill(0)', 'process.abort()'],
            correctAnswer: 'process.exit(code)',
            explanation: 'process.exit() causes the process to end synchronously.',
          }
        ]
      },
      {
        id: 'top-2-2',
        moduleId: 'mod-2',
        title: 'Real-Time WebSockets & Rooms',
        description: 'Bi-directional socket connections, heartbeat pings, and cluster synchronization.',
        iconName: 'Radio',
        expReward: 190,
        estimatedMinutes: 12,
        isCompleted: false,
        isUnlocked: false,
        stars: 0,
        quizzes: [
          {
            id: 'q-2-2-1',
            type: 'multiple_choice',
            question: 'What initial HTTP status code indicates a successful WebSocket protocol upgrade handshake?',
            options: ['101 Switching Protocols', '200 OK', '204 No Content', '301 Moved Permanently'],
            correctAnswer: '101 Switching Protocols',
            explanation: 'The server responds with HTTP 101 to transition the connection from HTTP to WS.',
          },
          {
            id: 'q-2-2-2',
            type: 'true_false',
            question: 'WebSocket connections are stateful and keep a persistent TCP connection open between client and server.',
            options: ['True', 'False'],
            correctAnswer: 'True',
            explanation: 'WebSockets maintain a long-lived full-duplex TCP connection.',
          },
          {
            id: 'q-2-2-3',
            type: 'fill_blank',
            question: 'What is the standard WebSocket protocol URI scheme used for secure TLS-encrypted sockets?',
            options: ['wss://', 'https://', 'ws://', 'ssl://'],
            correctAnswer: 'wss://',
            explanation: 'wss:// is the encrypted WebSocket protocol prefix.',
          },
          {
            id: 'q-2-2-4',
            type: 'bug_hunt',
            question: 'Why do serverless functions without stateful adaptors struggle with raw WebSockets?',
            options: [
              'Serverless instances spin down after executing, severing long-lived TCP socket connections',
              'Serverless only allows UDP protocol',
              'WebSockets consume too much RAM for any cloud provider',
              'Serverless functions do not support JSON parsing'
            ],
            correctAnswer: 'Serverless instances spin down after executing, severing long-lived TCP socket connections',
            explanation: 'Ephemeral serverless containers cannot sustain persistent open connections without a gateway.',
          },
          {
            id: 'q-2-2-5',
            type: 'multiple_choice',
            question: 'Which mechanism is best used to keep idle WebSocket connections alive through firewalls and NAT routers?',
            options: ['Periodic Ping / Pong heartbeat frames', 'Sending 10MB dummy packets', 'Re-handshaking every 3 seconds', 'Opening multiple browser tabs'],
            correctAnswer: 'Periodic Ping / Pong heartbeat frames',
            explanation: 'Standard ping/pong frames prevent routers from terminating idle connections.',
          }
        ]
      }
    ],
    assessment: {
      id: 'assess-2',
      title: 'Backend Systems & Real-Time Capstone',
      description: 'Test your grasp on Node.js stream pipelining, backpressure, secure session auth, and socket lifecycle management.',
      passingScore: 80,
      timeLimitMinutes: 20,
      isUnlocked: false,
      isPassed: false,
      questions: [
        {
          id: 'aq-2-1',
          type: 'multiple_choice',
          question: 'What is the main danger of blocking the Node.js event loop with CPU-intensive synchronous calculations?',
          options: [
            'All incoming HTTP requests and I/O callbacks freeze until the synchronous work completes',
            'Memory automatically doubles every second',
            'The operating system kernel crashes',
            'Hard disk storage is deleted'
          ],
          correctAnswer: 'All incoming HTTP requests and I/O callbacks freeze until the synchronous work completes',
          explanation: 'Node’s event loop runs on a single thread; blocking it halts all server responsiveness.',
        },
        {
          id: 'aq-2-2',
          type: 'multiple_choice',
          question: 'Which header prevents clickjacking attacks by dictating whether a browser should render a page in an iframe?',
          options: ['X-Frame-Options', 'X-XSS-Protection', 'Content-Type', 'Access-Control-Allow-Origin'],
          correctAnswer: 'X-Frame-Options',
          explanation: 'X-Frame-Options: DENY or SAMEORIGIN protects sites from iframe clickjacking.',
        }
      ]
    }
  }
];

export const MOCK_TUTORS: Tutor[] = [
  {
    id: 'tut-1',
    name: 'Dr. Sarah Jenkins',
    title: 'Staff Frontend Architect & Ex-Google Lead',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    rating: 4.98,
    reviewCount: 142,
    hourlyRate: 65,
    specialties: ['React 19', 'TypeScript', 'Performance Optimization', 'System Design'],
    bio: 'Over 12 years building hyperscale web applications. Specializing in diagnosing re-rendering bottlenecks, state machines, and preparing engineers for senior tech screens.',
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timeSlots: ['10:00 AM', '02:00 PM', '04:30 PM', '07:00 PM'],
    totalSessionsCompleted: 384
  },
  {
    id: 'tut-2',
    name: 'Marcus Vance',
    title: 'Senior Distributed Systems & AI Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    rating: 4.94,
    reviewCount: 98,
    hourlyRate: 75,
    specialties: ['Node.js', 'LLM Agents', 'WebSockets', 'PostgreSQL'],
    bio: 'Passionate educator and open-source contributor. I help developers bridge the gap between building toy prototypes and resilient production architectures.',
    availableDays: ['Tue', 'Thu', 'Sat', 'Sun'],
    timeSlots: ['09:00 AM', '11:30 AM', '03:00 PM', '06:00 PM'],
    totalSessionsCompleted: 215
  },
  {
    id: 'tut-3',
    name: 'Elena Rostova',
    title: 'Algorithms Specialist & Competitive Programmer',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    rating: 4.96,
    reviewCount: 110,
    hourlyRate: 55,
    specialties: ['Data Structures', 'Dynamic Programming', 'Graph Theory', 'Python'],
    bio: 'Former International Collegiate Programming Contest medalist. I make abstract computational logic intuitive, visual, and genuinely enjoyable.',
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    timeSlots: ['01:00 PM', '03:30 PM', '05:00 PM', '08:00 PM'],
    totalSessionsCompleted: 290
  }
];

export const MOCK_SESSIONS: OneOnOneSession[] = [
  {
    id: 'sess-101',
    tutorId: 'tut-1',
    tutorName: 'Dr. Sarah Jenkins',
    tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    tutorTitle: 'Staff Frontend Architect',
    studentName: 'Alex Chen',
    date: 'Today',
    time: '04:30 PM',
    status: 'upcoming',
    hourlyRate: 65,
    paidAmount: 65,
    paymentMethod: 'Visa •••• 4242',
    transactionId: 'TXN-984210',
    topicTitle: 'React Concurrent Mode & Memory Profiling Lab',
    meetingNotes: 'We will inspect Chrome DevTools heap snapshots and fix re-render spikes in the virtualized feed.',
  },
  {
    id: 'sess-102',
    tutorId: 'tut-2',
    tutorName: 'Marcus Vance',
    tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    tutorTitle: 'Senior Systems Engineer',
    studentName: 'Alex Chen',
    date: 'Sep 10, 2026',
    time: '11:30 AM',
    status: 'upcoming',
    hourlyRate: 75,
    paidAmount: 75,
    paymentMethod: 'Apple Pay',
    transactionId: 'TXN-883192',
    topicTitle: 'Building Resilient Real-Time WebSocket Clusters',
  }
];

export const MOCK_LEADERBOARD: LeaderboardUser[] = [
  {
    id: 'user-lb-1',
    name: 'Kaito Tanaka',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
    xp: 3420,
    streakDays: 24,
    petSpecies: 'chrono',
    petLevel: 8,
    petStage: 'mythic',
    petName: 'Chronos-9',
    powerRating: 88,
    tier: 'Diamond'
  },
  {
    id: 'user-lb-2',
    name: 'Sofia Gomez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    xp: 2950,
    streakDays: 19,
    petSpecies: 'lumina',
    petLevel: 7,
    petStage: 'adept',
    petName: 'AstralFox',
    powerRating: 76,
    tier: 'Platinum'
  },
  {
    id: 'user-lb-current',
    name: 'Alex Chen (You)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    isCurrentUser: true,
    xp: 1850,
    streakDays: 12,
    petSpecies: 'sparky',
    petLevel: 3,
    petStage: 'novice',
    petName: 'Voltrix',
    powerRating: 54,
    tier: 'Gold'
  },
  {
    id: 'user-lb-4',
    name: 'Lian Zhou',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    xp: 1620,
    streakDays: 10,
    petSpecies: 'sparky',
    petLevel: 3,
    petStage: 'novice',
    petName: 'ThunderClaw',
    powerRating: 49,
    tier: 'Gold'
  },
  {
    id: 'user-lb-5',
    name: 'Emma Watson-Lee',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
    xp: 1390,
    streakDays: 7,
    petSpecies: 'lumina',
    petLevel: 2,
    petStage: 'baby',
    petName: 'Moonbeam',
    powerRating: 42,
    tier: 'Silver'
  },
  {
    id: 'user-lb-6',
    name: 'Tariq Al-Mansoor',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    xp: 1120,
    streakDays: 5,
    petSpecies: 'chrono',
    petLevel: 2,
    petStage: 'baby',
    petName: 'CyberOwl',
    powerRating: 38,
    tier: 'Silver'
  }
];

export const MOCK_STUDENT_ANALYTICS: StudentAnalytics[] = [
  {
    studentId: 'stu-1',
    name: 'Alex Chen',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    email: 'alex.chen@learn.edu',
    topicsCompleted: 2,
    totalQuizzesTaken: 10,
    accuracyRate: 94,
    studyStreakDays: 12,
    totalExp: 1850,
    petLevel: 3,
    lastActive: '12 mins ago',
    weakTopics: ['Asynchronous Event Loops'],
    assessmentScore: 92
  },
  {
    studentId: 'stu-2',
    name: 'Maya Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    email: 'maya.p@academics.org',
    topicsCompleted: 4,
    totalQuizzesTaken: 20,
    accuracyRate: 88,
    studyStreakDays: 15,
    totalExp: 2450,
    petLevel: 5,
    lastActive: '2 hours ago',
    weakTopics: ['TypeScript Discriminated Unions'],
    assessmentScore: 86
  },
  {
    studentId: 'stu-3',
    name: 'David Kim',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    email: 'david.k@codelab.io',
    topicsCompleted: 1,
    totalQuizzesTaken: 5,
    accuracyRate: 72,
    studyStreakDays: 3,
    totalExp: 620,
    petLevel: 2,
    lastActive: '1 day ago',
    weakTopics: ['React useMemo & Memory Leaks', 'State Mutation'],
  },
  {
    studentId: 'stu-4',
    name: 'Chloe Tremblay',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    email: 'chloe.t@devstudy.net',
    topicsCompleted: 3,
    totalQuizzesTaken: 15,
    accuracyRate: 96,
    studyStreakDays: 21,
    totalExp: 2900,
    petLevel: 6,
    lastActive: '3 hours ago',
    weakTopics: [],
    assessmentScore: 98
  }
];

export const INITIAL_NOTIFICATIONS: PushNotification[] = [
  {
    id: 'notif-1',
    title: '1-on-1 Session in 15 Minutes!',
    message: 'Your meeting with Dr. Sarah Jenkins on React Concurrent Mode is starting soon.',
    timestamp: 'Just now',
    type: 'session',
    read: false,
    actionUrl: 'video'
  },
  {
    id: 'notif-2',
    title: 'Voltrix is feeling hungry!',
    message: 'Complete today’s quiz to earn a Wisdom Snack and keep your pet strong for battles.',
    timestamp: '1 hour ago',
    type: 'pet',
    read: false,
    actionUrl: 'pet'
  },
  {
    id: 'notif-3',
    title: '🔥 12-Day Streak Milestone Reached!',
    message: 'You unlocked the Spring Sakura pet aura and gained +100 bonus EXP.',
    timestamp: 'Yesterday',
    type: 'streak',
    read: true,
  }
];
