// import { Link } from "react-router-dom";
import classes from "./index.module.scss";

function HomePage() {
    return (
        <div className={classes.homePage}>
            This is a Home Page
            {/* TODO: Router Link 不太能行，不知道出了什么问题，感觉像是什么 textContent 有问题 */}
            {/* 报错是 React 内部报错， e.tagRawToken */}
            <a href={"/html"}>HTML</a>
            <a href={"/css"}>CSS</a>
            <a href={"/pixel"}>Pixel-Painter</a>
            <div className={classes.personalContent}>©Zer0fire</div>
        </div>
    );
}

export default HomePage;
