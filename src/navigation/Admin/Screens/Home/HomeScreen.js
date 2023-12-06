import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView } from 'react-native'

import { useFocusEffect, useNavigation } from '@react-navigation/native'


// Native Base
import {
    Box,
    Button,
    Divider,
    Heading,
    HStack,
    Icon,
    IconButton,
    Modal,
    Pressable,
    Spinner,
    Stack,
    Text,
    useToast
} from 'native-base'

// Icon 
import AntDesign from 'react-native-vector-icons/AntDesign'


// Date Time
import moment from 'moment'

// Chart
import { LineChart } from 'react-native-chart-kit'

// Redux
import { connect } from 'react-redux'
import {
    getDashboardData,
    getBarChartData,
    getLeaveRequests,
    getLoanRequests,
    getAllAttendance,
    updateLoanRequest,
    updateLeaveRequest,
} from '../../../../redux/actions/adminActions'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Components
import LoadingIndicator from '../../../../components/LoadingIndicator'
import AttendanceCard from '../../../../components/Cards/AttendanceCard'
import LeaveCard from '../../../../components/Cards/LeaveCard'
import LoanCard from '../../../../components/Cards/LoanCard'
import StatusCircle from '../../../../components/StatusCircle'
import baseURL from '../../../../assets/common/baseURL'


const width = Dimensions.get('window').width

const HomeScreen = (props) => {

    const {
        dashboard,
        attendance,
        leaveRequests,
        loanRequests,
        getDashboardData,
        getBarChartData,
        getLeaveRequests,
        getLoanRequests,
        getAllAttendance,
        updateLoanRequest,
        updateLeaveRequest,
    } = props

    const toast = useToast()

    const context = useContext(AuthGlobal)
    const navigation = useNavigation()

    const [loading, setLoading] = useState(false)
    const [requestLoading, setRequestLoading] = useState(false)
    const [dashboardLoading, setDashboardLoading] = useState(false)
    const [request, setRequest] = useState(null)

    const statsLabel = [
        {
            title: 'Present',
            color: 'success',
            key: 'present'
        },
        {
            title: 'Absent',
            color: 'error',
            key: 'absent'
        },
        {
            title: 'Late',
            color: 'warning',
            key: 'late'
        },
        {
            title: 'Leave',
            color: 'violet',
            key: 'leave'
        },
    ]

    const chartData = {
        labels: dashboard.chart.date.map(item => moment(item).format('DD')),
        datasets: [
            {
                data: dashboard.chart.present,
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
                name: 'Present',
                legentColor: 'rgba(0,225,0,1)'

            },
            {
                data: dashboard.chart.absent,
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
                name: 'Absent',
                legentColor: 'rgba(255, 0, 0,1)'

            },
            {
                data: dashboard.chart.late,
                color: (opacity = 1) => `rgba(255, 191, 0, ${opacity})`,
                strokeWidth: 2,
                name: 'Late',
                legentColor: 'rgba(255, 165, 0,1)'

            },
            {
                data: dashboard.chart.leave,
                color: (opacity = 1) => `rgba(160, 32, 240, ${opacity})`,
                strokeWidth: 2,
                name: 'Leave',
                legentColor: 'rgba(165, 55, 253,1)'

            },
        ],
    };



    useFocusEffect(useCallback(() => {
        const abort = loadDashboardData()

        // return () => abort()
    }, []))

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        setLoading(true)
        try {
            await getDashboardData({
                fromDate: null,
                toDate: null,
                name: '',
            })
            await getBarChartData()
            await getLeaveRequests()
            await getLoanRequests()
            await getAllAttendance({
                fromDate: new Date(),
                toDate: new Date(),
                name: ''
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

    const loadDashboardData = async () => {
        setDashboardLoading(true)
        try {
            await getDashboardData({
                fromDate: null,
                toDate: null,
                name: null
            })
        } catch (e) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setDashboardLoading(false)
        }
    }

    const handlerequest = async (request, status) => {
        setRequestLoading(true)
        try {
            request.type == 'Loan' ?
                await updateLoanRequest({
                    id: request.data.id,
                    status: status,
                    tenure: request.data.tenure,
                    amount: request.data.amount
                }) :
                await updateLeaveRequest({
                    id: request.data.id,
                    status: status,
                    reason: ''
                })
        } catch (error) {
            console.log(error)
        } finally {
            setRequestLoading(false)
            setRequest(null)
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={16}
                >
                    <Stack space={4} mx={4} mt={4} >

                        <Image
                            source={{ uri: `${baseURL}${context.stateUser.user.CompanyLogo.substring(2)}` }}
                            resizeMode={'contain'}
                            alt={context.stateUser.user.CompanyName}
                            style={{
                                height: 150
                            }}
                        />


                        {/* Todays Attendance */}
                        <Box variant={'card'} >
                            <HStack justifyContent={'space-between'} alignItems={'center'} mb={4} >
                                <Heading size={'md'} color={'black'} fontSize={16} >Today's Attendance</Heading>
                                <HStack space={2} >
                                    {dashboardLoading && <Spinner />}
                                    <Text>{moment(new Date()).format('DD MMMM')}</Text>
                                </HStack>
                            </HStack>
                            <HStack justifyContent={'center'} space={1.5} >
                                {statsLabel.map((item) => (
                                    <Stack alignItems={'center'} space={2} >
                                        <Pressable
                                            variant={'subtle'}
                                            alignItems={'center'}
                                            justifyContent={'center'}
                                            bgColor={`${item.color}.100`}
                                            style={{
                                                height: width / 5.4,
                                                width: width / 5.5,
                                                marginHorizontal: 4,
                                                borderRadius: 40
                                            }}
                                            onPress={() => navigation.navigate('Attendance Stats', { screenName: item.title })}
                                        >
                                            <Heading color={`${item.color}.700`} fontSize={32} >{dashboard.stats[item.key]}</Heading>
                                        </Pressable>
                                        <Text color={`${item.color}.700`} >{item.title}</Text>
                                    </Stack>

                                ))}
                            </HStack>
                        </Box>

                        <Box variant={'card'} height={350} position={'relative'} >
                            {/* Bar Chart */}
                            <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
                                <Heading size={'md'} color={'black'} fontSize={18}  >Weekly Attendance</Heading>
                                <Text>Week {moment(new Date).week() - moment(new Date).startOf('month').week() + 1}</Text>
                            </HStack>
                            <Box mb={4} />
                            <LineChart
                                data={chartData}
                                width={width / 1.1}
                                height={300}
                                chartConfig={{
                                    backgroundGradientFromOpacity: 0,
                                    backgroundGradientToOpacity: 0,
                                    color: (opacity = 1) => `rgba(0,0,0, ${opacity})`,
                                    strokeWidth: 2,
                                    decimalPlaces: 0,
                                    useShadowColorFromDataset: false,
                                    formatYLabel: (yLabel) => Math.round(yLabel),
                                }}
                                bezier
                                decimal={false}
                                withShadow={false}
                                withDots={true}
                                style={{
                                    top: 10,
                                    left: -30
                                }}
                            // onDataPointClick={handleDataPointClick}
                            />
                        </Box>
                    </Stack>


                    <Box variant={'card'} mx={4} mt={6}>
                        {/* Leave Request */}
                        <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
                            <Heading size={'md'} color={'black'} fontSize={18}  >Leave Requests</Heading>
                            <Text>{leaveRequests.length} Request{leaveRequests.length !== 1 && 's'}</Text>
                        </HStack>

                        {leaveRequests.map((item, index) => (
                            <>
                                <Divider my={2} />
                                <Pressable
                                    _pressed={{
                                        transform: [{ scale: 0.95 }]
                                    }}
                                    onPress={() => setRequest({
                                        type: 'Leave',
                                        data: item
                                    })}
                                >
                                    <LeaveCard data={item} index={index} />
                                </Pressable>
                            </>
                        ))}
                    </Box>

                    <Box variant={'card'} mx={4} mt={6}  >
                        {/* Loan Requests */}
                        <HStack justifyContent={'space-between'} alignItems={'center'} mb={2} >
                            <Heading size={'md'} color={'black'} fontSize={18}  >Loan Requests</Heading>
                            {/* <HStack>
                                <Icon as={MaterialCommunityIcons} />
                                <Heading size={'md'} color={'black'} fontSize={18}  >Loan Requests</Heading>
                            </HStack> */}
                            <Text>{loanRequests.length} Request{loanRequests.length !== 1 && 's'}</Text>
                        </HStack>

                        {loanRequests.map((item, index) => (
                            <>
                                <Divider my={2} />
                                <Pressable
                                    _pressed={{
                                        transform: [{ scale: 0.95 }]
                                    }}
                                    onPress={() => setRequest({
                                        type: 'Loan',
                                        data: item
                                    })}
                                >
                                    <LoanCard data={item} index={index}  />
                                </Pressable>
                            </>
                        ))}
                    </Box>

                    <Box variant={'card'} mx={4} mt={6} >
                        {/* Attendance Requests */}
                        <HStack justifyContent={'space-between'} alignItems={'center'} >
                            <Heading size={'md'} color={'black'} fontSize={18}  >Attendance</Heading>
                            <Text>{moment(new Date).format("DD MMMM")}</Text>
                        </HStack>
                    </Box>
                    {attendance.map((item, index) => (
                        <AttendanceCard data={item} key={index} />
                    ))}

                    <Box marginBottom={2} />

                </ScrollView>

                <Modal
                    isOpen={Boolean(request)}
                    style={{
                        display: null,
                        alignItems: 'stretch',
                        justifyContent: 'space-between'
                    }}
                    _backdrop={{
                        opacity: 1,
                        backgroundColor: '#fff'
                    }} >
                    <Box mt={'16'} mx={4} >
                        <HStack alignItems={'center'} justifyContent={'space-between'} >
                            <Heading>{request?.type} Request</Heading>
                            <IconButton
                                size={'sm'}
                                icon={<Icon as={AntDesign} name={'close'} />}
                                onPress={() => setRequest(null)}
                            />
                        </HStack>
                        {request?.type === 'Leave' && (
                            <Stack mt={6} space={2} >
                                <Heading fontWeight={'600'} color={'black'} >{request?.data.name}</Heading>
                                <Text>{request?.data.reason}</Text>
                                <HStack space={4} alignItems={'center'} >
                                    <Text>{request?.data.fromDate}</Text>
                                    <Divider w={12} />
                                    <Text>{moment(request?.data.toDate).format("DD MMMM YYYY")}</Text>
                                </HStack>
                            </Stack>
                        )}
                        {request?.type === 'Loan' && (
                            <Stack mt={6} space={2} >
                                <Heading fontWeight={'600'} color={'black'} >{request?.data.name}</Heading>
                                <HStack space={2} >
                                    <Text fontSize={16} fontWeight={'600'} >Rs. {request?.data.amount}</Text>
                                    <Text fontSize={16} >for</Text>
                                    <Text fontSize={16} fontWeight={'600'} >{request?.data.tenure} Months</Text>
                                </HStack>

                                <Text>Dated: {moment(request?.data.loanDate).format("DD MMMM YYYY")}</Text>

                            </Stack>
                        )}
                    </Box>
                    <HStack my={4} justifyContent={'space-evenly'} >
                        <Button
                            w={'46%'}
                            variant={'subtle'}
                            colorScheme={'error'}
                            onPress={() => handlerequest(request, 'Reject')}
                        >Reject</Button>
                        <Button
                            w={'46%'}
                            variant={'subtle'}
                            colorScheme={'success'}
                            onPress={() => handlerequest(request, 'Approved')}
                        >Approve</Button>
                    </HStack>
                </Modal>
            </LoadingIndicator>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.admin.dashboard,
        attendance: state.admin.attendance,
        leaveRequests: state.admin.leaves.request,
        loanRequests: state.admin.loans.request
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDashboardData: (data) => dispatch(getDashboardData(data)),
        getBarChartData: () => dispatch(getBarChartData()),
        getLeaveRequests: () => dispatch(getLeaveRequests()),
        getLoanRequests: () => dispatch(getLoanRequests()),
        getAllAttendance: (data) => dispatch(getAllAttendance(data)),
        updateLoanRequest: (data) => dispatch(updateLoanRequest(data)),
        updateLeaveRequest: (data) => dispatch(updateLeaveRequest(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)