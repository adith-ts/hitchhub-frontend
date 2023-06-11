import { useToggle, upperFirst } from '@mantine/hooks';
import { useForm } from '@mantine/form';
import {
    TextInput,
    PasswordInput,
    Text,
    Paper,
    Group,
    PaperProps,
    Button,
    Anchor,
    Stack,
    Box,
    Center,
} from '@mantine/core';
import { login, register, whoami } from '@/api/auth/auth.api';
import { notifications } from '@mantine/notifications';
import { useRouter } from 'next/router';

export default function AuthenticationForm(props: PaperProps) {
    const [type, toggle] = useToggle(['login', 'register']);
    const router = useRouter()
    const form = useForm({
        initialValues: {
            email: '',
            name: '',
            password: '',
            phone: '',
        },

        validate: {
            email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
            password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
        },
    });

    const handleSubmit = () => {
        if (type === 'login') {
            login(form.values.email, form.values.password)
                .then((data) => {
                    notifications.show({
                        message: 'Logged in',
                        color: 'green'
                    })
                    localStorage.setItem("user", JSON.stringify(data.user))
                    router.push('/dashboard')

                })
                .catch((error) => {
                    console.log(error.response.status)
                    if (error.response.status == 401) {
                        notifications.show({
                            message: 'Invalid credentials',
                            color: 'red'
                        })
                    } else {
                        notifications.show({
                            message: 'Something went wrong',
                            color: 'red'
                        })
                        console.log(error)
                    }
                })
        } else {
            register(form.values.email, form.values.password, form.values.name, form.values.phone)
                .then((data) => {
                    notifications.show({
                        message: 'Account created',
                        color: 'green'
                    })
                })
                .catch((error) => {
                    console.log(error.response.status)
                    if (error.response.status == 409) {
                        notifications.show({
                            message: 'Account already exists',
                            color: 'red'
                        })
                    } else {
                        notifications.show({
                            message: 'Something went wrong',
                            color: 'red'
                        })
                        console.log(error)
                    }
                })
        }
    }
    return (
        <Box sx={{ height: "100vh", width: "100vw" }}>
            <Center sx={{ height: "100%" }}>
                <Paper radius="md" p="xl" withBorder {...props}>
                    <Text size="lg" weight={500} pb="sm">
                        Welcome to HitchHiker, {type} with
                    </Text>

                    <form onSubmit={form.onSubmit(handleSubmit)}>
                        <Stack>
                            {type === 'register' && (
                                <TextInput
                                    label="Name"
                                    placeholder="Your name"
                                    {...form.getInputProps('name')}
                                    radius="md"
                                />
                            )}

                            <TextInput
                                label="Email"
                                placeholder="hello@mantine.dev"
                                {...form.getInputProps('email')}
                                radius="md"
                            />

                            {type === 'register' && (
                                <TextInput
                                    label="Phone"
                                    placeholder="7559054311"
                                    {...form.getInputProps('phone')}
                                    radius="md"
                                    required
                                />

                            )}

                            <PasswordInput
                                label="Password"
                                placeholder="Your password"
                                {...form.getInputProps('password')}
                                radius="md"
                            />
                        </Stack>

                        <Group position="apart" mt="xl">
                            <Anchor
                                component="button"
                                type="button"
                                color="dimmed"
                                onClick={() => toggle()}
                                size="xs"
                            >
                                {type === 'register'
                                    ? 'Already have an account? Login'
                                    : "Don't have an account? Register"}
                            </Anchor>
                            <Button type="submit" radius="xl">
                                {upperFirst(type)}
                            </Button>
                        </Group>
                    </form>
                </Paper>
            </Center>
        </Box>
    );
}