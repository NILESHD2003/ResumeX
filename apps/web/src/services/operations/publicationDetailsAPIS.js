import { apiConnector } from "../apiConnector";
import { publicationsSectionEndpoints } from "../apis";

const {
    GET_USER_PUBLICATIONS_DETAILS,
    ADD_NEW_PUBLICATION_DETAIL,
    UPDATE_EXISTING_PUBLICATION_DETAIL,
    TOGGLE_PUBLICATION_DETAIL_VISIBILITY,
    DELETE_PUBLICATION_DETAIL
} = publicationsSectionEndpoints;

export async function getUserPublicationsDetails() {
    console.log("Getting Publications details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_PUBLICATIONS_DETAILS, {}, {
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

export async function addNewPublicationDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Publication Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_PUBLICATION_DETAIL, formData, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            return response.data.data
        } else {
            console.log(response.data.message)
        }
    } catch (error) {
        console.log(error)
    }
}

export async function updatePublicationDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Publication Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_PUBLICATION_DETAIL}${id}`, formData, {
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

export async function togglePublicationDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Publication Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_PUBLICATION_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deletePublicationDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Publication Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_PUBLICATION_DETAIL}${id}`, {}, {
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