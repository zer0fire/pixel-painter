import { useEffect, useRef, useState } from "react";
import { getMatrix, render } from "qr-code-generator-lib";
import { pay } from "../../utils/pay/pay";
import "./index.css";
// import { getAvatar, getSuo } from "../util/avatar";

export default function Pay() {
    const [index, setIndex] = useState(0);
    const order = Math.floor(Math.random() * 10000000000);
    const [user] = useState({});
    useEffect(() => {
        pay({
            price: list[index] / 100,
            order,
            uid: (user || ({} as any)).id || 2,
        }).then((res) => {
            q.current!.innerHTML = render(
                getMatrix((res as any).alipay_trade_precreate_response.qr_code),
                "var(--secondary)"
            );
            q2.current!.href = (
                res as any
            ).alipay_trade_precreate_response.qr_code;
        });
    }, [index, user]);

    const q = useRef<HTMLDivElement>(null);
    const q2 = useRef<HTMLAnchorElement>(null);

    const list = [100, 1000, 3000, 5000, 10000, 20000];

    return (
        <div className="vip wrap">
            <ul>
                {list.map((item, i) => {
                    return (
                        <li
                            className={i === index ? "active" : ""}
                            onClick={() => setIndex(i)}
                        >
                            {item} 弯豆 <span>￥{item / 100}</span>
                        </li>
                    );
                })}
            </ul>
            <h3>方式一：跳转支付宝APP</h3>
            <a href="" ref={q2}>
                <button
                    style={{ background: "var(--secondary)", margin: "20px" }}
                >
                    点此充值
                </button>
            </a>
            <h3>方式二：支付宝扫码</h3>
            <div className="qrcode" ref={q}></div>
        </div>
    );
}
