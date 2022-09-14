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
