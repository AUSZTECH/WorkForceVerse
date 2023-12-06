import React from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Avatar, Badge, Box, Divider, Heading, HStack, Icon, IconButton, Menu, Stack, Text } from 'native-base'

// Icons
import Entypo from 'react-native-vector-icons/Entypo'
import baseURL from '../../assets/common/baseURL'
import moment from 'moment'

const EmployeeCard = ({ data, index, showMenu = false, onUpdate, onDelete }) => {

    const navigation = useNavigation()

    return (
        <Box variant={'card'} mx={4} my={2} key={index} >
            <Stack space={2} >
                <HStack space={2} alignItems={'center'} >
                    <Avatar
                        source={{ uri: `${baseURL}${data.image.substring(2)}` }}>
                    </Avatar>
                    <Stack space={0.5} >
                        <Heading size={'sm'} >{data.name}</Heading>
                        {data.jobTitle != "" && <Text>{data.jobTitle}</Text>}
                        <Text fontSize={12}>{data.email}</Text>
                    </Stack>
                </HStack>
                <Divider />
                <HStack alignItems={'center'} justifyContent={'space-between'} >
                    <Text fontSize={12} >Date of Joining: {moment(data.DOJ).format("DD-MM-YYYY")}</Text>
                    <Badge borderRadius={15} colorScheme={data.isActive == 1 ? 'success' : 'error'} >
                        {data.isActive === 1 ? 'Active' : 'Inactive'}
                    </Badge>
                </HStack>
            </Stack>
            {showMenu && (
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
                    <Menu.Item onPress={() => navigation.navigate('Employee Home Screen', { id: data.userID, name: data.name })} >Stats</Menu.Item>
                    <Menu.Item onPress={() => navigation.navigate('Employee Detail Screen', { data })} >Details</Menu.Item>
                    <Menu.Item onPress={onUpdate} >Edit</Menu.Item>
                    <Menu.Item onPress={onDelete} >Delete</Menu.Item>
                </Menu>
            )}
        </Box>
    )
}

export default EmployeeCard