import { Skill, Project, ExperienceItem, DatasetOption } from '../types';

export const PERSONAL_INFO = {
  name: 'Maruti P Ghorpade',
  title: 'Full Stack Developer & Data Analyst',
  tagline: 'Architecting scalable web systems & turning complex data into predictive intelligence.',
  bio: 'Passionate software engineer and data analyst with extensive experience building high-performance full-stack web applications, interactive 3D WebGL visualizations, and end-to-end data analytics pipelines. Specialized in combining modern frontend frameworks, cloud backend microservices, and advanced machine learning models to build data-driven digital products.',
  email: 'm.p.ghorpade2006@gmail.com',
  github: 'https://github.com',
  linkedin: 'https://linkedin.com',
  location: 'Karnataka, India',
  availability: 'Available for Select Projects & Roles',
  stats: [
    { label: 'Years Experience', value: '4+' },
    { label: 'Full Stack Apps Built', value: '25+' },
    { label: 'Data Points Analyzed', value: '15M+' },
    { label: 'System Uptime Rate', value: '99.9%' }
  ]
};

export const SKILLS_DATA: Skill[] = [
  // Full Stack Skills
  { name: 'React / Next.js', category: 'fullstack', level: 96, iconName: 'Code', description: 'Server Components, Hooks, State Management, Custom Renderers', yearsOfExp: 4 },
  { name: 'TypeScript', category: 'fullstack', level: 94, iconName: 'FileCode', description: 'Type-safe architectures, Generics, AST parsing', yearsOfExp: 4 },
  { name: 'Node.js / Express', category: 'fullstack', level: 92, iconName: 'Server', description: 'REST APIs, WebSockets, Middleware, Async queues', yearsOfExp: 4 },
  { name: 'Python / Django / FastAPI', category: 'fullstack', level: 90, iconName: 'Cpu', description: 'Backend APIs, Microservices, Asynchronous processing', yearsOfExp: 3 },
  { name: 'Three.js / WebGL', category: 'fullstack', level: 88, iconName: 'Box', description: '3D Shader Shading, Mesh Deformation, Camera Animations', yearsOfExp: 2 },
  { name: 'Tailwind CSS / Motion', category: 'fullstack', level: 95, iconName: 'Palette', description: 'Responsive layouts, Design Tokens, Micro-interactions', yearsOfExp: 4 },

  // Data Analyst Skills
  { name: 'Python (Pandas & NumPy)', category: 'data', level: 95, iconName: 'BarChart2', description: 'Data Wrangling, Aggregations, Vectorized Operations', yearsOfExp: 4 },
  { name: 'SQL & Query Optimization', category: 'data', level: 94, iconName: 'Database', description: 'Complex Joins, Window Functions, Query Execution Plans', yearsOfExp: 4 },
  { name: 'Tableau & Power BI', category: 'data', level: 89, iconName: 'PieChart', description: 'Interactive Dashboards, DAX, Custom Calculated Fields', yearsOfExp: 3 },
  { name: 'Predictive Analytics & Scikit-learn', category: 'data', level: 86, iconName: 'TrendingUp', description: 'Regression, Classification, Clustering, Model Evaluation', yearsOfExp: 3 },
  { name: 'Data Visualization (D3.js / Recharts)', category: 'data', level: 92, iconName: 'Activity', description: 'Custom dynamic SVG/Canvas visual charts & telemetry', yearsOfExp: 3 },

  // Database & Storage
  { name: 'PostgreSQL / MySQL', category: 'database', level: 93, iconName: 'Database', description: 'Relational Schema Design, Indexing, Transactions', yearsOfExp: 4 },
  { name: 'MongoDB / Redis', category: 'database', level: 88, iconName: 'Layers', description: 'Document stores, Pub/Sub, Memory Caching', yearsOfExp: 3 },
  { name: 'Firebase / Firestore', category: 'database', level: 90, iconName: 'Zap', description: 'Real-time synchronization, Security Rules, Cloud Functions', yearsOfExp: 3 },

  // Cloud & DevOps
  { name: 'Docker / Containerization', category: 'cloud', level: 87, iconName: 'Container', description: 'Multi-stage builds, Docker Compose, Microservice orchestration', yearsOfExp: 3 },
  { name: 'Git & GitHub Actions CI/CD', category: 'cloud', level: 92, iconName: 'GitBranch', description: 'Automated testing, Build pipelines, Deployment targets', yearsOfExp: 4 },
  { name: 'Google Cloud & Cloud Run', category: 'cloud', level: 85, iconName: 'Cloud', description: 'Serverless deployments, IAM, Storage buckets', yearsOfExp: 3 }
];

export const PROJECTS_DATA: Project[] = [
  {
    id: 'aura-analytics',
    title: 'AuraAnalytics 3D',
    tagline: 'Real-Time 3D Data Telemetry & Predictive Analytics Platform',
    category: 'data',
    tags: ['React', 'Three.js', 'Python', 'FastAPI', 'Pandas', 'WebSocket'],
    description: 'An interactive WebGL-powered data analytics platform that processes live streaming data streams, visualizes high-dimensional metrics in 3D, and computes predictive anomaly trends.',
    architecture: ['Frontend: React + WebGL Canvas', 'Backend: FastAPI Python WebSockets', 'ML Core: Isolation Forest & Prophet', 'Storage: PostgreSQL + TimescaleDB'],
    metrics: [
      { label: 'Data Points Streamed', value: '100k/sec' },
      { label: 'Render Frame Rate', value: '60 FPS' },
      { label: 'Anomaly Detection Accuracy', value: '98.4%' }
    ],
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    fullDetails: {
      problem: 'Traditional 2D charts failed to render multivariate server telemetry and user behavior clusters simultaneously without overwhelming system monitoring teams.',
      solution: 'Developed a custom WebGL 3D spatial visualizer with real-time WebSockets streaming. Integrated Python ML pipelines for automated anomaly scoring and forecast trajectories.',
      keyFeatures: [
        '3D Point Cloud and Topology Mesh Rendering of Multi-Dimensional Datasets',
        'Real-time WebSocket Data Ingestion Pipeline with Auto-reconnection',
        'Custom Statistical Filters (Moving Averages, Z-Score Anomaly Highlights)',
        'Interactive Hover Telemetry HUD and Dynamic Color Mapping'
      ],
      techStackDetails: [
        { name: 'Three.js / WebGL', role: 'Interactive 3D viewport & custom shaders' },
        { name: 'Python Pandas & Scikit-learn', role: 'Real-time statistical calculations & ML anomaly scoring' },
        { name: 'FastAPI', role: 'High-speed async API & WebSocket endpoint' }
      ],
      sampleDataSnippet: `// Sample Anomaly Stream Response
{
  "timestamp": "2026-07-22T01:30:00Z",
  "dataPointCount": 14200,
  "predictedTraffic": 8450,
  "actualTraffic": 12900,
  "anomalyScore": 0.89,
  "status": "CRITICAL_SPIKE_DETECTED"
}`
    }
  },
  {
    id: 'omniflow-erp',
    title: 'OmniFlow Cloud ERP',
    tagline: 'High-Throughput Enterprise Resource Management Portal',
    category: 'fullstack',
    tags: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'PostgreSQL', 'Redis'],
    description: 'A full-stack enterprise web application delivering real-time inventory tracking, role-based access control, multi-tenant billing, and automated audit logging.',
    architecture: ['Frontend: Next.js + Tailwind CSS', 'API: Express REST + Redis Caching', 'Database: PostgreSQL + Prisma ORM', 'Auth: JWT + Role-based Policy'],
    metrics: [
      { label: 'API Response Time', value: '<25ms' },
      { label: 'Database Transactions', value: '5M+/day' },
      { label: 'Active Tenants', value: '45+' }
    ],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    fullDetails: {
      problem: 'Legacy ERP software suffered from slow page loads, fragmented databases, and unresponsive mobile interfaces, causing operational bottlenecks.',
      solution: 'Architected a modular full-stack web system with Redis caching, optimistic UI updates, and an intuitive responsive dashboard.',
      keyFeatures: [
        'Multi-tenant Schema Architecture with Isolated Data Scopes',
        'Redis Cache Layer reducing DB load by 70%',
        'Automated PDF invoice generation and export engine',
        'Comprehensive activity audit trail and granular permission management'
      ],
      techStackDetails: [
        { name: 'React & TypeScript', role: 'Type-safe UI with optimistic updates' },
        { name: 'Node.js Express', role: 'Scalable REST API with rate limiting' },
        { name: 'PostgreSQL', role: 'Relational data store with relational integrity constraints' }
      ]
    }
  },
  {
    id: 'neural-insight',
    title: 'NeuralInsight Churn Predictor',
    tagline: 'Automated ML Customer Retention & Behavioral Analytics Platform',
    category: 'ai',
    tags: ['Python', 'Scikit-learn', 'React', 'FastAPI', 'Tailwind', 'Seaborn'],
    description: 'End-to-end data analytics & Machine Learning suite designed to analyze customer engagement logs, calculate churn likelihood, and suggest targeted retention offers.',
    architecture: ['Data Ingestion: Python ETL', 'ML Model: XGBoost + Random Forest Ensemble', 'API Layer: FastAPI', 'Dashboard: React + Recharts'],
    metrics: [
      { label: 'Model ROC-AUC', value: '0.92' },
      { label: 'Retention Rate Gain', value: '+18%' },
      { label: 'Inference Latency', value: '12ms' }
    ],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: true,
    fullDetails: {
      problem: 'E-commerce businesses were losing subscription users without early warning signals or actionable segmentation.',
      solution: 'Built an ML-driven data analytics dashboard that evaluates user session frequency, support ticket volume, and spending decay to predict churn risks.',
      keyFeatures: [
        'Automated Feature Engineering Pipeline on User Logs',
        'SHAP (SHapley Additive exPlanations) Model Explainability Charts',
        'Exportable Executive Summary Reports in CSV and PDF formats',
        'Interactive Cohort Matrix and Retention Heatmaps'
      ],
      techStackDetails: [
        { name: 'Python / Scikit-learn', role: 'Machine learning model training & cross-validation' },
        { name: 'React & Recharts', role: 'Interactive charting & cohort visualizers' }
      ]
    }
  },
  {
    id: 'nexus-3d-commerce',
    title: 'Nexus3D WebGL Commerce',
    tagline: 'Immersive 3D Product Customizer & High-Performance E-Store',
    category: 'webgl',
    tags: ['Three.js', 'React', 'Tailwind CSS', 'Motion', 'Stripe'],
    description: 'A cutting-edge 3D shopping experience featuring interactive liquid metal materials, real-time lighting adjustments, 360-degree rotation, and instant checkout integration.',
    architecture: ['3D Engine: Three.js WebGL', 'State Engine: React Context + Zustand', 'UI Layer: Tailwind CSS + Motion'],
    metrics: [
      { label: 'Conversion Increase', value: '+34%' },
      { label: 'Load Time', value: '0.9s' },
      { label: 'Interactive Engagement', value: '4.2m avg' }
    ],
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
    fullDetails: {
      problem: 'Flat 2D product photos provided insufficient detail for high-end customizable products.',
      solution: 'Created an ultra-smooth 3D WebGL stage allowing users to swap materials, tweak lighting, and inspect product details from any angle.',
      keyFeatures: [
        'Realistic Metallic and Glass Shader Materials',
        'Dynamic Camera Transitions and Depth of Field controls',
        'Mobile-Optimized Touch Orbit Controls'
      ],
      techStackDetails: [
        { name: 'Three.js', role: 'Custom 3D Scene setup and GLTF model loaders' }
      ]
    }
  },
  {
    id: 'devpulse-telemetry',
    title: 'DevPulse Microservices Telemetry',
    tagline: 'Distributed Health Monitoring & Log Aggregation Engine',
    category: 'fullstack',
    tags: ['Node.js', 'Docker', 'React', 'D3.js', 'PostgreSQL', 'Express'],
    description: 'Full-stack infrastructure telemetry tool monitoring container CPU utilization, HTTP latency percentiles ($p50, p95, p99$), and error rates.',
    architecture: ['Agent: Light Node.js Collector', 'Backend: Express Aggregator', 'Visuals: D3.js + SVG'],
    metrics: [
      { label: 'Nodes Monitored', value: '120+' },
      { label: 'Event Ingestion Rate', value: '50k/min' },
      { label: 'Alert Trigger Speed', value: '<500ms' }
    ],
    image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
    fullDetails: {
      problem: 'DevOps engineers lacked a lightweight, zero-overhead telemetry dashboard for tracking container latency spikes.',
      solution: 'Designed a custom lightweight Node.js event collector with D3.js real-time charts.',
      keyFeatures: [
        'Percentile Latency Calculations (P50, P90, P99)',
        'Custom Webhook Alerting Rules for Slack & Email',
        'Log Search & Regex Filter Console'
      ],
      techStackDetails: [
        { name: 'D3.js', role: 'High-density chart rendering' },
        { name: 'Express API', role: 'High concurrency REST ingest endpoint' }
      ]
    }
  },
  {
    id: 'quant-data-trader',
    title: 'QuantData Risk Simulator',
    tagline: 'Monte Carlo Portfolio Risk & Backtesting Analytics Workstation',
    category: 'data',
    tags: ['Python', 'NumPy', 'Pandas', 'React', 'Recharts', 'FastAPI'],
    description: 'Financial quantitative analytics platform executing 10,000+ Monte Carlo simulations to model asset volatility, Value-at-Risk (VaR), and Sharpe ratio optimization.',
    architecture: ['Engine: Python Vectorized NumPy Calculations', 'API: FastAPI', 'UI: React Dashboard'],
    metrics: [
      { label: 'Simulations Executed', value: '10,000 / sec' },
      { label: 'Value-at-Risk Precision', value: '99%' },
      { label: 'Calculation Boost', value: '15x vs Pure Loop' }
    ],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    demoUrl: '#',
    githubUrl: '#',
    featured: false,
    fullDetails: {
      problem: 'Financial planners required fast interactive scenario testing without waiting minutes for spreadsheet recalculations.',
      solution: 'Implemented vectorized NumPy matrix operations on the backend with rapid React chart rendering on the frontend.',
      keyFeatures: [
        '10,000 Scenario Monte Carlo Simulation Engine',
        'Interactive Asset Weighting Sliders with Instant Recalculation',
        'Historical Volatility & Correlation Matrix Heatmaps'
      ],
      techStackDetails: [
        { name: 'NumPy / Python', role: 'Vectorized mathematical simulation' },
        { name: 'FastAPI', role: 'Ultra-low latency JSON response worker' }
      ]
    }
  }
];

export const EXPERIENCE_DATA: ExperienceItem[] = [
  {
    id: 'exp-1',
    role: 'Senior Full Stack Engineer & Data Analyst',
    company: 'Apex Digital Systems',
    period: '2024 - Present',
    type: 'Hybrid',
    location: 'Remote',
    highlights: [
      'Led the architecture and development of scalable React & Node.js web applications serving 200k+ monthly active users.',
      'Designed and executed complex SQL analytics pipelines, reducing query execution time by 45% across multi-terabyte datasets.',
      'Built interactive 3D WebGL visualizers for executive data dashboards, driving high-impact strategic business decisions.'
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Three.js', 'PostgreSQL', 'Docker']
  },
  {
    id: 'exp-2',
    role: 'Full Stack Software Developer',
    company: 'Nexus Tech Innovations',
    period: '2022 - 2024',
    type: 'Full Stack',
    location: 'Hybrid',
    highlights: [
      'Developed core web modules and RESTful microservices with Express, Redis, and React.',
      'Implemented automated CI/CD deployment pipelines using GitHub Actions and Docker containers.',
      'Collaborated closely with UX designers to craft fluid responsive interfaces with Tailwind CSS and smooth animations.'
    ],
    skills: ['React', 'Express', 'Tailwind CSS', 'Redis', 'MongoDB', 'REST APIs', 'Git']
  },
  {
    id: 'exp-3',
    role: 'Data Analyst & Insights Specialist',
    company: 'DataPulse Analytics Lab',
    period: '2021 - 2022',
    type: 'Data Analyst',
    location: 'On-site',
    highlights: [
      'Engineered Python Pandas scripts to clean, transform, and aggregate unstructured customer interaction logs.',
      'Constructed executive dashboards in Tableau and Power BI, translating raw metrics into actionable KPIs.',
      'Performed statistical correlation and regression analysis to identify key drivers of user churn.'
    ],
    skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Tableau', 'Power BI', 'Data Visualization']
  }
];

export const SAMPLE_DATASETS: DatasetOption[] = [
  {
    id: 'ecommerce-sales',
    name: 'E-Commerce Revenue & Conversion Analytics',
    description: 'Monthly store metrics tracking user traffic, order volume, revenue, and conversion percentages.',
    columns: ['Month', 'Visitors', 'Orders', 'Revenue ($)', 'Conversion Rate (%)'],
    data: [
      { Month: 'Jan', Visitors: 45000, Orders: 1350, 'Revenue ($)': 67500, 'Conversion Rate (%)': 3.0 },
      { Month: 'Feb', Visitors: 52000, Orders: 1716, 'Revenue ($)': 85800, 'Conversion Rate (%)': 3.3 },
      { Month: 'Mar', Visitors: 61000, Orders: 2196, 'Revenue ($)': 109800, 'Conversion Rate (%)': 3.6 },
      { Month: 'Apr', Visitors: 58000, Orders: 1972, 'Revenue ($)': 98600, 'Conversion Rate (%)': 3.4 },
      { Month: 'May', Visitors: 73000, Orders: 2847, 'Revenue ($)': 142350, 'Conversion Rate (%)': 3.9 },
      { Month: 'Jun', Visitors: 89000, Orders: 3738, 'Revenue ($)': 186900, 'Conversion Rate (%)': 4.2 },
      { Month: 'Jul', Visitors: 94000, Orders: 4136, 'Revenue ($)': 206800, 'Conversion Rate (%)': 4.4 }
    ],
    insights: [
      'Overall Revenue grew 206% from Jan to Jul due to steady conversion rate improvements (+1.4%).',
      'Average order value remained stable around ~$50.00.',
      'Highest growth trajectory observed in May-June following UI optimizations.'
    ]
  },
  {
    id: 'server-latency',
    name: 'Server Latency & Traffic Telemetry',
    description: 'High-frequency telemetry recording API request counts, average latency, and server CPU load.',
    columns: ['Hour', 'Requests', 'Avg Latency (ms)', 'CPU Load (%)', 'Error Rate (%)'],
    data: [
      { Hour: '00:00', Requests: 12000, 'Avg Latency (ms)': 18, 'CPU Load (%)': 22, 'Error Rate (%)': 0.02 },
      { Hour: '04:00', Requests: 8500, 'Avg Latency (ms)': 15, 'CPU Load (%)': 18, 'Error Rate (%)': 0.01 },
      { Hour: '08:00', Requests: 34000, 'Avg Latency (ms)': 28, 'CPU Load (%)': 54, 'Error Rate (%)': 0.05 },
      { Hour: '12:00', Requests: 68000, 'Avg Latency (ms)': 42, 'CPU Load (%)': 82, 'Error Rate (%)': 0.12 },
      { Hour: '16:00', Requests: 72000, 'Avg Latency (ms)': 46, 'CPU Load (%)': 88, 'Error Rate (%)': 0.18 },
      { Hour: '20:00', Requests: 49000, 'Avg Latency (ms)': 31, 'CPU Load (%)': 61, 'Error Rate (%)': 0.08 }
    ],
    insights: [
      'Peak server load occurs at 16:00 with 72k req/min and 88% CPU utilization.',
      'Latency scales non-linearly when CPU load exceeds 80%.',
      'Redis cache layer recommended for peak hours 12:00 - 18:00 to reduce latency by ~40%.'
    ]
  },
  {
    id: 'user-cohort',
    name: 'User Churn & Engagement Cohorts',
    description: 'User engagement frequency, support ticket volume, and retention scoring.',
    columns: ['Segment', 'User Count', 'Weekly Active Hrs', 'Support Tickets', 'Retention Score'],
    data: [
      { Segment: 'Power Users', 'User Count': 3400, 'Weekly Active Hrs': 18.5, 'Support Tickets': 1.2, 'Retention Score': 94 },
      { Segment: 'Regulars', 'User Count': 12500, 'Weekly Active Hrs': 8.2, 'Support Tickets': 2.4, 'Retention Score': 82 },
      { Segment: 'Casuals', 'User Count': 28000, 'Weekly Active Hrs': 2.8, 'Support Tickets': 0.8, 'Retention Score': 58 },
      { Segment: 'At Risk', 'User Count': 6200, 'Weekly Active Hrs': 0.9, 'Support Tickets': 5.6, 'Retention Score': 28 }
    ],
    insights: [
      'At Risk users submit 4.6x more support tickets despite lower usage, indicating onboarding frustration.',
      'Power Users account for 42% of total platform activity while representing only 6.8% of user base.',
      'Proactive support outreach to users with >3 tickets can recover ~35% of at-risk users.'
    ]
  }
];
