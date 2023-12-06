import moment from "moment";
import API, { apiInstance } from "../../utils/API";
import { formDataInstance } from "../../utils/API";

import {
    GET_BARCHART_DATA,
    GET_LEAVE_REQUESTS,
    UPDATE_LEAVE_REQUEST,
    GET_LOAN_REQUESTS,
    UPDATE_LOAN_REQUEST,
    GET_TODAYS_ATTENDANCE,
    GET_COMPANY_DETAILS,
    UPDATE_COMPANY_DETAILS,
    GET_ALL_EMPLOYEES,
    DELETE_EMPLOYEE,
    GET_ALL_SITES,
    GET_ALL_USERS,
    GET_ALL_ANNOUNCEMENT,
    GET_ALL_ATTENDANCE,
    GET_ABSENT_EMPLOYEES,
    DELETE_LOAN,
    GET_ALL_HOLIDAYS,
    REPAY_LOAN,
    GET_ALL_LEAVES,
    GET_ALL_LOANS,
    GET_LOAN_TITLES,
    GET_ALL_ONTIME,
    DELETE_ANNOUNCEMENT,
    DELETE_HOLIDAY,
    GET_ALL_LATE,
    GET_LEAVE_EMPLOYEES,
    GET_PRESENT_EMPLOYEES,
    GET_LATE_EMPLOYEES,
    DELETE_SITE
} from "./actionTypes";

/*
  Dashboard
*/

export const getDashboardData = (data) => async (dispatch, getState) => {

    const { fromDate, toDate, name } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/DashboardData',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: name,
            }
        })
        if (res.responseMsg == 'Dashboard Data Displayed Successfully') {
            dispatch({
                type: GET_TODAYS_ATTENDANCE,
                payload: {
                    present: res.result.present,
                    absent: res.result.absent,
                    leave: res.result.leave,
                    late: res.result.late
                }
            })
        } else {
            return new Error('Network Error')
        }
        return { abortController }
    }
    catch (error) {
        throw new Error(error)
    }
}


export const getBarChartData = () => async (dispatch, getState) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Dashboard/DashboardChart',
            requireAuth: true,
        })
        if (res.responseMsg == 'Dashboard Chart Data Displayed Successfully') {
            dispatch({
                type: GET_BARCHART_DATA,
                payload: {
                    present: res.result?.map((item) => item.present),
                    absent: res.result?.map((item) => item.absent),
                    leave: res.result?.map((item) => item.leave),
                    late: res.result?.map((item) => item.late),
                    date: res.result?.map((item) => item.date),
                }
            })
        } else {
            return new Error('Network Error')
        }
        return { abortController }
    }
    catch (error) {
        throw new Error('')
    }
}

export const getLeaveRequests = (data) => async (dispatch, getState) => {

    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Leave/PendingLeaveLists',
            requireAuth: true,
        })
        if (res.responseMsg === 'Leave List Displayed Successfully') {
            dispatch({
                type: GET_LEAVE_REQUESTS,
                payload: res.result?.map((item) => ({
                    id: item.leaveId,
                    name: item.firstName,
                    status: item.leaveDuration,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    reason: item.leaveReason,
                    isApproved: item.leaveStatus
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

export const updateLeaveRequest = (data) => async (dispatch, getState) => {

    const { id, status, reason } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Leave/LeaveDecision',
            requireAuth: true,
            requestConfig: {
                leaveId: id,
                leaveStatus: status,
                rejectReason: reason,
            }
        })
        if (res.responseMsg == 'Employee Leave Approved Successfully' || res.responseMsg == 'Employee Leave Reject Successfully') {
            dispatch({
                type: UPDATE_LEAVE_REQUEST,
                payload: id
            })
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const getLoanRequests = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Loan/PendingLoanList',
            requrieAuth: true
        })
        if (res.responseMsg == 'Pending Loan Lists Displayed Successfully') {
            dispatch({
                type: GET_LOAN_REQUESTS,
                payload: res.result?.map((item) => ({
                    id: item.requestId,
                    name: item.firstName,
                    amount: item.loanAmount,
                    status: item.loanStatus,
                    loanDate: item.loanDate,
                    tenure: item.loanReason
                }))
            })
        }
        else {
            return new Error('Network Error')
        }
        return { abortController }
    } catch (error) {
        throw new Error(error)
    }
}

export const updateLoanRequest = (data) => async (dispatch, getState) => {

    const { id, status, amount, tenure } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanDecision',
            requrieAuth: true,
            requestConfig: {
                requestId: id,
                loanStatus: status,
                loanAmount: amount,
                loanReason: tenure
            }
        })
        if (res.responseMsg == 'Loan Approved Successfully' || res.responseMsg == 'Loan Reject Successfully') {
            dispatch({
                type: UPDATE_LOAN_REQUEST,
                payload: id
            })
        }
        else {
            throw new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getHolidayStatus = (data) => async (dispatch) => {

    const { fromDate, toDate, employeeName, attendancestatus } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/HolidayStatus',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: employeeName,
                attendancestatus: attendancestatus
            }
        })
        dispatch({
            type: GET_ABSENT_EMPLOYEES,
            payload: res.responseData?.map((item) => ({
                name: item.firstName,
                email: item.email,
                image: item.image
            }))
        })
    } catch (error) {
        throw new Error('Error in fetching todays attendance')
    }
}


/*
   Attendance
 */
export const getAllAttendance = (data) => async (dispatch) => {

    const { fromDate, toDate, name } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Attendance/AttendanceList',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: name,

            }
        })
        if (res.responseMsg == 'Attendance List Displayed Successfully') {
            dispatch({
                type: GET_ALL_ATTENDANCE,
                payload: res.result?.map((item) => ({
                    workingTime: item.workingTime,
                    breakTime: item.totalBreakTime,
                    onTime: item.isOnTime,
                    allocateHours: item.allocateHours,
                    checkInImage: item.checkInImage,
                    checkOutImage: item.checkInImage,
                    checkInLatitude: item.checkInLatitude,
                    checkOutLatitude: item.checkOutLatitude,
                    checkOutLongitude: item.checkOutLongitude,
                    checkInLongitude: item.checkInLongitude,
                    reason: item.earlyCheckOutReason,
                    name: item.employeeName,
                    checkOutTime: item.checkOutTime,
                    checkInTime: item.checkInTime,
                    email: item.emailEmployee
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}
export const getDailyAttendance = (data) => async (dispatch) => {

    const { fromDate, toDate, name, status } = data
    console.log(data)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/GetPresentAndLateEmployees',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: name,
                status: status
            }
        })
        if (res.responseMsg == 'Attendance list of Employees Displayed Successfully') {
            if (status == 'Present') {
                dispatch({
                    type: GET_PRESENT_EMPLOYEES,
                    payload: res.result?.map((item) => ({
                        workingTime: item.workingTime,
                        breakTime: item.totalBreakTime,
                        onTime: item.isOnTime,
                        allocateHours: item.allocateHours,
                        checkInImage: item.checkInImage,
                        checkOutImage: item.checkInImage,
                        checkInLatitude: item.checkInLatitude,
                        checkOutLatitude: item.checkOutLatitude,
                        checkOutLongitude: item.checkOutLongitude,
                        checkInLongitude: item.checkInLongitude,
                        reason: item.earlyCheckOutReason,
                        name: item.employeeName,
                        checkOutTime: item.checkOutTime,
                        checkInTime: item.checkInTime,
                        email: item.emailEmployee
                    }))
                })
            } else if (status == 'Late') {
                dispatch({
                    type: GET_LATE_EMPLOYEES,
                    payload: res.result?.map((item) => ({
                        workingTime: item.workingTime,
                        breakTime: item.totalBreakTime,
                        onTime: item.isOnTime,
                        allocateHours: item.allocateHours,
                        checkInImage: item.checkInImage,
                        checkOutImage: item.checkInImage,
                        checkInLatitude: item.checkInLatitude,
                        checkOutLatitude: item.checkOutLatitude,
                        checkOutLongitude: item.checkOutLongitude,
                        checkInLongitude: item.checkInLongitude,
                        reason: item.earlyCheckOutReason,
                        name: item.employeeName,
                        checkOutTime: item.checkOutTime,
                        checkInTime: item.checkInTime,
                        email: item.emailEmployee
                    }))
                })
            }
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const getDailyAbsent = (data) => async (dispatch) => {

    const { fromDate, toDate, name, status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Dashboard/GetAbsentAndOnLeaveEmployees',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: name,
                status: status
            }
        })
        if (res.responseMsg == 'Employee list Displayed Successfully') {
            if (status == 'Absent') {
                dispatch({
                    type: GET_ABSENT_EMPLOYEES,
                    payload: res.result.map((item) => ({
                        name: item.firstName,
                        image: item.image,
                        email: item.email,
                        isActive: 1
                    }))
                })
            } else {
                dispatch({
                    type: GET_LEAVE_EMPLOYEES,
                    payload: res.result?.map((item) => ({
                        name: item.firstName,
                        image: item.image,
                        email: item.email,
                        isActive: 1
                    }))
                })
            }
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const markAttendance = (data) => async (dispatch) => {
    try {
        const {
            image,
            employeeCode,
            mode,
            latitude,
            longitude
        } = data
        const time = new Date().toString()
        const formData = new FormData()
        formData.append('Image', image)
        formData.append('EmployeeCode', employeeCode)
        formData.append('Mode', mode)
        formData.append('AttendanceTime', time)
        if (mode === 'Check-In') {
            formData.append('CheckInLatitude', latitude)
            formData.append('CheckInLongitude', longitude)
            formData.append('CheckOutLatitude', null)
            formData.append('CheckOutLongitude', null)
        } else if (mode === 'Check-Out') {
            formData.append('CheckInLatitude', null)
            formData.append('CheckInLongitude', null)
            formData.append('CheckOutLatitude', latitude)
            formData.append('CheckOutLongitude', longitude)
        }
        console.log(formData)
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Attendance/MarkAttendance',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        return res.responseMsg
    } catch (error) {
        throw new Error(error)
    }
}

export const earlyCheckOutReason = (data) => async (dispatch) => {
    const { code, reason } = data
    try {
        const { data: res, abortController } = await API({
            instance: apiInstance,
            method: 'POST',
            url: 'api/Attendance/EarlyCheckOutReason',
            requireAuth: true,
            requestConfig: {
                employeeCode: code,
                earlyCheckOutReason: reason,
            }
        })
        return res.responseMsg
    } catch (error) {
        throw new Error(error)
    }
}



/*
  Company
*/

export const getCompanyDetails = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Company/CompanyList',
            requireAuth: true,
        })
        dispatch({
            type: GET_COMPANY_DETAILS,
            payload: res.responseData
        })
    } catch (error) {
        throw new Error('Error in fetching company details')
    }
}

// FormDataApi

export const updateCompanyDetails = (data) => async (dispatch) => {


    const formData = new FormData()
    data.CompanyId && formData.append('CompanyId', data.CompanyId)
    data.CompanyLogo && formData.append('Image', data.CompanyLogo)
    data.CompanyName && formData.append('CompanyName', data.CompanyName)
    data.CompanyCode && formData.append('CompanyCode', data.CompanyCode)
    data.CompanyEmail && formData.append('CompanyEmail', data.CompanyEmail)
    data.CompanyMobile && formData.append('CompanyMobile', data.CompanyMobile)
    data.CompanyAddress1 && formData.append('CompanyAddress1', data.CompanyAddress1)
    data.CompanyCity && formData.append('CompanyCity', data.CompanyCity)
    data.CompanyCountry && formData.append('CompanyCountry', data.CompanyCountry)
    data.CompanyNote && formData.append('CompanyNote', data.CompanyNote)
    data.smtpEmail && formData.append('CompanySMTPEmail', data.smtpEmail)
    data.smtpPort && formData.append('CompanySMTPPort', data.smtpPort)
    data.smtpURL && formData.append('CompanySMTPURL', data.smtpURL)
    data.smtpPassword && formData.append('CompanySMTPPassword', data.smtpPassword)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Company/UpdateCompany',
            requireAuth: true,
            isFormData: true,
            requestConfig: formData
        })
        console.log(res)
        dispatch({
            type: UPDATE_COMPANY_DETAILS,
            payload: res.responseData
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteCompany = () => async () => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Company/DeleteCompany`
        })
    } catch (error) {
        throw new Error('Error in Deleteing')
    }
}

/*
  Employees Actions
*/

export const getAllEmployees = (data) => async (dispatch) => {
    const { name, fromDate, toDate, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/EmployeeList',
            requireAuth: true,
            requestConfig: {
                employee_Name: name,
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId
            }
        })
        if (res.responseMsg == 'Employee List Displayed Successfully') {
            dispatch({
                type: GET_ALL_EMPLOYEES,
                payload: res.result?.map((item) => ({
                    id: item.employeeId,
                    userID: item.employeeUserId,
                    name: `${item.firstName} ${item.lastName}`,
                    firstName: item.firstName,
                    lastName: item.lastName,
                    checkoutReason: item.checkOutReason,
                    allocateLeave: item.annualLeaves,
                    email: item.email,
                    gender: item.gender,
                    password: item.password,
                    phone: item.contactNumber,
                    address: item.addresses,
                    code: item.employeeCode,
                    DOB: item.dateOfBirth,
                    city: item.city,
                    department: item.departmentName,
                    image: item.image,
                    startTime: item.startTime,
                    workingHours: item.workingHours,
                    isActive: item.activeBit,
                    DOJ: item.createdDate,
                    companyId: item.companyId,
                    siteId: item.siteId,
                    jobTitle: item.jobTitle
                }))
            })
        }
        else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

export const createEmployee = (data) => async (dispatch, getState) => {
    // console.log(data)
    const formData = new FormData();
    if (data.image) {
        formData.append('Image', data.image);
    }
    data.firstName && formData.append('FirstName', data.firstName);
    data.lastName && formData.append('LastName', data.lastName);
    data.email && formData.append('Email', data.email);
    data.phone && formData.append('ContactNumber', data.phone);
    data.jobTitle && formData.append('JobTitle', data.jobTitle);
    data.address && formData.append('Addresses', data.address);
    // data.department && formData.append('Department', data.department);
    data.city && formData.append('City', data.city);
    data.code && formData.append('EmployeeCode', data.code);
    data.startTime && formData.append('StartTime', data.startTime ? moment(data.startTime).format('hh:mm:ss A') : '');
    data.workingHours && formData.append('WorkingHours', data.workingHours);
    data.allocateLeave && formData.append('AnnualLeaves', data.allocateLeave);
    data.siteId && formData.append('SiteId', data.siteId);
    data.password && formData.append('Password', data.password);
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/AddEmployee',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        // console.log(res)
        if (res.responseData === 'Employee Email already Exists' || res.responseData === 'Employee Code already Exists') {
            return false
        } else {
            return true
        }
    }
    catch (e) {
        throw new Error(e)
    }
}

// FormDataApi
export const updateEmployee = (data) => async (dispatch, getState) => {
    // console.log(data)
    const formData = new FormData();

    if (data.image) {
        formData.append('Image', data.image);
    }
    data.firstName && formData.append('FirstName', data.firstName);
    data.lastName && formData.append('LastName', data.lastName);
    data.email && formData.append('Email', data.email);
    data.phone && formData.append('ContactNumber', data.phone);
    data.jobTitle && formData.append('JobTitle', data.jobTitle);
    data.address && formData.append('Addresses', data.address);
    data.department && formData.append('Department', data.department);
    data.city && formData.append('City', data.city);
    data.code && formData.append('EmployeeCode', data.code);
    data.startTime && formData.append('StartTime', data.startTime ? moment(data.startTime).format('hh:mm:ss A') : '');
    data.workingHours && formData.append('WorkingHours', data.workingHours);
    data.allocateLeave && formData.append('AnnualLeaves', data.allocateLeave);
    data.siteId && formData.append('SiteId', data.siteId);
    data.password && formData.append('Password', data.password);
    if (data.id) {
        formData.append('EmployeeId', data.id);
    }

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Employee/UpdateEmployee',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        // console.log(res)
        if (res.responseData === 'Employee Email already Exists' || res.responseData === 'Employee Code already Exists') {
            return false
        } else {
            return true
        }
    }
    catch (e) {
        console.log(e)
        throw new Error('Error in adding employee')
    }
}

export const deleteEmployee = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Employee/DeleteEmployee?EmployeeId=${deleteID}`,
            requireAuth: true,
        })
        dispatch({
            type: DELETE_EMPLOYEE,
            payload: deleteID
        })
    }
    catch (e) {
        throw new Error('Error in delete')
    }
}





/*
  Leaves
*/
export const getAllLeaves = (data) => async (dispatch) => {
    const { name, fromDate, toDate } = data
    console.log(data)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Leave/EmployeeLeaveList',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employee_Name: name
            }
        })

        if (res.responseMsg == 'Employee Leave List Displayed Successfully') {
            dispatch({
                type: GET_ALL_LEAVES,
                payload: res.result?.map((item) => ({
                    id: item.leaveId,
                    name: item.firstName,
                    status: item.leaveDuration,
                    isApproved: item.leaveStatus,
                    reason: item.leaveReason,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    employeeName: item.firstName,
                }))
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }

}
export const createLeave = (data) => async (dispatch) => {
    const { id, fromDate, toDate, status } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Leave/MarkLeave',
            requireAuth: true,
            requestConfig: {
                fromDate: fromDate,
                toDate: toDate,
                employeeId: id,
                leaveDuration: status,
                leaveReason: '',
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

/*
 Public holiday
*/

export const getAllHolidays = (data) => async (dispatch) => {
    const { name, fromDate, toDate } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Holiday/HolidayList',
            requireAuth: true,
            requestConfig: {
                holidayName: name,
                fromDate: fromDate,
                toDate: toDate,
            }
        })
        if (res.responseMsg == 'Holiday List Displayed Successfully') {
            dispatch({
                type: GET_ALL_HOLIDAYS,
                payload: res.result?.map((item) => ({
                    id: item.holidayId,
                    name: item.holidayName,
                    fromDate: item.fromDate,
                    toDate: item.toDate,
                    description: item.description
                }))
            })
        } else {
            return new Error('Network Error')
        }

    } catch (error) {
        // console.log(error)
        throw new Error(error)
    }

}


export const createPublicHolidays = (data) => async (dispatch) => {
    const { name, fromDate, toDate, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Holiday/AddHoliday',
            requireAuth: true,
            requestConfig: {
                holidayId: null,
                holidayName: name,
                fromDate: fromDate,
                toDate: toDate,
                description: description
            }
        })
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }

}

export const updatePublicHolidays = (data) => async (dispatch) => {

    const { name, fromDate, toDate, id, description } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Holiday/UpdateHoliday',
            requireAuth: true,
            requestConfig: {
                holidayId: id ? id : null,
                holidayName: name,
                fromDate: fromDate,
                toDate: toDate,
                description: description
            }
        })
    } catch (error) {
        throw new Error(error)
    }

}

export const deletePublicHoliday = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Holiday/DeleteHoliday?HolidayId=${deleteID}`,
            requireAuth: true,
        })
        if (res.responseMsg == 'Holiday Deleted Successfully') {
            dispatch({
                type: DELETE_HOLIDAY,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        throw new Error('Error in delete')
    }
}

/* 
  Loan
*/
export const getAllLoans = (data) => async (dispatch) => {
    const { name, loanDate } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanList',
            requrieAuth: true,
            requestConfig: {
                employeeName: name,
                loanDate: loanDate
            }
        })
        if (res.responseMsg == 'Loan list Displayed Successfully') {
            dispatch({
                type: GET_ALL_LOANS,
                payload: res.result?.map((item) => ({
                    id: item.loanId,
                    name:item.firstName,
                    employeeId: item.employeeId,
                    amount: item.loanAmount,
                    remaingAmount: item.outstandingAmount,
                    paidAmount: item.paidAmount,
                    tenure: item.loanReason,
                    title: item.loanTitleId,
                    status: item.loanStatus,
                    date: item.loanDate
                }))
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const createLoan = (data) => async (dispatch) => {

    const { id, employeeId, amount, title, date, reason, status } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/AddLoan',
            requireAuth: true,
            requestConfig: {
                loanId: null,
                employeeId: employeeId,
                loanAmount: amount,
                loanDate: date,
                loanTitleId: title,
                loanReason: reason,
                loanStatus: status,
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const updateLoan = (data) => async (dispatch) => {

    const { id, employeeId, amount, title, date, reason, status } = data


    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/UpdateLoan',
            requireAuth: true,
            requestConfig: {
                loanId: id,
                employeeId: employeeId,
                loanAmount: amount,
                loanDate: date,
                loanTitleId: title,
                loanReason: reason,
                loanStatus: status,
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const getLoanDetails = (data) => async (dispatch) => {

    const { id } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Loan/LoanDetailList?LoanId=${id}`,
            requireAuth: true,
        })
        console.log(res)
        if (res.responseMsg == 'Loan Detail List Displayed Successfully') {
            dispatch({
                type: REPAY_LOAN,
                payload: res.result?.map((item) => ({
                    amount: item.repayAmount,
                    date: item.repayDate,
                    paid: item.payAmount,
                    remaining: item.outstandingAmount,
                    tenure: item.loanReason
                }))
            })
        } else {
            throw new Error('Network Error')
        }

    } catch (error) {
        throw new Error(error)
    }
}

export const getLoanTitle = () => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanTitleList',
            requireAuth: true,
        })
        console.log(res,'response')
        dispatch({
            type: GET_LOAN_TITLES,
            payload: res.result?.map((item) => ({
                title: item.loanTitle,
                id: item.loanTitleId,
            }))
        })
    } catch (error) {
        throw new Error(error)
    }
}

export const repayLoan = (data) => async (dispatch) => {

    const { id, amount, fromDate } = data

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Loan/LoanPayment',
            requireAuth: true,
            requestConfig: {
                loanId: id,
                payAmount: amount,
                repayDate: fromDate
            }
        })
    } catch (error) {
        throw new Error(error)
    }
}



export const deleteLoan = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Loan/DeleteLoan?LoanId=${deleteID}`,
            requireAuth: true
        })
        dispatch({
            type: DELETE_LOAN,
            payload: deleteID
        })

    } catch (error) {
        throw new Error('Error in loan list')
    }
}



/*
  Sites
*/
export const getAllSites = (data) => async (dispatch) => {
    const { name, fromDate, toDate } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Site/SiteList',
            requireAuth: true,
            requestConfig: {
                siteName: name,
                fromDate: fromDate,
                toDate: toDate
            }
        })
        if (res.responseMsg == 'Site List Displayed Successfully') {
            dispatch({
                type: GET_ALL_SITES,
                payload: res.result?.map((item) => ({
                    logo: item.siteLogo,
                    siteId: item.siteId,
                    name: item.siteName,
                    code: item.siteCode,
                    note: item.siteNote,
                    email: item.siteEmail,
                    address: item.siteAddress1,
                    city: item.siteCity,
                    postalCode: item.siteZipPostalCode,
                    phone: item.siteContact,
                    country: item.siteCountry,
                    date: item.createdDate
                }))
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

// FormApi
export const createSite = (data) => async (dispatch) => {

    const formData = new FormData()
    data.logo && formData.append('SiteImage', data.logo)
    data.name && formData.append('SiteName', data.name)
    data.code && formData.append('SiteCode', data.code)
    data.note && formData.append('SiteNote', data.note)
    data.email && formData.append('SiteEmail', data.email)
    data.address && formData.append('SiteAddress1', data.address)
    data.city && formData.append('SiteCity', data.city)
    data.postalcode && formData.append('SiteZipPostalCode', data.postalCode)
    data.phone && formData.append('SitePhone', data.phone)
    data.country && formData.append('SiteCountry', data.country)

    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Site/AddSite',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData,
        })
        console.log(res)
    } catch (error) {
        throw new Error('error')
    }
}
// Formapi
export const updateSite = (data) => async (dispatch) => {

    const formData = new FormData()
    data.logo && formData.append('SiteImage', data.logo)
    data.name && formData.append('SiteName', data.name)
    data.code && formData.append('SiteCode', data.code)
    data.note && formData.append('SiteNote', data.note)
    data.email && formData.append('SiteEmail', data.email)
    data.address && formData.append('SiteAddress1', data.address)
    data.city && formData.append('SiteCity', data.city)
    data.postalcode && formData.append('SiteZipPostalCode', data.postalCode)
    data.phone && formData.append('SitePhone', data.phone)
    data.country && formData.append('SiteCountry', data.country)
    data.siteId && formData.append('SiteId', data.siteId)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Site/UpdateSite',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData,
        })
        console.log(res)
        if (res.responseData == 'Site Updated Successfully') {
            return res.responseMsg
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        throw new Error(error)
    }
}

export const deleteSite = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Site/DeleteSite?SiteId=${deleteID}`,
            requireAuth: true,
        })
        if(res.responseMsg=='Site Deleted Successfully'){
            dispatch({
                type:DELETE_SITE,
                payload:deleteID
            })
        }
    } catch (error) {
        throw new Error('Error in fetch sites')
    }
}

/* 
  Users
*/
export const getAllUsers = (data) => async (dispatch, getState) => {
    const { firstName, fromDate, toDate, siteId } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/User/UserList',
            requireAuth: true,
            requestConfig: {
                user_Name: firstName,
                fromDate: fromDate,
                toDate: toDate,
                siteId: siteId
            }
        })
        // console.log(res)
        if (res.responseMsg == 'User List Displayed Successfully') {
            dispatch({
                type: GET_ALL_USERS,
                payload: res.result?.map((item) => ({
                    id: item.userId,
                    firstName: item.userFirstName,
                    lastName: item.userLastName,
                    name: `${item.userFirstName} ${item.userLastName}`,
                    email: item.userEmail,
                    password: item.password,
                    description: item.userDescription,
                    phone: item.phone,
                    roleId: item.roleId,
                    site: item.side,
                    postalCode: item.userZipPostalCode,
                    country: item.userCountry,
                    gender: item.genderId,
                    city: item.userCity,
                    image: item.file,
                    siteId: item.siteId,
                    date: item.createdDate
                }))
            })
        } else {
            return new Error('Network Error')
        }
    }
    catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

export const createUser = (data) => async (dispatch, getState) => {
    const formData = new FormData()
    if (data.image) {
        formData.append('file', data.image)
    }
    data.firstName && formData.append('UserFirstName', data.firstName)
    data.lastName && formData.append('UserLastName', data.lastName)
    data.description && formData.append('UserDescription', data.description)
    data.email && formData.append('UserEmail', data.email)
    data.site && formData.append('SiteId', data.site)
    data.gender && formData.append('GenderId', data.gender)
    data.role && formData.append('RoleCode', data.role)
    data.code && formData.append('Code', data.code)
    data.phone && formData.append('UserPhone', data.phone)
    data.address && formData.append('UserAddress1', data.address)
    data.city && formData.append('UserCity', data.city)
    data.country && formData.append('UserCountry', data.country)
    data.postalCode && formData.append('UserZipPostalCode', data.postalCode)
    data.password && formData.append('UserPassword', data.password)
    console.log(formData)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/User/AddUser',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        console.log(res)
    }
    catch (e) {
        console.log(e)
        throw new Error('Error in adding user')
    }
}

// Formdata
export const updateUser = (data) => async (dispatch, getState) => {
    const formData = new FormData()
    if (data.image) {
        formData.append('file', data.image)
    }
    data.id && formData.append('UserId', data.id)
    data.firstName && formData.append('UserFirstName', data.firstName)
    data.lastName && formData.append('UserLastName', data.lastName)
    data.description && formData.append('UserDescription', data.description)
    data.email && formData.append('UserEmail', data.email)
    data.site && formData.append('SiteId', data.site)
    data.gender && formData.append('GenderId', data.gender)
    data.role && formData.append('RoleCode', data.role)
    data.code && formData.append('Code', data.code)
    data.phone && formData.append('UserPhone', data.phone)
    data.address && formData.append('UserAddress1', data.address)
    data.city && formData.append('UserCity', data.city)
    data.country && formData.append('UserCountry', data.country)
    data.postalCode && formData.append('UserZipPostalCode', data.postalCode)
    data.password && formData.append('UserPassword', data.password)
    console.log(formData)
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/User/UpdateUser',
            requireAuth: true,
            instance: formDataInstance,
            requestConfig: formData
        })
        console.log(res)
    }
    catch (e) {
        throw new Error(e)
    }
}

export const deleteUser = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/User/DeleteUser?UserId=${deleteID}`
        })
    }
    catch (e) {
        throw new Error('Error in delete')
    }
}

/* 
  Announcement
*/
export const getAllAnnouncement = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'GET',
            url: 'api/Announcement/GetAllAnnouncements',
            requireAuth: true,
        })
        if (res.responseMsg == 'Announcement List Displayed Successfully') {
            dispatch({
                type: GET_ALL_ANNOUNCEMENT,
                payload: res.result?.map((item, index) => (
                    {
                        id: item.announcementId,
                        title: item.announcementTitle,
                        description: item.announcementDescription,
                        isSend: item.isSend,
                        status: item.status
                    }
                ))
            })
        }
        else {
            return new Error('Network Error')
        }
    } catch (error) {
        console.log(error)
        throw new Error('')
    }
}

export const createAnnouncement = (data) => async (dispatch) => {
    const { id, title, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/CreateAnnouncement',
            requireAuth: true,
            requestConfig: {
                announcementId: id ? id : 0,
                announcementTitle: title,
                announcementDescription: description
            }
        })
    } catch (error) {
        return new Error('Network Error');
    }
}

export const updateAnnouncement = (data) => async (dispatch) => {
    const { id, title, description } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/UpdateAnnouncement',
            requireAuth: true,
            requestConfig: {
                announcementId: id ? id : 0,
                announcementTitle: title,
                announcementDescription: description
            }
        });

    } catch (error) {
        return new Error('Network Error');
    }
}

export const deleteAnnouncement = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Announcement/DeleteAnnouncement?AnnouncementId=${deleteID}`,
        })
        console.log(res)
        if (res.responseMsg == 'Announcement Deleted Successfully') {
            dispatch({
                type: DELETE_ANNOUNCEMENT,
                payload: deleteID
            })
        } else {
            return new Error('Network Error')
        }
    } catch (error) {
        console.error(error);
        throw new Error('Network Error or other error occurred')
    }
}

export const getAnnouncementNotification = () => async () => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Announcement/GetAnnouncementNotification',
        })
    } catch (error) {
        console.error(error);
        throw new Error('Network Error or other error occurred')
    }
}

// Task

export const getAllTask = (data) => async (dispatch) => {
    const { taskName, status, toDate } = data
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/TaskList',
            requireAuth: true,
            requestConfig: {
                taskName: taskName,
                status: status,
                toDate: toDate,
            }
        })
        dispatch({
            type: GET_ALL_ANNOUNCEMENT,
            payload: res.responseData
        })

    } catch (error) {
        return new Error('Network Error')
    } finally {
        throw new Error('Error in fetch Announcement')
    }
}

// formData
export const createTask = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/AddTask',
            instance: formDataAPI,
            requireAuth: true,
            requestConfig: formData
        });

    } catch (error) {
        return new Error('Network Error');
    }
}

// formData
export const updateTask = (data) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: 'api/Task/UpdateTask',
            instance: formDataAPI,
            requireAuth: true,
            requestConfig: formData
        });

    } catch (error) {
        return new Error('Network Error');
    }
}

export const deleteTask = (deleteID) => async (dispatch) => {
    try {
        const { data: res, abortController } = await API({
            method: 'POST',
            url: `api/Task/DeleteTask?TaskId=${deleteID}`,
            requireAuth: true
        })

    } catch (error) {
        console.error(error);
        throw new Error('Network Error or other error occurred')
    }
}

/*
  Biometric 
*/

