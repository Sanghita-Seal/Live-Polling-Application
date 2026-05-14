import axiosClient from './../../api/axiosClient';
import { API_ENDPOINTS } from '../../api/endpoints.js';

// polls:{
//     create: "/polls",
//     myPolls: "/polls/my-polls",
//     byId: (pollId)=> `/polls/${pollId}`,
//     question: (pollId)=> `/polls/${pollId}/question`,
//     publicPoll: (shareCode)=> `public/polls/${shareCode}`,
//     vote: "/votes",
//     analytics: (analyticsCode)=> `public/analytics/${analyticsCode}`,
//   }
export const pollService ={
    createPoll(payload){
        return axiosClient.post(API_ENDPOINTS.polls.create, payload);
    },

    getMyPolls(){
        return axiosClient.get(API_ENDPOINTS.polls.myPolls);
    },
    getPollById(pollId){
        return axiosClient.get(API_ENDPOINTS.polls.byId(pollId));
    },
    updatePoll(pollId, payload){
        return axiosClient.patch(API_ENDPOINTS.polls.byId(pollId), payload);
    },
    createQuestion(pollId, payload){
        return axiosClient.post(API_ENDPOINTS.polls.question(pollId), payload);
    },
    getPublicPoll(shareCode) {
    return axiosClient.get(API_ENDPOINTS.polls.publicPoll(shareCode), {
      skipAuth: true,
      skipRefresh: true,
    });
  },

  submitVote(payload, options = {}) {
    return axiosClient.post(API_ENDPOINTS.polls.vote, payload, {
      skipAuth: Boolean(options.skipAuth),
      skipRefresh: Boolean(options.skipRefresh),
    });
  },

  getAnalytics(analyticsCode) {
    return axiosClient.get(API_ENDPOINTS.polls.analytics(analyticsCode), {
      skipAuth: true,
      skipRefresh: true,
    });
  },
};
