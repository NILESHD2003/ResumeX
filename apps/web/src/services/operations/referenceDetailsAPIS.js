import { apiConnector } from "../apiConnector";
import { referencesSectionEndpoints } from "../apis";

const {
    GET_USER_REFERENCES_DETAILS,
    ADD_NEW_REFERENCE_DETAIL,
    UPDATE_EXISTING_REFERENCE_DETAIL,
    TOGGLE_REFERENCE_DETAIL_VISIBILITY,
    DELETE_REFERENCE_DETAIL
} = referencesSectionEndpoints;

export async function getUserReferencesDetails() {
    console.log("Getting References details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_REFERENCES_DETAILS, {}, {
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

export async function addNewReferenceDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Reference Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_REFERENCE_DETAIL, formData, {
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

export async function updateReferenceDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Reference Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_REFERENCE_DETAIL}${id}`, formData, {
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

export async function toggleReferenceDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Reference Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_REFERENCE_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteReferenceDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Reference Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_REFERENCE_DETAIL}${id}`, {}, {
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