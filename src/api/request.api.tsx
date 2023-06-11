import { userAxiosClient } from "./auth/auth.api";
import { Slot } from "./slots/slots.api";

export interface Request {
    id?: string;
    passenger: any;
    slot: Slot;
    status: string;
}
export const createRequest = async (slot: string, passenger: string) => {
    const { data } = await userAxiosClient.post('/requests', {
        slot,
        passenger
    })
    return data;
}

export const getRequests = async () => {
    const { data } = await userAxiosClient.get('/requests')
    return data as Request[];
}

export const updateStatus = async (id: string, status: "rejected" | "accepted") => {
    const { data } = await userAxiosClient.put(`/requests/${id}`, {
        status
    })
    return data;
}