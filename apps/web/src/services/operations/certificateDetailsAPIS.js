import { apiConnector } from "../apiConnector";
import { certificatesSectionEndpoints } from "../apis";

const {
    GET_USER_CERTIFICATES_DETAILS,
    ADD_NEW_CERTIFICATE_DETAIL,
    UPDATE_EXISTING_CERTIFICATE_DETAIL,
    TOGGLE_CERTIFICATE_DETAIL_VISIBILITY,
    DELETE_CERTIFICATE_DETAIL
} = certificatesSectionEndpoints;

export async function getUserCertificatesDetails() {
    console.log("Getting Certificates details");
    const token = localStorage.getItem("token");
    try {
        const response = await apiConnector("GET", GET_USER_CERTIFICATES_DETAILS, {}, {
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

export async function addNewCertificateDetail(formData) {
    const token = localStorage.getItem("token")
    console.log("Adding New Certificate Detail");
    try {
        const response = await apiConnector("POST", ADD_NEW_CERTIFICATE_DETAIL, formData, {
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

export async function updateCertificateDetail(formData, id) {
    const token = localStorage.getItem("token")
    console.log("Updating Certificate Detail");
    try {
        const response = await apiConnector("PATCH", `${UPDATE_EXISTING_CERTIFICATE_DETAIL}${id}`, formData, {
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

export async function toggleCertificateDetailVisibility(id) {
    const token = localStorage.getItem("token")
    console.log("toggle Certificate Detail visibility");
    try {
        const response = await apiConnector("PATCH", `${TOGGLE_CERTIFICATE_DETAIL_VISIBILITY}${id}/toggle-visibility`, {}, {
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

export async function deleteCertificateDetail(id) {
    const token = localStorage.getItem("token")
    console.log("Deleting Certificate Detail");
    try {
        const response = await apiConnector("DELETE", `${DELETE_CERTIFICATE_DETAIL}${id}`, {}, {
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