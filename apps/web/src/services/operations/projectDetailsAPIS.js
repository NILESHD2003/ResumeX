import { apiConnector } from "../apiConnector";
import { projectsSectionEndpoints } from "../apis";

const {
    GET_USER_PORJECTS_DETAILS,
    ADD_NEW_PROJECT_DETAIL,
    UPDATE_EXISTING_PROJECT_DETAIL,
    TOGGLE_PROJECT_DETAIL_VISIBILITY,
    DELETE_PROJECT_DETAIL
} = projectsSectionEndpoints;

export async function getUserProjectsDetails() {
    console.log("Getting Projects details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_PORJECTS_DETAILS, {}, {
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

export async function addNewProjectDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Project Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_PROJECT_DETAIL, formData, {
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

export async function updateProjectDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Project Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_PROJECT_DETAIL}${id}`, formData, {
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

export async function toggleProjectDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Project Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_PROJECT_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteProjectDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Project Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_PROJECT_DETAIL}${id}`, {}, {
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