// --- Dynamic Portfolio Data Store ---
// This file serves as the default portfolio dataset and provides helper functions
// to read and write customized data via localStorage.

const DEFAULT_PORTFOLIO_DATA = {
    hero: {
        name: "Arjun Singh Jadon",
        badge: "B.Tech CS Student • SISTec Bhopal",
        typewriter: [
            "VeerGatha 3.0 Winner",
            "B.Tech Computer Science & Engineering Student",
            "Aspiring Software Engineer",
            "Java Developer"
        ],
        bio: "Computer Science Engineering student at SISTec Bhopal passionate about building practical technology solutions, mastering DSA & OOP, and exploring AI-powered applications.",
        profileImage: "MYpic2.png",
        resumeUrl: "Resume.pdf",
        githubUrl: "https://github.com/Newengineer280705",
        linkedinUrl: "https://www.linkedin.com/in/arjun-singh-jadon-649619333",
        email: "arjun101jadone@gmail.com"
    },
    about: {
        title: "About Me",
        subtitle: "My background, goals, and core engineering focus",
        journeyHeading: "My Journey & Vision",
        paragraphs: [
            "I'm <strong class=\"text-[#60A5FA] font-semibold\">Arjun Singh Jadon</strong>, a Computer Science and Engineering student currently pursuing my B.Tech. I am passionate about software development, Data Structures & Algorithms, Artificial Intelligence, and building practical technology solutions.",
            "I enjoy learning new technologies and turning ideas into working projects. My current focus is on strengthening my programming, problem-solving, and software development skills while exploring AI-powered applications and modern development tools. My long-term goal is to build a strong career as a Software Engineer."
        ],
        highlights: [
            { icon: "fas fa-graduation-cap", title: "Degree Program", desc: "B.Tech in Computer Science & Engineering" },
            { icon: "fas fa-location-dot", title: "Location", desc: "Bhopal, Madhya Pradesh, India" },
            { icon: "fas fa-code", title: "Tech Focus", desc: "Java, C++, DSA, OOP & Web Development" },
            { icon: "fas fa-trophy", title: "Activities & Projects", desc: "Technical workshops, hackathons & AI medicine scanner project" }
        ]
    },
    education: [
        {
            id: "edu-1",
            year: "2024 – 2028",
            location: "Bhopal, MP",
            degree: "B.Tech in Computer Science & Engineering",
            institution: "Sagar Institute of Science and Technology (SISTec), Gandhinagar, Bhopal",
            score: "",
            description: "",
            tags: ["Computer Science", "Software Engineering", "DSA & Programming"]
        },
        {
            id: "edu-2",
            year: "Passed 2024",
            location: "Bhopal, MP",
            degree: "Class 12th (Higher Secondary Education)",
            institution: "Govt. PM. Shri H.S. School, Bhopal",
            score: "90% Score",
            description: "Completed Higher Secondary Education in 2024, achieving a 90% academic score.",
            tags: ["Science Stream", "Mathematics & Physics"]
        },
        {
            id: "edu-3",
            year: "Passed 2022",
            location: "Bhopal, MP",
            degree: "Class 10th (Secondary Education)",
            institution: "Govt. PM. Shri H.S. School, Bhopal",
            score: "91.2% Score",
            description: "Completed Secondary Education in 2022, achieving a 91.2% academic score.",
            tags: ["General Subjects", "Science & Maths"]
        }
    ],
    skills: {
        languages: [
            { name: "Java (Primary Language • OOP & NPTEL 95%)", level: "Primary", percentage: 92, icon: "fab fa-java", color: "#FB923C", brandClass: "brand-java" },
            { name: "JavaScript (Web Logic & ES6+)", level: "Proficient", percentage: 80, icon: "fab fa-js", color: "#F7DF1E", brandClass: "brand-js" },
            { name: "C++ (DSA & Problem Solving)", level: "Learnt", percentage: 72, icon: "fas fa-code", color: "#60A5FA", brandClass: "brand-cpp" },
            { name: "C (Procedural Programming)", level: "Learnt", percentage: 70, icon: "fas fa-code", color: "#3B82F6", brandClass: "" }
        ],
        aiBadges: ["Gemini API", "Generative AI"],
        webBadges: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3"],
        coreBadges: ["DSA", "OOP", "STL", "Logic Building"],
        toolBadges: ["Git", "GitHub", "VS Code", "Vite", "Netlify"]
    },
    projects: [
        {
            id: "proj-1",
            title: "MediScanner",
            category: "AI / HealthTech",
            description: "AI-powered medical scanning application utilizing Google Gemini API for intelligent medicine verification, usage instructions, and prescription analysis.",
            image: "mediscanner.png",
            tags: ["React", "Gemini API", "JavaScript"],
            githubUrl: "https://github.com/Newengineer280705/MedicineScanner.git",
            demoUrl: "https://startling-choux-88c463.netlify.app/",
            status: "Live"
        },
        {
            id: "proj-2",
            title: "QR Code Generator",
            category: "Web Tool",
            description: "Fast and responsive web utility application for generating customizable, high-resolution downloadable QR codes for URLs, text, and contact data.",
            image: "qrcode.png",
            tags: ["HTML5", "CSS3", "JavaScript"],
            githubUrl: "https://github.com/Newengineer280705",
            demoUrl: "https://glistening-bombolone-e4f698.netlify.app/",
            status: "Live"
        },
        {
            id: "proj-3",
            title: "Feedback Loop",
            category: "WIP",
            description: "Interactive web platform designed to seamlessly collect, process, and analyze user feedback and review metrics. Currently in active development.",
            image: "",
            tags: ["React", "TypeScript", "CSS", "Netlify"],
            githubUrl: "https://github.com/Newengineer280705",
            demoUrl: "",
            status: "In Development"
        }
    ],
    achievements: {
        badge: "National Super 100 Winner",
        stat: "1 Crore (10 Million) Candidates",
        title: "Super 100 National Winner – VeerGatha 3.0",
        organizer: "Organized by Ministry of Defence & Ministry of Education, Government of India",
        description: "Selected as a National Super 100 Winner among 1 Crore (10 Million) students across 2.5 Lakh schools in India. Honored at New Delhi during Republic Day 2024 celebrations with a national medal and ₹10,000 cash award by Raksha Mantri Shri Rajnath Singh and Education Minister Shri Dharmendra Pradhan.",
        tags: ["Ministry of Defence", "Ministry of Education", "Press & News Coverage"],
        certificateImage: "veergatha_cert.jpg",
        ceremonyPhoto: "veergatha_ceremony.jpg",
        slides: [
            { src: "veergatha_ceremony.jpg", title: "Award Ceremony with Defence Minister Shri Rajnath Singh", caption: "Stage Ceremony @ New Delhi" },
            { src: "veergatha_news.png", title: "National Newspaper Coverage", caption: "National Press Feature" },
            { src: "veergatha_portrait.jpg", title: "Super 100 Winner Portrait - New Delhi", caption: "Winner Portrait @ New Delhi" }
        ]
    },
    certifications: [
        {
            id: "cert-1",
            title: "NPTEL – Programming in Java",
            issuer: "NPTEL (IIT Kharagpur)",
            category: "programming",
            score: "95% Score",
            description: "Certified in Core Java, Multithreading, Exception Handling, Collections, and OOP with an Elite 95% score.",
            icon: "fab fa-java",
            iconColor: "#FB923C",
            image: "NPTELjava.jpeg",
            url: "NPTELjava.jpeg",
            tags: ["Core Java", "OOP", "NPTEL Elite"]
        },
        {
            id: "cert-2",
            title: "Cisco Networking Certificate",
            issuer: "Cisco Networking Academy",
            category: "networking",
            score: "Verified Credential",
            description: "Network architecture, IP addressing, routing protocols, OSI model, and communication infrastructure.",
            icon: "fas fa-network-wired",
            iconColor: "#3B82F6",
            image: "",
            url: "#",
            tags: ["Networking", "Protocols", "TCP/IP"]
        },
        {
            id: "cert-3",
            title: "Introduction to Modern AI",
            issuer: "Modern Artificial Intelligence",
            category: "ai",
            score: "Certified",
            description: "Neural networks, modern LLMs, prompt engineering, generative applications, and AI ethical frameworks.",
            icon: "fas fa-brain",
            iconColor: "#C084FC",
            image: "",
            url: "Introduction of modern Ai.pdf",
            tags: ["Artificial Intelligence", "Generative AI", "LLMs"]
        },
        {
            id: "cert-4",
            title: "Analyst Customer Review",
            issuer: "Data & Review Analytics",
            category: "data",
            score: "Certified Analyst",
            description: "Customer feedback analysis, structured sentiment evaluation, KPI tracking, and qualitative metrics.",
            icon: "fas fa-user-check",
            iconColor: "#34D399",
            image: "",
            url: "customer reviews.pdf",
            tags: ["Sentiment Analysis", "Review Metrics", "Data Analysis"]
        },
        {
            id: "cert-5",
            title: "Data Analytics Essentials",
            issuer: "Cisco / Data Academy",
            category: "data",
            score: "Foundations",
            description: "Core data analytics pipelines, exploratory data analysis, data storytelling, and visualization tools.",
            icon: "fas fa-chart-pie",
            iconColor: "#38BDF8",
            image: "",
            url: "Data Essential.pdf",
            tags: ["Data Pipelines", "Visualization", "Statistics"]
        },
        {
            id: "cert-6",
            title: "TCS iON Career Edge – Young Professional",
            issuer: "Tata Consultancy Services (TCS iON)",
            category: "professional",
            score: "Certified",
            description: "Workplace readiness, business communication, presentation skills, and corporate professional etiquette.",
            icon: "fas fa-user-gear",
            iconColor: "#F59E0B",
            image: "tcsYoung.jpeg",
            url: "tcsYoung.jpeg",
            tags: ["Professional Readiness", "Communication", "Corporate Skills"]
        }
    ],
    contact: {
        email: "arjun101jadone@gmail.com",
        linkedin: "https://www.linkedin.com/in/arjun-singh-jadon-649619333",
        linkedinHandle: "arjun-singh-jadon",
        github: "https://github.com/Newengineer280705",
        githubHandle: "Newengineer280705",
        resumeUrl: "Resume.pdf",
        footerText: "© 2026 Arjun Singh Jadon. All rights reserved."
    }
};

const STORAGE_KEY = 'portfolio_custom_data_v1';
const ADMIN_PIN_KEY = 'portfolio_admin_pin_v1';
 const DEFAULT_PIN = 'Arjun@123';

// Storage Helper Functions
function getPortfolioData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            const parsed = JSON.parse(stored);
            // Deep merge with default to ensure backward compatibility
            return {
                ...DEFAULT_PORTFOLIO_DATA,
                ...parsed,
                hero: { ...DEFAULT_PORTFOLIO_DATA.hero, ...(parsed.hero || {}) },
                about: { ...DEFAULT_PORTFOLIO_DATA.about, ...(parsed.about || {}) },
                skills: { ...DEFAULT_PORTFOLIO_DATA.skills, ...(parsed.skills || {}) },
                achievements: { ...DEFAULT_PORTFOLIO_DATA.achievements, ...(parsed.achievements || {}) },
                contact: { ...DEFAULT_PORTFOLIO_DATA.contact, ...(parsed.contact || {}) },
                education: parsed.education || DEFAULT_PORTFOLIO_DATA.education,
                projects: parsed.projects || DEFAULT_PORTFOLIO_DATA.projects,
                certifications: parsed.certifications || DEFAULT_PORTFOLIO_DATA.certifications
            };
        }
    } catch (e) {
        console.warn('Could not read custom portfolio data from localStorage, using defaults.', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PORTFOLIO_DATA));
}

function savePortfolioData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Failed to save to localStorage:', e);
        return false;
    }
}

function resetPortfolioData() {
    localStorage.removeItem(STORAGE_KEY);
}

function getAdminPin() {
    return localStorage.getItem(ADMIN_PIN_KEY) || DEFAULT_PIN;
}

function setAdminPin(newPin) {
    localStorage.setItem(ADMIN_PIN_KEY, newPin);
}

// Attach globally (browser & node environments)
if (typeof window !== 'undefined') {
    window.DEFAULT_PORTFOLIO_DATA = DEFAULT_PORTFOLIO_DATA;
    window.getPortfolioData = getPortfolioData;
    window.savePortfolioData = savePortfolioData;
    window.resetPortfolioData = resetPortfolioData;
    window.getAdminPin = getAdminPin;
    window.setAdminPin = setAdminPin;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DEFAULT_PORTFOLIO_DATA,
        getPortfolioData,
        savePortfolioData,
        resetPortfolioData,
        getAdminPin,
        setAdminPin
    };
}
