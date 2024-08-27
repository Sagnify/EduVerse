"use client"
// signup / page.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "./actions/signup";

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [isStudent, setIsStudent] = useState(false);
  const [isTeacher, setIsTeacher] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [gender, setGender] = useState("");
  const [stream, setStream] = useState("");
  const [standard, setStandard] = useState("");
  const [bio, setBio] = useState("");

  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      await signup({
        username,
        displayName,
        password,
        isStudent,
        isTeacher,
        studentProfile: isStudent
          ? { phoneNumber, address, gender, stream, standard }
          : undefined,
        teacherProfile: isTeacher ? { phoneNumber, bio } : undefined,
      });

      // Redirect or show success message
      router.push("/success");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4">
      <div>
        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="block w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="displayName">Display Name</label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="block w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="block w-full border rounded p-2"
          required
        />
      </div>
      <div>
        <label>
          <input
            type="radio"
            checked={isStudent}
            onChange={() => {
              setIsStudent(true);
              setIsTeacher(false);
            }}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            checked={isTeacher}
            onChange={() => {
              setIsStudent(false);
              setIsTeacher(true);
            }}
          />
          Teacher
        </label>
      </div>
      {isStudent && (
        <>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              id="address"
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="gender">Gender</label>
            <input
              id="gender"
              type="text"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="stream">Stream</label>
            <input
              id="stream"
              type="text"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="standard">Standard</label>
            <input
              id="standard"
              type="text"
              value={standard}
              onChange={(e) => setStandard(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
        </>
      )}
      {isTeacher && (
        <>
          <div>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="block w-full border rounded p-2"
            />
          </div>
        </>
      )}
      <button type="submit" className="bg-blue-500 text-white rounded p-2">
        Sign Up
      </button>
    </form>
  );
}
