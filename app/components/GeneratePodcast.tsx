import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/convex/_generated/api";
import { GeneratePodcastProps } from "@/types";
import { useAction, useMutation } from "convex/react";
import { Loader } from "lucide-react";
import { useState } from "react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useToast } from "@/components/ui/use-toast";

const useGeneratePodcast = ({
  onSetAudioStorageId,
  onSetAudioUrl,
  voiceType,
  audioUrl,
  voicePrompt,
  onSetVoicePrompt,
  onSetAudioDuration,
}: GeneratePodcastProps) => {
  const { toast } = useToast();
  const getPodcastAudio = useAction(api.openai.generateAudioAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getAudioUrl = useMutation(api.podcasts.getUrl);

  const [isGenerating, setIsGenerating] = useState(false);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const generatePodcast = async () => {
    setIsGenerating(true);
    onSetAudioUrl("");

    if (!voicePrompt) {
      toast({
        title: "Ups! Something went wrong",
        description: "Please provide a voice prompt",
      });
      return setIsGenerating(false);
    }

    try {
      const response = await getPodcastAudio({
        voice: voiceType!,
        input: voicePrompt,
      });
      const blob = new Blob([response], { type: "audio/mpeg" });
      const fileName = `podcast-${crypto.randomUUID()}.mp3`;
      const file = new File([blob], fileName, { type: "audio/mpeg" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      onSetAudioStorageId(storageId);

      const audioUrl = await getAudioUrl({ storageId });
      onSetAudioUrl(audioUrl!);
      toast({
        title: "Yey!",
        description: "Podcast generated successfully!",
      });
    } catch (error) {
      toast({
        title: "Ups! Something went wrong",
        description: "Error creating a podcast",
        variant: "destructive",
      });
      console.log("Error generating podcast", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    isGenerating,
    generatePodcast,
  };
};

function GeneratePodcast({
  onSetAudioStorageId,
  onSetAudioUrl,
  voiceType,
  audioUrl,
  voicePrompt,
  onSetVoicePrompt,
  onSetAudioDuration,
}: GeneratePodcastProps) {
  const { isGenerating, generatePodcast } = useGeneratePodcast({
    onSetAudioStorageId,
    onSetAudioUrl,
    voiceType,
    audioUrl,
    voicePrompt,
    onSetVoicePrompt,
    onSetAudioDuration,
  });

  return (
    <div>
      <div className="flex flex-col gap-2.5">
        <Label className="text-16 font-bold text-white-1">
          AI prompt to generate Podcast Audio
        </Label>
        <Textarea
          className="input-class font-light focus-visible:ring-offset-orange-1"
          placeholder="Provide text to generate audio"
          rows={5}
          value={voicePrompt}
          onChange={(e) => onSetVoicePrompt(e.target.value)}
        />
      </div>
      <div className="mt-5 w-full max-w-[200px]">
        <Button
          type="button"
          className="text-16 bg-orange-1 py-4 font-bold text-white-1"
          onClick={generatePodcast}
          disabled={isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader size={20} className="animate-spin mr-5" /> Generating
            </>
          ) : (
            "Generate"
          )}
        </Button>
      </div>
      {audioUrl && (
        <audio
          controls
          src={audioUrl}
          autoPlay
          className="mt-5"
          onLoadedMetadata={(e) => onSetAudioDuration(e.currentTarget.duration)}
        />
      )}
    </div>
  );
}

export default GeneratePodcast;
