"use client";

import { useUser } from "@clerk/nextjs";
import {
  StreamVideo,
  StreamVideoClient,
  TokenProvider,
  User,
} from "@stream-io/video-react-sdk";
import { Loader2 } from "lucide-react";
import { nanoid } from "nanoid";
import { useEffect, useState } from "react";
import { getToken } from "./action";

interface ClientProviderProps {
  children: React.ReactNode;
}
export default function ClientProvider({ children }: ClientProviderProps) {
  const videoClient = useInitializeVideoClient();

  if (!videoClient)
    return (
      <div className="h-screen items-center justify-center">
        <Loader2 className="mx-auto animate-spin" />
      </div>
    );

  return <StreamVideo client={videoClient}>{children}</StreamVideo>;
}

function useInitializeVideoClient() {
  const { user, isLoaded: userLoaded } = useUser();
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(
    null,
  );

  useEffect(() => {
    if (!userLoaded) return () => {}; // Return an empty cleanup function if userLoaded is false

    let streamUser: User;

    if (user?.id) {
      streamUser = {
        id: user.id,
        name: user.username || user.id,
        image: user.imageUrl,
      };
    } else {
      const id = nanoid();
      streamUser = {
        id: id,
        type: "guest",
        name: `Guest ${id}`,
      };
    }

    const apiKey = process.env.NEXT_PUBLIC_STREAM_VIDEO_API_KEY!;

    if (!apiKey) {
      throw new Error("Missing Stream API key");
    }

    const client = new StreamVideoClient({
      apiKey,
      user: streamUser,
      tokenProvider: user?.id ? (getToken as TokenProvider) : undefined,
    });

    setVideoClient(client);

    return () => {
      client.disconnectUser();
      setVideoClient(null);
    };
  }, [user?.id, user?.username, user?.imageUrl, userLoaded]);

  return videoClient;
}
