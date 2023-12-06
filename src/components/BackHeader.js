import React from 'react'

// Navigation
import { useNavigation } from '@react-navigation/native'

// Native Base
import { Box, Heading, HStack, Icon, IconButton, Spinner } from 'native-base'

// Icons
import AntDesign from 'react-native-vector-icons/AntDesign'

const BackHeader = ({ children, loading }) => {

    const navigation = useNavigation()

    return (
        <HStack px={4} pt={2} >
            <IconButton
                icon={<Icon as={AntDesign} name={'left'} />}
                onPress={() => navigation.goBack()}
            />
            <Box flex={1} alignItems={'center'} justifyContent={'center'} >
                <Heading color={'black'} fontSize={20} fontWeight={'500'} >{children}</Heading>
            </Box>
            {loading && <Spinner />}
        </HStack>
    )
}

export default BackHeader