import { apiConnector } from "../apiConnector";
import { profileEndpoints } from "../apis";

const {
    GET_USER_PROFILE
} = profileEndpoints;

export async function getProfileDetails() {
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_PROFILE, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.data);
            return response.data.data;
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}