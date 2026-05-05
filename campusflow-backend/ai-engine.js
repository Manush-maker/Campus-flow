// AI Engine with contextual responses
const courseContext = {
    'math': {
        topics: ['algebra', 'calculus', 'geometry', 'trigonometry'],
        explanations: {
            'algebra': 'Algebra is the branch of mathematics dealing with symbols and the rules for manipulating them. Key concepts include variables, equations, and functions.',
            'calculus': 'Calculus studies rates of change and accumulation. Main topics: limits, derivatives, integrals, and series.'
        }
    },
    'physics': {
        topics: ['mechanics', 'thermodynamics', 'electromagnetism'],
        explanations: {
            'newton': "Newton's three laws: 1) Objects stay at rest or uniform motion unless acted upon. 2) F=ma. 3) Action-reaction pairs.",
            'mechanics': 'Mechanics studies motion and forces. Key areas: kinematics, dynamics, and statics.'
        }
    }
};

function sendMessage() {
    const input = document.getElementById('aiInput');
    const message = input.value.trim();
    if (!message) return;

    // Add user message
    addMessage(message, 'user');
    input.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message.toLowerCase());
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(text, sender) {
    const container = document.getElementById('chatContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;

    messageDiv.innerHTML = `
        <div class="avatar"><i class="fas fa-${sender === 'bot' ? 'robot' : 'user'}"></i></div>
        <div class="message-content">${text}</div>
    `;

    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;
}

function generateAIResponse(message) {
    // Course upload simulation
    if (message.includes('upload') || message.includes('course')) {
        return "✅ Course materials uploaded successfully! I now have context about your syllabus. Ask me about specific topics, summaries, or quizzes!";
    }

    // Quiz generation
    if (message.includes('quiz') || message.includes('test')) {
        return `📝 Here's a quick 3-question quiz:\n\n1. What is the derivative of x²?\n   A) 2x  B) x  C) 2\n\n2. Newton's 1st law is also called?\n   A) Law of Inertia  B) Law of Acceleration\n\nReply with your answers (e.g., "1A, 2A")`;
    }

    // Subject-specific responses
    for (let subject in courseContext) {
        if (message.includes(subject)) {
            return `📚 **${subject.toUpperCase()}**\n\n${courseContext[subject].explanations[message.split(' ')[1]] ||
                `I can help you with ${courseContext[subject].topics.join(', ')}. What specific topic would you like to explore?`}`;
        }
    }

    // Common study commands
    if (message.includes('summary')) {
        return '📖 Course Summary: This semester covers foundational concepts in your major subjects. Key focus areas include problem-solving techniques and practical applications. Would you like a chapter-wise breakdown?';
    }

    if (message.includes('explain') || message.includes('newton') || message.includes('law')) {
        return "⚖️ **Newton's Laws**: 1) Inertia - objects resist change in motion. 2) F=ma - force equals mass × acceleration. 3) Action = Reaction. Want examples or practice problems?";
    }

    if (message.includes('help') || message.includes('how')) {
        return '🤖 I can: Explain concepts • Generate quizzes • Create summaries • Solve problems • Generate study plans. Try: "Explain calculus" or "Give me a math quiz"!';
    }

    // Default intelligent response
    return `Great question! Based on your course materials, this relates to ${getRelevantTopic(message)}. Would you like a detailed explanation, examples, or practice questions?`;
}

function getRelevantTopic(message) {
    const topics = ['algebra', 'calculus', 'physics', 'newton', 'chemistry'];
    for (let topic of topics) {
        if (message.includes(topic)) return topic;
    }
    return 'core concepts';
}