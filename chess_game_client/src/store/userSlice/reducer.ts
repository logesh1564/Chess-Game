import { produce } from "immer";
import { USER_DETAILS } from "./type";

export enum USER_DETAILS_REDUCER_ACTION_TYPE {
  UPDATE_NAME,
  UPDATE_USER_ID,
  UPDATE_ALL,
  UPDATE_CURRENT_GAME_ID,
}
export type USER_DETAILS_REDUCER_ACTION =
  | {
      type: USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_ALL;
      payload: USER_DETAILS;
    }
  | {
      type: USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_CURRENT_GAME_ID;
      payload: string;
    }
  | {
      type: USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_NAME;
      payload: string;
    }
  | {
      type: USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_USER_ID;
      payload: string | undefined;
    };

export const userDetailsReducer = (
  state: USER_DETAILS,
  action: USER_DETAILS_REDUCER_ACTION
): USER_DETAILS => {
  const { type, payload } = action;
  const updatedUserDetails = produce(state, (draftState) => {
    switch (type) {
      case USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_CURRENT_GAME_ID:
        draftState.currentGameId = payload;
        return draftState;
      case USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_NAME:
        draftState.username = payload;
        return draftState;
      case USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_USER_ID:
        draftState._id = payload;
        return draftState;
      case USER_DETAILS_REDUCER_ACTION_TYPE.UPDATE_ALL:
        return payload;
      default:
        return state;
    }
  });
  return updatedUserDetails;
};
