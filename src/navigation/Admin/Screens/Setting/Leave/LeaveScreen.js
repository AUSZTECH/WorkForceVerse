import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Icon
import AntDesign from 'react-native-vector-icons/AntDesign'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Native Base
import { Box, FlatList, Stack, useToast, Fab, Icon, Menu, Button } from 'native-base'

// Redux 
import { connect } from 'react-redux'
import { getAllLeaves } from '../../../../../redux/actions/adminActions'

// Components
import moment from 'moment'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import LeaveCard from '../../../../../components/Cards/LeaveCard'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import BackHeader from '../../../../../components/BackHeader'

const LeaveScreen = (props) => {

    const {
        leaves,
        getAllLeaves
    } = props

    const toast = useToast()
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [refetch, setRefetch] = useState(0)
    const [sortedBy, setSortedBy] = useState()

    navigation.addListener('focus', () => {
        setRefetch(prev => prev + 1)
    })

    const loadLeaves = async (params) => {
        setLoading(true)
        try {
            await getAllLeaves(params)
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
        loadLeaves({
            fromDate: null,
            toDate: null,
            name: '',
        })
    }, [refetch])

    const renderEmployees = () => {
        switch (sortedBy) {
            case 'date':
                return leaves.sort((a, b) => new Date(b.fromDateate) - new Date(a.fromDate));
            case 'name':
                return leaves.sort((a, b) => a.name.localeCompare(b.name));
            default:
                return leaves
        }
    }

    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <Stack space={4} >
                    <BackHeader >Employees Leaves</BackHeader>

                    <ListingOptionsCard
                        totalResults={leaves.length}
                        onFilterPress={() => setShow(true)}
                        sort={<Menu trigger={triggerProps => {
                            return <Button
                                variant={'ghost'}
                                size={'sm'}
                                leftIcon={<Icon as={MaterialCommunityIcons} name={'sort'} />}
                                {...triggerProps}
                            >Sort</Button>
                        }} >
                            <Menu.Item onPress={() => setSortedBy('name')}  >Sort by Name</Menu.Item>
                            <Menu.Item onPress={() => setSortedBy('date')}   >Sort by Date</Menu.Item>
                        </Menu>}
                    />

                    <FlatList
                        data={renderEmployees()}
                        renderItem={({ item, index }) => (
                            <Box variant={'card'} mx={4} my={2} >
                                <LeaveCard data={item} key={index} />
                            </Box>)}
                        keyExtractor={(item) => item.id}
                        ListFooterComponent={<Box mb={'32'} ></Box>}
                        refreshing={loading}
                        onRefresh={() => loadLeaves({
                            fromDate: null,
                            toDate: null,
                            name: '',
                        })}
                    />
                    <FilterModal
                        show={show}
                        setShow={setShow}
                        inputs={[
                            {
                                label: 'Employee Name',
                                key: 'name'
                            },
                            {
                                label: 'From Date',
                                type: 'datetime',
                                mode: 'date',
                                key: 'fromDate',

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
                            { toDate: false }
                        ]}
                        onFilter={(values) => loadLeaves(values)}
                    />
                </Stack>
                <Fab
                    renderInPortal={false}
                    icon={<Icon as={AntDesign} name={'plus'} />}
                    onPress={() => navigation.navigate("Add Leave Screen")}
                />
            </LoadingIndicator>
        </Box>
    )
}


const mapStateToProps = state => {
    return {
        leaves: state.admin.leaves.list
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllLeaves: (data) => dispatch(getAllLeaves(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(LeaveScreen)

