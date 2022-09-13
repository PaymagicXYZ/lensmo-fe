import { SignInWithProvider } from "../Claim/SignIn";
import type { Provider } from "@supabase/supabase-js";
import supabase from "../../../utils/supabaseClient";
const availableProviders: Provider[] = ["twitter", "github", "discord"];

export const UserInfo = () => {
  const user = supabase.auth.user();
  if (user) {
    return (
      <div>
        <h1>Hi {user.email}</h1>
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
