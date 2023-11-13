// import { Link } from "react-router-dom";
import classes from "./index.module.scss";

function HomePage() {
    return (
        <div className={classes.homePage}>
            <h1>This is a Home Page</h1>
            {/* TODO: Router Link 不太能行，不知道出了什么问题，感觉像是什么 textContent 有问题 */}
            {/* 报错是 React 内部报错， e.tagRawToken */}
            <main>
                There are some demo written by me
                <a href={"/html"}>HTML</a>,<a href={"/css"}>CSS</a>,
                <a href={"/pixel"}>Pixel-Painter</a>
                <div className={classes.personalContent}>©Zer0fire</div>
            </main>
            <main>There are some link for me Github Leetcode</main>
        </div>
    );
}

export default HomePage;
