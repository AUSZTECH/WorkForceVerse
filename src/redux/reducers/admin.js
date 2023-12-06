import {
    DELETE_EMPLOYEE,
    UPDATE_LEAVE_REQUEST,
    GET_BARCHART_DATA,
    GET_TODAYS_ATTENDANCE,
    GET_ALL_EMPLOYEES,
    GET_ALL_USERS,
    DELETE_USER,
    GET_LEAVE_REQUESTS,
    GET_ALL_LOANS,
    DELETE_LOAN,
    REPAY_LOAN,
    GET_ALL_HOLIDAYS,
    DELETE_HOLIDAY,
    GET_ALL_SITES,
    DELETE_SITE,
    GET_ALL_ANNOUNCEMENT,
    CREATE_ANNOUNCEMENT,
    UPDATE_ANNOUNCEMENT,
    DELETE_ANNOUNCEMENT,
    GET_LOAN_REQUESTS,
    UPDATE_LOAN_REQUEST,
    GET_ALL_LEAVES,
    DELETE_LEAVE,
    CREATE_COMPANY,
    UPDATE_COMPANY,
    DELETE_COMPANY,
    GET_COMPANY_DETAILS,
    UPDATE_COMPANY_DETAILS,
    GET_ALL_ATTENDANCE,
    GET_ABSENT_EMPLOYEES,
    GET_LOAN_TITLES,
    GET_PRESENT_EMPLOYEES,
    GET_LATE_EMPLOYEES,
    GET_LEAVE_EMPLOYEES,
} from "../actions/actionTypes";

const initialState = {
    dashboard: {
        chart: {
            date: [],
            present: [],
            absent: [],
            leave: [],
            late: [],
        },
        stats: {

            details: {
                present: [],
                late: [],
                absent: [],
                leave: [],
            }
        }
    },
    leaves: {
        request: [],
        list: []
    },
    loans: {
        request: [],
        list: [],
        repay: [],
        titles: []
    },
    attendance: [],
    employees: [],
    users: [],
    holidays: [],
    sites: [],
    announcements: []
};

const admin = (state = initialState, action) => {
    switch (action.type) {

        // Dashboard
        case GET_BARCHART_DATA:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    chart: action.payload
                }
            }

        case GET_TODAYS_ATTENDANCE:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    stats: {
                        ...action.payload,
                        ...state.dashboard.stats
                    }
                }
            }

        // Attendance
        case GET_ALL_ATTENDANCE:
            return {
                ...state,
                attendance: action.payload
            }

        case GET_ABSENT_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    stats: {
                        ...state.dashboard.stats,
                        details: {
                            ...state.dashboard.stats.details,
                            absent: action.payload
                        }
                    }
                }
            }

        case GET_PRESENT_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    stats: {
                        ...state.dashboard.stats,
                        details: {
                            ...state.dashboard.stats.details,
                            present: action.payload
                        }
                    }
                }
            }

        case GET_LATE_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    stats: {
                        ...state.dashboard.stats,
                        details: {
                            ...state.dashboard.stats.details,
                            late: action.payload
                        }
                    }
                }
            }

        case GET_LEAVE_EMPLOYEES:
            return {
                ...state,
                dashboard: {
                    ...state.dashboard,
                    stats: {
                        ...state.dashboard.stats,
                        details: {
                            ...state.dashboard.stats.details,
                            leave: action.payload
                        }
                    }
                }
            }

        // Employee
        case GET_ALL_EMPLOYEES:
            return {
                ...state,
                employees: action.payload
            }

        case DELETE_EMPLOYEE:
            return {
                ...state,
                employees: [...state.employees.filter((item) => item.id !== action.payload)]
            }

        // User
        case GET_ALL_USERS:
            return {
                ...state,
                users: action.payload
            }

        case DELETE_USER:
            return {
                ...state,
                users: [...state.users.filter((item) => item.id !== action.payload)]
            }

        // Leave
        case GET_ALL_LEAVES:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    list: action.payload
                }
            }

        case DELETE_LEAVE:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    list: state.leaves.list.filter(item => item.id !== action.payload)
                }
            }

        case GET_LEAVE_REQUESTS:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    request: action.payload
                }
            }

        case UPDATE_LEAVE_REQUEST:
            return {
                ...state,
                leaves: {
                    ...state.leaves,
                    request: state.leaves.request.filter(request => request.id !== action.payload)
                }
            }

        // Loan
        case GET_ALL_LOANS:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    list: action.payload
                }
            }
        case GET_LOAN_TITLES:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    titles: action.payload
                }
            }

        case DELETE_LOAN:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    list: state.loans.list.filter(item => item.id !== action.payload)
                }
            }

        case REPAY_LOAN:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    repay: action.payload
                }
            }

        case GET_LOAN_REQUESTS:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    request: action.payload
                }
            }
        case UPDATE_LOAN_REQUEST:
            return {
                ...state,
                loans: {
                    ...state.loans,
                    request: state.loans.request.filter(request => request.id !== action.payload)
                }

            }

        // Holiday
        case GET_ALL_HOLIDAYS:
            return {
                ...state,
                holidays: action.payload
            }

        case DELETE_HOLIDAY:
            return {
                ...state,
                holidays: state.holidays.filter((item) => item.id !== action.payload)
            }

        // Site
        case GET_ALL_SITES:
            return {
                ...state,
                sites: action.payload
            }

        case DELETE_SITE:
            return {
                ...state,
                sites: state.sites.filter((item) => item.siteId !== action.payload)
            }

        // Announcement
        case GET_ALL_ANNOUNCEMENT:
            return {
                ...state,
                announcements: action.payload
            }

        case CREATE_ANNOUNCEMENT:
            return {
                ...state,
                announcements: [...state.announcements, action.payload]
            }

        case UPDATE_ANNOUNCEMENT:
            return {
                ...state,
                announcements: state.announcements.map((item) => {
                    if (item.id === action.payload.id) {
                        return {
                            ...item,
                            id: action.payload.id,
                            title: action.payload.title,
                            description: action.payload.description,
                            isSend: action.payload.isSend,
                            status: action.payload.status
                        }
                    }
                })
            }
        case DELETE_ANNOUNCEMENT:
            return {
                ...state,
                announcements: state.announcements.filter((item) => item.id !== action.payload)
            }

        // Company
        case CREATE_COMPANY:
            return {
            }
        case UPDATE_COMPANY:
            return {

            }
        case DELETE_COMPANY:
            return {

            }
        case GET_COMPANY_DETAILS:
            return {

            }
        case UPDATE_COMPANY_DETAILS:
            return {

            }

        default:
            return state
    }
}

export default admin