import React from "react";
import { Routes, Route } from "react-router-dom";
import Press from "./Press";
import PressPost from "./PressPost";
export default function PressRouter(){
  return (
    <Routes>
      <Route index element={<Press />} />
      <Route path=":slug" element={<PressPost />} />
    </Routes>
  );
}
