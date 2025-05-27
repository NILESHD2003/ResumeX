import { authEndpoints } from "../apis";
// import { toast } from "@/components/ui/sonner"
import { apiConnector } from "../apiConnector";
import { setMagicLink } from "../../slices/authSlices";


const {
    SEND_MAGIC_LINK_API,
    SIGNUP_API,
    LOGIN_API,
} = authEndpoints;

export function sendMagicLink(email, navigate) {
    return async (dispatch) => {
        // const toastId = toast.loading("Signing Up")
        console.log("Statement")
        try {
            const response = await apiConnector("POST", SEND_MAGIC_LINK_API, {
                "email": email,
            })
            if (response.data.success) {
                dispatch(setMagicLink(response.data.data))
                console.log(response.data.data)
                navigate('/create-account')
            } else {
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.log("SEND MAGIC LINK ERROR...", error)
        } 
    }
}

export async function signUp(username, password, confirmPassword, navigate, magicLink) {
    console.log("Signing up");
    const API_LINK = `${SIGNUP_API + "/" + magicLink}`;
    try {
        const response = await apiConnector("POST", API_LINK, {
            "password": password,
            "confirmPassword": confirmPassword,
            "name": username
        })
        if (response.data.success) {
            navigate('/login');
            console.log("Success");
        } else {
            throw new Error(response.data.message)
        }
    } catch (error) {
        console.log("Error Signing Up...", error)
    }
}


export function login(email, password, navigate) {
    return async () => {
        console.log("Loggin in")
        try {
            const response = await apiConnector("POST", LOGIN_API, {
                "email": email,
                "password": password
            })
            if (response.data.success) {
                console.log("Successfully logged in");
                const token = response.data.token;
                localStorage.setItem("token", token);
                navigate('/onboarding');
            } else {
                console.log("error")
                throw new Error(response.data.message)
            }
        } catch (error) {
            console.log("Error logging in", error)
        }
    }
}