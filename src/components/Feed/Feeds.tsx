import { feedQuery } from "./FeedQuery";
import type { Key } from "react";
import moment from "moment";
const feeds = (
  await fetch("https://api-mumbai.lens.dev/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      query: feedQuery,
      variables: {
        profileId: null,
        reactionRequest: null,
        request: {
          limit: 10,
          metadata: null,
          profileId: "0x483d",
          publicationTypes: ["POST", "MIRROR"],
        },
      },
    }),
  }).then((res) => res.json())
).data.publications.items;
export const Feeds = () => {
  return (
    <div className="flex flex-col">
      {feeds.map((feed: any, Key: Key) => {
        const link = `https://testnet.lenster.xyz/posts/${feed.id}`;
        const content = feed.metadata.content.split("--");
        const time = feed.createdAt;
        return (
          <div className="card w-full bg-base-100" key={Key}>
            <div className="flex-col mt-1">
              <h2 className="flex items-center flex-1 px-4 font-bold leading-tight">
                {content[0]}
              </h2>
              <div className="px-4 text-xs font-normal text-gray-500">
                <a href={link} className="hover:underline" target="_blank">
                  {moment(time).fromNow()}
                </a>
              </div>
              <p className="flex-1 px-2 ml-2 text-sm font-medium leading-loose text-gray-600">
                {content[1]}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
