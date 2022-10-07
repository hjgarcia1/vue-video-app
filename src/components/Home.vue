<template>
    <main class="mx-auto container p-20 bg-indigo-50 my-20 rounded-lg border border-indigo-200">
        <div class="home" v-if="status === 'home'">
            <h2 class="text-4xl text-indigo-900 font-semibold text-center mb-8">Daily Prebuilt demo</h2>
            <!-- <p class="mb-4">Start demo with a new unique room or paste in your own room URL</p> -->
            <p class="mb-4 font-semibold text-center">Start demo by pasting in your own room URL from Daily.co UI.</p>
            <div class="start-call-container">
                <div class="flex flex-col items-center gap-8">
                    <div class="w-2/5 mx-auto">
                        <input type="text" class="px-2 py-4 border border-indigo-200 rounded-lg w-full mx-auto" placeholder="Enter room URL..." v-model="roomUrl" pattern="^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$" @input="validateInput" />
                    </div>
                    <button @click="submitJoinRoom" :disabled="!validRoomURL" class="bg-indigo-500 text-xl text-white px-3 py-2 rounded border border-indigo-900 hover:bg-indigo-600 hover:border-indigo-800 cursor-pointer">
                        Join room
                    </button>
                </div>

            </div>
        </div>

        <div class="call-container" :class="{ hidden: status === 'home' }">
            <!-- The Daily Prebuilt iframe is embedded in the div below using the ref -->
            <div id="call" ref="callRef"></div>
            <!-- Only show the control panel if a call is live -->
            <controls v-if="status === 'call'" :roomUrl="roomUrl" :callFrame="callFrame" />
        </div>
    </main>
</template>

<script>
import DailyIframe from "@daily-co/daily-js";
import Controls from "./Controls.vue";

export default {
    components: { Controls },
    name: "Home",
    data() {
        return {
            roomUrl: "",
            status: "home",
            callFrame: null,
            validRoomURL: false,
            roomError: false,
            runningLocally: false,
        };
    },
    created() {
        if (window?.location?.origin.includes("localhost")) {
            this.runningLocally = true;
        }
    },
    methods: {
        createAndJoinRoom() {
            api
                .createRoom()
                .then((room) => {
                    this.roomUrl = room.url;
                    this.joinRoom(room.url);
                })
                .catch((e) => {
                    console.log(e);
                    this.roomError = true;
                });
        },
        // Daily callframe created and joined below
        joinRoom(url) {
            if (this.callFrame) {
                this.callFrame.destroy();
            }

            // Daily event callbacks
            const logEvent = (ev) => console.log(ev);
            const goToLobby = () => (this.status = "lobby");
            const goToCall = () => (this.status = "call");
            const leaveCall = () => {
                if (this.callFrame) {
                    this.status = "home";
                    this.callFrame.destroy();
                }
            };
            // DailyIframe container element
            const callWrapper = this.$refs.callRef;

            // Create Daily call
            const callFrame = DailyIframe.createFrame(callWrapper, {
                iframeStyle: {
                    height: "auto",
                    width: "100%",
                    aspectRatio: 16 / 9,
                    minWidth: "400px",
                    maxWidth: "920px",
                    border: "1px solid var(--grey)",
                    borderRadius: "4px",
                },
                showLeaveButton: true,
            });
            this.callFrame = callFrame;

            // Add event listeners and join call
            callFrame
                .on("loaded", logEvent)
                .on("started-camera", logEvent)
                .on("camera-error", logEvent)
                .on("joining-meeting", goToLobby)
                .on("joined-meeting", goToCall)
                .on("left-meeting", leaveCall);

            callFrame.join({ url });
        },
        submitJoinRoom() {
            this.joinRoom(this.roomUrl);
        },
        validateInput(e) {
            this.validRoomURL = !!this.roomUrl && e.target.checkValidity();
        },
    },
};
</script>
