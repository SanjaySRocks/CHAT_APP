import  { create }  from 'zustand'; // Corrected import
import { CreateAuthSlice } from './slices/auth-slice';
import { creatChatSlice } from './slices/chat-slice';
export const useAppStore = create()((...a) => ({
...CreateAuthSlice(...a),
...creatChatSlice(...a),
}));