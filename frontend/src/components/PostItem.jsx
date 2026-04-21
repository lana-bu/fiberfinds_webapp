import { Link } from 'react-router-dom';

function PostItem({ post, showActions, onDelete }) {
    return (
        <div className='card'>
            <p>{post.type}</p>
            <h3><Link to={`/post/${post._id}`}>{post.title}</Link></h3>
            <p>By {post.creator} | {post.skill}</p>

            {post.description && <p>{post.description}</p>}

            <p>{new Date(post.createdAt).toLocaleDateString()}</p>

            {showActions && (
                <div>
                    <Link to={`/edit-post/${post._id}`}>
                        <button>Edit</button>
                    </Link>
                    <button onClick={() => onDelete(post._id)}>Delete</button>
                </div>
            )}
        </div>
    );
}

export default PostItem;
