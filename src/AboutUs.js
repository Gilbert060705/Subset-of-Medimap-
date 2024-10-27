import React, { useState } from 'react';
import './AboutUs.css';
import logo from './images/logo.png';
import about from './images/imgAbout.jpg';

const AboutUs = () =>{

    return(
        <div className = "about-us-container">
            <header className = "about-us-header">
                <div className = "about-us-logo">
                    <img src={logo} alt="MediMap Logo"/>
                </div>
                <nav className = "about-us-nav">
                    <a href="/landing"> Home </a>
                    <a href="/"> About Us </a>
                    <a href="/"> My Booking </a>
                </nav>
            </header>

            <div className = "about-us-desc">
                <h1> Meet Us : The Medimap Team </h1>
                <img src={about} alt="The Medimap Team Photo"/>
                <p> We’re a group of passionate university students specializing in software engineering, united by a common goal: making access to healthcare simpler and more efficient. Our team came together with a vision to tackle the challenges people face when booking appointments at medical facilities. Through our project, MediMAP, we're building a user-friendly platform that streamlines the booking process for hospitals and clinics, allowing patients to secure appointments with just a few clicks.

As students with expertise in web development, UX/UI design, and data management, we leverage our skills to create a website that not only simplifies the booking experience but also reduces waiting times and improves scheduling transparency. We believe that accessing medical care should be easy, reliable, and stress-free—and we're excited to be at the forefront of this change with MediMAP.</p>
            </div>
        </div>
    )
}

export default AboutUs;