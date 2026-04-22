import { useState } from 'react';
import { Link } from 'react-router-dom';

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
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError('');

        const formData = new FormData();
        formData.append('type', type);
        formData.append('title', title);
        formData.append('description', description);
        formData.append('skill', skill);
        formData.append('creator', creator);
        formData.append('uploadType', uploadType);

        if (image) { // If image uploaded
            formData.append('image', image);
        }

        if (uploadType === 'link' || uploadType === 'both') { // If link provided
            formData.append('link', link);
        }
        if ((uploadType === 'file' || uploadType === 'both') && file) { // if file provided
            formData.append('file', file);
        }

        try {
            await onSubmit(formData);
        } catch (err) {
            if (err.response) {
                const data = err.response.data;

                if (data && data.errors) {
                    // validation errors grouped by field
                    setFieldErrors(data.errors);
                } else if (data && data.message) {
                    // single error message
                    setFormError(data.message);
                } else {
                    setFormError('Something went wrong');
                }
            } else {
                setFormError('Something went wrong');
            }
        }
    };

    return (
        <form className='card post-form' onSubmit={handleSubmit}>
            {formError && <p className='form-errors'>{formError}</p>}

            <div className="post-form-grid">
                <div className='field'>
                    <label htmlFor="title">Title*:</label>
                    <input id="title" name="title" type="text" required placeholder="Enter title..." value={title} onChange={(e) => setTitle(e.target.value)} />
                    {fieldErrors.title && fieldErrors.title.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="type">Type of fiber art*:</label>
                    <select id="type" name="type" required value={type} onChange={(e) => setType(e.target.value)}>
                        <option disabled="disabled" value="">Select type...</option>
                        <option value="crochet">Crochet</option>
                        <option value="knitting">Knitting</option>
                        <option value="sewing">Sewing</option>
                        <option value="weaving">Weaving</option>
                        <option value="embroidery">Embroidery</option>
                        <option value="other">Other</option>
                    </select>
                    {fieldErrors.type && fieldErrors.type.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field field-wide'>
                    <label htmlFor="description">Description:</label>
                    <textarea id="description" name="description" placeholder="Enter description..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    {fieldErrors.description && fieldErrors.description.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="skill">Skill level*:</label>
                    <select id="skill" name="skill" required value={skill} onChange={(e) => setSkill(e.target.value)}>
                        <option disabled="disabled" value="">Select skill level...</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                    {fieldErrors.skill && fieldErrors.skill.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="creator">Pattern creator*:</label>
                    <input id="creator" name="creator" type="text" required placeholder="Enter pattern creator..." value={creator} onChange={(e) => setCreator(e.target.value)} />
                    {fieldErrors.creator && fieldErrors.creator.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field field-wide'>
                    <label htmlFor="image">Image:</label>
                    <input id="image" type="file" accept="image/jpeg,image/png,image/gif" onChange={(e) => setImage(e.target.files[0])} />
                    {initialData?.image && !image && (
                        <p>Current image file: {initialData.image.split(/[/\\]/).pop()}</p>
                    )}
                </div>

                <div className='field'>
                    <label htmlFor="uploadType">Upload type*:</label>
                    <select id="uploadType" name="uploadType" required value={uploadType} onChange={(e) => setUploadType(e.target.value)}>
                        <option value="link">Link</option>
                        <option value="file">File</option>
                        <option value="both">Both</option>
                    </select>
                    {fieldErrors.uploadType && fieldErrors.uploadType.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                {(uploadType === 'link' || uploadType === 'both') && (
                    <div className='field'>
                        <label htmlFor="link">Pattern link*:</label>
                        <input id="link" name="link" type="url" required placeholder="Enter pattern URL..." value={link} onChange={(e) => setLink(e.target.value)} />
                        {fieldErrors.link && fieldErrors.link.map((msg, i) => (
                            <p className='field-error' key={i}>{msg}</p>
                        ))}
                    </div>
                )}

                {(uploadType === 'file' || uploadType === 'both') && (
                    <div className='field field-wide'>
                        <label htmlFor="file">Pattern file*:</label>
                        <input id="file" name="file" type="file" accept=".pdf,.txt" required onChange={(e) => setFile(e.target.files[0])} />
                        {initialData?.file && !file && (
                            <p>Current file: {initialData.file.split(/[/\\]/).pop()}</p>
                        )}
                    </div>
                )}
            </div>

            <p className="info">*Required field</p>

            <div className='card-actions'>
                <Link className='btn-link' to={`/`}>
                    <button className="btn danger-btn">Cancel</button>
                </Link>

                {/* to label with Create Post or Save Changes instead */}
                <button className="btn" type="submit">{submitLabel || 'Submit'}</button> 
            </div>
        </form>
    );
}

export default PostForm;
