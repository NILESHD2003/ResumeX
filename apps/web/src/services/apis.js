const BASE_URL = import.meta.env.VITE_BACKEND_URL

// AUTH ENDPOINTS
export const authEndpoints = {
    SEND_MAGIC_LINK_API: BASE_URL + "/auth/send-magic-link",
    SIGNUP_API: BASE_URL + "/auth/signup",
    LOGIN_API: BASE_URL + "/auth/login"
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
    GET_USER_PROFILE: BASE_URL + "/profile",
}

// PERSONAL DETAILS ENDPOINTS
export const personalDetailsEndpoints = {
    GET_USER_PERSONAL_DETAILS: BASE_URL + "/profile/personal-details",
    UPDATE_USER_PERSONAL_DETAILS: BASE_URL + "/profile/personal-details",
}

// PROFILE SUMMARY ENDPOINTS
export const profileSummaryEndpoints = {
    GET_USER_PROFILE_SUMMARY: BASE_URL + "/profile/summary",
    UPDATE_USER_PROFILE_SUMMARY: BASE_URL + "/profile/summary",
    TOGGLE_USER_PROFILE_SUMMARY_VISIBILITY: BASE_URL + "/profile/summary",
}

// PROFILE IMAGE ENDPOINTS
export const profileImageEndpoints = {
    GET_USER_PROFILE_IMAGE: BASE_URL + "/profile/image",
    UPDATE_USER_PROFILE_IMAGE: BASE_URL + "/profile/image",
    TOGGLE_USER_PROFILE_IMAGE_VISIBILITY: BASE_URL + "/profile/image",
}

// EDUCATIONAL DETAILS ENDPOINTS
export const educationalDetailsEndpoints = {
    GET_USER_EDUCATION_DETAILS: BASE_URL + "/profile/education-details",
    ADD_NEW_EDUCATION_DETAIL: BASE_URL + "/profile/education-details",
    UPDATE_EXISTING_EDUCATION_DETAIL: BASE_URL + "/profile/education-details/",
    TOGGLE_EDUCATION_DETAIL_VISIBILITY: BASE_URL + "/profile/education-details/",
    DELETE_EDUCATION_DETAIL: BASE_URL + "/profile/education-details/"
}

// PROFFESIONAL EXPERIENCES ENDPOINTS
export const professionalExperienceEndpoints = {
    GET_USER_PROFESSIONAL_EXPERIENCES: BASE_URL + "/profile/professional-experiences",
    ADD_NEW_PROFESSIONAL_EXPERIENCES: BASE_URL + "/profile/professional-experiences",
    UPDATE_EXISTING_PROFESSIONAL_EXPERIENCE: BASE_URL + "/profile/professional-experiences/",
    TOGGLE_PROFESSIONAL_EXPERIENCE_VISIBILITY: BASE_URL + "/profile/professional-experiences/",
    DELETE_PROFESSIONAL_EXPERIENCE: BASE_URL + "/profile/professional-experiences/"
}

// SKILLS SECTION ENDPOINTS
export const skillsSectionEndpoints = {
    GET_USER_SKILLS_DETAILS: BASE_URL + "/profile/skills",
    ADD_NEW_SKILL_DETAIL: BASE_URL + "/profile/skills",
    UPDATE_EXISTING_SKILL_DETAIL: BASE_URL + "/profile/skills/",
    TOGGLE_SKILL_DETAIL_VISIBILITY: BASE_URL + "/profile/skills/",
    DELETE_SKILL_DETAIL: BASE_URL + "/profile/skills/"
}  

// LANGUAGES SECTION
export const languagesSectionEndpoints = {
    GET_USER_LANGUAGES_DETAILS: BASE_URL + "/profile/languages",
    ADD_NEW_LANGUAGE_DETAIL: BASE_URL + "/profile/languages",
    UPDATE_EXISTING_LANGUAGE_DETAIL: BASE_URL + "/profile/languages/",
    TOGGLE_LANGUAGE_DETAIL_VISIBILITY: BASE_URL + "/profile/languages/",
    DELETE_LANGUAGE_DETAIL: BASE_URL + "/profile/languages/"
}  

// CERTIFICATES SECTION
export const certificatesSectionEndpoints = {
    GET_USER_CERTIFICATES_DETAILS: BASE_URL + "/profile/certificates",
    ADD_NEW_CERTIFICATE_DETAIL: BASE_URL + "/profile/certificates",
    UPDATE_EXISTING_CERTIFICATE_DETAIL: BASE_URL + "/profile/certificates/",
    TOGGLE_CERTIFICATE_DETAIL_VISIBILITY: BASE_URL + "/profile/certificates/",
    DELETE_CERTIFICATE_DETAIL: BASE_URL + "/profile/certificates/"
}  

// PROJECTS SECTION
export const projectsSectionEndpoints = {
    GET_USER_PORJECTS_DETAILS: BASE_URL + "/profile/projects",
    ADD_NEW_PROJECT_DETAIL: BASE_URL + "/profile/projects",
    UPDATE_EXISTING_PROJECT_DETAIL: BASE_URL + "/profile/projects/",
    TOGGLE_PROJECT_DETAIL_VISIBILITY: BASE_URL + "/profile/projects/",
    DELETE_PROJECT_DETAIL: BASE_URL + "/profile/projects/"
}  

// AWARDS SECTION
export const awardsSectionEndpoints = {
    GET_USER_AWARDS_DETAILS: BASE_URL + "/profile/awards",
    ADD_NEW_AWARD_DETAIL: BASE_URL + "/profile/awards",
    UPDATE_EXISTING_AWARD_DETAIL: BASE_URL + "/profile/awards/",
    TOGGLE_AWARD_DETAIL_VISIBILITY: BASE_URL + "/profile/awards/",
    DELETE_AWARD_DETAIL: BASE_URL + "/profile/awards/"
}  

// COURSES SECTION
export const coursesSectionEndpoints = {
    GET_USER_COURSES_DETAILS: BASE_URL + "/profile/courses",
    ADD_NEW_COURSE_DETAIL: BASE_URL + "/profile/courses",
    UPDATE_EXISTING_COURSE_DETAIL: BASE_URL + "/profile/courses/",
    TOGGLE_COURSE_DETAIL_VISIBILITY: BASE_URL + "/profile/courses/",
    DELETE_COURSE_DETAIL: BASE_URL + "/profile/courses/"
}  

// ORGANIZATIONS SECTION
export const organizationsSectionEndpoints = {
    GET_USER_ORGANIZATIONS_DETAILS: BASE_URL + "/profile/organizations",
    ADD_NEW_ORGANIZATION_DETAIL: BASE_URL + "/profile/organizations",
    UPDATE_EXISTING_ORGANIZATION_DETAIL: BASE_URL + "/profile/organizations/",
    TOGGLE_ORGANIZATION_DETAIL_VISIBILITY: BASE_URL + "/profile/organizations/",
    DELETE_ORGANIZATION_DETAIL: BASE_URL + "/profile/organizations/"
}  

// PUBLICATIONS SECTION
export const publicationsSectionEndpoints = { 
    GET_USER_PUBLICATIONS_DETAILS: BASE_URL + "/profile/publications",
    ADD_NEW_PUBLICATION_DETAIL: BASE_URL + "/profile/publications",
    UPDATE_EXISTING_PUBLICATION_DETAIL: BASE_URL + "/profile/publications/",
    TOGGLE_PUBLICATION_DETAIL_VISIBILITY: BASE_URL + "/profile/publications/",
    DELETE_PUBLICATION_DETAIL: BASE_URL + "/profile/publications/"
}  

// REFERENCES SECTION
export const referencesSectionEndpoints = {
    GET_USER_REFERENCES_DETAILS: BASE_URL + "/profile/references",
    ADD_NEW_REFERENCE_DETAIL: BASE_URL + "/profile/references",
    UPDATE_EXISTING_REFERENCE_DETAIL: BASE_URL + "/profile/references/",
    TOGGLE_REFERENCE_DETAIL_VISIBILITY: BASE_URL + "/profile/references/",
    DELETE_REFERENCE_DETAIL: BASE_URL + "/profile/references/"
}  

// DECLARATION SECTION
export const declarationSectionEndpoints = {
    GET_USER_DECLARATION_DETAILS: BASE_URL + "/profile/declaration",
    UPDATE_USER_DECLARATION_DETAILS: BASE_URL + "/profile/declaration",
    TOGGLE_DECLARATION_DETAIL_VISIBILITY: BASE_URL + "/profile/declaration/",
    GET_USER_SIGNATURE_IMAGE: BASE_URL + "/profile/declaration/signature",
    UPDATE_USER_SIGNATURE_IMAGE: BASE_URL + "/profile/declaration/signature",
    DELETE_USER_SIGNATURE_IMAGE: BASE_URL + "/profile/declaration/signature"
}  
