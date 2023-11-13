import { get } from "../request";

interface PayParam {
    price: number;
    order: number;
    uid: number;
}

export function pay({ price, order, uid }: PayParam) {
    return get(
        `https://www.clicli.cc/vip/pay?price=${price}&order=${order}&uid=${uid}`
    );
}
