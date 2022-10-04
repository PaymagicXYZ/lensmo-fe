import type { Provider } from "@supabase/supabase-js";
import supabase from "../../../utils/supabaseClient";

const signInWith =
  (provider: Provider | "email", userName?: string) => async () => {
    if (provider == "email") {
      const { user, error } = userName
        ? await supabase.auth.signIn(
            {
              email: userName.split(":")[1],
            },
            {
              redirectTo: `https://lensmo.xyz/user/${userName}?claim=true`,
            }
          )
        : { user: null, error: "no email provided" };
      alert(
        "A magic email has been sent to your inbox, please click the link in your email and come back again."
      );
    } else {
      const { user, session, error } = await supabase.auth.signIn(
        {
          provider: provider,
        },
        {
          redirectTo: userName
            ? `https://lensmo.xyz/user/${userName}?claim=true`
            : "https://lensmo.xyz/user/",
        }
      );
    }
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
