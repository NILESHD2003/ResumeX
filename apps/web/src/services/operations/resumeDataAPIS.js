import { apiConnector } from "../apiConnector";
import { resumeStoredData } from "../apis";

const {
    GET_USER_ALL_GENERATED_RESUMES,
    GET_USER_SPECIFIC_RESUME
} = resumeStoredData;

export async function getUserAllGeneratedResumes() {
    console.log("Getting All Generated Data");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_ALL_GENERATED_RESUMES, {}, {
            Authorization: `Bearer ${token}`
        })
        if (response.data.success) {
            console.log(response.data.message);
            console.log(token);
            return response.data.data;
        } else {
            console.log(response.data.message);
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getUserSpecificResume(jobId) {
    console.log("Getting Specific Generated Data");
    const token = localStorage.getItem("token");
    const API = GET_USER_SPECIFIC_RESUME + jobId
    try {
        const response = await apiConnector("GET", API, {}, {
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