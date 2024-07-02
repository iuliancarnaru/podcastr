import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { GenerateThumbnailProps } from "@/types";
import { Loader } from "lucide-react";
import Image from "next/image";
import React, { ChangeEvent, useRef, useState } from "react";
import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

function GenerateThumbnail({
  onSetImageUrl,
  onSetImageStorageId,
  imageUrl,
  imagePrompt,
  onSetImagePrompt,
}: GenerateThumbnailProps) {
  const { toast } = useToast();

  const [isAiThumbnail, setIsAiThumbnail] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getImageUrl = useMutation(api.podcasts.getUrl);
  const { startUpload } = useUploadFiles(generateUploadUrl);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    onSetImageUrl("");

    try {
      const file = new File([blob], fileName, { type: "image/png" });
      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;
      onSetImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      onSetImageUrl(imageUrl!);
      toast({
        title: "Yey!",
        description: "Thumbnail generated successfully!",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Ups! Something went wrong",
        description: "Error creating an image",
        variant: "destructive",
      });
    } finally {
      setIsImageLoading(false);
    }
  };

  const uploadImage = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];

      const blob = await file
        .arrayBuffer()
        .then((arrBuf) => new Blob([arrBuf]));

      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: "Ups! Something went wrong",
        description: "Error uploading an image",
        variant: "destructive",
      });
    }
  };

  const generateImage = async () => {
    try {
      setIsImageLoading(true);
      const response = await handleGenerateThumbnail({
        prompt: imagePrompt,
      });

      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${crypto.randomUUID()}.png`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Ups! Something went wrong",
        description: "Error uploading an image",
        variant: "destructive",
      });
    } finally {
      setIsImageLoading(false);
    }
  };

  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6": isAiThumbnail })}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use AI to generate thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6": !isAiThumbnail })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload custom image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div className="flex flex-col gap-5">
          <div className="mt-5 flex flex-col gap-2.5">
            <Label className="text-16 font-bold text-white-1">
              AI prompt to generate Image
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => onSetImagePrompt(e.target.value)}
            />
          </div>
          <div className="w-full max-w-[200px]">
            <Button
              type="button"
              className="text-16 bg-orange-1 py-4 font-bold text-white-1"
              onClick={generateImage}
              disabled={isImageLoading}
            >
              {isImageLoading ? (
                <>
                  <Loader size={20} className="animate-spin mr-5" /> Generating
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef?.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              <Loader size={20} className="animate-spin mr-5" /> Uploading
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              SVG, PNG, JPG or GIF (max 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {imageUrl && (
        <div className="flex-center w-full">
          <Image
            src={imageUrl}
            width={200}
            height={200}
            className="mt-5"
            alt="thumbnail"
          />
        </div>
      )}
    </>
  );
}

export default GenerateThumbnail;
