import  { create }  from 'zustand'; // Corrected import
import { CreateAuthSlice } from './slices/auth-slice';

export const useAppStore = create()((...a) => ({
...CreateAuthSlice(...a),
}));