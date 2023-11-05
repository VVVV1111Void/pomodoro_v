<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <div class="timer">
        <ion-grid>
          <ion-row>
            <ion-col>
              <ion-label class="mode_label">{{ mode.toUpperCase() }}</ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col>
              <ion-label>{{ format_time(remaining) }}</ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <ion-modal>
        <PomodoroSetCreator></PomodoroSetCreator>
      </ion-modal>
    </ion-content>

    <ion-toolbar class="toolbar">
      <ion-buttons class="buttons">
        <ion-button @click="add_new_interval">SELECT</ion-button>
        <ion-button @click="begin_session">{{
          mode == "idle" ? "START" : "RESET"
        }}</ion-button>
        <ion-button>PAUSE</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  IonModal,
  IonToolbar,
  IonButtons,
  IonGrid,
  IonCol,
  IonRow,
} from "@ionic/vue";
import { WatchStopHandle, computed, ref, watch } from "vue";
import {
  format_time,
  convert_session_to_array,
  session_set,
} from "@/composables/timeutilities";
import PomodoroSetCreator from "@/components/PomodoroSetCreator.vue";
// Each pomodoro session in the set is represented in two forms. First, it is loaded and
// stored as an object for the UI to show and storage(WIP Features). When the session has been set and started,
// it will be converted into an array of minutes for the timer component to use.
const selected = ref<number>(0);
const session_set_selections = ref<session_set[]>([
  { pomodoros: 4, work_max_minutes: 25, rest_min_minutes: 5 },
]);

// This handles the transition between timers, which means it updates the current mode (work, rest etc.).
export type modes = "pomodoro" | "break" | "idle";
const mode = ref<modes>("idle");
const begin_session = () => {
  const selected_session = session_set_selections.value[selected.value];
  const arr = convert_session_to_array(selected_session);
  let index = 0;

  const timer_end_callback = () => {
    index++;
    if (index >= arr.length) {
      end_session();
    } else {
      mode.value =
      arr[index] == selected_session.work_max_minutes ? "pomodoro" : "break";
      new_timer(arr[index], timer_end_callback);
    }
  };
  new_timer(arr[index], timer_end_callback);
};

const remaining = ref<number>(0); // in seconds
const new_timer = (seconds: number, callback: Function) => {
  remaining.value = seconds;
  const cur_interval: number = setInterval(() => {
    if (remaining.value == 0) {
      callback();
      clearInterval(cur_interval);
    } else {
      remaining.value--;
    }
  }, 1000);
};

const end_session = () => {
  mode.value = "idle";
};

const add_new_interval = () => {};
</script>

<style scoped>
.sizer {
  max-width: 50vw;
  position: relative;
  left: 10vw;
  margin: 0vh 2vw;
}

.toolbar {
  position: relative;
  bottom: 0;
}

.buttons {
  min-width: 100%;
}

.buttons * {
  width: 33.3333%;
  /* min-width: 33.3333%; */
  /* max-width: 33.3333%; */
}

.timer {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-5%, -50%);
}
</style>
