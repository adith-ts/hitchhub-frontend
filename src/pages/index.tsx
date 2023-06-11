import { Inter } from 'next/font/google'
import Link from 'next/link'
import styles from "./index.module.css"
const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <div>
        <section className={styles.home}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8 mt-5 py-5">
                        <h1 className="display-4 fw-bolder mb-4 text-center text-white">Happy Hiking !</h1>
                        <p className="lead text-center fs-4 mb-5 text-white">A platform to connect hitchhikers and travelers together to ease out the uncertainties involved during hitch hiking.</p>
                    <div className="buttons d-flex justify-content-center">
                        <Link href="/dashboard" className="btn btn-outline-light me-4 rounded-pill px-4 py-2">Get Started</Link>
                    </div>
                    </div>
                </div>
            </div>
        </section>
        <About/>
        <Contact/>
    </div>
  )
}
function About() {
  return (
    <div>
        <section id="about">
            <div className="container my-5 py-5">
                <div className="row">
                    <div className="col-md-6">
                        <img src="/assets/about1.jpg" alt="About" className="w-75 mt-5" />
                    </div>
                    <div className="col-md-6">
                        <h3 className="fs-5 mb-0 pt-5">About Us</h3>
                        <h1 className="display-6 mb-2">Who <b>We</b> Are</h1>
                        <hr className="w-50"/>
                        <p className="lead mb-4">A joint platform connects hitchhikers and automobile travelers, reducing uncertainty in their journeys and potentially replacing traditional taxi systems. It allows people to travel together at little or no cost, providing companionship and alleviating solitude. This platform aims to make hitchhiking easier and could become a popular mode of transportation in the future.</p>
                        <button className="btn btn-primary rounded-pill px-4 py-2">Get Started</button>
                        <button className="btn btn btn-outline-primary rounded-pill px-4 py-2 ms-2">Contact Us</button>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}
function Contact() {
  return (
    <div>
        <section id="contact">
            <div className="container my-5 py-5">
                <div className="row mb-5">
                    <div className="col-12">
                        <h3 className="fs-5 text-center mb-0">Contact Us</h3>
                        <h1 className="display-6 text-center mb-4">Have Some <b>Question?</b></h1>
                        <hr className="w-25 mx-auto"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <img src="/assets/contact.jpg" alt="Contact" className="w-75"/>
                    </div>
                    <div className="col-md-6">
                        <p className="lead mb-4">Email</p>
                        <p className="lead mb-4">Contact No</p>
                    </div>
                </div>
            </div>
        </section>
    </div>
  )
}
