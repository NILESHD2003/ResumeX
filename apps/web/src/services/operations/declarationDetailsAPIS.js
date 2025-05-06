import { apiConnector } from "../apiConnector";
import { declarationSectionEndpoints } from "../apis";

const {
    GET_USER_DECLARATION_DETAILS,
    UPDATE_USER_DECLARATION_DETAILS,
    TOGGLE_DECLARATION_DETAIL_VISIBILITY,
    GET_USER_SIGNATURE_IMAGE,
    UPDATE_USER_SIGNATURE_IMAGE,
    DELETE_USER_SIGNATURE_IMAGE
} = declarationSectionEndpoints;

export async function getUserDeclarationsDetails() {
    console.log("Getting Declarations details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_DECLARATION_DETAILS, {}, {
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

export async function updateDeclarationDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Updating Declaration Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_USER_DECLARATION_DETAILS}`, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.success
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function toggleDeclarationDetailVisibility() {
    const token = localStorage.getItem("token")
    console.log("toggle Declaration Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_DECLARATION_DETAIL_VISIBILITY}toggle-visibility`, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.success;
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function deleteDeclarationDetail() {
    const token = localStorage.getItem("token")
    console.log("Deleting Declaration Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_USER_SIGNATURE_IMAGE}`, {}, {
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