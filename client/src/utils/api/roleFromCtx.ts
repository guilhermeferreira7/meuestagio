export function getRole(ctx: any): string {
  if (!ctx.req.cookies["next.user"]) {
    return "";
  }
  return JSON.parse(ctx.req.cookies["next.user"]).role;
}
