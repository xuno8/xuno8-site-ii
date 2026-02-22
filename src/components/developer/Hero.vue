<script setup lang="ts">
import { ref, computed } from 'vue';
import gsap from 'gsap';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';
import type { SocialLink } from '@/types';

const props = defineProps<{
  name: string;
  title: string;
  intro: string;
  avatarSrc?: string;
  avatarWidth?: number;
  avatarHeight?: number;
  socialLinks: SocialLink[];
  email: string;
}>();

const platformIcons: Record<string, string> = {
  github:
    'M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z',
  linkedin:
    'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z',
  instagram:
    'M12 2.163c3.204 0 3.584.012 4.85.07 1.17.054 1.97.24 2.43.403a4.088 4.088 0 0 1 1.522.99 4.088 4.088 0 0 1 .99 1.522c.163.46.349 1.26.403 2.43.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.054 1.17-.24 1.97-.403 2.43a4.088 4.088 0 0 1-.99 1.522 4.088 4.088 0 0 1-1.522.99c-.46.163-1.26.349-2.43.403-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.17-.054-1.97-.24-2.43-.403a4.088 4.088 0 0 1-1.522-.99 4.088 4.088 0 0 1-.99-1.522c-.163-.46-.349-1.26-.403-2.43C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.054-1.17.24-1.97.403-2.43a4.088 4.088 0 0 1 .99-1.522 4.088 4.088 0 0 1 1.522-.99c.46-.163 1.26-.349 2.43-.403C8.416 2.175 8.796 2.163 12 2.163ZM12 0C8.741 0 8.333.014 7.053.072 5.775.13 4.902.333 4.14.63a5.876 5.876 0 0 0-2.126 1.384A5.876 5.876 0 0 0 .63 4.14C.333 4.902.13 5.775.072 7.053.014 8.333 0 8.741 0 12s.014 3.667.072 4.947c.058 1.278.261 2.151.558 2.913a5.876 5.876 0 0 0 1.384 2.126A5.876 5.876 0 0 0 4.14 23.37c.762.297 1.635.5 2.913.558C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.278-.058 2.151-.261 2.913-.558a5.876 5.876 0 0 0 2.126-1.384 5.876 5.876 0 0 0 1.384-2.126c.297-.762.5-1.635.558-2.913.058-1.28.072-1.688.072-4.947s-.014-3.667-.072-4.947c-.058-1.278-.261-2.151-.558-2.913a5.876 5.876 0 0 0-1.384-2.126A5.876 5.876 0 0 0 19.86.63C19.098.333 18.225.13 16.947.072 15.667.014 15.259 0 12 0Zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881Z',
};

const emailIcon =
  'M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67ZM22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z';

// Fallback icon for unsupported platforms (generic link icon)
const fallbackIcon =
  'M13.544 10.456a4.368 4.368 0 0 0-6.176 0l-3.089 3.088a4.367 4.367 0 1 0 6.177 6.177L12 18.177a.75.75 0 0 1 1.06 1.061l-1.544 1.544a5.867 5.867 0 0 1-8.298-8.298l3.089-3.088a5.868 5.868 0 0 1 8.298 0 .75.75 0 1 1-1.06 1.06Zm-3.088-3.088a4.367 4.367 0 0 0 6.177 0l3.088-3.088a4.367 4.367 0 1 0-6.177-6.177L12 9.647A.75.75 0 0 1 10.94 8.586l1.544-1.543a5.867 5.867 0 0 1 8.298 8.298l-3.088 3.088a5.868 5.868 0 0 1-8.298 0 .75.75 0 1 1 1.06-1.06Z';

const getPlatformIcon = (platform: string): string => {
  const icon = platformIcons[platform];
  if (!icon && import.meta.env.DEV) {
    console.warn(`[Hero] No icon found for platform "${platform}". Using fallback icon.`);
  }
  return icon || fallbackIcon;
};

const sectionRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

// Typing animation state
const whoamiChars = ref(0);
const nameChars = ref(0);
const contactChars = ref(0);
const animationDone = ref(false);

const whoamiText = '$ whoami';
const contactText = '$ contact --list';

const displayedWhoami = computed(() => whoamiText.slice(0, whoamiChars.value));
const displayedName = computed(() => props.name.slice(0, nameChars.value));
const displayedContact = computed(() => contactText.slice(0, contactChars.value));

// Visibility flags for staggered reveal
const showContentBox = ref(false);
const showAvatar = ref(false);
const showTitle = ref(false);
const showIntro = ref(false);
const showContactBox = ref(false);
const showLinks = ref<boolean[]>([]);

useGsapContext(() => {
  if (prefersReducedMotion.value) {
    // Show everything immediately
    whoamiChars.value = whoamiText.length;
    nameChars.value = props.name.length;
    contactChars.value = contactText.length;
    showContentBox.value = true;
    showAvatar.value = true;
    showTitle.value = true;
    showIntro.value = true;
    showContactBox.value = true;
    showLinks.value = Array(props.socialLinks.length + 1).fill(true);
    animationDone.value = true;
    return;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      animationDone.value = true;
    },
  });

  // Phase 1: Terminal window fades in
  tl.from(sectionRef.value!, {
    opacity: 0,
    y: 20,
    duration: 0.4,
    ease: 'power2.out',
  });

  // Phase 2: "$ whoami" types out
  tl.to(
    whoamiChars,
    {
      value: whoamiText.length,
      duration: 0.4,
      ease: 'none',
      snap: { value: 1 },
    },
    '+=0.05',
  );

  // Phase 3: Content box appears
  tl.call(
    () => {
      showContentBox.value = true;
    },
    [],
    '+=0.1',
  );

  // Phase 4: Avatar + Name typing + Title + Intro
  tl.call(
    () => {
      showAvatar.value = true;
    },
    [],
    '+=0.05',
  );

  tl.from(
    '.hero-avatar',
    {
      opacity: 0,
      scale: 0.9,
      duration: 0.3,
      ease: 'power2.out',
    },
    '+=0.05',
  );

  tl.to(
    nameChars,
    {
      value: props.name.length,
      duration: props.name.length * 0.03,
      ease: 'none',
      snap: { value: 1 },
    },
    '+=0.08',
  );

  tl.call(() => {
    showTitle.value = true;
  });

  tl.from('.hero-title', { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' }, '+=0.05');

  tl.call(
    () => {
      showIntro.value = true;
    },
    [],
    '+=0.05',
  );

  tl.from('.hero-intro', { opacity: 0, y: 10, duration: 0.3, ease: 'power2.out' }, '+=0.05');

  // Phase 5: "$ contact --list" types + links appear
  tl.to(
    contactChars,
    {
      value: contactText.length,
      duration: 0.4,
      ease: 'none',
      snap: { value: 1 },
    },
    '+=0.1',
  );

  tl.call(
    () => {
      showContactBox.value = true;
    },
    [],
    '+=0.05',
  );

  // Stagger links
  const totalLinks = props.socialLinks.length + 1; // +1 for email
  showLinks.value = Array(totalLinks).fill(false);
  for (let i = 0; i < totalLinks; i++) {
    tl.call(
      () => {
        showLinks.value[i] = true;
      },
      [],
      i === 0 ? '+=0.05' : '+=0.06',
    );
  }
}, sectionRef);
</script>

<template>
  <section ref="sectionRef" class="hero-section">
    <!-- Terminal Window -->
    <div class="terminal">
      <!-- Title Bar -->
      <div class="terminal-titlebar">
        <div class="terminal-dots">
          <span class="dot dot-close" />
          <span class="dot dot-minimize" />
          <span class="dot dot-maximize" />
        </div>
        <span class="terminal-title">tim@xuno8: ~</span>
      </div>

      <!-- Terminal Body -->
      <div class="terminal-body">
        <!-- $ whoami -->
        <div class="prompt-line">
          <span class="prompt-text">{{ displayedWhoami }}</span>
          <span
            v-if="!showContentBox && whoamiChars > 0"
            class="cursor"
            :class="{ 'cursor-blink': whoamiChars >= whoamiText.length }"
            >█</span
          >
        </div>

        <!-- whoami output: avatar + name + title + intro -->
        <div v-if="showContentBox" class="content-box">
          <div class="whoami-layout">
            <div v-if="avatarSrc && showAvatar" class="hero-avatar">
              <img
                :src="avatarSrc"
                :width="avatarWidth"
                :height="avatarHeight"
                alt="Avatar"
                class="avatar-img"
                loading="eager"
                fetchpriority="high"
              />
            </div>
            <div class="whoami-text">
              <h1 class="hero-name">
                {{ displayedName }}<span v-if="nameChars < name.length" class="cursor">█</span>
              </h1>
              <p v-if="showTitle" class="hero-title">{{ title }}</p>
              <p v-if="showIntro" class="hero-intro">{{ intro }}</p>
            </div>
          </div>
        </div>

        <!-- $ contact --list -->
        <div class="prompt-line contact-prompt">
          <span class="prompt-text">{{ displayedContact }}</span>
          <span
            v-if="contactChars > 0 && !showContactBox"
            class="cursor"
            :class="{ 'cursor-blink': contactChars >= contactText.length }"
            >█</span
          >
        </div>

        <!-- contact output: social links -->
        <div v-if="showContactBox" class="content-box contact-box">
          <div class="social-links">
            <a
              v-for="(link, i) in socialLinks"
              :key="link.platform"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
              :aria-label="link.label || link.platform"
              class="social-link"
              :class="{ 'link-visible': showLinks[i] }"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path :d="getPlatformIcon(link.platform)" />
              </svg>
              <span>{{ link.label || link.platform }}</span>
            </a>
            <a
              :href="`mailto:${email}`"
              class="social-link"
              :class="{ 'link-visible': showLinks[socialLinks.length] }"
              :aria-label="`Email ${email}`"
              :title="email"
            >
              <svg
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
                aria-hidden="true"
              >
                <path :d="emailIcon" />
              </svg>
              <span>Email</span>
            </a>
          </div>
        </div>

        <!-- Blinking cursor at the end -->
        <div class="prompt-line">
          <span
            v-if="animationDone"
            class="cursor final-cursor"
            :class="{ 'cursor-blink': !prefersReducedMotion }"
            >█</span
          >
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  padding: 60px 16px 40px;
  display: flex;
  justify-content: center;
}

/* Terminal Window */
.terminal {
  width: 100%;
  max-width: 720px;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    0 0 0 1px color-mix(in srgb, var(--color-accent) 10%, transparent),
    0 0 64px color-mix(in srgb, var(--color-accent) 4%, transparent);
  overflow: hidden;
  transform: translateX(-10px);
}

/* Title Bar */
.terminal-titlebar {
  display: flex;
  align-items: center;
  height: 40px;
  padding: 0 16px;
  background: linear-gradient(180deg, var(--color-bg-alt) 0%, var(--color-bg) 100%);
  border-bottom: 1px solid var(--color-border);
  gap: 12px;
}

.terminal-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot-close {
  background: #ff5f57;
  box-shadow: 0 0 4px rgba(255, 95, 87, 0.3);
}

.dot-minimize {
  background: #febc2e;
}

.dot-maximize {
  background: #28c840;
}

.terminal-title {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 400;
  color: var(--color-text-muted);
  letter-spacing: 0.02em;
}

/* Terminal Body */
.terminal-body {
  padding: 48px 40px;
}

/* Command Prompts */
.prompt-line {
  margin-bottom: 8px;
  min-height: 1.4em;
}

.prompt-text {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--color-accent);
  letter-spacing: 0.03em;
  text-shadow: 0 0 12px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.contact-prompt {
  margin-top: 32px;
}

/* Cursor */
.cursor {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--color-accent);
  margin-left: 2px;
}

.cursor-blink {
  animation: blink 1.2s steps(1, end) infinite;
}

.final-cursor {
  font-size: 0.9375rem;
}

@keyframes blink {
  0%,
  49% {
    opacity: 1;
  }
  50%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cursor-blink {
    animation: none;
  }

  .social-link,
  .social-link svg {
    transition: none;
  }

  .social-link:hover,
  .social-link:active {
    transform: none;
  }

  .social-link:hover svg {
    transform: none;
  }
}

/* Content Box */
.content-box {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 32px;
  margin: 16px 0 0;
  opacity: 0.85;
  border-color: rgba(61, 72, 119, 0.6);
}

.contact-box {
  padding: 16px 24px;
}

/* Whoami Layout */
.whoami-layout {
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

/* Avatar */
.hero-avatar {
  flex-shrink: 0;
}

.avatar-img {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 2px solid transparent;
  background:
    linear-gradient(var(--color-bg), var(--color-bg)) padding-box,
    linear-gradient(135deg, #7dcfff 0%, #bb9af7 100%) border-box;
  box-shadow:
    0 0 24px color-mix(in srgb, var(--color-accent) 20%, transparent),
    0 0 48px color-mix(in srgb, var(--color-accent-2) 10%, transparent);
  transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.avatar-img:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow:
    0 0 32px color-mix(in srgb, var(--color-accent) 35%, transparent),
    0 0 64px color-mix(in srgb, var(--color-accent-2) 18%, transparent);
}

/* Name */
h1.hero-name {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 2rem;
  color: var(--color-text);
  letter-spacing: 0.05em;
  line-height: 1.1;
  text-shadow: 0 0 20px color-mix(in srgb, var(--color-accent-2) 30%, transparent);
  margin-bottom: 8px;
}

/* Title */
.hero-title {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 1rem;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.01em;
  line-height: 1.4;
  margin: 0 0 20px;
}

/* Intro */
.hero-intro {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 0.9375rem;
  color: var(--color-text);
  opacity: 0.9;
  line-height: 1.7;
  margin: 0;
}

/* Social Links */
.social-links {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px 32px;
}

.social-link {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 400;
  color: var(--color-text);
  letter-spacing: 0.02em;
  text-decoration: none;
  padding: 6px 10px;
  border-radius: 4px;
  border-left: 2px solid transparent;
  transition:
    color 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    background 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    border-color 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    opacity 0.3s cubic-bezier(0, 0.55, 0.45, 1);
  opacity: 0;
  min-height: 44px;
}

.social-link.link-visible {
  opacity: 1;
}

.social-link:hover {
  color: var(--color-accent-hover);
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--color-accent) 12%, transparent) 0%,
    color-mix(in srgb, var(--color-accent) 3%, transparent) 100%
  );
  border-left-color: var(--color-accent);
  transform: translateX(2px);
}

.social-link:hover svg {
  color: var(--color-accent);
  filter: drop-shadow(0 0 10px var(--color-accent)) drop-shadow(0 0 4px var(--color-accent));
  transform: scale(1.1);
}

.social-link:focus-visible {
  outline: 2px solid var(--color-accent);
  outline-offset: 2px;
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
}

.social-link:active {
  transform: translateX(1px) scale(0.98);
  background: color-mix(in srgb, var(--color-accent) 15%, transparent);
}

.social-link svg {
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition:
    color 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    filter 0.2s cubic-bezier(0.22, 1, 0.36, 1),
    transform 0.2s cubic-bezier(0.22, 1, 0.36, 1);
}

/* Responsive */
@media (max-width: 767px) {
  .hero-section {
    padding: 24px 16px 24px;
  }

  .terminal {
    transform: none;
  }

  .terminal-body {
    padding: 24px;
  }

  .whoami-layout {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .avatar-img {
    width: 64px;
    height: 64px;
  }

  .hero-name {
    font-size: 1.75rem;
  }

  .hero-title {
    font-size: 0.9375rem;
  }

  .hero-intro {
    font-size: 0.875rem;
    text-align: left;
  }

  .social-links {
    flex-direction: column;
    gap: 4px;
  }

  .content-box {
    padding: 20px;
  }

  .contact-box {
    padding: 12px 16px;
  }
}
</style>
