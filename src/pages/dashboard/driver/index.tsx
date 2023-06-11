import { Slot, createSlot, deleteSlot, getSlots } from '@/api/slots/slots.api'
import { ActionIcon, Button, Center, Grid, Group, Menu, Modal, NumberInput, Paper, Stack, Text, TextInput } from '@mantine/core'
import { DateTimePicker } from '@mantine/dates'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import React, { useEffect } from 'react'
import moment from 'moment'
import { Request, getRequests, updateStatus } from '@/api/request.api'
import { IconBan, IconCircleCheck, IconDotsVertical, IconPlus, IconTrash } from '@tabler/icons-react'

const Driver
    = () => {
        const [slots, setSlots] = React.useState<Slot[]>([])
        const [opened, { open, close }] = useDisclosure(false)
        const [requests, setRequests] = React.useState<Request[]>([])
        const form = useForm({
            initialValues: {
                source: '',
                destination: '',
                dateTime: '',
                availableSeats: 1,
            },
            validate: {
                source: (val) => (val.length <= 0 ? 'Source is required' : null),
                destination: (val) => (val.length <= 0 ? 'Destination is required' : null),
                dateTime: (val) => (val.length <= 0 ? 'Date and time is required' : null),
                availableSeats: (val) => (val <= 0 ? 'Number of seats should not be 0' : null),
            }
        })
        useEffect(() => {
            // fetch slots
            fetchSlots()
            fetchRequests()

        }, [])
        const handleSubmit = () => {
            console.log(form.values)
            createSlot(form.values)
                .then((data) => {
                    console.log(data)
                    notifications.show({
                        message: 'Slot created',
                        color: 'green'
                    })
                    fetchSlots()
                })
                .catch((error) => {
                    notifications.show({
                        message: 'Something went wrong',
                        color: 'red'
                    })
                    console.log(error)
                })
        }
        function fetchSlots() {
            getSlots()
                .then((data) => {
                    console.log(data)
                    setSlots(data.filter((slot) => slot.driver.id === JSON.parse(localStorage.getItem("user")).id))
                })
        }
        const fetchRequests = () => {
            getRequests()
                .then((data) => {
                    console.log(data)
                    setRequests(data)
                })
        }
        return (
            <Center>
                <Stack sx={{ backgroundColor: "white" }} p="md">
                    <Paper p="lg">
                        <Group position='apart'>
                            <Text weight={600} size={28} >Slots</Text>
                            <Button onClick={open} leftIcon={<IconPlus />} >Create a slot</Button>
                        </Group>
                        <Stack w={"600px"} mah={"80vh"} sx={{ overflow: "auto", border: "1px solid gray", borderRadius: "8px" }} p={"lg"} mt={"xs"} >
                            {slots.length === 0 && <Text>No slots created</Text>}
                            {slots.map((slot) => {
                                const reqs = requests.filter(r => r.slot === slot.id)
                                const accepted = reqs.filter(r => r.status === "accepted").length
                                const max = slot.availableSeats
                                return (
                                    SlotCard(slot, accepted, max, reqs, fetchRequests, fetchSlots)
                                )
                            })}
                        </Stack>
                    </Paper>

                    <Modal opened={opened} onClose={close} title="Create slot" centered p="lg">
                        <Stack p="md" h={700} >
                            <form onSubmit={form.onSubmit(handleSubmit)}>
                                <Stack spacing={"sm"} >
                                    <TextInput
                                        label="Source"
                                        placeholder="Where are you coming from?"
                                        {...form.getInputProps('source')}
                                    />
                                    <TextInput
                                        label="Destination"
                                        placeholder="Where are you going?"
                                        {...form.getInputProps('destination')}
                                    />
                                    <DateTimePicker
                                        label="When will you leave?"
                                        placeholder="Date and time"
                                        {...form.getInputProps('dateTime')}
                                    />
                                    <NumberInput
                                        label="How many seats are available?"
                                        placeholder="Number of seats"
                                        {...form.getInputProps('availableSeats')}
                                    />
                                    <Button type="submit">Submit</Button>
                                </Stack>
                            </form>
                        </Stack>
                    </Modal>
                </Stack>
            </Center>
        )
    }


function SlotCard(slot: Slot, accepted: number, max: number, reqs: Request[], fetchRequests: () => void, fetchSlots: () => void) {
    const handleDelete = () => {
        deleteSlot(slot.id)
            .then((data) => {
                notifications.show({
                    message: 'Slot deleted',
                    color: 'green'
                })
                fetchSlots()
            })
            .catch((e) => {
                notifications.show({
                    message: 'Something went wrong',
                    color: 'red'
                })
                console.log(e)
            })
    }
    return (
        <>
            <Paper
                p={"sm"}
                m={"sm"}
                radius={"lg"}
                sx={{ backgroundColor: "#222", color: "white", position: "relative" }}
                key={slot.id}
            >
                <Menu shadow="md" width={200}>
                    <Menu.Target >
                        <ActionIcon sx={{ position: 'absolute', right: "0", top: '0' }} m="xs" >
                            <IconDotsVertical />
                        </ActionIcon>
                    </Menu.Target>

                    <Menu.Dropdown>
                        <Menu.Item onClick={handleDelete} color="red" icon={<IconTrash size={14} />}>Delete</Menu.Item>
                    </Menu.Dropdown>
                </Menu>
                <Grid>
                    <Grid.Col span={6}>
                        <Text c="dimmed">Source:</Text><Text> {slot.source}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Text c="dimmed">Destination:</Text> <Text> {slot.destination}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Text c="dimmed">Date:</Text> <Text> {moment(slot.dateTime).format("DD/mm/yyyy")}</Text>
                    </Grid.Col>
                    <Grid.Col span={6}>
                        <Text c="dimmed">Seats: </Text> <Text>{slot.availableSeats}</Text>
                    </Grid.Col>
                </Grid>
                <Paper p={"sm"} radius={"lg"} mt="sm">
                    <Stack>
                        <Group position='apart'>
                            <Text weight={"600"}>Requests</Text>
                            <Group>
                                <Text>{`Accepted => ${accepted}/${max}`}</Text>
                            </Group>

                        </Group>
                        {
                            reqs.length === 0 && <Center><Text c="dimmed" >No requests yet</Text></Center>
                        }
                        {reqs
                            .map((req) => (
                                <RequestCard remainingSeats={max - accepted} fetchRequests={fetchRequests} request={req} key={req.id} />
                            ))}
                    </Stack>
                </Paper>
            </Paper>
        </>
    )
}

function RequestCard({ request, remainingSeats, fetchRequests }: { request: Request, fetchRequests: () => void, remainingSeats: number }) {
    console.log('request', request)
    const status = request.status

    const handleUpdate = (status: "accepted" | "rejected") => {
        console.log(request.id, status)
        updateStatus(request.id!, status)
            .then(() => {
                notifications.show({
                    message: 'Request updated',
                    color: 'green'
                })
                fetchRequests()
            })
            .catch((error) => {
                notifications.show({
                    message: 'Something went wrong',
                    color: 'red'
                })
                console.log(error)
            })
    }
    return (
        <Group position='apart'>
            <Group>
                <Text>{request.passenger.name}</Text>
                <Text>{request.passenger.phone}</Text>
                <Text c={status === "accepted" ? "green" : status === "rejected" ? "tomato" : "gray"}>{request.status}</Text>
            </Group>
            <Group>
                <ActionIcon
                    onClick={() => {
                        handleUpdate("rejected")
                    }}
                >
                    <IconBan color="tomato" />
                </ActionIcon>
                <ActionIcon


                    onClick={() => {
                        if (remainingSeats <= 0) {
                            notifications.show({
                                message: 'No more seats available',
                                color: 'red'
                            })
                            return
                        }
                        handleUpdate("accepted")
                    }}
                >
                    <IconCircleCheck color="green" />

                </ActionIcon>
            </Group>
        </Group>
    )
}


export default Driver

