import { apiConnector } from "../apiConnector";
import { personalDetailsEndpoints } from "../apis";
import axios from "axios";

const {
    GET_USER_PERSONAL_DETAILS,
    UPDATE_USER_PERSONAL_DETAILS
} = personalDetailsEndpoints;

export async function getPersonalDetails() {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(GET_USER_PERSONAL_DETAILS, {
            headers: {
            Authorization: `Bearer ${token}`,
        }
    })
        if (response.data.success) {
            console.log("Data fetched successfully");
            return response.data.data;
        }
    } catch (error) {
        console.log("Data not fetchable...", error)
    }
}

export async function updatePersonalDetails(formData) {
    console.log(formData)
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("PATCH", UPDATE_USER_PERSONAL_DETAILS, formData, {
            Authorization: `Bearer ${token}`,
        })
        if (response.data.success) {
            console.log('Data was updated successfully');
        }
    } catch (error) {
        console.log("Data was not updated", error)
    }
}