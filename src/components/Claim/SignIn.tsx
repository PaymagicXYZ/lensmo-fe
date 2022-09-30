import type { Provider } from "@supabase/supabase-js";
import supabase from "../../../utils/supabaseClient";

const signInWith = (provider: Provider, userName?: string) => async () => {
  const { user, session, error } = await supabase.auth.signIn(
    {
      provider: provider,
    },
    {
      redirectTo: userName
        ? `https://lensmo.xyz/user/${userName}`
        : "https://lensmo.xyz/user/",
    }
  );
};

export const SignInWithProvider = (props: {
  provider: Provider;
  userName?: string;
}) => {
  return (
    <button
      className="btn btn-active"
      onClick={
        props.userName
          ? signInWith(props.provider, props.userName)
          : signInWith(props.provider)
      }
    >
      Sign in with {props.provider}
    </button>
  );
};
