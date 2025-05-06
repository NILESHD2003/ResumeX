import { apiConnector } from "../apiConnector";
import { languagesSectionEndpoints } from "../apis";

const {
    GET_USER_LANGUAGES_DETAILS,
    ADD_NEW_LANGUAGE_DETAIL,
    UPDATE_EXISTING_LANGUAGE_DETAIL,
    TOGGLE_LANGUAGE_DETAIL_VISIBILITY,
    DELETE_LANGUAGE_DETAIL
} = languagesSectionEndpoints;

export async function getUserLanguagesDetails() {
    console.log("Getting Languages details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_LANGUAGES_DETAILS, {}, {
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

export async function addNewLanguageDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Language Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_LANGUAGE_DETAIL, formData, {
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

export async function updateLanguageDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Language Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_LANGUAGE_DETAIL}${id}`, formData, {
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

export async function toggleLanguageDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Language Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_LANGUAGE_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteLanguageDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Language Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_LANGUAGE_DETAIL}${id}`, {}, {
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