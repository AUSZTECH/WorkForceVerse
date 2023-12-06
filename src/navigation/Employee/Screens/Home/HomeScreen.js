import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Dimensions } from 'react-native'

// Navigation
import { useFocusEffect } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Button, Center, Divider, Heading, HStack, Icon, IconButton, ScrollView, Stack, Text, useTheme, useToast } from 'native-base'

// Native Base
import Ionicons from 'react-native-vector-icons/Ionicons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


// Date Time
import moment from 'moment'

// Charts
import { LineChart } from 'react-native-chart-kit'

// Redux
import { connect } from 'react-redux'
import { getDashboardData } from '../../../../redux/actions/employeeActions'

// Context API
import AuthGlobal from '../../../../context/store/AuthGlobal'

// Component
import LoadingIndicator from '../../../../components/LoadingIndicator'
import CircularProgress from '../../../../components/CircularProgress'

const width = Dimensions.get('window').width

const HomeScreen = (props) => {

    const {
        dashboard,
        getDashboardData,
        clearDashboardData
    } = props

    const context = useContext(AuthGlobal)

    const theme = useTheme()
    const toast = useToast()

    const [loading, setLoading] = useState()

    // useFocusEffect(
    //     useCallback(() => {
    //         loadData()

    //     }, [])
    // )

    const loadData = async () => {
        setLoading(true)
        try {
            const res = await getDashboardData(context.stateUser.user.UserId)
        } catch (e) {
            toast.show({
                title: 'Error',
                description: 'An Error Occured, Try Again Later!'
            })
        } finally {
            setLoading(false)
        }
    }




    const chartData = {
        labels: dashboard?.monthlyData?.map(item => item.monthName.length >= 6 ? item.monthName.substring(0, 3) : item.monthName),
        datasets: [
            {
                data: dashboard?.monthlyData?.map(item => item.present),
                color: (opacity = 1) => `rgba(0, 255, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Present",
                legentColor: 'rgba(0,225,0,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.absent),
                color: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Absent",
                legentColor: 'rgba(255, 0, 0,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.leave),
                color: (opacity = 1) => `rgba(165, 55, 253, ${opacity})`,
                strokeWidth: 2,
                legend: "Leave",
                legentColor: 'rgba(165, 55, 253,1)'
            },
            {
                data: dashboard?.monthlyData?.map(item => item.late),
                color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`,
                strokeWidth: 2,
                legend: "Late",
                legentColor: 'rgba(255, 165, 0,1)'
            },
        ],
    };

    const getStatus = () => {
        switch (dashboard.status) {
            case 'OnTime':
                return <Badge borderRadius={15} size={'sm'} colorScheme={'success'} >On-Time</Badge>
            case 'Late':
                return <Badge borderRadius={15} size={'sm'} colorScheme={'warning'} >Late</Badge>
            default:
                return null
        }
    }


    return (
        <Box variant={'container'} safeAreaTop >
            <LoadingIndicator loading={loading} >
                <ScrollView>

                    <Stack space={4} >
                        <Box mx={4} >
                            <Text>Hello,</Text>
                            <Heading>{context.stateUser.user.UserFirstName}</Heading>
                        </Box>


                        <Box variant={'card'} mx={4} mt={4} >
                            <Stack space={2} >
                                <HStack justifyContent={'space-between'} >
                                    <Text>{moment(new Date()).format("DD MMMM YYYY")}</Text>
                                    <Stack space={2} >
                                        {getStatus()}
                                        {/* <Badge borderRadius={15} size={'sm'} colorScheme={dashboard.checkOut ? 'error' : 'success'} >{dashboard.checkOut ? 'Checked-Out' : 'Checked-In'}</Badge> */}
                                    </Stack>
                                </HStack>
                                <Heading size={'3xl'} >{dashboard.checkIn ? moment(dashboard?.checkIn).format('hh:mm a') : 'Error'}</Heading>
                                {dashboard.checkOut && (
                                    <>
                                        <Divider />
                                        <Heading size={'3xl'} >{dashboard.checkOut ? moment(dashboard?.checkOut).format('hh:mm a') : 'Error'}</Heading>
                                    </>
                                )}
                                {/* <Button variant={'subtle'} colorScheme={'success'} >Start Break</Button> */}
                            </Stack>
                        </Box>

                        <Box variant={'card'} mx={4} >
                            <HStack justifyContent={'flex-end'} mb={2} >
                                <Text>{moment(new Date()).format('YYYY')}</Text>
                            </HStack>
                            <HStack justifyContent={'space-evenly'} >
                                <Stack space={2} alignItems={'center'}  >
                                    <CircularProgress
                                        total={dashboard.allocateLeaves ? dashboard.allocateLeaves : 1}
                                        current={dashboard.leave ? dashboard.leave : 0}
                                        radius={width / 13}
                                        strokeWidth={8}
                                        color={theme.colors.primary[500]}
                                    />
                                    <Text color={'primary.500'} >Leaves</Text>
                                </Stack>
                                <Divider orientation='vertical' />
                                <Stack space={2} alignItems={'center'}  >
                                    <CircularProgress
                                        total={260}
                                        current={dashboard.absent ? dashboard.absent : 0}
                                        radius={width / 13}
                                        strokeWidth={8}
                                        color={theme.colors.error[500]}
                                    />
                                    <Text color={'error.500'} >Absent</Text>
                                </Stack>
                                <Divider orientation='vertical' />
                                <Stack space={2} alignItems={'center'}  >
                                    <CircularProgress
                                        total={dashboard.present ? dashboard?.present : 1}
                                        current={dashboard.late ? dashboard.late : 0}
                                        radius={width / 13}
                                        strokeWidth={8}
                                        color={theme.colors.warning[500]}
                                    />
                                    <Text color={'warning.500'} >Late</Text>
                                </Stack>
                            </HStack>
                        </Box>

                        <Box variant={'card'} mx={4} mb={4} >
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
                            />
                        </Box>

                    </Stack>
                </ScrollView>
            </LoadingIndicator>
        </Box>
    )
}

const mapStateToProps = state => {
    return {
        dashboard: state.employee.dashboard
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getDashboardData: (data) => dispatch(getDashboardData(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen)