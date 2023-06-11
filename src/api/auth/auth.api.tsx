import axios from "axios";

const masterKey = process.env.NEXT_PUBLIC_MASTER_KEY;
const base = process.env.NEXT_PUBLIC_BASE_URL;

const masterAxiosClient = axios.create({
    baseURL: base,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${masterKey}`
    }
})

let getUserToken = () => {};
if(typeof window !== 'undefined'){
    getUserToken = () => localStorage.getItem('token');
}
let newUserClient = () => axios.create({
    baseURL: base,
    headers: {
        'Authorization': `Bearer ${getUserToken()}`
    }
})

export let userAxiosClient = newUserClient();


export const register = async (email: string, password: string, name: string, phone: string) => {
    const { data } = await masterAxiosClient.post('/users', {
        email,
        password,
        name,
        phone
    })
    return data;
}

export const login = async (email: string, password: string) => {
    const { data } = await axios.post(`${base}/auth`, {
        access_token: masterKey
    }, {
        auth: {
            username: email,
            password: password
        }

    })
    localStorage.setItem('token', data.token);
    userAxiosClient = newUserClient();
    return data;
}

export const whoami = async () => {
    const { data } = await userAxiosClient.get('/users/me')
    return data;
}