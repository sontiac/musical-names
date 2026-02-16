import type { Metadata } from 'next';
import NamePlayer from '@/components/NamePlayer';

interface Props {
  searchParams: Promise<{ name?: string; mode?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const params = await searchParams;
  const name = params.name;
  const mode = params.mode;

  if (name) {
    const modeLabel = mode ? ` in ${mode} mode` : '';
    return {
      title: `Hear what ${name} sounds like`,
      description: `${name} has a unique melody${modeLabel}. Type any name and hear its sound.`,
      openGraph: {
        title: `Hear what ${name} sounds like`,
        description: `${name} has a unique melody${modeLabel}. Type any name and hear its sound.`,
      },
      twitter: {
        card: 'summary_large_image',
        title: `Hear what ${name} sounds like`,
        description: `${name} has a unique melody${modeLabel}. Type any name and hear its sound.`,
      },
    };
  }

  return {
    title: 'What Does Your Name Sound Like?',
    description: 'Type any name and hear its unique melody. Every name has a sound — discover yours.',
    openGraph: {
      title: 'What Does Your Name Sound Like?',
      description: 'Type any name and hear its unique melody. Every name has a sound — discover yours.',
    },
    twitter: {
      card: 'summary_large_image',
      title: 'What Does Your Name Sound Like?',
      description: 'Type any name and hear its unique melody. Every name has a sound — discover yours.',
    },
  };
}

export default function Home() {
  return <NamePlayer />;
}
