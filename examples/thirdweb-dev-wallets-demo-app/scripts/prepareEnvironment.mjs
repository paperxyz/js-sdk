import { writeFileSync } from "fs";
import { join } from "path";
import packageJson from "../package.json" assert { type: "json" };

packageJson.dependencies["@paperxyz/embedded-wallet-service-sdk"] = "latest";
console.log("process.cwd()", process.cwd());
writeFileSync(
  join(process.cwd(), "package.json"),
  JSON.stringify(packageJson, null, 2),
);
