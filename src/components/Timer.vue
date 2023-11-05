<template>
  <ion-label :color="remaining > 0 ? 'tertiary' : 'warning'">{{
    remaining_formated
  }}</ion-label>
</template>

<script setup lang="ts">
import { IonLabel } from "@ionic/vue";
import { WatchStopHandle, computed, ref, watch } from "vue";
defineEmits(['timerFinish'])
const paused = ref<boolean>(false);

const remaining = ref<number>(0);
const remaining_formated = computed(() => {
  // Split input seconds into hours, minutes and seconds
  const rem = Math.abs(remaining.value); //remove sign to reduce complications with negative operations
  const hours = Math.floor(rem / 3600);
  const minutes = Math.floor((rem - hours * 3600) / 60);
  const seconds = rem - hours * 3600 - minutes * 60;

  // Append 0 if digit is < 10, e.g 9 -> 09
  const h = hours < 10 ? `0${hours}` : `${hours}`;
  const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const s = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return remaining.value >= 0 ? `${h}:${m}:${s}` : `-${h}:${m}:${s}`;
});

const interval = ref();
const start_timer = (duration: number) => {
  remaining.value = duration;
  interval.value = setInterval(() => {
    if (paused.value == false) remaining.value = remaining.value - 1;
  }, 1000);

  // Set the watcher here so it an be removed
  // Timer completion
  watcher.value = watch(remaining, () => {
    if (remaining.value <= 0) {
      watcher.value ? watcher.value() : {};
      remaining.value = 0;
    }
  });
};

const watcher = ref<WatchStopHandle | null>(null);
</script>
