import axios from "axios";
import { apiConnector } from "../apiConnector";
import { professionalExperienceEndpoints } from "../apis";

const {
    GET_USER_PROFESSIONAL_EXPERIENCES,
    ADD_NEW_PROFESSIONAL_EXPERIENCES,
    UPDATE_EXISTING_PROFESSIONAL_EXPERIENCE,
    TOGGLE_PROFESSIONAL_EXPERIENCE_VISIBILITY,
    DELETE_PROFESSIONAL_EXPERIENCE
} = professionalExperienceEndpoints;

export async function getUserProfessionalExperiences() {
    console.log("Getting Professional details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_PROFESSIONAL_EXPERIENCES, {}, {
            Authorization: `Bearer ${token}`
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

export async function addNewProfessionalExperience(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Professional Experience");
    try {
        const response = await apiConnector("POST", ADD_NEW_PROFESSIONAL_EXPERIENCES, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.data;
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updateProfessionalExperience(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Professional Experience");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_PROFESSIONAL_EXPERIENCE}${id}`, formData, {
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

export async function toggleProfessionalExperienceVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Education Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_PROFESSIONAL_EXPERIENCE_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteProfessionalExperience(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Education Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_PROFESSIONAL_EXPERIENCE}${id}`, {}, {
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