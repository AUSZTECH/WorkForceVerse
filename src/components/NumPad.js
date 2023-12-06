import React, { memo } from 'react'
import { Dimensions } from 'react-native'

// Native Base
import { Box, Button, HStack, Icon, Stack } from 'native-base'

// Icons
import Entypo from 'react-native-vector-icons/Entypo'

import ReactNativeHapticFeedback from "react-native-haptic-feedback";


const width = Dimensions.get('window').width

const NumPad = ({ setText }) => {

    const options = {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
    };

    const handlePress = (text) => {
        ReactNativeHapticFeedback.trigger("impactMedium", options);
        // keySound.stop(() => {
        //     keySound.play();
        // });
        if (text == 'erase') {
            setText(prev => prev.slice(0, -1))
        } else {
            setText(prev => prev + text)
        }
    }

    return (
        <Stack space={2} alignItems={'center'}>
            <HStack space={2} >
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('1')}
                >1</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('2')}
                >2</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('3')}
                >3</Button>
            </HStack>
            <HStack space={2} >
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('4')}
                >4</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('5')}
                >5</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('6')}
                >6</Button>
            </HStack >
            <HStack space={2} >
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('7')}
                >7</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('8')}
                >8</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('9')}
                >9</Button>
            </HStack>
            <HStack space={2} >
                <Box
                    style={{
                        width: width / 3.5
                    }}
                />
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    onPress={() => handlePress('0')}
                >0</Button>
                <Button
                    variant={'subtle'}
                    style={{
                        width: width / 3.5
                    }}
                    _text={{
                        fontSize: 18
                    }}
                    colorScheme={'primary'}
                    leftIcon={<Icon as={Entypo} name={'erase'} />}
                    onPress={() => handlePress('erase')}
                ></Button>
            </HStack>
        </Stack>
    )
}

export default memo(NumPad)