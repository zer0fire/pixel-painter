import { get } from "../request";

interface PayParam {
    price: number;
    order: number;
    uid: number;
}

// const prefix = 'www.clicli.cc'
const prefix = "http://localhost:3001";

export function pay({ price, order, uid }: PayParam) {
    return get(`${prefix}/vip/pay?price=${price}&order=${order}&uid=${uid}`);
}
