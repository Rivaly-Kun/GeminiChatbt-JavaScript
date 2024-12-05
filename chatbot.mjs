import { GoogleGenerativeAI } from "@google/generative-ai";

async function setupChatbot() {
    const genAI = new GoogleGenerativeAI("AIzaSyCstAurqINn3WIhhC1nV5uqczCV8wbw-0s");
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const modal = document.getElementById("chatbot-modal");
    const openModalBtn = document.getElementById("open-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const sendBtn = document.getElementById("send-btn");
    const chatInput = document.getElementById("chat-input");
    const chatArea = document.getElementById("chat-area");

    // Open the modal
    openModalBtn.addEventListener("click", () => {
        modal.style.display = "block";
    });

    // Close the modal
    closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    // Close modal if clicking outside content
    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });

    // Handle sending messages
    sendBtn.addEventListener("click", async () => {
        const message = chatInput.value.trim();
        if (message) {
            // Display user message
            const userMessage = document.createElement("div");
            userMessage.className = "chat-message user";
            userMessage.textContent = `You: ${message}`;
            chatArea.appendChild(userMessage);

            // Generate AI response
            try {
                const result = await model.generateContent(message);
                const botResponse = result.response.text();

                // Display chatbot response
                const botMessage = document.createElement("div");
                botMessage.className = "chat-message bot";
                botMessage.textContent = `Chatbot: ${botResponse}`;
                chatArea.appendChild(botMessage);
            } catch (error) {
                const errorMessage = document.createElement("div");
                errorMessage.className = "chat-message bot";
                errorMessage.textContent = "Chatbot: Sorry, something went wrong.";
                chatArea.appendChild(errorMessage);
                console.error(error);
            }

            // Clear the input
            chatInput.value = "";
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    });
}

// Initialize chatbot
setupChatbot();