<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { useReducedMotion } from '@/composables/useReducedMotion';
import type { SocialLink } from '@/types';
import HeroSocialLinks from './HeroSocialLinks.vue';

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

const sectionRef = ref<HTMLElement | null>(null);
const terminalBodyRef = ref<HTMLElement | null>(null);
const hiddenInputRef = ref<HTMLInputElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

// Desktop detection
const isDesktop = ref(false);

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

// Cursor visibility driven by timeline progress
const showWhoamiCursor = ref(false);
const showContactCursor = ref(false);

// Interactive terminal state
type TerminalState = 'idle' | 'typing' | 'executing' | 'animating';
const terminalState = ref<TerminalState>('idle');
const inputText = ref('');
const inputFocused = ref(false);

// Command history (only latest)
const commandHistory = ref<{ prompt: string; output: string } | null>(null);

// GSAP context manually managed instead of useGsapContext — the `clear` command
// needs to kill and rebuild the entry timeline, which useGsapContext doesn't support.
let gsapCtx: gsap.Context | null = null;
let entryTimeline: gsap.core.Timeline | null = null;

const animTargets = '.content-box, .hero-avatar, .hero-title, .hero-intro, .contact-box';

function resetTerminalState() {
  whoamiChars.value = 0;
  nameChars.value = 0;
  contactChars.value = 0;
  animationDone.value = false;
  showWhoamiCursor.value = false;
  showContactCursor.value = false;
  inputText.value = '';
  terminalState.value = 'animating';
}

function setInitialHiddenState() {
  gsap.set(animTargets, { autoAlpha: 0 });
  gsap.set('.hero-avatar', { scale: 0.9 });
  gsap.set('.hero-title, .hero-intro', { y: 10 });
  gsap.set('.social-link', { autoAlpha: 0 });
}

function buildEntryTimeline(skipFadeIn = false): gsap.core.Timeline {
  const tl = gsap.timeline({
    onComplete: () => {
      animationDone.value = true;
      terminalState.value = 'idle';
      nextTick(() => {
        if (isDesktop.value) {
          hiddenInputRef.value?.focus();
        }
      });
    },
  });

  // Phase 1: Terminal window fades in (skip on replay)
  if (!skipFadeIn) {
    tl.from(sectionRef.value!, {
      opacity: 0,
      y: 20,
      duration: 0.4,
      ease: 'power2.out',
    });
  }

  // Phase 2: "$ whoami" types out
  tl.call(
    () => {
      showWhoamiCursor.value = true;
    },
    [],
    '+=0.05',
  );
  tl.to(whoamiChars, {
    value: whoamiText.length,
    duration: 0.4,
    ease: 'none',
    snap: { value: 1 },
  });

  // Phase 3: Content box appears
  tl.call(
    () => {
      showWhoamiCursor.value = false;
    },
    [],
    '+=0.1',
  );
  tl.to('.content-box', { autoAlpha: 1, duration: 0.01 });

  // Phase 4: Avatar + Name typing + Title + Intro
  tl.to(
    '.hero-avatar',
    {
      autoAlpha: 1,
      scale: 1,
      duration: 0.3,
      ease: 'power2.out',
    },
    '+=0.1',
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

  tl.to('.hero-title', { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '+=0.05');
  tl.to('.hero-intro', { autoAlpha: 1, y: 0, duration: 0.3, ease: 'power2.out' }, '+=0.05');

  // Phase 5: "$ contact --list" types + links appear
  tl.call(
    () => {
      showContactCursor.value = true;
    },
    [],
    '+=0.1',
  );
  tl.to(contactChars, {
    value: contactText.length,
    duration: 0.4,
    ease: 'none',
    snap: { value: 1 },
  });

  tl.call(
    () => {
      showContactCursor.value = false;
    },
    [],
    '+=0.05',
  );
  tl.to('.contact-box', { autoAlpha: 1, duration: 0.01 });
  tl.to('.social-link', { autoAlpha: 1, stagger: 0.06 }, '+=0.05');

  return tl;
}

// --- Command handlers ---

function runClearCommand() {
  terminalState.value = 'animating';
  commandHistory.value = null;

  const body = terminalBodyRef.value;
  if (!body) return;

  if (prefersReducedMotion.value) {
    resetTerminalState();
    whoamiChars.value = whoamiText.length;
    nameChars.value = props.name.length;
    contactChars.value = contactText.length;
    animationDone.value = true;
    terminalState.value = 'idle';
    gsap.set(animTargets, { autoAlpha: 1 });
    gsap.set('.social-link', { autoAlpha: 1 });
    nextTick(() => hiddenInputRef.value?.focus());
    return;
  }

  // Slide content up and fade out
  gsap.to(body.children, {
    y: -30,
    opacity: 0,
    duration: 0.3,
    ease: 'power2.in',
    stagger: 0.02,
    onComplete: () => {
      // Reset positions
      gsap.set(body.children, { y: 0, opacity: 1 });

      // Kill previous entry timeline
      if (entryTimeline) {
        entryTimeline.kill();
        entryTimeline = null;
      }

      resetTerminalState();
      setInitialHiddenState();

      // Rebuild and play (skip Phase 1 fade-in)
      entryTimeline = buildEntryTimeline(true);
    },
  });
}

const commands: Record<string, { output: string; handler: () => void }> = {
  clear: {
    output: '',
    handler: runClearCommand,
  },
};

function handleCommand() {
  const cmd = inputText.value.trim();
  inputText.value = '';

  if (!cmd) return;

  terminalState.value = 'executing';

  const match = commands[cmd];
  if (match) {
    commandHistory.value = match.output ? { prompt: `$ ${cmd}`, output: match.output } : null;
    nextTick(() => match.handler());
  } else {
    commandHistory.value = {
      prompt: `$ ${cmd}`,
      output: `bash: ${cmd}: command not found`,
    };
    terminalState.value = 'idle';
    nextTick(() => hiddenInputRef.value?.focus());
  }
}

function handleTerminalClick(e: MouseEvent) {
  if (!isDesktop.value || !animationDone.value) return;
  const target = e.target as HTMLElement;
  if (target.closest('a')) return;
  hiddenInputRef.value?.focus();
}

function handleInputFocus() {
  inputFocused.value = true;
}

function handleInputBlur() {
  inputFocused.value = false;
}

// Auto-focus when animation finishes
watch(animationDone, (done) => {
  if (done && isDesktop.value) {
    nextTick(() => hiddenInputRef.value?.focus());
  }
});

onMounted(() => {
  isDesktop.value = window.matchMedia('(min-width: 768px)').matches;

  gsapCtx = gsap.context(() => {
    if (prefersReducedMotion.value) {
      whoamiChars.value = whoamiText.length;
      nameChars.value = props.name.length;
      contactChars.value = contactText.length;
      animationDone.value = true;
      gsap.set(animTargets, { autoAlpha: 1 });
      gsap.set('.social-link', { autoAlpha: 1 });
      return;
    }

    setInitialHiddenState();
    entryTimeline = buildEntryTimeline(false);
  }, sectionRef.value ?? undefined);
});

onUnmounted(() => {
  gsapCtx?.revert();
});
</script>

<template>
  <section ref="sectionRef" class="hero-section">
    <!-- Terminal Window -->
    <div class="terminal" @click="handleTerminalClick">
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
      <div ref="terminalBodyRef" class="terminal-body">
        <!-- $ whoami -->
        <div class="prompt-line">
          <span class="prompt-text">{{ displayedWhoami }}</span>
          <span
            v-if="showWhoamiCursor"
            class="cursor"
            :class="{ 'cursor-blink': whoamiChars >= whoamiText.length }"
            >█</span
          >
        </div>

        <!-- whoami output: avatar + name + title + intro -->
        <div class="content-box">
          <div class="whoami-layout">
            <div v-if="avatarSrc" class="hero-avatar">
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
              <p class="hero-title">{{ title }}</p>
              <p class="hero-intro">{{ intro }}</p>
            </div>
          </div>
        </div>

        <!-- $ contact --list -->
        <div class="prompt-line contact-prompt">
          <span class="prompt-text">{{ displayedContact }}</span>
          <span
            v-if="showContactCursor"
            class="cursor"
            :class="{ 'cursor-blink': contactChars >= contactText.length }"
            >█</span
          >
        </div>

        <!-- contact output: social links -->
        <div class="content-box contact-box">
          <HeroSocialLinks :social-links="socialLinks" :email="email" />
        </div>

        <!-- Command history (latest only) -->
        <div v-if="commandHistory" class="command-history">
          <div class="prompt-line">
            <span class="prompt-text">{{ commandHistory.prompt }}</span>
          </div>
          <div class="output-line">{{ commandHistory.output }}</div>
        </div>

        <!-- Interactive input line / Static cursor -->
        <div class="prompt-line final-prompt">
          <template v-if="animationDone">
            <span class="prompt-text">$ </span>
            <span v-if="isDesktop" class="input-display">{{ inputText }}</span>
            <span
              class="cursor final-cursor"
              :class="{
                'cursor-blink':
                  !prefersReducedMotion &&
                  (terminalState === 'idle' || terminalState === 'typing') &&
                  inputFocused,
              }"
              >█</span
            >
          </template>
        </div>

        <!-- Hidden input for desktop keyboard capture -->
        <input
          v-if="isDesktop"
          ref="hiddenInputRef"
          v-model="inputText"
          class="hidden-input"
          type="text"
          aria-label="Terminal command input"
          :disabled="terminalState === 'executing' || terminalState === 'animating'"
          autocomplete="off"
          data-1p-ignore
          data-bwignore
          data-lpignore="true"
          data-form-type="other"
          autocorrect="off"
          autocapitalize="off"
          spellcheck="false"
          @keydown.enter.prevent="handleCommand"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
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
  position: relative;
  overflow: hidden;
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

.final-prompt {
  margin-top: 24px;
}

.input-display {
  font-family: var(--font-mono);
  font-weight: 500;
  font-size: 0.9375rem;
  color: var(--color-text);
  letter-spacing: 0.03em;
  white-space: pre;
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
}

/* Hidden input */
.hidden-input {
  position: absolute;
  opacity: 0;
  width: 1px;
  height: 1px;
  overflow: hidden;
  pointer-events: none;
}

/* Command history */
.command-history {
  margin-top: 24px;
}

.command-history .prompt-line {
  margin-bottom: 4px;
}

.output-line {
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-text-secondary, var(--color-text-muted));
  letter-spacing: 0.02em;
  margin-bottom: 8px;
  padding-left: 2px;
}

/* Content Box — FOUC prevention: hidden by default, GSAP reveals */
.content-box {
  border: 1px solid var(--color-border);
  border-radius: 4px;
  padding: 32px;
  margin: 16px 0 0;
  border-color: rgba(61, 72, 119, 0.6);
  opacity: 0;
  visibility: hidden;
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

/* Avatar — FOUC prevention */
.hero-avatar {
  flex-shrink: 0;
  opacity: 0;
  visibility: hidden;
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

/* Title — FOUC prevention */
.hero-title {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 1rem;
  color: var(--color-accent);
  text-transform: uppercase;
  letter-spacing: 0.01em;
  line-height: 1.4;
  margin: 0 0 20px;
  opacity: 0;
  visibility: hidden;
}

/* Intro — FOUC prevention */
.hero-intro {
  font-family: var(--font-sans);
  font-weight: 400;
  font-size: 0.9375rem;
  color: var(--color-text);
  opacity: 0;
  visibility: hidden;
  line-height: 1.7;
  margin: 0;
  text-align: justify;
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

  .content-box {
    padding: 20px;
  }

  .contact-box {
    padding: 12px 16px;
  }
}
</style>
