import { MDXContent } from "@content-collections/mdx/react";
import type { MDXComponents } from "mdx/types";

import { CodeBlock } from "@/components/app/code-block";
import { Demo } from "@/components/app/demo";
import {
  ButtonPressDemo,
  PressAmountDemo,
  PressEverywhereDemo,
} from "@/components/demos/button-press";
import {
  ClipPathCompareDemo,
  ClipPathHoldDemo,
  ClipPathRevealDemo,
  ClipPathTabsDemo,
} from "@/components/demos/clip-path";
import {
  CurveOvershootDemo,
  CurveSmoothingDemo,
} from "@/components/demos/curve-smoothing";
import {
  EasingCurveDemo,
  EasingsDemo,
  StrongEasingDemo,
} from "@/components/demos/easings";
import {
  ExitAnimationsDemo,
  ExitListDemo,
} from "@/components/demos/exit-animations";
import {
  FontSmoothingContrastDemo,
  FontSmoothingDemo,
  FontSmoothingWeightsDemo,
} from "@/components/demos/font-smoothing";
import {
  HitAreasExpandDemo,
  HitAreasGapDemo,
  HitAreasToolbarDemo,
} from "@/components/demos/hit-areas";
import {
  HoverRestraintDemo,
  HoverTooltipDemo,
  KeyboardActionDemo,
} from "@/components/demos/hover-restraint";
import { HtmlBackgroundDemo } from "@/components/demos/html-background";
import {
  HamburgerMorphDemo,
  IconMorphDemo,
  IconMorphTuningDemo,
} from "@/components/demos/icon-morph";
import {
  IconMixDemo,
  IconTextSizeDemo,
  IconWeightsDemo,
} from "@/components/demos/icon-weights";
import {
  ImageOutlineAvatarDemo,
  ImageOutlineDemo,
  ImageOutlineStrengthDemo,
} from "@/components/demos/image-outline";
import {
  HoverSoundDemo,
  SoundCuesDemo,
  SoundLevelDemo,
} from "@/components/demos/interface-sfx";
import {
  InterruptibilityDemo,
  SpringVelocityDemo,
  ToastStackDemo,
} from "@/components/demos/interruptibility";
import {
  ArpeggioSpacingDemo,
  SoundLayersDemo,
  TextureLayersDemo,
} from "@/components/demos/layering-sounds";
import {
  LetterSpacingDemo,
  TrackingScaleDemo,
  UppercaseTrackingDemo,
} from "@/components/demos/letter-spacing";
import {
  LivingBarsDemo,
  LivingChartsDemo,
} from "@/components/demos/living-charts";
import {
  NestedRadiusDemo,
  NestedRadiusExamplesDemo,
  RadiusCalculatorDemo,
} from "@/components/demos/nested-radius";
import {
  NoiseBandingDemo,
  NoiseDemo,
  NoiseFrequencyDemo,
  NoiseSurfaceDemo,
} from "@/components/demos/noise";
import {
  AnimationCostDemo,
  NoveltyBudgetDemo,
} from "@/components/demos/novelty-budget";
import {
  OklchDemo,
  OklchGradientDemo,
  OklchPaletteDemo,
} from "@/components/demos/oklch";
import {
  HangingPunctuationDemo,
  OpticalAlignmentDemo,
  OpticalButtonDemo,
  OpticalSizingDemo,
  OpticalWeightDemo,
} from "@/components/demos/optical-alignment";
import {
  LoadingFlashDemo,
  OptimisticDemo,
  PerceivedPerformanceDemo,
  SpinnerSpeedDemo,
} from "@/components/demos/perceived-performance";
import { DepthOfFieldDemo } from "@/components/demos/references";
import {
  ScaleEntrancesDemo,
  StartingScaleDemo,
  TransformOriginDemo,
} from "@/components/demos/scale-entrances";
import {
  ScrollFadesDemo,
  ScrollFadesEdgeDemo,
  ScrollFadesHorizontalDemo,
} from "@/components/demos/scroll-fades";
import {
  ShadowDarkModeDemo,
  ShadowElevationDemo,
  ShadowLayersDemo,
  ShadowsNotBordersDemo,
} from "@/components/demos/shadows-not-borders";
import {
  SharedLayoutDemo,
  SharedLayoutDetailDemo,
} from "@/components/demos/shared-layout";
import {
  StaggerCapDemo,
  StaggerCompareDemo,
  StaggerDemo,
} from "@/components/demos/stagger";
import {
  TabularNumsDemo,
  TabularTableDemo,
  TabularTimerDemo,
} from "@/components/demos/tabular-nums";
import {
  PairJudgementDemo,
  SpotTheDifferenceDemo,
} from "@/components/demos/taste";
import {
  TextBalanceDemo,
  TextPrettyDemo,
  TextWrapToastDemo,
} from "@/components/demos/text-wrapping";
import { SurfaceErasDemo } from "@/components/demos/timelessness";
import { cn } from "@/lib/utils";

function getFaviconUrl(href?: string) {
  if (!href) return;

  try {
    const url = new URL(href);

    if (url.protocol !== "http:" && url.protocol !== "https:") return;

    return `https://www.google.com/s2/favicons?domain=${encodeURIComponent(url.hostname)}&sz=32`;
  } catch {
    return;
  }
}

const components: MDXComponents = {
  h2: ({ className, ...props }) => (
    <h2
      className={cn("mt-10 mb-4 text-base font-medium", className)}
      {...props}
    />
  ),
  h3: ({ className, ...props }) => (
    <h3 className={cn("mt-8 mb-3 text-sm font-medium", className)} {...props} />
  ),
  p: ({ className, ...props }) => (
    <p
      className={cn(
        "my-4 text-sm leading-[1.8] text-pretty text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  a: ({ className, children, href, ...props }) => {
    const faviconUrl = getFaviconUrl(href);

    return (
      <a
        className={cn(
          "text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground",
          className,
        )}
        href={href}
        target={faviconUrl ? "_blank" : undefined}
        rel={faviconUrl ? "noreferrer" : undefined}
        {...props}
      >
        {faviconUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            aria-hidden="true"
            alt=""
            className="mr-1 inline-block size-3.5 rounded-[3px] align-[-2px]"
            decoding="async"
            height={14}
            loading="lazy"
            src={faviconUrl}
            width={14}
          />
        ) : null}
        {children}
      </a>
    );
  },
  ul: ({ className, ...props }) => (
    <ul
      className={cn(
        "my-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }) => (
    <ol
      className={cn(
        "my-4 list-decimal space-y-2 pl-5 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    />
  ),
  strong: ({ className, ...props }) => (
    <strong
      className={cn("font-medium text-foreground", className)}
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={cn(
        "rounded-[3px] bg-primary/7 shadow-(--custom-shadow) px-1 py-0.5 font-mono text-[0.8em] text-foreground mx-0.75",
        className,
      )}
      {...props}
    />
  ),
  pre: ({ className, ...props }) => (
    <pre
      className={cn(
        "my-6 overflow-x-auto rounded-xl shadow-(--custom-shadow) bg-card p-4 text-xs leading-relaxed [&>code]:bg-transparent [&>code]:p-0 [&>code]:shadow-none",
        className,
      )}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }) => (
    <blockquote
      className={cn(
        "my-6 border-l-2 pl-4 text-sm text-muted-foreground italic",
        className,
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }) => (
    <hr className={cn("my-10", className)} {...props} />
  ),
  Demo,
  AnimationCostDemo,
  ArpeggioSpacingDemo,
  ButtonPressDemo,
  ClipPathCompareDemo,
  ClipPathHoldDemo,
  ClipPathRevealDemo,
  ClipPathTabsDemo,
  CurveOvershootDemo,
  CurveSmoothingDemo,
  DepthOfFieldDemo,
  EasingCurveDemo,
  EasingsDemo,
  ExitAnimationsDemo,
  ExitListDemo,
  FontSmoothingContrastDemo,
  FontSmoothingDemo,
  FontSmoothingWeightsDemo,
  HamburgerMorphDemo,
  HangingPunctuationDemo,
  HitAreasExpandDemo,
  HitAreasGapDemo,
  HitAreasToolbarDemo,
  HoverRestraintDemo,
  HoverSoundDemo,
  HoverTooltipDemo,
  HtmlBackgroundDemo,
  IconMixDemo,
  IconMorphDemo,
  IconMorphTuningDemo,
  IconTextSizeDemo,
  IconWeightsDemo,
  ImageOutlineAvatarDemo,
  ImageOutlineDemo,
  ImageOutlineStrengthDemo,
  InterruptibilityDemo,
  KeyboardActionDemo,
  LetterSpacingDemo,
  LivingBarsDemo,
  LivingChartsDemo,
  LoadingFlashDemo,
  NestedRadiusDemo,
  NestedRadiusExamplesDemo,
  NoiseBandingDemo,
  NoiseDemo,
  NoiseFrequencyDemo,
  NoiseSurfaceDemo,
  NoveltyBudgetDemo,
  OklchDemo,
  OklchGradientDemo,
  OklchPaletteDemo,
  OpticalAlignmentDemo,
  OpticalButtonDemo,
  OpticalSizingDemo,
  OpticalWeightDemo,
  OptimisticDemo,
  PairJudgementDemo,
  PerceivedPerformanceDemo,
  PressAmountDemo,
  PressEverywhereDemo,
  RadiusCalculatorDemo,
  ScaleEntrancesDemo,
  ScrollFadesDemo,
  ScrollFadesEdgeDemo,
  ScrollFadesHorizontalDemo,
  ShadowDarkModeDemo,
  ShadowElevationDemo,
  ShadowLayersDemo,
  ShadowsNotBordersDemo,
  SharedLayoutDemo,
  SharedLayoutDetailDemo,
  SoundCuesDemo,
  SoundLayersDemo,
  SoundLevelDemo,
  SpinnerSpeedDemo,
  SpotTheDifferenceDemo,
  SpringVelocityDemo,
  StaggerCapDemo,
  StaggerCompareDemo,
  StaggerDemo,
  StartingScaleDemo,
  StrongEasingDemo,
  SurfaceErasDemo,
  TabularNumsDemo,
  TabularTableDemo,
  TabularTimerDemo,
  TextBalanceDemo,
  TextPrettyDemo,
  TextWrapToastDemo,
  TextureLayersDemo,
  ToastStackDemo,
  TrackingScaleDemo,
  TransformOriginDemo,
  UppercaseTrackingDemo,
  CodeBlock,
};

export function Mdx({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
