// import { Link } from "react-router-dom";

function HomePage() {
    return (
        <div>
            This is a Home Page
            {/* TODO: Router Link 不太能行，不知道出了什么问题，感觉像是什么 textContent 有问题 */}
            <a href={"/pixel"}>Pixel-Painter</a>
            <div>©Zer0fire</div>
        </div>
    );
}

export default HomePage;
