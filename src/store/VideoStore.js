import { defineStore } from 'pinia'
import { storeToRefs } from "pinia";
import { useDailyStore } from './DailyStore';

export const useVideoStore = defineStore('VideoStore', {
    state: () => {
        const DailyStore = useDailyStore()

        const { roomURL, callFrame } = storeToRefs(DailyStore)

        return {
            roomURL: roomURL,
            callFrame: callFrame,
            copyButtonText: "Copy URL",
            localVideoText: "Hide",
            remoteVideoText: "Hide",
        }
    },
    actions: {
        copyTextToClipboard() {
            if (!navigator.clipboard) {
                return;
            }

            navigator.clipboard.writeText(this.roomURL).then(
                () => {
                    this.copyButtonText = "Copied!";
                },
                (err) => {
                    console.error("Async: Could not copy text: ", err);
                }
            );
        },
        toggleCamera() {


            this.callFrame.setLocalVideo(!this.callFrame.localVideo());
        },
        toggleMic() {

            this.callFrame.setLocalAudio(!this.callFrame.localAudio());
        },
        toggleScreenShare() {

            const participants = this.callFrame.participants();
            if (participants?.local?.screen) {
                this.callFrame.stopScreenShare();
            } else {
                this.callFrame.startScreenShare();
            }
        },
        expandFullscreen() {

            this.callFrame.requestFullscreen();
        },
        toggleLocalVideo() {

            const hidden = !this.callFrame.showLocalVideo();
            this.localVideoText = hidden ? "Hide" : "Show";
            this.callFrame.setShowLocalVideo(hidden);
        },
        toggleRemoteParticipants() {

            const hidden = !this.callFrame.showParticipantsBar();
            this.remoteVideoText = hidden ? "Hide" : "Show";
            this.callFrame.setShowParticipantsBar(hidden);
        },
        leaveCall() {

            this.callFrame.leave().then(() => {
                this.callFrame.destroy()
                this.callFrame = null
                this.roomURL = ''
            });
        },
    }
})