import React from 'react'
import { Box, Spinner } from 'native-base'

const LoadingIndicator = ({ loading, children }) => {
    return loading ? (
        <Box
            flex={1}
            alignItems={'center'}
            justifyContent={'center'}
        >
            <Spinner />
        </Box>
    ) : (
        <>
            {children}
        </>
    )

}

export default LoadingIndicator