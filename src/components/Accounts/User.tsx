import { useState } from "react";
import { SignInWithProvider } from "../Claim/SignIn";
import type { Provider } from "@supabase/supabase-js";
import supabase from "../../../utils/supabaseClient";
const availableProviders: Provider[] = ["twitter", "github", "discord"];
const user = supabase.auth.user();
export const LoggedInAs = () => {
  if (user) {
    return <h5>Logged in as {user.email}</h5>;
  }
};

const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  event.preventDefault();
  const target = event.target as typeof event.target & {
    newOwnerAddress: { value: string };
  };
  const newOwnerAddress = target.newOwnerAddress.value;
  handleClaim(newOwnerAddress);
};

const handleClaim = (newOwnerAddress: string) => {
  console.log("Claiming NFT for address: ", newOwnerAddress);
  const session = supabase.auth.session();
  const token = session && session.access_token;
  fetch("https://rvhpnxjvpgatvgaubbyt.functions.supabase.co/claim", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey",
    },
    body: JSON.stringify({
      newOwnerAddress: newOwnerAddress,
    }),
    redirect: "follow",
  })
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.log("error", error));
};

export const VerifiedUser = (props: {
  provider: string;
  userInfo: any;
  userName?: string;
  on?: boolean;
}) => {
  const [currentUser, setCurrentUser] = useState(supabase.auth.user());
  if (props.on) {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event == "SIGNED_IN") {
        setCurrentUser(session!.user);
      }
    });
    return currentUser ? (
      <div>
        {currentUser.identities &&
        currentUser.identities.filter(
          (identity) =>
            identity.provider === props.provider &&
            identity.identity_data.name === props.userInfo.name
        ).length > 0 ? (
          <>
            {props.userName && <h5>Logged in as {props.userName}</h5>}
            <form onSubmit={handleSubmit}>
              Eligible to claim
              <input
                type="text"
                name="newOwnerAddress"
                placeholder="Enter your wallet address"
                className="input input-bordered w-full max-w-xs"
              />
              <input className="btn btn-primary" value="Claim" type="submit" />
            </form>
          </>
        ) : (
          <p>You are not eligible to claim this account</p>
        )}
      </div>
    ) : (
      <SignInWithProvider
        provider={props.provider as Provider}
        userName={props.userName}
      />
    );
  } else {
    return (
      <SignInWithProvider
        provider={props.provider as Provider}
        userName={props.userName}
      />
    );
  }
};

export const UserInfo = () => {
  if (user) {
    return (
      <div>
        <h2>Hi {user.email}</h2>
        {user.identities &&
          user.identities.map((identity) => (
            <div key={identity.id}>
              <div className="avatar mx-auto">
                <div className="w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={identity.identity_data.avatar_url} />
                </div>
              </div>
              <h3>{identity.provider}</h3>
              <p>{identity.identity_data.name}</p>
            </div>
          ))}
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        <h2>Please Sign In to claim</h2>
        {availableProviders.map((e, Key) => (
          <SignInWithProvider provider={e} key={Key} />
        ))}
      </div>
    );
  }
};
