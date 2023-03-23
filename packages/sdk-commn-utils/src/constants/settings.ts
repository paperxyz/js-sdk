const isDev = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    window.localStorage.getItem("IS_PAPER_DEV") === "true"
  );
};

const isStaging = (): boolean => {
  return !!(
    typeof window !== "undefined" &&
    window.location.origin.includes("zeet-paper.zeet.app")
  );
};

const isOldPaperDomain = (): boolean =>
  typeof window !== "undefined" && window.location.origin.includes("paper.xyz");

export const getPaperOriginUrl = (): string => {
  if (isDev())
    return (
      window.localStorage.getItem("PAPER_DEV_URL") ?? "http://localhost:3000"
    );
  if (isStaging()) {
    if (process?.env?.ZEET_DEPLOYMENT_URL) {
      return `https://${process.env.ZEET_DEPLOYMENT_URL}`;
    }

    if (typeof window !== "undefined") return window.location.origin;

    return "https://withpaper.com";
  }

  if (isOldPaperDomain()) return window.location.origin;

  return "https://withpaper.com";
};
