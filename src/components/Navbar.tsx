import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export function NavBar() {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)
    const router = useRouter()
    React.useEffect(() => {
        const token = localStorage.getItem("token")
        if (token) {
            setIsLoggedIn(true)
        }
    }, [router.pathname])

    const handleLogout = () => {
        localStorage.clear()
        setIsLoggedIn(false)
        router.push("/auth")
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light shadow">
                <div className="container">

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                            <li className="nav-item">
                                <Link className="nav-link active" aria-current="page" href="/">Home</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/about">About</Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link" href="/contact">Contact</Link>
                            </li>
                        </ul>
                        <Link className="navbar-brand fw-bolder fs-4 mx-auto" href="/">HitchHub </Link>
                        {
                            !isLoggedIn ? (
                                <Link href="/auth" className="btn btn-outline-primary ms-auto px-4 rounded-pill">
                                    <i className="fa fa-sign-in me-2"></i>Login</Link>
                            ) : (
                                <button onClick={handleLogout} className="btn btn-outline-danger ms-auto px-4 rounded-pill">
                                <i className="fa fa-sign-in me-2"></i>Logout</button>
                            )
                        }
                    </div>
                </div>
            </nav>
        </div>
    )
}
