import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'
import { createLeave, getAllEmployees } from '../../../../../redux/actions/adminActions'


// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'

const AddLeaveScreen = (props) => {

    const {
        getAllEmployees,
        employees,
        createLeave
    } = props

    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllEmployees({})
        } catch (e) {
            
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>Add Leave</BackHeader>
                <ScrollView>
                    <Stack mx={4} mt={2} >
                        <CreateData
                            saveFunction={createLeave}
                            inputs={[
                                {
                                    label: 'Employee',
                                    type: 'select',
                                    values: employees,
                                    selectLabel: 'name',
                                    key: 'id'
                                },
                                {
                                    label: 'Leave Status',
                                    selectLabel: 'title',
                                    type: 'select',
                                    key: 'status',
                                    values: [{
                                        id: 'Full Day Leave',
                                        title: 'Full Day Leave'
                                    },
                                    {
                                        id: 'Half Day Leave',
                                        title: 'Half Day Leave'
                                    }],
                                },
                                {
                                    label: 'FromDate',
                                    key: 'fromDate',
                                    type: 'datetime',
                                    mode: 'date'

                                },
                                {
                                    label: 'ToDate',
                                    key: 'toDate',
                                    type: 'datetime',
                                    mode: 'date'
                                },
                            ]}
                            datePickers={[
                                { fromDate: false },
                                { toDate: false }
                            ]}

                        />
                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        employees: state.admin.employees,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
        createLeave: (data) => dispatch(createLeave(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddLeaveScreen)