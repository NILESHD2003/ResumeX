import axios from "axios";
import { apiConnector } from "../apiConnector";
import { profileSummaryEndpoints } from "../apis";

const {
    GET_USER_PROFILE_SUMMARY,
    UPDATE_USER_PROFILE_SUMMARY,
    TOGGLE_USER_PROFILE_SUMMARY_VISIBILITY
} = profileSummaryEndpoints;

export async function getProfileSummaryDetails() {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(GET_USER_PROFILE_SUMMARY,  {
            headers: {
            Authorization: `Bearer ${token}`,
        }
    })
    if (response.data.success) {
        console.log(response.data.data);
        return response.data.data;
    } else {
        console.log(response.data.message);
    }
    } catch (error) {
        console.log("Data was not fetched", error);
    }
}

export async function updateProfileSummaryDetails(summary) {
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("PATCH", UPDATE_USER_PROFILE_SUMMARY, {
            "summary": summary
        }, {
            Authorization: `Bearer ${token}`,
        })
        if (response.data.success) {
            console.log(response.data.message);
        } else {
            console.log(response.data.message)
        }
    } catch(error) {
        confirm.log("Data was not updated", error)
    }
}