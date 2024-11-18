import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from './components/Chat';

function Home() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/chat');
    };

    return (
        <div>
            <h1>Hello</h1>
            <button onClick={handleButtonClick}>Chat</button>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
        </Routes>
    );
}

export default App;
