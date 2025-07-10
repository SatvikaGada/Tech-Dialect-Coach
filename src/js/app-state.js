// Application State (original variables)
let currentCategory = 'general';
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let currentQuestionData = null;
let userSessions = JSON.parse(localStorage.getItem('speechai_sessions') || '[]');

// Questions Data (original object)
const questions = {
    general: [
        {
            text: "Tell me about a time when you had to overcome a significant challenge.",
            keywords: ["challenge", "overcome", "resilience", "problem-solving"],
            sample: "I faced a significant challenge during my final year project when our team's initial approach wasn't working. I took the initiative to research alternative solutions, organized team meetings to brainstorm, and we ultimately pivoted to a more effective strategy. This experience taught me the importance of adaptability and collaborative problem-solving."
        },
        {
            text: "How do you handle stress and pressure in your daily life?",
            keywords: ["stress management", "pressure", "coping strategies", "time management"],
            sample: "I manage stress through a combination of time management and mindfulness techniques. I prioritise tasks using the Eisenhower matrix, break large projects into smaller manageable chunks, and maintain a healthy work-life balance through regular exercise and meditation. When pressure mounts, I focus on breathing exercises and remind myself to tackle one task at a time."
        },
        {
            text: "Describe your ideal work environment and why it suits you.",
            keywords: ["work environment", "collaboration", "productivity", "preferences"],
            sample: "My ideal work environment combines collaborative spaces with quiet areas for focused work. I thrive in environments that encourage open communication, continuous learning, and innovation. I prefer a culture that values work-life balance and provides opportunities for professional development. Flexibility in working arrangements, such as hybrid options, also enhances my productivity."
        },
        {
            text: "What motivates you to pursue your goals?",
            keywords: ["motivation", "goals", "drive", "passion"],
            sample: "I'm primarily motivated by the opportunity to solve complex problems and make a meaningful impact. The prospect of continuous learning and personal growth drives me forward. I find great satisfaction in collaborating with talented individuals and contributing to projects that can benefit others. Setting clear, measurable goals and celebrating small victories along the way keeps me focused and energised."
        },
        {
            text: "How do you approach learning new skills or technologies?",
            keywords: ["learning", "skills", "technology", "adaptation"],
            sample: "I approach learning new skills systematically by first understanding the fundamentals through reputable sources and documentation. I then apply the knowledge through hands-on projects, starting with simple implementations and gradually increasing complexity. I believe in learning from the community through forums, attending workshops, and finding mentors. Regular practice and teaching others what I've learned helps reinforce my understanding."
        }
    ],
    interview: [
        {
            text: "Explain the difference between a stack and a queue, and provide use cases for each.",
            keywords: ["stack", "queue", "data structures", "LIFO", "FIFO"],
            sample: "A stack follows the Last-In-First-Out (LIFO) principle, where elements are added and removed from the same end. It's ideal for function call management, undo operations, and expression evaluation. A queue follows First-In-First-Out (FIFO), where elements are added at one end and removed from the other. Queues are perfect for task scheduling, breadth-first search algorithms, and handling requests in web servers."
        },
        {
            text: "What is the time complexity of binary search and why?",
            keywords: ["binary search", "time complexity", "O(log n)", "algorithm"],
            sample: "Binary search has a time complexity of O(log n) because it repeatedly divides the search space in half. In each iteration, we eliminate half of the remaining elements by comparing the target with the middle element. This logarithmic reduction means that for a sorted array of n elements, we need at most log₂(n) comparisons to find our target or determine it doesn't exist."
        },
        {
            text: "Describe the principles of Object-Oriented Programming.",
            keywords: ["OOP", "encapsulation", "inheritance", "polymorphism", "abstraction"],
            sample: "Object-Oriented Programming is built on four core principles. Encapsulation bundles data and methods together whilst hiding internal implementation details. Inheritance allows classes to inherit properties and methods from parent classes, promoting code reuse. Polymorphism enables objects of different types to be treated uniformly through common interfaces. Abstraction simplifies complex systems by focusing on essential features whilst hiding unnecessary details."
        },
        {
            text: "How would you optimize a slow database query?",
            keywords: ["database optimization", "indexing", "query performance", "SQL"],
            sample: "I'd start by analysing the query execution plan to identify bottlenecks. Key optimization strategies include adding appropriate indexes on frequently queried columns, avoiding SELECT *, using WHERE clauses to filter data early, and considering query restructuring. I'd also examine table statistics, check for missing foreign key constraints, and consider partitioning large tables. Caching frequently accessed data and using connection pooling can further improve performance."
        },
        {
            text: "What is the difference between HTTP and HTTPS, and why is HTTPS important?",
            keywords: ["HTTP", "HTTPS", "security", "encryption", "SSL/TLS"],
            sample: "HTTP (HyperText Transfer Protocol) transmits data in plain text, making it vulnerable to interception and tampering. HTTPS adds a security layer using SSL/TLS encryption, ensuring data confidentiality, integrity, and authentication. HTTPS is crucial for protecting sensitive information like passwords and payment details, building user trust, improving SEO rankings, and meeting compliance requirements. It prevents man-in-the-middle attacks and ensures users are communicating with legitimate websites."
        }
    ]
};