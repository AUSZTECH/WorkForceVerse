import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect, useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Button, Center, Divider, Fab, FlatList, FormControl, Heading, HStack, Icon, IconButton, Input, Menu, Modal, Stack, Text, useToast } from 'native-base'

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux
import { connect } from 'react-redux'
import { deleteEmployee, getAllEmployees, getAllSites } from '../../../../redux/actions/adminActions'

// Components
import moment from 'moment'
import COLORS from '../../../../theme/COLORS'
import baseURL from '../../../../assets/common/baseURL'
import FilterModal from '../../../../components/FilterModal'
import LoadingIndicator from '../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../components/ListingOptionsCard'
import EmployeeCard from '../../../../components/Cards/EmployeeCard'

const EmployeesScreen = (props) => {

    const {
        employees,
        sites,
        getAllSites,
        getAllEmployees,
        deleteEmployee,
    } = props

    const toast = useToast()
    const navigation = useNavigation()

    const [sortedBy, setSortedBy] = useState();
    const [loading, setLoading] = useState(false)
    const [deleteLoading, setDeleteLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [deleteID, setDeleteID] = useState(null)
    const [refetch, setRefetch] = useState(0)

    useEffect(() => {
        loadEmployees({
            firstName: null,
            fromDate: null,
            toDate: null,
            siteId: null,
        })
        loadData()
    }, [])

    const loadEmployees = async (params) => {
        setLoading(true)
        try {
            await getAllEmployees(params)
        } catch (e) {
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
                fromDate: null,
                toDate: null,
                name: '',
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

    const onDelete = async () => {
        setDeleteLoading(true)
        try {
            await deleteEmployee(deleteID)
            setDeleteID(null)
        } catch (error) {
            console.log(error)
        } finally {
            setDeleteLoading(false)
        }
    }





    const renderEmployees = () => {
        switch (sortedBy) {
            case 'DOJ':
                return employees.sort((a, b) => new Date(b.DOJ) - new Date(a.DOJ));
            case 'name':
                return employees.sort((a, b) => a.firstName.localeCompare(b.firstName));
            default:
                return employees
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <Stack mt={4} space={4} >
                    <Center>
                        <Heading >Employees</Heading>
                    </Center>

                    <ListingOptionsCard
                        totalResults={employees.length}
                        onFilterPress={() => setShow(true)}
                        sort={<Menu trigger={triggerProps => {
                            return <Button
                                variant={'ghost'}
                                size={'sm'}
                                leftIcon={<Icon as={MaterialCommunityIcon} name={'sort'} />}
                                {...triggerProps}
                            >Sort</Button>
                        }} >
                            <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                            <Menu.Item onPress={() => setSortedBy('DOJ')}   >Sort by Date of Joining</Menu.Item>
                        </Menu>}
                    />

                    <FlatList
                        data={renderEmployees()}
                        renderItem={({ item, index }) => (
                            <EmployeeCard
                                data={item}
                                index={index}
                                showMenu
                                onUpdate={() => navigation.navigate('Add Employee Screen', { updateData: item })}
                                onDelete={() => setDeleteID(item.id)}
                            />
                        )}
                        keyExtractor={(item) => item.id}
                        ListFooterComponent={<Box mb={'32'} ></Box>}
                        refreshing={loading}
                        onRefresh={() => loadEmployees({
                            firstName: null,
                            fromDate: null,
                            toDate: null,
                            siteId: null,
                        })}
                    />
                </Stack>

                <FilterModal
                    show={show}
                    setShow={setShow}
                    // loading={true}
                    inputs={[
                        {
                            label: 'Site',
                            type: 'select',
                            values: sites,
                            selectLabel: 'name',
                            key: 'siteId'
                        },
                        {
                            label: 'Employee Name',
                            key: 'name'
                        },
                        {
                            label: 'From Date',
                            type: 'datetime',
                            key: 'fromDate',
                            mode: 'date'
                        },
                        {
                            label: 'To Date',
                            type: 'datetime',
                            key: 'toDate',
                            mode: 'date'
                        }
                    ]}
                    datePickers={[
                        { fromDate: false },
                        { toDate: false }
                    ]}
                    onFilter={(values) => loadEmployees(values)}
                />
                <Modal isOpen={Boolean(deleteID)} onClose={() => setDeleteID(null)} >
                    <Modal.Content>
                        <Modal.Header>
                            <Heading>Delete Employee</Heading>
                            <Modal.CloseButton />
                        </Modal.Header>
                        <Modal.Body>
                            <Text>Are you sure want to delete this employee?</Text>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button colorScheme={'error'} onPress={onDelete} isLoading={deleteLoading}>Delete</Button>
                        </Modal.Footer>
                    </Modal.Content>
                </Modal>
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Employee Screen", { updateData: null })}
                />

            </LoadingIndicator>

        </Box>
    )
}

const mapStateToProps = state => {
    return {
        employees: state.admin.employees,
        sites: state.admin.sites
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllSites: (data) => dispatch(getAllSites(data)),
        getAllEmployees: (data) => dispatch(getAllEmployees(data)),
        deleteEmployee: (data) => dispatch(deleteEmployee(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmployeesScreen)