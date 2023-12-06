import React, { useCallback, useEffect, useState } from 'react'
import { useFocusEffect } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Icon, Divider, FlatList, Heading, Button, Stack, Menu, useToast } from 'native-base'

// Icons
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

// Redux 
import { connect } from 'react-redux'
import { getAllAttendance } from '../../../../../redux/actions/adminActions'

// Export Data
import XLSX from 'xlsx'
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';
import FileViewer from "react-native-file-viewer";

// Components
import moment from 'moment'
import BackHeader from '../../../../../components/BackHeader'
import LoadingIndicator from '../../../../../components/LoadingIndicator'
import ListingOptionsCard from '../../../../../components/ListingOptionsCard'
import FilterModal from '../../../../../components/FilterModal'
import AttendanceCard from '../../../../../components/Cards/AttendanceCard'
import employee from '../../../../../redux/reducers/employee'
import exportExcel from '../../../../../components/ExportExcel'

const AttendanceHistory = (props) => {

    const {
        attendance,
        getAllAttendance
    } = props
    const toast = useToast()

    const [loading, setLoading] = useState(false)
    const [show, setShow] = useState(false)
    const [sortedBy, setSortedBy] = useState();

    const loadAttendance = async (params) => {
        setLoading(true)
        try {
            await getAllAttendance(params)
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
        loadAttendance(
            {
                fromDate: new Date(),
                toDate: new Date(),
                name: ''
            }
        )
    }, [])


    const renderAttendanceList = () => {
        switch (sortedBy) {
            case 'name':
                return attendance.sort((a, b) => a.name.localeCompare(b.name));
            case 'checkInTime':
                return attendance.sort((a, b) => new Date(b.checkInTime) - new Date(a.checkInTime));
            case 'checkOutTime':
                return attendance.sort((a, b) => new Date(b.checkOutTime) - new Date(a.checkOutTime));
            default:
                return attendance
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <Stack space={4} >
                    <BackHeader>Attendance</BackHeader>

                    <ListingOptionsCard
                        totalResults={attendance.length}
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
                            <Menu.Item onPress={() => setSortedBy('checkInTime')}   >Sort by checkInTime</Menu.Item>
                            <Menu.Item onPress={() => setSortedBy('checkOutTime')}   >Sort by checkOutTime</Menu.Item>
                        </Menu>}
                    />

                    <FlatList
                        data={renderAttendanceList()}
                        renderItem={({ item, index }) => (
                            <AttendanceCard data={item} key={index} />
                        )}
                        keyExtractor={(item) => item.id}
                        ListFooterComponent={<Box mb={'32'} ></Box>}
                        refreshing={loading}
                        onRefresh={() => loadAttendance({
                            fromDate: new Date(),
                            toDate: new Date(),
                            name: ''
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
                            { toDate: false }
                        ]}

                        onFilter={(values) => loadAttendance(values)}
                    />

                </Stack>
            </LoadingIndicator>

        </Box>
    )
}


const mapStateToProps = state => {
    return {
        attendance: state.admin.attendance
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAllAttendance: (data) => dispatch(getAllAttendance(data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttendanceHistory)

