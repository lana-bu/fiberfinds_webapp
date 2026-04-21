import { useState } from 'react';

function PostForm({ initialData, onSubmit, submitLabel }) {
    const [type, setType] = useState(initialData?.type || '');
    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [skill, setSkill] = useState(initialData?.skill || '');
    const [creator, setCreator] = useState(initialData?.creator || '');
    const [uploadType, setUploadType] = useState(initialData?.uploadType || 'link');
    const [link, setLink] = useState(initialData?.link || '');
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const formData = new FormData();
        formData.append('type', type);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('skill', skill);
        formData.append('creator', creator);
        formData.append('uploadType', uploadType);

        if (uploadType === 'link' || uploadType === 'both') {
            formData.append('link', link);
        }
        if (image) {
            formData.append('image', image);
        }
        if ((uploadType === 'file' || uploadType === 'both') && file) {
            formData.append('file', file);
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                // errors is an object grouped by field (e.g. { title: ['Title is required'] })
                const messages = Object.values(data.errors).flat();
                setError(messages.join('. '));
            } else {
                setError(data?.message || 'Something went wrong');
            }
        }
    };

    return (
        <form className='card' onSubmit={handleSubmit}>
            {error && <p>{error}</p>}

            <div>
                <label htmlFor="type">Type of Fiber Art:</label>
                <select id="type" value={type} onChange={(e) => setType(e.target.value)}>
                    <option value="">Select type...</option>
                    <option value="crochet">Crochet</option>
                    <option value="knitting">Knitting</option>
                    <option value="sewing">Sewing</option>
                    <option value="weaving">Weaving</option>
                    <option value="embroidery">Embroidery</option>
                    <option value="other">Other</option>
                </select>
            </div>

            <div>
                <label htmlFor="title">Title:</label>
                <input
                    id="title"
                    type="text"
                    placeholder="Enter title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="description">Description (optional):</label>
                <textarea
                    id="description"
                    placeholder="Enter description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="skill">Skill Level:</label>
                <select id="skill" value={skill} onChange={(e) => setSkill(e.target.value)}>
                    <option value="">Select skill level...</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            <div>
                <label htmlFor="creator">Pattern Creator:</label>
                <input
                    id="creator"
                    type="text"
                    placeholder="Enter pattern creator..."
                    value={creator}
                    onChange={(e) => setCreator(e.target.value)}
                />
            </div>

            <div>
                <label htmlFor="image">Image (optional):</label>
                <input
                    id="image"
                    type="file"
                    accept="image/jpeg,image/png,image/gif"
                    onChange={(e) => setImage(e.target.files[0])}
                />
            </div>

            <div>
                <label htmlFor="uploadType">Upload Type:</label>
                <select id="uploadType" value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                    <option value="link">Link</option>
                    <option value="file">File</option>
                    <option value="both">Both</option>
                </select>
            </div>

            {(uploadType === 'link' || uploadType === 'both') && (
                <div>
                    <label htmlFor="link">Pattern Link:</label>
                    <input
                        id="link"
                        type="url"
                        placeholder="Enter pattern URL..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                </div>
            )}

            {(uploadType === 'file' || uploadType === 'both') && (
                <div>
                    <label htmlFor="file">Pattern File:</label>
                    <input
                        id="file"
                        type="file"
                        accept=".pdf,.txt"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                    {initialData?.file && !file && (
                        <p>Current file: {initialData.file.split(/[/\\]/).pop()}</p>
                    )}
                </div>
            )}

            <button type="submit">{submitLabel || 'Submit'}</button>
        </form>
    );
}

export default PostForm;
