import supabase from "./supabaseClient";

export const getWalletAddressFromId = async (walletId: number | number[]) => {
  const { data: escrow_wallets, error } = await supabase
    .from("escrow_wallets")
    .select("wallet_address")
    .eq("id", [walletId]);
  if (error) {
    return error?.message;
  }
  return escrow_wallets[0].wallet_address;
};

export const addNewWallet = async (username: string) => {
  const { data, error } = await supabase
    .from("escrow_users")
    .insert([{ user_id: username }]);
  if (error) {
    return error?.message;
  }
  return data;
};
export const getWallet = async (username: string) => {
  const { data: escrow_users, error } = await supabase
    .from("escrow_users")
    .select("receive_wallet_id")
    .in("user_id", [username]);
  if (error) {
    return error?.message;
  }
  if (escrow_users && escrow_users.length > 0) {
    return getWalletAddressFromId(escrow_users[0].receive_wallet_id);
  } else {
    const newWallet = await addNewWallet(username);
    return getWalletAddressFromId(newWallet[0].receive_wallet_id);
  }
};
