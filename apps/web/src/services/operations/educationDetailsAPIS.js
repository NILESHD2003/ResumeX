import axios from "axios";
import { apiConnector } from "../apiConnector";
import { educationalDetailsEndpoints } from "../apis";

const {
    GET_USER_EDUCATION_DETAILS,
    ADD_NEW_EDUCATION_DETAIL,
    UPDATE_EXISTING_EDUCATION_DETAIL,
    TOGGLE_EDUCATION_DETAIL_VISIBILITY,
    DELETE_EDUCATION_DETAIL,
} = educationalDetailsEndpoints;

export async function getUserEducationDetails() {
    console.log("Getting Education details");
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(GET_USER_EDUCATION_DETAILS, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.data;
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function addNewEducationDetails(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Education Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_EDUCATION_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updateEducationDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Education Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_EDUCATION_DETAIL}${id}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function toggleEducationDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Education Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_EDUCATION_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteEducationDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Education Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_EDUCATION_DETAIL}${id}`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}