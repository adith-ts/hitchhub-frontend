import { Request, createRequest, getRequests } from '@/api/request.api'
import { Slot, getSlots } from '@/api/slots/slots.api'
import { Box, Button, Center, Grid, Paper, Stack, Text, TextInput } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconSearch } from '@tabler/icons-react'
import moment from 'moment'
import { useEffect, useState } from 'react'

const Passenger = () => {
  const [slots, setSlots] = useState<Array<Slot>>([])
  const [requests, setRequests] = useState<Array<Request>>([])
  const [userId, setUserId] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState<string>("")

  useEffect(() => {
    // fetch slots
    getSlots()
      .then((data) => {
        console.log(data)
        setSlots(data.filter((slot: Slot) => {
          const departure_time = new Date(slot.dateTime)
          return departure_time > Date.now()
        }))
      })
    fetchRequests()

    setUserId(JSON.parse(localStorage.getItem("user")).id)
  }, [])
  const fetchRequests = () => {
    getRequests()
      .then((data) => {
        console.log(data)
        setRequests(data)
      })
  }
  return (
    <Center >
      <Stack h={"100vh"}>
        <h1>Passenger</h1>
        <Box sx={{ border: "1px solid grey", borderRadius: "8px", backgroundColor: "white" }} m={"sm"} p="sm" w={700} >
          <TextInput
            icon={<IconSearch />}
            placeholder="Search for a destination"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Stack>
            <Stack sx={{ overflow: "auto", maxHeight: "70vh"}} >
              {slots.filter(s => s.destination.includes(searchTerm)).map((slot) => (
                <SlotCard key={slot.id} slot={slot} request={requests.find(r => r.passenger.id === userId && r.slot === slot.id)}
                  filled={requests.filter(r => r.slot === slot.id && r.status==="accepted").length >= slot.availableSeats}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Center>
  )
}

export const SlotCard = ({ slot, request, filled }: { slot: Slot, request: Request | undefined, filled: boolean }) => {

  const handleRequest = () => {
    if (request) {
      notifications.show({
        message: 'You already have a request for this slot',
        color: 'red'
      })
      return
    }
    if(filled) {
      notifications.show({
        message: 'Slot is already filled',
        color: 'red'
      })
      return
    }
    createRequest(slot.id, localStorage.getItem("token")!)
      .then((data) => {
        console.log(data)
        notifications.show({
          message: 'Request sent',
          color: 'green'
        })
      })
      .catch((error) => {
        console.log(error)
      })
  }
  return (
    <Paper p={"sm"} withBorder m={"sm"}>
      <Grid>
        <Grid.Col span={6} >
          <Text c="dimmed">Source:</Text><Text> {slot.source}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text c="dimmed">Destination:</Text> <Text> {slot.destination}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text c="dimmed">Date:</Text> <Text> {moment(slot.dateTime).format("DD/MM/yyyy")}</Text>
        </Grid.Col>
        {/* <Grid.Col span={6}>
          <Text c="dimmed">Seats: </Text> <Text>{slot.availableSeats}</Text>
        </Grid.Col> */}
        <Grid.Col span={6}>
          <Text c="dimmed" weight={600}>Driver: </Text> <Text>{slot.driver.name}</Text>
        </Grid.Col>
        <Grid.Col span={6}>
          <Text c="dimmed" weight={600} >Phone: </Text> <Text>{slot.driver.phone}</Text>
        </Grid.Col>
        <Grid.Col span={12}>
          <Center>
            <Button onClick={handleRequest}
              color={request ? request.status === "rejected" ? "red" : request.status === "accepted" ? "green" : "grey" : "blue"}
            >
              {
                request ? request.status : "Request"
              }
            </Button>
          </Center>
        </Grid.Col>
      </Grid>
    </Paper>

  )
}

export default Passenger