"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { voiceDetails } from "@/app/constants";
import { useState } from "react";
import GeneratePodcast from "@/app/components/GeneratePodcast";
import GenerateThumbnail from "@/app/components/GenerateThumbnail";
import { Loader } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";
import { useToast } from "@/components/ui/use-toast";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  podcastTitle: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  podcastDescription: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
});

function CreatePodcastPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [audioUrl, setAudioUrl] = useState("");
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioStorageId, setAudioStorageId] = useState<Id<"_storage"> | null>(
    null
  );

  const [imageUrl, setImageUrl] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageStorageId, setImageStorageId] = useState<Id<"_storage"> | null>(
    null
  );

  const [voiceType, setVoiceType] = useState<string | null>(null);
  const [voicePrompt, setVoicePrompt] = useState("");

  const createPodcast = useMutation(api.podcasts.createPodcast);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      podcastTitle: "",
      podcastDescription: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      if (!audioUrl || !imageUrl || !voiceType) {
        toast({
          title: "Ups! Something went wrong",
          description: "Please generate audio and image",
          variant: "destructive",
        });
        throw new Error("Please generate audio and image");
      }

      await createPodcast({
        podcastTitle: data.podcastTitle,
        podcastDescription: data.podcastDescription,
        audioUrl,
        imageUrl,
        voiceType,
        imagePrompt,
        voicePrompt,
        views: 0,
        audioDuration,
        audioStorageId: audioStorageId!,
        imageStorageId: imageStorageId!,
      });

      toast({
        title: "Yey!",
        description: "Podcast created",
      });

      router.push("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Ups! Something went wrong",
        description: "Error creating a podcast",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="mt-10 flex flex-col">
      <h1 className="text-20 font-bold text-white-1">Create Podcast</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 flex w-full flex-col"
        >
          <div className="flex flex-col gap-[30px] border-b border-black-5 pb-10">
            <FormField
              control={form.control}
              name="podcastTitle"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Title
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Podcast name"
                      {...field}
                      className="input-class focus-visible:ring-offset-orange-1"
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
            <div className="flex flex-col gap-2.5">
              <Label className="text-16 font-bold text-white-1">
                Select AI voice
              </Label>
              <Select onValueChange={(value) => setVoiceType(value)}>
                <SelectTrigger
                  className={cn(
                    "text-16 w-full border-none bg-black-1 text-gray-1 focus-visible:ring-offset-orange-1"
                  )}
                >
                  <SelectValue
                    className="placeholder:text-gray1"
                    placeholder="Select AI voice"
                  />
                </SelectTrigger>
                <SelectContent className="text-16 border-none bg-black-1 font-bold text-white-1 focus:ring-orange-1">
                  {voiceDetails?.map(({ id, name }) => (
                    <SelectItem
                      key={id}
                      value={name}
                      className="capitalize focus:bg-orange-1"
                    >
                      {name}
                    </SelectItem>
                  ))}
                </SelectContent>
                {voiceType && (
                  <audio
                    src={`/${voiceType}.mp3`}
                    autoPlay
                    className="hidden"
                  />
                )}
              </Select>
            </div>
            <FormField
              control={form.control}
              name="podcastDescription"
              render={({ field }) => (
                <FormItem className="flex flex-col gap-2.5">
                  <FormLabel className="text-16 font-bold text-white-1">
                    Description
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      className="input-class focus-visible:ring-offset-orange-1"
                      placeholder="Write a short podcast description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-white-1" />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col pt-10">
            <GeneratePodcast
              onSetAudioStorageId={setAudioStorageId}
              onSetAudioUrl={setAudioUrl}
              voiceType={voiceType}
              audioUrl={audioUrl}
              voicePrompt={voicePrompt}
              onSetVoicePrompt={setVoicePrompt}
              onSetAudioDuration={setAudioDuration}
            />
            <GenerateThumbnail
              onSetImageUrl={setImageUrl}
              onSetImageStorageId={setImageStorageId}
              imageUrl={imageUrl}
              imagePrompt={imagePrompt}
              onSetImagePrompt={setImagePrompt}
            />
          </div>
          <div className="mt-10 w-full">
            <Button
              type="submit"
              className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1"
            >
              {isSubmitting ? (
                <>
                  <Loader size={20} className="animate-spin mr-5" /> Submitting
                </>
              ) : (
                "Submit & Publish podcast"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export default CreatePodcastPage;
