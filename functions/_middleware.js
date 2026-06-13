export async function onRequest(context) {
  const url = new URL(context.request.url);

  if (url.hostname === "www.wennancao.com") {
    url.hostname = "wennancao.com";
    return Response.redirect(url.toString(), 301);
  }

  return context.next();
}
