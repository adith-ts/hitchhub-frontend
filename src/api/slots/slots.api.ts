import { userAxiosClient } from "../auth/auth.api";

export interface Slot {
    id?: string;
    source: string;
    destination: string;
    dateTime: String;
    availableSeats: number;
    driver: Driver
}
export interface Driver {
    name: string;
    phone: string;
}
export const createSlot = async (slot: Slot) => {
    const response = await userAxiosClient.post('/slots', slot);
    return response.data;
}
export const getSlots = async () => {
    const response = await userAxiosClient.get('/slots');
    return response.data as Slot[];
}
export const deleteSlot = async (id: string) => {
    const response = await userAxiosClient.delete(`/slots/${id}`);
    return response.data;
}