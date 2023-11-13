export function post(url: string, params: any): Promise<Response> {
    return new Promise((resolve) => {
        fetch(url, {
            method: "post",
            body: JSON.stringify(params),
            headers: {
                "Content-Type": "application/json",
                token: localStorage.getItem("token"),
            } as HeadersInit,
        })
            .then(function (res) {
                return res.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((e) => console.log(e));
    });
}

export function get(url: string): Promise<Response> {
    return new Promise((resolve) => {
        fetch(url)
            .then(function (res) {
                return res.json();
            })
            .then((data) => {
                resolve(data);
            })
            .catch((e) => console.log(e));
    });
}
