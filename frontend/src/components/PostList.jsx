import PostItem from './PostItem';

function PostList({ posts, showActions, onDelete, emptyMessage }) {
    if (posts.length === 0) {
        return <p>{emptyMessage || 'No posts found.'}</p>;
    }

    return (
        <div className="post-list">
            {posts.map(post => (
                <PostItem
                    key={post._id}
                    post={post}
                    showActions={showActions}
                    onDelete={onDelete}
                />
            ))}
        </div>
    );
}

export default PostList;
