import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher(["/", "/pricing"]);

export default clerkMiddleware((auth, request) => {
  if (!auth().userId && !isPublicRoute(request)) {
     auth().protect();
  }
});
