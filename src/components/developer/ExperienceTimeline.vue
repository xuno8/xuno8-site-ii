<script setup lang="ts">
import { ref } from 'vue';
import gsap from 'gsap';
import type { WorkExperience, WorkRole } from '@/types';
import { useGsapContext } from '@/composables/useGsapContext';
import { useReducedMotion } from '@/composables/useReducedMotion';

defineProps<{
  experiences: WorkExperience[];
}>();

const sectionRef = ref<HTMLElement | null>(null);
const { prefersReducedMotion } = useReducedMotion();

useGsapContext(() => {
  if (prefersReducedMotion.value) return;
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: sectionRef.value!,
      start: 'top 80%',
    },
  });
  tl.from(sectionRef.value!.querySelectorAll('.timeline-item'), {
    opacity: 0,
    x: -60,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
  }).from(
    sectionRef.value!.querySelectorAll('.timeline-role'),
    {
      opacity: 0,
      y: 16,
      duration: 0.6,
      stagger: 0.12,
      ease: 'power2.out',
    },
    '-=0.5',
  );
}, sectionRef);

function formatDate(date: string): string {
  if (date === 'present') return 'Present';
  const [year, month] = date.split('-');
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
}

function toMonthIndex(date: string): number {
  if (date === 'present') {
    const now = new Date();
    return now.getFullYear() * 12 + now.getMonth();
  }
  const [year, month] = date.split('-');
  return parseInt(year, 10) * 12 + parseInt(month, 10) - 1;
}

/** Overall tenure at a company, e.g. { range: "Aug 2024 — Present", duration: "2 yrs 3 mos" } (LinkedIn-style, inclusive months) */
function companySpan(exp: WorkExperience): { range: string; duration: string } {
  const start = exp.roles[exp.roles.length - 1].startDate;
  const end = exp.roles[0].endDate;
  const months = toMonthIndex(end) - toMonthIndex(start) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts = [
    years ? `${years} yr${years > 1 ? 's' : ''}` : '',
    rest ? `${rest} mo${rest > 1 ? 's' : ''}` : '',
  ].filter(Boolean);
  return { range: `${formatDate(start)} — ${formatDate(end)}`, duration: parts.join(' ') };
}

function roleTextColor(r: WorkRole): string {
  return r.endDate === 'present' ? 'var(--color-text)' : 'var(--color-text-secondary)';
}

function isCurrent(exp: WorkExperience): boolean {
  return exp.roles[0].endDate === 'present';
}
</script>

<template>
  <section ref="sectionRef" class="py-16">
    <div class="max-w-4xl mx-auto px-4">
      <h2 class="text-3xl font-bold mb-10" style="color: var(--color-text-heading)">Experience</h2>
      <div class="relative">
        <!-- Timeline line -->
        <div
          class="absolute left-4 md:left-6 top-0 bottom-0 w-px"
          style="
            background: linear-gradient(
              to bottom,
              transparent,
              var(--color-accent) 10%,
              var(--color-accent) 90%,
              transparent
            );
          "
        />

        <div
          v-for="(exp, index) in experiences"
          :key="exp.company + index"
          class="relative pl-12 md:pl-16 pb-10 last:pb-0 timeline-item"
        >
          <!-- Timeline dot -->
          <div
            class="absolute left-2.5 md:left-4.5 top-7 w-3 h-3 rounded-full"
            :style="
              isCurrent(exp)
                ? 'background-color: var(--color-accent); box-shadow: 0 0 12px var(--color-accent), 0 0 0 4px var(--color-bg)'
                : 'background-color: var(--color-bg); border: 2px solid var(--color-accent); box-shadow: 0 0 0 4px var(--color-bg)'
            "
          />

          <div
            class="p-5 rounded-md"
            :style="{
              backgroundColor: 'var(--color-bg-card)',
              border: '1px solid var(--color-border)',
              opacity: isCurrent(exp) ? undefined : 0.85,
            }"
          >
            <!-- Company header -->
            <div class="flex flex-col sm:flex-row sm:items-baseline sm:justify-between mb-5">
              <h3
                class="text-xl font-semibold tracking-tight"
                style="color: var(--color-text-heading)"
              >
                {{ exp.company
                }}<span
                  v-if="exp.location"
                  class="text-sm ml-1.5"
                  style="color: var(--color-text-secondary); font-weight: 500"
                >
                  · {{ exp.location }}</span
                >
              </h3>
              <span
                class="text-sm mt-1 sm:mt-0"
                style="color: var(--color-text-secondary); font-family: var(--font-mono)"
              >
                {{ companySpan(exp).range }} ·
                <span style="color: var(--color-accent)">{{ companySpan(exp).duration }}</span>
              </span>
            </div>

            <!-- Roles sub-timeline -->
            <div
              v-for="(r, ri) in exp.roles"
              :key="r.role + r.startDate"
              class="relative pl-6 pb-6 last:pb-0 timeline-role"
            >
              <div
                v-if="ri < exp.roles.length - 1"
                class="absolute left-[5px] top-4 bottom-1 w-px"
                style="
                  background: linear-gradient(to bottom, var(--color-accent), var(--color-border));
                "
              />
              <div
                class="absolute left-0 top-1.5 w-[11px] h-[11px] rounded-full"
                :style="
                  r.endDate === 'present'
                    ? 'background-color: var(--color-accent); box-shadow: 0 0 8px var(--color-accent)'
                    : 'background-color: var(--color-bg-card); border: 2px solid var(--color-border-hover)'
                "
              />
              <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                <h4
                  class="text-base font-semibold"
                  :style="{
                    color:
                      r.endDate === 'present' ? 'var(--color-accent)' : 'var(--color-text-heading)',
                  }"
                >
                  {{ r.role }}
                </h4>
                <span
                  class="text-xs mt-1 sm:mt-0"
                  style="
                    color: var(--color-text-secondary);
                    font-family: var(--font-mono);
                    opacity: 0.8;
                  "
                >
                  {{ formatDate(r.startDate) }} — {{ formatDate(r.endDate) }}
                </span>
              </div>
              <ul
                v-if="Array.isArray(r.description)"
                class="text-sm leading-relaxed mb-3 list-disc pl-4 space-y-1"
                :style="{ color: roleTextColor(r) }"
              >
                <li v-for="(item, i) in r.description" :key="i">{{ item }}</li>
              </ul>
              <p v-else class="text-sm leading-relaxed mb-3" :style="{ color: roleTextColor(r) }">
                {{ r.description }}
              </p>
              <div v-if="r.technologies?.length" class="flex flex-wrap gap-2">
                <span
                  v-for="tech in r.technologies"
                  :key="tech"
                  class="text-xs px-2.5 py-1 rounded-full"
                  :style="
                    r.endDate === 'present'
                      ? 'background-color: var(--color-accent-subtle); color: var(--color-accent)'
                      : 'border: 1px solid var(--color-border); color: var(--color-text-secondary)'
                  "
                >
                  {{ tech }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
