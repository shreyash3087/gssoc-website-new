"use client";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

const Wob = () => {
  const router = useRouter();
  useEffect(() => {
    window.location.href = "https://wob.girlscript.tech/wob";
  }, [router.pathname]);
  return <></>;
};

export default Wob;
