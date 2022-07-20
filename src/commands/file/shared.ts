import { CommandInteraction, AttachmentBuilder } from 'discord.js';

export const types = ['image', 'video', 'audio'] as const;
export type Type = typeof types[number];
export const extensions: Record<Type, string[]> = {
  image: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
  video: ['mp4', 'mov', 'mkv', 'webm'],
  audio: ['mp3', 'wav', 'ogg']
};

export function sendFile(i: CommandInteraction, fileName: string) {
  const url = `${process.env.FILES_ORIGIN}/discord/${fileName}`;
  const extension = fileName.split('.').pop() || '';
  if (extensions.audio.includes(extension))
    return i.reply({
      content: null,
      files: [new AttachmentBuilder(url, { name: fileName })]
    });
  return i.reply(url);
}
