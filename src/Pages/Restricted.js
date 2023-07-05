import { Button } from "@material-tailwind/react";
import React from "react";
import { Link } from "react-router-dom";

const Restricted = () => {
  return (
    <div className="flex h-[calc(100vh-80px)] items-center justify-center p-5 bg-white w-full">
      <div className="text-center">
        <div className="inline-flex rounded-full bg-red-200 p-4">
          <div className="rounded-full stroke-red-600 bg-red-300 p-4">
            <svg
            className="w-12 h-12"
             xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512">
            <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/></svg>
          </div>
        </div>
        <h1 className="mt-5 text-[36px] font-bold text-slate-800 lg:text-[50px]">
          403 - Page Restricted
        </h1>
        <p className="text-slate-600 mt-5 lg:text-lg">
          The page you are looking for is restricted for you!
        </p>
        <Link to={"/dashboard"}>
          <Button variant="text" className="text-lg underline">
            Return To Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Restricted;
