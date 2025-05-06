import { apiConnector } from "../apiConnector";
import { awardsSectionEndpoints } from "../apis";

const {
    GET_USER_AWARDS_DETAILS,
    ADD_NEW_AWARD_DETAIL,
    UPDATE_EXISTING_AWARD_DETAIL,
    TOGGLE_AWARD_DETAIL_VISIBILITY,
    DELETE_AWARD_DETAIL
} = awardsSectionEndpoints;

export async function getUserAwardsDetails() {
    console.log("Getting Awards details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_AWARDS_DETAILS, {}, {
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

export async function addNewAwardDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Award Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_AWARD_DETAIL, formData, {
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

export async function updateAwardDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Award Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_AWARD_DETAIL}${id}`, formData, {
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

export async function toggleAwardDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Award Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_AWARD_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteAwardDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Award Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_AWARD_DETAIL}${id}`, {}, {
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