export interface Experience {
    id: string;
    title: string;
    company: string;
    period: string;
    type: 'Full-time' | 'Internship' | 'Project' | 'Part-time';
    description: string;
    technologies: string[];
    details?: string[];
}

export const experiences: Experience[] = [
    {
        id: 'odds-junior-platform',
        title: 'Junior Platform Engineer',
        company: 'ODDS Team',
        period: 'Apr 2025 - Present',
        type: 'Full-time',
        description: 'Specializing in DevSecOps practices, cloud infrastructure, and full-stack development for enterprise-scale data projects.',
        technologies: ['Kubernetes', 'Docker', 'GitHub Actions', 'Jenkins', 'Proxmox', 'Kong API Gateway', 'Backstage'],
        details: [
            'Contributed to Backstage templates and maintained VM infrastructure with Proxmox.',
            'Implemented CI/CD pipelines using GitHub Actions, Gitlab CI, and Jenkins.',
            'Containerized applications using Docker and Kubernetes.',
            'Mapped domains from Cloudflare to Kong API gateway.',
            'Served as Teaching Assistant for Vault, DevSecOps, Kube Intensive, and Kafka training classes.'
        ]
    },
    {
        id: 'data-scheduler-project',
        title: 'Data Scheduler Project',
        company: 'ODDS Team',
        period: '2025',
        type: 'Project',
        description: 'Full-stack development of a data scheduler system using Next.js & Python FastAPI, orchestrating data science notebooks.',
        technologies: ['Next.js', 'Python FastAPI', 'Apache Airflow 2.10', 'Kubernetes', 'Jupyter', 'Jenkins'],
        details: [
            'Developed frontend using Next.js (SSR) and backend with Python FastAPI.',
            'Integrated Apache Airflow to execute Jupyter notebooks for machine learning models.',
            'Deployed on hybrid infrastructure (Kubernetes and VMs) based on resource requirements.',
            'Implemented CI/CD pipelines using Jenkins.'
        ]
    },
    {
        id: 'data-streaming-project',
        title: 'Data Streaming Project',
        company: 'ODDS Team',
        period: '2025',
        type: 'Project',
        description: 'High-throughput data streaming architecture utilizing CDC and Kafka for real-time data aggregation.',
        technologies: ['Debezium', 'Kafka', 'Golang', 'CDC'],
        details: [
            'Implemented Change Data Capture (CDC) using Debezium.',
            'Processed over 300,000 messages per 15 minutes using Kafka.',
            'Developed Golang consumers for data aggregation.',
            'Optimized data pipeline for high availability and throughput.'
        ]
    },
    {
        id: 'legacy-migration',
        title: 'Legacy App Migration',
        company: 'ODDS Team',
        period: '2025',
        type: 'Project',
        description: 'Modernization of legacy infrastructure.',
        technologies: ['AWS', 'Docker', 'PHP'],
        details: [
            'Migrated legacy PHP application to containerized environments.',
            'Deployed to AWS, replacing retiring on-premise infrastructure.'
        ]
    },
    {
        id: 'odds-internship',
        title: 'Software Engineer Intern',
        company: 'ODDS Team',
        period: 'Apr 2024 - Oct 2024',
        type: 'Internship',
        description: 'Cross-functional Scrum team member contributing to multiple full-stack web applications.',
        technologies: ['Next.js', 'Express.js', 'Flutter', 'Ruby on Rails', 'Spring Boot', 'Docker'],
        details: [
            'Developed a Recruitment application using Next.js, Express.js, and Flutter.',
            'Maintained Employee Attendance system using Ruby on Rails and Keycloak.',
            'Contributed to a Reporting web application using Java Spring Boot and Jasper Reports.'
        ]
    }
];
