import { apiConnector } from "../apiConnector";
import { skillsSectionEndpoints } from "../apis";

const {
    GET_USER_SKILLS_DETAILS,
    ADD_NEW_SKILL_DETAIL,
    UPDATE_EXISTING_SKILL_DETAIL,
    TOGGLE_SKILL_DETAIL_VISIBILITY,
    DELETE_SKILL_DETAIL
} = skillsSectionEndpoints;

export async function getUserSkillsDetails() {
    console.log("Getting Skills details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_SKILLS_DETAILS, {}, {
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

export async function addNewSkillDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Skill Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_SKILL_DETAIL, formData, {
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

export async function updateSkillDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Skill Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_SKILL_DETAIL}${id}`, formData, {
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

export async function toggleSkillDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Skill Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_SKILL_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteSkillDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Skill Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_SKILL_DETAIL}${id}`, {}, {
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