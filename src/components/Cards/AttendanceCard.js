import React, { useEffect } from 'react'
import { Linking } from 'react-native'

// Native Base
import { Avatar, Badge, Box, Divider, Heading, HStack, Icon, IconButton, Image, Stack, Text } from 'native-base'

// Icon
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'

// Date Time
import moment from 'moment'

const AttendanceCard = ({ data, key }) => {

    // console.log(data)


    return (
        <Box variant={'card'} key={key} mx={4} my={2} >
            <Stack space={2} >
                <HStack alignItems={'center'} justifyContent={'space-between'} >
                    <Heading size={'md'} >{data.name}</Heading>
                    <Badge borderRadius={15} colorScheme={!data.checkOutTime ? (data.onTime ? 'success' : 'warning') : 'error'} >{!data.checkOutTime ? (data.onTime ? 'Checked-In' : 'Late') : 'Checked-Out'}</Badge>
                </HStack>
                <HStack justifyContent={'space-between'} >
                    <HStack space={4} alignItems={'center'} >
                        <Avatar source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${data.checkInImage}` }} />
                        <Stack >
                            <Text fontSize={24} bold >{moment(data.checkInTime).format('hh:mm')}</Text>
                        </Stack>
                    </HStack>
                    <IconButton
                        colorScheme={'success'}
                        icon={<Icon as={FontAwesome5} name={'map-marked-alt'} />}
                        onPress={() => Linking.openURL(`geo:0,0?q=${data.checkInLatitude},${data.checkInLongitude}`)}
                    />
                </HStack>
                {data.checkOutTime && (
                    <>
                        <Divider />
                        <HStack justifyContent={'space-between'} >
                            <HStack space={4} alignItems={'center'} >
                                <Avatar source={{ uri: `https://ausztechattendance-bucket.s3.amazonaws.com/${data.checkOutImage}` }} />
                                <Stack>
                                    <Text fontSize={24} bold >{moment(data.checkOutTime).format('hh:mm')}</Text>
                                </Stack>
                            </HStack>
                            <IconButton
                                colorScheme={'error'}
                                icon={<Icon as={FontAwesome5} name={'map-marked-alt'} />}
                                onPress={() => Linking.openURL(`geo:0,0?q=${data.checkOutLatitude},${data.checkOutLongitude}`)}
                            />

                        </HStack>
                    </>
                )}
                {data.workingTime && (
                    <Badge borderRadius={15} colorScheme={'info'} >{`Total Working Time: ${data.workingTime} Hours`}</Badge>
                )}
                {data.reason && (
                    <Badge borderRadius={15} colorScheme={'error'} >{`Early Checkout Reason: ${data.reason}`}</Badge>
                )}

            </Stack>
        </Box>
    )
}

export default AttendanceCard