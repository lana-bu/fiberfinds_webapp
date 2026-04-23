import { Link } from 'react-router-dom';

const url = import.meta.env.VITE_API_URL; // to get image URL

function PostItem({ post, showActions, onDelete }) {
    return (
        <div className='card post-card'>
            <p className='card-tag'>{post.type} | {post.skill}</p>
            <h3 className='card-title'>{post.title}</h3>
            
            {/* display image if post has one */}
            {post.image &&
                <img className="card-image" src={`${url}/${post.image}`} alt={post.title} />
            }

            <p className='card-meta'>Pattern by: {post.creator}</p>
            <p className='card-submeta'>Posted on {new Date(post.createdAt).toLocaleDateString()} by {post.userId.username}</p>

            <div className='card-actions'>
                <Link className='btn-link' to={`/post/${post._id}`}>
                    <button className="btn">View</button>
                </Link>
            
            {/* if viewing on Your Posts page, show action buttons */}
            {showActions && (
                <>
                    <Link className='btn-link' to={`/edit-post/${post._id}`}>
                        <button className='btn'>Edit</button>
                    </Link>
                    <button className='btn danger-btn' onClick={() => onDelete(post._id)}>Delete</button>
                </>
            )}
            </div>
        </div>
    );
}

export default PostItem;
