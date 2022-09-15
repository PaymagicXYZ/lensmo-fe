export async function get(req: any) {
  const { params } = req.params;
  return new Response(JSON.stringify({ status: "success", params }), {
    status: 200,
  });
}
