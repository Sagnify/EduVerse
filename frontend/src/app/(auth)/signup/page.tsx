"use client";

import { useState } from "react";
import { signupUser } from "./actions/signup";

export default function Signup() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showStudentFields, setShowStudentFields] = useState(false);
  const [showTeacherFields, setShowTeacherFields] = useState(false);

  const handleStudentCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowStudentFields(e.target.checked);
  };

  const handleTeacherCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    setShowTeacherFields(e.target.checked);
  };

  async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const isStudent = fd.get("is_student") === "on";
    const isTeacher = fd.get("is_teacher") === "on";

    const formData: any = {
      first_name: fd.get("f_name") as string,
      last_name: fd.get("l_name") as string,
      username: fd.get("u_name") as string,
      email: fd.get("e_word") as string,
      password: fd.get("p_word") as string,
      profile: {
        is_student: isStudent,
        is_teacher: isTeacher,
      },
    };

    if (isStudent) {
      formData.student_profile = {
        phone_number: fd.get("student_phone") as string,
        profile_pic: fd.get("student_profile_pic") as File | null,
        address: fd.get("student_address") as string,
        gender: fd.get("student_gender") as string,
        stream: fd.get("student_stream") as string,
        standard: fd.get("student_standard") as string,
      };
    }

    if (isTeacher) {
      formData.teacher_profile = {
        phone_number: fd.get("teacher_phone") as string,
        profile_pic: fd.get("teacher_profile_pic") as File | null,
        rating: "0.00", // Assuming a default rating on signup
        bio: fd.get("teacher_bio") as string,
      };
    }

    const result = await signupUser(formData);

    if (result.success) {
      setSuccessMessage(result.message);
      e.currentTarget.reset();
    } else {
      setErrorMessage(result.message);
    }
  }

  return (
    <div className="col-md-6">
      <h3>Sign Up</h3>
      <hr />
      <form onSubmit={submitHandler}>
        {/* First Name */}
        <div className="form-outline mb-4">
          <input
            type="text"
            id="signupFirstName"
            className="form-control"
            name="f_name"
            required
          />
          <label className="form-label" htmlFor="signupFirstName">
            First Name
          </label>
        </div>

        {/* Last Name */}
        <div className="form-outline mb-4">
          <input
            type="text"
            id="signupSecondName"
            className="form-control"
            name="l_name"
            required
          />
          <label className="form-label" htmlFor="signupSecondName">
            Last Name
          </label>
        </div>

        {/* Username */}
        <div className="form-outline mb-4">
          <input
            type="text"
            id="signupUsername"
            className="form-control"
            name="u_name"
            required
          />
          <label className="form-label" htmlFor="signupUsername">
            Username
          </label>
        </div>

        {/* Email */}
        <div className="form-outline mb-4">
          <input
            type="email"
            id="signupEmail"
            className="form-control"
            name="e_word"
            required
          />
          <label className="form-label" htmlFor="signupEmail">
            Email
          </label>
        </div>

        {/* Password */}
        <div className="form-outline mb-4">
          <input
            type="password"
            id="signupPassword"
            className="form-control"
            name="p_word"
            required
          />
          <label className="form-label" htmlFor="signupPassword">
            Password
          </label>
        </div>

        {/* Profile Information */}
        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="isStudent"
            name="is_student"
            onChange={handleStudentCheckbox}
          />
          <label className="form-check-label" htmlFor="isStudent">
            I am a student
          </label>
        </div>
        <div
          id="studentProfileFields"
          style={{ display: showStudentFields ? "block" : "none" }}
        >
          <div className="form-outline mb-4">
            <input
              type="text"
              id="studentPhone"
              className="form-control"
              name="student_phone"
              placeholder="Phone Number"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="file"
              id="studentProfilePic"
              className="form-control"
              name="student_profile_pic"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              id="studentAddress"
              className="form-control"
              name="student_address"
              placeholder="Address"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              id="studentGender"
              className="form-control"
              name="student_gender"
              placeholder="Gender"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              id="studentStream"
              className="form-control"
              name="student_stream"
              placeholder="Stream"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="text"
              id="studentStandard"
              className="form-control"
              name="student_standard"
              placeholder="Standard"
            />
          </div>
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="isTeacher"
            name="is_teacher"
            onChange={handleTeacherCheckbox}
          />
          <label className="form-check-label" htmlFor="isTeacher">
            I am a teacher
          </label>
        </div>
        <div
          id="teacherProfileFields"
          style={{ display: showTeacherFields ? "block" : "none" }}
        >
          <div className="form-outline mb-4">
            <input
              type="text"
              id="teacherPhone"
              className="form-control"
              name="teacher_phone"
              placeholder="Phone Number"
            />
          </div>
          <div className="form-outline mb-4">
            <input
              type="file"
              id="teacherProfilePic"
              className="form-control"
              name="teacher_profile_pic"
            />
          </div>
          <div className="form-outline mb-4">
            <textarea
              id="teacherBio"
              className="form-control"
              name="teacher_bio"
              placeholder="Bio"
            ></textarea>
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block mb-4">
          Sign up
        </button>
      </form>

      {successMessage && (
        <div className="alert alert-success mt-3">{successMessage}</div>
      )}
      {errorMessage && (
        <div className="alert alert-danger mt-3">{errorMessage}</div>
      )}
    </div>
  );
}
