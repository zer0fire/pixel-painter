import "./index.scss";

function CssCarousel() {
    return (
        <>
            <input type="radio" name="carousel" id="rd1" checked />
            <input type="radio" name="carousel" id="rd2" />
            <input type="radio" name="carousel" id="rd3" />
            <input type="radio" name="carousel" id="rd4" />
            <div className="carousel-view">
                <div className="carousel-main">
                    <div className="carousel-choice first">
                        <span>熊本熊 酷MA萌</span>
                        <br />
                        <a href="http://zhuti.xiaomi.com/detail/31c6176f-5772-45fa-9df9-d86d2bae1e4a">
                            戳一戳、摸一摸，酷MA萌会在锁屏跟你亲密互动哦。
                        </a>
                        <img
                            src="https://i1.mifile.cn/a4/xmad_15360565735203_Uuvyd.jpg"
                            alt=""
                        />
                    </div>
                    <div className="carousel-choice second">
                        <span>蚁人2</span>
                        <br />
                        <a href="http://zhuti.xiaomi.com/detail/8e7b9877-efe1-4b42-87c0-658d89a166c9">
                            小米主题和迪士尼首度合作，打造精品漫威系列主题
                        </a>
                        <img
                            src="https://i1.mifile.cn/a4/xmad_15357000957252_GpoLc.png"
                            alt=""
                        />
                    </div>
                    <div className="carousel-choice third">
                        <span>复仇者联盟3-我的英雄</span>
                        <br />
                        <a href="http://zhuti.xiaomi.com/detail/a909fbe0-28bb-4361-892b-d49550468b44">
                            28张超级英雄个人专属锁屏及桌面壁纸随你挑！
                        </a>
                        <img
                            src="https://i1.mifile.cn/a4/xmad_15290561352349_zNjLT.png"
                            alt=""
                        />
                    </div>
                    <div className="carousel-choice fourth">
                        <span>
                            众多个性主题、百变锁屏与自由桌面让你的手机与众不同！
                        </span>
                        <br />
                        <a href="http://zhuti.xiaomi.com/?from=mi">
                            前往MIUI主题市场
                        </a>
                        <img
                            src="https://s01.mifile.cn/i/index/more-miui.jpg"
                            alt=""
                        />
                    </div>
                </div>
                <section>
                    <label htmlFor="rd1"></label>
                    <label htmlFor="rd2"></label>
                    <label htmlFor="rd3"></label>
                    <label htmlFor="rd4"></label>
                </section>
            </div>
        </>
    );
}

export default CssCarousel;
