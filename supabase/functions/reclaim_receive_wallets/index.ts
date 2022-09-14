// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts";

console.log("Hello from Functions!");

serve(async (req) => {
  const { name } = await req.json();
  const data = {
    message: `Hello ${name}!`,
  };

  // Query pending wallets
  //   - receive_wallet='pending'
  //   - updated_at > 30min ago

  var buffer_updated_time = new Date();
  buffer_updated_time.setTime(new Date().getTime() - 30 * 60 * 1000);
  // updated_at is more than 30min ago

  var myHeaders = new Headers();
  myHeaders.append(
    "apikey",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U"
  );

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var requestURL = `https://rvhpnxjvpgatvgaubbyt.supabase.co/rest/v1/escrow_users?select=id,user_id,created_at,updated_at,receive_wallet_id(chain,wallet_address,wallet_type,status,created_at,updated_at)&receive_wallet_id.status=eq.${"pending"}&updated_at=lt.${buffer_updated_time}`;
  console.log("RequestURL: ", requestURL);

  var response = await fetch(requestURL, requestOptions);

  // const pendingWallets = await getPendingWallets();
  console.log(response);

  // for()

  // Check if tokens

  // if tokens
  // Update receive_wallet statusUpdate receive_wallet status
  // Tag account onchain

  // if no tokens
  // Delete escrow_user
  // Delete receive_wallet
  // Re-insert wallet

  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
});

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'

// getPendingWallets(async (req) => {
//   var buffer_updated_time = new Date();
//   buffer_updated_time.setTime(new Date().getTime() - 30 * 60 * 1000);
//   // updated_at is more than 30min ago

//   var myHeaders = new Headers();
//   myHeaders.append(
//     "apikey",
//     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ2aHBueGp2cGdhdHZnYXViYnl0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NjI0NzUyMzAsImV4cCI6MTk3ODA1MTIzMH0.bB6Xrqp3gAQ4jEWQFFr-URrd3YHkOXIwMKZfBI4Wl7U"
//   );

//   var requestOptions = {
//     method: "GET",
//     headers: myHeaders,
//     redirect: "follow",
//   };

//   var requestURL = `https://rvhpnxjvpgatvgaubbyt.supabase.co/rest/v1/escrow_users?select=id,user_id,created_at,updated_at,receive_wallet_id(chain,wallet_address,wallet_type,status,created_at,updated_at)&receive_wallet_id.status=eq.${"pending"}&updated_at=lt.${buffer_updated_time}`;
//   console.log("RequestURL: ", requestURL);

//   var response = await fetch(requestURL, requestOptions);

//   return response.text();
// });
