import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Box, Button, Center, IconButton, FlatList, Heading, HStack, Stack, Text, useToast, Fab, Icon, Modal, Menu } from 'native-base'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import BackHeader from '../../../../../components/BackHeader'

// Redux 
import { connect } from 'react-redux'
import { deleteUser, getAllSites, getAllUsers } from '../../../../../redux/actions/adminActions'

const UserScreen = (props) => {

    const {

        users,
        getAllUsers,
        getAllSites,
        sites,
        deleteUser
    } = props
    const toast = useToast()
    const navigation = useNavigation()


    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [deleteID, setDeleteID] = useState(false)
    const [show, setShow] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [sortedBy, setSortedBy] = useState()

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    const loadUsers = async (params) => {
        setLoading(true)
        try {
            await getAllUsers({
                siteId: params.siteId ? siteId : null,
                firstName: params.firstName ? params.firstName : null,
                fromDate: params.fromDate ? params.fromDate : null,
                toDate: params.toDate ? params.toDate : null,
            })
        } catch (e) {
            console.log(e, 'user')
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    const loadData = async () => {
        setLoading(true)
        try {
            await getAllSites({
                name: null,
                fromDate: null,
                toDate: null,
            })
        } catch (e) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteUser(deleteID)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteID(null)
            setDeleteLoading(false)
        }
    }

    useEffect(() => {
        loadUsers({
            siteId: null,
            firstName: null,
            fromDate: null,
            toDate: null,
        })
        loadData()
    }, [refetch])

    const renderUsers = () => {
        switch (sortedBy) {
            case 'date':
                return users.sort((a, b) => new Date(b.date) - new Date(a.date));
            case 'name':
                return users.sort((a, b) => a.firstName.localeCompare(b.firstName));
            default:
                return users
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <Stack space={4} mt={4}>
                    <BackHeader>Users</BackHeader>

                    <ListingOptionsCard
                        totalResults={users.length}
                        onFilterPress={() => setShow(true)}
                        sort={
                            <Menu trigger={triggerProps => {
                                return <Button
                                    variant={'ghost'}
                                    size={'sm'}
                                    leftIcon={<Icon as={MaterialCommunityIcons} name={'sort'} />}
                                    {...triggerProps}
                                >Sort</Button>
                            }} >
                                <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                                <Menu.Item onPress={() => setSortedBy('date')}   >Sort by Date</Menu.Item>
                            </Menu>
                        }
                    />

                    <FlatList
                        data={renderUsers()}
                        renderItem={({ item, index }) => (
                            <Box variant={'card'} mx={4} my={2} key={index} >
                                <HStack space={2} >
                                    <Avatar />
                                    <Stack>
                                        <Heading size={'sm'} >{item.firstName} {item.lastName}</Heading>
                                        <Text fontSize={12} >{item.email}</Text>
                                        <Text fontSize={12} >{item.phone}</Text>
                                    </Stack>
                                </HStack>
                                <Menu
                                    w={'32'}
                                    placement='left'
                                    trigger={triggerProps => {
                                        return <IconButton
                                            icon={<Icon as={Entypo} name={'dots-three-vertical'} />}
                                            position={'absolute'}
                                            right={2}
                                            top={2}
                                            size={'sm'}
                                            {...triggerProps}
                                        />
                                    }}
                                >
                                    <Menu.Item>Details</Menu.Item>
                                    <Menu.Item onPress={() => navigation.navigate('Add User Screen', { updateData: item })} >Edit</Menu.Item>
                                    <Menu.Item onPress={() => setDeleteID(item.id)} >Delete</Menu.Item>
                                </Menu>
                            </Box>
                        )}
                        keyExtractor={(item) => item.id}
                        ListFooterComponent={<Box mb={'32'} ></Box>}
                        refreshing={loading}
                        onRefresh={() => loadUsers({
                            siteId: null,
                            firstName: null,
                            fromDate: null,
                            toDate: null,
                        })}
                    />
                    <FilterModal
                        show={show}
                        setShow={setShow}
                        inputs={[
                            {
                                label: 'Site',
                                type: 'select',
                                values: sites,
                                key: 'siteId',
                                selectLabel: 'name'
                            },
                            {
                                label: 'User Name',
                                key: 'firstName'
                            },
                            {
                                label: 'From Date',
                                type: 'datetime',
                                mode: 'date',
                                key: 'fromDate'
                            },
                            {
                                label: 'To Date',
                                type: 'datetime',
                                mode: 'date',
                                key: 'toDate'
                            }
                        ]}
                        datePickers={[
                            { fromDate: false },
                            { toDate: false },
                        ]}
                        onFilter={(values) => loadUsers(values)}
                    />
                </Stack>

                <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                    <Modal.Content>
                        <Modal.Header>
                            <Heading>Delete User</Heading>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <Text>Are you sure want to delete this user?</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>

                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add User Screen", { updateData: null })}
                />
            </LoadingIndicator>
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        users: state.admin.users,
        sites: state.admin.sites
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllUsers: (data) => dispatch(getAllUsers(data)),
        getAllSites: (data) => dispatch(getAllSites(data)),
        deleteUser: (data) => dispatch(deleteUser(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)

