import { apiConnector } from "../apiConnector";
import { coursesSectionEndpoints } from "../apis";

const {
    GET_USER_COURSES_DETAILS,
    ADD_NEW_COURSE_DETAIL,
    UPDATE_EXISTING_COURSE_DETAIL,
    TOGGLE_COURSE_DETAIL_VISIBILITY,
    DELETE_COURSE_DETAIL
} = coursesSectionEndpoints;

export async function getUserCoursesDetails() {
    console.log("Getting Courses details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_COURSES_DETAILS, {}, {
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

export async function addNewCourseDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Course Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_COURSE_DETAIL, formData, {
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

export async function updateCourseDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Course Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_COURSE_DETAIL}${id}`, formData, {
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

export async function toggleCourseDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Course Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_COURSE_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteCourseDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Course Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_COURSE_DETAIL}${id}`, {}, {
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