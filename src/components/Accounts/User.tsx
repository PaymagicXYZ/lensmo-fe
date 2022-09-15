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

const handleClaim = (newOwnerAddress: string) => {
  fetch("https://backend.lensmo.xyz/claim", {
    method: "POST",
    headers: {
      "Content-Type": "application/javascript",
      Authorization: `Bearer ${import.meta.env.PUBLIC_SUPABASE_KEY}`,
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

export const VerifiedUser = (props: { provider: string; userInfo: any }) => {
  console.log(user);
  console.log(supabase.auth.session());
  if (user) {
    return (
      <div>
        <h5>Logged in as {user.email}</h5>
        {/* <a
          className="btn btn-primary"
          onClick={() => {
            supabase.auth.signOut();
          }}
        >
          Sign out
        </a> */}
        {user.identities &&
        user.identities.filter(
          (identity) =>
            identity.provider === props.provider &&
            identity.identity_data.name === props.userInfo.name
        ).length > 0 ? (
          <>
            Eligible to claim
            <a className="btn btn-primary" onClick={(e) => handleClaim}>
              Claim
            </a>
          </>
        ) : (
          <p>You are not eligible to claim this account</p>
        )}
      </div>
    );
  } else {
    return <SignInWithProvider provider={props.provider as Provider} />;
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
