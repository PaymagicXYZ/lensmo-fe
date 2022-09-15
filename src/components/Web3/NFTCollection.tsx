export const NFTCollection = (props: { NFTList: any[] }) => {
  return (
    <div className="flex flex-row flex-wrap">
      {props.NFTList.map((nft: any, i) => {
        return (
          <div key={i}>
            <input
              name="nftList"
              type="radio"
              id={`nft-${i}`}
              value={i}
              className="hidden peer"
            />
            <label
              htmlFor={`nft-${i}`}
              className="avatar border-8 inline-block cursor-pointer peer-hover:border-violet-400 peer-checked:border-violet-800"
            >
              <div className="w-24 rounded">
                <img
                  src={
                    nft.smallPreviewImageUrl ||
                    "https://www.cloudwards.net/wp-content/uploads/2021/06/NFT-coin-800x551.jpg"
                  }
                />
              </div>
            </label>
          </div>
        );
      })}
    </div>
  );
};
