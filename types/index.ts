import { Id } from "@/convex/_generated/dataModel";
import { Dispatch, SetStateAction } from "react";

export interface GeneratePodcastProps {
  onSetAudioStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  onSetAudioUrl: Dispatch<SetStateAction<string>>;
  voiceType: string | null;
  audioUrl: string;
  voicePrompt: string;
  onSetVoicePrompt: Dispatch<SetStateAction<string>>;
  onSetAudioDuration: Dispatch<SetStateAction<number>>;
}

export interface GenerateThumbnailProps {
  onSetImageUrl: Dispatch<SetStateAction<string>>;
  onSetImageStorageId: Dispatch<SetStateAction<Id<"_storage"> | null>>;
  imageUrl: string;
  imagePrompt: string;
  onSetImagePrompt: Dispatch<SetStateAction<string>>;
}

export interface PodcastCardProps {
  imgURL: string;
  title: string;
  description: string;
  podcastId: Id<"podcasts">;
}

export interface EmptyStateProps {
  title: string;
  buttonLink?: string;
  buttonText?: string;
  search?: boolean;
}

export interface PodcastDetailsPlayerProps {
  isOwner: boolean;
  podcastId: Id<"podcasts">;
  imageStorageId: Id<"_storage">;
  audioStorageId: Id<"_storage">;
  podcastTitle: string;
  audioUrl: string;
  imageUrl: string;
  author: string;
  authorImageUrl: string;
  authorId: string;
}

export interface TopPodcastersProps {
  _id: Id<"users">;
  _creationTime: number;
  email: string;
  imageUrl: string;
  clerkId: string;
  name: string;
  podcast: {
    podcastTitle: string;
    podcastId: Id<"podcasts">;
  }[];
  totalPodcasts: number;
}

export interface CarouselProps {
  fansLikeDetail: TopPodcastersProps[];
}

export type VoiceType =
  | "alloy"
  | "echo"
  | "fable"
  | "onyx"
  | "nova"
  | "shimmer";

export interface AudioProps {
  title: string;
  audioUrl: string;
  author: string;
  imageUrl: string;
  podcastId: string;
}

export interface AudioContextType {
  audio: AudioProps | undefined;
  setAudio: Dispatch<SetStateAction<AudioProps | undefined>>;
}

export interface PodcastProps {
  _id: Id<"podcasts">;
  _creationTime: number;
  audioStorageId: Id<"_storage"> | null;
  user: Id<"users">;
  podcastTitle: string;
  podcastDescription: string;
  audioUrl: string | null;
  imageUrl: string | null;
  imageStorageId: Id<"_storage"> | null;
  author: string;
  authorId: string;
  authorImageUrl: string;
  voicePrompt: string;
  imagePrompt: string | null;
  voiceType: string;
  audioDuration: number;
  views: number;
}

export interface ProfilePodcastProps {
  podcasts: PodcastProps[];
  listeners: number;
}

export interface ProfileCardProps {
  podcastData: ProfilePodcastProps;
  imageUrl: string;
  userFirstName: string;
}
