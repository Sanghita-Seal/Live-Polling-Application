import axiosClient from './../../api/axiosClient';

export const pollService ={
    createPoll(payload){
        return axiosClient.post("/polls", payload);
    },

    getMyPolls(){
        return axiosClient.get("/polls/my-polls");
    },
    getPollById(pollId){
        return axiosClient.get(`/polls/${pollId}`);
    },
    updatePoll(pollId, payload){
        return axiosClient.patch(`/polls/${pollId}`, payload);
    },
    createQuestion(pollId, payload){
        return axiosClient.post(`/polls/${pollId}/question`, payload);
    },
    getPublicPoll(shareCode) {
    return axiosClient.get(`/public/polls/${shareCode}`);
  },

  submitVote(payload) {
    return axiosClient.post("/votes", payload);
  },

  getAnalytics(analyticsCode) {
    return axiosClient.get(`/public/analytics/${analyticsCode}`);
  },
};