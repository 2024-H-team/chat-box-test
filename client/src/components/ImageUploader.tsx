import { useState, ChangeEvent, FormEvent } from 'react';
import '@/Styles/ImageUploader.scss';

interface AnalysisResult {
    [key: string]: string | number | boolean | Record<string, unknown>;
}

const ImageUploader = () => {
    const [imageUrl, setImageUrl] = useState<string>('');
    const [result, setResult] = useState<AnalysisResult | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
        setImageUrl(event.target.value);
    };

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!imageUrl) return;

        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8080/api/image/analyze-image', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ imageUrl }),
            });

            const resultData = await response.json();

            if (response.ok) {
                setResult(resultData.analysis);
            } else {
                setError(resultData.message);
            }
        } catch {
            setError('An error occurred while analyzing the image.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image-uploader-container">
            <h1>Upload Image for Analysis</h1>
            <form onSubmit={handleSubmit} className="image-upload-form">
                <input
                    type="text"
                    placeholder="Enter image URL"
                    value={imageUrl}
                    onChange={handleUrlChange}
                    className="url-input"
                />
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>

            {imageUrl && (
                <div className="preview-container">
                    <h3>Image Preview:</h3>
                    <img src={imageUrl} alt="Selected" className="image-preview" />
                </div>
            )}

            {result && (
                <div className="result-container">
                    <h3>Analysis Result:</h3>
                    <p>{JSON.stringify(result, null, 2)}</p>
                </div>
            )}

            {error && <p className="error-message">{error}</p>}
        </div>
    );
};

export default ImageUploader;
