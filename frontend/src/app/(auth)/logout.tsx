"use client";

import { useRouter } from "next/navigation";

const Logout = () => {
  const router = useRouter();

  localStorage.removeItem("userId");
  localStorage.removeItem("token");

  router.push("/login");
};

export default Logout;
