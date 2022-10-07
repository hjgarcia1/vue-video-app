import { defineStore } from 'pinia'
import DailyIframe from "@daily-co/daily-js";

export const useDailyStore = defineStore('DailyStore', {
    state: () => {
        return {
            roomURL: '',
            status: "home",
            callFrame: null,
            validRoomURL: false,
            roomError: false,
            runningLocally: false,
            callWrapper: null,
            urlError: ''
        }
    },
    actions: {
        // automatically infers the return type as a number
        createAndJoinRoom() {
            console.log('createRoom')
        },
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

            // Create Daily call
            const callFrame = DailyIframe.createFrame(this.callWrapper, {
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
            this.validateInput()

            if(this.validRoomURL === true) {
                this.joinRoom(this.roomURL);
            }
        },
        validateInput() {

            this.urlError = ''

            if (this.roomURL === '') {
                this.urlError = 'The URL submitted not present.'
                this.validRoomURL = false;

                return
            }

            if (/^(https:\/\/)?[\w.-]+(\.(daily\.(co)))+[\/\/]+[\w.-]+$/.test(this.roomURL) === false) {
                this.urlError = 'The URL submitted is invalid.'
                this.validRoomURL = false;

                return
            }

            this.validRoomURL = true
        },
    },
})