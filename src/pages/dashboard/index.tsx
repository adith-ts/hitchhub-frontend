import { Button, Center, Group } from '@mantine/core'
import { IconArmchair, IconSteeringWheel } from '@tabler/icons-react'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'

export default function () {
    const router = useRouter()
    useEffect(() => {
        const token = localStorage.getItem("token")
        if(!token){
            router.push("/auth")
        }
        
    },[])
    return (
        // Create a page with two big centered buttons: "Driver" and "Passenger" with mantine

        <Center style={{ height: '100vh' }}>
            <Group>
                <Button onClick={() => { router.push("/dashboard/driver")}} leftIcon={<IconSteeringWheel />} >
                    Driver
                </Button>
                <Button onClick={() => { router.push("/dashboard/passenger")}} leftIcon={<IconArmchair />}>
                    Passenger
                </Button>
            </Group>
        </Center>

    )
}
