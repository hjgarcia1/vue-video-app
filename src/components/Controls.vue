<template>
    <div class="controls">
        <h2>Call overview</h2>
        <hr />
        <h3>Invite participants</h3>
        <label for="urlInput">Share URL below to invite others</label>
        <div>
            <input type="text" id="urlInput" :value="roomURL" />
            <button @click="store.copyTextToClipboard" class="teal">{{ copyButtonText }}</button>
        </div>
        <hr />
        <h3>Example custom controls</h3>
        <p>
            You can also create your own meeting controls using daily-js methods
        </p>
        <div>
            <button @click="store.toggleCamera">Toggle camera</button>
            <button @click="store.toggleMic">Toggle mic</button>
            <button @click="store.toggleScreenShare">Toggle screen share</button>
            <button @click="store.expandFullscreen">Expand fullscreen</button>
            <button @click="store.toggleLocalVideo">
                {{ localVideoText }} local video
            </button>
            <button @click="store.toggleRemoteParticipants">
                {{ remoteVideoText }} remote participants (Speaker view only)
            </button>
            <button @click="store.leaveCall">
                Leave call
            </button>
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useVideoStore } from '../store/VideoStore';
import { useDailyStore } from '../store/Dailystore';

const store = useVideoStore()
const DailyStore = useDailyStore()
const { copyButtonText, localVideoText, remoteVideoText } = storeToRefs(store)
const { roomURL } = storeToRefs(DailyStore)
</script>

<style scoped>
.controls {
    padding: 24px;
    text-align: left;
    max-width: 400px;
}

.controls h2,
.controls h3 {
    font-weight: bold;
    font-size: 16px;
    margin-top: 0px;
}

.controls p {
    font-size: 14px;
}

.controls label {
    font-size: 14px;
    margin-bottom: 8px;
}

.controls button {
    color: var(--dark-blue);
    background: var(--white);
    border: 1px solid var(--grey);
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 12px;
    line-height: 16px;
    font-weight: bold;
    cursor: pointer;
    margin-right: 4px;
    margin-bottom: 8px;
}

.controls button:active {
    background: var(--grey-lightest);
}

.controls button.teal {
    background: var(--teal);
    margin-bottom: 0;
    width: 100px;
}

.controls button.teal:active {
    opacity: 0.7;
}

.controls input {
    margin-right: 8px;
    margin-top: 8px;
    margin-bottom: 8px;
    height: 32px;
    border-radius: 8px;
    border: 1px solid var(--grey);
    min-width: 200px;
    padding: 0 8px;
}

.controls hr {
    border-top: 1px solid var(--grey);
}
</style>
