import type { Provider } from "@supabase/supabase-js";
import supabase from "../../../utils/supabaseClient";

const signInWith = (provider: Provider) => async () => {
  const { user, session, error } = await supabase.auth.signIn(
    {
      provider: provider,
    },
    {
      redirectTo: "http://localhost:3000/user",
    }
  );
};

export const SignInWithProvider = (props: { provider: Provider }) => {
  return (
    <button className="btn btn-active" onClick={signInWith(props.provider)}>
      Sign in with {props.provider}
    </button>
  );
};
