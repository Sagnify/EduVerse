import React from 'react'
import SignUpPage from './signupForm'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: "Sign Up",
    default: "EduVerse",
  },
  description: "Very much a beta app",
};


const page = () => {
  return (
    <div><SignUpPage/></div>
  )
}

export default page