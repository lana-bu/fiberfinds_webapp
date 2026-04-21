import { Link } from 'react-router-dom';

function About() {
    return (
        <>
            <h1 className="content-header">About</h1>

            <p className="intro">
                Fiber Finds is a platform designed to help fiber artists share patterns they love with each other and discover new ones to follow.
            </p>

            <section className="card">
                <h2 className='card-heading'>Features for Everyone</h2>
                <p>
                    Anyone can use our website without an account. The abilities open to guest users include:
                </p>
                <ul>
                    <li>Browsing all posts to find new patterns for crochet, knitting, sewing, and more.</li>
                    <li>Searching for a specific pattern and filtering based on the type of fiber art and the pattern's skill level. </li>
                    <li>Viewing a post in detail to access the link and/or file download of the pattern.</li>
                </ul>
            </section>

            <section className="card">
                <h2 className='card-heading'>Features for Registered Users</h2>
                <p>
                    Anyone with a valid email can make an account with our website. The additional abilities offered to registered users include:
                </p>
                <ul>
                    <li>Creating your own post to share a pattern.</li>
                    <li>Viewing the posts you've shared in a centralized location.</li>
                    <li>Editing or deleting any of the posts you've shared.</li>
                </ul>
            </section>

            <section className="card">
                <h2 className='card-heading'>Future Improvements</h2>
                <p>
                    For future releases of this website, we plan to implement a rating system for posts as well as allow users to leave comments on posts
                    to share any of their thoughts, questions, or tips for a pattern.
                </p>
            </section>
        </>
    );
}

export default About;