import LottieModule from 'lottie-react';

// lottie-react er en CommonJS-pakke. Under Vite 8 blir standardimporten noen ganger hele modulen i stedet for komponenten,
// og da krasjer forsiden hver gang en høytidsanimasjon vises. Dette fungerer i begge tilfeller.
const Lottie = ((LottieModule as unknown as { default?: typeof LottieModule }).default ?? LottieModule) as typeof LottieModule;

interface LottieAnimationProps {
  animationData: any;
  className?: string;
  loop?: boolean;
  autoplay?: boolean;
}

export function LottieAnimation({ 
  animationData, 
  className = "", 
  loop = true, 
  autoplay = true 
}: LottieAnimationProps) {
  return (
    <Lottie
      animationData={animationData}
      className={className}
      loop={loop}
      autoplay={autoplay}
    />
  );
}