import { Route, Routes, useNavigate } from 'react-router-dom';
import Chat from './components/Chat';
import ImageUploader from './components/ImageUploader';
function Home() {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/chat');
    };

    const handleImageUpload = () => {
        navigate('/image-uploader');
    };

    return (
        <div>
            <h1>Hello</h1>
            <button onClick={handleButtonClick}>Chat</button>
            <button onClick={handleImageUpload}>Image</button>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/image-uploader" element={<ImageUploader />} />
        </Routes>
    );
}

export default App;
