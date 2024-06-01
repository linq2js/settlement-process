import { lazy, useEffect } from "react";
import "../api/server";
import { view } from "ezmodel/react";
import { client } from "../api/client";

const PartyAPage = lazy(() => import("./PartyAPage"));

const PartyBPage = lazy(() => import("./PartyBPage"));

export const MainPage = view(() => {
  useEffect(() => client.pooling(), []);

  return (
    <>
      <div className="dark:text-gray-400 flex gap-5">
        <div className="flex-1">
          <PartyAPage />
        </div>
        <div className="flex-1">
          <PartyBPage />
        </div>
      </div>
    </>
  );
});
