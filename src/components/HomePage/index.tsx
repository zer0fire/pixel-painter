import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
            This is a Home Page
            <Link to={"/pixel"}>Pixel-Painter</Link>
            <div>©Zer0fire</div>
        </div>
    );
}

export default HomePage;
