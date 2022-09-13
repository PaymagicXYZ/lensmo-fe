import React, { Fragment, useState } from "react";
import { Icon } from "astro-icon";

export default function FeedPost() {
  return (
    <Fragment>
      <div className="flex flex-row">
        <img
          className="object-cover w-12 h-12 border-2 border-gray-300 rounded-full"
          alt="Noob master's avatar"
          src="https://pbs.twimg.com/profile_images/1529956155937759233/Nyn1HZWF_normal.jpg"
        />
        <div className="flex-col mt-1">
          <div className="flex items-center flex-1 px-4 font-bold leading-tight">
            Elon Musk received 10 USDC from 0xabc
          </div>
          <div className="px-4 text-xs font-normal text-gray-500">
            <a
              href="https://polygonscan.com"
              className="hover:underline"
              target="_blank"
            >
              2 weeks ago
            </a>
          </div>
          <div className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">
            Here's a gift from our community!
          </div>
          <button className="inline-flex items-center px-1 pt-2 ml-1 flex-column">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 1024 1024"
              className="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
            >
              <path
                fill="currentColor"
                d="M923 283.6a260.04 260.04 0 0 0-56.9-82.8a264.4 264.4 0 0 0-84-55.5A265.34 265.34 0 0 0 679.7 125c-49.3 0-97.4 13.5-139.2 39c-10 6.1-19.5 12.8-28.5 20.1c-9-7.3-18.5-14-28.5-20.1c-41.8-25.5-89.9-39-139.2-39c-35.5 0-69.9 6.8-102.4 20.3c-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 0 0-56.9 82.8c-13.9 32.3-21 66.6-21 101.9c0 33.3 6.8 68 20.3 103.3c11.3 29.5 27.5 60.1 48.2 91c32.8 48.9 77.9 99.9 133.9 151.6c92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3c56-51.7 101.1-102.7 133.9-151.6c20.7-30.9 37-61.5 48.2-91c13.5-35.3 20.3-70 20.3-103.3c.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5c0 201.2-356 429.3-356 429.3z"
              />
            </svg>
          </button>

          <button className="inline-flex items-center px-1 pt-2 ml-1 flex-column">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              preserveAspectRatio="xMidYMid meet"
              viewBox="0 0 512 512"
              className="w-5 h-5 ml-2 text-gray-600 cursor-pointer fill-current hover:text-gray-900"
            >
              <path
                fill="currentColor"
                d="M256 32C114.6 32 0 125.1 0 240c0 47.6 19.9 91.2 52.9 126.3C38 405.7 7 439.1 6.5 439.5c-6.6 7-8.4 17.2-4.6 26S14.4 480 24 480c61.5 0 110-25.7 139.1-46.3C192 442.8 223.2 448 256 448c141.4 0 256-93.1 256-208S397.4 32 256 32zm0 368c-26.7 0-53.1-4.1-78.4-12.1l-22.7-7.2l-19.5 13.8c-14.3 10.1-33.9 21.4-57.5 29c7.3-12.1 14.4-25.7 19.9-40.2l10.6-28.1l-20.6-21.8C69.7 314.1 48 282.2 48 240c0-88.2 93.3-160 208-160s208 71.8 208 160s-93.3 160-208 160z"
              />
            </svg>
          </button>
        </div>
      </div>
      <hr className="my-2 ml-16 border-gray-200" />
    </Fragment>
  );
}
