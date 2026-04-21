import { Link } from 'react-router-dom';

function Home() {
    return (
        <div>
            <Header/>
            <Navigation/>
            <main className='content-container'>
                hello
            </main>
            <Footer/>
        </div>
    );
}

export default Home;