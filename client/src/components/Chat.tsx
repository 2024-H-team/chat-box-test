import React, { useState, useEffect, useRef, MouseEvent, KeyboardEvent } from 'react';
import ReactMarkdown from 'react-markdown';
import '@/Styles/ChatBox.scss';

interface Message {
    role: 'user' | 'assistant';
    message: string;
}

const ChatBox: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLDivElement>(null);

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

    const handleSendMessage = async (event?: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLDivElement>) => {
        if (event) event.preventDefault();

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
            if (inputRef.current) {
                inputRef.current.textContent = '';
            }
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

    const handleInputChange = (event: React.FormEvent<HTMLDivElement>) => {
        const text = event.currentTarget.textContent || '';
        setInput(text);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSendMessage();
        }
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
                            <ReactMarkdown>{msg.message}</ReactMarkdown> {/* Render Markdown */}
                        </div>
                    ))}
                </div>
                <div className="input-box">
                    <div
                        contentEditable
                        className="input-div"
                        onInput={handleInputChange}
                        onKeyDown={handleKeyDown}
                        ref={inputRef}
                        suppressContentEditableWarning={true}
                    />
                    <button onClick={handleSendMessage} disabled={loading}>
                        {loading ? '送信中...' : '送信'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatBox;
