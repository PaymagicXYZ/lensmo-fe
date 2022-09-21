import React, { Fragment, useState } from "react";
import FeedPost from "./FeedPost";

export default function Feed() {
  let loading = false;

  return (
    <Fragment>
      <section className="relative flex items-center justify-center antialiased min-w-screen w-full">
        <div className="flex-col w-full py-4 mx-auto bg-slate-50 sm:px-4 sm:py-4 md:px-4 sm:rounded-lg sm:shadow-sm">
          {loading ? (
            <></>
          ) : (
            [0, 1, 2, 3, 4].map((x) => {
              return <FeedPost />;
            })
          )}
        </div>
      </section>
    </Fragment>
  );
}
