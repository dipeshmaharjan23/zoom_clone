import { currentUser } from "@clerk/nextjs";
import { StreamClient } from "@stream-io/node-sdk";

export async function getToken() {
  const streamApiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY;
  const streamApiKeySecret = process.env.STREAM_VIDEO_API_SECRET;

  if (!streamApiKey || !streamApiKeySecret) {
    return new Error("Missing Stream API key or secret");
  }

  try {
    const user = await currentUser();

    console.log("Generating token for user", user?.id);

    if (!user) {
      return new Error("User not authenticated");
    }

    const streamClient = new StreamClient(streamApiKey, streamApiKeySecret);

    const expirationTime = Math.floor(Date.now() / 1000) + 60 * 60;

    const issuedAt = Math.floor(Date.now() / 1000) - 60;

    const token = streamClient.createToken(user.id, expirationTime, issuedAt);

    console.log("Successfully generated token", token);

    return token;
  } catch (error) {
    console.error("Error generating token:", error);
    return new Error("Failed to generate token");
  }
}
