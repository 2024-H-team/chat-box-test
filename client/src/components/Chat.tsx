import React, { useState, ChangeEvent, MouseEvent, useEffect } from 'react';
import '@/Styles/ChatBox.scss';

interface Message {
    role: 'user' | 'assistant';
    message: string;
}

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const MAX_MESSAGES = 10;

    useEffect(() => {
        const storedMessages = sessionStorage.getItem('chatMessages');
        if (storedMessages) {
            setMessages(JSON.parse(storedMessages));
        }
    }, []);

    useEffect(() => {
        if (messages.length > 0) {
            sessionStorage.setItem('chatMessages', JSON.stringify(messages));
        }
    }, [messages]);

    const handleSendMessage = async (event: MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();

        if (!input) return;

        setMessages((prevMessages) => {
            const updatedMessages: Message[] = [...prevMessages, { role: 'user', message: input }];

            if (updatedMessages.length > MAX_MESSAGES) {
                updatedMessages.shift();
            }

            return updatedMessages;
        });

        setLoading(true);
        try {
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: input,
                    history: messages.map((msg) => ({ role: msg.role, content: msg.message })),
                }),
            });

            const data = await response.json();
            const botMessage = data.message;

            setMessages((prevMessages) => {
                const updatedMessages: Message[] = [...prevMessages, { role: 'assistant', message: botMessage }];
                if (updatedMessages.length > MAX_MESSAGES) {
                    updatedMessages.shift();
                }
                return updatedMessages;
            });

            setInput('');
        } catch (error) {
            console.error('Error:', error);
            setMessages((prevMessages) => [
                ...prevMessages,
                { role: 'assistant', message: 'なんかエーラー' } as Message,
            ]);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setInput(event.target.value);
    };

    return (
        <div className="chatbox-container">
            <div className="chatbox">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
                        >
                            {msg.message}
                        </div>
                    ))}
                </div>
                <div className="input-box">
                    <textarea value={input} onChange={handleInputChange} placeholder="メッセージを入力..." />
                    <button onClick={handleSendMessage} disabled={loading}>
                        {loading ? '送信中...' : '送信'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
