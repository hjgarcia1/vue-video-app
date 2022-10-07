<template>
    <main class="mx-auto container p-20 bg-indigo-50 my-20 rounded-lg border border-indigo-200">
        <div class="home" v-if="status === 'home'">

            <div class="bg-red-200 mb-4 border-red-500 border rounded px-2.5 py-3 text-red-800" v-if="urlError !== ''">
                {{urlError}}
            </div>


            <h2 class="text-4xl text-indigo-900 font-semibold text-center mb-8">Daily Prebuilt demo</h2>
            <!-- <p class="mb-4">Start demo with a new unique room or paste in your own room URL</p> -->
            <p class="mb-4 font-semibold text-center">Start demo by pasting in your own room URL from Daily.co UI.</p>
            <form @submit.prevent="store.submitJoinRoom" class="flex flex-col items-center gap-8">

                <div class="w-2/5 mx-auto">
                    <input type="text" class="px-2 py-4 border border-indigo-200 rounded-lg w-full mx-auto" placeholder="Enter room URL..." v-model="roomURL" />
                </div>
                <button type="submit" class="bg-indigo-500 text-xl text-white px-3 py-2 rounded border border-indigo-900 hover:bg-indigo-600 hover:border-indigo-800 cursor-pointer">
                    Join room
                </button>

            </form>
        </div>

        <div class="call-container" :class="{ hidden: status === 'home' }">
            <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
            <div id="call" ref="callRef"></div>
            <!-- Only show the control panel if a call is live -->
            <controls v-if="status === 'call'" :roomUrl="roomURL" :callFrame="callFrame" />
        </div>
    </main>
</template>

<script setup>
import { onMounted } from 'vue'
import { useDailyStore } from "../store/DailyStore"
import { storeToRefs } from "pinia";
import Controls from "./Controls.vue";


const store = useDailyStore()
const { roomURL, status, callFrame, validRoomURL, roomError, runningLocally, callWrapper, urlError } = storeToRefs(store)

onMounted(() => {
    callWrapper.value = document.getElementById('call')
})

</script>
