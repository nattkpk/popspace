import { AvatarMetadata } from '../constants/AvatarMetadata';
import seedRandom from 'seed-random';

export interface IAvatar {
  name: string;
  image: string;
  blink: string;
  backgroundColor: string;
  category: string;
}

const AVATAR_HOST = `https://s3.us-east-2.amazonaws.com/with.avatars`;

const options: { [name: string]: IAvatar } = {};

for (const avatarCategory of Object.keys(AvatarMetadata)) {
  const rawMetaData = AvatarMetadata[avatarCategory as keyof typeof AvatarMetadata];
  for (const avatar of rawMetaData) {
    const avatarData: IAvatar = {
      name: avatar.name,
      image: `${AVATAR_HOST}/${avatar.name}.png`,
      blink: `${AVATAR_HOST}/${avatar.name}_blink.png`,
      backgroundColor: avatar.color,
      category: avatarCategory,
    };
    options[avatar.name] = avatarData;
  }
}

const randomAvatar = (seed?: string) => {
  const names = Object.keys(options);
  const name = names[Math.floor(seedRandom(seed)() * names.length)];
  return options[name]!;
};

export { options, randomAvatar };
