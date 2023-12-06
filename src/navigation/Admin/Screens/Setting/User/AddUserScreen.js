import React, { useContext, useEffect, useState } from 'react'

// Native Base
import { Box, Center, ScrollView, Stack, useToast } from 'native-base'

// Redux
import { connect } from 'react-redux'


// Components
import BackHeader from '../../../../../components/BackHeader'
import CreateData from '../../../../../components/CreateData'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import { createUser, getAllSites, updateUser } from '../../../../../redux/actions/adminActions'
import withDataLoader from '../../../../../components/withDataLoader'

const AddUserScreen = (props) => {

    const {
        route,
        sites,
        getAllSites,
        createUser,
        updateUser,
    } = props

    const toast = useToast()
    const { updateData } = route.params
    // console.log(updateData,'params')

    const [loading, setLoading] = useState(false)


    const inputs = [
        {
            label: 'Profile Picture',
            type: 'image',
            key: 'image'
        },
        {
            label: 'First Name',
            key: 'firstName'
        },
        {
            label: 'Last Name',
            key: 'lastName'
        },
        {
            label: 'Email',
            key: 'email'
        },
        {
            label: 'Description',
            key: 'description'
        },
        {
            label: 'Password',
            key: 'password'
        },
        {
            label: 'Phone',
            keyboard: 'phone-pad',
            key: 'phone'
        },
        {
            label: 'Role',
            selectLabel: 'title',
            type: 'select',
            key: 'role',
            values: [{
                id: 'SM',
                title: 'Site Manager'
            },
            {
                id: 'EM',
                title: 'Employee'
            }],
        },
        {
            label: 'Site',
            type: 'select',
            values: sites,
            selectLabel: 'name',
            key: 'siteId'
        },
        {
            label: 'Gender',
            selectLabel: 'title',
            type: 'select',
            key: 'gender',
            values: [{
                id: '0',
                title: 'Male'
            },
            {
                id: '1',
                title: 'Female'
            }],
        },
        {
            label: 'Code',
            keyboard: 'numeric',
            key: 'code'
        },
        {
            label: 'Address',
            key: 'address'
        },
        {
            label: 'City',
            key: 'city'
        },
        {
            label: 'Country',
            key: 'country'
        },
        {
            label: 'Zip/Postal Code',
            keyboard: 'numeric',
            key: 'postalCode'
        },

    ]

    const UpdateComponent = updateData ? withDataLoader(CreateData, updateData) : null

    const loadSites = async () => {
        setLoading(true)
        try {
            await getAllSites({
                fromDate: null,
                toDate: null,
                siteName: ''
            })
        } catch (e) {
            console.log(e)
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadSites()
    }, [])

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <BackHeader>{!updateData ? 'Add' : 'Update'} User</BackHeader>
                <ScrollView>
                    <Stack mx={4} mt={2} >
                        {
                            !updateData ? (
                                <CreateData
                                    saveFunction={createUser}
                                    inputs={inputs}
                                />
                            ) : (
                                <UpdateComponent
                                    saveFunction={updateUser}
                                    inputs={inputs}
                                />
                            )
                        }

                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}
const mapStateToProps = state => {
    return {
        sites: state.admin.sites
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getAllSites: (data) => dispatch(getAllSites(data)),
        createUser: (data) => dispatch(createUser(data)),
        updateUser: (data) => dispatch(updateUser(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddUserScreen)