import { apiConnector } from "../apiConnector";
import { organizationsSectionEndpoints } from "../apis";

const {
    GET_USER_ORGANIZATIONS_DETAILS,
    ADD_NEW_ORGANIZATION_DETAIL,
    UPDATE_EXISTING_ORGANIZATION_DETAIL,
    TOGGLE_ORGANIZATION_DETAIL_VISIBILITY,
    DELETE_ORGANIZATION_DETAIL
} = organizationsSectionEndpoints;

export async function getUserOrganizationsDetails() {
    console.log("Getting Organizations details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_ORGANIZATIONS_DETAILS, {}, {
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

export async function addNewOrganizationDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Organization Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_ORGANIZATION_DETAIL, formData, {
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

export async function updateOrganizationDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Organization Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_ORGANIZATION_DETAIL}${id}`, formData, {
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

export async function toggleOrganizationDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Organization Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_ORGANIZATION_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteOrganizationDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Organization Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_ORGANIZATION_DETAIL}${id}`, {}, {
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